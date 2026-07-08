import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { coursesAPI } from '../services/api';
import Sidebar from '../components/common/Sidebar';

const InstructorCourses = () => {
  const { user, isInstructor } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isInstructor) {
      fetchInstructorCourses();
    }
  }, [isInstructor]);

  const fetchInstructorCourses = async () => {
    try {
      setLoading(true);
      const response = await coursesAPI.getMyCourses();
      setCourses(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load your courses');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCourseClick = (courseId) => {
    navigate(`/courses/${courseId}`);
  };

  const handleCreateCourse = () => {
    navigate('/course/create');
  };

  if (!isInstructor) {
    return (
      <div className="flex min-h-screen bg-canvas-dark">
        <Sidebar />
      <div className="flex-1 lg:ml-64">
        <div className="flex items-center justify-center py-12">
          <p className="text-muted">Access denied. Only instructors can view this page.</p>
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
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-display-sm font-bold text-on-dark">My Courses</h1>
            <button
              onClick={handleCreateCourse}
              className="px-4 py-2 bg-primary text-on-primary rounded-md hover:bg-primary-active"
            >
              Create New Course
            </button>
          </div>

        {error && (
          <div className="bg-trading-down/10 border border-trading-down/40 text-trading-down px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted">You haven't created any courses yet.</p>
            <button
              onClick={handleCreateCourse}
              className="mt-4 px-4 py-2 bg-primary text-on-primary rounded-md hover:bg-primary-active"
            >
              Create Your First Course
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div
                key={course.id}
                className="bg-surface-card-dark rounded-lg overflow-hidden cursor-pointer hover:bg-surface-elevated-dark transition-colors"
                onClick={() => handleCourseClick(course.id)}
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold text-on-dark line-clamp-2">
                      {course.title}
                    </h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      course.is_published ? 'bg-trading-up/10 text-trading-up' : 'bg-muted/10 text-muted'
                    }`}>
                      {course.is_published ? 'Published' : 'Draft'}
                    </span>
                  </div>
                  <p className="text-body-on-dark mb-4 line-clamp-3">
                    {course.description}
                  </p>
                  <div className="flex items-center justify-between text-sm text-muted">
                    <span>{course.category || 'No category'}</span>
                    <span className="font-plex">{course.price ? `TZS ${course.price}` : 'Free'}</span>
                  </div>
                </div>
                <div className="bg-surface-elevated-dark px-6 py-4 flex justify-between items-center">
                  <div className="text-sm text-body-on-dark">
                    {course.student_count || 0} students enrolled
                  </div>
                  <button className="text-primary hover:text-primary-active text-sm font-medium">
                    Manage →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        </div>
      </div>
    </div>
  );
};

export default InstructorCourses;
