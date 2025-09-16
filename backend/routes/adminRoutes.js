// medichain/backend/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.post('/add-aadhaar', adminController.addAadhaar);
router.get('/all-aadhaar', adminController.getAllAadhaarDetails);
router.put('/update-aadhaar/:id', adminController.updateAadhaar);
router.delete('/delete-aadhaar/:id', adminController.deleteAadhaar);
router.post('/login', adminController.adminLogin);

module.exports = router;