import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { CheckCircle, PlayCircle, FileText } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';

export const CoursePlayerPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { user } = useAuth();
    const [course, setCourse] = useState<any>(null);
    const [activeLesson, setActiveLesson] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [enrolled, setEnrolled] = useState(false);
    const [completedLessons, setCompletedLessons] = useState<string[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const courseRes = await api.get(`/courses/${id}`);
                setCourse(courseRes.data);
                if (courseRes.data.modules.length > 0 && courseRes.data.modules[0].lessons.length > 0) {
                    setActiveLesson(courseRes.data.modules[0].lessons[0]);
                }

                // Check enrollment
                if (user) {
                    try {
                        const enrollRes = await api.get('/enrollments/my');
                        const enrollment = enrollRes.data.find((e: any) => e.courseId === id);
                        if (enrollment) {
                            setEnrolled(true);
                            setCompletedLessons(enrollment.completedLessons || []);
                        }
                    } catch (e) {
                        console.error('Enrollment check failed', e);
                    }
                }
            } catch (error) {
                console.error('Failed to fetch data', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id, user]);

    const handleEnroll = async () => {
        try {
            await api.post('/enrollments', { courseId: id });
            setEnrolled(true);
            alert('Enrolled successfully!');
        } catch (error) {
            alert('Failed to enroll');
        }
    };

    const handleMarkComplete = async () => {
        if (!activeLesson) return;
        try {
            await api.put('/enrollments/progress', { courseId: id, lessonId: activeLesson.id });
            setCompletedLessons([...completedLessons, activeLesson.id]);
        } catch (error) {
            alert('Failed to update progress');
        }
    };

    if (loading) return <div>Loading player...</div>;
    if (!course) return <div>Course not found</div>;

    if (!enrolled) {
        return (
            <div className="flex bg-gray-900 text-white h-[calc(100vh-4rem)] items-center justify-center">
                <div className="text-center">
                    <h1 className="mb-4 text-3xl font-bold">{course.title}</h1>
                    <p className="mb-8 text-gray-400">{course.description}</p>
                    <button
                        onClick={handleEnroll}
                        className="rounded bg-blue-600 px-8 py-3 font-bold text-white hover:bg-blue-700"
                    >
                        Enroll per {course.price === 0 ? 'Free' : `₦${course.price}`}
                    </button>
                    <button onClick={() => navigate('/courses')} className="block mt-4 text-gray-500 hover:text-white">Back to Catalog</button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-[calc(100vh-4rem)] flex-col md:flex-row">
            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto bg-gray-900 p-6 text-white md:w-3/4">
                {activeLesson ? (
                    <div className="mx-auto max-w-4xl">
                        {/* Video/Content Block */}
                        <div className="mb-4 aspect-video w-full bg-black">
                            {activeLesson.type === 'VIDEO' && activeLesson.videoUrl && (
                                <iframe
                                    src={activeLesson.videoUrl.replace('youtu.be/', 'youtube.com/embed/').replace('watch?v=', 'youtube.com/embed/')}
                                    className="h-full w-full"
                                    allowFullScreen
                                    title={activeLesson.title}
                                />
                            )}
                            {activeLesson.type !== 'VIDEO' && (
                                <div className="flex h-full items-center justify-center text-gray-500">
                                    {activeLesson.type} Content
                                </div>
                            )}
                        </div>
                        <h1 className="mb-2 text-2xl font-bold">{activeLesson.title}</h1>
                        <p className="text-gray-300">{activeLesson.content}</p>

                        <div className="mt-8 flex justify-end">
                            <button
                                onClick={handleMarkComplete}
                                disabled={completedLessons.includes(activeLesson.id)}
                                className={`rounded px-6 py-2 font-bold ${completedLessons.includes(activeLesson.id) ? 'bg-gray-600 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
                            >
                                {completedLessons.includes(activeLesson.id) ? 'Completed' : 'Mark as Complete'}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="flex h-full items-center justify-center text-gray-400">
                        Select a lesson
                    </div>
                )}
            </div>

            {/* Sidebar for Modules */}
            <div className="w-full overflow-y-auto bg-white border-l border-gray-200 md:w-1/4">
                <div className="p-4 border-b border-gray-200">
                    <h2 className="text-lg font-bold text-gray-800">{course.title}</h2>
                    <p className="text-sm text-gray-500">{completedLessons.length} / {course.modules.reduce((acc: any, m: any) => acc + m.lessons.length, 0)} Completed</p>
                </div>
                <div className="p-2">
                    {course.modules.map((module: any) => (
                        <div key={module.id} className="mb-4">
                            <h3 className="mb-2 px-2 text-sm font-semibold uppercase text-gray-500">{module.title}</h3>
                            <div className="space-y-1">
                                {module.lessons.map((lesson: any) => (
                                    <button
                                        key={lesson.id}
                                        onClick={() => setActiveLesson(lesson)}
                                        className={`flex w-full items-center space-x-3 rounded-md px-3 py-2 text-left text-sm ${activeLesson?.id === lesson.id
                                                ? 'bg-blue-50 text-blue-700 font-medium'
                                                : 'text-gray-700 hover:bg-gray-100'
                                            }`}
                                    >
                                        {lesson.type === 'VIDEO' ? <PlayCircle size={16} /> : <FileText size={16} />}
                                        <span className="truncate">{lesson.title}</span>
                                        {completedLessons.includes(lesson.id) && <CheckCircle size={14} className="ml-auto text-green-500" />}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
