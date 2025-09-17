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
        type: Object, // Changed to Object
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    date_of_birth: {
        type: String, 
        required: true
    },
    phone_number: {
        type: String,
        required: true
    },
    address: {
        type: Object, // Changed to Object
        required: true
    }
});

module.exports = mongoose.model('Aadhaar', AadhaarSchema);