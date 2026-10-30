// Non-destructive seed: inserts only records that don't exist (matched by slug/key/email).
// Never drops or overwrites. All business facts are PLACEHOLDERS — edit in the admin panel.
import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { User, Service, ServiceArea, BlogPost, SiteSettings, SeoTask, Citation } from './models/index.js';

const ins = (M, key, docs) => Promise.all(docs.map((d) => M.updateOne({ [key]: d[key] }, { $setOnInsert: d }, { upsert: true })));

await mongoose.connect(process.env.MONGODB_URI);

if (process.env.SEED_ADMIN_EMAIL && process.env.SEED_ADMIN_PASSWORD) {
  await User.updateOne({ email: process.env.SEED_ADMIN_EMAIL.toLowerCase() },
    { $setOnInsert: { email: process.env.SEED_ADMIN_EMAIL.toLowerCase(), name: 'Admin', role: 'admin', passwordHash: await bcrypt.hash(process.env.SEED_ADMIN_PASSWORD, 12) } }, { upsert: true });
}
await SiteSettings.updateOne({ key: 'main' }, { $setOnInsert: { key: 'main' } }, { upsert: true });

const faqCommon = (n) => [
  { q: `How do I get a price for ${n}?`, a: 'Send a quote request or call us. We confirm the scope and give a quotation before work starts.' },
  { q: 'Are your cleaners supervised?', a: 'PLACEHOLDER: describe your real staffing and supervision practice here.' },
];

await ins(Service, 'slug', [
  { slug: 'home-cleaning', name: 'Home Cleaning', category: 'residential', status: 'published', sortOrder: 1,
    summary: 'Regular and one-off cleaning for apartments and houses.',
    metaTitle: 'Home Cleaning Services | Placeholder Cleaning Co.', metaDescription: 'Reliable home cleaning for apartments and houses. Request a free quote or book a visit online.',
    content: 'A home clean covers the rooms you use every day, kitchen, bathrooms, bedrooms and living areas, so the house stays comfortable between deeper cleans.\n\nTell us the size of the property and how often you want a visit. We confirm the scope with you first so there are no surprises on the day.',
    inclusions: ['Dusting and wiping surfaces', 'Floor sweeping and mopping', 'Kitchen counters and sink', 'Bathroom fixtures and tiles'],
    suitableFor: ['Apartments', 'Independent houses', 'Busy families'], process: ['Share property details', 'Receive a quotation', 'Confirm a time slot', 'Cleaning visit and walkthrough'],
    priceNote: 'Quoted after we confirm property size and scope.', faqs: faqCommon('home cleaning'), relatedServices: ['deep-cleaning'], areas: [] },
  { slug: 'deep-cleaning', name: 'Deep Cleaning', category: 'residential', status: 'published', sortOrder: 2,
    summary: 'Intensive top-to-bottom cleaning, ideal before moving in or after renovation.',
    metaTitle: 'Deep Cleaning Services for Homes | Placeholder Cleaning Co.', metaDescription: 'Top-to-bottom deep cleaning for move-ins, post-renovation and seasonal refreshes. Get a free quote.',
    content: 'Deep cleaning goes beyond routine upkeep: built-up grease, hard-water marks and dust in hard-to-reach places.\n\nIt suits move-in or move-out, post-renovation dust, or an annual reset. The time needed depends on property condition, which is why we quote after understanding the space.',
    inclusions: ['Detailed kitchen degreasing', 'Bathroom descaling', 'Inside cabinets (on request)', 'Skirting boards and fans'],
    suitableFor: ['Move-in / move-out', 'After renovation', 'Seasonal refresh'], process: ['Discuss condition and goals', 'Quotation', 'Deep clean', 'Final check'],
    priceNote: 'Priced per property after discussing its condition.', faqs: faqCommon('deep cleaning'), relatedServices: ['home-cleaning'], areas: [] },
  { slug: 'window-glass-cleaning', name: 'Window & Glass Cleaning', category: 'specialist', status: 'published', sortOrder: 3,
    summary: 'Streak-free cleaning for windows, partitions and glass facades.',
    metaTitle: 'Window & Glass Cleaning Services | Placeholder Cleaning Co.', metaDescription: 'Streak-free window and glass cleaning for homes and offices. Ask for a quote based on your glass area.',
    content: 'Clear glass changes how a space feels. We clean frames, tracks and glass surfaces, and the right method depends on height, access and how much build-up there is.\n\nFor offices and showrooms we can plan around business hours.',
    inclusions: ['Glass and frame cleaning', 'Track cleaning', 'Partition and door glass'],
    suitableFor: ['Homes', 'Offices', 'Showrooms'], process: ['Site details or photos', 'Quotation', 'Scheduled clean'],
    safetyNotes: 'PLACEHOLDER: describe your real height-access and safety practices. Do not claim equipment or certifications you do not have.',
    priceNote: 'Quoted by glass area and access.', faqs: faqCommon('glass cleaning'), relatedServices: ['office-cleaning'], areas: [] },
  { slug: 'office-cleaning', name: 'Office & Commercial Cleaning', category: 'commercial', status: 'published', sortOrder: 4,
    summary: 'Scheduled cleaning for offices, clinics and retail spaces.',
    metaTitle: 'Office & Commercial Cleaning | Placeholder Cleaning Co.', metaDescription: 'Scheduled office and commercial cleaning that fits your working hours. Request a tailored quotation.',
    content: 'A clean workplace supports staff and impresses visitors. We build a cleaning schedule around your hours and the areas that matter most: workstations, pantry, washrooms and reception.\n\nTell us the floor area and visit frequency and we will propose a plan.',
    inclusions: ['Workstation wiping', 'Washroom sanitising', 'Pantry cleaning', 'Floor care', 'Waste removal'],
    suitableFor: ['Offices', 'Clinics', 'Retail'], process: ['Site discussion', 'Written plan and quote', 'Start on agreed schedule'],
    priceNote: 'Monthly or per-visit quotation based on area and frequency.', faqs: faqCommon('office cleaning'), relatedServices: ['window-glass-cleaning'], areas: [] },
]);

