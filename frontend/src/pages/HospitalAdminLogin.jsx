// medichain/frontend/src/pages/HospitalAdminLogin.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const HospitalAdminLogin = ({ setLoggedInUser }) => {
    const [loginData, setLoginData] = useState({
        admin_username: '',
        admin_password: ''
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setLoginData({ ...loginData, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        const res = await fetch('http://localhost:5000/api/hospital-admin/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(loginData)
        });

        if (res.ok) {
            const data = await res.json();
            setLoggedInUser({ role: data.role });
            navigate('/admin-dashboard');
        } else {
            alert('Invalid admin credentials. Please try again.');
        }
    };

    return (
        <div className="w-full max-w-md mx-auto">
            <form onSubmit={handleLogin} className="w-full max-w-md bg-white p-8 rounded-xl shadow-md">
                <h2 className="text-2xl font-bold mb-4 text-center">Hospital Admin Login</h2>
                <input type="text" name="admin_username" value={loginData.admin_username} onChange={handleChange} placeholder="Admin Username" className="w-full p-3 border rounded-lg mb-4" />
                <input type="password" name="admin_password" value={loginData.admin_password} onChange={handleChange} placeholder="Admin Password" className="w-full p-3 border rounded-lg mb-6" />
                <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">Login</button>
            </form>
        </div>
    );
};

export default HospitalAdminLogin;