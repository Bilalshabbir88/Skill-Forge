const Course = require('../models/Course');
const Module = require('../models/Module');
const Lesson = require('../models/Lesson');
const Quiz = require('../models/Quiz');
const Question = require('../models/Question');
const Enrollment = require('../models/Enrollment');
const LessonProgress = require('../models/LessonProgress');
const QuizAttempt = require('../models/QuizAttempt');
const Review = require('../models/Review');
const Certificate = require('../models/Certificate');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

// Helper: cascade delete course and all related data
const cascadeDeleteCourse = async (courseId) => {
  const modules = await Module.find({ course: courseId });
  const moduleIds = modules.map((m) => m._id);
  const lessons = await Lesson.find({ course: courseId });
  const lessonIds = lessons.map((l) => l._id);
  const quizzes = await Quiz.find({ course: courseId });
  const quizIds = quizzes.map((q) => q._id);

  await Promise.all([
    Question.deleteMany({ quiz: { $in: quizIds } }),
    Quiz.deleteMany({ course: courseId }),
    LessonProgress.deleteMany({ course: courseId }),
    QuizAttempt.deleteMany({ course: courseId }),
    Enrollment.deleteMany({ course: courseId }),
    Review.deleteMany({ course: courseId }),
    Certificate.deleteMany({ course: courseId }),
    Lesson.deleteMany({ course: courseId }),
    Module.deleteMany({ course: courseId }),
    Course.findByIdAndDelete(courseId),
  ]);
};

// GET /api/courses
const listCourses = asyncHandler(async (req, res) => {
  const {
    page = 1, limit = 12, category, difficulty, language,
    isFree, minPrice, maxPrice, sortBy = 'createdAt', order = 'desc',
  } = req.query;

  const filter = { status: 'approved' };
  if (category) filter.category = category;
  if (difficulty) filter.difficulty = difficulty;
  if (language) filter.language = language;
  if (isFree === 'true') filter.isFree = true;
  if (isFree === 'false') filter.isFree = false;
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  const sortOrder = order === 'asc' ? 1 : -1;
  const validSortFields = ['createdAt', 'price', 'averageRating', 'totalEnrollments'];
  const sortField = validSortFields.includes(sortBy) ? sortBy : 'createdAt';

  const skip = (Number(page) - 1) * Math.min(Number(limit), 50);
  const [courses, total] = await Promise.all([
    Course.find(filter)
      .populate('instructor', 'name profilePicture')
      .populate('category', 'name slug')
      .sort({ [sortField]: sortOrder })
      .skip(skip)
      .limit(Math.min(Number(limit), 50)),
    Course.countDocuments(filter),
  ]);

  return res.status(200).json(new ApiResponse(200, 'Courses fetched.', {
    courses, total, page: Number(page), pages: Math.ceil(total / limit),
  }));
});

// GET /api/courses/my — Instructor's own courses (all statuses)
const getMyCourses = asyncHandler(async (req, res) => {
  const courses = await Course.find({ instructor: req.user._id })
    .populate('category', 'name slug')
    .sort({ createdAt: -1 });
  return res.status(200).json(new ApiResponse(200, 'Your courses.', courses));
});


const searchCourses = asyncHandler(async (req, res) => {
  const { q, category, difficulty, page = 1, limit = 12 } = req.query;
  const filter = { status: 'approved' };
  if (q) filter.$text = { $search: q };
  if (category) filter.category = category;
  if (difficulty) filter.difficulty = difficulty;

  const skip = (Number(page) - 1) * Number(limit);
  const [courses, total] = await Promise.all([
    Course.find(filter)
      .populate('instructor', 'name profilePicture')
      .populate('category', 'name slug')
      .sort(q ? { score: { $meta: 'textScore' } } : { createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Course.countDocuments(filter),
  ]);

  return res.status(200).json(new ApiResponse(200, 'Search results.', { courses, total }));
});

// GET /api/courses/:id
const getCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id)
    .populate('instructor', 'name profilePicture bio')
    .populate('category', 'name slug');

  if (!course) throw new ApiError(404, 'Course not found.');
  if (course.status !== 'approved') {
    // Only owner or admin can see non-approved courses
    const isOwner = req.user && course.instructor._id.toString() === req.user._id.toString();
    const isAdmin = req.user && req.user.role === 'admin';
    if (!isOwner && !isAdmin) throw new ApiError(404, 'Course not found.');
  }

  const modules = await Module.find({ course: course._id }).sort({ order: 1 });
  const modulesWithLessons = await Promise.all(
    modules.map(async (mod) => {
      const lessons = await Lesson.find({ module: mod._id }).sort({ order: 1 })
        .select('title duration order isFreePreview');
      return { ...mod.toObject(), lessons };
    })
  );

  return res.status(200).json(new ApiResponse(200, 'Course fetched.', { ...course.toObject(), modules: modulesWithLessons }));
});

