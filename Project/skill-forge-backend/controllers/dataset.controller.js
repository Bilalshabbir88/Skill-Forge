const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const Dataset = require('../models/Dataset');

// @desc    Get all datasets
// @route   GET /api/datasets
// @access  Public (or Student depending on requirement)
const getDatasets = asyncHandler(async (req, res) => {
  const query = {};
  if (req.query.search) {
    query.$text = { $search: req.query.search };
  }

  const datasets = await Dataset.find(query)
    .populate('uploadedBy', 'name profilePicture')
    .sort({ createdAt: -1 });

  return res.status(200).json(new ApiResponse(200, 'Datasets fetched successfully', datasets));
});

// @desc    Upload new dataset link
// @route   POST /api/datasets
// @access  Admin/Instructor
const createDataset = asyncHandler(async (req, res) => {
  const dataset = await Dataset.create({
    ...req.body,
    uploadedBy: req.user._id
  });
  return res.status(201).json(new ApiResponse(201, 'Dataset added', dataset));
});

module.exports = {
  getDatasets,
  createDataset
};