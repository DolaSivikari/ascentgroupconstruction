#!/usr/bin/env ts-node

/**
 * Route Integrity Audit
 * Validates that all internal links point to valid routes
 */

import * as fs from 'fs';
import * as path from 'path';

const KNOWN_ROUTES = [
  "/",
  "/about",
  "/services",
  "/services/:slug",
  "/services/general-contracting",
  "/services/construction-management",
  "/services/design-build",
  "/services/building-envelope",
  "/services/exterior-envelope",
  "/services/parking-rehabilitation",
  "/services/masonry-restoration",
  "/services/eifs-stucco",
  "/services/metal-cladding",
  "/services/exterior-cladding",
  "/services/waterproofing",
  "/services/interior-buildouts",
  "/projects",
  "/case-study/:slug",
  "/blog",
  "/blog/:slug",
  "/contact",
  "/estimate",
  "/careers",
  "/faq",
  "/safety",
  "/sustainability",
  "/how-we-work",
  "/our-process",
  "/values",
  "/homeowners",
  "/commercial-clients",
  "/property-managers",
  "/markets/multi-family",
  "/markets/commercial",
  "/markets/institutional",
  "/markets/industrial",
  "/markets/healthcare",
  "/markets/education",
  "/markets/retail",
  "/markets/hospitality",
  "/company/team",
  "/company/certifications-insurance",
  "/company/equipment-resources",
  "/company/developers",
  "/resources/service-areas",
  "/resources/warranties",
  "/resources/financing",
  "/resources/contractor-portal",
  "/admin",
];

function findLinks(dir: string): string[] {
  const links: string[] = [];
  
  function walk(currentPath: string) {
    const entries = fs.readdirSync(currentPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentPath, entry.name);

      if (entry.name.includes('node_modules') || entry.name.includes('.git')) {
        continue;
      }

      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts')) {
        const content = fs.readFileSync(fullPath, 'utf-8');
        const matches = content.match(/to=["']([^"']+)["']/g);
        if (matches) {
          matches.forEach(match => {
            const link = match.match(/to=["']([^"']+)["']/)?.[1];
            if (link && link.startsWith('/')) {
              links.push(link);
            }
          });
        }
      }
    }
  }

  walk(dir);
  return [...new Set(links)];
}

const srcDir = path.join(process.cwd(), 'src');
const foundLinks = findLinks(srcDir);

const unknownLinks = foundLinks.filter(link => {
  return !KNOWN_ROUTES.some(route => {
    const pattern = route.replace(/:[\w]+/g, '[^/]+');
    return new RegExp(`^${pattern}$`).test(link);
  });
});

if (unknownLinks.length === 0) {
  console.log('✅ Route audit passed - all links are valid');
} else {
  console.log(`\n⚠️  Found ${unknownLinks.length} unknown routes:\n`);
  unknownLinks.forEach(link => console.log(`  - ${link}`));
  console.log('\nConsider adding these to KNOWN_ROUTES or fixing the links.\n');
}
