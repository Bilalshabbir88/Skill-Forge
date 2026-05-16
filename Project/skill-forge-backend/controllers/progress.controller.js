const LessonProgress = require('../models/LessonProgress');
const Lesson = require('../models/Lesson');
const Enrollment = require('../models/Enrollment');
const Module = require('../models/Module');
const Quiz = require('../models/Quiz');
const QuizAttempt = require('../models/QuizAttempt');
const Course = require('../models/Course');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

// Exported helper — called by quiz.controller after a passing attempt
const checkCourseCompletion = async (studentId, courseId) => {
  const enrollment = await Enrollment.findOne({ student: studentId, course: courseId });
  if (!enrollment || enrollment.isCompleted) return;

  const course = await Course.findById(courseId);
  if (!course) return;

  // Check 1: all lessons watched
  if (enrollment.progressPercent < 100) return;

  // Check 2: all modules with quizzes have a passing attempt
  const modulesWithQuiz = await Module.find({ course: courseId, hasQuiz: true });
  for (const mod of modulesWithQuiz) {
    const quiz = await Quiz.findOne({ module: mod._id });
    if (!quiz) continue;
    const passedAttempt = await QuizAttempt.findOne({ student: studentId, quiz: quiz._id, passed: true });
    if (!passedAttempt) return;
  }

  // All conditions met — mark complete
  enrollment.isCompleted = true;
  enrollment.completedAt = new Date();
  await enrollment.save();
};

// POST /api/progress/ping
const pingProgress = asyncHandler(async (req, res) => {
  const { lessonId, courseId, watchedSeconds } = req.body;

  const enrollment = await Enrollment.findOne({ student: req.user._id, course: courseId });
  if (!enrollment) throw new ApiError(403, 'Not enrolled in this course.');

  const lesson = await Lesson.findById(lessonId);
  if (!lesson) throw new ApiError(404, 'Lesson not found.');

  // Upsert lesson progress — only increase watchedSeconds, never decrease
  let progress = await LessonProgress.findOne({ student: req.user._id, lesson: lessonId });

  if (!progress) {
    progress = await LessonProgress.create({ student: req.user._id, lesson: lessonId, course: courseId, watchedSeconds: 0 });
  }

  if (watchedSeconds > progress.watchedSeconds) {
    progress.watchedSeconds = watchedSeconds;
  }

  const threshold = parseFloat(process.env.LESSON_COMPLETE_THRESHOLD) || 0.8;
  const wasCompleted = progress.isCompleted;

  if (!wasCompleted && progress.watchedSeconds / lesson.duration >= threshold) {
    progress.isCompleted = true;
    progress.completedAt = new Date();
  }

  await progress.save();

  // If newly completed, update enrollment
  if (!wasCompleted && progress.isCompleted) {
    if (!enrollment.completedLessons.includes(lessonId)) {
      enrollment.completedLessons.push(lessonId);
    }
    const course = await Course.findById(courseId);
    enrollment.progressPercent = Math.round((enrollment.completedLessons.length / course.totalLessons) * 100);
    await enrollment.save();

    // Check if course is now fully complete
    await checkCourseCompletion(req.user._id, courseId);
  }

  return res.status(200).json(new ApiResponse(200, 'Progress updated.', {
    isCompleted: progress.isCompleted,
    progressPercent: enrollment.progressPercent,
    watchedSeconds: progress.watchedSeconds,
  }));
});

// GET /api/progress/course/:courseId
const getCourseProgress = asyncHandler(async (req, res) => {
  const enrollment = await Enrollment.findOne({ student: req.user._id, course: req.params.courseId });
  if (!enrollment) throw new ApiError(403, 'Not enrolled in this course.');

  const lessonProgresses = await LessonProgress.find({ student: req.user._id, course: req.params.courseId });

  return res.status(200).json(new ApiResponse(200, 'Progress fetched.', {
    progressPercent: enrollment.progressPercent,
    isCompleted: enrollment.isCompleted,
    completedLessons: enrollment.completedLessons,
    lessonProgresses,
  }));
});

module.exports = { pingProgress, getCourseProgress, checkCourseCompletion };
