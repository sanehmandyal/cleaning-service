import jwt from 'jsonwebtoken';
import { z } from 'zod';

export const signToken = (user) =>
  jwt.sign({ id: user._id, role: user.role, email: user.email }, process.env.JWT_SECRET, { expiresIn: '8h' });

export function requireAuth(roles = ['admin', 'editor']) {
  return (req, res, next) => {
    const h = req.headers.authorization || '';
    const token = h.startsWith('Bearer ') ? h.slice(7) : null;
    if (!token) return res.status(401).json({ error: 'Authentication required' });
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      if (!roles.includes(payload.role)) return res.status(403).json({ error: 'Forbidden' });
      req.user = payload;
      next();
    } catch {
      res.status(401).json({ error: 'Invalid or expired token' });
    }
  };
}

export const validate = (schema) => (req, res, next) => {
  const r = schema.safeParse(req.body);
  if (!r.success) return res.status(400).json({ error: 'Validation failed', details: r.error.flatten().fieldErrors });
  req.body = r.data;
  next();
};

export const slugify = (s = '') =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  if (err?.code === 11000) return res.status(409).json({ error: 'Duplicate value (e.g. slug already exists)', fields: err.keyValue });
  if (err?.name === 'ValidationError') return res.status(400).json({ error: err.message });
  if (err?.name === 'CastError') return res.status(400).json({ error: 'Invalid id' });
  if (err?.name === 'MulterError' || err?.message?.startsWith('Only JPG')) return res.status(400).json({ error: err.message });
  console.error('[error]', err?.message); // no secrets / customer data logged
  res.status(err.status || 500).json({ error: err.status ? err.message : 'Server error' });
}

export const enquirySchema = z.object({
  type: z.enum(['booking', 'quote', 'contact']).default('contact'),
  name: z.string().trim().min(2).max(120),
  phone: z.string().trim().regex(/^[0-9+\-\s()]{7,20}$/, 'Invalid phone'),
  email: z.string().trim().email().max(200).optional().or(z.literal('')),
  serviceSlug: z.string().max(100).optional(),
  areaSlug: z.string().max(100).optional(),
  preferredDate: z.string().max(40).optional(),
  message: z.string().max(3000).optional(),
  sourcePage: z.string().max(300).optional(),
  website: z.string().max(0).optional(), // honeypot: must stay empty
});

export const loginSchema = z.object({ email: z.string().email(), password: z.string().min(8).max(200) });
