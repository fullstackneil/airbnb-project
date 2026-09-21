#!/usr/bin/env node
// Wrapper around sequelize-cli used by `npm run sequelize`.
//
// Render's build command runs `db:seed:undo:all` and `db:migrate:undo:all`
// before migrating and seeding, which wiped every user, spot and review on
// each deploy. In production this wrapper skips those destructive commands
// (unless ALLOW_DB_RESET=true), so a deploy only applies new migrations and
// seeders that haven't run yet. Everything else is passed straight through.
const { spawnSync } = require('child_process');

const DESTRUCTIVE = new Set([
  'db:seed:undo', 'db:seed:undo:all',
  'db:migrate:undo', 'db:migrate:undo:all',
  'db:drop',
]);

const args = process.argv.slice(2);
const command = args.find((arg) => !arg.startsWith('-'));
const isProduction = process.env.NODE_ENV === 'production';

if (isProduction && DESTRUCTIVE.has(command) && process.env.ALLOW_DB_RESET !== 'true') {
  console.log(`[sequelize-guard] Skipping "${command}" in production to keep existing data.`);
  console.log('[sequelize-guard] Set ALLOW_DB_RESET=true to run it deliberately.');
  process.exit(0);
}

const cli = require.resolve('sequelize-cli/lib/sequelize');
const result = spawnSync(process.execPath, [cli, ...args], { stdio: 'inherit' });
process.exit(result.status ?? 1);
