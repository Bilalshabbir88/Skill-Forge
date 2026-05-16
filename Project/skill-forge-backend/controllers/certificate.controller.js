const Certificate = require('../models/Certificate');
const Enrollment = require('../models/Enrollment');
const User = require('../models/User');
const Course = require('../models/Course');
const generateCertificateId = require('../utils/generateCertificateId');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

// GET /api/certificates/my
const getMyCertificates = asyncHandler(async (req, res) => {
  const certs = await Certificate.find({ student: req.user._id })
    .populate('course', 'title thumbnail')
    .sort({ issuedAt: -1 });
  return res.status(200).json(new ApiResponse(200, 'Certificates fetched.', certs));
});

// POST /api/certificates/claim/:courseId
const claimCertificate = asyncHandler(async (req, res) => {
  const enrollment = await Enrollment.findOne({ student: req.user._id, course: req.params.courseId });
  if (!enrollment) throw new ApiError(403, 'Not enrolled in this course.');
  if (!enrollment.isCompleted) throw new ApiError(400, 'You have not completed this course yet.');

  // Return existing certificate if already claimed
  const existing = await Certificate.findOne({ student: req.user._id, course: req.params.courseId });
  if (existing) return res.status(200).json(new ApiResponse(200, 'Certificate already issued.', existing));

  const [student, course] = await Promise.all([
    User.findById(req.user._id).select('name'),
    Course.findById(req.params.courseId).populate('instructor', 'name'),
  ]);

  const certificateId = generateCertificateId();
  const verificationUrl = `${process.env.CLIENT_URL}/verify/${certificateId}`;

  const cert = await Certificate.create({
    certificateId,
    student: req.user._id,
    course: req.params.courseId,
    studentName: student.name,
    courseTitle: course.title,
    instructorName: course.instructor.name,
    verificationUrl,
  });

  return res.status(201).json(new ApiResponse(201, 'Certificate issued!', cert));
});

// GET /api/certificates/verify/:certificateId — PUBLIC
const verifyCertificate = asyncHandler(async (req, res) => {
  const cert = await Certificate.findOne({ certificateId: req.params.certificateId });
  if (!cert) throw new ApiError(404, 'Certificate not found or invalid.');
  return res.status(200).json(new ApiResponse(200, 'Certificate verified.', cert));
});

module.exports = { getMyCertificates, claimCertificate, verifyCertificate };
