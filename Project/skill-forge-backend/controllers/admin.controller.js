const User = require('../models/User');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const Certificate = require('../models/Certificate');
const Module = require('../models/Module');
const Lesson = require('../models/Lesson');
const Quiz = require('../models/Quiz');
const Question = require('../models/Question');
const LessonProgress = require('../models/LessonProgress');
const QuizAttempt = require('../models/QuizAttempt');
const Review = require('../models/Review');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

// GET /api/admin/users
const listUsers = asyncHandler(async (req, res) => {
  const { role, status, page = 1, limit = 20, search } = req.query;
  const filter = {};
  if (role) filter.role = role;
  if (status) filter.status = status;
  if (search) filter.$or = [
    { name: { $regex: search, $options: 'i' } },
    { email: { $regex: search, $options: 'i' } },
  ];

  const skip = (Number(page) - 1) * Number(limit);
  const [users, total] = await Promise.all([
    User.find(filter).select('-password').sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
    User.countDocuments(filter),
  ]);
  return res.status(200).json(new ApiResponse(200, 'Users fetched.', { users, total, page: Number(page) }));
});

// GET /api/admin/users/:id
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  if (!user) throw new ApiError(404, 'User not found.');
  return res.status(200).json(new ApiResponse(200, 'User fetched.', user));
});

// PATCH /api/admin/users/:id/status
const setUserStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!['active', 'banned'].includes(status)) throw new ApiError(400, 'Invalid status. Use active or banned.');

  const target = await User.findById(req.params.id);
  if (!target) throw new ApiError(404, 'User not found.');
  if (target.role === 'admin') throw new ApiError(400, 'Cannot change admin status.');
  if (target._id.toString() === req.user._id.toString()) throw new ApiError(400, 'Cannot change your own status.');

  target.status = status;
  await target.save();
  return res.status(200).json(new ApiResponse(200, `User ${status}.`, target));
});

// DELETE /api/admin/users/:id
const deleteUser = asyncHandler(async (req, res) => {
  const target = await User.findById(req.params.id);
  if (!target) throw new ApiError(404, 'User not found.');
  if (target.role === 'admin') throw new ApiError(400, 'Cannot delete admin account.');
  await User.findByIdAndDelete(req.params.id);
  return res.status(200).json(new ApiResponse(200, 'User deleted.'));
});

// GET /api/admin/instructors/pending
const listPendingInstructors = asyncHandler(async (req, res) => {
  const instructors = await User.find({ role: 'instructor', status: 'pending' }).select('-password');
  return res.status(200).json(new ApiResponse(200, 'Pending instructors.', instructors));
});

// PATCH /api/admin/instructors/:id/approve
const approveInstructor = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new ApiError(404, 'User not found.');
  if (user.role !== 'instructor') throw new ApiError(400, 'User is not an instructor.');
  user.status = 'active';
  await user.save();
  return res.status(200).json(new ApiResponse(200, 'Instructor approved.', user));
});

// PATCH /api/admin/instructors/:id/reject
const rejectInstructor = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new ApiError(404, 'User not found.');
  if (user.role !== 'instructor') throw new ApiError(400, 'User is not an instructor.');
  user.status = 'banned';
  await user.save();
  return res.status(200).json(new ApiResponse(200, 'Instructor rejected.', user));
});

// GET /api/admin/courses/pending
const listPendingCourses = asyncHandler(async (req, res) => {
  const courses = await Course.find({ status: 'pending' })
    .populate('instructor', 'name email')
    .populate('category', 'name')
    .sort({ createdAt: -1 });
  return res.status(200).json(new ApiResponse(200, 'Pending courses.', courses));
});

// PATCH /api/admin/courses/:id/approve
const approveCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) throw new ApiError(404, 'Course not found.');
  if (course.status !== 'pending') throw new ApiError(400, 'Course is not pending review.');
  course.status = 'approved';
  course.rejectionReason = '';
  await course.save();
  return res.status(200).json(new ApiResponse(200, 'Course approved and live.', course));
});

// PATCH /api/admin/courses/:id/reject
const rejectCourse = asyncHandler(async (req, res) => {
  const { reason } = req.body;
  if (!reason) throw new ApiError(400, 'Rejection reason is required.');
  const course = await Course.findById(req.params.id);
  if (!course) throw new ApiError(404, 'Course not found.');
  course.status = 'rejected';
  course.rejectionReason = reason;
  await course.save();
  return res.status(200).json(new ApiResponse(200, 'Course rejected.', course));
});

// GET /api/admin/courses — all courses any status
const listAllCourses = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;
  const filter = status ? { status } : {};
  const skip = (Number(page) - 1) * Number(limit);
  const [courses, total] = await Promise.all([
    Course.find(filter).populate('instructor', 'name').populate('category', 'name').sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
    Course.countDocuments(filter),
  ]);
  return res.status(200).json(new ApiResponse(200, 'All courses.', { courses, total }));
});

// GET /api/admin/analytics
const getAnalytics = asyncHandler(async (req, res) => {
  const [
    totalUsers, totalStudents, totalInstructors, totalPendingInstructors,
    totalCourses, totalApprovedCourses, totalPendingCourses,
    totalEnrollments, totalCertificates,
    recentEnrollments, topCourses,
  ] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ role: 'student' }),
    User.countDocuments({ role: 'instructor' }),
    User.countDocuments({ role: 'instructor', status: 'pending' }),
    Course.countDocuments(),
    Course.countDocuments({ status: 'approved' }),
    Course.countDocuments({ status: 'pending' }),
    Enrollment.countDocuments(),
    Certificate.countDocuments(),
    Enrollment.find().sort({ createdAt: -1 }).limit(5)
      .populate('student', 'name').populate('course', 'title'),
    Course.find({ status: 'approved' }).sort({ totalEnrollments: -1 }).limit(5)
      .select('title totalEnrollments averageRating thumbnail'),
  ]);

  const revenueResult = await Enrollment.aggregate([
    { $group: { _id: null, total: { $sum: '$amountPaid' } } },
  ]);
  const totalRevenue = revenueResult[0]?.total || 0;

  return res.status(200).json(new ApiResponse(200, 'Analytics fetched.', {
    totalUsers, totalStudents, totalInstructors, totalPendingInstructors,
    totalCourses, totalApprovedCourses, totalPendingCourses,
    totalEnrollments, totalCertificatesIssued: totalCertificates, totalRevenue,
    recentEnrollments, topCourses,
  }));
});

module.exports = {
  listUsers, getUserById, setUserStatus, deleteUser,
  listPendingInstructors, approveInstructor, rejectInstructor,
  listPendingCourses, approveCourse, rejectCourse, listAllCourses,
  getAnalytics,
};
