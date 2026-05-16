const express = require('express');
const router = express.Router();
const { getLabs, createLab, executeCode } = require('../controllers/codingLab.controller');
const { verifyToken, requireRole } = require('../middleware/auth.middleware');

// Routes mounted at /api/modules/:moduleId/labs
router.route('/modules/:moduleId/labs')
  .get(verifyToken, getLabs)
  .post(verifyToken, requireRole('admin', 'instructor'), createLab);

// Routes mounted at /api/labs/:id
router.route('/labs/:id/execute')
  .post(verifyToken, executeCode);

module.exports = router;