import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { CourseCard } from './CourseCard';

interface Course {
    id: string;
    title: string;
    description: string;
    price: number;
    category: string;
    instructor: {
        name: string;
    };
}

export const CourseCatalogPage: React.FC = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const { data } = await api.get('/courses');
                setCourses(data);
            } catch (error) {
                console.error('Failed to fetch courses', error);
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, []);

    if (loading) return <div>Loading courses...</div>;

    return (
        <div>
            <h2 className="mb-6 text-2xl font-bold">Course Catalog</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {courses.map((course) => (
                    <CourseCard
                        key={course.id}
                        id={course.id}
                        title={course.title}
                        description={course.description}
                        instructorName={course.instructor.name}
                        price={course.price}
                        category={course.category}
                    />
                ))}
                {courses.length === 0 && <p>No courses found.</p>}
            </div>
        </div>
    );
};
