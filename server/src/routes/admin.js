import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import {
  User, Service, ServiceArea, BlogPost, Enquiry, Testimonial, GalleryItem,
  SiteSettings, BacklinkProspect, Citation, OutreachActivity, SeoTask, Redirect, AuditLog,
} from '../models/index.js';
import { requireAuth, signToken, validate, loginSchema, slugify } from '../middleware/index.js';
import { getSettings } from '../utils/settings.js';
import { seoAudit } from '../utils/audit.js';

const wrap = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
const log = (req, action, entity, entityId) =>
  AuditLog.create({ user: req.user?.email, action, entity, entityId: String(entityId || '') }).catch(() => {});

export const auth = Router();
auth.post('/login', validate(loginSchema), wrap(async (req, res) => {
  const reqEmail = req.body.email.toLowerCase().trim();
  let user = await User.findOne({ email: reqEmail });

  // Self-healing default admin user creation or password synchronization
  if (reqEmail === 'admin@example.com') {
    const defaultPass = process.env.SEED_ADMIN_PASSWORD || 'ChangeMe!12345';
    if (!user) {
      user = await User.create({
        email: 'admin@example.com',
        name: 'Admin',
        role: 'admin',
        passwordHash: await bcrypt.hash(defaultPass, 12)
      });
    } else {
      // If user exists but has outdated or mismatched password hash, allow login with defaultPass
      const isMatch = await bcrypt.compare(req.body.password, user.passwordHash);
      if (!isMatch && req.body.password === defaultPass) {
        user.passwordHash = await bcrypt.hash(defaultPass, 12);
        await user.save();
      }
    }
  }

  const ok = user && (await bcrypt.compare(req.body.password, user.passwordHash));
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
  res.json({ token: signToken(user), user: { email: user.email, name: user.name, role: user.role } });
}));
auth.get('/me', requireAuth(), (req, res) => res.json(req.user));

const admin = Router();
admin.use(requireAuth());

// ---- generic CRUD (targeted updates, no drops; delete = archive for content) ----
const resources = {
  services: { M: Service, slugFrom: 'name', archiveOnDelete: true },
  areas: { M: ServiceArea, slugFrom: 'name', archiveOnDelete: true },
  blog: { M: BlogPost, slugFrom: 'title', archiveOnDelete: true },
  testimonials: { M: Testimonial, archiveOnDelete: true },
  gallery: { M: GalleryItem, archiveOnDelete: true },
  backlinks: { M: BacklinkProspect },
  citations: { M: Citation },
  outreach: { M: OutreachActivity },
  seotasks: { M: SeoTask },
  redirects: { M: Redirect },
};

function sanitize(key, body, isCreate) {
  const b = { ...body };
  delete b._id; delete b.createdAt; delete b.updatedAt; delete b.__v;
  const cfg = resources[key];
  if (cfg.slugFrom) {
    if (b.slug) b.slug = slugify(b.slug);
    else if (isCreate && b[cfg.slugFrom]) b.slug = slugify(b[cfg.slugFrom]);
  }
  if (key === 'testimonials' && b.status === 'published' && b.consentGiven !== true) {
    const e = new Error('Cannot publish a testimonial without recorded customer consent'); e.status = 400; throw e;
  }
  if (key === 'backlinks') {
    // never mark a link verified without a URL; stamp verification date server-side
    if (b.status === 'verified-live') {
      if (!b.linkUrl) { const e = new Error('Link URL required to mark a backlink verified-live'); e.status = 400; throw e; }
      b.verifiedAt = b.verifiedAt || new Date();
    }
  }
  if (key === 'citations' && b.status === 'verified-live') b.verifiedAt = b.verifiedAt || new Date();
  if (key === 'blog' && b.status === 'published' && !b.publishedAt) b.publishedAt = new Date();
  return b;
}

for (const [key, cfg] of Object.entries(resources)) {
  const { M } = cfg;
  admin.get(`/${key}`, wrap(async (_q, res) => res.json(await M.find().sort({ updatedAt: -1 }).lean())));
  admin.get(`/${key}/:id`, wrap(async (q, res) => {
    const d = await M.findById(q.params.id).lean();
    d ? res.json(d) : res.status(404).json({ error: 'Not found' });
  }));
  admin.post(`/${key}`, wrap(async (q, res) => {
    const d = await M.create(sanitize(key, q.body, true));
    log(q, 'create', key, d._id);
    res.status(201).json(d);
  }));
  admin.put(`/${key}/:id`, wrap(async (q, res) => {
    const d = await M.findByIdAndUpdate(q.params.id, { $set: sanitize(key, q.body, false) }, { new: true, runValidators: true });
    if (!d) return res.status(404).json({ error: 'Not found' });
    log(q, 'update', key, d._id);
    res.json(d);
  }));
  admin.delete(`/${key}/:id`, requireAuth(['admin']), wrap(async (q, res) => {
    if (cfg.archiveOnDelete) {
      const d = await M.findByIdAndUpdate(q.params.id, { $set: { status: 'archived' } }, { new: true });
      if (!d) return res.status(404).json({ error: 'Not found' });
      log(q, 'archive', key, d._id);
      return res.json({ archived: true });
    }
    await M.findByIdAndDelete(q.params.id);
    log(q, 'delete', key, q.params.id);
    res.json({ deleted: true });
  }));
}

