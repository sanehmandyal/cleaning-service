import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const seo = {
  metaTitle: { type: String, trim: true, maxlength: 120 },
  metaDescription: { type: String, trim: true, maxlength: 320 },
  canonicalUrl: { type: String, trim: true },
  noindex: { type: Boolean, default: false },
  focusKeyword: { type: String, trim: true },
};
const faq = [{ q: String, a: String }];
const status = { type: String, enum: ['draft', 'published', 'archived'], default: 'draft', index: true };
const opts = { timestamps: true };

export const User = model('User', new Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  name: String,
  role: { type: String, enum: ['admin', 'editor'], default: 'editor' },
}, opts));

export const Service = model('Service', new Schema({
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  name: { type: String, required: true },
  category: { type: String, enum: ['residential', 'commercial', 'specialist'], default: 'residential' },
  summary: String,
  heroImage: String,
  heroImageAlt: String,
  content: String, // HTML/markdown-lite paragraphs, separated by blank lines
  inclusions: [String],
  suitableFor: [String],
  process: [String],
  safetyNotes: String,
  priceNote: String, // truthful pricing/quotation text, e.g. "Priced after a free site visit"
  faqs: faq,
  relatedServices: [String], // slugs
  areas: [String], // area slugs
  sortOrder: { type: Number, default: 0 },
  status,
  ...seo,
}, opts));

export const ServiceArea = model('ServiceArea', new Schema({
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  name: { type: String, required: true },
  intro: String,
  localContent: String, // must be genuinely local, written per area
  coverageNote: String, // real coverage / travel limits
  heroImage: String,
  heroImageAlt: String,
  faqs: faq,
  services: [String], // service slugs available here
  nearbyAreas: [String],
  sortOrder: { type: Number, default: 0 },
  status,
  ...seo,
}, opts));

export const BlogPost = model('BlogPost', new Schema({
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  title: { type: String, required: true },
  excerpt: String,
  content: String,
  heroImage: String,
  heroImageAlt: String,
  author: String,
  relatedServices: [String],
  publishedAt: Date,
  status,
  ...seo,
}, opts));

export const Enquiry = model('Enquiry', new Schema({
  type: { type: String, enum: ['booking', 'quote', 'contact'], default: 'contact', index: true },
  name: { type: String, required: true, trim: true, maxlength: 120 },
  phone: { type: String, required: true, trim: true, maxlength: 30 },
  email: { type: String, trim: true, lowercase: true, maxlength: 200 },
  serviceSlug: String,
  areaSlug: String,
  preferredDate: String,
  message: { type: String, maxlength: 3000 },
  sourcePage: String,
  status: { type: String, enum: ['new', 'contacted', 'quoted', 'won', 'lost', 'spam'], default: 'new', index: true },
  notes: [{ text: String, by: String, at: { type: Date, default: Date.now } }],
}, opts));

export const Testimonial = model('Testimonial', new Schema({
  name: { type: String, required: true },
  location: String,
  text: { type: String, required: true },
  consentGiven: { type: Boolean, default: false }, // must be true to publish
  source: String, // e.g. Google, direct
  status,
}, opts));

export const GalleryItem = model('GalleryItem', new Schema({
  image: { type: String, required: true },
  alt: { type: String, required: true },
  caption: String,
  serviceSlug: String,
  areaSlug: String,
  status,
}, opts));

export const SiteSettings = model('SiteSettings', new Schema({
  key: { type: String, default: 'main', unique: true },
  businessName: { type: String, default: 'Your Cleaning Co. (placeholder)' },
  tagline: { type: String, default: 'Professional cleaning for homes and businesses' },
  phone: { type: String, default: '' },
  whatsapp: { type: String, default: '' },
  email: { type: String, default: '' },
  addressLine: { type: String, default: '' }, // leave blank for service-area businesses
  openingHours: { type: String, default: '' },
  mapEmbedUrl: { type: String, default: '' },
  logo: { type: String, default: '' },
  social: { facebook: String, instagram: String, googleBusiness: String, linkedin: String },
  analytics: { ga4Id: String, gscVerification: String },
  defaultOgImage: String,
  homeMetaTitle: String,
  homeMetaDescription: String,
}, opts));

export const BacklinkProspect = model('BacklinkProspect', new Schema({
  website: { type: String, required: true },
  contactUrl: String,
  category: { type: String, enum: ['association', 'directory', 'property-mgmt', 'real-estate', 'facility-mgmt', 'contractor', 'hospitality', 'supplier', 'publication', 'sponsorship', 'other'], default: 'other' },
  relevance: String,
  opportunity: String,
  valueOffered: String,
  status: { type: String, enum: ['identified', 'contacted', 'replied', 'agreed', 'live-unverified', 'verified-live', 'lost', 'declined'], default: 'identified', index: true },
  followUpDate: Date,
  linkUrl: String,
  verifiedAt: Date, // only set when someone confirms the link is live
  referralNote: String,
  notes: String,
  dataSource: { type: String, enum: ['manual', 'connected-tool'], default: 'manual' },
}, opts));

export const Citation = model('Citation', new Schema({
  directory: { type: String, required: true },
  url: String,
  nameUsed: String,
  phoneUsed: String,
  addressUsed: String,
  websiteUsed: String,
  status: { type: String, enum: ['planned', 'submitted', 'verified-live', 'needs-fix', 'rejected'], default: 'planned' },
  verifiedAt: Date,
  notes: String,
}, opts));

export const OutreachActivity = model('OutreachActivity', new Schema({
  prospect: { type: Schema.Types.ObjectId, ref: 'BacklinkProspect' },
  channel: { type: String, enum: ['email', 'phone', 'in-person', 'form', 'social'], default: 'email' },
  summary: String,
  outcome: String,
  by: String,
}, opts));

export const SeoTask = model('SeoTask', new Schema({
  title: { type: String, required: true },
  pageType: String,
  pageSlug: String,
  primaryKeyword: String,
  secondaryKeywords: [String],
  intent: { type: String, enum: ['commercial', 'local', 'informational', 'navigational'], default: 'commercial' },
  done: { type: Boolean, default: false },
  notes: String,
}, opts));

export const Redirect = model('Redirect', new Schema({
  from: { type: String, required: true, unique: true },
  to: { type: String, required: true },
  code: { type: Number, default: 301 },
}, opts));

export const AuditLog = model('AuditLog', new Schema({
  user: String,
  action: String,
  entity: String,
  entityId: String,
}, opts));
