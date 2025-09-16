const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const doctorController = require('../controllers/doctorController'); // Import the doctor controller

router.post('/login', patientController.patientLogin);
router.post('/verify-otp', patientController.verifyOTP);
router.post('/capture-symptoms', patientController.captureSymptoms);
router.get('/:id', doctorController.getPatientRecord); // Added this route to fetch patient record by ID

module.exports = router;