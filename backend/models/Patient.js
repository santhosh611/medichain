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
            doctorId: { type: String }, // Corrected field name from previous responses
            pharmacyNotes: { type: String } // Corrected field name
        }
    ]
});

module.exports = mongoose.model('Patient', PatientSchema);