const Patient = require('../models/Patient');

exports.pharmacistLogin = (req, res) => {
    const { pharmacistId, password } = req.body;
    // Hardcoded credentials for hackathon
    if (pharmacistId === 'pharmacy456' && password === 'pass456') {
        return res.status(200).json({ message: 'Login successful' });
    }
    res.status(401).json({ error: 'Invalid credentials' });
};

exports.addPharmacyNotes = async (req, res) => {
    const { patientId, pharmacyNotes } = req.body;
    try {
        const patient = await Patient.findById(patientId);
        if (!patient) {
            return res.status(404).json({ error: 'Patient not found' });
        }
        
        // Check if there are any prescriptions to add notes to
        if (patient.health_records.length === 0) {
            return res.status(404).json({ error: 'No prescription found for this patient' });
        }

        const latestRecord = patient.health_records[patient.health_records.length - 1];
        latestRecord.pharmacyNotes = pharmacyNotes;
        await patient.save();
        return res.status(200).json({ message: 'Notes added successfully' });
        
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};