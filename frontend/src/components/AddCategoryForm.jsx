// medichain/frontend/src/components/AddCategoryForm.jsx
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const AddCategoryForm = ({ refreshCategories, onCancel }) => {
    const { t } = useTranslation();
    const [categoryName, setCategoryName] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await fetch('https://medichain-6tv7.onrender.com/api/categories/add-category', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ category_name: categoryName })
        });
        if (res.ok) {
            alert('Category added successfully!');
            setCategoryName('');
            refreshCategories();
            onCancel();
        } else {
            alert('Failed to add category.');
        }
    };

    return (
        <div className="w-full max-w-lg bg-white p-8 rounded-xl shadow-md mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-center">Add New Category</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    name="category_name"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    placeholder="Category Name"
                    className="w-full p-3 border rounded-lg"
                    required
                />
                <div className="flex justify-end space-x-4">
                    <button type="button" onClick={onCancel} className="bg-gray-500 text-white p-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors">
                        Cancel
                    </button>
                    <button type="submit" className="bg-green-500 text-white p-3 rounded-lg font-semibold hover:bg-green-600 transition-colors">
                        Add Category
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddCategoryForm;