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

module.exports = router;
