import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.resolve(__dirname, '../client/public/images');
const uploadsDir = path.resolve(__dirname, '../server/uploads');
const distImagesDir = path.resolve(__dirname, '../client/dist/images');

fs.mkdirSync(publicDir, { recursive: true });
fs.mkdirSync(uploadsDir, { recursive: true });

const team = [
  { name: 'team-1.jpg', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80' },
  { name: 'team-2.jpg', url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80' },
  { name: 'team-3.jpg', url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80' },
  { name: 'team-4.jpg', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80' }
];

for (const t of team) {
  const dest1 = path.join(publicDir, t.name);
  const dest2 = path.join(uploadsDir, t.name);
  console.log(`Downloading ${t.name}...`);
  execSync(`curl.exe -s -L "${t.url}" -o "${dest1}"`);
  fs.copyFileSync(dest1, dest2);
  if (fs.existsSync(distImagesDir)) {
    fs.copyFileSync(dest1, path.join(distImagesDir, t.name));
  }
}
console.log('Successfully downloaded and copied all team portraits!');
