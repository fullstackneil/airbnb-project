#!/usr/bin/env node
// `npm test`: build a fresh SQLite database from the migrations and seeders,
// then run the API tests against it.
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const env = {
  ...process.env,
  NODE_ENV: 'test',
  DB_FILE: path.join(__dirname, '..', 'db', 'test.db'),
  JWT_SECRET: process.env.JWT_SECRET || 'test-only-secret',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '3600',
};

const run = (args) => {
  const result = spawnSync(process.execPath, args, { stdio: 'inherit', env, cwd: path.join(__dirname, '..') });
  if (result.status !== 0) process.exit(result.status ?? 1);
};

fs.rmSync(env.DB_FILE, { force: true });
const cli = require.resolve('sequelize-cli/lib/sequelize');
run([cli, 'db:migrate', '--env', 'test']);
run([cli, 'db:seed:all', '--env', 'test']);
// Pass files explicitly: `--test <dir>` isn't supported on every Node version.
const testFiles = process.argv.length > 2
  ? process.argv.slice(2)
  : fs.readdirSync(path.join(__dirname, '..', 'tests'))
      .filter((f) => f.endsWith('.test.js'))
      .map((f) => path.join('tests', f));
run(['--test', '--test-concurrency=1', ...testFiles]);
