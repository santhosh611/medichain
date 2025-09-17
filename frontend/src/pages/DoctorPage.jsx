import React, { useState, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

const DoctorPage = () => {
    const [loggedIn, setLoggedIn] = useState(false);
    const [scanResult, setScanResult] = useState('');
    const [patient, setPatient] = useState(null);
    const [prescription, setPrescription] = useState('');
    const [scanner, setScanner] = useState(null);

    useEffect(() => {
        if (loggedIn && !scanner) {
            const qrScanner = new Html5QrcodeScanner('reader', { fps: 10, qrbox: 250 });
            setScanner(qrScanner);
            qrScanner.render(onScanSuccess, onScanFailure);
        }

        return () => {
            if (scanner) {
                scanner.clear().catch(error => {
                    console.error("Failed to clear scanner: ", error);
                });
            }
        };
    }, [loggedIn, scanner]);

    const onScanSuccess = (decodedText) => {
        setScanResult(decodedText);
        if (scanner) {
            scanner.clear();
        }
        fetchPatientData(decodedText);
    };

    const onScanFailure = (error) => {
        console.warn('QR scan error:', error);
    };

    const handleLogin = async () => {
        // Mock login
        const res = await fetch('http://localhost:5000/api/doctors/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ doctorId: 'doc123', password: 'pass123' })
        });
        if (res.ok) setLoggedIn(true);
    };

    const fetchPatientData = async (patientId) => {
        const res = await fetch(`http://localhost:5000/api/patients/${patientId}`);
        const data = await res.json();
        setPatient(data);
    };

    const handlePrescribe = async () => {
        await fetch('http://localhost:5000/api/doctors/prescribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ patientId: scanResult, prescription, doctorId: 'doc123' })
        });
        alert('Prescription saved!');
    };

    if (!loggedIn) {
        return (
            <div className="flex justify-center p-4 sm:p-8">
                <button onClick={handleLogin} className="bg-green-500 text-white p-4 rounded-lg shadow-md hover:bg-green-600 transition-colors">Doctor Login</button>
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-8">
            <h1 className="text-3xl font-bold mb-4">Doctor Portal</h1>
            <div className="bg-white p-4 rounded-xl shadow-md mb-6">
                <h2 className="text-xl font-bold mb-4">QR Scanner</h2>
                <div id="reader" className="w-full"></div>
            </div>
            {patient && (
                <div className="mt-8 bg-white p-6 rounded-xl shadow-md">
                    <h2 className="text-xl font-bold">Patient ID: {patient._id}</h2>
                    <p className="mt-2 text-gray-600">Symptoms: {patient.symptoms}</p>
                    <textarea
                        value={prescription}
                        onChange={(e) => setPrescription(e.target.value)}
                        placeholder="Write prescription here..."
                        className="w-full p-3 border rounded-lg my-4 focus:outline-none focus:ring-2 focus:ring-green-500"
                        rows="5"
                    ></textarea>
                    <button onClick={handlePrescribe} className="w-full sm:w-auto bg-green-500 text-white p-3 rounded-lg font-semibold hover:bg-green-600 transition-colors">Submit Prescription</button>
                </div>
            )}
        </div>
    );
};

export default DoctorPage;