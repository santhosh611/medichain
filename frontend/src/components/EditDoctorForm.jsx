// medichain/frontend/src/components/AddDoctorForm.jsx
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const AddDoctorForm = ({ onDoctorAdded, onCancel }) => {
    const { t } = useTranslation();
    const [doctorName, setDoctorName] = useState('');
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // New state for room/ward assignment
    const [assignmentType, setAssignmentType] = useState(null); // 'ward' or 'room'
    const [assignmentValue, setAssignmentValue] = useState('');

    useEffect(() => {
        const fetchCategories = async () => {
            const res = await fetch('https://medichain-6tv7.onrender.com/api/categories/all-categories');
            if (res.ok) {
                const data = await res.json();
                setCategories(data);
                if (data.length > 0) {
                    setSelectedCategory(data[0]._id);
                }
            }
        };
        fetchCategories();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const payload = {
            doctor_name: doctorName,
            category: selectedCategory,
        };
        
        if (assignmentType === 'ward') {
            payload.wardNumber = assignmentValue;
        } else if (assignmentType === 'room') {
            payload.roomNumber = assignmentValue;
        }

        const res = await fetch('https://medichain-6tv7.onrender.com/api/doctor-admin/add-doctor', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            alert('Doctor added successfully!');
            setDoctorName('');
            setAssignmentType(null);
            setAssignmentValue('');
            onDoctorAdded();
        } else {
            alert('Failed to add doctor.');
        }
        setIsSubmitting(false);
    };

    return (
        <div className="w-full max-w-lg bg-white p-8 rounded-xl shadow-md mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-center">Add New Doctor</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    name="doctor_name"
                    value={doctorName}
                    onChange={(e) => setDoctorName(e.target.value)}
                    placeholder="Doctor Name"
                    className="w-full p-3 border rounded-lg"
                    required
                />
                <select
                    name="category"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full p-3 border rounded-lg"
                    required
                >
                    <option value="" disabled>Select a Category</option>
                    {categories.map((category) => (
                        <option key={category._id} value={category._id}>{category.category_name}</option>
                    ))}
                </select>
                
                {/* New toggle for Ward/Room Number */}
                <div className="flex space-x-4">
                    <button
                        type="button"
                        onClick={() => setAssignmentType('ward')}
                        className={`w-1/2 p-3 rounded-lg font-semibold transition-colors ${assignmentType === 'ward' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                    >
                        Assign Ward Number
                    </button>
                    <button
                        type="button"
                        onClick={() => setAssignmentType('room')}
                        className={`w-1/2 p-3 rounded-lg font-semibold transition-colors ${assignmentType === 'room' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                    >
                        Assign Room Number
                    </button>
                </div>

                {assignmentType && (
                    <input
                        type="text"
                        name="assignment_value"
                        value={assignmentValue}
                        onChange={(e) => setAssignmentValue(e.target.value)}
                        placeholder={`Enter ${assignmentType} number`}
                        className="w-full p-3 border rounded-lg mt-4"
                        required
                    />
                )}

                <div className="flex justify-end space-x-4 mt-6">
                    <button type="button" onClick={onCancel} className="bg-gray-500 text-white p-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors">
                        Cancel
                    </button>
                    <button type="submit" className="bg-green-500 text-white p-3 rounded-lg font-semibold hover:bg-green-600 transition-colors" disabled={isSubmitting}>
                        {isSubmitting ? 'Adding...' : 'Add Doctor'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddDoctorForm;