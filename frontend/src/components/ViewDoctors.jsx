// medichain/frontend/src/components/ViewDoctors.jsx
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const ViewDoctors = ({ onEdit, onAdd }) => {
    const { t } = useTranslation();
    const [doctors, setDoctors] = useState([]);

    const fetchDoctors = async () => {
        const res = await fetch('http://localhost:5000/api/doctor-admin/all-doctors');
        if (res.ok) {
            const data = await res.json();
            setDoctors(data);
        } else {
            alert('Failed to fetch doctors.');
        }
    };

    useEffect(() => {
        fetchDoctors();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this doctor?')) {
            const res = await fetch(`http://localhost:5000/api/doctor-admin/delete-doctor/${id}`, {
                method: 'DELETE'
            });
            if (res.ok) {
                alert('Doctor deleted successfully!');
                fetchDoctors();
            } else {
                alert('Failed to delete doctor.');
            }
        }
    };

    return (
        <div className="w-full bg-white p-6 md:p-8 rounded-xl shadow-md">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
                <h2 className="text-2xl font-bold mb-4 sm:mb-0">Existing Doctors</h2>
                <button onClick={onAdd} className="bg-blue-500 text-white p-2 rounded-lg font-semibold hover:bg-blue-600 transition-colors w-full sm:w-auto">
                    Add New Doctor
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {doctors.map(doctor => (
                    <div key={doctor._id} className="bg-white p-4 sm:p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                        <p className="font-semibold">ID: {doctor.doctorId}</p>
                        <p className="font-semibold">Name: {doctor.doctor_name}</p>
                        <p>Category: {doctor.category?.category_name || 'N/A'}</p>
                        {doctor.wardNumber && <p>Ward Number: {doctor.wardNumber}</p>}
                        {doctor.roomNumber && <p>Room Number: {doctor.roomNumber}</p>}
                        <div className="mt-4 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                            <button onClick={() => onEdit(doctor)} className="bg-yellow-500 text-white p-2 rounded-lg text-sm hover:bg-yellow-600 w-full sm:w-auto">Edit</button>
                            <button onClick={() => handleDelete(doctor._id)} className="bg-red-500 text-white p-2 rounded-lg text-sm hover:bg-red-600 w-full sm:w-auto">Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ViewDoctors;