// medichain/backend/routes/doctorAdminRoutes.js
const express = require('express');
const router = express.Router();
const doctorAdminController = require('../controllers/doctorAdminController');

router.post('/add-doctor', doctorAdminController.addDoctor);
router.get('/all-doctors', doctorAdminController.getAllDoctors);
router.put('/update-doctor/:id', doctorAdminController.updateDoctor);
router.delete('/delete-doctor/:id', doctorAdminController.deleteDoctor);

module.exports = router;