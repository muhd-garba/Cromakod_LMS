import React from 'react';
import { Link } from 'react-router-dom';

interface CourseCardProps {
    id: string;
    title: string;
    description: string;
    instructorName: string;
    price: number;
    thumbnail?: string;
    category: string;
}

export const CourseCard: React.FC<CourseCardProps> = ({
    id,
    title,
    description,
    instructorName,
    price,
    category,
}) => {
    return (
        <div className="flex flex-col rounded-lg bg-white shadow-sm transition-shadow hover:shadow-md">
            <div className="h-48 w-full rounded-t-lg bg-gray-200">
                {/* Placeholder or Image */}
                <div className="flex h-full items-center justify-center text-gray-400">
                    {/* If thumbnail exists render img, else icon */}
                    <span className="text-4xl">📚</span>
                </div>
            </div>
            <div className="flex flex-1 flex-col p-4">
                <div className="mb-2 text-xs font-semibold uppercase text-blue-600">{category}</div>
                <h3 className="mb-2 text-lg font-bold text-gray-900">{title}</h3>
                <p className="mb-4 line-clamp-2 flex-1 text-sm text-gray-600">{description}</p>
                <div className="mt-auto flex items-center justify-between">
                    <span className="text-sm text-gray-500">By {instructorName}</span>
                    <span className="font-bold text-green-600">{price === 0 ? 'Free' : `₦${price.toLocaleString()}`}</span>
                </div>
                <Link
                    to={`/courses/${id}`}
                    className="mt-4 block w-full rounded-md bg-slate-900 py-2 text-center text-sm font-semibold text-white hover:bg-slate-800"
                >
                    View Course
                </Link>
            </div>
        </div>
    );
};
