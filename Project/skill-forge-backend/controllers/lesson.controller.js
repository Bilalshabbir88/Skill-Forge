const Lesson = require('../models/Lesson');
const Module = require('../models/Module');
const Course = require('../models/Course');
const LessonProgress = require('../models/LessonProgress');
const Enrollment = require('../models/Enrollment');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

const assertCourseOwner = (course, userId) => {
  if (course.instructor.toString() !== userId.toString()) throw new ApiError(403, 'Not your course.');
};

// GET /api/courses/:courseId/modules/:moduleId/lessons
const listLessons = asyncHandler(async (req, res) => {
  const lessons = await Lesson.find({ module: req.params.moduleId }).sort({ order: 1 });
  return res.status(200).json(new ApiResponse(200, 'Lessons fetched.', lessons));
});

// POST /api/courses/:courseId/modules/:moduleId/lessons
const createLesson = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.courseId);
  if (!course) throw new ApiError(404, 'Course not found.');
  assertCourseOwner(course, req.user._id);

  const lesson = await Lesson.create({
    ...req.body,
    module: req.params.moduleId,
    course: req.params.courseId,
  });

  // Update course totals
  const allLessons = await Lesson.find({ course: req.params.courseId });
  await Course.findByIdAndUpdate(req.params.courseId, {
    totalLessons: allLessons.length,
    totalDuration: allLessons.reduce((s, l) => s + l.duration, 0),
  });

  return res.status(201).json(new ApiResponse(201, 'Lesson created.', lesson));
});

// PUT /api/courses/:courseId/modules/:moduleId/lessons/:lessonId
const updateLesson = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.courseId);
  if (!course) throw new ApiError(404, 'Course not found.');
  assertCourseOwner(course, req.user._id);

  const lesson = await Lesson.findByIdAndUpdate(req.params.lessonId, req.body, { new: true });
  if (!lesson) throw new ApiError(404, 'Lesson not found.');

  // Recompute course duration
  const allLessons = await Lesson.find({ course: req.params.courseId });
  await Course.findByIdAndUpdate(req.params.courseId, {
    totalDuration: allLessons.reduce((s, l) => s + l.duration, 0),
  });

  return res.status(200).json(new ApiResponse(200, 'Lesson updated.', lesson));
});

// DELETE /api/courses/:courseId/modules/:moduleId/lessons/:lessonId
const deleteLesson = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.courseId);
  if (!course) throw new ApiError(404, 'Course not found.');
  assertCourseOwner(course, req.user._id);

  const lesson = await Lesson.findByIdAndDelete(req.params.lessonId);
  if (!lesson) throw new ApiError(404, 'Lesson not found.');
  await LessonProgress.deleteMany({ lesson: lesson._id });

  const allLessons = await Lesson.find({ course: req.params.courseId });
  await Course.findByIdAndUpdate(req.params.courseId, {
    totalLessons: allLessons.length,
    totalDuration: allLessons.reduce((s, l) => s + l.duration, 0),
  });

  return res.status(200).json(new ApiResponse(200, 'Lesson deleted.'));
});

// PATCH /api/courses/:courseId/modules/:moduleId/lessons/reorder
const reorderLessons = asyncHandler(async (req, res) => {
  const { order } = req.body; // [{ lessonId, order }]
  await Promise.all(
    order.map(({ lessonId, order: o }) => Lesson.findByIdAndUpdate(lessonId, { order: o }))
  );
  return res.status(200).json(new ApiResponse(200, 'Lessons reordered.'));
});

// GET /api/courses/:courseId/modules/:moduleId/lessons/:lessonId/watch
const watchLesson = asyncHandler(async (req, res) => {
  const lesson = await Lesson.findById(req.params.lessonId);
  if (!lesson) throw new ApiError(404, 'Lesson not found.');

  // Free preview — no auth needed
  if (lesson.isFreePreview) {
    return res.status(200).json(new ApiResponse(200, 'Free preview.', { videoUrl: lesson.videoUrl }));
  }

  if (!req.user) throw new ApiError(401, 'Please log in to access this lesson.');

  // Instructor or admin — always get URL
  if (req.user.role === 'instructor' || req.user.role === 'admin') {
    return res.status(200).json(new ApiResponse(200, 'Lesson access granted.', { videoUrl: lesson.videoUrl }));
  }

  // Student — must be enrolled
  const enrollment = await Enrollment.findOne({ student: req.user._id, course: req.params.courseId });
  if (!enrollment) throw new ApiError(403, 'Enroll in this course to access this lesson.');

  // Check lesson order — all previous lessons in this module must be complete
  if (lesson.order > 1) {
    const previousLessons = await Lesson.find({
      module: req.params.moduleId,
      order: { $lt: lesson.order },
    });

    for (const prev of previousLessons) {
      const progress = await LessonProgress.findOne({ student: req.user._id, lesson: prev._id });
      if (!progress || !progress.isCompleted) {
        throw new ApiError(403, 'Complete previous lessons first.');
      }
    }
  }

  return res.status(200).json(new ApiResponse(200, 'Lesson access granted.', { videoUrl: lesson.videoUrl }));
});

module.exports = { listLessons, createLesson, updateLesson, deleteLesson, reorderLessons, watchLesson };
