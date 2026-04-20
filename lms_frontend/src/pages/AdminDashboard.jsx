import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { authAPI, coursesAPI, paymentsAPI } from '../services/api';
import Sidebar from '../components/common/Sidebar';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStudents: 0,
    totalInstructors: 0,
    totalCourses: 0,
    totalRevenue: 0,
    pendingInstructors: 0,
  });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (user?.is_staff) {
      fetchStats();
      fetchUsers();
    }
  }, [user]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      // Fetch users count
      const studentsResponse = await authAPI.getStudents();
      const instructorsResponse = await authAPI.getInstructors();
      const coursesResponse = await coursesAPI.getAll();
      
      setStats({
        totalUsers: studentsResponse.data.length + instructorsResponse.data.length,
        totalStudents: studentsResponse.data.length,
        totalInstructors: instructorsResponse.data.length,
        totalCourses: coursesResponse.data.length,
        totalRevenue: 0,
        pendingInstructors: instructorsResponse.data.filter(i => !i.is_instructor_approved).length,
      });
      setError(null);
    } catch (err) {
      setError('Failed to load statistics');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const students = await authAPI.getStudents();
      const instructors = await authAPI.getInstructors();
      setUsers([...students.data, ...instructors.data]);
    } catch (err) {
      console.error('Failed to load users:', err);
    }
  };

  const handleApproveInstructor = async (userId) => {
    try {
      await authAPI.approveInstructor(userId);
      await fetchUsers();
      await fetchStats();
    } catch (err) {
      console.error('Failed to approve instructor:', err);
      setError('Failed to approve instructor');
    }
  };

  const handleBanUser = async (userId) => {
    try {
      await authAPI.banUser(userId);
      await fetchUsers();
      await fetchStats();
    } catch (err) {
      console.error('Failed to ban user:', err);
      setError('Failed to ban user');
    }
  };

  const handleUnbanUser = async (userId) => {
    try {
      await authAPI.unbanUser(userId);
      await fetchUsers();
      await fetchStats();
    } catch (err) {
      console.error('Failed to unban user:', err);
      setError('Failed to unban user');
    }
  };

  const handleUpdateRole = async (userId, role) => {
    try {
      await authAPI.updateUserRole(userId, role);
      await fetchUsers();
      await fetchStats();
    } catch (err) {
      console.error('Failed to update role:', err);
      setError('Failed to update role');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }
    try {
      await authAPI.deleteUser(userId);
      await fetchUsers();
      await fetchStats();
    } catch (err) {
      console.error('Failed to delete user:', err);
      setError('Failed to delete user');
    }
  };

  if (!user?.is_staff) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 lg:ml-64">
          <div className="flex items-center justify-center py-12">
            <p className="text-gray-600">Access denied. Admin only.</p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Sidebar />
        <div className="flex-1 lg:ml-64">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-600 border-t-transparent mx-auto"></div>
              <p className="mt-6 text-lg text-gray-600 font-medium">Loading admin dashboard...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Sidebar />

      <div className="flex-1 lg:ml-64">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-900 via-orange-900 to-red-800 text-white shadow-xl">
          <div className="max-w-7xl mx-auto px-6 py-10">
            <h1 className="text-4xl font-extrabold mb-2">Admin Dashboard</h1>
            <p className="text-red-200 text-lg">Platform management and oversight</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-10">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-r-lg mb-8 shadow-md">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-10">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Total Users</p>
                  <p className="text-3xl font-extrabold text-gray-900 mt-1">{stats.totalUsers}</p>
                </div>
                <div className="bg-indigo-100 rounded-2xl p-4">
                  <svg className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Students</p>
                  <p className="text-3xl font-extrabold text-emerald-600 mt-1">{stats.totalStudents}</p>
                </div>
                <div className="bg-emerald-100 rounded-2xl p-4">
                  <svg className="h-8 w-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Instructors</p>
                  <p className="text-3xl font-extrabold text-purple-600 mt-1">{stats.totalInstructors}</p>
                </div>
                <div className="bg-purple-100 rounded-2xl p-4">
                  <svg className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Total Courses</p>
                  <p className="text-3xl font-extrabold text-blue-600 mt-1">{stats.totalCourses}</p>
                </div>
                <div className="bg-blue-100 rounded-2xl p-4">
                  <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Pending Instructor Approvals */}
          {stats.pendingInstructors > 0 && (
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl shadow-lg p-6 mb-10 border border-yellow-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                  <svg className="w-8 h-8 mr-3 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  Pending Instructor Approvals
                </h2>
                <span className="bg-yellow-500 text-white px-4 py-2 rounded-full font-semibold">
                  {stats.pendingInstructors}
                </span>
              </div>
              <p className="text-gray-600">There are instructors waiting for approval to create courses.</p>
            </div>
          )}

          {/* User Management Table */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <svg className="w-8 h-8 mr-3 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                User Management
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="bg-indigo-100 rounded-full w-10 h-10 flex items-center justify-center">
                            <span className="text-indigo-600 font-semibold">
                              {u.first_name?.[0] || u.username?.[0] || 'U'}
                            </span>
                          </div>
                          <div className="ml-4">
                            <p className="font-semibold text-gray-900">{u.first_name} {u.last_name}</p>
                            <p className="text-sm text-gray-500">@{u.username}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{u.email}</td>
                      <td className="px-6 py-4">
                        {u.is_staff && <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-semibold">Admin</span>}
                        {u.is_instructor && <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-semibold">Instructor</span>}
                        {u.is_student && <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-semibold">Student</span>}
                      </td>
                      <td className="px-6 py-4">
                        {u.is_instructor && !u.is_instructor_approved && (
                          <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-semibold">Pending</span>
                        )}
                        {u.is_instructor && u.is_instructor_approved && (
                          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">Approved</span>
                        )}
                        {u.is_student && (
                          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">Active</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {u.is_instructor && !u.is_instructor_approved && (
                          <button
                            onClick={() => handleApproveInstructor(u.id)}
                            className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-emerald-700 transition-colors"
                          >
                            Approve
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
