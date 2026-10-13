import { readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
const inventory = JSON.parse(await readFile('config/page-safety/inventory.json', 'utf8'));
const changes = JSON.parse(await readFile('config/page-safety/intentional-changes.json', 'utf8'));
assert(Array.isArray(inventory.pages) && inventory.pages.length > 0, 'Missing page inventory');
const paths = new Set(inventory.pages.map(page => page.path));
assert.equal(paths.size, inventory.pages.length, 'Duplicate inventory paths');
assert(Array.isArray(changes), 'Missing comparison declarations');
for (const change of changes) {
  assert(paths.has(change.path), `Unknown declared page: ${change.path}`);
  assert(change.reason && change.fields?.length, `Incomplete declaration: ${change.path}`);
}
for (const path of ['docs/admin-upgrade/00-ADMIN-MASTER-PLAN.md', 'docs/admin-upgrade/PHASE-2-IMPLEMENTATION-STATUS.md'])
  assert((await readFile(path, 'utf8')).length > 0, `Missing guide ${path}`);
console.log(`Operational contracts present: ${paths.size} inventory URLs.`);
