// medichain/frontend/src/components/ViewCategories.jsx
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const ViewCategories = ({ onEdit }) => {
    const { t } = useTranslation();
    const [categories, setCategories] = useState([]);

    const fetchCategories = async () => {
        const res = await fetch('https://medichain-6tv7.onrender.com/api/categories/all-categories');
        if (res.ok) {
            const data = await res.json();
            setCategories(data);
        } else {
            alert('Failed to fetch categories.');
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            const res = await fetch(`https://medichain-6tv7.onrender.com/api/categories/delete-category/${id}`, {
                method: 'DELETE'
            });
            if (res.ok) {
                alert('Category deleted successfully!');
                fetchCategories();
            } else {
                alert('Failed to delete category.');
            }
        }
    };

    return (
        <div className="w-full bg-white p-8 rounded-xl shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-center">Existing Categories</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map(category => (
                    <div key={category._id} className="bg-gray-50 p-6 rounded-lg shadow-inner flex justify-between items-center">
                        <p className="font-semibold">{category.category_name}</p>
                        <div className="flex space-x-2">
                            <button onClick={() => onEdit(category)} className="bg-yellow-500 text-white p-2 rounded-lg text-sm hover:bg-yellow-600">Edit</button>
                            <button onClick={() => handleDelete(category._id)} className="bg-red-500 text-white p-2 rounded-lg text-sm hover:bg-red-600">Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ViewCategories;