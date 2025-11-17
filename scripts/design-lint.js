#!/usr/bin/env node

/**
 * Design System Linter
 * Scans for forbidden CSS classes that violate brand guidelines
 */

const fs = require('fs');
const path = require('path');

const FORBIDDEN_PATTERNS = [
  {
    pattern: /\btext-white\b/g,
    message: "Use text-primary-foreground or text-foreground instead of text-white",
    severity: "error"
  },
  {
    pattern: /\bbg-black\b/g,
    message: "Use semantic background tokens instead of bg-black",
    severity: "error"
  },
  {
    pattern: /\bborder-white\b/g,
    message: "Use semantic border tokens instead of border-white",
    severity: "error"
  },
  {
    pattern: /\bpy-12\b/g,
    message: "Use py-16 or py-20 per Brand Guidelines",
    severity: "warning"
  },
  {
    pattern: /\bpy-14\b/g,
    message: "Use py-16 or py-20 per Brand Guidelines",
    severity: "warning"
  },
  {
    pattern: /\bpy-18\b/g,
    message: "Use py-16 or py-20 per Brand Guidelines",
    severity: "warning"
  }
];

const EXCLUDE_PATTERNS = [
  /node_modules/,
  /\.git/,
  /dist/,
  /build/,
  /\.config\./,
  /tailwind\.config/
];

function scanFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const issues = [];

  FORBIDDEN_PATTERNS.forEach(({ pattern, message, severity }) => {
    lines.forEach((line, index) => {
      if (pattern.test(line)) {
        issues.push({
          file: filePath,
          line: index + 1,
          severity,
          message,
          code: line.trim()
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

      // Skip excluded patterns
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

// Run the linter
const srcDir = path.join(process.cwd(), 'src');
const issues = scanDirectory(srcDir);

if (issues.length === 0) {
  console.log('✅ Design lint passed - no violations found');
  process.exit(0);
} else {
  console.log(`\n⚠️  Found ${issues.length} design violations:\n`);
  
  issues.forEach(issue => {
    const icon = issue.severity === 'error' ? '❌' : '⚠️';
    console.log(`${icon} ${issue.file}:${issue.line}`);
    console.log(`   ${issue.message}`);
    console.log(`   ${issue.code}\n`);
  });

  const errors = issues.filter(i => i.severity === 'error').length;
  const warnings = issues.filter(i => i.severity === 'warning').length;

  console.log(`Summary: ${errors} errors, ${warnings} warnings\n`);
  
  // Exit with error code if there are errors
  process.exit(errors > 0 ? 1 : 0);
}