// GET /api/courses/:id/full (enrolled students / owner / admin)
const getCourseFull = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id)
    .populate('instructor', 'name profilePicture')
    .populate('category', 'name slug');

  if (!course) throw new ApiError(404, 'Course not found.');

  const modules = await Module.find({ course: course._id }).sort({ order: 1 });
  const modulesWithLessons = await Promise.all(
    modules.map(async (mod) => {
      const lessons = await Lesson.find({ module: mod._id }).sort({ order: 1 });
      return { ...mod.toObject(), lessons };
    })
  );

  return res.status(200).json(new ApiResponse(200, 'Full course fetched.', { ...course.toObject(), modules: modulesWithLessons }));
});

// POST /api/courses
const createCourse = asyncHandler(async (req, res) => {
  const courseData = { ...req.body, instructor: req.user._id, status: 'draft' };
  const course = await Course.create(courseData);
  return res.status(201).json(new ApiResponse(201, 'Course created as draft.', course));
});

// PUT /api/courses/:id
const updateCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) throw new ApiError(404, 'Course not found.');

  const isOwner = course.instructor.toString() === req.user._id.toString();
  const isAdmin = req.user.role === 'admin';
  if (!isOwner && !isAdmin) throw new ApiError(403, 'Not authorized to edit this course.');
  if (!isAdmin && !['draft', 'rejected'].includes(course.status)) {
    throw new ApiError(400, 'You can only edit a course in draft or rejected state.');
  }

  const updated = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  return res.status(200).json(new ApiResponse(200, 'Course updated.', updated));
});

// DELETE /api/courses/:id
const deleteCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) throw new ApiError(404, 'Course not found.');

  const isOwner = course.instructor.toString() === req.user._id.toString();
  const isAdmin = req.user.role === 'admin';
  if (!isOwner && !isAdmin) throw new ApiError(403, 'Not authorized to delete this course.');
  if (isOwner && !isAdmin && !['draft', 'rejected'].includes(course.status)) {
    throw new ApiError(400, 'Cannot delete a submitted or approved course. Contact admin.');
  }

  await cascadeDeleteCourse(course._id);
  return res.status(200).json(new ApiResponse(200, 'Course and all related data deleted.'));
});

// POST /api/courses/:id/submit
const submitCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) throw new ApiError(404, 'Course not found.');
  if (course.instructor.toString() !== req.user._id.toString()) throw new ApiError(403, 'Not your course.');
  if (!['draft', 'rejected'].includes(course.status)) throw new ApiError(400, 'Course is already submitted or approved.');

  course.status = 'pending';
  course.rejectionReason = '';
  await course.save();
  return res.status(200).json(new ApiResponse(200, 'Course submitted for admin review.', course));
});

// POST /api/courses/:id/resubmit (alias of submit after rejection)
const resubmitCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) throw new ApiError(404, 'Course not found.');
  if (course.instructor.toString() !== req.user._id.toString()) throw new ApiError(403, 'Not your course.');
  if (course.status !== 'rejected') throw new ApiError(400, 'Course must be in rejected state to resubmit.');

  course.status = 'pending';
  course.rejectionReason = '';
  await course.save();
  return res.status(200).json(new ApiResponse(200, 'Course resubmitted for review.', course));
});

module.exports = {
  listCourses, getMyCourses, searchCourses, getCourse, getCourseFull,
  createCourse, updateCourse, deleteCourse, submitCourse, resubmitCourse,
};

