#!/usr/bin/env ts-node

/**
 * Route Integrity Audit
 * - Extracts source-of-truth routes from src/App.tsx
 * - Supports nested /admin child routes
 * - Scans src for internal links (to/href)
 */

import * as fs from 'fs';
import * as path from 'path';

const APP_PATHS = [
  path.join(process.cwd(), 'src', 'routes', 'AppRoutes.tsx'),
  path.join(process.cwd(), 'src', 'App.tsx'),
];
const SRC_DIR = path.join(process.cwd(), 'src');

function extractRoutes(appContent: string): string[] {
  const routes = new Set<string>();

  const routeRegex = /<Route\s+path="([^"]+)"/g;
  let match: RegExpExecArray | null;
  while ((match = routeRegex.exec(appContent)) !== null) {
    const route = match[1];
    if (route === '*') continue;

    if (route.startsWith('/')) {
      routes.add(route);
    } else {
      // In this app, non-absolute Route paths are nested under /admin
      routes.add(`/admin/${route}`);
    }
  }

  return [...routes];
}

function findLinks(dir: string): Array<{ link: string; file: string }> {
  const links: Array<{ link: string; file: string }> = [];

  function walk(currentPath: string) {
    const entries = fs.readdirSync(currentPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentPath, entry.name);

      if (entry.name.includes('node_modules') || entry.name.includes('.git')) continue;

      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts')) {
        const content = fs.readFileSync(fullPath, 'utf-8');
        const patterns = [/to=["']([^"']+)["']/g, /href=["']([^"']+)["']/g];

        for (const pattern of patterns) {
          let m: RegExpExecArray | null;
          while ((m = pattern.exec(content)) !== null) {
            const raw = m[1];
            if (!raw.startsWith('/')) continue;
            if (raw.startsWith('//')) continue;
            if (raw.startsWith('/assets/') || raw.startsWith('/images/')) continue;
            if (raw.endsWith('.xml') || raw.endsWith('.txt') || raw.endsWith('.pdf')) continue;

            const normalized = raw.split('#')[0].split('?')[0];
            if (!normalized) continue;

            links.push({ link: normalized, file: path.relative(process.cwd(), fullPath) });
          }
        }
      }
    }
  }

  walk(dir);
  return links;
}

function matchesRoute(link: string, routes: string[]): boolean {
  return routes.some((route) => {
    const pattern = route
      .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      .replace(/:[\w]+/g, '[^/]+');

    return new RegExp(`^${pattern}$`).test(link);
  });
}

const appPath = APP_PATHS.find((candidate) => fs.existsSync(candidate));

if (!appPath) {
  console.error('❌ Could not find route declaration file for extraction');
  process.exit(1);
}

const appContent = fs.readFileSync(appPath, 'utf-8');
const routes = extractRoutes(appContent);
const foundLinks = findLinks(SRC_DIR);

const unknown = new Map<string, Set<string>>();
for (const { link, file } of foundLinks) {
  if (!matchesRoute(link, routes)) {
    if (!unknown.has(link)) unknown.set(link, new Set<string>());
    unknown.get(link)!.add(file);
  }
}

if (unknown.size === 0) {
  console.log('✅ Route audit passed - all internal links map to declared routes');
} else {
  console.log(`\n⚠️  Found ${unknown.size} unresolved routes:\n`);
  for (const [link, files] of [...unknown.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
    const sample = [...files].slice(0, 2).join(', ');
    console.log(`  - ${link}  (e.g. ${sample})`);
  }
  console.log('\nUpdate links or add route declarations in src/App.tsx.\n');
}
