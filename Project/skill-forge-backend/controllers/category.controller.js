const Category = require('../models/Category');
const Course = require('../models/Course');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

const listCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find().sort({ name: 1 });
  return res.status(200).json(new ApiResponse(200, 'Categories fetched.', categories));
});

const createCategory = asyncHandler(async (req, res) => {
  const { name, description, icon } = req.body;
  if (!name) throw new ApiError(400, 'Category name is required.');
  const category = await Category.create({ name, slug: name.toLowerCase().replace(/\s+/g, '-'), description, icon });
  return res.status(201).json(new ApiResponse(201, 'Category created.', category));
});

const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!category) throw new ApiError(404, 'Category not found.');
  return res.status(200).json(new ApiResponse(200, 'Category updated.', category));
});

const deleteCategory = asyncHandler(async (req, res) => {
  const courseCount = await Course.countDocuments({ category: req.params.id });
  if (courseCount > 0) throw new ApiError(400, `Cannot delete: ${courseCount} course(s) exist in this category.`);
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) throw new ApiError(404, 'Category not found.');
  return res.status(200).json(new ApiResponse(200, 'Category deleted.'));
});

module.exports = { listCategories, createCategory, updateCategory, deleteCategory };
