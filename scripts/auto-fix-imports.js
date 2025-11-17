#!/usr/bin/env node

/**
 * Automated Import Migration Script
 * Migrates old @/components/ui/ imports to /src/ui/ primitives
 * 
 * Usage:
 *   node scripts/auto-fix-imports.js           # Dry-run mode (preview only)
 *   node scripts/auto-fix-imports.js --apply   # Apply changes
 */

const fs = require('fs');
const path = require('path');

// Import mapping: old path -> new path
const IMPORT_MAPPINGS = {
  '@/components/ui/button': '@/ui/Button',
  '@/components/ui/card': '@/ui/Card',
  '@/components/ui/badge': '@/ui/Badge',
  '@/components/ui/input': '@/ui/Input',
  '@/components/ui/textarea': '@/ui/Textarea',
  '@/components/ui/select': '@/ui/Select',
  '@/components/ui/tag': '@/ui/Tag',
};

// Color class mappings: direct colors -> semantic tokens
const COLOR_MAPPINGS = {
  'text-white': 'text-foreground',
  'bg-white': 'bg-background',
  'text-black': 'text-foreground',
  'bg-black': 'bg-[hsl(var(--brand-primary))]',
  'border-white': 'border-[hsl(var(--line))]',
  'border-black': 'border-[hsl(var(--brand-primary))]',
};

// Spacing mappings: non-standard -> standard spacing
const SPACING_MAPPINGS = {
  'py-12': 'py-16',
  'py-14': 'py-16',
  'py-18': 'py-20',
  'px-12': 'px-16',
  'px-14': 'px-16',
  'px-18': 'px-20',
  'pt-12': 'pt-16',
  'pt-14': 'pt-16',
  'pt-18': 'pt-20',
  'pb-12': 'pb-16',
  'pb-14': 'pb-16',
  'pb-18': 'pb-20',
  'pl-12': 'pl-16',
  'pl-14': 'pl-16',
  'pl-18': 'pl-20',
  'pr-12': 'pr-16',
  'pr-14': 'pr-16',
  'pr-18': 'pr-20',
};

const EXCLUDE_PATTERNS = [
  /node_modules/,
  /\.git/,
  /dist/,
  /build/,
  /scripts/,
  /supabase/,
  /public/,
  /\.md$/,
  /integrations\/supabase/,
  /vite-env\.d\.ts/,
  /src\/ui\//,  // Don't modify the ui primitives themselves
  /src\/components\/ui\//,  // Don't modify the old ui components (they re-export)
];

class ImportMigrator {
  constructor(dryRun = true) {
    this.dryRun = dryRun;
    this.changes = [];
    this.errors = [];
    this.stats = {
      imports: 0,
      colors: 0,
      spacing: 0,
      filesModified: 0
    };
  }

  shouldExclude(filePath) {
    return EXCLUDE_PATTERNS.some(pattern => pattern.test(filePath));
  }

  detectOldImports(content) {
    const imports = [];
    const importRegex = /import\s+(?:(\{[^}]+\})|(\w+))\s+from\s+['"](@\/components\/ui\/\w+)['"]/g;
    
    let match;
    while ((match = importRegex.exec(content)) !== null) {
      const namedImports = match[1];
      const defaultImport = match[2];
      const importPath = match[3];
      
      if (IMPORT_MAPPINGS[importPath]) {
        imports.push({
          fullMatch: match[0],
          namedImports,
          defaultImport,
          oldPath: importPath,
          newPath: IMPORT_MAPPINGS[importPath],
          index: match.index
        });
      }
    }
    
    return imports;
  }

  migrateImport(importInfo) {
    const { namedImports, defaultImport, newPath } = importInfo;
    
    if (namedImports) {
      // Handle named imports: import { Button, buttonVariants } from '@/components/ui/button'
      return `import ${namedImports} from '${newPath}'`;
    } else if (defaultImport) {
      // Handle default imports: import Button from '@/components/ui/button'
      return `import { ${defaultImport} } from '${newPath}'`;
    }
    
    return null;
  }

  fixColors(content) {
    let newContent = content;
    let changeCount = 0;

    Object.entries(COLOR_MAPPINGS).forEach(([oldColor, newColor]) => {
      // Match the color class with word boundaries to avoid partial matches
      const regex = new RegExp(`\\b${oldColor}\\b`, 'g');
      const matches = newContent.match(regex);
      
      if (matches) {
        changeCount += matches.length;
        newContent = newContent.replace(regex, newColor);
      }
    });

    return { newContent, changeCount };
  }

