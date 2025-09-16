// medichain/frontend/src/App.jsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import SetAdminCredentials from './pages/SetAdminCredentials';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import MainDashboard from './pages/MainDashboard';
import HospitalAdminDashboard from './pages/HospitalAdminDashboard';
import HospitalAdminLogin from './pages/HospitalAdminLogin';
import PatientPage from './pages/PatientPage';
import DoctorPage from './pages/DoctorPage';
import PharmacyPage from './pages/PharmacyPage';

// Main application component
const App = () => {
    const [loggedInUser, setLoggedInUser] = useState(null); // { role, id, ... }

    return (
        <Router>
            <div className="min-h-screen bg-gray-100 p-8">
                {/* Render the Login page if no user is logged in */}
                {!loggedInUser ? (
                    <div className="min-h-screen bg-gray-100 p-8 flex items-center justify-center">
                        <Login setLoggedInUser={setLoggedInUser} />
                    </div>
                ) : // First-time setup for a hospital admin
                (loggedInUser.role === 'hospital' && loggedInUser.firstTime) ? (
                    <div className="min-h-screen bg-gray-100 p-8 flex items-center justify-center">
                        <SetAdminCredentials hospitalId={loggedInUser.id} setLoggedInUser={setLoggedInUser} />
                    </div>
                ) : (
                    // Render the appropriate dashboard or content once logged in
                    <Routes>
                        <Route path="/" element={<MainDashboard />} />
                        <Route path="/patient" element={<PatientPage />} />
                        <Route path="/doctor" element={<DoctorPage />} />
                        <Route path="/pharmacy" element={<PharmacyPage />} />
                        <Route path="/superadmin-dashboard/*" element={<SuperAdminDashboard />} />
                        <Route path="/admin-login" element={<HospitalAdminLogin setLoggedInUser={setLoggedInUser} />} />
                        <Route path="/admin-dashboard/*" element={<HospitalAdminDashboard />} />
                    </Routes>
                )}
            </div>
        </Router>
    );
};

export default App;