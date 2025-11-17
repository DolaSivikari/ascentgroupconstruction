#!/usr/bin/env node

/**
 * Comprehensive Design System Audit
 * Scans all components for design violations and migration needs
 */

const fs = require('fs');
const path = require('path');

// Patterns to detect
const PATTERNS = {
  oldImports: {
    pattern: /@\/components\/ui\/(button|card|badge|input|textarea|select|tag)/g,
    message: "Using old @/components/ui/ imports instead of /src/ui/",
    severity: "error",
    category: "migration"
  },
  directColors: {
    pattern: /\b(text-white|bg-white|text-black|bg-black|border-white|border-black)\b/g,
    message: "Using direct colors instead of semantic tokens",
    severity: "error",
    category: "design-system"
  },
  spacingViolations: {
    pattern: /\b(py-12|py-14|py-18|px-12|px-14|px-18)\b/g,
    message: "Using non-standard spacing (use py-16, py-20, px-16, px-20)",
    severity: "warning",
    category: "spacing"
  },
  inlineStyles: {
    pattern: /style=\{\{/g,
    message: "Using inline styles instead of Tailwind classes",
    severity: "warning",
    category: "design-system"
  },
  hardcodedColors: {
    pattern: /#[0-9A-Fa-f]{6}|#[0-9A-Fa-f]{3}|rgb\(|rgba\(/g,
    message: "Using hardcoded colors instead of CSS variables",
    severity: "error",
    category: "design-system"
  },
  customFonts: {
    pattern: /font-\[(?!Inter)/g,
    message: "Using custom fonts (should be Inter only)",
    severity: "error",
    category: "typography"
  },
  directHSL: {
    pattern: /hsl\(\d+,?\s*\d+%?,?\s*\d+%?\)/g,
    message: "Using direct HSL values instead of CSS variables",
    severity: "warning",
    category: "design-system"
  },
  missingArrowRight: {
    pattern: /variant=["']primary["'][^>]*>(?!.*ArrowRight)/g,
    message: "Primary button missing ArrowRight icon",
    severity: "info",
    category: "ux"
  }
};

const EXCLUDE_PATTERNS = [
  /node_modules/,
  /\.git/,
  /dist/,
  /build/,
  /\.config\./,
  /tailwind\.config/,
  /scripts/,
  /supabase/,
  /public/,
  /\.md$/,
  /integrations\/supabase\/types\.ts/,
  /integrations\/supabase\/client\.ts/,
  /vite-env\.d\.ts/
];

const COMPONENT_CATEGORIES = {
  pages: /^src\/pages\//,
  components: /^src\/components\//,
  ui: /^src\/ui\//,
  admin: /^src\/pages\/admin\//,
  business: /^src\/pages\/admin\/business\//,
  services: /^src\/pages\/services\//,
  markets: /^src\/pages\/markets\//,
  company: /^src\/pages\/company\//,
};

function categorizeFile(filePath) {
  for (const [category, pattern] of Object.entries(COMPONENT_CATEGORIES)) {
    if (pattern.test(filePath)) {
      return category;
    }
  }
  return 'other';
}

function scanFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const issues = [];

  Object.entries(PATTERNS).forEach(([key, { pattern, message, severity, category }]) => {
    lines.forEach((line, index) => {
      const matches = line.match(pattern);
      if (matches) {
        matches.forEach(match => {
          issues.push({
            file: filePath,
            line: index + 1,
            severity,
            category,
            type: key,
            message,
            code: line.trim(),
            match
          });
        });
      }
    });
  });

  return issues;
}

function scanDirectory(dir) {
  let allIssues = [];

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
        const issues = scanFile(fullPath);
        allIssues = allIssues.concat(issues);
      }
    }
  }

  walk(dir);
  return allIssues;
}

function generateReport(issues) {
  const byCategory = {};
  const byFile = {};
  const bySeverity = { error: [], warning: [], info: [] };
  const byComponentCategory = {};

  issues.forEach(issue => {
    // By category
    if (!byCategory[issue.category]) {
      byCategory[issue.category] = [];
    }
    byCategory[issue.category].push(issue);

    // By file
    if (!byFile[issue.file]) {
      byFile[issue.file] = [];
    }
    byFile[issue.file].push(issue);

    // By severity
    bySeverity[issue.severity].push(issue);

    // By component category
    const componentCat = categorizeFile(issue.file);
    if (!byComponentCategory[componentCat]) {
      byComponentCategory[componentCat] = [];
    }
    byComponentCategory[componentCat].push(issue);
  });

  return { byCategory, byFile, bySeverity, byComponentCategory };
}

