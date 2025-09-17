import React, { useState, useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

const DoctorPage = () => {
    const [loggedIn, setLoggedIn] = useState(false);
    const [scanResult, setScanResult] = useState('');
    const [patient, setPatient] = useState(null);
    const [prescription, setPrescription] = useState('');
    const [scanner, setScanner] = useState(null);
    const [isScanned, setIsScanned] = useState(false); // New state for scan status
    const scannerRef = useRef(null); // Ref to hold the scanner instance

    const renderScanner = () => {
        // Stop any existing scanner instance before rendering a new one
        if (scannerRef.current) {
            scannerRef.current.clear().catch(error => {
                console.error("Failed to clear existing scanner: ", error);
            });
            scannerRef.current = null;
        }

        const qrScanner = new Html5QrcodeScanner('reader', {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            // Request the back camera by default
            facingMode: { exact: "environment" }
        });
        
        scannerRef.current = qrScanner;
        qrScanner.render(onScanSuccess, onScanFailure);
    };

    useEffect(() => {
        if (loggedIn) {
            renderScanner();
        }

        // Cleanup function to stop the scanner on unmount
        return () => {
            if (scannerRef.current) {
                scannerRef.current.clear().catch(error => {
                    console.error("Failed to clear scanner on unmount: ", error);
                });
            }
        };
    }, [loggedIn]);

    const onScanSuccess = (decodedText) => {
        setScanResult(decodedText);
        setIsScanned(true); // Set scan status to success
        if (scannerRef.current) {
            scannerRef.current.clear();
        }
        fetchPatientData(decodedText);
    };

    const onScanFailure = (error) => {
        // This is normal for mobile as it continuously looks for a QR code
        console.warn('QR scan error:', error);
    };

    const handleLogin = async () => {
        const res = await fetch('https://medichain-6tv7.onrender.com/api/doctors/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ doctorId: 'doc123', password: 'pass123' })
        });
        if (res.ok) setLoggedIn(true);
    };

    const fetchPatientData = async (patientId) => {
        const res = await fetch(`https://medichain-6tv7.onrender.com/api/patients/${patientId}`);
        const data = await res.json();
        setPatient(data);
    };

    const handlePrescribe = async () => {
        await fetch('https://medichain-6tv7.onrender.com/api/doctors/prescribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ patientId: scanResult, prescription, doctorId: 'doc123' })
        });
        alert('Prescription saved!');
    };
    
    // Function to reset the state and allow rescanning
    const handleRescan = () => {
        setScanResult('');
        setPatient(null);
        setPrescription('');
        setIsScanned(false);
        renderScanner();
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
            {!isScanned ? (
                <>
                    <h2 className="text-xl font-bold mb-4">QR Scanner</h2>
                    <div id="reader" className="w-full h-80"></div>
                </>
            ) : (
                <div className="mt-8 bg-white p-6 rounded shadow-md">
                    <div className="flex items-center justify-center mb-4">
                        <span className="text-green-500 text-3xl mr-2">✓</span>
                        <p className="text-xl font-bold text-green-500">QR Code Scanned Successfully!</p>
                    </div>
                    {patient && (
                        <>
                            <h2 className="text-xl font-bold">Patient ID: {patient._id}</h2>
                            <p className="mt-2 text-gray-600">Symptoms: {patient.symptoms}</p>
                            <textarea
                                value={prescription}
                                onChange={(e) => setPrescription(e.target.value)}
                                placeholder="Write prescription here..."
                                className="w-full p-2 border rounded my-4"
                            ></textarea>
                            <button onClick={handlePrescribe} className="bg-blue-500 text-white p-2 rounded">Submit Prescription</button>
                        </>
                    )}
                    <button onClick={handleRescan} className="mt-4 w-full bg-gray-500 text-white p-2 rounded">Scan New Patient</button>
                </div>
            )}
        </div>
    );
};

export default DoctorPage;