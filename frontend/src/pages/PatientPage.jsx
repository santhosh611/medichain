// frontend/src/pages/PatientPage.jsx

import React, { useState } from 'react';
import QRCode from 'qrcode.react'; // You'll need to install this library

const PatientPage = () => {
  const [aadhaar, setAadhaar] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const [patientId, setPatientId] = useState(null);
  const [symptoms, setSymptoms] = useState('');

  // Function for voice-to-text
  const startRecording = () => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-IN';
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setSymptoms(transcript);
    };
    recognition.start();
  };

  const handleLogin = async () => {
    // API call to backend for login
    const res = await fetch('http://localhost:5000/api/patients/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ aadhaar_number: aadhaar })
    });
    const data = await res.json();
    if (data.success) {
      setShowOtp(true);
    }
  };

  const handleVerifyOtp = async () => {
    // API call to backend to verify OTP
    const res = await fetch('http://localhost:5000/api/patients/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ aadhaar_number: aadhaar, otp })
    });
    const data = await res.json();
    if (data.patientId) {
      setPatientId(data.patientId);
    } else {
      alert('Invalid OTP');
    }
  };

  const handleSubmitSymptoms = async () => {
    // API call to backend to save symptoms
    await fetch('http://localhost:5000/api/patients/capture-symptoms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ patientId, symptoms })
    });
  };

  return (
    <div className="flex flex-col items-center p-8">
      {!patientId ? (
        <div className="w-full max-w-md">
          {/* Login and OTP form */}
          <input type="text" value={aadhaar} onChange={(e) => setAadhaar(e.target.value)} placeholder="Mock Aadhaar Number" className="w-full p-2 border rounded mb-4" />
          <button onClick={handleLogin} className="w-full bg-blue-500 text-white p-2 rounded">Login</button>
          {showOtp && (
            <div className="mt-4">
              <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter OTP" className="w-full p-2 border rounded mb-4" />
              <button onClick={handleVerifyOtp} className="w-full bg-green-500 text-white p-2 rounded">Verify OTP</button>
            </div>
          )}
        </div>
      ) : (
        <div className="w-full max-w-md">
          {/* Symptom capture and QR code display */}
          <h2 className="text-2xl font-bold mb-4">Record Symptoms</h2>
          <button onClick={startRecording} className="bg-red-500 text-white p-3 rounded-full mb-4">Start Recording</button>
          <div className="border border-gray-300 p-4 rounded min-h-[100px] mb-4">{symptoms}</div>
          <button onClick={handleSubmitSymptoms} className="w-full bg-blue-500 text-white p-2 rounded">Submit Symptoms</button>
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Your Digital OP Form</h2>
            {patientId && <QRCode value={patientId} size={128} />}
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientPage;