// medichain/backend/routes/superadminRoutes.js
const express = require('express');
const router = express.Router();
const superadminController = require('../controllers/superadminController');

router.post('/login', superadminController.superadminLogin);
router.post('/add-hospital', superadminController.addHospital);
router.get('/all-hospitals', superadminController.getAllHospitals);
router.put('/edit-hospital/:id', superadminController.editHospital);
router.delete('/delete-hospital/:id', superadminController.deleteHospital);

module.exports = router;