// medichain/frontend/src/App.jsx
import React, { useState, useEffect } from 'react';
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
import { useTranslation } from 'react-i18next';

// A private component to hold all routes for logged-in users
const PrivateRoutes = ({ loggedInUser, setLoggedInUser, handleLogout }) => {
    const navigate = useNavigate();
    
    // Redirect to the appropriate dashboard on initial load
    useEffect(() => {
        if (loggedInUser && !loggedInUser.firstTime) {
            switch (loggedInUser.role) {
                case 'superadmin':
                    navigate('/superadmin-dashboard');
                    break;
                case 'hospital':
                    navigate('/');
                    break;
                case 'hospitalAdmin':
                    navigate('/admin-dashboard');
                    break;
                default:
                    navigate('/');
                    break;
            }
        }
    }, [loggedInUser, navigate]);
    
    return (
        <Routes>
            <Route path="/" element={<MainDashboard />} />
            <Route path="/patient" element={<PatientPage />} />
            <Route path="/doctor" element={<DoctorPage />} />
            <Route path="/pharmacy" element={<PharmacyPage />} />
            <Route path="/superadmin-dashboard/*" element={<SuperAdminDashboard handleLogout={handleLogout} />} />
            <Route path="/admin-dashboard/*" element={<HospitalAdminDashboard />} />
        </Routes>
    );
};

// Main application component
const App = () => {
    const [loggedInUser, setLoggedInUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('loggedInUser');
        if (storedUser) {
            setLoggedInUser(JSON.parse(storedUser));
        }
    }, []);

    const handleLogin = (user) => {
        setLoggedInUser(user);
        localStorage.setItem('loggedInUser', JSON.stringify(user));
    };

    const handleLogout = () => {
        setLoggedInUser(null);
        localStorage.removeItem('loggedInUser');
    };

    // Check for a special case: first-time hospital admin setup
    if (loggedInUser && loggedInUser.role === 'hospital' && loggedInUser.firstTime) {
        return (
            <div className="min-h-screen bg-gray-100 p-8 flex items-center justify-center">
                <SetAdminCredentials hospitalId={loggedInUser.id} setLoggedInUser={handleLogin} />
            </div>
        );
    }
    
    return (
        <Router>
            <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
                <Routes>
                    {/* Publicly accessible routes, including the main login page */}
                    <Route path="/" element={loggedInUser ? <PrivateRoutes loggedInUser={loggedInUser} setLoggedInUser={handleLogin} handleLogout={handleLogout} /> : <Login setLoggedInUser={handleLogin} />} />
                    <Route path="/admin-login" element={<HospitalAdminLogin setLoggedInUser={handleLogin} />} />

                    {/* All other routes are nested under the authenticated context for clarity */}
                    <Route path="/patient" element={<PatientPage />} />
                    <Route path="/doctor" element={<DoctorPage />} />
                    <Route path="/pharmacy" element={<PharmacyPage />} />
                    <Route path="/superadmin-dashboard/*" element={<SuperAdminDashboard handleLogout={handleLogout} />} />
                    <Route path="/admin-dashboard/*" element={<HospitalAdminDashboard />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;