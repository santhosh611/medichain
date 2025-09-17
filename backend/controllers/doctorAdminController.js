// medichain/backend/controllers/doctorAdminController.js
const Doctor = require('../models/Doctor');
const { v4: uuidv4 } = require('uuid');

exports.addDoctor = async (req, res) => {
    try {
        const { doctor_name, category, wardNumber, roomNumber } = req.body;
        const doctorId = uuidv4();
        const newDoctor = new Doctor({ doctorId, doctor_name, category, wardNumber, roomNumber });
        await newDoctor.save();
        res.status(201).json({ message: 'Doctor added successfully', doctor: newDoctor });
    } catch (err) {
        res.status(500).json({ error: 'Server error', details: err.message });
    }
};

exports.getAllDoctors = async (req, res) => {
    try {
        const doctors = await Doctor.find().populate('category');
        res.status(200).json(doctors);
    } catch (err) {
        res.status(500).json({ error: 'Server error', details: err.message });
    }
};

exports.updateDoctor = async (req, res) => {
    try {
        const { id } = req.params;
        const { doctor_name, category, wardNumber, roomNumber } = req.body;
        const updatedDoctor = await Doctor.findByIdAndUpdate(
            id,
            { doctor_name, category, wardNumber, roomNumber },
            { new: true }
        ).populate('category');

        if (!updatedDoctor) {
            return res.status(404).json({ error: 'Doctor not found' });
        }
        res.status(200).json({ message: 'Doctor updated successfully', doctor: updatedDoctor });
    } catch (err) {
        res.status(500).json({ error: 'Server error', details: err.message });
    }
};

exports.deleteDoctor = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedDoctor = await Doctor.findByIdAndDelete(id);
        if (!deletedDoctor) {
            return res.status(404).json({ error: 'Doctor not found' });
        }
        res.status(200).json({ message: 'Doctor deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Server error', details: err.message });
    }
};