import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import AddCategoryForm from '../components/AddCategoryForm';
import ViewCategories from '../components/ViewCategories';
import AddDoctorForm from '../components/AddDoctorForm';
import ViewDoctors from '../components/ViewDoctors';
import EditDoctorForm from '../components/EditDoctorForm';

const HospitalAdminDashboard = ({ handleLogout }) => {
    const { t, i18n } = useTranslation();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [aadhaarData, setAadhaarData] = useState([]);
    const [editingAadhaar, setEditingAadhaar] = useState(null);
    const [editingCategory, setEditingCategory] = useState(null);
    const [editingDoctor, setEditingDoctor] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const [formData, setFormData] = useState({
        aadhaar_number: '',
        name: '',
        gender: '',
        date_of_birth: '',
        phone_number: '',
        address: ''
    });

    const [doctorFormData, setDoctorFormData] = useState({
        doctor_name: '',
        category: ''
    });

    const fetchAllAadhaarDetails = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'https://medichain-6tv7.onrender.com'}/api/admin/all-aadhaar`);
            if (res.ok) {
                const data = await res.json();
                setAadhaarData(data);
            } else {
                setError('Failed to fetch Aadhaar data.');
            }
        } catch (err) {
            setError('Server error fetching data.');
            console.error('Error fetching Aadhaar data:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (activeTab === 'view-aadhaar') {
            fetchAllAadhaarDetails();
        }
    }, [activeTab]);

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        if (type === 'radio') {
            setFormData({ ...formData, [name]: value });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleDoctorFormChange = (e) => {
        setDoctorFormData({ ...doctorFormData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        const payload = {
            aadhaar_number: formData.aadhaar_number,
            name: { en: formData.name },
            gender: formData.gender,
            date_of_birth: formData.date_of_birth,
            phone_number: formData.phone_number,
            address: { en: formData.address }
        };

        try {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'https://medichain-6tv7.onrender.com'}/api/admin/add-aadhaar`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
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
        } catch (error) {
            alert('Error adding Aadhaar data.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleEditAadhaar = (aadhaar) => {
        setEditingAadhaar(aadhaar);
        setFormData({
            aadhaar_number: aadhaar.aadhaar_number,
            name: aadhaar.name.en || '',
            gender: aadhaar.gender,
            date_of_birth: aadhaar.date_of_birth,
            phone_number: aadhaar.phone_number,
            address: aadhaar.address.en || ''
        });
        setActiveTab('add-aadhaar');
        setIsSidebarOpen(false);
    };

    const handleUpdateAadhaar = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        const payload = {
            aadhaar_number: formData.aadhaar_number,
            name: { en: formData.name },
            gender: formData.gender,
            date_of_birth: formData.date_of_birth,
            phone_number: formData.phone_number,
            address: { en: formData.address }
        };

        try {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'https://medichain-6tv7.onrender.com'}/api/admin/update-aadhaar/${editingAadhaar._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
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
                setActiveTab('view-aadhaar');
            } else {
                alert('Failed to update Aadhaar data.');
            }
        } catch (error) {
            alert('Error updating Aadhaar data.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteAadhaar = async (id) => {
        if (window.confirm('Are you sure you want to delete this record?')) {
            setIsLoading(true);
            try {
                const res = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'https://medichain-6tv7.onrender.com'}/api/admin/delete-aadhaar/${id}`, {
                    method: 'DELETE'
                });
                if (res.ok) {
                    alert('Aadhaar data deleted successfully!');
                    fetchAllAadhaarDetails();
                } else {
                    alert('Failed to delete Aadhaar data.');
                }
            } catch (error) {
                alert('Error deleting Aadhaar data.');
            } finally {
                setIsLoading(false);
            }
        }
    };
    
    const handleEditCategory = async (category) => {
        const newName = prompt('Enter new category name:', category.category_name);
        if (newName) {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'https://medichain-6tv7.onrender.com'}/api/categories/update-category/${category._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ category_name: newName })
            });
            if (res.ok) {
                alert('Category updated successfully!');
                setActiveTab('view-categories');
            } else {
                alert('Failed to update category.');
            }
        }
    };

    const handleEditDoctor = (doctor) => {
        setEditingDoctor(doctor);
        setActiveTab('edit-doctor');
        setIsSidebarOpen(false);
    };

    const handleDoctorUpdate = () => {
        setEditingDoctor(null);
        setActiveTab('view-doctors');
        setIsSidebarOpen(false);
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setIsSidebarOpen(false);
    };

    const menuItems = [
        {
            id: 'dashboard',
            label: 'Dashboard Overview',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v10a2 2 0 01-2 2H10a2 2 0 01-2-2V5z" />
                </svg>
            )
        },
        {
            id: 'aadhaar',
            label: 'Patient Records',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
            ),
            subItems: [
                { id: 'add-aadhaar', label: 'Add New Patient' },
                { id: 'view-aadhaar', label: 'View Patients' }
            ]
        },
        {
            id: 'categories',
            label: 'Medical Categories',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
            ),
            subItems: [
                { id: 'add-category', label: 'Add Category' },
                { id: 'view-categories', label: 'View Categories' }
            ]
        },
        {
            id: 'doctors',
            label: 'Doctor Management',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
            ),
            subItems: [
                { id: 'add-doctor', label: 'Add Doctor' },
                { id: 'view-doctors', label: 'View Doctors' }
            ]
        }
    ];

    const [expandedMenus, setExpandedMenus] = useState({});

    const toggleMenu = (menuId) => {
        setExpandedMenus(prev => ({
            ...prev,
            [menuId]: !prev[menuId]
        }));
    };

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
                                <p className="text-sm text-gray-500">Hospital Admin</p>
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
                    <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                        {menuItems.map((item) => (
                            <div key={item.id}>
                                {item.subItems ? (
                                    <>
                                        <button
                                            onClick={() => toggleMenu(item.id)}
                                            className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                                        >
                                            <div className="flex items-center">
                                                <span className="mr-3">{item.icon}</span>
                                                {item.label}
                                            </div>
                                            <svg 
                                                className={`w-4 h-4 transition-transform ${expandedMenus[item.id] ? 'rotate-180' : ''}`} 
                                                fill="none" 
                                                stroke="currentColor" 
                                                viewBox="0 0 24 24"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>
                                        {expandedMenus[item.id] && (
                                            <div className="ml-4 mt-2 space-y-1">
                                                {item.subItems.map((subItem) => (
                                                    <button
                                                        key={subItem.id}
                                                        onClick={() => handleTabChange(subItem.id)}
                                                        className={`w-full text-left px-4 py-2 text-sm rounded-lg transition-colors ${
                                                            activeTab === subItem.id
                                                                ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                                                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                                        }`}
                                                    >
                                                        {subItem.label}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <button
                                        onClick={() => handleTabChange(item.id)}
                                        className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                                            activeTab === item.id
                                                ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                        }`}
                                    >
                                        <span className="mr-3">{item.icon}</span>
                                        {item.label}
                                    </button>
                                )}
                            </div>
                        ))}
                    </nav>

                    {/* Footer */}
                    <div className="p-4 border-t border-gray-200">
                        {handleLogout && (
                            <button 
                                onClick={handleLogout}
                                className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                            >
                                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                Logout
                            </button>
                        )}
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
                                {t('hospital_admin_dashboard.title')}
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
                    {activeTab === 'dashboard' && <DashboardOverview aadhaarData={aadhaarData} />}
                    
                    {(activeTab === 'add-aadhaar' || activeTab === 'view-aadhaar') && (
                        <>
                            {activeTab === 'add-aadhaar' && (
                                <AadhaarForm 
                                    formData={formData}
                                    editingAadhaar={editingAadhaar}
                                    isLoading={isLoading}
                                    handleChange={handleChange}
                                    handleSubmit={editingAadhaar ? handleUpdateAadhaar : handleSubmit}
                                    onCancel={() => {
                                        setEditingAadhaar(null);
                                        setFormData({
                                            aadhaar_number: '',
                                            name: '',
                                            gender: '',
                                            date_of_birth: '',
                                            phone_number: '',
                                            address: ''
                                        });
                                        setActiveTab('view-aadhaar');
                                    }}
                                    t={t}
                                />
                            )}
                            {activeTab === 'view-aadhaar' && (
                                <ViewAadhaarRecords 
                                    aadhaarData={aadhaarData}
                                    isLoading={isLoading}
                                    error={error}
                                    onEdit={handleEditAadhaar}
                                    onDelete={handleDeleteAadhaar}
                                    onRefresh={fetchAllAadhaarDetails}
                                    t={t}
                                    i18n={i18n}
                                />
                            )}
                        </>
                    )}

                    {(activeTab === 'add-category' || activeTab === 'view-categories') && (
                        <div className="max-w-4xl mx-auto">
                            {activeTab === 'add-category' && (
                                <AddCategoryForm
                                    refreshCategories={() => handleTabChange('view-categories')}
                                    onCancel={() => handleTabChange('view-categories')}
                                />
                            )}
                            {activeTab === 'view-categories' && (
                                <ViewCategories onEdit={handleEditCategory} onAdd={() => handleTabChange('add-category')} />
                            )}
                        </div>
                    )}
                    
                    {(activeTab === 'add-doctor' || activeTab === 'view-doctors' || activeTab === 'edit-doctor') && (
                        <div className="max-w-4xl mx-auto">
                            {activeTab === 'add-doctor' && (
                                <AddDoctorForm
                                    onDoctorAdded={() => handleTabChange('view-doctors')}
                                    onCancel={() => handleTabChange('view-doctors')}
                                />
                            )}
                            {activeTab === 'view-doctors' && (
                                <ViewDoctors onEdit={handleEditDoctor} onAdd={() => handleTabChange('add-doctor')} />
                            )}
                            {activeTab === 'edit-doctor' && editingDoctor && (
                                <EditDoctorForm
                                    doctor={editingDoctor}
                                    onUpdate={handleDoctorUpdate}
                                    onCancel={() => handleTabChange('view-doctors')}
                                />
                            )}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

// Dashboard Overview Component
const DashboardOverview = ({ aadhaarData }) => {
    const stats = [
        {
            title: 'Total Patients',
            value: aadhaarData?.length || 0,
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
            ),
            color: 'bg-blue-500',
            bgColor: 'bg-blue-50'
        },
        {
            title: 'Active Records',
            value: aadhaarData?.length || 0,
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
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
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Welcome to Hospital Admin Dashboard</h2>
                <p className="text-gray-600">Manage patient records, medical categories, and doctor information from this central hub.</p>
            </div>

            {/* Stats cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((card, index) => (
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                        <div className="flex-shrink-0">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                            </div>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-900">Add New Patient</p>
                            <p className="text-sm text-gray-500">Register patient Aadhaar details</p>
                        </div>
                    </div>
                    <div className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                        <div className="flex-shrink-0">
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-900">Manage Doctors</p>
                            <p className="text-sm text-gray-500">Add or edit doctor information</p>
                        </div>
                    </div>
                    <div className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                        <div className="flex-shrink-0">
                            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                            </div>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-900">Medical Categories</p>
                            <p className="text-sm text-gray-500">Organize medical specializations</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Aadhaar Form Component
const AadhaarForm = ({ formData, editingAadhaar, isLoading, handleChange, handleSubmit, onCancel, t }) => (
    <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                    {editingAadhaar ? 'Edit Patient Record' : 'Add New Patient'}
                </h2>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Aadhaar Number
                        </label>
                        <input 
                            type="text" 
                            name="aadhaar_number" 
                            value={formData.aadhaar_number} 
                            onChange={handleChange} 
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                            placeholder="Enter 12-digit Aadhaar number"
                            maxLength="12"
                            required 
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Full Name
                        </label>
                        <input 
                            type="text" 
                            name="name" 
                            value={formData.name} 
                            onChange={handleChange} 
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                            placeholder="Enter full name"
                            required 
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Gender
                        </label>
                        <div className="flex space-x-6 p-3 border border-gray-300 rounded-lg">
                            <label className="inline-flex items-center">
                                <input
                                    type="radio"
                                    className="form-radio text-blue-600"
                                    name="gender"
                                    value="male"
                                    checked={formData.gender === 'male'}
                                    onChange={handleChange}
                                    required
                                />
                                <span className="ml-2 text-gray-700">Male</span>
                            </label>
                            <label className="inline-flex items-center">
                                <input
                                    type="radio"
                                    className="form-radio text-blue-600"
                                    name="gender"
                                    value="female"
                                    checked={formData.gender === 'female'}
                                    onChange={handleChange}
                                />
                                <span className="ml-2 text-gray-700">Female</span>
                            </label>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Date of Birth
                        </label>
                        <input 
                            type="date" 
                            name="date_of_birth" 
                            value={formData.date_of_birth} 
                            onChange={handleChange} 
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                            required 
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Phone Number
                        </label>
                        <input 
                            type="tel" 
                            name="phone_number" 
                            value={formData.phone_number} 
                            onChange={handleChange} 
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                            placeholder="Enter phone number"
                            required 
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Address
                        </label>
                        <textarea 
                            name="address" 
                            value={formData.address} 
                            onChange={handleChange} 
                            rows="3"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                            placeholder="Enter complete address"
                            required
                        />
                    </div>
                </div>
                
                <div className="flex justify-end space-x-4">
                    {editingAadhaar && (
                        <button 
                            type="button" 
                            onClick={onCancel}
                            className="px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            Cancel
                        </button>
                    )}
                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                        {isLoading ? (
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : null}
                        {isLoading ? (editingAadhaar ? 'Updating...' : 'Adding...') : (editingAadhaar ? 'Update Patient' : 'Add Patient')}
                    </button>
                </div>
            </form>
        </div>
    </div>
);

// View Aadhaar Records Component
const ViewAadhaarRecords = ({ aadhaarData, isLoading, error, onEdit, onDelete, onRefresh, t, i18n }) => {
    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-center h-64 flex-col space-y-4">
                    <svg className="h-12 w-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="text-center">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Records</h3>
                        <p className="text-gray-600 mb-4">{error}</p>
                        <button 
                            onClick={onRefresh}
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
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Patient Records</h2>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="text-sm text-gray-500">
                        {aadhaarData.length} patient{aadhaarData.length !== 1 ? 's' : ''} registered
                    </div>
                    <button 
                        onClick={onRefresh}
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

            {aadhaarData.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg shadow">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No patient records found</h3>
                    <p className="mt-1 text-sm text-gray-500">Get started by adding a new patient record.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {aadhaarData.map(aadhaar => (
                        <div key={aadhaar._id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    Active
                                </span>
                            </div>
                            
                            <div className="space-y-3">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Aadhaar Number</p>
                                    <p className="text-lg font-semibold text-gray-900">{aadhaar.aadhaar_number}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Name</p>
                                    <p className="text-gray-900">{aadhaar.name?.[i18n.language] || aadhaar.name?.en || 'N/A'}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Gender</p>
                                        <p className="text-gray-900 capitalize">{aadhaar.gender || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">DOB</p>
                                        <p className="text-gray-900">{aadhaar.date_of_birth}</p>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Phone</p>
                                    <p className="text-gray-900">{aadhaar.phone_number}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Address</p>
                                    <p className="text-gray-900 text-sm truncate">{aadhaar.address?.[i18n.language] || aadhaar.address?.en || 'N/A'}</p>
                                </div>
                            </div>
                            
                            <div className="flex space-x-2 mt-6">
                                <button 
                                    onClick={() => onEdit(aadhaar)} 
                                    className="flex-1 bg-yellow-50 text-yellow-700 hover:bg-yellow-100 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
                                >
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                    Edit
                                </button>
                                <button 
                                    onClick={() => onDelete(aadhaar._id)} 
                                    className="flex-1 bg-red-50 text-red-700 hover:bg-red-100 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
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
        </div>
    );
};

export default HospitalAdminDashboard;