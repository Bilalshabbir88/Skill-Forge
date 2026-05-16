const Quiz = require('../models/Quiz');
const Question = require('../models/Question');
const QuizAttempt = require('../models/QuizAttempt');
const Module = require('../models/Module');
const Lesson = require('../models/Lesson');
const LessonProgress = require('../models/LessonProgress');
const Enrollment = require('../models/Enrollment');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const { checkCourseCompletion } = require('./progress.controller');

// GET /api/courses/:courseId/modules/:moduleId/quiz
const getQuiz = asyncHandler(async (req, res) => {
  const quiz = await Quiz.findOne({ module: req.params.moduleId });
  if (!quiz) throw new ApiError(404, 'No quiz for this module.');

  const isStudentView = req.user.role === 'student';
  const fields = isStudentView ? '-correctOption' : '';
  const questions = await Question.find({ quiz: quiz._id }).sort({ order: 1 }).select(fields);

  return res.status(200).json(new ApiResponse(200, 'Quiz fetched.', { quiz, questions }));
});

// POST /api/courses/:courseId/modules/:moduleId/quiz
const createQuiz = asyncHandler(async (req, res) => {
  const existing = await Quiz.findOne({ module: req.params.moduleId });
  if (existing) throw new ApiError(409, 'This module already has a quiz.');

  const quiz = await Quiz.create({
    ...req.body,
    module: req.params.moduleId,
    course: req.params.courseId,
  });
  await Module.findByIdAndUpdate(req.params.moduleId, { hasQuiz: true });
  return res.status(201).json(new ApiResponse(201, 'Quiz created.', quiz));
});

// PUT /api/courses/:courseId/modules/:moduleId/quiz
const updateQuiz = asyncHandler(async (req, res) => {
  const quiz = await Quiz.findOneAndUpdate({ module: req.params.moduleId }, req.body, { new: true });
  if (!quiz) throw new ApiError(404, 'Quiz not found.');
  return res.status(200).json(new ApiResponse(200, 'Quiz updated.', quiz));
});

// DELETE /api/courses/:courseId/modules/:moduleId/quiz
const deleteQuiz = asyncHandler(async (req, res) => {
  const quiz = await Quiz.findOne({ module: req.params.moduleId });
  if (!quiz) throw new ApiError(404, 'Quiz not found.');
  await Question.deleteMany({ quiz: quiz._id });
  await QuizAttempt.deleteMany({ quiz: quiz._id });
  await quiz.deleteOne();
  await Module.findByIdAndUpdate(req.params.moduleId, { hasQuiz: false });
  return res.status(200).json(new ApiResponse(200, 'Quiz deleted.'));
});

// POST /api/courses/:courseId/modules/:moduleId/quiz/questions
const addQuestion = asyncHandler(async (req, res) => {
  const quiz = await Quiz.findOne({ module: req.params.moduleId });
  if (!quiz) throw new ApiError(404, 'Quiz not found.');
  const question = await Question.create({ ...req.body, quiz: quiz._id });
  return res.status(201).json(new ApiResponse(201, 'Question added.', question));
});

// PUT /api/courses/:courseId/modules/:moduleId/quiz/questions/:questionId
const updateQuestion = asyncHandler(async (req, res) => {
  const question = await Question.findByIdAndUpdate(req.params.questionId, req.body, { new: true });
  if (!question) throw new ApiError(404, 'Question not found.');
  return res.status(200).json(new ApiResponse(200, 'Question updated.', question));
});

// DELETE /api/courses/:courseId/modules/:moduleId/quiz/questions/:questionId
const deleteQuestion = asyncHandler(async (req, res) => {
  const question = await Question.findByIdAndDelete(req.params.questionId);
  if (!question) throw new ApiError(404, 'Question not found.');
  return res.status(200).json(new ApiResponse(200, 'Question deleted.'));
});

