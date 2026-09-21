const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const { request, app, newClient, validSpot } = require('./helpers');

describe('public reads', () => {
  test('lists the seeded spots', async () => {
    const res = await request(app).get('/api/spots');
    assert.equal(res.status, 200);
    assert.ok(res.body.spots.length >= 20);
  });

  test('missing spot returns 404', async () => {
    const res = await request(app).get('/api/spots/999999');
    assert.equal(res.status, 404);
  });
});

describe('CSRF protection', () => {
  test('rejects a state-changing request without a token', async () => {
    const res = await request(app).post('/api/session').send({ credential: 'Demo-User', password: 'password' });
    assert.equal(res.status, 403);
  });

  test("rejects another browser's token", async () => {
    const a = await newClient();
    const b = await newClient();
    const res = await b.agent.post('/api/session').set('XSRF-Token', a.csrf).send({ credential: 'Demo-User', password: 'password' });
    assert.equal(res.status, 403);
  });

  test('issues a new token on login and rejects the pre-login token afterwards', async () => {
    const client = await newClient();
    const before = client.csrf;
    const login = await client.login();
    assert.equal(login.status, 200);
    assert.notEqual(client.csrf, before, 'login should rotate the CSRF token');

    const stale = await client.agent.post('/api/spots').set('XSRF-Token', before).send(validSpot());
    assert.equal(stale.status, 403);

    const fresh = await client.post('/api/spots', validSpot());
    assert.equal(fresh.status, 201);
  });

  test('logout rotates the token and the new one works for logging back in', async () => {
    const client = await newClient();
    await client.login();
    const out = await client.delete('/api/session');
    assert.equal(out.status, 200);
    assert.equal((await client.get('/api/session')).body.user, null);
    assert.equal((await client.login()).status, 200);
  });
});

describe('sessions and sign-up', () => {
  test('wrong password returns 401', async () => {
    const client = await newClient();
    const res = await client.login({ credential: 'Demo-User', password: 'wrong-password' });
    assert.equal(res.status, 401);
  });

  test('sign-up validates input with the server rules', async () => {
    const client = await newClient();
    const res = await client.post('/api/users', {
      firstName: 'Al', lastName: 'Kenobi', email: 'not-an-email', username: 'ab@c.de', password: '123',
    });
    assert.equal(res.status, 400);
    assert.deepEqual(Object.keys(res.body.errors).sort(), ['email', 'firstName', 'password', 'username']);
  });

  test('valid sign-up logs the new user in', async () => {
    const client = await newClient();
    const name = `user${Date.now()}`;
    const res = await client.post('/api/users', {
      firstName: 'Obi', lastName: 'Kenobi', email: `${name}@jedi.org`, username: name, password: 'secret123',
    });
    assert.equal(res.status, 200);
    // The session endpoint returns email (username is hidden by the model's default scope).
    assert.equal((await client.get('/api/session')).body.user.email, `${name}@jedi.org`);
  });
});

describe('spot validation', () => {
  test('requires authentication', async () => {
    const client = await newClient();
    const res = await client.post('/api/spots', validSpot());
    assert.equal(res.status, 401);
  });

  test('returns the spec messages for invalid fields', async () => {
    const client = await newClient();
    await client.login();
    const res = await client.post('/api/spots', validSpot({
      city: '  ', lat: 100, lng: -200, name: 'x'.repeat(50), price: 0, description: undefined,
    }));
    assert.equal(res.status, 400);
    assert.deepEqual(res.body.errors, {
      city: 'City is required',
      lat: 'Latitude must be within -90 and 90',
      lng: 'Longitude must be within -180 and 180',
      name: 'Name must be less than 50 characters',
      description: 'Description is required',
      price: 'Price per day must be a positive number',
    });
  });

  test('coordinates are optional, and 0 is a valid coordinate', async () => {
    const client = await newClient();
    await client.login();
    const noCoords = await client.post('/api/spots', validSpot({ lat: null, lng: null }));
    assert.equal(noCoords.status, 201);
    const zero = await client.post('/api/spots', validSpot({ lat: 0, lng: 0 }));
    assert.equal(zero.status, 201);
    assert.equal(zero.body.lat, 0);
  });

  test("can't update someone else's spot", async () => {
    const client = await newClient();
    await client.login();
    const res = await client.put('/api/spots/1', validSpot());
    assert.equal(res.status, 403);
  });

  test('owner can update and delete their spot', async () => {
    const client = await newClient();
    await client.login();
    const { body: spot } = await client.post('/api/spots', validSpot());
    const updated = await client.put(`/api/spots/${spot.id}`, validSpot({ address: spot.address, price: 120 }));
    assert.equal(updated.status, 200);
    assert.equal(Number(updated.body.price), 120);
    assert.equal((await client.delete(`/api/spots/${spot.id}`)).status, 200);
    assert.equal((await client.get(`/api/spots/${spot.id}`)).status, 404);
  });
});

describe('reviews', () => {
  test("owners can't review their own spot", async () => {
    const client = await newClient();
    await client.login();
    const { body: spot } = await client.post('/api/spots', validSpot());
    const res = await client.post(`/api/spots/${spot.id}/reviews`, { review: 'My own place is great', stars: 5 });
    assert.equal(res.status, 403);
    assert.equal(res.body.message, "You can't review your own spot");
  });

  test('validates stars and review text', async () => {
    const client = await newClient();
    await client.login();
    const res = await client.post('/api/spots/2/reviews', { review: '', stars: 6 });
    assert.equal(res.status, 400);
    assert.deepEqual(res.body.errors, {
      review: 'Review text is required',
      stars: 'Stars must be an integer from 1 to 5',
    });
  });

  test('a valid review is created once, then duplicates are rejected', async () => {
    const client = await newClient();
    await client.login();
    const first = await client.post('/api/spots/3/reviews', { review: 'Lovely stay overall', stars: 4 });
    assert.equal(first.status, 201);
    const again = await client.post('/api/spots/3/reviews', { review: 'Second review attempt', stars: 3 });
    assert.equal(again.status, 403);
    assert.equal((await client.delete(`/api/reviews/${first.body.id}`)).status, 200);
  });
});
