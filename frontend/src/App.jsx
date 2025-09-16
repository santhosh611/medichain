// medichain/frontend/src/App.jsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import PatientPage from './pages/PatientPage';
import DoctorPage from './pages/DoctorPage';
import PharmacyPage from './pages/PharmacyPage';
import DashboardPage from './pages/DashboardPage';

const App = () => {
    return (
        <Router>
            <div className="min-h-screen bg-gray-100">
                <Routes>
                    <Route path="/patient" element={<PatientPage />} />
                    <Route path="/doctor" element={<DoctorPage />} />
                    <Route path="/pharmacy" element={<PharmacyPage />} />
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/" element={<Home />} />
                </Routes>
            </div>
        </Router>
    );
};

const Home = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen space-y-4">
            <Link to="/patient" className="bg-blue-500 text-white p-4 rounded text-xl">Patient Portal</Link>
            <Link to="/doctor" className="bg-green-500 text-white p-4 rounded text-xl">Doctor Portal</Link>
            <Link to="/pharmacy" className="bg-purple-500 text-white p-4 rounded text-xl">Pharmacy Portal</Link>
            <Link to="/dashboard" className="bg-gray-500 text-white p-4 rounded text-xl">Public Dashboard</Link>
        </div>
    );
};

export default App;