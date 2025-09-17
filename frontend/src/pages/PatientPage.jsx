// frontend/src/pages/PatientPage.jsx
import React, { useState, useRef } from 'react';
import QRCode from 'qrcode.react';
import html2canvas from 'html2canvas';

const PatientPage = () => {
  const [aadhaar, setAadhaar] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const [patientId, setPatientId] = useState(null);
  const [aadhaarData, setAadhaarData] = useState(null);
  const [symptoms, setSymptoms] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState('idle');
  const [assignedDoctor, setAssignedDoctor] = useState(null);
  const recognitionRef = useRef(null);
  const opFormRef = useRef(null);

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
    const res = await fetch('https://medichain-6tv7.onrender.com/api/patients/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ aadhaar_number: aadhaar })
    });
    const data = await res.json();
    if (data.success) {
      const aadhaarRes = await fetch(`https://medichain-6tv7.onrender.com/api/patients/aadhaar/${aadhaar}`);
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
    const res = await fetch('https://medichain-6tv7.onrender.com/api/patients/verify-otp', {
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
    if (!symptoms) {
      alert("Please record your symptoms before submitting.");
      return;
    }
    setSubmissionStatus('submitting');
    
    const res = await fetch('https://medichain-6tv7.onrender.com/api/patients/capture-symptoms-and-assign-doctor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ patientId, symptoms })
    });

    if (res.ok) {
      const data = await res.json();
      setAssignedDoctor(data.assignedDoctor);
      setSubmissionStatus('success');
    } else {
      setSubmissionStatus('idle');
      alert('Failed to submit symptoms or assign a doctor. Please try again.');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = async () => {
    if (!opFormRef.current) return;

    const canvas = await html2canvas(opFormRef.current);
    const image = canvas.toDataURL('image/png');
    
    const link = document.createElement('a');
    link.href = image;
    link.download = `OP_Form_${aadhaarData.aadhaar_number}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleNewSubmission = () => {
    setSymptoms('');
    setSubmissionStatus('idle');
    setAssignedDoctor(null);
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
                  <p><strong>Name:</strong> {aadhaarData.name?.en}</p>
                  <p><strong>Gender:</strong> {aadhaarData.gender}</p>
                  <p><strong>Date of Birth:</strong> {aadhaarData.date_of_birth}</p>
                  <p><strong>Phone Number:</strong> {aadhaarData.phone_number}</p>
                  <p><strong>Address:</strong> {aadhaarData.address?.en}</p>
              </div>
          )}

          {submissionStatus === 'success' ? (
            <div className="flex flex-col items-center justify-center bg-white p-8 rounded-xl shadow-md">
                <div className="op-form-container print:p-8" ref={opFormRef}>
                    <h2 className="text-2xl font-bold mb-4">adminssion form</h2>
                    
                    {aadhaarData && (
                        <div className="mb-6">
                            <p><strong>Aadhaar No:</strong> {aadhaarData.aadhaar_number}</p>
                            <p><strong>Name:</strong> {aadhaarData.name?.en}</p>
                            <p><strong>Gender:</strong> {aadhaarData.gender}</p>
                            <p><strong>DOB:</strong> {aadhaarData.date_of_birth}</p>
                            <p><strong>Phone:</strong> {aadhaarData.phone_number}</p>
                            <p><strong>Address:</strong> {aadhaarData.address?.en}</p>
                        </div>
                    )}

                    {assignedDoctor && (
                        <div className="mb-6">
                            <h3 className="text-xl font-semibold">Assigned Doctor:</h3>
                            <p><strong>Name:</strong> {assignedDoctor.doctor_name}</p>
                            <p><strong>Category:</strong> {assignedDoctor.category?.category_name}</p>
                            {assignedDoctor.wardNumber && <p><strong>Ward Number:</strong> {assignedDoctor.wardNumber}</p>}
                            {assignedDoctor.roomNumber && <p><strong>Room Number:</strong> {assignedDoctor.roomNumber}</p>}
                        </div>
                    )}
                    
                    <div className="flex justify-center mb-6">
                        {patientId && <QRCode value={patientId} size={128} />}
                    </div>
                </div>
              <button onClick={handlePrint} className="w-full bg-blue-500 text-white p-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors print:hidden">
                Print Form
              </button>
              <button onClick={handleDownload} className="w-full mt-2 bg-purple-500 text-white p-3 rounded-lg font-semibold hover:bg-purple-600 transition-colors">
                Download Form
              </button>
              <button onClick={handleNewSubmission} className="w-full mt-2 bg-gray-500 text-white p-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors">
                New Submission
              </button>
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
                <h2 className="text-2xl font-bold mb-4">Your Digital QR Code</h2>
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