// medichain/backend/routes/patientRoutes.js
const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const doctorController = require('../controllers/doctorController');
const adminController = require('../controllers/adminController');

router.post('/login', patientController.patientLogin);
router.post('/verify-otp', patientController.verifyOTP);
router.post('/capture-symptoms', patientController.captureSymptoms);
router.get('/:id', doctorController.getPatientRecord);
router.get('/aadhaar/:aadhaar_number', adminController.getAadhaarDetails);

module.exports = router;