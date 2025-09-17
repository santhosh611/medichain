// medichain/backend/controllers/patientController.js
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const Category = require('../models/Category');

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

exports.captureSymptomsAndAssignDoctor = async (req, res) => {
    const { patientId, symptoms } = req.body;
    try {
        const patient = await Patient.findById(patientId);
        if (!patient) {
            return res.status(404).json({ error: 'Patient not found' });
        }
        
        const lowerCaseSymptoms = symptoms.toLowerCase();
        let assignedCategory = null;
        let assignedDoctor = null;

        // Step 1: Find a matching category based on keywords (case-insensitive)
        if (lowerCaseSymptoms.includes('diabetes')) {
            assignedCategory = await Category.findOne({ category_name: { $regex: /diabetes/i } });
        } else if (lowerCaseSymptoms.includes('heart')) {
            assignedCategory = await Category.findOne({ category_name: { $regex: /cardiology/i } });
        } else if (lowerCaseSymptoms.includes('fever')) {
            assignedCategory = await Category.findOne({ category_name: { $regex: /general medicine/i } });
        }
        
        // Step 2: Find a doctor in the assigned category or fallback to General Medicine
        if (assignedCategory) {
            assignedDoctor = await Doctor.findOne({ category: assignedCategory._id });
        }

        // Fallback to a 'General Medicine' doctor if a specific one wasn't found
        if (!assignedDoctor) {
            const fallbackCategory = await Category.findOne({ category_name: 'General Medicine' });
            if (fallbackCategory) {
                assignedDoctor = await Doctor.findOne({ category: fallbackCategory._id });
            }
        }
        
        // Update patient record with symptoms and assigned doctor's ID
        patient.symptoms = symptoms;
        patient.assignedDoctor = assignedDoctor ? assignedDoctor._id : null;
        await patient.save();
        
        // Fetch the updated patient record, populating the assigned doctor's details
        const updatedPatient = await Patient.findById(patientId)
            .populate({
                path: 'assignedDoctor',
                populate: { path: 'category' }
            })
            .lean();

        res.status(200).json(updatedPatient);
    } catch (err) {
        res.status(500).json({ error: 'Server error', details: err.message });
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