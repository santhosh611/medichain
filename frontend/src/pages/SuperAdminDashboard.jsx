import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const SuperAdminDashboard = ({ handleLogout }) => {
    const { t } = useTranslation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const location = useLocation();

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const menuItems = [
        {
            path: 'add-hospital',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
            ),
            label: t('superadmin_dashboard.sidebar.add_hospital')
        },
        {
            path: 'view-hospitals',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
            ),
            label: t('superadmin_dashboard.sidebar.view_hospitals')
        }
    ];

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Mobile overlay */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={`fixed lg:relative inset-y-0 left-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out z-50 lg:z-auto`}>
                <div className="flex flex-col w-64 h-full bg-white border-r border-gray-200">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-200">
                        <div className="flex items-center">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                                </svg>
                            </div>
                            <div className="ml-3">
                                <h2 className="text-lg font-semibold text-gray-900">MediCare</h2>
                                <p className="text-sm text-gray-500">Super Admin</p>
                            </div>
                        </div>
                        <button 
                            className="lg:hidden p-1 rounded-md text-gray-400 hover:text-gray-600"
                            onClick={() => setIsSidebarOpen(false)}
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-6 space-y-2">
                        {menuItems.map((item) => {
                            const isActive = location.pathname.includes(item.path);
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setIsSidebarOpen(false)}
                                    className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                                        isActive
                                            ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                    }`}
                                >
                                    <span className={`mr-3 ${isActive ? 'text-blue-700' : 'text-gray-400'}`}>
                                        {item.icon}
                                    </span>
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Footer */}
                    <div className="p-4 border-t border-gray-200">
                        <button 
                            onClick={handleLogout}
                            className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                        >
                            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            {t('superadmin_dashboard.sidebar.logout')}
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top bar */}
                <header className="bg-white border-b border-gray-200 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <button
                                onClick={toggleSidebar}
                                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                            >
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                            <h1 className="ml-2 text-2xl font-bold text-gray-900">
                                {t('superadmin_dashboard.title')}
                            </h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="hidden sm:flex items-center text-sm text-gray-500">
                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                                </svg>
                                {new Date().toLocaleDateString()}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
                    <Routes>
                        <Route path="add-hospital" element={<AddHospitalForm />} />
                        <Route path="view-hospitals" element={<ViewHospitals />} />
                        <Route path="/" element={<DashboardHome />} />
                    </Routes>
                </main>
            </div>
        </div>
    );
};

// Dashboard Home Component
const DashboardHome = () => {
    const { t } = useTranslation();
    const [stats, setStats] = useState({
        totalHospitals: 0,
        activeHospitals: 0,
        totalPatients: 0
    });

    useEffect(() => {
        // Fetch dashboard stats
        const fetchStats = async () => {
            try {
                const res = await fetch('https://medichain-6tv7.onrender.com/api/superadmin/all-hospitals');
                if (res.ok) {
                    const hospitals = await res.json();
                    setStats(prev => ({
                        ...prev,
                        totalHospitals: hospitals.length,
                        activeHospitals: hospitals.length // Assuming all are active for now
                    }));
                }
            } catch (error) {
                console.error('Error fetching stats:', error);
            }
        };
        fetchStats();
    }, []);

    const statCards = [
        {
            title: 'Total Hospitals',
            value: stats.totalHospitals,
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
            ),
            color: 'bg-blue-500',
            bgColor: 'bg-blue-50'
        },
        {
            title: 'Active Hospitals',
            value: stats.activeHospitals,
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            color: 'bg-green-500',
            bgColor: 'bg-green-50'
        },
        {
            title: 'System Status',
            value: 'Online',
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
            ),
            color: 'bg-purple-500',
            bgColor: 'bg-purple-50'
        }
    ];

    return (
        <div className="space-y-6">
            {/* Welcome section */}
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Welcome to Super Admin Dashboard</h2>
                <p className="text-gray-600">Manage hospitals and monitor system performance from this central hub.</p>
            </div>

            {/* Stats cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {statCards.map((card, index) => (
                    <div key={index} className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className={`p-3 rounded-lg ${card.bgColor}`}>
                                <div className={`text-white ${card.color.replace('bg-', 'text-')}`}>
                                    {card.icon}
                                </div>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">{card.title}</p>
                                <p className="text-2xl font-semibold text-gray-900">{card.value}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick actions */}
            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Link
                        to="add-hospital"
                        className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        <div className="flex-shrink-0">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                            </div>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-900">Add New Hospital</p>
                            <p className="text-sm text-gray-500">Register a new hospital in the system</p>
                        </div>
                    </Link>
                    <Link
                        to="view-hospitals"
                        className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        <div className="flex-shrink-0">
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </div>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-900">View Hospitals</p>
                            <p className="text-sm text-gray-500">Manage existing hospital records</p>
                        </div>
                    </Link>
                </div>
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
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const payload = {
            hospital_name: { en: formData.hospital_name },
            location: { en: formData.location },
            username: formData.username,
            password: formData.password
        };

        try {
            const res = await fetch('https://medichain-6tv7.onrender.com/api/superadmin/add-hospital', {
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
        } catch (error) {
            alert('Error adding hospital.');
        }
        setIsLoading(false);
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center mb-6">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">{t('superadmin_dashboard.add_hospital_form.title')}</h2>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Hospital Name (English)
                            </label>
                            <input 
                                type="text" 
                                name="hospital_name" 
                                value={formData.hospital_name} 
                                onChange={handleChange} 
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                                placeholder="Enter hospital name"
                                required 
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Location (English)
                            </label>
                            <input 
                                type="text" 
                                name="location" 
                                value={formData.location} 
                                onChange={handleChange} 
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                                placeholder="Enter location"
                                required 
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Username
                            </label>
                            <input 
                                type="text" 
                                name="username" 
                                value={formData.username} 
                                onChange={handleChange} 
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                                placeholder="Enter username"
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
                                value={formData.password} 
                                onChange={handleChange} 
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                                placeholder="Enter password"
                                required 
                            />
                        </div>
                    </div>
                    
                    <div className="flex justify-end">
                        <button 
                            type="submit" 
                            disabled={isLoading}
                            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                        >
                            {isLoading ? (
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : null}
                            {isLoading ? 'Adding Hospital...' : t('superadmin_dashboard.add_hospital_form.button')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const ViewHospitals = () => {
    const { t, i18n } = useTranslation();
    const [hospitals, setHospitals] = useState([]);
    const [editingHospital, setEditingHospital] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        hospital_name: '',
        location: '',
        username: '',
        password: ''
    });

    const fetchHospitals = async () => {
        setIsLoading(true);
        setError(null);
        try {
            console.log('Fetching hospitals...'); // Debug log
            
            // Use environment variable if available, fallback to hardcoded URL
            const apiUrl = import.meta.env.VITE_BACKEND_URL || 'https://medichain-6tv7.onrender.com';
            const url = `${apiUrl}/api/superadmin/all-hospitals`;
            
            console.log('API URL:', url); // Debug log
            
            const res = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    // Add any authentication headers if needed
                    // 'Authorization': `Bearer ${token}`,
                },
            });
            
            console.log('Response status:', res.status); // Debug log
            console.log('Response ok:', res.ok); // Debug log
            
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            
            const data = await res.json();
            console.log('Fetched data:', data); // Debug log
            
            setHospitals(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching hospitals:', error);
            setError(error.message);
            setHospitals([]); // Set empty array on error
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchHospitals();
    }, []);

    const handleEdit = (hospital) => {
        setEditingHospital(hospital);
        setFormData({
            hospital_name: hospital.hospital_name?.en || '',
            location: hospital.location?.en || '',
            username: hospital.username || '',
            password: ''
        });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        const payload = {
            hospital_name: { en: formData.hospital_name },
            location: { en: formData.location },
            username: formData.username,
            password: formData.password
        };

        try {
            const apiUrl = import.meta.env.VITE_BACKEND_URL || 'https://medichain-6tv7.onrender.com';
            const res = await fetch(`${apiUrl}/api/superadmin/edit-hospital/${editingHospital._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            
            if (res.ok) {
                alert('Hospital updated successfully!');
                setEditingHospital(null);
                await fetchHospitals(); // Refetch data
            } else {
                const errorData = await res.text();
                console.error('Update error:', errorData);
                alert('Failed to update hospital.');
            }
        } catch (error) {
            console.error('Update error:', error);
            alert('Error updating hospital.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this hospital?')) {
            return;
        }
        
        setIsLoading(true);
        try {
            const apiUrl = import.meta.env.VITE_BACKEND_URL || 'https://medichain-6tv7.onrender.com';
            const res = await fetch(`${apiUrl}/api/superadmin/delete-hospital/${id}`, {
                method: 'DELETE'
            });
            
            if (res.ok) {
                alert('Hospital deleted successfully!');
                await fetchHospitals(); // Refetch data
            } else {
                const errorData = await res.text();
                console.error('Delete error:', errorData);
                alert('Failed to delete hospital.');
            }
        } catch (error) {
            console.error('Delete error:', error);
            alert('Error deleting hospital.');
        } finally {
            setIsLoading(false);
        }
    };

    // Loading state
    if (isLoading && hospitals.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-64 space-y-4">
                <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="text-gray-600">Loading hospitals...</p>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-center h-64 flex-col space-y-4">
                    <svg className="h-12 w-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="text-center">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Hospitals</h3>
                        <p className="text-gray-600 mb-4">{error}</p>
                        <button 
                            onClick={fetchHospitals}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">{t('superadmin_dashboard.view_hospitals_list.title')}</h2>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="text-sm text-gray-500">
                        {hospitals.length} hospital{hospitals.length !== 1 ? 's' : ''} registered
                    </div>
                    <button 
                        onClick={fetchHospitals}
                        disabled={isLoading}
                        className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center"
                    >
                        <svg className={`w-4 h-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Refresh
                    </button>
                </div>
            </div>

            {hospitals.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg shadow">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No hospitals found</h3>
                    <p className="mt-1 text-sm text-gray-500">Get started by adding a new hospital to the system.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {hospitals.map(hospital => (
                        <div key={hospital._id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                </div>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    Active
                                </span>
                            </div>
                            
                            <div className="space-y-3">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Hospital Name</p>
                                    <p className="text-lg font-semibold text-gray-900">
                                        {hospital.hospital_name?.[i18n.language] || hospital.hospital_name?.en || 'N/A'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Location</p>
                                    <p className="text-gray-700">
                                        {hospital.location?.[i18n.language] || hospital.location?.en || 'N/A'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Username</p>
                                    <p className="text-gray-700">{hospital.username}</p>
                                </div>
                            </div>
                            
                            <div className="flex space-x-2 mt-6">
                                <button 
                                    onClick={() => handleEdit(hospital)} 
                                    disabled={isLoading}
                                    className="flex-1 bg-yellow-50 text-yellow-700 hover:bg-yellow-100 disabled:opacity-50 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
                                >
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                    Edit
                                </button>
                                <button 
                                    onClick={() => handleDelete(hospital._id)} 
                                    disabled={isLoading}
                                    className="flex-1 bg-red-50 text-red-700 hover:bg-red-100 disabled:opacity-50 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
                                >
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Edit Modal - Same as before */}
            {editingHospital && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-screen overflow-y-auto">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-medium text-gray-900">
                                    {t('superadmin_dashboard.edit_hospital_form.title')}
                                </h3>
                                <button
                                    onClick={() => setEditingHospital(null)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        
                        <form onSubmit={handleUpdate} className="px-6 py-4">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Hospital Name
                                    </label>
                                    <input 
                                        type="text" 
                                        name="hospital_name" 
                                        value={formData.hospital_name} 
                                        onChange={e => setFormData({ ...formData, hospital_name: e.target.value })} 
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                                        required 
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Location
                                    </label>
                                    <input 
                                        type="text" 
                                        name="location" 
                                        value={formData.location} 
                                        onChange={e => setFormData({ ...formData, location: e.target.value })} 
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                                        required 
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Username
                                    </label>
                                    <input 
                                        type="text" 
                                        name="username" 
                                        value={formData.username} 
                                        onChange={e => setFormData({ ...formData, username: e.target.value })} 
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                                        required 
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        New Password
                                    </label>
                                    <input 
                                        type="password" 
                                        name="password" 
                                        value={formData.password} 
                                        onChange={e => setFormData({ ...formData, password: e.target.value })} 
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                                        placeholder="Enter new password"
                                        required 
                                    />
                                </div>
                            </div>
                            
                            <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
                                <button 
                                    type="button" 
                                    onClick={() => setEditingHospital(null)} 
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-blue-500"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={isLoading}
                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 disabled:opacity-50 flex items-center"
                                >
                                    {isLoading ? (
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    ) : null}
                                    {isLoading ? 'Updating...' : 'Update'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SuperAdminDashboard;
                                