import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import { Service, ServiceArea, BlogPost, Redirect } from '../models/index.js';
import { getSettings } from '../utils/settings.js';

const router = Router();
const esc = (s = '') => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const siteUrl = () => (process.env.SITE_URL || '').replace(/\/$/, '');

const STATIC = {
  '/': { title: null, desc: null, h1: null },
  '/about': { title: 'About Us', desc: 'Learn about our cleaning team, how we work and the standards we follow.', h1: 'About Us' },
  '/services': { title: 'Cleaning Services', desc: 'Browse our residential, commercial and specialist cleaning services.', h1: 'Our Cleaning Services' },
  '/service-areas': { title: 'Service Areas', desc: 'See the areas where we provide cleaning services and how to book.', h1: 'Areas We Serve' },
  '/gallery': { title: 'Project Gallery', desc: 'Photos from our cleaning projects.', h1: 'Project Gallery' },
  '/reviews': { title: 'Customer Reviews', desc: 'Feedback shared by our customers.', h1: 'Customer Reviews' },
  '/faqs': { title: 'Frequently Asked Questions', desc: 'Answers to common questions about our cleaning services.', h1: 'Frequently Asked Questions' },
  '/contact': { title: 'Contact Us', desc: 'Call, WhatsApp or send an enquiry to request a cleaning service.', h1: 'Contact Us' },
  '/book-cleaning': { title: 'Book a Cleaning', desc: 'Request a cleaning booking and we will confirm the details with you.', h1: 'Book a Cleaning' },
  '/get-a-quote': { title: 'Get a Free Quote', desc: 'Tell us about your property and get a free cleaning quote.', h1: 'Get a Free Quote' },
  '/blog': { title: 'Cleaning Tips & Guides', desc: 'Practical cleaning guides and checklists.', h1: 'Cleaning Tips & Guides' },
  '/pricing': { title: 'Transparent Pricing & Packages', desc: 'View our straightforward cleaning prices, packages, and recurring service discounts.', h1: 'Cleaning Prices & Packages' },
  '/why-choose-us': { title: 'Why Choose Us & Our Guarantee', desc: 'Our 100% satisfaction guarantee, vetted cleaning professionals, and 50-point cleaning standards.', h1: 'Why Choose Us' },
  '/privacy-policy': { title: 'Privacy Policy', desc: 'How we handle your personal information.', h1: 'Privacy Policy' },
  '/terms-and-conditions': { title: 'Terms and Conditions', desc: 'Terms that apply to our cleaning services.', h1: 'Terms and Conditions' },
};
const NOINDEX_PREFIX = ['/admin'];

