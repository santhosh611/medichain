// medichain/backend/models/Aadhaar.js
const mongoose = require('mongoose');

const AadhaarSchema = new mongoose.Schema({
    aadhaar_number: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    name: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    date_of_birth: {
        type: String, // Storing as a string to handle various formats
        required: true
    },
    phone_number: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Aadhaar', AadhaarSchema);