// Areas seeded as DRAFT: publish only places you genuinely serve, with real local content.
await ins(ServiceArea, 'slug', [
  { slug: 'example-area', name: 'Example Area (replace)', status: 'draft', intro: 'Replace with a real service area and genuinely local details.', coverageNote: 'State your real coverage and any travel limits.', services: ['home-cleaning', 'office-cleaning'] },
]);
await ins(BlogPost, 'slug', [
  { slug: 'office-cleaning-checklist', title: 'A Practical Office Cleaning Checklist', status: 'draft', author: 'Placeholder Cleaning Co.',
    excerpt: 'Daily, weekly and monthly tasks for a tidy workplace.',
    content: 'Daily: empty bins, wipe shared surfaces, clean washrooms.\n\nWeekly: vacuum and mop all floors, clean glass partitions, wipe pantry appliances.\n\nMonthly: dust vents and high surfaces, deep-clean upholstery.\n\nEDITORIAL REVIEW REQUIRED before publishing.',
    relatedServices: ['office-cleaning'], metaTitle: 'Office Cleaning Checklist: Daily, Weekly, Monthly', metaDescription: 'A simple checklist for keeping an office clean, split into daily, weekly and monthly tasks.' },
]);
await ins(SeoTask, 'title', [
  { title: 'Validate keyword: cleaning services [city] in Search Console', pageType: 'home', primaryKeyword: 'cleaning services', intent: 'commercial' },
  { title: 'Map window/glass cleaning keyword to one page only', pageType: 'service', pageSlug: 'window-glass-cleaning', primaryKeyword: 'window cleaning services', intent: 'commercial' },
]);
await ins(Citation, 'directory', [
  { directory: 'Google Business Profile' }, { directory: 'Bing Places' }, { directory: 'Apple Business Connect' },
  { directory: 'Justdial (verify relevance first)' }, { directory: 'Local chamber / trade association' },
]);

console.log('Seed complete (non-destructive).');
await mongoose.disconnect();