  fixSpacing(content) {
    let newContent = content;
    let changeCount = 0;

    Object.entries(SPACING_MAPPINGS).forEach(([oldSpacing, newSpacing]) => {
      // Match the spacing class with word boundaries
      const regex = new RegExp(`\\b${oldSpacing}\\b`, 'g);
      const matches = newContent.match(regex);
      
      if (matches) {
        changeCount += matches.length;
        newContent = newContent.replace(regex, newSpacing);
      }
    });

    return { newContent, changeCount };
  }

  processFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const oldImports = this.detectOldImports(content);
      
      let newContent = content;
      let importCount = 0;
      let colorCount = 0;
      let spacingCount = 0;

      // Step 1: Fix imports
      if (oldImports.length > 0) {
        // Sort imports by index in reverse order to maintain correct positions
        oldImports.sort((a, b) => b.index - a.index);

        oldImports.forEach(importInfo => {
          const newImport = this.migrateImport(importInfo);
          
          if (newImport) {
            newContent = 
              newContent.substring(0, importInfo.index) +
              newImport +
              newContent.substring(importInfo.index + importInfo.fullMatch.length);
            importCount++;
          }
        });
      }

      // Step 2: Fix direct color usage
      const colorResult = this.fixColors(newContent);
      newContent = colorResult.newContent;
      colorCount = colorResult.changeCount;

      // Step 3: Fix spacing inconsistencies
      const spacingResult = this.fixSpacing(newContent);
      newContent = spacingResult.newContent;
      spacingCount = spacingResult.changeCount;

      // Only return if changes were made
      const totalChanges = importCount + colorCount + spacingCount;
      if (totalChanges === 0) {
        return null;
      }

      return {
        filePath,
        oldImports,
        importCount,
        colorCount,
        spacingCount,
        totalChanges,
        newContent,
        originalContent: content
      };

    } catch (error) {
      this.errors.push({
        filePath,
        error: error.message
      });
      return null;
    }
  }

  scanDirectory(dir) {
    const files = [];

    function walk(currentPath) {
      const entries = fs.readdirSync(currentPath, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(currentPath, entry.name);

        if (EXCLUDE_PATTERNS.some(pattern => pattern.test(fullPath))) {
          continue;
        }

        if (entry.isDirectory()) {
          walk(fullPath);
        } else if (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts')) {
          files.push(fullPath);
        }
      }
    }

    walk(dir);
    return files;
  }

  run(srcDir) {
    console.log('🔍 Scanning for design system violations...\n');
    
    const files = this.scanDirectory(srcDir);
    console.log(`Found ${files.length} TypeScript/TSX files\n`);

    files.forEach(file => {
      const result = this.processFile(file);
      
      if (result) {
        this.changes.push(result);
        this.stats.imports += result.importCount;
        this.stats.colors += result.colorCount;
        this.stats.spacing += result.spacingCount;
      }
    });

    this.stats.filesModified = this.changes.length;
    this.printReport();

    if (!this.dryRun && this.changes.length > 0) {
      this.applyChanges();
    }
  }

  printReport() {
    console.log('╔══════════════════════════════════════════════════════════════════╗');
    console.log('║         🎨 DESIGN SYSTEM AUTO-FIX REPORT                         ║');
    console.log('╚══════════════════════════════════════════════════════════════════╝\n');

    if (this.changes.length === 0) {
      console.log('✅ No violations found! All files follow the design system.\n');
      return;
    }

    // Summary statistics
    console.log('📊 SUMMARY');
    console.log('─────────────────────────────────────────────────────────────────');
    console.log(`Files modified: ${this.stats.filesModified}`);
    console.log(`  📦 Import fixes: ${this.stats.imports}`);
    console.log(`  🎨 Color fixes: ${this.stats.colors}`);
    console.log(`  📏 Spacing fixes: ${this.stats.spacing}`);
    console.log(`  Total changes: ${this.stats.imports + this.stats.colors + this.stats.spacing}\n`);

    // Detailed file breakdown
    console.log('📝 FILE DETAILS');
    console.log('─────────────────────────────────────────────────────────────────\n');

    this.changes.forEach((change, index) => {
      console.log(`${index + 1}. ${change.filePath}`);
      
      if (change.importCount > 0) {
        console.log(`   📦 Import migrations: ${change.importCount}`);
        change.oldImports.slice(0, 3).forEach(importInfo => {
          const newImport = this.migrateImport(importInfo);
          console.log(`      ${importInfo.oldPath} → ${importInfo.newPath}`);
        });
        if (change.oldImports.length > 3) {
          console.log(`      ... and ${change.oldImports.length - 3} more`);
        }
      }
      
      if (change.colorCount > 0) {
        console.log(`   🎨 Color fixes: ${change.colorCount} classes`);
      }
      
      if (change.spacingCount > 0) {
        console.log(`   📏 Spacing fixes: ${change.spacingCount} classes`);
      }
      
      console.log();
    });

    if (this.errors.length > 0) {
      console.log('⚠️  ERRORS');
      console.log('─────────────────────────────────────────────────────────────────\n');
      this.errors.forEach(error => {
        console.log(`   ${error.filePath}`);
        console.log(`   Error: ${error.error}\n`);
      });
    }

    console.log('─────────────────────────────────────────────────────────────────');
    console.log(`Total modifications: ${this.changes.length} files`);
    console.log('─────────────────────────────────────────────────────────────────\n');

    if (this.dryRun) {
      console.log('💡 DRY RUN MODE - No changes were made');
      console.log('   To apply these changes, run:');
      console.log('   node scripts/auto-fix-imports.js --apply\n');
    }
  }

  applyChanges() {
    console.log('📝 Applying changes...\n');

    let successCount = 0;
    let failCount = 0;

    this.changes.forEach(change => {
      try {
        fs.writeFileSync(change.filePath, change.newContent, 'utf-8');
        console.log(`✅ ${change.filePath}`);
        successCount++;
      } catch (error) {
        console.log(`❌ ${change.filePath} - ${error.message}`);
        failCount++;
      }
    });

    console.log('\n─────────────────────────────────────────────────────────────────');
    console.log(`✅ Successfully updated: ${successCount} files`);
    if (failCount > 0) {
      console.log(`❌ Failed: ${failCount} files`);
    }
    console.log('─────────────────────────────────────────────────────────────────\n');

    console.log('🎉 Migration complete!\n');
    console.log('Next steps:');
    console.log('1. Review the changes with: git diff');
    console.log('2. Test your application');
    console.log('3. Run: npm run build');
    console.log('4. Commit changes if everything works\n');
  }
}

// Main execution
const args = process.argv.slice(2);
const applyMode = args.includes('--apply');
const srcDir = path.join(process.cwd(), 'src');

const migrator = new ImportMigrator(!applyMode);
migrator.run(srcDir);

process.exit(0);
