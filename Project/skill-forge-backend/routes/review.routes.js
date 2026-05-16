const express = require('express');
const router = express.Router({ mergeParams: true });
const { listReviews, createReview, updateReview, deleteReview } = require('../controllers/review.controller');
const { verifyToken, requireRole } = require('../middleware/auth.middleware');

router.get('/', listReviews);
router.post('/', verifyToken, requireRole('student'), createReview);
router.put('/:reviewId', verifyToken, updateReview);
router.delete('/:reviewId', verifyToken, deleteReview);

module.exports = router;
