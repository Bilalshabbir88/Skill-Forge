const crypto = require('crypto');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const sendEmail = require('../utils/sendEmail');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

// ── Register ────────────────────────────────────────────────────────────────
const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  if (role === 'admin') throw new ApiError(400, 'Admin accounts cannot be self-registered.');

  const existing = await User.findOne({ email });
  if (existing) throw new ApiError(409, 'Email already registered.');

  const user = await User.create({ name, email, password, role });
  const token = generateToken({ id: user._id, role: user.role });

  const userData = { ...user.toObject() };
  delete userData.password;

  return res.status(201).json(
    new ApiResponse(201, role === 'instructor'
      ? 'Registration successful! Your account is pending admin approval.'
      : 'Registration successful!',
    { token, user: userData })
  );
});

// ── Login ────────────────────────────────────────────────────────────────────
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user) throw new ApiError(401, 'Invalid email or password.');

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new ApiError(401, 'Invalid email or password.');

  if (user.status === 'banned') throw new ApiError(403, 'Your account has been banned.');
  if (user.role === 'instructor' && user.status === 'pending') {
    throw new ApiError(403, 'Your instructor account is pending admin approval.');
  }

  const token = generateToken({ id: user._id, role: user.role });
  const userData = user.toObject();
  delete userData.password;

  return res.status(200).json(new ApiResponse(200, 'Login successful.', { token, user: userData }));
});

// ── Google OAuth Callback ────────────────────────────────────────────────────
const googleCallback = asyncHandler(async (req, res) => {
  const user = req.user;
  const token = generateToken({ id: user._id, role: user.role });
  res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${token}`);
});

// ── Get Me ──────────────────────────────────────────────────────────────────
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  return res.status(200).json(new ApiResponse(200, 'Profile fetched.', user));
});

// ── Logout ──────────────────────────────────────────────────────────────────
const logout = asyncHandler(async (req, res) => {
  return res.status(200).json(new ApiResponse(200, 'Logged out successfully.'));
});

// ── Forgot Password ──────────────────────────────────────────────────────────
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  // Always return generic response to prevent email enumeration
  if (!user) {
    return res.status(200).json(new ApiResponse(200, 'If that email exists, a reset link has been sent.'));
  }

  // Generate raw token, hash it for storage
  const rawToken = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');

  user.passwordResetToken = hashedToken;
  user.passwordResetExpires = Date.now() + 15 * 60 * 1000; // 15 minutes
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${rawToken}`;

  try {
    await sendEmail({
      to: user.email,
      subject: 'SkillForge — Password Reset Request',
      html: `
        <h2>Password Reset</h2>
        <p>You requested a password reset for your SkillForge account.</p>
        <p>Click the link below to reset your password. This link expires in 15 minutes.</p>
        <a href="${resetUrl}" style="background:#2563eb;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;display:inline-block;">Reset Password</a>
        <p>If you did not request this, ignore this email.</p>
      `,
    });
  } catch {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    throw new ApiError(500, 'Failed to send reset email. Try again later.');
  }

  return res.status(200).json(new ApiResponse(200, 'If that email exists, a reset link has been sent.'));
});

// ── Reset Password ───────────────────────────────────────────────────────────
const resetPassword = asyncHandler(async (req, res) => {
  const { token, newPassword } = req.body;
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  }).select('+password');

  if (!user) throw new ApiError(400, 'Invalid or expired reset token.');

  user.password = newPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  const jwtToken = generateToken({ id: user._id, role: user.role });
  return res.status(200).json(new ApiResponse(200, 'Password reset successful.', { token: jwtToken }));
});

module.exports = { register, login, googleCallback, getMe, logout, forgotPassword, resetPassword };
