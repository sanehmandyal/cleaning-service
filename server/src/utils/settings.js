import { SiteSettings } from '../models/index.js';

export async function getSettings() {
  return (await SiteSettings.findOne({ key: 'main' })) || (await SiteSettings.create({ key: 'main' }));
}
