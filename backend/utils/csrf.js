// CSRF protection using the double-submit cookie pattern (csrf-csrf).
//
// Tokens are bound to the caller's identity: the JWT session cookie when
// logged in, otherwise a random per-browser id. Because logging in or out
// changes that identity, those routes call refreshCsrfToken() so the browser
// immediately receives a token that matches its new session.
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { doubleCsrf } = require('csrf-csrf');
const { environment, jwtConfig } = require('../config');

const isProduction = environment === 'production';
const ANON_ID_COOKIE = isProduction ? '__Host-anon-id' : 'anon-id';

const cookieOptions = {
  sameSite: 'lax',
  path: '/',
  secure: isProduction,
  httpOnly: true,
};

// Only a currently valid JWT counts as a session; an expired or tampered one
// falls back to the anonymous id, matching what restoreUser will decide.
const sessionToken = (req) => {
  const { token } = req.cookies;
  if (!token) return null;
  try {
    jwt.verify(token, jwtConfig.secret);
    return token;
  } catch {
    return null;
  }
};

const { doubleCsrfProtection, generateCsrfToken } = doubleCsrf({
  getSecret: () => jwtConfig.secret,
  getSessionIdentifier: (req) => sessionToken(req) || req.cookies[ANON_ID_COOKIE] || '',
  cookieName: isProduction ? '__Host-psifi.x-csrf-token' : 'x-csrf-token',
  cookieOptions,
  // The frontend sends the token from the XSRF-TOKEN cookie in this header.
  getCsrfTokenFromRequest: (req) => req.headers['xsrf-token'],
});

// Give every browser a stable anonymous id so tokens issued before login are
// still bound to something specific to that browser.
const ensureAnonId = (req, res, next) => {
  if (!req.cookies[ANON_ID_COOKIE]) {
    const id = crypto.randomUUID();
    res.cookie(ANON_ID_COOKIE, id, cookieOptions);
    req.cookies[ANON_ID_COOKIE] = id;
  }
  next();
};

// Issue a token and expose it to the frontend via the readable XSRF-TOKEN
// cookie (csrfFetch copies it into the XSRF-Token header).
const setCsrfCookie = (req, res, { overwrite = false } = {}) => {
  const token = generateCsrfToken(req, res, { overwrite });
  res.cookie('XSRF-TOKEN', token, { sameSite: 'lax', path: '/', secure: isProduction });
  return token;
};

// Call after the session cookie changes (login, signup, logout). Pass the new
// JWT, or null when logging out.
const refreshCsrfToken = (req, res, newSessionToken) => {
  if (newSessionToken) req.cookies.token = newSessionToken;
  else delete req.cookies.token;
  return setCsrfCookie(req, res, { overwrite: true });
};

module.exports = { doubleCsrfProtection, ensureAnonId, setCsrfCookie, refreshCsrfToken };
