// medichain/backend/controllers/superadminController.js
const Hospital = require('../models/Hospital');

// Hardcoded credentials for Super Admin
const SUPERADMIN_USERNAME = 'superadmin';
const SUPERADMIN_PASSWORD = 'superpassword';

exports.superadminLogin = (req, res) => {
    const { username, password } = req.body;
    if (username === SUPERADMIN_USERNAME && password === SUPERADMIN_PASSWORD) {
        return res.status(200).json({ message: 'Super Admin login successful', role: 'superadmin' });
    }
    res.status(401).json({ error: 'Invalid credentials' });
};

exports.addHospital = async (req, res) => {
    try {
        const { hospital_name, location, username, password } = req.body;
        // Assuming the frontend sends an object for hospital_name and location
        const newHospital = new Hospital({ hospital_name, location, username, password });
        await newHospital.save();
        res.status(201).json({ message: 'Hospital added successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Server error', details: err.message });
    }
};

exports.getAllHospitals = async (req, res) => {
    try {
        const hospitals = await Hospital.find();
        res.status(200).json(hospitals);
    } catch (err) {
        res.status(500).json({ error: 'Server error', details: err.message });
    }
};

exports.editHospital = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedHospital = await Hospital.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedHospital) {
            return res.status(404).json({ error: 'Hospital not found' });
        }
        res.status(200).json({ message: 'Hospital updated successfully', data: updatedHospital });
    } catch (err) {
        res.status(500).json({ error: 'Server error', details: err.message });
    }
};

exports.deleteHospital = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedHospital = await Hospital.findByIdAndDelete(id);
        if (!deletedHospital) {
            return res.status(404).json({ error: 'Hospital not found' });
        }
        res.status(200).json({ message: 'Hospital deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Server error', details: err.message });
    }
};