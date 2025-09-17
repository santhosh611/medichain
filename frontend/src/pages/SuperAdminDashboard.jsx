// medichain/frontend/src/pages/SuperAdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const SuperAdminDashboard = ({ handleLogout }) => {
    const { t } = useTranslation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="relative flex min-h-screen bg-gray-100">
            {/* Sidebar Toggle Button for Mobile */}
            <button
                onClick={toggleSidebar}
                className="md:hidden absolute top-4 left-4 z-50 p-2 bg-white rounded-md shadow-md text-gray-700"
            >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>
            
            {/* Sidebar */}
            <div className={`md:w-64 bg-white shadow-lg p-6 fixed md:relative inset-y-0 left-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-200 ease-in-out z-40`}>
                <h2 className="text-2xl font-bold mb-6">{t('superadmin_dashboard.sidebar.title')}</h2>
                <nav>
                    <ul className="space-y-2">
                        <li>
                            <Link to="add-hospital" className="block p-3 rounded-lg font-semibold text-gray-700 hover:bg-gray-200" onClick={() => setIsSidebarOpen(false)}>{t('superadmin_dashboard.sidebar.add_hospital')}</Link>
                        </li>
                        <li>
                            <Link to="view-hospitals" className="block p-3 rounded-lg font-semibold text-gray-700 hover:bg-gray-200" onClick={() => setIsSidebarOpen(false)}>{t('superadmin_dashboard.sidebar.view_hospitals')}</Link>
                        </li>
                        <li>
                            <button onClick={handleLogout} className="w-full text-left p-3 rounded-lg font-semibold text-red-500 hover:bg-red-100">{t('superadmin_dashboard.sidebar.logout')}</button>
                        </li>
                    </ul>
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-4 md:p-8 overflow-y-auto">
                <h1 className="text-3xl font-bold mb-8">{t('superadmin_dashboard.title')}</h1>
                <Routes>
                    <Route path="add-hospital" element={<AddHospitalForm />} />
                    <Route path="view-hospitals" element={<ViewHospitals />} />
                </Routes>
            </div>
        </div>
    );
};

const AddHospitalForm = () => {
    const { t } = useTranslation();
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

        // 💡 Correctly format the payload to send multilingual objects to the backend
        const payload = {
            hospital_name: { en: formData.hospital_name },
            location: { en: formData.location },
            username: formData.username,
            password: formData.password
        };

        const res = await fetch('http://localhost:5000/api/superadmin/add-hospital', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (res.ok) {
            alert('Hospital added successfully!');
            setFormData({ hospital_name: '', location: '', username: '', password: '' });
        } else {
            alert('Failed to add hospital.');
        }
    };
    return (
        <div className="w-full max-w-lg mx-auto bg-white p-6 sm:p-8 rounded-xl shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-center">{t('superadmin_dashboard.add_hospital_form.title')}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" name="hospital_name" value={formData.hospital_name} onChange={handleChange} placeholder={t('superadmin_dashboard.add_hospital_form.hospital_name_placeholder') + " (English)"} className="w-full p-3 border rounded-lg" required />
                <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder={t('superadmin_dashboard.add_hospital_form.location_placeholder') + " (English)"} className="w-full p-3 border rounded-lg" required />
                <input type="text" name="username" value={formData.username} onChange={handleChange} placeholder={t('superadmin_dashboard.add_hospital_form.username_placeholder')} className="w-full p-3 border rounded-lg" required />
                <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder={t('superadmin_dashboard.add_hospital_form.password_placeholder')} className="w-full p-3 border rounded-lg" required />
                <button type="submit" className="w-full bg-green-500 text-white p-3 rounded-lg font-semibold hover:bg-green-600 transition-colors">{t('superadmin_dashboard.add_hospital_form.button')}</button>
            </form>
        </div>
    );
};

const ViewHospitals = () => {
    const { t, i18n } = useTranslation();
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
        setFormData({
            hospital_name: hospital.hospital_name.en || '',
            location: hospital.location.en || '',
            username: hospital.username,
            password: ''
        });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        
        // 💡 Correctly format the payload for updating, similar to adding
        const payload = {
            hospital_name: { en: formData.hospital_name },
            location: { en: formData.location },
            username: formData.username,
            password: formData.password
        };

        const res = await fetch(`http://localhost:5000/api/superadmin/edit-hospital/${editingHospital._id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
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
        <div className="w-full bg-white p-6 md:p-8 rounded-xl shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-center">{t('superadmin_dashboard.view_hospitals_list.title')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {hospitals.map(hospital => (
                    <div key={hospital._id} className="bg-white p-4 sm:p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                        <p><strong>{t('superadmin_dashboard.view_hospitals_list.hospital_name')}:</strong> {hospital.hospital_name?.[i18n.language] || hospital.hospital_name?.en || 'N/A'}</p>
                        <p><strong>{t('superadmin_dashboard.view_hospitals_list.location')}:</strong> {hospital.location?.[i18n.language] || hospital.location?.en || 'N/A'}</p>
                        <p><strong>{t('superadmin_dashboard.view_hospitals_list.username')}:</strong> {hospital.username}</p>
                        <div className="mt-4 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                            <button onClick={() => handleEdit(hospital)} className="bg-yellow-500 text-white p-2 rounded-lg text-sm hover:bg-yellow-600 w-full sm:w-auto">{t('superadmin_dashboard.view_hospitals_list.edit_button')}</button>
                            <button onClick={() => handleDelete(hospital._id)} className="bg-red-500 text-white p-2 rounded-lg text-sm hover:bg-red-600 w-full sm:w-auto">{t('superadmin_dashboard.view_hospitals_list.delete_button')}</button>
                        </div>
                    </div>
                ))}
            </div>
            {editingHospital && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4">
                    <form onSubmit={handleUpdate} className="bg-white p-6 sm:p-8 rounded-xl shadow-md w-full max-w-lg">
                        <h2 className="text-2xl font-bold mb-6">{t('superadmin_dashboard.edit_hospital_form.title')}</h2>
                        <div className="space-y-4">
                            <input type="text" name="hospital_name" value={formData.hospital_name} onChange={e => setFormData({ ...formData, hospital_name: e.target.value })} placeholder={t('superadmin_dashboard.edit_hospital_form.hospital_name_placeholder')} className="w-full p-3 border rounded-lg" required />
                            <input type="text" name="location" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} placeholder={t('superadmin_dashboard.edit_hospital_form.location_placeholder')} className="w-full p-3 border rounded-lg" required />
                            <input type="text" name="username" value={formData.username} onChange={e => setFormData({ ...formData, username: e.target.value })} placeholder={t('superadmin_dashboard.edit_hospital_form.username_placeholder')} className="w-full p-3 border rounded-lg" required />
                            <input type="password" name="password" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} placeholder={t('superadmin_dashboard.edit_hospital_form.password_placeholder')} className="w-full p-3 border rounded-lg" required />
                        </div>
                        <div className="mt-6 flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4">
                            <button type="button" onClick={() => setEditingHospital(null)} className="bg-gray-500 text-white p-3 rounded-lg font-semibold hover:bg-gray-600 w-full sm:w-auto">{t('superadmin_dashboard.edit_hospital_form.cancel_button')}</button>
                            <button type="submit" className="bg-green-500 text-white p-3 rounded-lg font-semibold hover:bg-green-600 w-full sm:w-auto">{t('superadmin_dashboard.edit_hospital_form.update_button')}</button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};
export default SuperAdminDashboard;