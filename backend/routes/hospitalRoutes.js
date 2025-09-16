// medichain/backend/routes/hospitalRoutes.js
const express = require('express');
const router = express.Router();
const hospitalController = require('../controllers/hospitalController');

router.post('/login', hospitalController.hospitalLogin);
router.post('/setup-admin-credentials/:id', hospitalController.setupAdminCredentials);

module.exports = router;