const Patient = require('../models/Patient');
const { v4: uuidv4 } = require('uuid');

const hardcodedOTP = '123456';

exports.patientLogin = async (req, res) => {
    const { aadhaar_number } = req.body;
    try {
        let patient = await Patient.findOne({ aadhaar_number });
        if (!patient) {
            // Create a new patient record if one doesn't exist
            patient = new Patient({ aadhaar_number });
            await patient.save();
        }
        res.status(200).json({ message: 'OTP sent (mock)', success: true });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

exports.verifyOTP = async (req, res) => {
    const { aadhaar_number, otp } = req.body;
    if (otp === hardcodedOTP) {
        // Find the patient to get their unique MongoDB _id
        const patient = await Patient.findOne({ aadhaar_number });
        if (!patient) {
            return res.status(404).json({ error: 'Patient not found' });
        }
        // Use the MongoDB _id as the unique patient ID for the QR code
        res.status(200).json({ message: 'Login successful', patientId: patient._id });
    } else {
        res.status(401).json({ error: 'Invalid OTP' });
    }
};

exports.captureSymptoms = async (req, res) => {
    const { patientId, symptoms } = req.body;
    try {
        const patient = await Patient.findById(patientId);
        if (!patient) {
            return res.status(404).json({ error: 'Patient not found' });
        }
        patient.symptoms = symptoms;
        await patient.save();
        res.status(200).json({ message: 'Symptoms saved successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

exports.getPatientRecord = async (req, res) => {
    try {
        // Find patient by ID (scanned from QR code)
        const patient = await Patient.findById(req.params.id);
        if (!patient) {
            return res.status(404).json({ error: 'Patient not found' });
        }
        res.status(200).json(patient);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};