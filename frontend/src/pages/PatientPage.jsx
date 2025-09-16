// frontend/src/pages/PatientPage.jsx

import React, { useState, useRef } from 'react';
import QRCode from 'qrcode.react';

const PatientPage = () => {
  const [aadhaar, setAadhaar] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const [patientId, setPatientId] = useState(null);
  const [aadhaarData, setAadhaarData] = useState(null);
  const [symptoms, setSymptoms] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState('idle'); // 'idle', 'submitting', 'success'
  const recognitionRef = useRef(null);

  const startRecording = () => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
      recognition.lang = 'en-IN';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;
      recognition.continuous = false;

      recognition.onstart = () => {
        setIsRecording(true);
        console.log('Voice recognition started.');
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setSymptoms(transcript);
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
        console.log('Voice recognition ended.');
      };

      recognition.onerror = (event) => {
        console.error('Voice recognition error:', event.error);
        setIsRecording(false);
      };

      recognition.start();
      recognitionRef.current = recognition;
    } else {
      alert('Your browser does not support the Web Speech API. Please use a different browser.');
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleLogin = async () => {
    const res = await fetch('http://localhost:5000/api/patients/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ aadhaar_number: aadhaar })
    });
    const data = await res.json();
    if (data.success) {
      const aadhaarRes = await fetch(`http://localhost:5000/api/patients/aadhaar/${aadhaar}`);
      if (aadhaarRes.ok) {
        const aadhaarDetails = await aadhaarRes.json();
        setAadhaarData(aadhaarDetails);
      }
      setShowOtp(true);
    } else {
        alert('Login failed. Please check your Aadhaar number.');
    }
  };

  const handleVerifyOtp = async () => {
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
    setSubmissionStatus('submitting');
    const res = await fetch('http://localhost:5000/api/patients/capture-symptoms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ patientId, symptoms })
    });
    if (res.ok) {
      setSubmissionStatus('success');
    } else {
      setSubmissionStatus('idle');
      alert('Failed to submit symptoms. Please try again.');
    }
  };

  const handleNewSubmission = () => {
    setSymptoms('');
    setSubmissionStatus('idle');
  };

  return (
    <div className="flex flex-col items-center p-8">
      {!patientId ? (
        <div className="w-full max-w-md">
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
          {aadhaarData && (
              <div className="bg-white p-6 rounded shadow-md mb-8">
                  <h2 className="text-2xl font-bold mb-4">Patient Details</h2>
                  <p><strong>Name:</strong> {aadhaarData.name}</p>
                  <p><strong>Gender:</strong> {aadhaarData.gender}</p>
                  <p><strong>Date of Birth:</strong> {aadhaarData.date_of_birth}</p>
                  <p><strong>Phone Number:</strong> {aadhaarData.phone_number}</p>
                  <p><strong>Address:</strong> {aadhaarData.address}</p>
              </div>
          )}

          {submissionStatus === 'success' ? (
            <div className="flex flex-col items-center justify-center bg-white p-8 rounded-xl shadow-md">
              <svg className="w-20 h-20 text-green-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2l4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <h2 className="text-2xl font-bold text-gray-800">Symptoms Submitted!</h2>
              <button onClick={handleNewSubmission} className="mt-6 bg-blue-500 text-white p-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors">Submit Another Response</button>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold mb-4">Record Symptoms</h2>
              {isRecording ? (
                <button onClick={stopRecording} className="bg-red-500 text-white p-3 rounded-full mb-4">Stop Recording</button>
              ) : (
                <button onClick={startRecording} className="bg-red-500 text-white p-3 rounded-full mb-4">Start Recording</button>
              )}
              <div className="border border-gray-300 p-4 rounded min-h-[100px] mb-4">{symptoms}</div>
              <button onClick={handleSubmitSymptoms} className="w-full bg-blue-500 text-white p-2 rounded" disabled={submissionStatus === 'submitting'}>
                {submissionStatus === 'submitting' ? 'Submitting...' : 'Submit Symptoms'}
              </button>
              <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4">Your Digital OP Form</h2>
                {patientId && <QRCode value={patientId} size={128} />}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default PatientPage;