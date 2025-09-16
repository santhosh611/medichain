// medichain/backend/models/Patient.js
const mongoose = require('mongoose');
const PatientSchema = new mongoose.Schema({
    aadhaar_number: {
        type: String,
        required: true,
        unique: true
    },
    symptoms: {
        type: String,
        default: ''
    },
    health_records: [
        {
            date: { type: Date, default: Date.now },
            prescription: { type: String },
            doctorId: { type: String },
            pharmacyNotes: { type: String }
        }
    ]
});

module.exports = mongoose.model('Patient', PatientSchema);