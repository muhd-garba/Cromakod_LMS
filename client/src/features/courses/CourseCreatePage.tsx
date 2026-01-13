import React, { useState } from 'react';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';

export const CourseCreatePage: React.FC = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'Full-Stack Development',
        price: 0,
    });
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const { data } = await api.post('/courses', formData);
            navigate(`/courses/${data.id}/edit`); // Redirect to edit page to add modules
        } catch (error) {
            console.error('Failed to create course', error);
            alert('Failed to create course');
        }
    };

    return (
        <div className="mx-auto max-w-2xl rounded-lg bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-2xl font-bold">Create New Course</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Course Title</label>
                    <input
                        type="text"
                        className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                        minLength={5}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                        className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        rows={4}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        required
                        minLength={20}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Category</label>
                    <select
                        className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                        <option>frontend Development</option>
                        <option>Backend Development</option>
                        <option>Full-Stack Development</option>
                        <option>UI/UX Design</option>
                        <option>CromaKids</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Price (₦)</label>
                    <input
                        type="number"
                        className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                        min={0}
                    />
                </div>
                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                    >
                        Create & Continue
                    </button>
                </div>
            </form>
        </div>
    );
};
