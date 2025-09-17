// medichain/backend/server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// Import routes
const patientRoutes = require('./routes/patientRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const pharmacistRoutes = require('./routes/pharmacistRoutes');
const reportRoutes = require('./routes/reportRoutes');
const adminRoutes = require('./routes/adminRoutes');
const superadminRoutes = require('./routes/superadminRoutes');
const hospitalRoutes = require('./routes/hospitalRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const hospitalAdminRoutes = require('./routes/hospitalAdminRoutes'); // New import
const doctorAdminRoutes = require('./routes/doctorAdminRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Use routes
app.use('/api/patients', patientRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/pharmacists', pharmacistRoutes);
app.use('/api/report', reportRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/superadmin', superadminRoutes);
app.use('/api/hospital', hospitalRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/hospital-admin', hospitalAdminRoutes); // New route
app.use('/api/doctor-admin', doctorAdminRoutes); 

// Serve the frontend static files in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../frontend/dist')));

    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
    });
}

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));