const express = require('express');
const router = express.Router();
const { chatWithTutor } = require('../controllers/ai.controller');
const { verifyToken } = require('../middleware/auth.middleware');

router.route('/chat')
  .post(verifyToken, chatWithTutor);

module.exports = router;