const express = require('express');
const router = express.Router({ mergeParams: true });
const { listCourses, getMyCourses, searchCourses, getCourse, getCourseFull, createCourse, updateCourse, deleteCourse, submitCourse, resubmitCourse } = require('../controllers/course.controller');
const { verifyToken, requireApprovedInstructor, optionalAuth } = require('../middleware/auth.middleware');
const moduleRouter = require('./module.routes');
const reviewRouter = require('./review.routes');

// Nested routes
router.use('/:courseId/modules', moduleRouter);
router.use('/:courseId/reviews', reviewRouter);

router.get('/', listCourses);
router.get('/search', searchCourses);
router.get('/my', verifyToken, requireApprovedInstructor, getMyCourses);
router.get('/:id', optionalAuth, getCourse);
router.get('/:id/full', verifyToken, getCourseFull);
router.post('/', verifyToken, requireApprovedInstructor, createCourse);
router.put('/:id', verifyToken, updateCourse);
router.delete('/:id', verifyToken, deleteCourse);
router.post('/:id/submit', verifyToken, submitCourse);
router.post('/:id/resubmit', verifyToken, resubmitCourse);

module.exports = router;
