// medichain/backend/controllers/hospitalAdminController.js
const Hospital = require('../models/Hospital');

exports.adminLogin = async (req, res) => {
    const { admin_username, admin_password } = req.body;
    try {
        const hospital = await Hospital.findOne({ admin_username, admin_password });
        if (!hospital) {
            return res.status(401).json({ error: 'Invalid admin credentials' });
        }
        res.status(200).json({ message: 'Admin login successful', role: 'hospitalAdmin' });
    } catch (err) {
        res.status(500).json({ error: 'Server error', details: err.message });
    }
};