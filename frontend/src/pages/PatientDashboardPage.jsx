import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const PatientDashboardPage = ({ loggedInPatientId, handleLogout }) => {
    const { t, i18n } = useTranslation();
    const [patientData, setPatientData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        const fetchPatientRecords = async () => {
            if (!loggedInPatientId) {
                setLoading(false);
                setError('No patient ID provided. Please log in.');
                return;
            }
            try {
                const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/patients/records/${loggedInPatientId}`);
                if (res.ok) {
                    const data = await res.json();
                    setPatientData(data);
                } else {
                    setError('Failed to fetch patient records.');
                }
            } catch (err) {
                console.error('Error fetching patient data:', err);
                setError('Server error fetching records.');
            } finally {
                setLoading(false);
            }
        };

        fetchPatientRecords();
    }, [loggedInPatientId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="bg-white rounded-lg shadow-lg p-8 flex flex-col items-center">
                    <svg className="animate-spin h-12 w-12 text-blue-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="text-gray-600 text-lg">Loading your health records...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
                    <div className="text-center">
                        <svg className="h-16 w-16 text-red-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Something went wrong</h3>
                        <p className="text-gray-600 mb-6">{error}</p>
                        <button 
                            onClick={() => window.location.reload()}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!patientData) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4 text-center">
                    <svg className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No Records Found</h3>
                    <p className="text-gray-600">No medical records found for this patient.</p>
                </div>
            </div>
        );
    }

    const tabs = [
        { id: 'overview', name: 'Overview', icon: '👤' },
        { id: 'records', name: 'Health Records', icon: '📋' },
        { id: 'doctor', name: 'Doctor Info', icon: '👨‍⚕️' }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <div className="flex items-center">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center mr-4">
                                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Patient Portal</h1>
                                <p className="text-sm text-gray-600">Welcome back to your health dashboard</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="hidden sm:flex items-center text-sm text-gray-500">
                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                                </svg>
                                {new Date().toLocaleDateString()}
                            </div>
                            {handleLogout && (
                                <button 
                                    onClick={handleLogout}
                                    className="flex items-center px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                    Logout
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Patient Info Banner */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                    <div className="flex items-center">
                        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mr-6">
                            {patientData.aadhaar_number ? patientData.aadhaar_number.slice(-2) : 'P'}
                        </div>
                        <div className="flex-1">
                            <h2 className="text-xl font-semibold text-gray-900 mb-1">
                                Patient ID: {patientData.aadhaar_number}
                            </h2>
                            <div className="flex items-center text-sm text-gray-600">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mr-3">
                                    Active Patient
                                </span>
                                <span>Last updated: {new Date().toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-lg shadow-sm mb-8">
                    <div className="border-b border-gray-200">
                        <nav className="-mb-px flex space-x-8 px-6">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center transition-colors ${
                                        activeTab === tab.id
                                            ? 'border-blue-500 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    <span className="mr-2 text-lg">{tab.icon}</span>
                                    {tab.name}
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Tab Content */}
                    <div className="p-6">
                        {activeTab === 'overview' && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="bg-blue-50 rounded-lg p-6">
                                        <div className="flex items-center">
                                            <div className="p-3 bg-blue-100 rounded-lg">
                                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                            </div>
                                            <div className="ml-4">
                                                <p className="text-sm font-medium text-blue-600">Health Records</p>
                                                <p className="text-2xl font-semibold text-blue-900">{patientData.health_records.length}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-green-50 rounded-lg p-6">
                                        <div className="flex items-center">
                                            <div className="p-3 bg-green-100 rounded-lg">
                                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                            </div>
                                            <div className="ml-4">
                                                <p className="text-sm font-medium text-green-600">Assigned Doctor</p>
                                                <p className="text-lg font-semibold text-green-900">
                                                    {patientData.assignedDoctor?.doctor_name ? 'Yes' : 'Not Assigned'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-purple-50 rounded-lg p-6">
                                        <div className="flex items-center">
                                            <div className="p-3 bg-purple-100 rounded-lg">
                                                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                                </svg>
                                            </div>
                                            <div className="ml-4">
                                                <p className="text-sm font-medium text-purple-600">Status</p>
                                                <p className="text-lg font-semibold text-purple-900">Active</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Current Symptoms */}
                                {patientData.symptoms && (
                                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                                        <h3 className="text-lg font-medium text-yellow-800 mb-2 flex items-center">
                                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                            </svg>
                                            Current Symptoms
                                        </h3>
                                        <p className="text-yellow-700">{patientData.symptoms}</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'records' && (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-medium text-gray-900">Medical History</h3>
                                    <span className="text-sm text-gray-500">
                                        {patientData.health_records.length} record{patientData.health_records.length !== 1 ? 's' : ''}
                                    </span>
                                </div>

                                {patientData.health_records.length > 0 ? (
                                    <div className="space-y-4">
                                        {patientData.health_records.map((record, index) => (
                                            <div key={index} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                                                <div className="flex items-start justify-between mb-4">
                                                    <div className="flex items-center">
                                                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                                                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                            </svg>
                                                        </div>
                                                        <div>
                                                            <h4 className="font-medium text-gray-900">Medical Record #{index + 1}</h4>
                                                            <p className="text-sm text-gray-500">{new Date(record.date).toLocaleDateString()}</p>
                                                        </div>
                                                    </div>
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                        Prescription
                                                    </span>
                                                </div>

                                                <div className="space-y-3">
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-700">Prescription:</p>
                                                        <p className="text-gray-900 mt-1">{record.prescription}</p>
                                                    </div>
                                                    
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-700">Doctor ID:</p>
                                                        <p className="text-gray-900 mt-1">{record.doctorId}</p>
                                                    </div>

                                                    {record.pharmacyNotes && (
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-700">Pharmacy Notes:</p>
                                                            <p className="text-gray-900 mt-1">{record.pharmacyNotes}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        <h3 className="mt-2 text-sm font-medium text-gray-900">No health records</h3>
                                        <p className="mt-1 text-sm text-gray-500">You don't have any medical records yet.</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'doctor' && (
                            <div className="space-y-6">
                                {patientData.assignedDoctor ? (
                                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
                                        <div className="flex items-center mb-4">
                                            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-xl font-bold mr-4">
                                                Dr
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-semibold text-gray-900">
                                                    {patientData.assignedDoctor.doctor_name}
                                                </h3>
                                                {patientData.assignedDoctor.category?.category_name && (
                                                    <p className="text-blue-600 font-medium">
                                                        {patientData.assignedDoctor.category.category_name}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                                            <div className="bg-white rounded-lg p-4">
                                                <p className="text-sm font-medium text-gray-600">Specialization</p>
                                                <p className="text-lg text-gray-900 mt-1">
                                                    {patientData.assignedDoctor.category?.category_name || 'General Medicine'}
                                                </p>
                                            </div>
                                            <div className="bg-white rounded-lg p-4">
                                                <p className="text-sm font-medium text-gray-600">Status</p>
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-1">
                                                    Assigned
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        <h3 className="mt-2 text-sm font-medium text-gray-900">No doctor assigned</h3>
                                        <p className="mt-1 text-sm text-gray-500">A doctor will be assigned to you soon.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default PatientDashboardPage;