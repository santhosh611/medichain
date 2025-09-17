// medichain/backend/controllers/categoryController.js
const Category = require('../models/Category');

exports.addCategory = async (req, res) => {
    try {
        const { category_name } = req.body;
        const newCategory = new Category({ category_name });
        await newCategory.save();
        res.status(201).json({ message: 'Category added successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Server error', details: err.message });
    }
};

exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json(categories);
    } catch (err) {
        res.status(500).json({ error: 'Server error', details: err.message });
    }
};

exports.updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { category_name } = req.body;
        const updatedCategory = await Category.findByIdAndUpdate(id, { category_name }, { new: true });

        if (!updatedCategory) {
            return res.status(404).json({ error: 'Category not found' });
        }
        res.status(200).json({ message: 'Category updated successfully', data: updatedCategory });
    } catch (err) {
        res.status(500).json({ error: 'Server error', details: err.message });
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedCategory = await Category.findByIdAndDelete(id);
        if (!deletedCategory) {
            return res.status(404).json({ error: 'Category not found' });
        }
        res.status(200).json({ message: 'Category deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Server error', details: err.message });
    }
};