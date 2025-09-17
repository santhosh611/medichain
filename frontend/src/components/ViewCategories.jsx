// medichain/frontend/src/components/ViewCategories.jsx
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const ViewCategories = ({ onEdit, onAdd }) => {
    const { t } = useTranslation();
    const [categories, setCategories] = useState([]);

    const fetchCategories = async () => {
        const res = await fetch('http://localhost:5000/api/categories/all-categories');
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
            const res = await fetch(`http://localhost:5000/api/categories/delete-category/${id}`, {
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
        <div className="w-full bg-white p-6 md:p-8 rounded-xl shadow-md">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
                <h2 className="text-2xl font-bold mb-4 sm:mb-0">Existing Categories</h2>
                <button onClick={onAdd} className="bg-blue-500 text-white p-2 rounded-lg font-semibold hover:bg-blue-600 transition-colors w-full sm:w-auto">
                    Add New Category
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {categories.map(category => (
                    <div key={category._id} className="bg-white p-4 sm:p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow flex justify-between items-center flex-wrap">
                        <p className="font-semibold">{category.category_name}</p>
                        <div className="mt-2 sm:mt-0 flex space-x-2">
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