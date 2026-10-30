import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.resolve(__dirname, '../client/public/images');
const uploadsDir = path.resolve(__dirname, '../server/uploads');

fs.mkdirSync(publicDir, { recursive: true });
fs.mkdirSync(uploadsDir, { recursive: true });

// Curated high-resolution authentic photography from Unsplash
const images = [
  // 1. HERO & BRAND
  // Professional cleaner in uniform with yellow rubber gloves carefully wiping and polishing modern home interior
  {
    name: 'hero-home.jpg',
    url: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1920&q=85'
  },
  // Dedicated team of professional cleaners with caddies and microfiber supplies in bright clean room
  {
    name: 'cleaning-team.jpg',
    url: 'https://images.unsplash.com/photo-1603712726208-493663b877e7?auto=format&fit=crop&w=1400&q=85'
  },

  // 2. SIX CORE CLEANING SERVICES
  // Home & Apartment: Cleaner wiping kitchen counter / bright residential interior
  {
    name: 'service-home.jpg',
    url: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=1200&q=85'
  },
  // Deep Cleaning: Thorough tile and fixture scrub with eco-friendly cleaning spray
  {
    name: 'service-deep.jpg',
    url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=85'
  },
  // Move-In/Move-Out: Empty, immaculate apartment with gleaming clean hardwood floor ready for handover
  {
    name: 'service-move.jpg',
    url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=85'
  },
  // Commercial & Office: Sanitized corporate office desks, spotless workstations and glass conference room
  {
    name: 'service-office.jpg',
    url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=85'
  },
  // Carpet & Upholstery: Professional carpet cleaning / steam extraction wand on plush textile fibers
  {
    name: 'service-carpet.jpg',
    url: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&w=1200&q=85'
  },
  // Window & Glass: Professional technician squeegeeing large transparent glass window
  {
    name: 'service-window.jpg',
    url: 'https://images.unsplash.com/photo-1527515545081-5db817172677?auto=format&fit=crop&w=1200&q=85'
  },

  // 3. SERVICE AREAS
  // Downtown Metro: High-rise skyline and urban residential towers
  {
    name: 'area-downtown.jpg',
    url: 'https://images.unsplash.com/photo-1477959858617-67f30bc75b82?auto=format&fit=crop&w=1000&q=85'
  },
  // Westside Suburbs: Tree-lined quiet suburban residential houses and lawns
  {
    name: 'area-westside.jpg',
    url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1000&q=85'
  },
  // North Tech Corridor: Modern glass office architecture & commercial plaza
  {
    name: 'area-north.jpg',
    url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=85'
  },
  // South Bay District: Coastal metropolitan district & retail commerce
  {
    name: 'area-south.jpg',
    url: 'https://images.unsplash.com/photo-1506146332389-18140dc7b2fb?auto=format&fit=crop&w=1000&q=85'
  },

  // 4. CLEANING BLOG & GUIDES
  // Move-Out Checklist: Moving boxes in an impeccably cleaned, sunlit home
  {
    name: 'blog-moveout.jpg',
    url: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=85'
  },
  // Deep Clean Schedule: Sprayer, microfiber cloths, and rubber gloves ready for action
  {
    name: 'blog-deepclean.jpg',
    url: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?auto=format&fit=crop&w=1200&q=85'
  },
  // Eco-Friendly Clean: Plant-based spray bottle, wooden scrub brush and natural sponge
  {
    name: 'blog-ecoclean.jpg',
    url: 'https://images.unsplash.com/photo-1585421514738-01798e348b17?auto=format&fit=crop&w=1200&q=85'
  },
  // Office Protocol: Empty, spotless tech office and boardroom after evening clean
  {
    name: 'blog-office.jpg',
    url: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=85'
  },

  // 5. BEFORE & AFTER TRANSFORMATIONS
  // Kitchen restoration: Sparkling marble countertop and stainless sink
  {
    name: 'gallery-kitchen-1.jpg',
    url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1000&q=85'
  },
  // Luxury Bathroom: Polished frameless glass shower and subway tiles
  {
    name: 'gallery-bath-1.jpg',
    url: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=1000&q=85'
  },
  // Living room hardwood: Polished hardwood floor and clean modern seating
  {
    name: 'gallery-living-1.jpg',
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=85'
  },
  // End of tenancy reset: Gleaming kitchen cabinets and spotless floor
  {
    name: 'gallery-kitchen-2.jpg',
    url: 'https://images.unsplash.com/photo-1584622781564-1d987f7333c1?auto=format&fit=crop&w=1000&q=85'
  }
];

console.log(`Downloading ${images.length} verified authentic photographs...`);

let success = 0;
for (const img of images) {
  const targetPublic = path.join(publicDir, img.name);
  const targetUploads = path.join(uploadsDir, img.name);
  try {
    execSync(`curl.exe -s -L "${img.url}" -o "${targetPublic}"`, { stdio: 'pipe' });
    fs.copyFileSync(targetPublic, targetUploads);
    const size = fs.statSync(targetPublic).size;
    console.log(`✓ ${img.name} (${Math.round(size / 1024)} KB)`);
    success++;
  } catch (err) {
    console.error(`✗ ${img.name}:`, err.message);
  }
}

console.log(`Finished: ${success}/${images.length} photographs downloaded and verified.`);
