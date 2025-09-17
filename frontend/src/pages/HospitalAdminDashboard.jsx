import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import AddCategoryForm from '../components/AddCategoryForm';
import ViewCategories from '../components/ViewCategories';
import AddDoctorForm from '../components/AddDoctorForm';
import ViewDoctors from '../components/ViewDoctors';
import EditDoctorForm from '../components/EditDoctorForm';

const HospitalAdminDashboard = () => {
    const { t, i18n } = useTranslation();
    const [activeTab, setActiveTab] = useState('view-aadhaar');
    const [aadhaarData, setAadhaarData] = useState([]);
    const [editingAadhaar, setEditingAadhaar] = useState(null);
    const [editingCategory, setEditingCategory] = useState(null);
    const [editingDoctor, setEditingDoctor] = useState(null);

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [showCategoryMenu, setShowCategoryMenu] = useState(false);
    const [showDoctorMenu, setShowDoctorMenu] = useState(false);

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
        const res = await fetch('https://medichain-6tv7.onrender.com/api/admin/all-aadhaar');
        if (res.ok) {
            const data = await res.json();
            setAadhaarData(data);
        } else {
            alert('Failed to fetch Aadhaar data.');
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
        
        const payload = {
            aadhaar_number: formData.aadhaar_number,
            name: { en: formData.name },
            gender: formData.gender,
            date_of_birth: formData.date_of_birth,
            phone_number: formData.phone_number,
            address: { en: formData.address }
        };

        const res = await fetch('https://medichain-6tv7.onrender.com/api/admin/add-aadhaar', {
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
        
        const payload = {
            aadhaar_number: formData.aadhaar_number,
            name: { en: formData.name },
            gender: formData.gender,
            date_of_birth: formData.date_of_birth,
            phone_number: formData.phone_number,
            address: { en: formData.address }
        };

        const res = await fetch(`https://medichain-6tv7.onrender.com/api/admin/update-aadhaar/${editingAadhaar._id}`, {
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
    };

    const handleDeleteAadhaar = async (id) => {
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
    
    const handleEditCategory = async (category) => {
        const newName = prompt('Enter new category name:', category.category_name);
        if (newName) {
            const res = await fetch(`https://medichain-6tv7.onrender.com/api/categories/update-category/${category._id}`, {
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
    
    const handleAddCategory = () => {
        setActiveTab('add-category');
        setIsSidebarOpen(false);
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

    return (
        <div className="relative flex min-h-screen bg-gray-100">
            <button
                onClick={toggleSidebar}
                className="md:hidden absolute top-4 left-4 z-50 p-2 bg-white rounded-md shadow-md text-gray-700"
            >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>
            
            <div className={`md:w-64 bg-white shadow-lg p-6 fixed md:relative inset-y-0 left-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-200 ease-in-out z-40`}>
                <h2 className="text-2xl font-bold mb-6">{t('hospital_admin_dashboard.title')}</h2>
                <nav>
                    <ul className="space-y-2">
                        <li>
                            <button
                                onClick={() => handleTabChange('add-aadhaar')}
                                className={`w-full text-left p-3 rounded-lg font-semibold ${activeTab === 'add-aadhaar' ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-200'}`}
                            >
                                {t('hospital_admin_dashboard.sidebar.add_data')}
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => handleTabChange('view-aadhaar')}
                                className={`w-full text-left p-3 rounded-lg font-semibold ${activeTab === 'view-aadhaar' ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-200'}`}
                            >
                                {t('hospital_admin_dashboard.sidebar.view_data')}
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => {setShowCategoryMenu(!showCategoryMenu); setShowDoctorMenu(false);}}
                                className={`w-full flex justify-between items-center p-3 rounded-lg font-semibold ${activeTab.includes('category') ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-200'}`}
                            >
                                Categories
                                <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transform transition-transform ${showCategoryMenu ? 'rotate-180' : 'rotate-0'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            {showCategoryMenu && (
                                <ul className="pl-4 mt-2 space-y-2">
                                    <li>
                                        <button
                                            onClick={() => handleTabChange('add-category')}
                                            className={`w-full text-left p-3 rounded-lg font-semibold ${activeTab === 'add-category' ? 'bg-blue-400 text-white' : 'text-gray-700 hover:bg-gray-200'}`}
                                        >
                                            Add New Category
                                        </button>
                                    </li>
                                    <li>
                                        <button
                                            onClick={() => handleTabChange('view-categories')}
                                            className={`w-full text-left p-3 rounded-lg font-semibold ${activeTab === 'view-categories' ? 'bg-blue-400 text-white' : 'text-gray-700 hover:bg-gray-200'}`}
                                        >
                                            View Categories
                                        </button>
                                    </li>
                                </ul>
                            )}
                        </li>
                        <li>
                            <button
                                onClick={() => {setShowDoctorMenu(!showDoctorMenu); setShowCategoryMenu(false);}}
                                className={`w-full flex justify-between items-center p-3 rounded-lg font-semibold ${activeTab.includes('doctor') ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-200'}`}
                            >
                                Doctors
                                <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transform transition-transform ${showDoctorMenu ? 'rotate-180' : 'rotate-0'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            {showDoctorMenu && (
                                <ul className="pl-4 mt-2 space-y-2">
                                    <li>
                                        <button
                                            onClick={() => handleTabChange('add-doctor')}
                                            className={`w-full text-left p-3 rounded-lg font-semibold ${activeTab === 'add-doctor' ? 'bg-blue-400 text-white' : 'text-gray-700 hover:bg-gray-200'}`}
                                        >
                                            Add New Doctor
                                        </button>
                                    </li>
                                    <li>
                                        <button
                                            onClick={() => handleTabChange('view-doctors')}
                                            className={`w-full text-left p-3 rounded-lg font-semibold ${activeTab === 'view-doctors' ? 'bg-blue-400 text-white' : 'text-gray-700 hover:bg-gray-200'}`}
                                        >
                                            View Doctors
                                        </button>
                                    </li>
                                </ul>
                            )}
                        </li>
                    </ul>
                </nav>
            </div>

            <div className="flex-1 p-4 md:p-8 overflow-y-auto">
                <h1 className="text-3xl font-bold mb-8">{t('hospital_admin_dashboard.title')}</h1>

                {(activeTab === 'add-aadhaar' || activeTab === 'view-aadhaar') && (
                    <>
                        {activeTab === 'add-aadhaar' && (
                            <div className="w-full max-w-lg bg-white p-6 sm:p-8 rounded-xl shadow-md mx-auto">
                                <h2 className="text-2xl font-bold mb-6 text-center">{editingAadhaar ? t('hospital_admin_dashboard.edit_aadhaar_form.title') : t('hospital_admin_dashboard.add_aadhaar_form.title')}</h2>
                                <form onSubmit={editingAadhaar ? handleUpdateAadhaar : handleSubmit} className="space-y-4">
                                    <input type="text" name="aadhaar_number" value={formData.aadhaar_number} onChange={handleChange} placeholder={t('hospital_admin_dashboard.add_aadhaar_form.aadhaar_number_placeholder')} className="w-full p-3 border rounded-lg" required />
                                    <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder={t('hospital_admin_dashboard.add_aadhaar_form.name_placeholder')} className="w-full p-3 border rounded-lg" required />
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 p-3 border rounded-lg">
                                        <span className="text-gray-700 font-medium">{t('hospital_admin_dashboard.add_aadhaar_form.gender_label')}</span>
                                        <label className="inline-flex items-center">
                                            <input
                                                type="radio"
                                                className="form-radio"
                                                name="gender"
                                                value="male"
                                                checked={formData.gender === 'male'}
                                                onChange={handleChange}
                                                required
                                            />
                                            <span className="ml-2">{t('gender_options.male')}</span>
                                        </label>
                                        <label className="inline-flex items-center">
                                            <input
                                                type="radio"
                                                className="form-radio"
                                                name="gender"
                                                value="female"
                                                checked={formData.gender === 'female'}
                                                onChange={handleChange}
                                            />
                                            <span className="ml-2">{t('gender_options.female')}</span>
                                        </label>
                                    </div>
                                    <input type="text" name="date_of_birth" value={formData.date_of_birth} onChange={handleChange} placeholder={t('hospital_admin_dashboard.add_aadhaar_form.date_of_birth_placeholder')} className="w-full p-3 border rounded-lg" required />
                                    <input type="text" name="phone_number" value={formData.phone_number} onChange={handleChange} placeholder={t('hospital_admin_dashboard.add_aadhaar_form.phone_number_placeholder')} className="w-full p-3 border rounded-lg" required />
                                    <textarea name="address" value={formData.address} onChange={handleChange} placeholder={t('hospital_admin_dashboard.add_aadhaar_form.address_placeholder')} className="w-full p-3 border rounded-lg" required></textarea>
                                    <button type="submit" className="w-full bg-green-500 text-white p-3 rounded-lg font-semibold hover:bg-green-600 transition-colors">{editingAadhaar ? t('hospital_admin_dashboard.edit_aadhaar_form.update_button') : t('hospital_admin_dashboard.add_aadhaar_form.button')}</button>
                                    {editingAadhaar && <button type="button" onClick={() => setEditingAadhaar(null)} className="w-full mt-2 bg-gray-500 text-white p-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors">{t('hospital_admin_dashboard.edit_aadhaar_form.cancel_button')}</button>}
                                </form>
                            </div>
                        )}
                        {activeTab === 'view-aadhaar' && (
                            <div className="w-full bg-white p-6 sm:p-8 rounded-xl shadow-md">
                                <h2 className="text-2xl font-bold mb-6 text-center">{t('hospital_admin_dashboard.view_aadhaar_list.title')}</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                                    {aadhaarData.map(aadhaar => (
                                        <div key={aadhaar._id} className="bg-white p-4 sm:p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                                            <p><strong>{t('hospital_admin_dashboard.view_aadhaar_list.aadhaar_no')}:</strong> {aadhaar.aadhaar_number}</p>
                                            <p><strong>{t('hospital_admin_dashboard.view_aadhaar_list.name')}:</strong> {aadhaar.name?.[i18n.language] || aadhaar.name?.en || 'N/A'}</p>
                                            <p><strong>{t('hospital_admin_dashboard.view_aadhaar_list.gender')}:</strong> {aadhaar.gender?.[i18n.language] || aadhaar.gender?.en || 'N/A'}</p>
                                            <p><strong>{t('hospital_admin_dashboard.view_aadhaar_list.dob')}:</strong> {aadhaar.date_of_birth}</p>
                                            <p><strong>{t('hospital_admin_dashboard.view_aadhaar_list.phone')}:</strong> {aadhaar.phone_number}</p>
                                            <p><strong>{t('hospital_admin_dashboard.view_aadhaar_list.address')}:</strong> {aadhaar.address?.[i18n.language] || aadhaar.address?.en || 'N/A'}</p>
                                            <div className="mt-4 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                                                <button onClick={() => handleEditAadhaar(aadhaar)} className="bg-yellow-500 text-white p-2 rounded-lg text-sm hover:bg-yellow-600 w-full sm:w-auto">{t('hospital_admin_dashboard.view_aadhaar_list.edit_button')}</button>
                                                <button onClick={() => handleDeleteAadhaar(aadhaar._id)} className="bg-red-500 text-white p-2 rounded-lg text-sm hover:bg-red-600 w-full sm:w-auto">{t('hospital_admin_dashboard.view_aadhaar_list.delete_button')}</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}

                {(activeTab === 'add-category' || activeTab === 'view-categories') && (
                    <div className="flex flex-col items-center">
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
                    <div className="flex flex-col items-center">
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
            </div>
        </div>
    );
};

export default HospitalAdminDashboard;