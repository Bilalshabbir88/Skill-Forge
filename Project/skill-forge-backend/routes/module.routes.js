const express = require('express');
const router = express.Router({ mergeParams: true });
const { listModules, createModule, updateModule, deleteModule, reorderModules } = require('../controllers/module.controller');
const { verifyToken, optionalAuth } = require('../middleware/auth.middleware');
const lessonRouter = require('./lesson.routes');
const quizRouter = require('./quiz.routes');

// Nest lesson and quiz routes under modules
router.use('/:moduleId/lessons', lessonRouter);
router.use('/:moduleId/quiz', quizRouter);

router.get('/', optionalAuth, listModules);
router.post('/', verifyToken, createModule);
router.put('/:moduleId', verifyToken, updateModule);
router.delete('/:moduleId', verifyToken, deleteModule);
router.patch('/reorder', verifyToken, reorderModules);

module.exports = router;
