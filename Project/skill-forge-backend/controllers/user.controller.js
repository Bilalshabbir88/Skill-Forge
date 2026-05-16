const User = require('../models/User');
const Course = require('../models/Course');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

// GET /api/users/profile
const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  return res.status(200).json(new ApiResponse(200, 'Profile fetched.', user));
});

// PUT /api/users/profile
const updateProfile = asyncHandler(async (req, res) => {
  const { name, bio, phone, profilePicture, socialLinks } = req.body;
  const updates = {};
  if (name !== undefined) updates.name = name;
  if (bio !== undefined) updates.bio = bio;
  if (phone !== undefined) updates.phone = phone;
  if (profilePicture !== undefined) updates.profilePicture = profilePicture;
  if (socialLinks !== undefined) updates.socialLinks = socialLinks;

  const user = await User.findByIdAndUpdate(req.user._id, updates, {
    new: true, runValidators: true,
  }).select('-password');

  return res.status(200).json(new ApiResponse(200, 'Profile updated.', user));
});

// PUT /api/users/change-password
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id).select('+password');

  if (!user.password) {
    throw new ApiError(400, 'Cannot change password for Google OAuth accounts.');
  }

  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) throw new ApiError(400, 'Current password is incorrect.');

  if (currentPassword === newPassword) {
    throw new ApiError(400, 'New password must be different from current password.');
  }

  user.password = newPassword;
  await user.save();

  return res.status(200).json(new ApiResponse(200, 'Password changed successfully.'));
});

// GET /api/users/:id/public
const getPublicProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('name bio profilePicture role socialLinks createdAt');
  if (!user) throw new ApiError(404, 'User not found.');

  let courses = [];
  if (user.role === 'instructor') {
    courses = await Course.find({ instructor: user._id, status: 'approved' })
      .select('title thumbnail averageRating totalEnrollments price isFree difficulty')
      .limit(10);
  }

  return res.status(200).json(new ApiResponse(200, 'Public profile fetched.', { user, courses }));
});

module.exports = { getProfile, updateProfile, changePassword, getPublicProfile };
