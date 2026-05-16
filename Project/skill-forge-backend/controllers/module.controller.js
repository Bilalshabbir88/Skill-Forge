const Module = require('../models/Module');
const Lesson = require('../models/Lesson');
const Quiz = require('../models/Quiz');
const Question = require('../models/Question');
const LessonProgress = require('../models/LessonProgress');
const QuizAttempt = require('../models/QuizAttempt');
const Course = require('../models/Course');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

const assertCourseOwner = (course, userId) => {
  if (course.instructor.toString() !== userId.toString()) throw new ApiError(403, 'Not your course.');
};

// GET /api/courses/:courseId/modules
const listModules = asyncHandler(async (req, res) => {
  const modules = await Module.find({ course: req.params.courseId }).sort({ order: 1 });
  return res.status(200).json(new ApiResponse(200, 'Modules fetched.', modules));
});

// POST /api/courses/:courseId/modules
const createModule = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.courseId);
  if (!course) throw new ApiError(404, 'Course not found.');
  assertCourseOwner(course, req.user._id);

  const { title, description, order } = req.body;

  // Shift existing modules if order conflict
  await Module.updateMany(
    { course: req.params.courseId, order: { $gte: order } },
    { $inc: { order: 1 } }
  );

  const mod = await Module.create({ course: req.params.courseId, title, description, order });
  return res.status(201).json(new ApiResponse(201, 'Module created.', mod));
});

// PUT /api/courses/:courseId/modules/:moduleId
const updateModule = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.courseId);
  if (!course) throw new ApiError(404, 'Course not found.');
  assertCourseOwner(course, req.user._id);

  const mod = await Module.findByIdAndUpdate(req.params.moduleId, req.body, { new: true });
  if (!mod) throw new ApiError(404, 'Module not found.');
  return res.status(200).json(new ApiResponse(200, 'Module updated.', mod));
});

// DELETE /api/courses/:courseId/modules/:moduleId
const deleteModule = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.courseId);
  if (!course) throw new ApiError(404, 'Course not found.');
  assertCourseOwner(course, req.user._id);

  const mod = await Module.findById(req.params.moduleId);
  if (!mod) throw new ApiError(404, 'Module not found.');

  const lessons = await Lesson.find({ module: mod._id });
  const lessonIds = lessons.map((l) => l._id);
  const quizzes = await Quiz.find({ module: mod._id });
  const quizIds = quizzes.map((q) => q._id);

  await Promise.all([
    LessonProgress.deleteMany({ lesson: { $in: lessonIds } }),
    QuizAttempt.deleteMany({ quiz: { $in: quizIds } }),
    Question.deleteMany({ quiz: { $in: quizIds } }),
    Quiz.deleteMany({ module: mod._id }),
    Lesson.deleteMany({ module: mod._id }),
    mod.deleteOne(),
  ]);

  // Update course lesson/duration totals
  const allLessons = await Lesson.find({ course: req.params.courseId });
  await Course.findByIdAndUpdate(req.params.courseId, {
    totalLessons: allLessons.length,
    totalDuration: allLessons.reduce((s, l) => s + l.duration, 0),
  });

  return res.status(200).json(new ApiResponse(200, 'Module and all its content deleted.'));
});

// PATCH /api/courses/:courseId/modules/reorder
const reorderModules = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.courseId);
  if (!course) throw new ApiError(404, 'Course not found.');
  assertCourseOwner(course, req.user._id);

  const { order } = req.body; // [{ moduleId, order }]
  await Promise.all(
    order.map(({ moduleId, order: o }) => Module.findByIdAndUpdate(moduleId, { order: o }))
  );
  return res.status(200).json(new ApiResponse(200, 'Modules reordered.'));
});

module.exports = { listModules, createModule, updateModule, deleteModule, reorderModules };
