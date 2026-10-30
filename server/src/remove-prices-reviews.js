import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/cleaning_site';

async function run() {
  await mongoose.connect(uri);
  console.log('Connected to MongoDB.');

  const Service = mongoose.model('Service', new mongoose.Schema({}, { strict: false }));
  const Testimonial = mongoose.model('Testimonial', new mongoose.Schema({}, { strict: false }));

  // 1. Remove all fake testimonials
  const delTestimonials = await Testimonial.deleteMany({});
  console.log(`Deleted ${delTestimonials.deletedCount} fake testimonials.`);

  // 2. Remove all dollar prices from services
  const services = await Service.find({});
  for (const s of services) {
    let newPriceNote = 'Quoted after confirming property size and cleaning scope.';
    if (s.slug === 'home-cleaning') {
      newPriceNote = 'Custom quotation tailored to your home size and visit frequency.';
    } else if (s.slug === 'deep-cleaning') {
      newPriceNote = 'Priced per property after assessment of square footage and condition.';
    } else if (s.slug === 'move-in-out-cleaning') {
      newPriceNote = 'Fixed-scope quotation designed around your lease inspection requirements.';
    } else if (s.slug === 'office-cleaning') {
      newPriceNote = 'Tailored commercial rate based on floor area and after-hours schedule.';
    } else if (s.slug === 'carpet-upholstery-cleaning') {
      newPriceNote = 'Quoted per room or furniture piece following fabric inspection.';
    } else if (s.slug === 'window-glass-cleaning') {
      newPriceNote = 'Quoted by glass area, pane count, and site accessibility.';
    }

    await Service.updateOne({ _id: s._id }, { $set: { priceNote: newPriceNote } });
    console.log(`Updated priceNote for service: ${s.slug}`);
  }

  console.log('Finished updating MongoDB.');
  await mongoose.disconnect();
}

run().catch(console.error);
