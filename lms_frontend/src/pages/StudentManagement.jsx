import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { coursesAPI } from '../services/api';
import Sidebar from '../components/common/Sidebar';

const StudentManagement = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user?.is_instructor) {
      fetchCourses();
    }
  }, [user]);

  useEffect(() => {
    if (selectedCourse) {
      fetchCourseStudents(selectedCourse);
    }
  }, [selectedCourse]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await coursesAPI.getMyCourses();
      setCourses(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load courses');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCourseStudents = async (courseId) => {
    try {
      const response = await coursesAPI.getCourseStudents(courseId);
      setStudents(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load students');
      console.error(err);
    }
  };

  if (!user?.is_instructor) {
    return (
      <div className="flex min-h-screen bg-canvas-dark">
        <Sidebar />
        <div className="flex-1 lg:ml-64">
          <div className="flex items-center justify-center py-12">
            <p className="text-muted">Access denied. Only instructors can manage students.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-canvas-dark">
      <Sidebar />
      <div className="flex-1 lg:ml-64">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-display-sm font-bold text-on-dark mb-8">Student Management</h1>

          {error && (
            <div className="bg-trading-down/10 border border-trading-down/40 text-trading-down px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          {/* Course Selection */}
          <div className="bg-surface-card-dark rounded-xl p-6 mb-6">
            <label className="block text-sm font-medium text-body-on-dark mb-2">Select Course</label>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="w-full px-4 py-2 bg-surface-card-dark border border-hairline-on-dark rounded-lg text-on-dark focus:outline-none focus:ring-2 focus:ring-info"
            >
              <option value="">Choose a course...</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ))}
            </select>
          </div>

          {selectedCourse && (
            <>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-title-md text-on-dark">
                  Students in {courses.find(c => c.id == selectedCourse)?.title}
                </h2>
                <div className="text-sm text-muted">
                  Total: {students.length} students
                </div>
              </div>

              {/* Student List */}
              <div className="bg-surface-card-dark rounded-xl">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-hairline-on-dark">
                    <thead className="bg-surface-elevated-dark">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">Student</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">Enrolled</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">Progress</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-surface-card-dark divide-y divide-hairline-on-dark">
                      {students.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="px-6 py-12 text-center text-muted">
                            No students enrolled in this course yet
                          </td>
                        </tr>
                      ) : (
                        students.map((student) => (
                          <tr key={student.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10 bg-surface-elevated-dark rounded-full flex items-center justify-center">
                                  <span className="text-primary font-medium">
                                    {student.username?.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-on-dark">
                                    {student.username}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-muted">
                              {student.email}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-plex text-muted">
                              {new Date(student.enrolled_at).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-plex text-muted">
                              {student.progress || 0}%
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                student.is_active ? 'bg-trading-up/10 text-trading-up' : 'bg-muted/10 text-muted'
                              }`}>
                                {student.is_active ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
          </>
        )}
        </div>
      </div>
    </div>
  );
};

export default StudentManagement;
