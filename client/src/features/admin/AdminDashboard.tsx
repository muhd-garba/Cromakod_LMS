import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { Users, BookOpen, GraduationCap } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
    const [stats, setStats] = useState({
        usersCount: 0,
        coursesCount: 0,
        enrollmentsCount: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await api.get('/admin/stats');
                setStats(data);
            } catch (error) {
                console.error('Failed to fetch stats', error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <div>Loading dashboard...</div>;

    return (
        <div>
            <h2 className="mb-6 text-2xl font-bold">Admin Dashboard</h2>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                {/* Users Card */}
                <div className="rounded-lg bg-white p-6 shadow-sm">
                    <div className="flex items-center space-x-4">
                        <div className="rounded-full bg-blue-100 p-3 text-blue-600">
                            <Users size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Total Users</p>
                            <h3 className="text-2xl font-bold text-gray-900">{stats.usersCount}</h3>
                        </div>
                    </div>
                </div>

                {/* Courses Card */}
                <div className="rounded-lg bg-white p-6 shadow-sm">
                    <div className="flex items-center space-x-4">
                        <div className="rounded-full bg-green-100 p-3 text-green-600">
                            <BookOpen size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Active Courses</p>
                            <h3 className="text-2xl font-bold text-gray-900">{stats.coursesCount}</h3>
                        </div>
                    </div>
                </div>

                {/* Enrollments Card */}
                <div className="rounded-lg bg-white p-6 shadow-sm">
                    <div className="flex items-center space-x-4">
                        <div className="rounded-full bg-purple-100 p-3 text-purple-600">
                            <GraduationCap size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Total Enrollments</p>
                            <h3 className="text-2xl font-bold text-gray-900">{stats.enrollmentsCount}</h3>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8 rounded-lg bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-lg font-bold">User Management</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Role</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            <UserList />
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="mt-8 rounded-lg bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-lg font-bold">Recent Activity</h3>
                <p className="text-gray-500">No recent activity to show.</p>
            </div>
        </div>
    );
};

const UserList = () => {
    const [users, setUsers] = useState<any[]>([]);

    useEffect(() => {
        api.get('/admin/users').then(({ data }) => setUsers(data)).catch(console.error);
    }, []);

    const handleRoleChange = async (userId: string, newRole: string) => {
        try {
            await api.put(`/admin/users/${userId}/role`, { role: newRole });
            setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
        } catch (error) {
            alert('Failed to update role');
        }
    };

    return (
        <>
            {users.map((user) => (
                <tr key={user.id}>
                    <td className="whitespace-nowrap px-6 py-4">{user.name}</td>
                    <td className="whitespace-nowrap px-6 py-4">{user.email}</td>
                    <td className="whitespace-nowrap px-6 py-4">
                        <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${user.role === 'ADMIN' ? 'bg-red-100 text-red-800' : user.role === 'INSTRUCTOR' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                            {user.role}
                        </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        <select
                            value={user.role}
                            onChange={(e) => handleRoleChange(user.id, e.target.value)}
                            className="rounded border border-gray-300 px-2 py-1 text-xs"
                        >
                            <option value="LEARNER">Learner</option>
                            <option value="INSTRUCTOR">Instructor</option>
                            <option value="ADMIN">Admin</option>
                        </select>
                    </td>
                </tr>
            ))}
        </>
    );
};
