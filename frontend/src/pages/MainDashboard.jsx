// medichain/frontend/src/pages/MainDashboard.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const MainDashboard = () => {
    return (
        <div className="flex flex-col items-center justify-center p-8">
            <div className="text-center mb-12">
                <div className="flex justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path></svg>
                </div>
                <h1 className="text-5xl font-bold text-gray-800">MediChain</h1>
                <p className="text-xl text-gray-600 mt-4">Seamless healthcare connectivity through QR-enabled patient records.</p>
                <p className="text-xl text-gray-600">Connecting patients, doctors, and pharmacists in one unified platform.</p>
            </div>
            
            <div className="flex justify-center space-x-8 w-full max-w-5xl">
                <div className="bg-white p-8 rounded-xl shadow-md text-center flex-1 transition-transform transform hover:scale-105">
                    <div className="flex justify-center mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">Patient Portal</h2>
                    <p className="text-gray-500 mt-2">Record symptoms with voice input and generate your digital health record with QR access.</p>
                    <Link to="/patient" className="mt-6 inline-block bg-blue-500 text-white p-3 rounded-lg shadow-md hover:bg-blue-600 transition-colors">Continue as Patient</Link>
                </div>

                <div className="bg-white p-8 rounded-xl shadow-md text-center flex-1 transition-transform transform hover:scale-105">
                    <div className="flex justify-center mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">Doctor Portal</h2>
                    <p className="text-gray-500 mt-2">Scan patient QR codes to access symptoms and write digital prescriptions seamlessly.</p>
                    <Link to="/doctor" className="mt-6 inline-block bg-green-500 text-white p-3 rounded-lg shadow-md hover:bg-green-600 transition-colors">Continue as Doctor</Link>
                </div>

                <div className="bg-white p-8 rounded-xl shadow-md text-center flex-1 transition-transform transform hover:scale-105">
                    <div className="flex justify-center mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-purple-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5A5.5 5.5 0 0 1 7.5 3c1.74 0 3.41.81 4.5 2.05C13.09 3.81 14.76 3 16.5 3A5.5 5.5 0 0 1 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path></svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">Pharmacy Portal</h2>
                    <p className="text-gray-500 mt-2">Access prescriptions via QR scan and add medication guidance for patients.</p>
                    <Link to="/pharmacy" className="mt-6 inline-block bg-purple-500 text-white p-3 rounded-lg shadow-md hover:bg-purple-600 transition-colors">Continue as Pharmacy</Link>
                </div>
            </div>
            
            {/* Admin and Analytics Links */}
            <div className="absolute bottom-8 right-8">
                <Link to="/dashboard" className="flex items-center text-gray-600 hover:text-blue-500 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 20V10M12 20V4M6 20v-6"></path></svg>
                    Health Analytics
                </Link>
            </div>
            <div className="absolute bottom-8 left-8">
                <Link to="/admin-login" className="flex items-center text-gray-600 hover:text-red-500 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                    Admin Portal
                </Link>
            </div>
        </div>
    );
};

export default MainDashboard;