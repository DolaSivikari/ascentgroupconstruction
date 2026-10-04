import { createRequire } from "node:module";
import { mkdir, readFile, writeFile, copyFile } from "node:fs/promises";
import { resolve, join } from "node:path";
import {
  completeSnapshots,
  metadataDifferences,
  pixelRatio,
  type Snapshot,
  type ComparableField,
} from "../../src/lib/baseline/policy";
const require = createRequire(import.meta.url);
const { PNG } = require("pngjs"); // Already present through the locked Lighthouse toolchain.
const [baselineArg, candidateArg, outArg, declarationsArg] =
  process.argv.slice(2);
if (!baselineArg || !candidateArg)
  throw new Error(
    "Usage: compare.ts <baseline directory> <candidate directory> [output] [declarations.json]",
  );
const baseline = resolve(baselineArg),
  candidate = resolve(candidateArg),
  out = resolve(outArg || "node_modules/.cache/public-comparison");
await mkdir(out, { recursive: true });
interface Manifest {
  paths: string[];
  snapshots: Snapshot[];
}
interface Declaration {
  path: string;
  reason: string;
  fields: ComparableField[];
}
const before: Manifest = JSON.parse(
  await readFile(join(baseline, "manifest.json"), "utf8"),
);
const after: Manifest = JSON.parse(
  await readFile(join(candidate, "manifest.json"), "utf8"),
);
const declarations: Declaration[] = declarationsArg
  ? JSON.parse(await readFile(resolve(declarationsArg), "utf8"))
  : [];
const seen = new Set<string>();
for (const declaration of declarations) {
  if (
    !declaration.path ||
    !declaration.reason?.trim() ||
    !Array.isArray(declaration.fields) ||
    !declaration.fields.length ||
    seen.has(declaration.path)
  )
    throw new Error(
      "Each declared page needs a unique path, a reason and explicit fields.",
    );
  if (!before.paths.includes(declaration.path))
    throw new Error("Declaration names a page outside the baseline.");
  if (
    declaration.fields.some((field) =>
      ["pageErrors", "consoleErrors", "status"].includes(field),
    )
  )
    throw new Error("Runtime errors and HTTP failures cannot be waived.");
  seen.add(declaration.path);
}
if (JSON.stringify(before.paths) !== JSON.stringify(after.paths))
  throw new Error(
    "URL inventories differ; do not drop pages from a comparison.",
  );
const keys = (snapshots: Snapshot[]) =>
  snapshots.map((page) => `${page.path}:${page.width}`).sort();
if (
  !completeSnapshots(before.paths, before.snapshots) ||
  !completeSnapshots(after.paths, after.snapshots) ||
  JSON.stringify(keys(before.snapshots)) !==
    JSON.stringify(keys(after.snapshots))
)
  throw new Error(
    "Baseline or candidate is incomplete, duplicated, or missing a viewport.",
  );
const results = [];
for (const page of before.snapshots) {
  const next = after.snapshots.find(
    (value) => value.path === page.path && value.width === page.width,
  )!;
  const metadata = metadataDifferences(page, next);
  const oldImage = PNG.sync.read(
    await readFile(join(baseline, "screenshots", page.screenshot)),
  );
  const newImage = PNG.sync.read(
    await readFile(join(candidate, "screenshots", next.screenshot)),
  );
  const ratio = pixelRatio(oldImage, newImage);
  const differences: ComparableField[] = [
    ...metadata,
    ...(ratio > 0.001 ? ["screenshot" as const] : []),
  ];
  const declared = declarations.find((value) => value.path === page.path);
  const unexpected = differences.filter(
    (field) => !declared?.fields.includes(field),
  );
  if (differences.length) {
    await copyFile(
      join(baseline, "screenshots", page.screenshot),
      join(out, "before-" + page.screenshot),
    );
    await copyFile(
      join(candidate, "screenshots", next.screenshot),
      join(out, "after-" + next.screenshot),
    );
  }
  results.push({
    path: page.path,
    width: page.width,
    pixelDifferencePercent: ratio * 100,
    differences,
    unexpected,
    declaredReason: declared?.reason || null,
  });
}
const failure = results.some((result) => result.unexpected.length);
const report = {
  status: failure ? "failed" : "passed",
  urls: before.paths.length,
  captures: results.length,
  identical: results.filter((result) => !result.differences.length).length,
  declared: results.filter(
    (result) => result.differences.length && !result.unexpected.length,
  ).length,
  failed: results.filter((result) => result.unexpected.length).length,
  results,
};
await writeFile(
  join(out, "results.json"),
  JSON.stringify(report, null, 2) + "\n",
);
console.log(JSON.stringify({ ...report, results: undefined }));
if (failure) process.exitCode = 1;
