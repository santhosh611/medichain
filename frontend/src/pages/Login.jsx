import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSelector from '../components/LanguageSelector';

const Login = ({ setLoggedInUser }) => {
    const { t } = useTranslation();
    const [loginData, setLoginData] = useState({
        username: '',
        password: ''
    });
    const [aadhaar, setAadhaar] = useState('');
    const [otp, setOtp] = useState('');
    const [showOtp, setShowOtp] = useState(false);
    const [loginType, setLoginType] = useState('main');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setLoginData({ ...loginData, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        let response;
        if (loginType === 'main') {
            const superadminRes = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/superadmin/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(loginData)
            });
            if (superadminRes.ok) {
                const data = await superadminRes.json();
                setLoggedInUser({ role: data.role });
                navigate('/superadmin-dashboard');
                return;
            }

            response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/hospital/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(loginData)
            });
        } else if (loginType === 'admin') {
            response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/hospital-admin/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ admin_username: loginData.username, admin_password: loginData.password })
            });
        }
        
        if (response && response.ok) {
            const data = await response.json();
            if (loginType === 'main' && data.firstTime) {
                setLoggedInUser({ role: data.role, firstTime: true, id: data.hospitalId });
            } else {
                setLoggedInUser({ role: data.role });
                navigate('/');
            }
        } else {
            alert(t('login.invalid_credentials'));
        }
        setIsLoading(false);
    };

    const handlePatientLogin = async () => {
        setIsLoading(true);
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/patients/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ aadhaar_number: aadhaar })
        });
        const data = await res.json();
        if (data.success) {
            setShowOtp(true);
        } else {
            alert('Login failed. Please check your Aadhaar number.');
        }
        setIsLoading(false);
    };

    const handlePatientVerifyOtp = async () => {
        setIsLoading(true);
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/patients/verify-otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ aadhaar_number: aadhaar, otp })
        });
        const data = await res.json();
        if (data.patientId) {
            setLoggedInUser({ role: 'patient', id: data.patientId });
            navigate('/patient-dashboard');
        } else {
            alert('Invalid OTP');
        }
        setIsLoading(false);
    };

    const loginTypes = [
        { 
            key: 'main', 
            label: 'Hospital',
            description: 'Hospital staff access',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
            )
        },
        { 
            key: 'admin', 
            label: 'Administrator',
            description: 'System administration',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            )
        },
        { 
            key: 'patient', 
            label: 'Patient',
            description: 'Patient portal access',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
            )
        }
    ];

    return (
        <>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex">
                {/* Left side - Branding */}
                <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800">
                    {/* Geometric pattern overlay */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute inset-0" style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                        }}></div>
                    </div>
                    
                    <div className="relative z-10 flex flex-col justify-center px-12 text-white">
                        <div className="mb-8">
                            <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mb-6 backdrop-blur-sm">
                                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                                </svg>
                            </div>
                            <h1 className="text-4xl font-bold mb-4 tracking-tight">
                                MediCare
                                <span className="block text-2xl font-normal text-blue-100 mt-2">
                                    Healthcare Management System
                                </span>
                            </h1>
                            <p className="text-blue-100 text-lg leading-relaxed">
                                Streamlining healthcare operations with secure, efficient, and comprehensive digital solutions for hospitals, administrators, and patients.
                            </p>
                        </div>
                    
                    </div>
                </div>

                {/* Right side - Login Form */}
                <div className="flex-1 flex items-center justify-center px-6 py-12 lg:px-8">
                    <div className="w-full max-w-md">
                        {/* Mobile header */}
                        <div className="lg:hidden text-center mb-8">
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                                <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">MediCare</h2>
                        </div>

                        {/* Access type selector */}
                        <div className="mb-8">
                            <h3 className="text-sm font-medium text-gray-700 mb-4">Select Access Type</h3>
                            <div className="grid grid-cols-1 gap-3">
                                {loginTypes.map((type) => (
                                    <button
                                        key={type.key}
                                        onClick={() => { setLoginType(type.key); setShowOtp(false); }}
                                        className={`relative p-4 rounded-lg border-2 transition-all duration-200 text-left group ${
                                            loginType === type.key
                                                ? 'border-blue-500 bg-blue-50 shadow-md'
                                                : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                                        }`}
                                    >
                                        <div className="flex items-center">
                                            <div className={`flex-shrink-0 mr-4 ${
                                                loginType === type.key ? 'text-blue-600' : 'text-gray-400'
                                            }`}>
                                                {type.icon}
                                            </div>
                                            <div className="flex-1">
                                                <h4 className={`font-medium ${
                                                    loginType === type.key ? 'text-blue-900' : 'text-gray-900'
                                                }`}>
                                                    {type.label}
                                                </h4>
                                                <p className={`text-sm mt-1 ${
                                                    loginType === type.key ? 'text-blue-600' : 'text-gray-500'
                                                }`}>
                                                    {type.description}
                                                </p>
                                            </div>
                                            <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${
                                                loginType === type.key 
                                                    ? 'border-blue-500 bg-blue-500' 
                                                    : 'border-gray-300'
                                            }`}>
                                                {loginType === type.key && (
                                                    <div className="w-full h-full rounded-full bg-white scale-50"></div>
                                                )}
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Login Form */}
                        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
                            {loginType !== 'patient' ? (
                                <form onSubmit={handleLogin} className="space-y-6">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Username
                                            </label>
                                            <input
                                                type="text"
                                                name="username"
                                                value={loginData.username}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                                placeholder="Enter your username"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Password
                                            </label>
                                            <input
                                                type="password"
                                                name="password"
                                                value={loginData.password}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                                placeholder="Enter your password"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                                    >
                                        {isLoading ? (
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                        ) : null}
                                        {isLoading ? 'Signing in...' : 'Sign In'}
                                    </button>
                                </form>
                            ) : (
                                <div className="space-y-6">
                                    {!showOtp ? (
                                        <>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Aadhaar Number
                                                </label>
                                                <input
                                                    type="text"
                                                    value={aadhaar}
                                                    onChange={(e) => setAadhaar(e.target.value)}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                                    placeholder="Enter your 12-digit Aadhaar number"
                                                    maxLength="12"
                                                    required
                                                />
                                            </div>
                                            <button
                                                onClick={handlePatientLogin}
                                                disabled={isLoading}
                                                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                                            >
                                                {isLoading ? (
                                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                ) : null}
                                                {isLoading ? 'Sending OTP...' : 'Send OTP'}
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <div className="text-center mb-6">
                                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                                    </svg>
                                                </div>
                                                <h3 className="text-lg font-medium text-gray-900 mb-2">OTP Verification</h3>
                                                <p className="text-sm text-gray-600">
                                                    We've sent a 6-digit code to your registered mobile number
                                                </p>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Enter OTP
                                                </label>
                                                <input
                                                    type="text"
                                                    value={otp}
                                                    onChange={(e) => setOtp(e.target.value)}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors text-center text-lg tracking-widest"
                                                    placeholder="000000"
                                                    maxLength="6"
                                                    required
                                                />
                                            </div>
                                            <button
                                                onClick={handlePatientVerifyOtp}
                                                disabled={isLoading}
                                                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 focus:ring-4 focus:ring-green-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                                            >
                                                {isLoading ? (
                                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                ) : null}
                                                {isLoading ? 'Verifying...' : 'Verify OTP'}
                                            </button>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Language selector */}
                        <div className="mt-8 flex justify-center">
                            <div className="bg-white rounded-lg p-2 shadow-sm border border-gray-200">
                                <LanguageSelector />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;