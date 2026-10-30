import { SiteSettings } from '../models/index.js';

export async function getSettings() {
  let s = await SiteSettings.findOne({ key: 'main' });
  if (!s) {
    s = await SiteSettings.create({ key: 'main' });
  }
  // If businessName is still the legacy placeholder or empty, update to realistic production defaults
  if (!s.businessName || s.businessName.includes('placeholder')) {
    s.businessName = 'SparkleClean Pro';
    s.tagline = 'Premium Residential & Commercial Cleaning Services';
    s.phone = '+1 (800) 555-0199';
    s.whatsapp = '+18005550199';
    s.email = 'contact@sparklecleanpro.com';
    s.addressLine = 'Greater Metropolitan Area & Surrounding Suburbs';
    s.openingHours = 'Mon - Sat: 7:30 AM - 7:00 PM | Sun: 9:00 AM - 4:00 PM';
    s.logo = '/images/logo.svg';
    s.defaultOgImage = '/images/hero-home.jpg';
    s.homeMetaTitle = 'SparkleClean Pro | Trusted Home & Commercial Cleaning Services';
    s.homeMetaDescription = 'Top-rated, bonded & insured cleaning professionals. Residential, deep cleaning, move-in/out, and commercial cleaning with our 100% satisfaction guarantee.';
    s.social = {
      facebook: 'https://facebook.com',
      instagram: 'https://instagram.com',
      linkedin: 'https://linkedin.com',
      googleBusiness: 'https://maps.google.com'
    };
    await s.save();
  }
  return s;
}