async function resolvePage(p, s) {
  const base = siteUrl();
  const brand = s.businessName;
  const crumbs = [{ name: 'Home', url: base + '/' }];
  let page = null; let jsonld = []; let body = '';
  const m = p.match(/^\/(services|service-areas|blog)\/([a-z0-9-]+)$/);

  if (m) {
    const [, kind, slug] = m;
    const Model = kind === 'services' ? Service : kind === 'service-areas' ? ServiceArea : BlogPost;
    const d = await Model.findOne({ slug, status: 'published', ...(kind === 'blog' ? { publishedAt: { $lte: new Date() } } : {}) }).lean();
    if (!d) return { status: 404, title: 'Page not found', desc: '', noindex: true, body: '<h1>Page not found</h1>', jsonld: [], canonical: null };
    const name = d.name || d.title;
    crumbs.push({ name: kind === 'services' ? 'Services' : kind === 'blog' ? 'Blog' : 'Service Areas', url: `${base}/${kind}` }, { name, url: `${base}/${kind}/${slug}` });
    page = {
      title: d.metaTitle || `${name} | ${brand}`, desc: d.metaDescription || d.summary || d.excerpt || d.intro || '',
      canonical: d.canonicalUrl || `${base}${p}`, noindex: d.noindex, img: d.heroImage,
    };
    body = `<h1>${esc(name)}</h1><p>${esc(d.summary || d.excerpt || d.intro || '')}</p>` +
      String(d.content || d.localContent || '').split(/\n{2,}/).filter(Boolean).map((x) => `<p>${esc(x)}</p>`).join('') +
      ((d.inclusions || []).length ? `<h2>What's included</h2><ul>${d.inclusions.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>` : '') +
      ((d.faqs || []).length ? `<h2>FAQs</h2>${d.faqs.map((f) => `<h3>${esc(f.q)}</h3><p>${esc(f.a)}</p>`).join('')}` : '');
    if (kind === 'services') {
      jsonld.push({ '@context': 'https://schema.org', '@type': 'Service', name, description: d.summary || page.desc, provider: { '@type': 'LocalBusiness', name: brand, url: base }, url: page.canonical });
    }
    if (kind === 'blog') {
      jsonld.push({ '@context': 'https://schema.org', '@type': 'BlogPosting', headline: d.title, description: page.desc, datePublished: d.publishedAt, dateModified: d.updatedAt, author: { '@type': 'Organization', name: d.author || brand }, mainEntityOfPage: page.canonical });
    }
  } else if (p === '/') {
    page = { title: s.homeMetaTitle || `${brand} | ${s.tagline}`, desc: s.homeMetaDescription || s.tagline, canonical: base + '/' };
    body = `<h1>${esc(brand)}</h1><p>${esc(s.tagline)}</p>`;
    const [svcs, areas] = await Promise.all([Service.find({ status: 'published' }).sort({ sortOrder: 1 }).lean(), ServiceArea.find({ status: 'published' }).sort({ sortOrder: 1 }).lean()]);
    body += `<h2>Services</h2><ul>${svcs.map((x) => `<li><a href="/services/${x.slug}">${esc(x.name)}</a></li>`).join('')}</ul>`;
    body += `<h2>Service areas</h2><ul>${areas.map((x) => `<li><a href="/service-areas/${x.slug}">${esc(x.name)}</a></li>`).join('')}</ul>`;
    jsonld.push({ '@context': 'https://schema.org', '@type': 'WebSite', name: brand, url: base });
  } else if (STATIC[p]) {
    const st = STATIC[p];
    page = { title: `${st.title} | ${brand}`, desc: st.desc, canonical: base + p };
    body = `<h1>${esc(st.h1)}</h1><p>${esc(st.desc)}</p>`;
    if (p === '/services') { const l = await Service.find({ status: 'published' }).sort({ sortOrder: 1 }).lean(); body += `<ul>${l.map((x) => `<li><a href="/services/${x.slug}">${esc(x.name)}</a></li>`).join('')}</ul>`; }
    if (p === '/service-areas') { const l = await ServiceArea.find({ status: 'published' }).sort({ sortOrder: 1 }).lean(); body += `<ul>${l.map((x) => `<li><a href="/service-areas/${x.slug}">${esc(x.name)}</a></li>`).join('')}</ul>`; }
    if (p === '/blog') { const l = await BlogPost.find({ status: 'published', publishedAt: { $lte: new Date() } }).lean(); body += `<ul>${l.map((x) => `<li><a href="/blog/${x.slug}">${esc(x.title)}</a></li>`).join('')}</ul>`; }
    crumbs.push({ name: st.title, url: base + p });
    // Thin utility pages: keep out of the index
    if (['/book-cleaning', '/get-a-quote'].includes(p)) page.noindex = false;
  } else {
    return { status: 404, title: 'Page not found', desc: '', noindex: true, body: '<h1>Page not found</h1>', jsonld: [], canonical: null };
  }

  if (crumbs.length > 1) {
    jsonld.push({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: crumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: c.url })) });
  }
  if (p === '/' || p === '/contact') {
    // Only emit business facts that actually exist in settings
    const lb = { '@context': 'https://schema.org', '@type': 'HomeAndConstructionBusiness', name: brand, url: base };
    if (s.phone) lb.telephone = s.phone;
    if (s.email) lb.email = s.email;
    if (s.logo) lb.logo = base + s.logo;
    if (s.addressLine) lb.address = { '@type': 'PostalAddress', streetAddress: s.addressLine };
    const sameAs = Object.values(s.social?.toObject?.() || s.social || {}).filter(Boolean);
    if (sameAs.length) lb.sameAs = sameAs;
    jsonld.push(lb);
  }
  return { status: 200, ...page, body, jsonld };
}

