const express = require('express');
const router = express.Router();
const {
  getSpecializations,
  getSpecialization,
  createSpecialization,
  updateSpecialization
} = require('../controllers/specialization.controller');
const { verifyToken, requireRole } = require('../middleware/auth.middleware');

router.route('/')
  .get(getSpecializations)
  .post(verifyToken, requireRole('admin'), createSpecialization);

router.route('/:id')
  .get(getSpecialization)
  .put(verifyToken, requireRole('admin'), updateSpecialization);

module.exports = router;