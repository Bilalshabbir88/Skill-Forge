const express = require('express');
const router = express.Router();
const { enroll, getMyEnrollments, checkEnrollment, unenroll } = require('../controllers/enrollment.controller');
const { verifyToken, requireRole } = require('../middleware/auth.middleware');

router.post('/', verifyToken, requireRole('student'), enroll);
router.get('/my', verifyToken, requireRole('student'), getMyEnrollments);
router.get('/check/:courseId', verifyToken, checkEnrollment);
router.delete('/:courseId', verifyToken, requireRole('student'), unenroll);

module.exports = router;
