const rateLimit = require('express-rate-limit');

// Global limiter: 100 requests per 15 minutes per IP
const globalRateLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000,
  max: parseInt(process.env.RATE_LIMIT_MAX) || 100,
  message: {
    success: false,
    message: 'Too many requests. Please try again after 15 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Auth limiter: stricter — 10 requests per 15 minutes
const authRateLimiter = rateLimit({
  windowMs: 900000,
  max: parseInt(process.env.AUTH_RATE_LIMIT_MAX) || 10,
  message: {
    success: false,
    message: 'Too many authentication attempts. Please wait before trying again.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Password reset limiter: 3 per hour
const passwordResetLimiter = rateLimit({
  windowMs: 3600000,
  max: 3,
  message: {
    success: false,
    message: 'Too many password reset requests.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { globalRateLimiter, authRateLimiter, passwordResetLimiter };
