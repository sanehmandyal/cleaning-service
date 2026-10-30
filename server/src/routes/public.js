import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { Service, ServiceArea, BlogPost, Enquiry, Testimonial, GalleryItem } from '../models/index.js';
import { validate, enquirySchema } from '../middleware/index.js';
import { getSettings } from '../utils/settings.js';

const r = Router();
r.use((req, res, next) => { res.set('Cache-Control', 'no-cache'); next(); }); // always revalidate => admin edits show everywhere

const pub = { status: 'published' };
const wrap = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

r.get('/settings', wrap(async (_q, res) => {
  const s = (await getSettings()).toObject();
  delete s.analytics?.gscVerification; // not needed client-side beyond head injection
  res.json(s);
}));

r.get('/services', wrap(async (_q, res) => res.json(await Service.find(pub).sort({ sortOrder: 1, name: 1 }).lean())));
r.get('/services/:slug', wrap(async (q, res) => {
  const d = await Service.findOne({ slug: q.params.slug, ...pub }).lean();
  d ? res.json(d) : res.status(404).json({ error: 'Not found' });
}));
r.get('/areas', wrap(async (_q, res) => res.json(await ServiceArea.find(pub).sort({ sortOrder: 1, name: 1 }).lean())));
r.get('/areas/:slug', wrap(async (q, res) => {
  const d = await ServiceArea.findOne({ slug: q.params.slug, ...pub }).lean();
  d ? res.json(d) : res.status(404).json({ error: 'Not found' });
}));
r.get('/blog', wrap(async (_q, res) => res.json(await BlogPost.find({ ...pub, publishedAt: { $lte: new Date() } }).sort({ publishedAt: -1 }).select('-content').lean())));
r.get('/blog/:slug', wrap(async (q, res) => {
  const d = await BlogPost.findOne({ slug: q.params.slug, ...pub, publishedAt: { $lte: new Date() } }).lean();
  d ? res.json(d) : res.status(404).json({ error: 'Not found' });
}));
// Only genuine, consented testimonials are public
r.get('/testimonials', wrap(async (_q, res) => res.json(await Testimonial.find({ ...pub, consentGiven: true }).sort({ createdAt: -1 }).lean())));
r.get('/gallery', wrap(async (_q, res) => res.json(await GalleryItem.find(pub).sort({ createdAt: -1 }).lean())));

const formLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 10, standardHeaders: true, legacyHeaders: false });
r.post('/enquiries', formLimiter, validate(enquirySchema), wrap(async (q, res) => {
  const { website, ...data } = q.body;
  if (website) return res.status(201).json({ ok: true }); // bot honeypot: silently drop
  const doc = await Enquiry.create(data);
  res.status(201).json({ ok: true, id: doc._id });
}));

export default r;
