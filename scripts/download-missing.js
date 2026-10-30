import { execSync } from 'child_process';
import fs from 'fs';

const items = [
  { name: 'cleaning-team.jpg', url: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1200&q=85' },
  { name: 'area-downtown.jpg', url: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1000&q=85' }
];

for (const item of items) {
  const pPath = 'client/public/images/' + item.name;
  const uPath = 'server/uploads/' + item.name;
  execSync(`curl.exe -s -L "${item.url}" -o "${pPath}"`);
  fs.copyFileSync(pPath, uPath);
  console.log(item.name, fs.statSync(pPath).size);
}
