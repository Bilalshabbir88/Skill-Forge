const express = require('express');
const router = express.Router();
const passport = require('passport');
const { register, login, googleCallback, getMe, logout, forgotPassword, resetPassword } = require('../controllers/auth.controller');
const validate = require('../middleware/validate.middleware');
const { verifyToken } = require('../middleware/auth.middleware');
const { authRateLimiter, passwordResetLimiter } = require('../middleware/rateLimiter.middleware');
const Joi = require('joi');

const registerSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).pattern(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/).required()
    .messages({ 'string.pattern.base': 'Password must contain uppercase, number, and special character.' }),
  role: Joi.string().valid('student', 'instructor').required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const forgotSchema = Joi.object({ email: Joi.string().email().required() });
const resetSchema = Joi.object({
  token: Joi.string().required(),
  newPassword: Joi.string().min(8).required(),
});

router.post('/register', authRateLimiter, validate(registerSchema), register);
router.post('/login', authRateLimiter, validate(loginSchema), login);
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));
router.get('/google/callback', passport.authenticate('google', { session: false, failureRedirect: '/login' }), googleCallback);
router.post('/forgot-password', passwordResetLimiter, validate(forgotSchema), forgotPassword);
router.post('/reset-password', validate(resetSchema), resetPassword);
router.get('/me', verifyToken, getMe);
router.post('/logout', verifyToken, logout);

module.exports = router;
