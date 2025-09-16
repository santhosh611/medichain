// medichain/backend/controllers/adminController.js
const Aadhaar = require('../models/Aadhaar');

exports.adminLogin = (req, res) => {
    const { username, password } = req.body;
    // Hardcoded credentials for mock admin login
    if (username === 'admin' && password === 'admin123') {
        return res.status(200).json({ message: 'Login successful' });
    }
    res.status(401).json({ error: 'Invalid credentials' });
};

exports.addAadhaar = async (req, res) => {
    try {
        const newAadhaar = new Aadhaar(req.body);
        await newAadhaar.save();
        res.status(201).json({ message: 'Aadhaar data added successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Server error', details: err.message });
    }
};

exports.getAllAadhaarDetails = async (req, res) => {
    try {
        const allAadhaar = await Aadhaar.find();
        res.status(200).json(allAadhaar);
    } catch (err) {
        res.status(500).json({ error: 'Server error', details: err.message });
    }
};

exports.updateAadhaar = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedAadhaar = await Aadhaar.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedAadhaar) {
            return res.status(404).json({ error: 'Aadhaar details not found' });
        }
        res.status(200).json({ message: 'Aadhaar data updated successfully', data: updatedAadhaar });
    } catch (err) {
        res.status(500).json({ error: 'Server error', details: err.message });
    }
};

exports.deleteAadhaar = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedAadhaar = await Aadhaar.findByIdAndDelete(id);
        if (!deletedAadhaar) {
            return res.status(404).json({ error: 'Aadhaar details not found' });
        }
        res.status(200).json({ message: 'Aadhaar data deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Server error', details: err.message });
    }
};

exports.getAadhaarDetails = async (req, res) => {
    try {
        const { aadhaar_number } = req.params;
        const aadhaar = await Aadhaar.findOne({ aadhaar_number });
        if (!aadhaar) {
            return res.status(404).json({ error: 'Aadhaar details not found' });
        }
        res.status(200).json(aadhaar);
    } catch (err) {
        res.status(500).json({ error: 'Server error', details: err.message });
    }
};