const express = require('express');
const router = express.Router();
const pharmacistController = require('../controllers/pharmacistController');

router.post('/login', pharmacistController.pharmacistLogin);
router.post('/add-notes', pharmacistController.addPharmacyNotes);

module.exports = router;