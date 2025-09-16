const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');

router.post('/login', doctorController.doctorLogin);
router.post('/prescribe', doctorController.prescribe);

module.exports = router;