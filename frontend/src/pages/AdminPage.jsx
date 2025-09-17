// medichain/frontend/src/pages/AdminPage.jsx
import React, { useState, useEffect } from 'react';

const AdminPage = () => {
    const [loggedIn, setLoggedIn] = useState(false);
    const [activeTab, setActiveTab] = useState('add'); // 'add' or 'view'
    const [aadhaarData, setAadhaarData] = useState([]);
    const [editingAadhaar, setEditingAadhaar] = useState(null);

    const [formData, setFormData] = useState({
        aadhaar_number: '',
        name: '',
        gender: '',
        date_of_birth: '',
        phone_number: '',
        address: ''
    });

    const [loginData, setLoginData] = useState({
        username: '',
        password: ''
    });

    const fetchAllAadhaarDetails = async () => {
        const res = await fetch('https://medichain-6tv7.onrender.com/api/admin/all-aadhaar');
        if (res.ok) {
            const data = await res.json();
            setAadhaarData(data);
        } else {
            alert('Failed to fetch Aadhaar data.');
        }
    };

    useEffect(() => {
        if (loggedIn && activeTab === 'view') {
            fetchAllAadhaarDetails();
        }
    }, [loggedIn, activeTab]);

    const handleLoginChange = (e) => {
        setLoginData({ ...loginData, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        const res = await fetch('https://medichain-6tv7.onrender.com/api/admin/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(loginData)
        });
        if (res.ok) {
            setLoggedIn(true);
        } else {
            alert('Invalid credentials');
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await fetch('https://medichain-6tv7.onrender.com/api/admin/add-aadhaar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        if (res.ok) {
            alert('Aadhaar data added successfully!');
            setFormData({
                aadhaar_number: '',
                name: '',
                gender: '',
                date_of_birth: '',
                phone_number: '',
                address: ''
            });
        } else {
            alert('Failed to add Aadhaar data.');
        }
    };

    const handleEdit = (aadhaar) => {
        setEditingAadhaar(aadhaar);
        setFormData(aadhaar);
        setActiveTab('add');
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        const res = await fetch(`https://medichain-6tv7.onrender.com/api/admin/update-aadhaar/${editingAadhaar._id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        if (res.ok) {
            alert('Aadhaar data updated successfully!');
            setEditingAadhaar(null);
            setFormData({
                aadhaar_number: '',
                name: '',
                gender: '',
                date_of_birth: '',
                phone_number: '',
                address: ''
            });
            fetchAllAadhaarDetails();
            setActiveTab('view');
        } else {
            alert('Failed to update Aadhaar data.');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this record?')) {
            const res = await fetch(`https://medichain-6tv7.onrender.com/api/admin/delete-aadhaar/${id}`, {
                method: 'DELETE'
            });
            if (res.ok) {
                alert('Aadhaar data deleted successfully!');
                fetchAllAadhaarDetails();
            } else {
                alert('Failed to delete Aadhaar data.');
            }
        }
    };

    if (!loggedIn) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <form onSubmit={handleLogin} className="w-full max-w-md bg-white p-8 rounded-xl shadow-md">
                    <h2 className="text-2xl font-bold mb-4 text-center">Admin Login</h2>
                    <input type="text" name="username" value={loginData.username} onChange={handleLoginChange} placeholder="Username" className="w-full p-3 border rounded-lg mb-4" />
                    <input type="password" name="password" value={loginData.password} onChange={handleLoginChange} placeholder="Password" className="w-full p-3 border rounded-lg mb-6" />
                    <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">Login</button>
                </form>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-gray-100">
            <div className="w-64 bg-white shadow-md p-6">
                <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
                <nav>
                    <ul className="space-y-2">
                        <li>
                            <button onClick={() => { setActiveTab('add'); setEditingAadhaar(null); setFormData({ aadhaar_number: '', name: '', gender: '', date_of_birth: '', phone_number: '', address: '' }); }} className={`w-full text-left p-3 rounded-lg font-semibold ${activeTab === 'add' ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-200'}`}>Add New Data</button>
                        </li>
                        <li>
                            <button onClick={() => setActiveTab('view')} className={`w-full text-left p-3 rounded-lg font-semibold ${activeTab === 'view' ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-200'}`}>See Saved Data</button>
                        </li>
                    </ul>
                </nav>
            </div>

            <div className="flex-1 p-8 overflow-y-auto">
                <h1 className="text-3xl font-bold mb-8">Admin Portal</h1>

                {activeTab === 'add' && (
                    <div className="w-full max-w-lg bg-white p-8 rounded-xl shadow-md mx-auto">
                        <h2 className="text-2xl font-bold mb-6 text-center">{editingAadhaar ? 'Edit Aadhaar Data' : 'Add New Aadhaar Data'}</h2>
                        <form onSubmit={editingAadhaar ? handleUpdate : handleSubmit} className="space-y-4">
                            <input type="text" name="aadhaar_number" value={formData.aadhaar_number} onChange={handleChange} placeholder="Aadhaar Number" className="w-full p-3 border rounded-lg" required />
                            <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name" className="w-full p-3 border rounded-lg" required />
                            <input type="text" name="gender" value={formData.gender} onChange={handleChange} placeholder="Gender" className="w-full p-3 border rounded-lg" required />
                            <input type="text" name="date_of_birth" value={formData.date_of_birth} onChange={handleChange} placeholder="Date of Birth (YYYY-MM-DD)" className="w-full p-3 border rounded-lg" required />
                            <input type="text" name="phone_number" value={formData.phone_number} onChange={handleChange} placeholder="Phone Number" className="w-full p-3 border rounded-lg" required />
                            <textarea name="address" value={formData.address} onChange={handleChange} placeholder="Address" className="w-full p-3 border rounded-lg" required></textarea>
                            <button type="submit" className="w-full bg-green-500 text-white p-3 rounded-lg font-semibold hover:bg-green-600 transition-colors">{editingAadhaar ? 'Update Aadhaar Data' : 'Add Aadhaar Data'}</button>
                            {editingAadhaar && <button onClick={() => setEditingAadhaar(null)} className="w-full mt-2 bg-gray-500 text-white p-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors">Cancel</button>}
                        </form>
                    </div>
                )}

                {activeTab === 'view' && (
                    <div className="w-full bg-white p-8 rounded-xl shadow-md">
                        <h2 className="text-2xl font-bold mb-6 text-center">Saved Aadhaar Data</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {aadhaarData.map(aadhaar => (
                                <div key={aadhaar._id} className="bg-gray-50 p-6 rounded-lg shadow-inner">
                                    <p><strong>Aadhaar No:</strong> {aadhaar.aadhaar_number}</p>
                                    <p><strong>Name:</strong> {aadhaar.name}</p>
                                    <p><strong>Gender:</strong> {aadhaar.gender}</p>
                                    <p><strong>DOB:</strong> {aadhaar.date_of_birth}</p>
                                    <p><strong>Phone:</strong> {aadhaar.phone_number}</p>
                                    <p><strong>Address:</strong> {aadhaar.address}</p>
                                    <div className="mt-4 flex justify-between">
                                        <button onClick={() => handleEdit(aadhaar)} className="bg-yellow-500 text-white p-2 rounded-lg text-sm hover:bg-yellow-600">Edit</button>
                                        <button onClick={() => handleDelete(aadhaar._id)} className="bg-red-500 text-white p-2 rounded-lg text-sm hover:bg-red-600">Delete</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminPage;