import { readFile, writeFile } from "node:fs/promises";
import { resolve, join, basename } from "node:path";
import {
  completeSnapshots,
  forbiddenSource,
  type Snapshot,
} from "../../src/lib/baseline/policy";
const [distArg, captureArg, outArg] = process.argv.slice(2);
if (!distArg || !captureArg)
  throw new Error(
    "Usage: bundle-check.ts <dist> <capture directory> [report.json]",
  );
const dist = resolve(distArg);
const manifest: { paths: string[]; snapshots: Snapshot[] } = JSON.parse(
  await readFile(join(resolve(captureArg), "manifest.json"), "utf8"),
);
if (!completeSnapshots(manifest.paths, manifest.snapshots))
  throw new Error("Cannot pass the bundle gate with incomplete captures.");
const scripts = [
  ...new Set(manifest.snapshots.flatMap((snapshot) => snapshot.scripts)),
];
if (!scripts.length) throw new Error("No loaded public scripts were recorded.");
const failures = [];
for (const script of scripts) {
  if (!/^\/assets\/[^/]+\.js$/.test(script))
    throw new Error(`Unknown public script: ${script}`);
  const map: { sources: string[] } = JSON.parse(
    await readFile(join(dist, "assets", basename(script) + ".map"), "utf8"),
  );
  if (!Array.isArray(map.sources) || !map.sources.length)
    throw new Error("Missing source provenance for a loaded public chunk.");
  const forbidden = map.sources.filter(forbiddenSource);
  if (forbidden.length) failures.push({ script, forbidden });
}
const report = {
  status: failures.length ? "failed" : "passed",
  urls: manifest.paths.length,
  loadedPublicChunks: scripts.length,
  failures,
};
if (outArg)
  await writeFile(resolve(outArg), JSON.stringify(report, null, 2) + "\n");
console.log(JSON.stringify(report));
if (failures.length) process.exitCode = 1;
