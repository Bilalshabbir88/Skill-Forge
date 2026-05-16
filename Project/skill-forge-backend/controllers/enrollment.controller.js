const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

// POST /api/enrollments
const enroll = asyncHandler(async (req, res) => {
  const { courseId, paymentMethod } = req.body;

  const course = await Course.findById(courseId);
  if (!course) throw new ApiError(404, 'Course not found.');
  if (course.status !== 'approved') throw new ApiError(400, 'Course is not available for enrollment.');

  const existing = await Enrollment.findOne({ student: req.user._id, course: courseId });
  if (existing) throw new ApiError(409, 'Already enrolled in this course.');

  let paymentStatus, amountPaid;
  if (course.isFree) {
    paymentStatus = 'free';
    amountPaid = 0;
  } else {
    if (paymentMethod !== 'mock') throw new ApiError(400, 'Invalid payment method.');
    paymentStatus = 'mock_paid';
    amountPaid = course.price;
  }

  const enrollment = await Enrollment.create({
    student: req.user._id,
    course: courseId,
    paymentStatus,
    amountPaid,
  });

  // Add to user's enrolledCourses and increment course counter
  await Promise.all([
    User.findByIdAndUpdate(req.user._id, { $addToSet: { enrolledCourses: courseId } }),
    Course.findByIdAndUpdate(courseId, { $inc: { totalEnrollments: 1 } }),
  ]);

  return res.status(201).json(new ApiResponse(201, 'Enrolled successfully!', enrollment));
});

// GET /api/enrollments/my
const getMyEnrollments = asyncHandler(async (req, res) => {
  const enrollments = await Enrollment.find({ student: req.user._id })
    .populate({
      path: 'course',
      select: 'title thumbnail instructor category price isFree difficulty totalLessons totalDuration averageRating status',
      populate: [
        { path: 'instructor', select: 'name profilePicture' },
        { path: 'category', select: 'name' },
      ],
    })
    .sort({ createdAt: -1 });

  return res.status(200).json(new ApiResponse(200, 'Enrollments fetched.', enrollments));
});

// GET /api/enrollments/check/:courseId
const checkEnrollment = asyncHandler(async (req, res) => {
  const enrollment = await Enrollment.findOne({ student: req.user._id, course: req.params.courseId });
  return res.status(200).json(new ApiResponse(200, 'Enrollment status.', {
    enrolled: !!enrollment,
    enrollment: enrollment || null,
  }));
});

// DELETE /api/enrollments/:courseId
const unenroll = asyncHandler(async (req, res) => {
  const enrollment = await Enrollment.findOneAndDelete({ student: req.user._id, course: req.params.courseId });
  if (!enrollment) throw new ApiError(404, 'Enrollment not found.');

  await Promise.all([
    User.findByIdAndUpdate(req.user._id, { $pull: { enrolledCourses: req.params.courseId } }),
    Course.findByIdAndUpdate(req.params.courseId, { $inc: { totalEnrollments: -1 } }),
  ]);

  return res.status(200).json(new ApiResponse(200, 'Unenrolled successfully.'));
});

module.exports = { enroll, getMyEnrollments, checkEnrollment, unenroll };
