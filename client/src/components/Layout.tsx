import React from 'react';
import { useAuth } from '../features/auth/AuthContext';
import { useNavigate, Link, Outlet } from 'react-router-dom';
import { LogOut, BookOpen, PlusCircle, LayoutDashboard } from 'lucide-react';

export const Layout: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="w-64 bg-slate-900 text-white">
                <div className="flex h-16 items-center px-6 text-xl font-bold text-blue-400">
                    Cromkod LMS
                </div>
                <nav className="mt-4 space-y-2 px-4">
                    <Link to="/dashboard" className="flex items-center space-x-3 rounded-lg px-4 py-2 hover:bg-slate-800">
                        <LayoutDashboard size={20} />
                        <span>Dashboard</span>
                    </Link>
                    <Link to="/courses" className="flex items-center space-x-3 rounded-lg px-4 py-2 hover:bg-slate-800">
                        <BookOpen size={20} />
                        <span>Courses</span>
                    </Link>
                    {(user?.role === 'ADMIN' || user?.role === 'INSTRUCTOR') && (
                        <Link to="/courses/create" className="flex items-center space-x-3 rounded-lg px-4 py-2 hover:bg-slate-800">
                            <PlusCircle size={20} />
                            <span>Create Course</span>
                        </Link>
                    )}
                </nav>
                <div className="absolute bottom-0 w-64 p-4">
                    <div className="flex items-center space-x-3 px-4 py-2 text-sm text-slate-400">
                        <span>{user?.name}</span>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex w-full items-center space-x-3 rounded-lg px-4 py-2 text-red-400 hover:bg-slate-800"
                    >
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto">
                <header className="flex h-16 items-center bg-white px-8 shadow-sm">
                    <h1 className="text-xl font-semibold text-gray-800">Welcome back, {user?.name}</h1>
                </header>
                <main className="p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};
