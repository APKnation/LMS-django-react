import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { coursesAPI } from '../services/api';
import Sidebar from '../components/common/Sidebar';
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
        if (enrollment.course_id && enrollment.course_title) {
          // For now, create mock quiz data since course.quizzes relationship doesn't exist yet
          const mockQuiz = {
            id: enrollment.course_id,
            title: `${enrollment.course_title} Quiz`,
            course_title: enrollment.course_title,
            course_id: enrollment.course_id,
            completed: false,
            score: null,
            total_questions: 3,
            completed_at: null
          };
          quizzesData.push(mockQuiz);
        }
      });

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
  }, [isAuthenticated]);

  // Auto-refresh quizzes data every 30 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchQuizzesData();
    }, 30000); // Poll every 30 seconds

    return () => clearInterval(intervalId);
  }, []); // Remove fetchQuizzesData dependency to prevent multiple intervals

  const filteredQuizzes = quizzes.filter(quiz => {
    if (filter === 'all') return true;
    if (filter === 'completed') return quiz.completed;
    if (filter === 'in_progress') return !quiz.completed;
    return true;
  });

  const getStatusColor = (completed) => {
    return completed ? 'text-trading-up' : 'text-primary';
  };

  const getStatusText = (completed) => {
    return completed ? 'Completed' : 'In Progress';
  };

  const handleStartQuiz = (courseId, quizId) => {
    alert('Quiz functionality will be available soon! This is a demo version.');
  };

  // Remove mock data - quizzes will be fetched from API

  return (
    <div className="flex min-h-screen bg-canvas-dark text-on-dark">
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-64">
        {/* Header */}
        <div className="bg-canvas-dark border-b border-hairline-on-dark">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <h1 className="text-3xl lg:text-4xl font-bold mb-4 text-on-dark">
                My Quizzes
              </h1>
              <p className="text-xl text-muted">
                Test your knowledge and track your progress
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter Tabs */}
        <div className="mb-8">
          <div className="border-b border-hairline-on-dark">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setFilter('all')}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  filter === 'all'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted hover:text-on-dark hover:border-hairline-on-dark'
                }`}
              >
                All Quizzes ({quizzes.length})
              </button>
              <button
                onClick={() => setFilter('in_progress')}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  filter === 'in_progress'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted hover:text-on-dark hover:border-hairline-on-dark'
                }`}
              >
                In Progress ({quizzes.filter(q => !q.completed).length})
              </button>
              <button
                onClick={() => setFilter('completed')}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  filter === 'completed'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted hover:text-on-dark hover:border-hairline-on-dark'
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
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="mt-4 text-muted">Loading quizzes...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-trading-down mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <h3 className="text-lg font-medium text-on-dark mb-2">Error Loading Quizzes</h3>
            <p className="text-muted mb-4">{error}</p>
            <button
              onClick={fetchQuizzesData}
              className="px-4 py-2 bg-primary text-on-primary rounded-md hover:bg-primary-active transition-colors duration-200"
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
                <svg className="mx-auto h-12 w-12 text-muted mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 012 2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
                <h3 className="text-lg font-medium text-on-dark mb-2">
                  {filter === 'all' ? 'No Quizzes Available' :
                   filter === 'in_progress' ? 'No Quizzes In Progress' :
                   'No Completed Quizzes'}
                </h3>
                <p className="text-muted">
                  {filter === 'all' ? 'Start taking courses to access quizzes.' :
                   filter === 'in_progress' ? 'You haven\'t started any quizzes yet.' :
                   'You haven\'t completed any quizzes yet.'}
                </p>
              </div>
            ) : (
              quizzes.map(quiz => (
                <div key={quiz.id} className="bg-surface-card-dark border border-hairline-on-dark rounded-xl hover:bg-surface-elevated-dark transition-colors duration-200 p-6">
                  <div className="p-2">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-on-dark mb-2">
                          {quiz.title}
                        </h3>
                        <div className="flex items-center text-sm text-muted">
                          <svg className="w-4 h-4 mr-2 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                          <span className="font-medium">{quiz.course_title}</span>
                        </div>
                      </div>
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(quiz.completed)}`}>
                        {getStatusText(quiz.completed)}
                      </span>
                    </div>

                    {quiz.completed ? (
                      <div className="space-y-4">
                        <div className="bg-surface-elevated-dark rounded-lg p-4 border border-hairline-on-dark">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-muted">Quiz Score</span>
                            <div className="flex items-center">
                              <span className="text-2xl font-bold text-on-dark font-plex mr-2">
                                {Math.round((quiz.score / quiz.total_questions) * 100)}%
                              </span>
                              <span className="text-sm text-muted">
                                ({quiz.score}/{quiz.total_questions})
                              </span>
                            </div>
                          </div>
                          <div className="w-full bg-surface-card-dark rounded-full h-2">
                            <div
                              className="bg-primary h-2 rounded-full transition-all duration-700"
                              style={{ width: `${Math.round((quiz.score / quiz.total_questions) * 100)}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="flex items-center text-sm text-muted">
                          <svg className="w-4 h-4 mr-2 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span>Completed on {new Date(quiz.completed_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center">
                        <div className="bg-surface-elevated-dark rounded-lg p-4 border border-hairline-on-dark mb-4">
                          <svg className="w-8 h-8 mx-auto text-primary mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <p className="text-on-dark text-sm font-medium">
                            Ready to test your knowledge?
                          </p>
                          <p className="text-muted text-xs mt-1">
                            {quiz.total_questions} questions • Multiple choice
                          </p>
                        </div>
                        <button
                          onClick={() => handleStartQuiz(quiz.course_id, quiz.id)}
                          className="px-6 py-3 bg-primary text-on-primary font-medium rounded-md hover:bg-primary-active transition-colors duration-200"
                        >
                          Demo Quiz
                          <svg className="w-4 h-4 ml-2 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
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
    </div>
  );
};

export default Quizzes;
