const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const Enrollment = require('../models/Enrollment');

// Verify JWT token and attach user to req
const verifyToken = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    throw new ApiError(401, 'Access denied. No token provided.');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      throw new ApiError(401, 'User not found. Token is invalid.');
    }

    if (user.status === 'banned') {
      throw new ApiError(403, 'Your account has been banned.');
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') throw new ApiError(401, 'Invalid token.');
    if (error.name === 'TokenExpiredError') throw new ApiError(401, 'Token expired. Please log in again.');
    throw error;
  }
});

// Require specific roles
const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(401, 'Not authenticated.'));
    }
    if (!roles.includes(req.user.role)) {
      return next(new ApiError(403, `Access denied. Required role: ${roles.join(' or ')}.`));
    }
    next();
  };
};

// Require approved instructor
const requireApprovedInstructor = (req, res, next) => {
  if (!req.user) return next(new ApiError(401, 'Not authenticated.'));
  if (req.user.role !== 'instructor') return next(new ApiError(403, 'Instructors only.'));
  if (req.user.status === 'pending') {
    return next(new ApiError(403, 'Your instructor account is pending admin approval.'));
  }
  if (req.user.status === 'banned') {
    return next(new ApiError(403, 'Your account has been banned.'));
  }
  next();
};

// Optional auth — attaches user if token present, but doesn't block if missing
const optionalAuth = asyncHandler(async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
    } catch {
      // Token invalid — proceed without user
      req.user = null;
    }
  }
  next();
});

// Verify student is enrolled in req.params.courseId
const requireEnrolled = asyncHandler(async (req, res, next) => {
  const courseId = req.params.courseId || req.body.courseId;
  if (!courseId) return next(new ApiError(400, 'Course ID required.'));

  // Instructors and admins bypass enrollment check
  if (req.user.role === 'instructor' || req.user.role === 'admin') return next();

  const enrollment = await Enrollment.findOne({
    student: req.user._id,
    course: courseId,
  });

  if (!enrollment) {
    return next(new ApiError(403, 'You must be enrolled in this course.'));
  }

  req.enrollment = enrollment;
  next();
});

module.exports = { verifyToken, requireRole, requireApprovedInstructor, optionalAuth, requireEnrolled };
