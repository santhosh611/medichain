// medichain/backend/controllers/hospitalController.js
const Hospital = require('../models/Hospital');

exports.hospitalLogin = async (req, res) => {
    const { username, password } = req.body;
    try {
        const hospital = await Hospital.findOne({ username, password });
        if (!hospital) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        if (hospital.admin_credentials_set) {
            // Regular hospital login, go to public portals
            return res.status(200).json({ message: 'Login successful', role: 'hospital' });
        } else {
            // First-time login, prompt to set admin credentials
            return res.status(200).json({ message: 'First-time login, please set up admin credentials.', role: 'hospital', firstTime: true, hospitalId: hospital._id });
        }
    } catch (err) {
        res.status(500).json({ error: 'Server error', details: err.message });
    }
};

exports.setupAdminCredentials = async (req, res) => {
    try {
        const { id } = req.params;
        const { admin_username, admin_password } = req.body;
        const hospital = await Hospital.findByIdAndUpdate(id, {
            admin_username,
            admin_password,
            admin_credentials_set: true
        }, { new: true });

        if (!hospital) {
            return res.status(404).json({ error: 'Hospital not found' });
        }
        res.status(200).json({ message: 'Admin credentials set successfully', hospital });
    } catch (err) {
        res.status(500).json({ error: 'Server error', details: err.message });
    }
};