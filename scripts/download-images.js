import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.resolve(__dirname, '../client/public/images');
const uploadsDir = path.resolve(__dirname, '../server/uploads');

fs.mkdirSync(publicDir, { recursive: true });
fs.mkdirSync(uploadsDir, { recursive: true });

const images = [
  // Hero & Brand
  {
    name: 'hero-home.jpg',
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=85'
  },
  {
    name: 'cleaning-team.jpg',
    url: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1200&q=85'
  },
  // Services
  {
    name: 'service-home.jpg',
    url: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=1000&q=85'
  },
  {
    name: 'service-deep.jpg',
    url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1000&q=85'
  },
  {
    name: 'service-move.jpg',
    url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1000&q=85'
  },
  {
    name: 'service-office.jpg',
    url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1000&q=85'
  },
  {
    name: 'service-carpet.jpg',
    url: 'https://images.unsplash.com/photo-1527515545081-5db817172677?auto=format&fit=crop&w=1000&q=85'
  },
  {
    name: 'service-window.jpg',
    url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=85'
  },
  // Gallery
  {
    name: 'gallery-kitchen-1.jpg',
    url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'gallery-kitchen-2.jpg',
    url: 'https://images.unsplash.com/photo-1584622781564-1d987f7333c1?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'gallery-bath-1.jpg',
    url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'gallery-bath-2.jpg',
    url: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'gallery-living-1.jpg',
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'gallery-bedroom-1.jpg',
    url: 'https://images.unsplash.com/photo-1540518614846-7ede433c4550?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'gallery-office-1.jpg',
    url: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'gallery-window-1.jpg',
    url: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'gallery-carpet-1.jpg',
    url: 'https://images.unsplash.com/photo-1527515545081-5db817172677?auto=format&fit=crop&w=800&q=80'
  },
  // Areas
  {
    name: 'area-downtown.jpg',
    url: 'https://images.unsplash.com/photo-1477959858617-67f30bc75b82?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'area-westside.jpg',
    url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'area-north.jpg',
    url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'area-south.jpg',
    url: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80'
  },
  // Blog
  {
    name: 'blog-moveout.jpg',
    url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1000&q=80'
  },
  {
    name: 'blog-deepclean.jpg',
    url: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1000&q=80'
  },
  {
    name: 'blog-ecoclean.jpg',
    url: 'https://images.unsplash.com/photo-1584622781564-1d987f7333c1?auto=format&fit=crop&w=1000&q=80'
  },
  {
    name: 'blog-office.jpg',
    url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1000&q=80'
  }
];

import { execSync } from 'child_process';

console.log(`Downloading ${images.length} original images using curl...`);

for (const img of images) {
  const targetPublic = path.join(publicDir, img.name);
  const targetUploads = path.join(uploadsDir, img.name);
  try {
    execSync(`curl.exe -s -L "${img.url}" -o "${targetPublic}"`, { stdio: 'inherit' });
    fs.copyFileSync(targetPublic, targetUploads);
    console.log(`✓ ${img.name}`);
  } catch (err) {
    console.error(`✗ ${img.name}:`, err.message);
  }
}

console.log('All original images downloaded successfully!');
