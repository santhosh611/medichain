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
import DashboardPage from './pages/DashboardPage';
import { useTranslation } from 'react-i18next';

// A private component to hold all routes for logged-in users
const PrivateRoutes = ({ loggedInUser, handleLogout }) => {
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
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/superadmin-dashboard/*" element={<SuperAdminDashboard handleLogout={handleLogout} />} />
            <Route path="/admin-dashboard/*" element={<HospitalAdminDashboard />} />
        </Routes>
    );
};

// Main application component
const App = () => {
    const [loggedInUser, setLoggedInUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Here you would make an API call to a secure endpoint to verify the user's session
        // For now, we will simulate the check.
        const verifySession = async () => {
            // This is where you would replace the localStorage check with an API call
            // const res = await fetch('https://medichain-6tv7.onrender.com/api/auth/verify-session');
            // if (res.ok) {
            //     const user = await res.json();
            //     setLoggedInUser(user);
            // }
            const storedUser = localStorage.getItem('loggedInUser');
            if (storedUser) {
                setLoggedInUser(JSON.parse(storedUser));
            }
            setLoading(false);
        };
        verifySession();
    }, []);

    const handleLogin = (user) => {
        setLoggedInUser(user);
        // localStorage.setItem('loggedInUser', JSON.stringify(user)); // Remove this line
    };

    const handleLogout = () => {
        setLoggedInUser(null);
        localStorage.removeItem('loggedInUser');
        // You would also make an API call to clear the session cookie on the backend
    };

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    }

    if (loggedInUser && loggedInUser.role === 'hospital' && loggedInUser.firstTime) {
        return (
            <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
                <SetAdminCredentials hospitalId={loggedInUser.id} setLoggedInUser={handleLogin} />
            </div>
        );
    }
    
    return (
        <Router>
            <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
                <Routes>
                    <Route path="/" element={loggedInUser ? <PrivateRoutes loggedInUser={loggedInUser} handleLogout={handleLogout} /> : <Login setLoggedInUser={handleLogin} />} />
                    <Route path="/admin-login" element={<HospitalAdminLogin setLoggedInUser={handleLogin} />} />
                    <Route path="/dashboard" element={<DashboardPage />} />
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