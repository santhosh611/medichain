const Patient = require('../models/Patient');

exports.getPublicHealthReport = async (req, res) => {
    try {
        const symptoms = await Patient.aggregate([
            {
                $group: {
                    _id: '$symptoms',
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { count: -1 }
            }
        ]);
        res.status(200).json(symptoms);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};