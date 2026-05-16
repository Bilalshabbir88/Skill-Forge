const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, changePassword, getPublicProfile } = require('../controllers/user.controller');
const { verifyToken } = require('../middleware/auth.middleware');

router.get('/profile', verifyToken, getProfile);
router.put('/profile', verifyToken, updateProfile);
router.put('/change-password', verifyToken, changePassword);
router.get('/:id/public', getPublicProfile);

module.exports = router;
