import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { gzipSync } from 'node:zlib';
const root = resolve(process.argv[2] || 'dist');
const html = await readFile(resolve(root, 'index.html'), 'utf8');
const script = /<script type="module"[^>]*src="(\/assets\/[^"/]+\.js)"/.exec(html)?.[1];
if (!script) throw new Error('Cannot locate the production entry script');
const data = await readFile(resolve(root, '.' + script));
const gzip = gzipSync(data).length;
console.log(`Entry script: ${data.length} bytes; ${gzip} bytes gzip.`);
// Before this fix: 1,904,284 bytes raw / 467,630 gzip. Keep the measured reduction.
if (data.length > 1_100_000 || gzip > 340_000) throw new Error('Entry script exceeds its budget');
