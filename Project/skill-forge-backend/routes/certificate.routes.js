const express = require('express');
const router = express.Router();
const { getMyCertificates, claimCertificate, verifyCertificate } = require('../controllers/certificate.controller');
const { verifyToken } = require('../middleware/auth.middleware');

router.get('/my', verifyToken, getMyCertificates);
router.post('/claim/:courseId', verifyToken, claimCertificate);
router.get('/verify/:certificateId', verifyCertificate); // Public

module.exports = router;
