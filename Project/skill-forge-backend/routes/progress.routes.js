const express = require('express');
const router = express.Router();
const { pingProgress, getCourseProgress } = require('../controllers/progress.controller');
const { verifyToken } = require('../middleware/auth.middleware');

router.post('/ping', verifyToken, pingProgress);
router.get('/course/:courseId', verifyToken, getCourseProgress);

module.exports = router;
