const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const Specialization = require('../models/Specialization');

// @desc    Get all published specializations
// @route   GET /api/specializations
// @access  Public
const getSpecializations = asyncHandler(async (req, res) => {
  const specializations = await Specialization.find({ status: 'published' })
    .populate('category', 'name slug')
    .populate({
      path: 'courses',
      select: 'title thumbnail averageRating totalEnrollments instructor price',
      populate: { path: 'instructor', select: 'name profilePicture' }
    });

  return res.status(200).json(new ApiResponse(200, 'Specializations fetched successfully', specializations));
});

// @desc    Get single specialization
// @route   GET /api/specializations/:id
// @access  Public
const getSpecialization = asyncHandler(async (req, res) => {
  const specialization = await Specialization.findById(req.params.id)
    .populate('category', 'name slug')
    .populate({
      path: 'courses',
      select: 'title thumbnail averageRating totalEnrollments instructor description difficulty totalDuration totalLessons',
      populate: { path: 'instructor', select: 'name profilePicture bio' }
    });

  if (!specialization) throw new ApiError(404, 'Specialization not found');
  if (specialization.status !== 'published' && (!req.user || req.user.role !== 'admin')) {
    throw new ApiError(403, 'Specialization not available');
  }

  return res.status(200).json(new ApiResponse(200, 'Specialization fetched successfully', specialization));
});

// @desc    Create specialization
// @route   POST /api/specializations
// @access  Admin
const createSpecialization = asyncHandler(async (req, res) => {
  const specialization = await Specialization.create(req.body);
  return res.status(201).json(new ApiResponse(201, 'Specialization created', specialization));
});

// @desc    Update specialization
// @route   PUT /api/specializations/:id
// @access  Admin
const updateSpecialization = asyncHandler(async (req, res) => {
  const specialization = await Specialization.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!specialization) throw new ApiError(404, 'Specialization not found');
  return res.status(200).json(new ApiResponse(200, 'Specialization updated', specialization));
});

module.exports = {
  getSpecializations,
  getSpecialization,
  createSpecialization,
  updateSpecialization
};