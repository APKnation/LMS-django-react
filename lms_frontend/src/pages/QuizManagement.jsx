import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { quizAPI, coursesAPI } from '../services/api';
import Sidebar from '../components/common/Sidebar';

const QuizManagement = () => {
  const { user } = useAuth();
  const [quizzes, setQuizzes] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [courseQuizzes, setCourseQuizzes] = useState([]);

  useEffect(() => {
    if (user?.is_instructor) {
      fetchCourses();
    }
  }, [user]);

  useEffect(() => {
    if (selectedCourse) {
      fetchCourseQuizzes(selectedCourse);
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

  const fetchCourseQuizzes = async (courseId) => {
    try {
      const response = await coursesAPI.getQuizzes(courseId);
      setCourseQuizzes(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load quizzes');
      console.error(err);
    }
  };

  const handleDeleteQuiz = async (quizId) => {
    try {
      await quizAPI.deleteQuiz(quizId);
      fetchCourseQuizzes(selectedCourse);
    } catch (err) {
      setError('Failed to delete quiz');
      console.error(err);
    }
  };

  if (!user?.is_instructor) {
    return (
      <div className="flex min-h-screen bg-canvas-dark">
        <Sidebar />
        <div className="flex-1 lg:ml-64">
          <div className="flex items-center justify-center py-12">
            <p className="text-muted">Access denied. Only instructors can manage quizzes.</p>
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
          <h1 className="text-display-sm font-bold text-on-dark mb-8">Quiz Management</h1>

          {error && (
            <div className="bg-trading-down/10 border border-trading-down/40 text-trading-down px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
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
              {/* Quiz List */}
              <div className="bg-surface-card-dark rounded-xl mb-6">
                <div className="px-6 py-4 border-b border-hairline-on-dark flex justify-between items-center">
                  <h2 className="text-title-md text-on-dark">Quizzes for {courses.find(c => c.id == selectedCourse)?.title}</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-hairline-on-dark">
                    <thead className="bg-surface-elevated-dark">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">Title</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">Questions</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">Time Limit</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">Passing Score</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {courseQuizzes.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                            No quizzes found for this course
                          </td>
                        </tr>
                      ) : (
                        courseQuizzes.map((quiz) => (
                          <tr key={quiz.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {quiz.title}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {quiz.question_count || 0}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {quiz.time_limit ? `${quiz.time_limit} min` : 'No limit'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {quiz.passing_score}%
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <button
                                onClick={() => handleDeleteQuiz(quiz.id)}
                                className="text-red-600 hover:text-red-900 mr-4"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Create Quiz Button */}
              <div className="bg-white rounded-lg shadow p-6">
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Create New Quiz
                </button>
              </div>
            </>
          )}
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizManagement;
