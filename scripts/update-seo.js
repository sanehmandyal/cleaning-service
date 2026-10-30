import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../server/.env') });

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  const ServiceArea = mongoose.model('ServiceArea', new mongoose.Schema({}, { strict: false }));
  
  await ServiceArea.updateOne({ slug: 'downtown-metro' }, {
    $set: {
      metaTitle: 'Cleaning Services in Downtown Metro | SparkleClean Pro',
      metaDescription: 'Professional home & commercial cleaning across Downtown Metro. Eco-friendly, insured cleaners with same-day booking. Get a free quote.'
    }
  });

  await ServiceArea.updateOne({ slug: 'westside-suburbs' }, {
    $set: {
      metaTitle: 'Residential Cleaning Services in Westside Suburbs | SparkleClean Pro',
      metaDescription: 'Trusted weekly, bi-weekly & deep home cleaning throughout Westside Suburbs. Bonded cleaners & 100% satisfaction guarantee.'
    }
  });

  await ServiceArea.updateOne({ slug: 'north-tech-district' }, {
    $set: {
      metaTitle: 'Office & Commercial Cleaning in North Tech District | SparkleClean Pro',
      metaDescription: 'Commercial office, startup hub & corporate facility janitorial services in North Tech District. Nightly & weekend schedules available.'
    }
  });

  await ServiceArea.updateOne({ slug: 'south-bay-district' }, {
    $set: {
      metaTitle: 'Deep & Move-Out Cleaning in South Bay District | SparkleClean Pro',
      metaDescription: 'Specialist move-in, move-out & intensive deep cleaning across South Bay District. Landlord inspection ready with deposit guarantee.'
    }
  });

  console.log('Successfully updated service areas meta tags!');
  await mongoose.disconnect();
}
run().catch(console.error);
