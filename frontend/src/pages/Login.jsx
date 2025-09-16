// medichain/frontend/src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = ({ setLoggedInUser }) => {
    const [loginData, setLoginData] = useState({
        username: '',
        password: ''
    });
    const [loginType, setLoginType] = useState('main'); // 'main' or 'admin'
    const navigate = useNavigate();

    const handleChange = (e) => {
        setLoginData({ ...loginData, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        
        let response;
        if (loginType === 'main') {
            const superadminRes = await fetch('http://localhost:5000/api/superadmin/login', {
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

            response = await fetch('http://localhost:5000/api/hospital/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(loginData)
            });
        } else {
            response = await fetch('http://localhost:5000/api/hospital-admin/login', {
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
            alert('Invalid credentials. Please try again.');
        }
    };

    return (
        <div className="w-full max-w-md">
            <div className="flex justify-center mb-6">
                <button
                    className={`px-4 py-2 font-semibold rounded-t-lg ${loginType === 'main' ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-700'}`}
                    onClick={() => setLoginType('main')}
                >
                    Main Login
                </button>
                <button
                    className={`px-4 py-2 font-semibold rounded-t-lg ${loginType === 'admin' ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-700'}`}
                    onClick={() => setLoginType('admin')}
                >
                    Hospital Admin Login
                </button>
            </div>
            <form onSubmit={handleLogin} className="w-full max-w-md bg-white p-8 rounded-b-xl shadow-md">
                <h2 className="text-2xl font-bold mb-4 text-center">
                    {loginType === 'main' ? 'Main Login' : 'Hospital Admin Login'}
                </h2>
                <input type="text" name="username" value={loginData.username} onChange={handleChange} placeholder="Username" className="w-full p-3 border rounded-lg mb-4" />
                <input type="password" name="password" value={loginData.password} onChange={handleChange} placeholder="Password" className="w-full p-3 border rounded-lg mb-6" />
                <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">Login</button>
            </form>
        </div>
    );
};

export default Login;