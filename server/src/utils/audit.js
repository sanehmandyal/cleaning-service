import { Service, ServiceArea, BlogPost, Redirect } from '../models/index.js';

// Real checks against stored content. Nothing here is invented.
export async function seoAudit() {
  const [services, areas, posts] = await Promise.all([
    Service.find({ status: 'published' }).lean(),
    ServiceArea.find({ status: 'published' }).lean(),
    BlogPost.find({ status: 'published' }).lean(),
  ]);
  const items = [
    ...services.map((d) => ({ type: 'service', ...d, path: `/services/${d.slug}` })),
    ...areas.map((d) => ({ type: 'area', ...d, path: `/service-areas/${d.slug}` })),
    ...posts.map((d) => ({ type: 'blog', ...d, path: `/blog/${d.slug}` })),
  ];
  const issues = [];
  const titles = new Map(); const descs = new Map();
  for (const d of items) {
    const title = d.metaTitle || ''; const desc = d.metaDescription || '';
    if (!title) issues.push({ path: d.path, issue: 'Missing meta title' });
    else if (title.length > 65) issues.push({ path: d.path, issue: `Meta title long (${title.length} chars) — may truncate` });
    if (!desc) issues.push({ path: d.path, issue: 'Missing meta description' });
    else if (desc.length > 170) issues.push({ path: d.path, issue: `Meta description long (${desc.length} chars)` });
    if (!d.heroImage) issues.push({ path: d.path, issue: 'No hero image' });
    else if (!d.heroImageAlt) issues.push({ path: d.path, issue: 'Hero image missing alt text' });
    if (d.noindex) issues.push({ path: d.path, issue: 'Page is set to noindex (excluded from sitemap)' });
    if (title) titles.set(title, [...(titles.get(title) || []), d.path]);
    if (desc) descs.set(desc, [...(descs.get(desc) || []), d.path]);
  }
  for (const [t, p] of titles) if (p.length > 1) issues.push({ path: p.join(', '), issue: `Duplicate meta title: "${t}"` });
  for (const [t, p] of descs) if (p.length > 1) issues.push({ path: p.join(', '), issue: 'Duplicate meta description' });

  // Broken internal references between content
  const sSlugs = new Set(services.map((s) => s.slug)); const aSlugs = new Set(areas.map((a) => a.slug));
  for (const s of services) {
    for (const r of s.relatedServices || []) if (!sSlugs.has(r)) issues.push({ path: `/services/${s.slug}`, issue: `Links to unpublished/missing service "${r}"` });
    for (const a of s.areas || []) if (!aSlugs.has(a)) issues.push({ path: `/services/${s.slug}`, issue: `Links to unpublished/missing area "${a}"` });
  }
  for (const a of areas) {
    for (const s of a.services || []) if (!sSlugs.has(s)) issues.push({ path: `/service-areas/${a.slug}`, issue: `Links to unpublished/missing service "${s}"` });
    for (const n of a.nearbyAreas || []) if (!aSlugs.has(n)) issues.push({ path: `/service-areas/${a.slug}`, issue: `Links to unpublished/missing area "${n}"` });
  }
  // Orphans: service/area pages nothing links to
  const linkedS = new Set([...services.flatMap((s) => s.relatedServices || []), ...areas.flatMap((a) => a.services || [])]);
  const linkedA = new Set([...services.flatMap((s) => s.areas || []), ...areas.flatMap((a) => a.nearbyAreas || [])]);
  // Pages are all linked from index pages, so orphan = not linked from any related content (soft signal)
  for (const s of services) if (!linkedS.has(s.slug)) issues.push({ path: `/services/${s.slug}`, issue: 'Not linked from any area or related service (weak internal linking)' });
  for (const a of areas) if (!linkedA.has(a.slug)) issues.push({ path: `/service-areas/${a.slug}`, issue: 'Not linked from any service or nearby area (weak internal linking)' });

  // Redirect chains/loops
  const reds = await Redirect.find().lean(); const map = new Map(reds.map((r) => [r.from, r.to]));
  for (const r of reds) {
    if (map.get(r.to)) issues.push({ path: r.from, issue: `Redirect chain: ${r.from} → ${r.to} → ${map.get(r.to)}` });
    if (r.from === r.to) issues.push({ path: r.from, issue: 'Redirect loop' });
  }
  return { checkedPages: items.length, issueCount: issues.length, issues };
}
