import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { coursesAPI } from '../services/api';
import Sidebar from '../components/common/Sidebar';

const AdminCourses = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    if (user?.is_staff) {
      fetchCourses();
    }
  }, [user]);

  useEffect(() => {
    let filtered = courses;

    if (statusFilter !== 'all') {
      filtered = filtered.filter(c => c.status === statusFilter);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(c =>
        c.title?.toLowerCase().includes(term) ||
        c.description?.toLowerCase().includes(term) ||
        c.category?.toLowerCase().includes(term)
      );
    }

    setFilteredCourses(filtered);
  }, [courses, searchTerm, statusFilter]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await coursesAPI.adminListCourses();
      setCourses(response.data || []);
      setError(null);
    } catch (err) {
      setError('Failed to load courses');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChangeStatus = async (courseId, status) => {
    try {
      await coursesAPI.changeCourseStatus(courseId, status);
      await fetchCourses();
    } catch (err) {
      console.error('Failed to change course status:', err);
      setError('Failed to change course status');
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      return;
    }
    try {
      await coursesAPI.adminDeleteCourse(courseId);
      await fetchCourses();
    } catch (err) {
      console.error('Failed to delete course:', err);
      setError('Failed to delete course');
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
              <p className="mt-6 text-lg text-muted font-medium">Loading courses...</p>
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
            <h1 className="text-4xl font-extrabold mb-2">Admin Course Management</h1>
            <p className="text-muted text-lg">Manage all courses on the platform</p>
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                All Courses
              </h2>
              <div className="flex flex-col md:flex-row gap-4">
                <input
                  type="text"
                  placeholder="Search courses by title, description, or category..."
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
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
              <p className="text-muted mt-3">{filteredCourses.length} of {courses.length} courses shown</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-surface-elevated-dark">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-muted uppercase tracking-wider">Course</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-muted uppercase tracking-wider">Instructor</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-muted uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-muted uppercase tracking-wider">Price</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-muted uppercase tracking-wider">Enrollments</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-muted uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-hairline-on-dark">
                  {filteredCourses.map((course) => (
                    <tr key={course.id} className="hover:bg-surface-elevated-dark">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-on-dark">{course.title}</p>
                          <p className="text-sm text-muted">{course.category}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-muted">
                        {course.instructor_details?.username || course.instructor}
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={course.status}
                          onChange={(e) => handleChangeStatus(course.id, e.target.value)}
                          className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                            course.status === 'published' 
                              ? 'text-trading-up' 
                              : course.status === 'draft'
                              ? 'text-primary'
                              : 'text-muted'
                          }`}
                        >
                          <option value="draft">Draft</option>
                          <option value="published">Published</option>
                          <option value="archived">Archived</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 text-muted">
                        {course.is_free ? 'Free' : `$${course.price}`}
                      </td>
                      <td className="px-6 py-4 text-muted">
                        {course.enrollment_count || 0}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleDeleteCourse(course.id)}
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

export default AdminCourses;