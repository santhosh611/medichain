const Patient = require('../models/Patient');

exports.doctorLogin = (req, res) => {
    const { doctorId, password } = req.body;
    // Hardcoded credentials for hackathon
    if (doctorId === 'doc123' && password === 'pass123') {
        return res.status(200).json({ message: 'Login successful' });
    }
    res.status(401).json({ error: 'Invalid credentials' });
};

exports.getPatientRecord = async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.id);
        if (!patient) {
            return res.status(404).json({ error: 'Patient not found' });
        }
        res.status(200).json(patient);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

exports.prescribe = async (req, res) => {
    const { patientId, prescription, doctorId } = req.body;
    try {
        const patient = await Patient.findById(patientId);
        if (!patient) {
            return res.status(404).json({ error: 'Patient not found' });
        }
        patient.health_records.push({ prescription, doctorId });
        await patient.save();
        res.status(200).json({ message: 'Prescription saved successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};