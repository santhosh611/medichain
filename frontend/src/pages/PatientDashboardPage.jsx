// medichain/frontend/src/pages/PatientDashboardPage.jsx
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const PatientDashboardPage = ({ loggedInPatientId }) => {
    const { t, i18n } = useTranslation();
    const [patientData, setPatientData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
                setError('Server error fetching records.');
            } finally {
                setLoading(false);
            }
        };

        fetchPatientRecords();
    }, [loggedInPatientId]);

    if (loading) {
        return <div className="flex justify-center p-8">Loading...</div>;
    }

    if (error) {
        return <div className="text-center p-8 text-red-500">{error}</div>;
    }

    if (!patientData) {
        return <div className="text-center p-8">No records found for this patient.</div>;
    }
    
    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-8 text-center">Patient Dashboard</h1>
            <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-3xl mx-auto">
                <h2 className="text-2xl font-bold mb-4">Aadhaar Details</h2>
                <p><strong>Aadhaar Number:</strong> {patientData.aadhaar_number}</p>
                <p><strong>Symptoms:</strong> {patientData.symptoms}</p>
                <p className="mt-4">
                    <strong>Assigned Doctor:</strong> {patientData.assignedDoctor?.doctor_name || 'N/A'} 
                    {patientData.assignedDoctor?.category?.category_name && ` (${patientData.assignedDoctor.category.category_name})`}
                </p>

                <h2 className="text-2xl font-bold mt-8 mb-4">Health Records</h2>
                {patientData.health_records.length > 0 ? (
                    <div className="space-y-6">
                        {patientData.health_records.map((record, index) => (
                            <div key={index} className="border-b-2 border-gray-200 pb-4 last:border-b-0">
                                <p><strong>Date:</strong> {new Date(record.date).toLocaleDateString()}</p>
                                <p><strong>Prescription:</strong> {record.prescription}</p>
                                <p><strong>Doctor ID:</strong> {record.doctorId}</p>
                                {record.pharmacyNotes && <p><strong>Pharmacy Notes:</strong> {record.pharmacyNotes}</p>}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No health records available yet.</p>
                )}
            </div>
        </div>
    );
};

export default PatientDashboardPage;