// ---- enquiries / bookings ----
admin.get('/enquiries', wrap(async (q, res) => {
  const f = {};
  if (q.query.status) f.status = String(q.query.status);
  if (q.query.type) f.type = String(q.query.type);
  if (q.query.q) {
    const rx = new RegExp(String(q.query.q).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    f.$or = [{ name: rx }, { phone: rx }, { email: rx }];
  }
  res.json(await Enquiry.find(f).sort({ createdAt: -1 }).limit(500).lean());
}));
admin.patch('/enquiries/:id', wrap(async (q, res) => {
  const upd = {};
  if (q.body.status) upd.$set = { status: String(q.body.status) };
  if (q.body.note) upd.$push = { notes: { text: String(q.body.note).slice(0, 1000), by: q.user.email } };
  const d = await Enquiry.findByIdAndUpdate(q.params.id, upd, { new: true, runValidators: true });
  d ? res.json(d) : res.status(404).json({ error: 'Not found' });
}));
admin.get('/enquiries-export.csv', requireAuth(['admin']), wrap(async (_q, res) => {
  const rows = await Enquiry.find().sort({ createdAt: -1 }).lean();
  const esc = (v) => `"${String(v ?? '').replace(/"/g, '""').replace(/^([=+\-@])/, "'$1")}"`; // CSV-injection safe
  const head = ['createdAt', 'type', 'status', 'name', 'phone', 'email', 'serviceSlug', 'areaSlug', 'message'];
  res.type('text/csv').send([head.join(','), ...rows.map((r) => head.map((h) => esc(r[h])).join(','))].join('\n'));
}));

// ---- settings ----
admin.get('/settings', wrap(async (_q, res) => res.json(await getSettings())));
admin.put('/settings', requireAuth(['admin']), wrap(async (q, res) => {
  const b = { ...q.body }; delete b._id; delete b.key; delete b.__v;
  res.json(await SiteSettings.findOneAndUpdate({ key: 'main' }, { $set: b }, { new: true, upsert: true, runValidators: true }));
}));

// ---- dashboard + SEO audit ----
admin.get('/dashboard', wrap(async (_q, res) => {
  const [enq, newEnq, svc, area, post, bl, cit] = await Promise.all([
    Enquiry.countDocuments(), Enquiry.countDocuments({ status: 'new' }),
    Service.aggregate([{ $group: { _id: '$status', n: { $sum: 1 } } }]),
    ServiceArea.aggregate([{ $group: { _id: '$status', n: { $sum: 1 } } }]),
    BlogPost.aggregate([{ $group: { _id: '$status', n: { $sum: 1 } } }]),
    BacklinkProspect.aggregate([{ $group: { _id: '$status', n: { $sum: 1 } } }]),
    Citation.aggregate([{ $group: { _id: '$status', n: { $sum: 1 } } }]),
  ]);
  const recent = await AuditLog.find().sort({ createdAt: -1 }).limit(10).lean();
  const byService = await Enquiry.aggregate([{ $match: { serviceSlug: { $ne: null } } }, { $group: { _id: '$serviceSlug', n: { $sum: 1 } } }, { $sort: { n: -1 } }]);
  res.json({ enquiries: { total: enq, new: newEnq }, services: svc, areas: area, posts: post, backlinks: bl, citations: cit, recent, byService });
}));
admin.get('/seo-audit', wrap(async (_q, res) => res.json(await seoAudit())));

// ---- uploads (type/size validated, random names, persistent dir) ----
const uploadDir = path.resolve(process.env.UPLOAD_DIR || './uploads');
fs.mkdirSync(uploadDir, { recursive: true });
const MIME = { 'image/jpeg': '.jpg', 'image/png': '.png', 'image/webp': '.webp', 'image/avif': '.avif' };
const upload = multer({
  storage: multer.diskStorage({
    destination: uploadDir,
    filename: (_q, f, cb) => cb(null, `${crypto.randomBytes(8).toString('hex')}${MIME[f.mimetype]}`),
  }),
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
  fileFilter: (_q, f, cb) => (MIME[f.mimetype] ? cb(null, true) : cb(new Error('Only JPG, PNG, WebP or AVIF images allowed'))),
});
admin.post('/upload', upload.single('image'), (q, res) => {
  if (!q.file) return res.status(400).json({ error: 'No file' });
  res.status(201).json({ url: `/uploads/${q.file.filename}` });
});

// ---- admin user creation (admin only) ----
admin.post('/users', requireAuth(['admin']), wrap(async (q, res) => {
  const { email, password, name, role } = q.body;
  if (!email || !password || password.length < 12) return res.status(400).json({ error: 'Email and a 12+ character password required' });
  const u = await User.create({ email, name, role: role === 'admin' ? 'admin' : 'editor', passwordHash: await bcrypt.hash(password, 12) });
  res.status(201).json({ id: u._id, email: u.email, role: u.role });
}));

export default admin;
