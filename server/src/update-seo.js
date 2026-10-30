import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  const ServiceArea = mongoose.model('ServiceArea', new mongoose.Schema({}, { strict: false }));
  
  await ServiceArea.updateOne({ slug: 'downtown-metro' }, {
    $set: {
      metaTitle: 'Cleaning Services Downtown Metro | SparkleClean Pro',
      metaDescription: 'Professional home & commercial cleaning across Downtown Metro. Eco-friendly, insured cleaners with same-day booking. Free quotes.'
    }
  });

  await ServiceArea.updateOne({ slug: 'westside-suburbs' }, {
    $set: {
      metaTitle: 'Cleaning Services Westside Suburbs | SparkleClean',
      metaDescription: 'Trusted weekly, bi-weekly & deep home cleaning throughout Westside Suburbs. Bonded cleaners & 100% satisfaction guarantee.'
    }
  });

  await ServiceArea.updateOne({ slug: 'north-tech-district' }, {
    $set: {
      metaTitle: 'Office Cleaning North Tech District | SparkleClean',
      metaDescription: 'Commercial office & startup hub janitorial services in North Tech District. Nightly & weekend schedules available.'
    }
  });

  await ServiceArea.updateOne({ slug: 'south-bay-district' }, {
    $set: {
      metaTitle: 'Deep Cleaning South Bay District | SparkleClean Pro',
      metaDescription: 'Move-in, move-out & intensive deep cleaning across South Bay District. Landlord inspection ready with deposit guarantee.'
    }
  });

  console.log('Optimized service area meta titles & descriptions!');
  await mongoose.disconnect();
}
run().catch(console.error);
