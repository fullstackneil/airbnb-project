// Runs in its own process (node --test isolates files), so the limiter's
// in-memory counters start from zero here.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { newClient } = require('./helpers');

test('successful logins never hit the login limit', async () => {
  const client = await newClient();
  for (let i = 0; i < 12; i++) {
    assert.equal((await client.login()).status, 200);
  }
});

test('the 11th failed login in the window is refused with 429', async () => {
  const client = await newClient();
  for (let i = 0; i < 10; i++) {
    assert.equal((await client.login({ credential: 'Demo-User', password: `wrong-${i}` })).status, 401);
  }
  const blocked = await client.login({ credential: 'Demo-User', password: 'wrong-again' });
  assert.equal(blocked.status, 429);
  assert.match(blocked.body.message, /Too many failed login attempts/);
  // The real password is refused too while the limit is active.
  assert.equal((await client.login()).status, 429);
});
