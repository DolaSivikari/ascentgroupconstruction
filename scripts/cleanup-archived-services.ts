import fs from 'fs';
import path from 'path';

/**
 * Cleanup script to remove archived service definitions and cross-references
 * from priority-services-data.ts
 */

const ARCHIVED_SERVICES = [
  'general-contracting',
  'construction-management',
  'design-build',
  'residential-painting',
  'preconstruction-services',
  'virtual-design-construction',
  'drywall-finishing',
  'suite-buildouts',
  'parking-garage-restoration'
];

const TARGET_FILE = path.join(process.cwd(), 'src/data/priority-services-data.ts');

function cleanupArchivedServices() {
  console.log('🧹 Starting cleanup of archived services...\n');

  // Read the file
  const content = fs.readFileSync(TARGET_FILE, 'utf-8');
  const lines = content.split('\n');

  let inServiceDefinition = false;
  let currentServiceSlug: string | null = null;
  let braceDepth = 0;
  let serviceStartLine = -1;
  const linesToRemove: Set<number> = new Set();

  // First pass: identify service definition blocks to remove
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Check if we're starting a service definition
    const slugMatch = line.match(/^\s*'([^']+)':\s*\{/);
    if (slugMatch && !inServiceDefinition) {
      const slug = slugMatch[1];
      if (ARCHIVED_SERVICES.includes(slug)) {
        inServiceDefinition = true;
        currentServiceSlug = slug;
        serviceStartLine = i;
        braceDepth = 1;
        linesToRemove.add(i);
        console.log(`📍 Found archived service definition: ${slug} at line ${i + 1}`);
        continue;
      }
    }

    // Track brace depth inside service definitions
    if (inServiceDefinition) {
      linesToRemove.add(i);

      // Count opening and closing braces
      for (const char of line) {
        if (char === '{') braceDepth++;
        if (char === '}') braceDepth--;
      }

      // Check if we've closed the service definition
      if (braceDepth === 0) {
        console.log(`✅ Marked ${currentServiceSlug} for removal (lines ${serviceStartLine + 1}-${i + 1})`);
        
        // Also remove the trailing comma and blank line if present
        if (i + 1 < lines.length && lines[i + 1].trim() === '') {
          linesToRemove.add(i + 1);
        }
        if (i + 2 < lines.length && lines[i + 2].trim() === '') {
          linesToRemove.add(i + 2);
        }

        inServiceDefinition = false;
        currentServiceSlug = null;
        serviceStartLine = -1;
      }
    }
  }

  // Second pass: remove cross-references in relatedServices arrays
  let inRelatedServices = false;
  let relatedServicesDepth = 0;
  const crossReferencesToRemove: Set<number> = new Set();

  for (let i = 0; i < lines.length; i++) {
    // Skip lines already marked for removal
    if (linesToRemove.has(i)) continue;

    const line = lines[i];

    // Check if we're entering a relatedServices array
    if (line.includes('relatedServices:') && line.includes('[')) {
      inRelatedServices = true;
      relatedServicesDepth = 1;
      continue;
    }

    if (inRelatedServices) {
      // Track array depth
      for (const char of line) {
        if (char === '[') relatedServicesDepth++;
        if (char === ']') relatedServicesDepth--;
      }

      // Check if this line contains an archived service slug
      const slugMatch = line.match(/slug:\s*'([^']+)'/);
      if (slugMatch && ARCHIVED_SERVICES.includes(slugMatch[1])) {
        // Mark this object for removal (find the opening { and closing })
        let objectStart = i;
        let objectEnd = i;
        let objectDepth = 0;

        // Find the start of the object
        for (let j = i; j >= 0; j--) {
          if (lines[j].includes('{')) {
            objectStart = j;
            break;
          }
        }

        // Find the end of the object
        for (let j = objectStart; j < lines.length; j++) {
          for (const char of lines[j]) {
            if (char === '{') objectDepth++;
            if (char === '}') {
              objectDepth--;
              if (objectDepth === 0) {
                objectEnd = j;
                break;
              }
            }
          }
          if (objectDepth === 0) break;
        }

        // Mark all lines in the object for removal
        for (let j = objectStart; j <= objectEnd; j++) {
          crossReferencesToRemove.add(j);
        }

        // Also remove trailing comma if present
        if (objectEnd + 1 < lines.length && lines[objectEnd + 1].trim() === ',') {
          crossReferencesToRemove.add(objectEnd + 1);
        }

        console.log(`🔗 Marked cross-reference to ${slugMatch[1]} for removal (lines ${objectStart + 1}-${objectEnd + 1})`);
      }

      // Check if we've closed the relatedServices array
      if (relatedServicesDepth === 0) {
        inRelatedServices = false;
      }
    }
  }

  // Combine all lines to remove
  const allLinesToRemove = new Set([...linesToRemove, ...crossReferencesToRemove]);

  // Build the cleaned content
  const cleanedLines = lines.filter((_, index) => !allLinesToRemove.has(index));

  // Clean up any double commas or trailing commas before closing braces
  const finalLines = cleanedLines.map((line, index) => {
    // Remove double commas
    let cleaned = line.replace(/,\s*,/g, ',');
    
    // Remove trailing commas before closing brackets
    if (cleaned.match(/,\s*\]/)) {
      cleaned = cleaned.replace(/,(\s*\])/, '$1');
    }
    
    return cleaned;
  });

  // Write the cleaned content back
  fs.writeFileSync(TARGET_FILE, finalLines.join('\n'), 'utf-8');

  console.log(`\n✨ Cleanup complete!`);
  console.log(`📊 Removed ${linesToRemove.size} lines from service definitions`);
  console.log(`🔗 Removed ${crossReferencesToRemove.size} lines from cross-references`);
  console.log(`💾 Total lines removed: ${allLinesToRemove.size}`);
  console.log(`📄 New file size: ${finalLines.length} lines (was ${lines.length} lines)\n`);
}

// Run the cleanup
try {
  cleanupArchivedServices();
  console.log('✅ Script completed successfully!');
  process.exit(0);
} catch (error) {
  console.error('❌ Error during cleanup:', error);
  process.exit(1);
}
