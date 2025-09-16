// medichain/frontend/src/pages/PasswordSetup.jsx
import React, { useState } from 'react';

const PasswordSetup = ({ hospitalId, setLoggedInUser }) => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSetup = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert('Passwords do not match.');
            return;
        }

        const res = await fetch(`http://localhost:5000/api/hospital/setup-password/${hospitalId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password })
        });

        if (res.ok) {
            alert('Password set successfully!');
            setLoggedInUser({ role: 'hospital', passwordSet: true });
        } else {
            alert('Failed to set password.');
        }
    };

    return (
        <div className="w-full max-w-md">
            <form onSubmit={handleSetup} className="w-full max-w-md bg-white p-8 rounded-xl shadow-md">
                <h2 className="text-2xl font-bold mb-4 text-center">Set Your Admin Password</h2>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="New Password" className="w-full p-3 border rounded-lg mb-4" required />
                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm Password" className="w-full p-3 border rounded-lg mb-6" required />
                <button type="submit" className="w-full bg-green-500 text-white p-3 rounded-lg font-semibold hover:bg-green-600 transition-colors">Set Password</button>
            </form>
        </div>
    );
};

export default PasswordSetup;