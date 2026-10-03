#!/usr/bin/env node
/**
 * Install the exact Lovable lock graph without modifying tracked files.
 * Only the known private mirror's tarball prefix changes in a temporary copy;
 * package versions, dependency ranges and integrity hashes remain unchanged.
 * Bun's frozen-lockfile mode rejects any resolution changes or missing hashes.
 */
import { existsSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const repo = dirname(dirname(fileURLToPath(import.meta.url)));
const checkOnly = process.argv.includes('--check');
if (process.argv.slice(2).some(arg => arg !== '--check')) {
  throw new Error('Usage: node scripts/install-ci-dependencies.mjs [--check]');
}
if (!checkOnly && existsSync(join(repo, 'node_modules'))) {
  throw new Error('node_modules already exists; use --check to validate an isolated install.');
}

const mirror = 'https://europe-west4-npm.pkg.dev/lovable-core-prod/sandbox-npm-cache/';
const lock = readFileSync(join(repo, 'bun.lock'), 'utf8');
const translated = lock.replaceAll(mirror, 'https://registry.npmjs.org/');
const installDir = mkdtempSync(join(tmpdir(), 'agc-ci-deps-'));
try {
  writeFileSync(join(installDir, 'package.json'), readFileSync(join(repo, 'package.json')));
  writeFileSync(join(installDir, 'bun.lock'), translated);
  const result = spawnSync('bun', ['install', '--frozen-lockfile', '--registry', 'https://registry.npmjs.org'], {
    cwd: installDir,
    stdio: 'inherit',
    env: process.env,
  });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`Frozen dependency install failed (exit ${result.status}).`);
  if (readFileSync(join(installDir, 'bun.lock'), 'utf8') !== translated) {
    throw new Error('Bun changed the temporary lockfile; refusing to use a different dependency graph.');
  }
  if (!checkOnly) symlinkSync(join(installDir, 'node_modules'), join(repo, 'node_modules'), 'dir');
  console.log('Installed the locked dependency graph; repository package.json and bun.lock were unchanged.');
} catch (error) {
  rmSync(installDir, { recursive: true, force: true });
  throw error;
}
if (checkOnly) rmSync(installDir, { recursive: true, force: true });