// POST /api/courses/:courseId/modules/:moduleId/quiz/submit
const submitQuiz = asyncHandler(async (req, res) => {
  const quiz = await Quiz.findOne({ module: req.params.moduleId });
  if (!quiz) throw new ApiError(404, 'Quiz not found.');

  const enrollment = await Enrollment.findOne({ student: req.user._id, course: req.params.courseId });
  if (!enrollment) throw new ApiError(403, 'You must be enrolled to take this quiz.');

  // All lessons in module must be complete
  const moduleLessons = await Lesson.find({ module: req.params.moduleId });
  for (const lesson of moduleLessons) {
    const prog = await LessonProgress.findOne({ student: req.user._id, lesson: lesson._id });
    if (!prog || !prog.isCompleted) {
      throw new ApiError(403, 'Complete all lessons in this module before taking the quiz.');
    }
  }

  // Check attempt count
  const attempts = await QuizAttempt.find({ student: req.user._id, quiz: quiz._id }).sort({ submittedAt: -1 });
  if (attempts.length >= quiz.maxAttempts) throw new ApiError(403, `Maximum ${quiz.maxAttempts} attempts reached.`);

  // If previous attempt failed, check wait period
  if (attempts.length > 0 && !attempts[0].passed) {
    const waitMs = quiz.retryWaitHours * 3600000;
    const timeSinceLastAttempt = Date.now() - new Date(attempts[0].submittedAt).getTime();
    if (timeSinceLastAttempt < waitMs) {
      const hoursLeft = Math.ceil((waitMs - timeSinceLastAttempt) / 3600000);
      throw new ApiError(403, `You must wait ${hoursLeft} more hour(s) before retrying.`);
    }
  }

  // Score the answers
  const questions = await Question.find({ quiz: quiz._id });
  const { answers } = req.body;
  if (answers.length !== questions.length) {
    throw new ApiError(400, `Must answer all ${questions.length} questions.`);
  }

  let correctCount = 0;
  const scoredAnswers = answers.map((ans) => {
    const question = questions.find((q) => q._id.toString() === ans.questionId);
    if (!question) throw new ApiError(400, `Invalid question ID: ${ans.questionId}`);
    const isCorrect = ans.selectedOption === question.correctOption;
    if (isCorrect) correctCount++;
    return { question: question._id, selectedOption: ans.selectedOption, isCorrect };
  });

  const score = Math.round((correctCount / questions.length) * 100);
  const passed = score >= quiz.passingScore;

  const attempt = await QuizAttempt.create({
    student: req.user._id,
    quiz: quiz._id,
    course: req.params.courseId,
    answers: scoredAnswers,
    score,
    passed,
    attemptNumber: attempts.length + 1,
  });

  // If passed, check course completion
  if (passed) {
    await checkCourseCompletion(req.user._id, req.params.courseId);
  }

  // Return detailed result with correct answers and explanations
  const breakdown = scoredAnswers.map((ans, i) => ({
    question: questions[i].text,
    yourAnswer: questions[i].options[ans.selectedOption]?.text,
    correctAnswer: questions[i].options[questions[i].correctOption]?.text,
    isCorrect: ans.isCorrect,
    explanation: questions[i].explanation,
  }));

  return res.status(200).json(new ApiResponse(200, passed ? 'Quiz passed!' : 'Quiz failed.', {
    score, passed, correctCount, total: questions.length,
    attemptNumber: attempt.attemptNumber, attemptsLeft: quiz.maxAttempts - (attempts.length + 1),
    breakdown,
  }));
});

// GET /api/courses/:courseId/modules/:moduleId/quiz/attempts
const getAttempts = asyncHandler(async (req, res) => {
  const quiz = await Quiz.findOne({ module: req.params.moduleId });
  if (!quiz) throw new ApiError(404, 'Quiz not found.');
  const attempts = await QuizAttempt.find({ student: req.user._id, quiz: quiz._id }).sort({ submittedAt: -1 });
  return res.status(200).json(new ApiResponse(200, 'Attempts fetched.', attempts));
});

// GET /api/courses/:courseId/modules/:moduleId/quiz/result/:attemptId
const getAttemptResult = asyncHandler(async (req, res) => {
  const attempt = await QuizAttempt.findById(req.params.attemptId).populate('answers.question');
  if (!attempt) throw new ApiError(404, 'Attempt not found.');
  if (attempt.student.toString() !== req.user._id.toString()) throw new ApiError(403, 'Not your attempt.');
  return res.status(200).json(new ApiResponse(200, 'Attempt result fetched.', attempt));
});

module.exports = {
  getQuiz, createQuiz, updateQuiz, deleteQuiz,
  addQuestion, updateQuestion, deleteQuestion,
  submitQuiz, getAttempts, getAttemptResult,
};
