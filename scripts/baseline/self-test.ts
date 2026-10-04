/** Integration proof: the same CLI accepts equality and rejects intentional mutations. */
import { createRequire } from "node:module";
import { mkdir, readFile, writeFile, copyFile } from "node:fs/promises";
import { resolve, join } from "node:path";
import { spawnSync } from "node:child_process";
const require = createRequire(import.meta.url);
const { PNG } = require("pngjs");
const root = resolve(
  process.argv[2] || "node_modules/.cache/baseline-production",
);
const out = resolve(
  process.argv[3] || "node_modules/.cache/baseline-negative-control",
);
const manifest = JSON.parse(
  await readFile(join(root, "manifest.json"), "utf8"),
);
await mkdir(join(out, "screenshots"), { recursive: true });
const pages = manifest.snapshots.filter(
  (page: { path: string }) => page.path === manifest.paths[0],
);
const minimal = { ...manifest, paths: [manifest.paths[0]], snapshots: pages };
await writeFile(join(out, "manifest.json"), JSON.stringify(minimal));
for (const page of pages)
  await copyFile(
    join(root, "screenshots", page.screenshot),
    join(out, "screenshots", page.screenshot),
  );
const run = () =>
  spawnSync(
    process.execPath,
    [
      "--import",
      "tsx",
      "scripts/baseline/compare.ts",
      out,
      out + "-changed",
      out + "-report",
    ],
    { encoding: "utf8" },
  );
await mkdir(join(out + "-changed", "screenshots"), { recursive: true });
await writeFile(
  join(out + "-changed", "manifest.json"),
  JSON.stringify(minimal),
);
for (const page of pages)
  await copyFile(
    join(out, "screenshots", page.screenshot),
    join(out + "-changed", "screenshots", page.screenshot),
  );
const unchanged = run();
if (unchanged.status !== 0)
  throw new Error("Equality control failed: " + unchanged.stderr);
minimal.snapshots = pages.map((page: { visibleText: string }) => ({
  ...page,
  visibleText: page.visibleText + "\nDELIBERATE TEST CHANGE",
}));
await writeFile(
  join(out + "-changed", "manifest.json"),
  JSON.stringify(minimal),
);
const textChange = run();
if (textChange.status !== 1)
  throw new Error("Text negative control did not fail.");
minimal.snapshots = pages;
await writeFile(
  join(out + "-changed", "manifest.json"),
  JSON.stringify(minimal),
);
const image = PNG.sync.read(
  await readFile(join(out, "screenshots", pages[0].screenshot)),
);
for (let index = 0; index < image.data.length; index += 4) {
  image.data[index] ^= 255;
  image.data[index + 1] ^= 255;
  image.data[index + 2] ^= 255;
}
await writeFile(
  join(out + "-changed", "screenshots", pages[0].screenshot),
  PNG.sync.write(image),
);
const pixels = run();
if (pixels.status !== 1)
  throw new Error("Screenshot negative control did not fail.");
const dist = join(out, "bundle-control");
await mkdir(join(dist, "assets"), { recursive: true });
minimal.snapshots = pages.map((page: { scripts: string[] }) => ({
  ...page,
  scripts: page.scripts.filter((script) =>
    /^\/assets\/[^/]+\.js$/.test(script),
  ),
}));
await writeFile(join(out, "manifest.json"), JSON.stringify(minimal));
const scripts: string[] = [
  ...new Set(
    minimal.snapshots.flatMap((page: { scripts: string[] }) => page.scripts),
  ),
] as string[];
if (!scripts.length)
  throw new Error("No scripts for the bundle negative control.");
for (const script of scripts)
  await writeFile(
    join(dist, "assets", script.split("/").pop() + ".map"),
    JSON.stringify({ sources: ["../../node_modules/react/index.js"] }),
  );
const runBundle = () =>
  spawnSync(
    process.execPath,
    ["--import", "tsx", "scripts/baseline/bundle-check.ts", dist, out],
    { encoding: "utf8" },
  );
if (runBundle().status !== 0)
  throw new Error("Clean bundle control did not pass.");
for (const library of ["@tiptap/react", "recharts"]) {
  await writeFile(
    join(dist, "assets", scripts[0].split("/").pop() + ".map"),
    JSON.stringify({
      sources: ["../../node_modules/" + library + "/index.js"],
    }),
  );
  if (runBundle().status !== 1)
    throw new Error(library + " public bundle control did not fail.");
}
const proof = {
  equality: "passed",
  deliberateTextChange: "rejected",
  deliberateScreenshotChange: "rejected",
  cleanPublicBundle: "passed",
  publicTiptap: "rejected",
  publicCharts: "rejected",
};
await writeFile(join(out, "proof.json"), JSON.stringify(proof, null, 2) + "\n");
console.log(JSON.stringify(proof));
