// medichain/backend/controllers/superadminController.js
const Hospital = require('../models/Hospital');
const translate = require('google-translate-api-x');
require('dotenv').config();

// Hardcoded credentials for Super Admin
const SUPERADMIN_USERNAME = 'superadmin';
const SUPERADMIN_PASSWORD = 'superpassword';

// Supported languages for translation
const SUPPORTED_LANGUAGES = ['en', 'ta', 'bn', 'te', 'hi']; 

// Function to translate text using the free API
async function translateText(text, targetLang) {
    if (!text || targetLang === 'en') {
        return text;
    }
    
    try {
        const response = await translate(text, { to: targetLang });
        return response.text; 
    } catch (error) {
        console.error(`Error translating text to ${targetLang}:`, error);
        return text;
    }
}

exports.superadminLogin = (req, res) => {
    const { username, password } = req.body;
    if (username === SUPERADMIN_USERNAME && password === SUPERADMIN_PASSWORD) {
        return res.status(200).json({ message: 'Super Admin login successful', role: 'superadmin' });
    }
    res.status(401).json({ error: 'Invalid credentials' });
};

exports.addHospital = async (req, res) => {
    try {
        const { hospital_name, location, username, password } = req.body;
        
        const englishHospitalName = hospital_name?.en || hospital_name;
        const englishLocation = location?.en || location;

        const multilingualName = { en: englishHospitalName };
        const multilingualLocation = { en: englishLocation };

        // 💡 FIX: Use Promise.all to wait for all translations to complete
        const translationPromises = SUPPORTED_LANGUAGES.filter(lang => lang !== 'en').map(async (lang) => {
            const translatedName = await translateText(englishHospitalName, lang);
            multilingualName[lang] = translatedName;
            
            const translatedLocation = await translateText(englishLocation, lang);
            multilingualLocation[lang] = translatedLocation;
        });

        await Promise.all(translationPromises);

        const newHospital = new Hospital({ 
            hospital_name: multilingualName, 
            location: multilingualLocation, 
            username, 
            password 
        });
        await newHospital.save();
        res.status(201).json({ message: 'Hospital added successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Server error', details: err.message });
    }
};

exports.getAllHospitals = async (req, res) => {
    try {
        const hospitals = await Hospital.find();
        res.status(200).json(hospitals);
    } catch (err) {
        res.status(500).json({ error: 'Server error', details: err.message });
    }
};

exports.editHospital = async (req, res) => {
    try {
        const { id } = req.params;
        const { hospital_name, location, username, password } = req.body;
        
        const englishHospitalName = hospital_name?.en || hospital_name;
        const englishLocation = location?.en || location;
        
        const multilingualName = { en: englishHospitalName };
        const multilingualLocation = { en: englishLocation };

        const translationPromises = SUPPORTED_LANGUAGES.filter(lang => lang !== 'en').map(async (lang) => {
            if (englishHospitalName) {
                const translatedName = await translateText(englishHospitalName, lang);
                multilingualName[lang] = translatedName;
            }
            if (englishLocation) {
                const translatedLocation = await translateText(englishLocation, lang);
                multilingualLocation[lang] = translatedLocation;
            }
        });
        await Promise.all(translationPromises);
        
        const updateData = { 
            hospital_name: multilingualName, 
            location: multilingualLocation, 
            username, 
            password 
        };

        const updatedHospital = await Hospital.findByIdAndUpdate(
            id, 
            updateData, 
            { new: true }
        );

        if (!updatedHospital) {
            return res.status(404).json({ error: 'Hospital not found' });
        }
        res.status(200).json({ message: 'Hospital updated successfully', data: updatedHospital });
    } catch (err) {
        res.status(500).json({ error: 'Server error', details: err.message });
    }
};

exports.deleteHospital = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedHospital = await Hospital.findByIdAndDelete(id);
        if (!deletedHospital) {
            return res.status(404).json({ error: 'Hospital not found' });
        }
        res.status(200).json({ message: 'Hospital deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Server error', details: err.message });
    }
};