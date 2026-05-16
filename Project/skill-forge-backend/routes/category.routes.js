const express = require('express');
const router = express.Router();
const { listCategories, createCategory, updateCategory, deleteCategory } = require('../controllers/category.controller');
const { verifyToken, requireRole } = require('../middleware/auth.middleware');

router.get('/', listCategories);
router.post('/', verifyToken, requireRole('admin'), createCategory);
router.put('/:id', verifyToken, requireRole('admin'), updateCategory);
router.delete('/:id', verifyToken, requireRole('admin'), deleteCategory);

module.exports = router;
