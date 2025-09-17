// medichain/backend/controllers/adminController.js
const Aadhaar = require('../models/Aadhaar');
const translate = require('google-translate-api-x');
require('dotenv').config();

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

exports.adminLogin = (req, res) => {
    const { username, password } = req.body;
    // Hardcoded credentials for mock admin login
    if (username === 'admin' && password === 'admin123') {
        return res.status(200).json({ message: 'Login successful' });
    }
    res.status(401).json({ error: 'Invalid credentials' });
};

exports.addAadhaar = async (req, res) => {
    try {
        const { aadhaar_number, name, gender, date_of_birth, phone_number, address } = req.body;

        const englishName = name?.en || name;
        const englishAddress = address?.en || address;
        const englishGender = gender;

        const multilingualName = { en: englishName };
        const multilingualAddress = { en: englishAddress };
        
        const translationPromises = SUPPORTED_LANGUAGES.filter(lang => lang !== 'en').map(async (lang) => {
            multilingualName[lang] = await translateText(englishName, lang);
            multilingualAddress[lang] = await translateText(englishAddress, lang);
        });

        await Promise.all(translationPromises);

        const newAadhaar = new Aadhaar({
            aadhaar_number,
            name: multilingualName,
            gender: englishGender,
            date_of_birth,
            phone_number,
            address: multilingualAddress
        });
        await newAadhaar.save();
        res.status(201).json({ message: 'Aadhaar data added successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Server error', details: err.message });
    }
};

exports.getAllAadhaarDetails = async (req, res) => {
    try {
        const allAadhaar = await Aadhaar.find();
        res.status(200).json(allAadhaar);
    } catch (err) {
        res.status(500).json({ error: 'Server error', details: err.message });
    }
};

exports.updateAadhaar = async (req, res) => {
    try {
        const { id } = req.params;
        const { aadhaar_number, name, gender, date_of_birth, phone_number, address } = req.body;

        const englishName = name?.en || name;
        const englishAddress = address?.en || address;
        const englishGender = gender;
        
        const multilingualName = { en: englishName };
        const multilingualAddress = { en: englishAddress };

        const translationPromises = SUPPORTED_LANGUAGES.filter(lang => lang !== 'en').map(async (lang) => {
            if (englishName) {
                multilingualName[lang] = await translateText(englishName, lang);
            }
            if (englishAddress) {
                multilingualAddress[lang] = await translateText(englishAddress, lang);
            }
        });
        await Promise.all(translationPromises);

        const updatedAadhaar = await Aadhaar.findByIdAndUpdate(id, {
            aadhaar_number,
            name: multilingualName,
            gender: englishGender,
            date_of_birth,
            phone_number,
            address: multilingualAddress
        }, { new: true });

        if (!updatedAadhaar) {
            return res.status(404).json({ error: 'Aadhaar details not found' });
        }
        res.status(200).json({ message: 'Aadhaar data updated successfully', data: updatedAadhaar });
    } catch (err) {
        res.status(500).json({ error: 'Server error', details: err.message });
    }
};

exports.deleteAadhaar = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedAadhaar = await Aadhaar.findByIdAndDelete(id);
        if (!deletedAadhaar) {
            return res.status(404).json({ error: 'Aadhaar details not found' });
        }
        res.status(200).json({ message: 'Aadhaar data deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Server error', details: err.message });
    }
};

exports.getAadhaarDetails = async (req, res) => {
    try {
        const { aadhaar_number } = req.params;
        const aadhaar = await Aadhaar.findOne({ aadhaar_number });
        if (!aadhaar) {
            return res.status(404).json({ error: 'Aadhaar details not found' });
        }
        res.status(200).json(aadhaar);
    } catch (err) {
        res.status(500).json({ error: 'Server error', details: err.message });
    }
};