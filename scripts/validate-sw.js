import fs from 'fs';
import path from 'path';

const swPath = path.join(process.cwd(), 'dist', 'service-worker.js');

if (!fs.existsSync(swPath)) {
  console.error('❌ Service Worker not found in dist/');
  process.exit(1);
}

const swContent = fs.readFileSync(swPath, 'utf-8');

const checks = [
  { name: 'SW has skipWaiting', pattern: /self\.skipWaiting\(\)/ },
  { name: 'SW has install event', pattern: /addEventListener\(['"]install['"]/ },
  { name: 'SW has activate event', pattern: /addEventListener\(['"]activate['"]/ },
  { name: 'SW has fetch event', pattern: /addEventListener\(['"]fetch['"]/ },
];

let failed = false;
checks.forEach(({ name, pattern }) => {
  if (pattern.test(swContent)) {
    console.log(`✅ ${name}`);
  } else {
    console.error(`❌ ${name}`);
    failed = true;
  }
});

process.exit(failed ? 1 : 0);