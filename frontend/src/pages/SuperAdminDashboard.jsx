// medichain/frontend/src/pages/SuperAdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const SuperAdminDashboard = ({ handleLogout }) => {
    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="w-64 bg-white shadow-md p-6">
                <h2 className="text-2xl font-bold mb-6">Super Admin</h2>
                <nav>
                    <ul className="space-y-2">
                        <li>
                            <Link to="add-hospital" className="block p-3 rounded-lg font-semibold text-gray-700 hover:bg-gray-200">Add New Hospital</Link>
                        </li>
                        <li>
                            <Link to="view-hospitals" className="block p-3 rounded-lg font-semibold text-gray-700 hover:bg-gray-200">View Hospitals</Link>
                        </li>
                        <li>
                            <button onClick={handleLogout} className="w-full text-left p-3 rounded-lg font-semibold text-red-500 hover:bg-red-100">Logout</button>
                        </li>
                    </ul>
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-8 overflow-y-auto">
                <h1 className="text-3xl font-bold mb-8">Super Admin Dashboard</h1>
                <Routes>
                    <Route path="add-hospital" element={<AddHospitalForm />} />
                    <Route path="view-hospitals" element={<ViewHospitals />} />
                </Routes>
            </div>
        </div>
    );
};

const AddHospitalForm = () => {
    const [formData, setFormData] = useState({
        hospital_name: '',
        location: '',
        username: '',
        password: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await fetch('http://localhost:5000/api/superadmin/add-hospital', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        if (res.ok) {
            alert('Hospital added successfully!');
            setFormData({ hospital_name: '', location: '', username: '', password: '' });
        } else {
            alert('Failed to add hospital.');
        }
    };

    return (
        <div className="w-full max-w-lg mx-auto bg-white p-8 rounded-xl shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-center">Add New Hospital</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" name="hospital_name" value={formData.hospital_name} onChange={handleChange} placeholder="Hospital Name" className="w-full p-3 border rounded-lg" required />
                <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="Location" className="w-full p-3 border rounded-lg" required />
                <input type="text" name="username" value={formData.username} onChange={handleChange} placeholder="Username" className="w-full p-3 border rounded-lg" required />
                <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" className="w-full p-3 border rounded-lg" required />
                <button type="submit" className="w-full bg-green-500 text-white p-3 rounded-lg font-semibold hover:bg-green-600 transition-colors">Add Hospital</button>
            </form>
        </div>
    );
};

const ViewHospitals = () => {
    const [hospitals, setHospitals] = useState([]);
    const [editingHospital, setEditingHospital] = useState(null);
    const [formData, setFormData] = useState({
        hospital_name: '',
        location: '',
        username: '',
        password: ''
    });

    const fetchHospitals = async () => {
        const res = await fetch('http://localhost:5000/api/superadmin/all-hospitals');
        if (res.ok) {
            const data = await res.json();
            setHospitals(data);
        }
    };

    useEffect(() => {
        fetchHospitals();
    }, []);

    const handleEdit = (hospital) => {
        setEditingHospital(hospital);
        setFormData(hospital);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        const res = await fetch(`http://localhost:5000/api/superadmin/edit-hospital/${editingHospital._id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        if (res.ok) {
            alert('Hospital updated successfully!');
            setEditingHospital(null);
            fetchHospitals();
        } else {
            alert('Failed to update hospital.');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this hospital?')) {
            const res = await fetch(`http://localhost:5000/api/superadmin/delete-hospital/${id}`, {
                method: 'DELETE'
            });
            if (res.ok) {
                alert('Hospital deleted successfully!');
                fetchHospitals();
            } else {
                alert('Failed to delete hospital.');
            }
        }
    };

    return (
        <div className="w-full bg-white p-8 rounded-xl shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-center">Existing Hospitals</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {hospitals.map(hospital => (
                    <div key={hospital._id} className="bg-gray-50 p-6 rounded-lg shadow-inner">
                        <p><strong>Name:</strong> {hospital.hospital_name}</p>
                        <p><strong>Location:</strong> {hospital.location}</p>
                        <p><strong>Username:</strong> {hospital.username}</p>
                        <div className="mt-4 flex justify-between">
                            <button onClick={() => handleEdit(hospital)} className="bg-yellow-500 text-white p-2 rounded-lg text-sm hover:bg-yellow-600">Edit</button>
                            <button onClick={() => handleDelete(hospital._id)} className="bg-red-500 text-white p-2 rounded-lg text-sm hover:bg-red-600">Delete</button>
                        </div>
                    </div>
                ))}
            </div>
            {editingHospital && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
                    <form onSubmit={handleUpdate} className="bg-white p-8 rounded-xl shadow-md w-full max-w-lg">
                        <h2 className="text-2xl font-bold mb-6">Edit Hospital</h2>
                        <div className="space-y-4">
                            <input type="text" name="hospital_name" value={formData.hospital_name} onChange={e => setFormData({ ...formData, hospital_name: e.target.value })} placeholder="Hospital Name" className="w-full p-3 border rounded-lg" required />
                            <input type="text" name="location" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} placeholder="Location" className="w-full p-3 border rounded-lg" required />
                            <input type="text" name="username" value={formData.username} onChange={e => setFormData({ ...formData, username: e.target.value })} placeholder="Username" className="w-full p-3 border rounded-lg" required />
                            <input type="password" name="password" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} placeholder="Password" className="w-full p-3 border rounded-lg" required />
                        </div>
                        <div className="mt-6 flex justify-end space-x-4">
                            <button type="button" onClick={() => setEditingHospital(null)} className="bg-gray-500 text-white p-3 rounded-lg font-semibold hover:bg-gray-600">Cancel</button>
                            <button type="submit" className="bg-green-500 text-white p-3 rounded-lg font-semibold hover:bg-green-600">Update Hospital</button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};
export default SuperAdminDashboard; 