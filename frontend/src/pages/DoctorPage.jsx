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
            <div className="flex justify-center p-8">
                <button onClick={handleLogin} className="bg-green-500 text-white p-4 rounded">Doctor Login</button>
            </div>
        );
    }

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-4">Doctor Portal</h1>
            <div id="reader" className="w-full h-80"></div>
            {patient && (
                <div className="mt-8 bg-white p-6 rounded shadow-md">
                    <h2 className="text-xl font-bold">Patient ID: {patient._id}</h2>
                    <p>Symptoms: {patient.symptoms}</p>
                    <textarea
                        value={prescription}
                        onChange={(e) => setPrescription(e.target.value)}
                        placeholder="Write prescription here..."
                        className="w-full p-2 border rounded my-4"
                    ></textarea>
                    <button onClick={handlePrescribe} className="bg-blue-500 text-white p-2 rounded">Submit Prescription</button>
                </div>
            )}
        </div>
    );
};

export default DoctorPage;