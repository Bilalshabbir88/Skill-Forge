const Review = require('../models/Review');
const Enrollment = require('../models/Enrollment');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

// GET /api/courses/:courseId/reviews
const listReviews = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);
  const [reviews, total] = await Promise.all([
    Review.find({ course: req.params.courseId })
      .populate('student', 'name profilePicture')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Review.countDocuments({ course: req.params.courseId }),
  ]);
  return res.status(200).json(new ApiResponse(200, 'Reviews fetched.', { reviews, total, page: Number(page) }));
});

// POST /api/courses/:courseId/reviews
const createReview = asyncHandler(async (req, res) => {
  const enrollment = await Enrollment.findOne({ student: req.user._id, course: req.params.courseId });
  if (!enrollment) throw new ApiError(403, 'You must be enrolled to leave a review.');

  const existing = await Review.findOne({ student: req.user._id, course: req.params.courseId });
  if (existing) throw new ApiError(409, 'You have already reviewed this course.');

  const review = await Review.create({ ...req.body, student: req.user._id, course: req.params.courseId });
  return res.status(201).json(new ApiResponse(201, 'Review submitted.', review));
});

// PUT /api/courses/:courseId/reviews/:reviewId
const updateReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.reviewId);
  if (!review) throw new ApiError(404, 'Review not found.');
  if (review.student.toString() !== req.user._id.toString()) throw new ApiError(403, 'Not your review.');

  review.rating = req.body.rating ?? review.rating;
  review.comment = req.body.comment ?? review.comment;
  await review.save();

  return res.status(200).json(new ApiResponse(200, 'Review updated.', review));
});

// DELETE /api/courses/:courseId/reviews/:reviewId
const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.reviewId);
  if (!review) throw new ApiError(404, 'Review not found.');
  const isOwner = review.student.toString() === req.user._id.toString();
  const isAdmin = req.user.role === 'admin';
  if (!isOwner && !isAdmin) throw new ApiError(403, 'Not authorized to delete this review.');

  await Review.findByIdAndDelete(req.params.reviewId);
  return res.status(200).json(new ApiResponse(200, 'Review deleted.'));
});

module.exports = { listReviews, createReview, updateReview, deleteReview };
