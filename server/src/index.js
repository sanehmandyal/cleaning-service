import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import mongoSanitize from 'express-mongo-sanitize';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';
import publicRoutes from './routes/public.js';
import adminRoutes, { auth } from './routes/admin.js';
import { seoRouter } from './routes/seo.js';
import { errorHandler } from './middleware/index.js';

for (const k of ['MONGODB_URI', 'JWT_SECRET', 'SITE_URL']) {
  if (!process.env[k]) { console.error(`Missing required env var ${k}`); process.exit(1); }
}
if (process.env.JWT_SECRET.length < 24) { console.error('JWT_SECRET must be at least 24 characters'); process.exit(1); }

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
app.set('trust proxy', 1);
app.use(helmet({
  contentSecurityPolicy: {
    useDefaults: true,
    directives: {
      'img-src': ["'self'", 'data:', 'https:'],
      'script-src': ["'self'", "'unsafe-inline'", 'https://www.googletagmanager.com'],
      'connect-src': ["'self'", 'https://www.google-analytics.com', 'https://*.google-analytics.com'],
      'frame-src': ['https://www.google.com'],
    },
  },
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));
app.use(compression());

const origins = (process.env.CORS_ORIGINS || '').split(',').map((s) => s.trim()).filter(Boolean);
app.use('/api', cors({ origin: (o, cb) => cb(null, !o || origins.includes(o)) }));
app.use(express.json({ limit: '1mb' }));
app.use(mongoSanitize());

// Preferred-domain + HTTPS redirect in production
if (process.env.NODE_ENV === 'production') {
  const canon = new URL(process.env.SITE_URL);
  app.use((req, res, next) => {
    if (req.path === '/healthz') return next();
    const host = req.headers.host;
    if (req.protocol !== 'https' || (host && host !== canon.host)) return res.redirect(301, `${canon.origin}${req.originalUrl}`);
    next();
  });
}

app.get('/healthz', (_q, res) => res.json({ ok: true, db: mongoose.connection.readyState === 1 }));
app.use('/api/auth', rateLimit({ windowMs: 15 * 60 * 1000, limit: 10, standardHeaders: true, legacyHeaders: false }), auth);
app.use('/api/admin', adminRoutes);
app.use('/api/public', publicRoutes);
app.use('/api', (_q, res) => res.status(404).json({ error: 'Not found' }));

app.use('/uploads', express.static(path.resolve(process.env.UPLOAD_DIR || './uploads'), { maxAge: '30d', immutable: true }));

const clientDist = path.resolve(__dirname, '..', process.env.CLIENT_DIST || '../client/dist');
app.use('/assets', express.static(path.join(clientDist, 'assets'), { maxAge: '1y', immutable: true }));
app.use('/images', express.static(path.join(clientDist, 'images'), { maxAge: '30d' }));
app.use(express.static(clientDist, { index: false, maxAge: '1h' }));
app.use(seoRouter(clientDist));
app.use(errorHandler);

await mongoose.connect(process.env.MONGODB_URI);
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server on :${port}`));
