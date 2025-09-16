// medichain/backend/routes/hospitalAdminRoutes.js
const express = require('express');
const router = express.Router();
const hospitalAdminController = require('../controllers/hospitalAdminController');

router.post('/login', hospitalAdminController.adminLogin);

module.exports = router;