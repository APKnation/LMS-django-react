import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { coursesAPI } from '../services/api';
import Navbar from '../components/common/Navbar';
import { useNavigate } from 'react-router-dom';

const Quizzes = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  const fetchQuizzesData = async () => {
    try {
      setLoading(true);
      // Fetch quizzes from enrolled courses
      const enrollmentsResponse = await coursesAPI.getEnrolled();
      const enrollments = enrollmentsResponse.data || [];
      
      // Extract quizzes from enrolled courses
      const quizzesData = [];
      enrollments.forEach(enrollment => {
        if (enrollment.course && enrollment.course.quizzes) {
          enrollment.course.quizzes.forEach(quiz => {
            quizzesData.push({
              id: quiz.id,
              title: quiz.title,
              course_title: enrollment.course.title,
              course_id: enrollment.course.id,
              completed: quiz.completed || false,
              score: quiz.score || null,
              total_questions: quiz.total_questions || 0,
              completed_at: quiz.completed_at || null
            });
          });
        }
      });
      
      console.log('Quizzes fetched from backend:', quizzesData);
      setQuizzes(quizzesData);
      setError(null);
    } catch (error) {
      console.error('Failed to fetch quizzes:', error);
      setError('Failed to load quizzes. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchQuizzesData();
  }, [isAuthenticated, fetchQuizzesData]);

  // Auto-refresh quizzes data every 30 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchQuizzesData();
    }, 30000); // Poll every 30 seconds

    return () => clearInterval(intervalId);
  }, [fetchQuizzesData]);

  const filteredQuizzes = quizzes.filter(quiz => {
    if (filter === 'all') return true;
    if (filter === 'completed') return quiz.completed;
    if (filter === 'in_progress') return !quiz.completed;
    return true;
  });

  const getStatusColor = (completed) => {
    return completed ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800';
  };

  const getStatusText = (completed) => {
    return completed ? 'Completed' : 'In Progress';
  };

  const handleStartQuiz = (courseId, quizId) => {
    window.location.href = `/courses/${courseId}/quizzes/${quizId}`;
  };

  // Remove mock data - quizzes will be fetched from API

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-900 to-purple-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-3xl lg:text-4xl font-bold mb-4">
              My Quizzes
            </h1>
            <p className="text-xl text-indigo-200">
              Test your knowledge and track your progress
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setFilter('all')}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  filter === 'all'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                All Quizzes ({quizzes.length})
              </button>
              <button
                onClick={() => setFilter('in_progress')}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  filter === 'in_progress'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                In Progress ({quizzes.filter(q => !q.completed).length})
              </button>
              <button
                onClick={() => setFilter('completed')}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  filter === 'completed'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Completed ({quizzes.filter(q => q.completed).length})
              </button>
            </nav>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <p className="mt-4 text-gray-600">Loading quizzes...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-red-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Quizzes</h3>
            <p className="text-gray-500 mb-4">{error}</p>
            <button
              onClick={fetchQuizzesData}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Quizzes List */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredQuizzes.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 012 2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {filter === 'all' ? 'No Quizzes Available' :
                   filter === 'in_progress' ? 'No Quizzes In Progress' :
                   'No Completed Quizzes'}
                </h3>
                <p className="text-gray-500">
                  {filter === 'all' ? 'Start taking courses to access quizzes.' :
                   filter === 'in_progress' ? 'You haven\'t started any quizzes yet.' :
                   'You haven\'t completed any quizzes yet.'}
                </p>
              </div>
            ) : (
              quizzes.map(quiz => (
                <div key={quiz.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {quiz.title}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          Course: {quiz.course_title}
                        </p>
                      </div>
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(quiz.completed)}`}>
                        {getStatusText(quiz.completed)}
                      </span>
                    </div>

                    {quiz.completed ? (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Score:</span>
                          <span className="font-semibold text-gray-900">
                            {quiz.score}/{quiz.total_questions}
                          </span>
                          <span className="text-emerald-600 ml-2">
                            ({Math.round((quiz.score / quiz.total_questions) * 100)}%)
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <span>Completed:</span>
                          <span className="font-medium text-gray-900 ml-2">
                            {new Date(quiz.completed_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center">
                        <p className="text-gray-500 text-sm mb-4">
                          Not started yet. Take this quiz to test your knowledge!
                        </p>
                        <button
                          onClick={() => handleStartQuiz(quiz.course_id, quiz.id)}
                          className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition-colors"
                        >
                          Start Quiz
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Quizzes;
