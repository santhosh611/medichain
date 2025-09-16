import React, { useState } from 'react';
import PatientPage from './pages/PatientPage';
import DoctorPage from './pages/DoctorPage';
import PharmacyPage from './pages/PharmacyPage';
import DashboardPage from './pages/DashboardPage';

const App = () => {
    const [role, setRole] = useState(null);

    const renderContent = () => {
        switch (role) {
            case 'patient':
                return <PatientPage />;
            case 'doctor':
                return <DoctorPage />;
            case 'pharmacy':
                return <PharmacyPage />;
            case 'dashboard':
                return <DashboardPage />;
            default:
                return (
                    <div className="flex flex-col items-center justify-center h-screen space-y-4">
                        <button onClick={() => setRole('patient')} className="bg-blue-500 text-white p-4 rounded text-xl">Patient Portal</button>
                        <button onClick={() => setRole('doctor')} className="bg-green-500 text-white p-4 rounded text-xl">Doctor Portal</button>
                        <button onClick={() => setRole('pharmacy')} className="bg-purple-500 text-white p-4 rounded text-xl">Pharmacy Portal</button>
                        <button onClick={() => setRole('dashboard')} className="bg-gray-500 text-white p-4 rounded text-xl">Public Dashboard</button>
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {renderContent()}
        </div>
    );
};

export default App;