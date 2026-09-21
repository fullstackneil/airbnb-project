// Shared helpers for the API tests. Each "client" is a supertest agent with
// its own cookie jar, i.e. one browser.
const request = require('supertest');
const app = require('../app');

const DEMO = { credential: 'Demo-User', password: 'password' };

// Read the XSRF-TOKEN cookie a response set, if any.
const xsrfFrom = (res) => {
  const cookie = (res.headers['set-cookie'] || []).find((c) => c.startsWith('XSRF-TOKEN='));
  return cookie ? decodeURIComponent(cookie.split(';')[0].split('=')[1]) : null;
};

// A browser session: tracks cookies and the current CSRF token, and sends the
// token on every state-changing request like the frontend's csrfFetch does.
const newClient = async () => {
  const agent = request.agent(app);
  const client = { agent, csrf: null };
  const res = await agent.get('/api/csrf/restore');
  client.csrf = res.body['XSRF-Token'];

  const send = (method) => async (url, body) => {
    let req = agent[method](url).set('XSRF-Token', client.csrf || '');
    if (body !== undefined) req = req.send(body);
    const out = await req;
    // Login/logout/signup rotate the token; keep using the newest one.
    client.csrf = xsrfFrom(out) || client.csrf;
    return out;
  };

  client.get = (url) => agent.get(url);
  client.post = send('post');
  client.put = send('put');
  client.delete = send('delete');
  client.login = (creds = DEMO) => client.post('/api/session', creds);
  return client;
};

const validSpot = (overrides = {}) => ({
  address: `${Math.random().toString(36).slice(2)} Test Street`,
  city: 'Mos Espa',
  state: 'Tatooine',
  country: 'Outer Rim',
  lat: -33.87,
  lng: 151.2,
  name: 'Test Spot',
  description: 'A description that is comfortably long enough.',
  price: 99.99,
  ...overrides,
});

module.exports = { app, request, newClient, xsrfFrom, validSpot, DEMO };