function printReport(report) {
  const { byCategory, byFile, bySeverity, byComponentCategory } = report;

  console.log('\n╔══════════════════════════════════════════════════════════════════╗');
  console.log('║         🎨 DESIGN SYSTEM AUDIT REPORT                            ║');
  console.log('╚══════════════════════════════════════════════════════════════════╝\n');

  // Summary
  console.log('📊 SUMMARY');
  console.log('─────────────────────────────────────────────────────────────────');
  console.log(`Total Issues: ${bySeverity.error.length + bySeverity.warning.length + bySeverity.info.length}`);
  console.log(`  🔴 Errors: ${bySeverity.error.length}`);
  console.log(`  🟡 Warnings: ${bySeverity.warning.length}`);
  console.log(`  🔵 Info: ${bySeverity.info.length}\n`);

  // By Component Category
  console.log('📁 BREAKDOWN BY COMPONENT TYPE');
  console.log('─────────────────────────────────────────────────────────────────');
  Object.entries(byComponentCategory)
    .sort((a, b) => b[1].length - a[1].length)
    .forEach(([category, issues]) => {
      const errors = issues.filter(i => i.severity === 'error').length;
      const warnings = issues.filter(i => i.severity === 'warning').length;
      const infos = issues.filter(i => i.severity === 'info').length;
      console.log(`${category.toUpperCase().padEnd(20)} ${issues.length} issues (${errors}🔴 ${warnings}🟡 ${infos}🔵)`);
    });

  // By Issue Category
  console.log('\n🏷️  BREAKDOWN BY ISSUE TYPE');
  console.log('─────────────────────────────────────────────────────────────────');
  Object.entries(byCategory)
    .sort((a, b) => b[1].length - a[1].length)
    .forEach(([category, issues]) => {
      console.log(`${category.toUpperCase().padEnd(20)} ${issues.length} issues`);
    });

  // Migration Priority
  console.log('\n🎯 MIGRATION PRIORITY (Files needing /src/ui/ migration)');
  console.log('─────────────────────────────────────────────────────────────────');
  
  const migrationFiles = Object.entries(byFile)
    .filter(([_, issues]) => issues.some(i => i.category === 'migration'))
    .sort((a, b) => {
      const aCount = a[1].filter(i => i.category === 'migration').length;
      const bCount = b[1].filter(i => i.category === 'migration').length;
      return bCount - aCount;
    });

  if (migrationFiles.length === 0) {
    console.log('✅ All files migrated to /src/ui/ primitives!');
  } else {
    migrationFiles.slice(0, 20).forEach(([file, issues]) => {
      const migrationIssues = issues.filter(i => i.category === 'migration');
      console.log(`  ${file}`);
      console.log(`    → ${migrationIssues.length} old imports to replace`);
    });
    if (migrationFiles.length > 20) {
      console.log(`  ... and ${migrationFiles.length - 20} more files`);
    }
  }

  // Top Offenders
  console.log('\n🚨 TOP 10 FILES NEEDING ATTENTION');
  console.log('─────────────────────────────────────────────────────────────────');
  
  Object.entries(byFile)
    .sort((a, b) => b[1].length - a[1].length)
    .slice(0, 10)
    .forEach(([file, issues], index) => {
      const errors = issues.filter(i => i.severity === 'error').length;
      const warnings = issues.filter(i => i.severity === 'warning').length;
      console.log(`${index + 1}. ${file}`);
      console.log(`   ${issues.length} total issues (${errors} errors, ${warnings} warnings)`);
      
      // Show issue breakdown
      const issueTypes = {};
      issues.forEach(i => {
        if (!issueTypes[i.type]) issueTypes[i.type] = 0;
        issueTypes[i.type]++;
      });
      console.log(`   Types: ${Object.entries(issueTypes).map(([t, c]) => `${t}(${c})`).join(', ')}`);
    });

  // Recommendations
  console.log('\n💡 RECOMMENDATIONS');
  console.log('─────────────────────────────────────────────────────────────────');
  
  if (bySeverity.error.length > 0) {
    console.log('1. Fix all ERROR-level issues first (direct colors, old imports, hardcoded values)');
  }
  
  if (byCategory.migration && byCategory.migration.length > 0) {
    console.log('2. Migrate all components to use /src/ui/ primitives');
    console.log(`   Files affected: ${migrationFiles.length}`);
  }
  
  if (byCategory.spacing && byCategory.spacing.length > 0) {
    console.log('3. Standardize spacing to use py-16/py-20 per Brand Guidelines');
  }
  
  if (byCategory['design-system'] && byCategory['design-system'].length > 0) {
    console.log('4. Replace all hardcoded colors with semantic tokens from tokens.css');
  }

  console.log('\n📝 DETAILED REPORT');
  console.log('─────────────────────────────────────────────────────────────────');
  console.log('Run with --verbose flag for line-by-line details\n');
}

function printVerboseReport(issues) {
  const byFile = {};
  issues.forEach(issue => {
    if (!byFile[issue.file]) {
      byFile[issue.file] = [];
    }
    byFile[issue.file].push(issue);
  });

  Object.entries(byFile)
    .sort((a, b) => b[1].length - a[1].length)
    .forEach(([file, fileIssues]) => {
      console.log(`\n📄 ${file}`);
      console.log('─'.repeat(80));
      
      fileIssues.forEach(issue => {
        const icon = issue.severity === 'error' ? '🔴' : issue.severity === 'warning' ? '🟡' : '🔵';
        console.log(`${icon} Line ${issue.line}: ${issue.message}`);
        console.log(`   Category: ${issue.category} | Type: ${issue.type}`);
        console.log(`   Code: ${issue.code}`);
        console.log();
      });
    });
}

// Run the audit
const srcDir = path.join(process.cwd(), 'src');
const verbose = process.argv.includes('--verbose');

console.log('🔍 Scanning codebase for design violations...\n');

const issues = scanDirectory(srcDir);
const report = generateReport(issues);

printReport(report);

if (verbose) {
  printVerboseReport(issues);
}

// Exit code
const hasErrors = report.bySeverity.error.length > 0;
process.exit(hasErrors ? 1 : 0);