export async function renderHtml(req, template) {
  const p = req.path.length > 1 ? req.path.replace(/\/+$/, '') : req.path;
  const s = await getSettings();
  if (NOINDEX_PREFIX.some((x) => p.startsWith(x))) {
    return { status: 200, html: template.replace('<!--SEO_HEAD-->', '<title>Admin</title><meta name="robots" content="noindex,nofollow">').replace('<!--SEO_BODY-->', '') };
  }
  const r = await resolvePage(p, s);
  const base = siteUrl();
  const noindex = r.noindex || r.status === 404;
  const ogImg = r.img || s.defaultOgImage;
  const head = [
    `<title>${esc(r.title)}</title>`,
    r.desc && `<meta name="description" content="${esc(r.desc)}">`,
    r.canonical && `<link rel="canonical" href="${esc(r.canonical)}">`,
    noindex && '<meta name="robots" content="noindex,follow">',
    `<meta property="og:title" content="${esc(r.title)}">`,
    r.desc && `<meta property="og:description" content="${esc(r.desc)}">`,
    `<meta property="og:type" content="website">`,
    r.canonical && `<meta property="og:url" content="${esc(r.canonical)}">`,
    ogImg && `<meta property="og:image" content="${esc(ogImg.startsWith('http') ? ogImg : base + ogImg)}">`,
    s.analytics?.gscVerification && `<meta name="google-site-verification" content="${esc(s.analytics.gscVerification)}">`,
    ...r.jsonld.map((j) => `<script type="application/ld+json">${JSON.stringify(j).replace(/</g, '\\u003c')}</script>`),
    s.analytics?.ga4Id && /^G-[A-Z0-9]+$/.test(s.analytics.ga4Id) && `<script async src="https://www.googletagmanager.com/gtag/js?id=${s.analytics.ga4Id}"></script><script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${s.analytics.ga4Id}');</script>`,
  ].filter(Boolean).join('\n');
  const html = template.replace('<!--SEO_HEAD-->', head).replace('<!--SEO_BODY-->', r.body);
  return { status: r.status, html };
}

export function seoRouter(clientDist) {
  const indexPath = path.join(clientDist, 'index.html');

  router.get('/robots.txt', (_q, res) => {
    res.type('text/plain').send(`User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api/\n\nSitemap: ${siteUrl()}/sitemap.xml\n`);
  });

  router.get('/sitemap.xml', async (_q, res, next) => {
    try {
      const base = siteUrl();
      const [svc, area, blog] = await Promise.all([
        Service.find({ status: 'published', noindex: { $ne: true } }).select('slug updatedAt canonicalUrl').lean(),
        ServiceArea.find({ status: 'published', noindex: { $ne: true } }).select('slug updatedAt canonicalUrl').lean(),
        BlogPost.find({ status: 'published', noindex: { $ne: true }, publishedAt: { $lte: new Date() } }).select('slug updatedAt canonicalUrl').lean(),
      ]);
      const self = (d, url) => !d.canonicalUrl || d.canonicalUrl === url; // exclude pages canonicalised elsewhere
      const urls = [
        ...Object.keys(STATIC).filter((x) => !['/privacy-policy', '/terms-and-conditions'].includes(x)).map((x) => ({ loc: base + (x === '/' ? '/' : x) })),
        ...svc.map((d) => ({ loc: `${base}/services/${d.slug}`, d })),
        ...area.map((d) => ({ loc: `${base}/service-areas/${d.slug}`, d })),
        ...blog.map((d) => ({ loc: `${base}/blog/${d.slug}`, d })),
      ].filter((u) => !u.d || self(u.d, u.loc));
      const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
        urls.map((u) => `<url><loc>${esc(u.loc)}</loc>${u.d ? `<lastmod>${new Date(u.d.updatedAt).toISOString().slice(0, 10)}</lastmod>` : ''}</url>`).join('\n') + '\n</urlset>';
      res.set('Cache-Control', 'no-cache').type('application/xml').send(xml);
    } catch (e) { next(e); }
  });

  // DB-managed 301 redirects
  router.use(async (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads') || req.path.startsWith('/assets')) return next();
    try {
      const r = await Redirect.findOne({ from: req.path }).lean();
      if (r) return res.redirect(r.code || 301, r.to);
    } catch { /* ignore */ }
    next();
  });

  // HTML pages with injected head + crawlable content snapshot
  router.get('*', async (req, res, next) => {
    if (req.path.startsWith('/api') || path.extname(req.path)) return next();
    if (!fs.existsSync(indexPath)) return res.status(503).send('Client not built. Run: npm run build in /client');
    try {
      const { status, html } = await renderHtml(req, fs.readFileSync(indexPath, 'utf8'));
      res.status(status).set('Cache-Control', 'no-cache').type('html').send(html);
    } catch (e) { next(e); }
  });
  return router;
}
