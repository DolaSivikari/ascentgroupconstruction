/** Read-only measurements of a scratch build. Never reads environment files. */
import { readFile, writeFile, readdir, stat } from 'node:fs/promises';
import { resolve, relative, extname } from 'node:path';
import { gzipSync } from 'node:zlib';
import { createHash } from 'node:crypto';

const [repoArg, notesArg, outputArg, commit] = process.argv.slice(2);
if (!repoArg || !notesArg || !outputArg || !commit) {
  throw new Error('Usage: node collect-baseline.mjs SCRATCH_REPO LOG_DIRECTORY OUTPUT_DIRECTORY COMMIT');
}
const repo = resolve(repoArg);
const notes = resolve(notesArg);
const output = resolve(outputArg);
async function filesIn(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (['node_modules', '.git', '_assessment'].includes(entry.name) || entry.name.startsWith('.env')) continue;
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) files.push(...await filesIn(path));
    if (entry.isFile()) files.push(path);
  }
  return files.sort();
}
async function summarize(files) {
  const sizes = await Promise.all(files.map(async path => ({ path: relative(repo, path), bytes: (await stat(path)).size })));
  return { files: sizes.length, bytes: sizes.reduce((total, file) => total + file.bytes, 0), inventory: sizes };
}
const srcFiles = await filesIn(resolve(repo, 'src'));
const publicFiles = await filesIn(resolve(repo, 'public'));
const distFiles = await filesIn(resolve(repo, 'dist'));
const allFiles = (await filesIn(repo)).filter(path => !path.startsWith(resolve(repo, 'dist') + '/'));
const packageJson = JSON.parse(await readFile(resolve(repo, 'package.json'), 'utf8'));
const lint = JSON.parse(await readFile(resolve(notes, 'lint.json'), 'utf8'));
const lintTotals = { errors: 0, warnings: 0, rules: {} };
const lintDiagnostics = [];
for (const file of lint) {
  lintTotals.errors += file.errorCount;
  lintTotals.warnings += file.warningCount;
  for (const message of file.messages) {
    const rule = message.ruleId || 'parser';
    lintTotals.rules[rule] ||= { errors: 0, warnings: 0 };
    lintTotals.rules[rule][message.severity === 2 ? 'errors' : 'warnings']++;
    lintDiagnostics.push({ file: relative(repo, file.filePath), ...message });
  }
}
const strictLog = await readFile(resolve(notes, 'full-strict-all-types.log'), 'utf8');
const strictTotals = { errors: 0, byCode: {}, byFile: {} };
for (const [, file, code] of strictLog.matchAll(/^(.+?)\(\d+,\d+\): error (TS\d+):/gm)) {
  strictTotals.errors++;
  strictTotals.byCode[code] = (strictTotals.byCode[code] || 0) + 1;
  strictTotals.byFile[file] = (strictTotals.byFile[file] || 0) + 1;
}
const html = await readFile(resolve(repo, 'dist/index.html'), 'utf8');
const entryPath = html.match(/<script\s+type="module"[^>]*src="([^"]+)"/)[1];
const entry = await readFile(resolve(repo, 'dist', entryPath.slice(1)));
const imageExtensions = new Set(['.png', '.jpg', '.jpeg', '.webp', '.avif', '.gif', '.svg', '.ico', '.bmp']);
const images = [...srcFiles, ...publicFiles].filter(path => imageExtensions.has(extname(path).toLowerCase()));
const videos = [...srcFiles, ...publicFiles].filter(path => ['.mp4', '.webm', '.mov'].includes(extname(path).toLowerCase()));
const knip = JSON.parse(await readFile(resolve(notes, 'knip.json'), 'utf8'));
const candidateLists = {};
for (const type of ['files', 'exports', 'dependencies', 'devDependencies', 'types', 'unlisted', 'unresolved']) {
  candidateLists[type] = knip.issues.flatMap(issue => (issue[type] || []).map(candidate => ({ file: issue.file, ...candidate })));
}
const metrics = {
  sourceCommit: commit, bindingMode: 'Synthetic offline VITE_SUPABASE_* values; no .env files copied or read.',
  entryBundle: { path: entryPath, bytes: entry.length, gzipBytes: gzipSync(entry).length, gzipLevel: 6,
    sha256: createHash('sha256').update(entry).digest('hex') },
  dist: await summarize(distFiles), src: await summarize(srcFiles), public: await summarize(publicFiles),
  images: await summarize(images), videos: await summarize(videos),
  typescriptFiles: { all: allFiles.filter(path => /\.tsx?$/.test(path)).length,
    srcTs: srcFiles.filter(path => path.endsWith('.ts')).length,
    srcTsx: srcFiles.filter(path => path.endsWith('.tsx')).length },
  dependencies: { runtime: Object.keys(packageJson.dependencies).length, dev: Object.keys(packageJson.devDependencies).length },
  lint: lintTotals, strict: strictTotals,
  knip: Object.fromEntries(Object.entries(candidateLists).map(([type, candidates]) => [type, candidates.length])),
};
await writeFile(resolve(output, 'metrics.json'), JSON.stringify(metrics, null, 2) + '\n');
await writeFile(resolve(output, 'lint-diagnostics.json'), JSON.stringify(lintDiagnostics, null, 2) + '\n');
for (const [type, candidates] of Object.entries(candidateLists)) {
  await writeFile(resolve(output, `unused-${type}-candidates.json`), JSON.stringify(candidates, null, 2) + '\n');
}
await writeFile(resolve(output, 'knip.json'), JSON.stringify(knip, null, 2) + '\n');
for (const name of ['install', 'build', 'selected-types', 'tests', 'service-worker', 'app-types', 'full-strict-all-types']) {
  const log = await readFile(resolve(notes, `${name}.log`), 'utf8');
  await writeFile(resolve(output, `${name}.log.txt`), log.length ? log.trimEnd() + '\n' : '');
}
console.log(JSON.stringify({ entry: metrics.entryBundle, dist: { files: metrics.dist.files, bytes: metrics.dist.bytes },
  src: { files: metrics.src.files, bytes: metrics.src.bytes }, public: { files: metrics.public.files, bytes: metrics.public.bytes },
  images: { files: metrics.images.files, bytes: metrics.images.bytes }, typescriptFiles: metrics.typescriptFiles,
  dependencies: metrics.dependencies, lint: lintTotals, strict: strictTotals, knip: metrics.knip }, null, 2));
