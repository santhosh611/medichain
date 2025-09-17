// medichain/backend/routes/categoryRoutes.js
const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

router.post('/add-category', categoryController.addCategory);
router.get('/all-categories', categoryController.getAllCategories);
router.put('/update-category/:id', categoryController.updateCategory);
router.delete('/delete-category/:id', categoryController.deleteCategory);

module.exports = router;