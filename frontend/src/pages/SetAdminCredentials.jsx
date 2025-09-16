// medichain/frontend/src/pages/SetAdminCredentials.jsx
import React, { useState } from 'react';

const SetAdminCredentials = ({ hospitalId, setLoggedInUser }) => {
    const [credentials, setCredentials] = useState({
        admin_username: '',
        admin_password: '',
        confirm_password: ''
    });

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSetup = async (e) => {
        e.preventDefault();
        if (credentials.admin_password !== credentials.confirm_password) {
            alert('Passwords do not match.');
            return;
        }

        const res = await fetch(`http://localhost:5000/api/hospital/setup-admin-credentials/${hospitalId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials)
        });

        if (res.ok) {
            alert('Admin credentials set successfully!');
            // Redirect to the main hospital dashboard after successful setup
            setLoggedInUser({ role: 'hospital' });
        } else {
            alert('Failed to set credentials.');
        }
    };

    return (
        <div className="w-full max-w-md">
            <form onSubmit={handleSetup} className="w-full max-w-md bg-white p-8 rounded-xl shadow-md">
                <h2 className="text-2xl font-bold mb-4 text-center">Set up Hospital Admin Credentials</h2>
                <p className="text-center text-sm text-gray-600 mb-6">This is a one-time setup. Please create your admin username and password.</p>
                <input type="text" name="admin_username" value={credentials.admin_username} onChange={handleChange} placeholder="Admin Username" className="w-full p-3 border rounded-lg mb-4" required />
                <input type="password" name="admin_password" value={credentials.admin_password} onChange={handleChange} placeholder="Admin Password" className="w-full p-3 border rounded-lg mb-4" required />
                <input type="password" name="confirm_password" value={credentials.confirm_password} onChange={handleChange} placeholder="Confirm Password" className="w-full p-3 border rounded-lg mb-6" required />
                <button type="submit" className="w-full bg-green-500 text-white p-3 rounded-lg font-semibold hover:bg-green-600 transition-colors">Set Credentials</button>
            </form>
        </div>
    );
};

export default SetAdminCredentials;