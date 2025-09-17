// medichain/backend/models/Doctor.js
const mongoose = require('mongoose');

const DoctorSchema = new mongoose.Schema({
    doctorId: {
        type: String,
        required: true,
        unique: true
    },
    doctor_name: {
        type: String,
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    // New fields
    wardNumber: {
        type: String,
        required: false
    },
    roomNumber: {
        type: String,
        required: false
    }
});

module.exports = mongoose.model('Doctor', DoctorSchema);