import { ESLint } from 'eslint';
import { readFile } from 'node:fs/promises';
import { relative } from 'node:path';
const baseline = JSON.parse(await readFile('config/lint-baseline.json', 'utf8'));
const results = await new ESLint().lintFiles(['.']);
let regressions = 0, errors = 0, warnings = 0;
for (const file of results) {
  errors += file.errorCount; warnings += file.warningCount;
  const path = relative(process.cwd(), file.filePath);
  const counts = {};
  for (const message of file.messages) {
    const key = `${message.severity}:${message.ruleId}`;
    counts[key] = (counts[key] || 0) + 1;
  }
  for (const [rule, count] of Object.entries(counts)) {
    if (count > (baseline[path]?.[rule] || 0)) {
      console.error(`${path}: ${rule} increased to ${count} (allowed ${baseline[path]?.[rule] || 0})`);
      regressions++;
    }
  }
}
console.log(`Lint: ${errors} errors, ${warnings} warnings; ${regressions} file/rule regressions.`);
if (regressions || errors > 205 || warnings > 29) process.exitCode = 1;
