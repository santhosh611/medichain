import React, { useState, useEffect } from 'react';

const EditDoctorForm = ({ doctor, onUpdate, onCancel }) => {
    const [doctorName, setDoctorName] = useState(doctor.doctor_name);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(doctor.category?._id || '');
    const [assignmentType, setAssignmentType] = useState(doctor.wardNumber ? 'ward' : doctor.roomNumber ? 'room' : null);
    const [assignmentValue, setAssignmentValue] = useState(doctor.wardNumber || doctor.roomNumber || '');
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        const fetchCategories = async () => {
            const res = await fetch('http://localhost:5000/api/categories/all-categories');
            if (res.ok) {
                const data = await res.json();
                setCategories(data);
                if (!selectedCategory && data.length > 0) {
                    setSelectedCategory(data[0]._id);
                }
            }
        };
        fetchCategories();
    }, [selectedCategory]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsUpdating(true);

        const payload = {
            doctor_name: doctorName,
            category: selectedCategory,
        };

        if (assignmentType === 'ward') {
            payload.wardNumber = assignmentValue;
        } else if (assignmentType === 'room') {
            payload.roomNumber = assignmentValue;
        }

        const res = await fetch(`http://localhost:5000/api/doctor-admin/update-doctor/${doctor._id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            alert('Doctor updated successfully!');
            onUpdate();
        } else {
            alert('Failed to update doctor.');
        }
        setIsUpdating(false);
    };

    return (
        <div className="w-full max-w-lg bg-white p-6 sm:p-8 rounded-xl shadow-md mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-center">Edit Doctor</h2>
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
                    {categories.map((cat) => (
                        <option key={cat._id} value={cat._id}>{cat.category_name}</option>
                    ))}
                </select>

                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                    <button
                        type="button"
                        onClick={() => setAssignmentType('ward')}
                        className={`w-full p-3 rounded-lg font-semibold transition-colors ${assignmentType === 'ward' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                    >
                        Assign Ward Number
                    </button>
                    <button
                        type="button"
                        onClick={() => setAssignmentType('room')}
                        className={`w-full p-3 rounded-lg font-semibold transition-colors ${assignmentType === 'room' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
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

                <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4 mt-6">
                    <button type="button" onClick={onCancel} className="bg-gray-500 text-white p-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors">
                        Cancel
                    </button>
                    <button type="submit" className="w-full bg-green-500 text-white p-3 rounded-lg font-semibold hover:bg-green-600 transition-colors" disabled={isUpdating}>
                        {isUpdating ? 'Updating...' : 'Update Doctor'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditDoctorForm;