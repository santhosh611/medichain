// medichain/backend/routes/patientRoutes.js
const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const doctorController = require('../controllers/doctorController');
const adminController = require('../controllers/adminController');

router.post('/login', patientController.patientLogin);
router.post('/verify-otp', patientController.verifyOTP);
// Removed the old capture-symptoms route as it will be replaced
// router.post('/capture-symptoms', patientController.captureSymptoms);
router.post('/capture-symptoms-and-assign-doctor', patientController.captureSymptomsAndAssignDoctor); // New route
router.get('/:id', doctorController.getPatientRecord);
router.get('/aadhaar/:aadhaar_number', adminController.getAadhaarDetails);

module.exports = router;