const express = require('express');
const router = express.Router({ mergeParams: true });
const { getQuiz, createQuiz, updateQuiz, deleteQuiz, addQuestion, updateQuestion, deleteQuestion, submitQuiz, getAttempts, getAttemptResult } = require('../controllers/quiz.controller');
const { verifyToken, requireRole } = require('../middleware/auth.middleware');

router.get('/', verifyToken, getQuiz);
router.post('/', verifyToken, requireRole('instructor', 'admin'), createQuiz);
router.put('/', verifyToken, requireRole('instructor', 'admin'), updateQuiz);
router.delete('/', verifyToken, requireRole('instructor', 'admin'), deleteQuiz);
router.post('/questions', verifyToken, requireRole('instructor', 'admin'), addQuestion);
router.put('/questions/:questionId', verifyToken, requireRole('instructor', 'admin'), updateQuestion);
router.delete('/questions/:questionId', verifyToken, requireRole('instructor', 'admin'), deleteQuestion);
router.post('/submit', verifyToken, requireRole('student'), submitQuiz);
router.get('/attempts', verifyToken, requireRole('student'), getAttempts);
router.get('/result/:attemptId', verifyToken, requireRole('student'), getAttemptResult);

module.exports = router;
