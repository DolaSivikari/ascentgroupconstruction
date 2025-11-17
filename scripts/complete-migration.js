#!/usr/bin/env node

/**
 * Complete Import Migration Script
 * Migrates ALL remaining @/components/ui imports to @/ui primitives
 * 
 * Usage: node scripts/complete-migration.js
 */

const fs = require('fs');
const path = require('path');

// Import mappings - ONLY these components migrate to @/ui
const MIGRATE_TO_UI = {
  'button': 'Button',
  'badge': 'Badge',
  'input': 'Input',
  'textarea': 'Textarea',
  'select': 'Select',
  'tag': 'Tag',
};

// Components that STAY at @/components/ui (Radix + complex components)
const STAY_AT_COMPONENTS_UI = [
  'card', 'dialog', 'label', 'skeleton', 'toast', 'use-toast',
  'dropdown-menu', 'popover', 'select', 'accordion', 'alert-dialog',
  'alert', 'aspect-ratio', 'avatar', 'breadcrumb', 'calendar',
  'carousel', 'chart', 'checkbox', 'collapsible', 'command',
  'context-menu', 'drawer', 'form', 'hover-card', 'input-otp',
  'menubar', 'navigation-menu', 'pagination', 'progress',
  'radio-group', 'resizable', 'scroll-area', 'separator',
  'sheet', 'sidebar', 'slider', 'sonner', 'switch', 'table',
  'tabs', 'toggle', 'toggle-group', 'tooltip', 'nav-badge'
];

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
  /src\/ui\//,
  /src\/components\/ui\//,
];

class MigrationEngine {
  constructor() {
    this.stats = {
      filesProcessed: 0,
      filesModified: 0,
      importsFixed: 0,
      errors: []
    };
  }

  shouldExclude(filePath) {
    return EXCLUDE_PATTERNS.some(pattern => pattern.test(filePath));
  }

  processFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const newContent = this.migrateImports(content);

      if (content !== newContent) {
        fs.writeFileSync(filePath, newContent, 'utf-8');
        this.stats.filesModified++;
        console.log(`✅ ${path.relative(process.cwd(), filePath)}`);
        return true;
      }
      return false;
    } catch (error) {
      this.stats.errors.push({ file: filePath, error: error.message });
      console.error(`❌ ${path.relative(process.cwd(), filePath)}: ${error.message}`);
      return false;
    }
  }

  migrateImports(content) {
    let modified = content;
    let changeCount = 0;

    // Pattern 1: Named imports - import { Button, buttonVariants } from '@/components/ui/button'
    const namedImportRegex = /import\s+\{([^}]+)\}\s+from\s+['"]@\/components\/ui\/([\w-]+)['"]/g;
    
    modified = modified.replace(namedImportRegex, (match, imports, component) => {
      if (MIGRATE_TO_UI[component]) {
        changeCount++;
        this.stats.importsFixed++;
        
        // Parse the imports
        const importList = imports.split(',').map(i => i.trim());
        const componentName = MIGRATE_TO_UI[component];
        
        // Check if there are non-component exports (like buttonVariants)
        const hasVariants = importList.some(imp => 
          imp.toLowerCase().includes('variant') || 
          imp.toLowerCase().includes('props')
        );
        
        if (hasVariants) {
          // Keep a reference to old import for variants, add new import for component
          return `import { ${componentName} } from '@/ui/${componentName}';\n` + match;
        }
        
        return `import { ${componentName} } from '@/ui/${componentName}'`;
      }
      return match;
    });

    // Pattern 2: Default imports - import Button from '@/components/ui/button'
    const defaultImportRegex = /import\s+(\w+)\s+from\s+['"]@\/components\/ui\/([\w-]+)['"]/g;
    
    modified = modified.replace(defaultImportRegex, (match, importName, component) => {
      if (MIGRATE_TO_UI[component]) {
        changeCount++;
        this.stats.importsFixed++;
        const componentName = MIGRATE_TO_UI[component];
        return `import { ${componentName} } from '@/ui/${componentName}'`;
      }
      return match;
    });

    // Pattern 3: Mixed imports with type imports
    const mixedImportRegex = /import\s+(?:type\s+)?(\w+)(?:,\s*\{([^}]+)\})?\s+from\s+['"]@\/components\/ui\/([\w-]+)['"]/g;
    
    modified = modified.replace(mixedImportRegex, (match, defaultImport, namedImports, component) => {
      if (MIGRATE_TO_UI[component]) {
        changeCount++;
        this.stats.importsFixed++;
        const componentName = MIGRATE_TO_UI[component];
        
        if (namedImports) {
          return `import { ${componentName}, ${namedImports} } from '@/ui/${componentName}'`;
        }
        return `import { ${componentName} } from '@/ui/${componentName}'`;
      }
      return match;
    });

    return modified;
  }

  scanDirectory(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (this.shouldExclude(fullPath)) continue;

      if (entry.isDirectory()) {
        this.scanDirectory(fullPath);
      } else if (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts')) {
        this.stats.filesProcessed++;
        this.processFile(fullPath);
      }
    }
  }

  run() {
    console.log('🚀 Starting Complete Import Migration...\n');
    console.log('📋 Migrating components:');
    Object.entries(MIGRATE_TO_UI).forEach(([old, newName]) => {
      console.log(`   @/components/ui/${old} → @/ui/${newName}`);
    });
    console.log('\n📁 Processing files...\n');

    const srcDir = path.join(process.cwd(), 'src');
    this.scanDirectory(srcDir);

    this.printReport();
  }

  printReport() {
    console.log('\n' + '='.repeat(70));
    console.log('📊 MIGRATION COMPLETE');
    console.log('='.repeat(70));
    console.log(`Files scanned:     ${this.stats.filesProcessed}`);
    console.log(`Files modified:    ${this.stats.filesModified}`);
    console.log(`Imports fixed:     ${this.stats.importsFixed}`);
    console.log(`Errors:            ${this.stats.errors.length}`);
    
    if (this.stats.errors.length > 0) {
      console.log('\n⚠️  ERRORS:');
      this.stats.errors.forEach(err => {
        console.log(`   ${err.file}: ${err.error}`);
      });
    }
    
    console.log('\n' + '='.repeat(70));
    
    if (this.stats.filesModified > 0) {
      console.log('\n✅ Migration successful!');
      console.log('\nNext steps:');
      console.log('1. Review changes: git diff');
      console.log('2. Test the application');
      console.log('3. Check for any TypeScript errors');
      console.log('4. Run: npm run build');
    } else {
      console.log('\n✨ No files needed migration - all imports are up to date!');
    }
  }
}

// Execute
const migrator = new MigrationEngine();
migrator.run();

process.exit(0);
