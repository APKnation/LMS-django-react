import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { enrollmentAPI } from '../services/api';
import Sidebar from '../components/common/Sidebar';

const AdminEnrollments = () => {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [filteredEnrollments, setFilteredEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    if (user?.is_staff) {
      fetchEnrollments();
    }
  }, [user]);

  useEffect(() => {
    let filtered = enrollments;

    if (statusFilter !== 'all') {
      filtered = filtered.filter(e => {
        if (statusFilter === 'active') return e.is_active && e.status === 'active';
        if (statusFilter === 'cancelled') return e.status === 'cancelled';
        return true;
      });
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(e =>
        e.student_details?.username?.toLowerCase().includes(term) ||
        e.student_details?.email?.toLowerCase().includes(term) ||
        e.course_details?.title?.toLowerCase().includes(term)
      );
    }

    setFilteredEnrollments(filtered);
  }, [enrollments, searchTerm, statusFilter]);

  const fetchEnrollments = async () => {
    try {
      setLoading(true);
      const response = await enrollmentAPI.adminListEnrollments();
      setEnrollments(response.data || []);
      setError(null);
    } catch (err) {
      setError('Failed to load enrollments');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEnrollment = async (enrollmentId) => {
    try {
      await enrollmentAPI.cancelEnrollment(enrollmentId);
      await fetchEnrollments();
    } catch (err) {
      console.error('Failed to cancel enrollment:', err);
      setError('Failed to cancel enrollment');
    }
  };

  const handleDeleteEnrollment = async (enrollmentId) => {
    if (!window.confirm('Are you sure you want to delete this enrollment? This action cannot be undone.')) {
      return;
    }
    try {
      await enrollmentAPI.adminDeleteEnrollment(enrollmentId);
      await fetchEnrollments();
    } catch (err) {
      console.error('Failed to delete enrollment:', err);
      setError('Failed to delete enrollment');
    }
  };

  if (!user?.is_staff) {
    return (
      <div className="flex min-h-screen bg-canvas-dark">
        <Sidebar />
        <div className="flex-1 lg:ml-64">
          <div className="flex items-center justify-center py-12">
            <p className="text-muted">Access denied. Admin only.</p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-screen bg-canvas-dark">
        <Sidebar />
        <div className="flex-1 lg:ml-64">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-info border-t-transparent mx-auto"></div>
              <p className="mt-6 text-lg text-muted font-medium">Loading enrollments...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-canvas-dark">
      <Sidebar />
      <div className="flex-1 lg:ml-64">
        <div className="bg-surface-elevated-dark text-on-dark border-b border-hairline-on-dark">
          <div className="max-w-7xl mx-auto px-6 py-10">
            <h1 className="text-4xl font-extrabold mb-2">Admin Enrollment Management</h1>
            <p className="text-muted text-lg">Manage all student enrollments</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-10">
          {error && (
            <div className="bg-surface-card-dark border-l-4 border-trading-down text-trading-down px-6 py-4 rounded-r-lg mb-8">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            </div>
          )}

          <div className="bg-surface-card-dark rounded-xl overflow-hidden border border-hairline-on-dark">
            <div className="p-6 border-b border-hairline-on-dark">
              <h2 className="text-2xl font-bold text-on-dark flex items-center mb-4">
                <svg className="w-8 h-8 mr-3 text-info" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                All Enrollments
              </h2>
              <div className="flex flex-col md:flex-row gap-4">
                <input
                  type="text"
                  placeholder="Search by student name, email, or course title..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 px-4 py-2 border border-hairline-on-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-info bg-surface-card-dark text-on-dark"
                />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-hairline-on-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-info bg-surface-card-dark text-on-dark"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <p className="text-muted mt-3">{filteredEnrollments.length} of {enrollments.length} enrollments shown</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-surface-elevated-dark">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-muted uppercase tracking-wider">Student</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-muted uppercase tracking-wider">Course</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-muted uppercase tracking-wider">Enrolled Date</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-muted uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-muted uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-hairline-on-dark">
                  {filteredEnrollments.map((enrollment) => (
                    <tr key={enrollment.id} className="hover:bg-surface-elevated-dark">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-on-dark">{enrollment.student_details?.username || enrollment.student}</p>
                          <p className="text-sm text-muted">{enrollment.student_details?.email || ''}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-on-dark">{enrollment.course_details?.title || enrollment.course}</p>
                          <p className="text-sm text-muted">{enrollment.course_details?.instructor || ''}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-muted">
                        {new Date(enrollment.enrolled_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                          enrollment.is_active && enrollment.status === 'active'
                            ? 'text-trading-up'
                            : enrollment.status === 'cancelled'
                            ? 'text-trading-down'
                            : 'text-primary'
                        }`}>
                          {enrollment.is_active && enrollment.status === 'active' ? 'Active' : enrollment.status || 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {enrollment.is_active && (
                            <button
                              onClick={() => handleCancelEnrollment(enrollment.id)}
                              className="bg-primary text-on-primary px-3 py-1.5 rounded-lg text-xs font-semibold"
                            >
                              Cancel
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteEnrollment(enrollment.id)}
                            className="bg-trading-down text-on-primary px-3 py-1.5 rounded-lg text-xs font-semibold"
                          >
                            Delete
                          </button>
                        </div>
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

export default AdminEnrollments;