const express = require('express');
const router = express.Router();
const { getDatasets, createDataset } = require('../controllers/dataset.controller');
const { verifyToken, requireRole } = require('../middleware/auth.middleware');

router.route('/')
  .get(getDatasets)
  .post(verifyToken, requireRole('admin', 'instructor'), createDataset);

module.exports = router;