// Rate limits for the credential endpoints, to slow down password guessing
// and bulk account creation. Keyed by client IP, so `trust proxy` must be set
// correctly in app.js or every visitor would share one counter.
const { rateLimit } = require('express-rate-limit');
const { environment } = require('../config');

// Behind Render's load balancer, req.ip is only the visitor's address once
// TRUST_PROXY_HOPS is set to the measured number of proxies. Until then, a
// production limiter would key every visitor on the proxy's IP and lock
// everyone out together, so it stays off (with a warning) instead.
const proxyUnconfigured = environment === 'production' && !process.env.TRUST_PROXY_HOPS;
if (proxyUnconfigured) {
  console.warn('[rate-limit] TRUST_PROXY_HOPS is not set; login/sign-up rate limiting is disabled.');
}
const skip = () => proxyUnconfigured;

const tooMany = (message) => (_req, res, _next, options) =>
  res.status(options.statusCode).json({
    title: 'Too many requests',
    message,
    errors: { message },
  });

// Failed logins only: successful ones don't count against the limit.
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  skipSuccessfulRequests: true,
  skip,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  handler: tooMany('Too many failed login attempts. Please try again in 15 minutes.'),
});

const signupLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 10,
  skip,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  handler: tooMany('Too many accounts created from this network. Please try again later.'),
});

module.exports = { loginLimiter, signupLimiter };
