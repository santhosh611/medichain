// medichain/backend/models/Category.js
const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    category_name: {
        type: String,
        required: true,
        unique: true
    }
});

module.exports = mongoose.model('Category', CategorySchema);