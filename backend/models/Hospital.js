// medichain/backend/models/Hospital.js
const mongoose = require('mongoose');

const HospitalSchema = new mongoose.Schema({
    hospital_name: {
        type: String,
        required: true,
        unique: true
    },
    location: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    admin_username: {
        type: String,
        default: null
    },
    admin_password: {
        type: String,
        default: null
    },
    admin_credentials_set: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('Hospital', HospitalSchema);