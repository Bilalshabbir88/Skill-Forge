const express = require('express');
const router = express.Router();

router.use('/auth', require('./auth.routes'));
router.use('/users', require('./user.routes'));
router.use('/categories', require('./category.routes'));
router.use('/courses', require('./course.routes'));
router.use('/enrollments', require('./enrollment.routes'));
router.use('/progress', require('./progress.routes'));
router.use('/certificates', require('./certificate.routes'));
router.use('/admin', require('./admin.routes'));
router.use('/specializations', require('./specialization.routes'));
router.use('/datasets', require('./dataset.routes'));
router.use('/', require('./codingLab.routes'));
router.use('/ai', require('./ai.routes'));

module.exports = router;
