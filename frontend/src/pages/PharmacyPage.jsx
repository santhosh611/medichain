import React, { useState, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

const PharmacyPage = () => {
    const [loggedIn, setLoggedIn] = useState(false);
    const [scanResult, setScanResult] = useState('');
    const [patient, setPatient] = useState(null);
    const [pharmacyNotes, setPharmacyNotes] = useState('');
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
        const res = await fetch('http://localhost:5000/api/pharmacists/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pharmacistId: 'pharmacy456', password: 'pass456' })
        });
        if (res.ok) setLoggedIn(true);
    };

    const fetchPatientData = async (patientId) => {
        const res = await fetch(`http://localhost:5000/api/patients/${patientId}`);
        const data = await res.json();
        setPatient(data);
    };

    const handleAddNotes = async () => {
        await fetch('http://localhost:5000/api/pharmacists/add-notes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ patientId: scanResult, pharmacyNotes })
        });
        alert('Notes added successfully!');
    };

    if (!loggedIn) {
        return (
            <div className="flex justify-center p-8">
                <button onClick={handleLogin} className="bg-purple-500 text-white p-4 rounded">Pharmacy Login</button>
            </div>
        );
    }

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-4">Pharmacy Portal</h1>
            <div id="reader" className="w-full h-80"></div>
            {patient && (
                <div className="mt-8 bg-white p-6 rounded shadow-md">
                    <h2 className="text-xl font-bold">Patient: {patient.aadhaar_number}</h2>
                    <p>Prescription: {patient.health_records[patient.health_records.length - 1]?.prescription}</p>
                    <textarea
                        value={pharmacyNotes}
                        onChange={(e) => setPharmacyNotes(e.target.value)}
                        placeholder="Add dosage notes..."
                        className="w-full p-2 border rounded my-4"
                    ></textarea>
                    <button onClick={handleAddNotes} className="bg-blue-500 text-white p-2 rounded">Add Notes</button>
                </div>
            )}
        </div>
    );
};

export default PharmacyPage;