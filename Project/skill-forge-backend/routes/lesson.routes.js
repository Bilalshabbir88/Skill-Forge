const express = require('express');
const router = express.Router({ mergeParams: true });
const { listLessons, createLesson, updateLesson, deleteLesson, reorderLessons, watchLesson } = require('../controllers/lesson.controller');
const { verifyToken, optionalAuth } = require('../middleware/auth.middleware');

router.get('/', optionalAuth, listLessons);
router.post('/', verifyToken, createLesson);
router.patch('/reorder', verifyToken, reorderLessons);
router.get('/:lessonId/watch', optionalAuth, watchLesson);
router.put('/:lessonId', verifyToken, updateLesson);
router.delete('/:lessonId', verifyToken, deleteLesson);

module.exports = router;
