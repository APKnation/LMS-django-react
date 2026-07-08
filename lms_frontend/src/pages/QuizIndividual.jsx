import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from '../components/common/Sidebar';

const QuizIndividual = () => {
  const { courseId, quizId } = useParams();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    // Show demo message instead of fetching from non-existent API
    setError('Quiz functionality is not available yet. This is a demo version.');
    setLoading(false);
  }, [isAuthenticated, courseId, quizId, navigate]);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-canvas-dark text-on-dark">
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex-1 lg:ml-64">
          {/* Header */}
          <div className="bg-canvas-dark border-b border-hairline-on-dark">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-xl lg:text-2xl font-bold text-on-dark">Quiz</h1>
                  <p className="text-muted mt-1">Course {courseId} - Quiz {quizId}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => navigate('/quizzes')}
                    className="px-4 py-2 bg-primary text-on-primary rounded-md hover:bg-primary-active transition-colors duration-200"
                  >
                    Back to Quizzes
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <p className="mt-4 text-muted">Loading quiz...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-canvas-dark text-on-dark">
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex-1 lg:ml-64">
          {/* Header */}
          <div className="bg-canvas-dark border-b border-hairline-on-dark">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-xl lg:text-2xl font-bold text-on-dark">Quiz</h1>
                  <p className="text-muted mt-1">Course {courseId} - Quiz {quizId}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => navigate('/quizzes')}
                    className="px-4 py-2 bg-primary text-on-primary rounded-md hover:bg-primary-active transition-colors duration-200"
                  >
                    Back to Quizzes
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-surface-card-dark border border-hairline-on-dark rounded-xl p-8 text-center">
              <svg className="mx-auto h-12 w-12 text-primary mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-lg font-medium text-on-dark mb-2">Quiz Demo</h3>
              <p className="text-muted mb-4">{error}</p>
              <div className="space-y-3">
                <p className="text-sm text-muted">
                  Quiz functionality will be available in a future version. For now, you can browse your enrolled courses and quizzes.
                </p>
                <button
                  onClick={() => navigate('/quizzes')}
                  className="px-6 py-3 bg-primary text-on-primary font-medium rounded-md hover:bg-primary-active transition-colors duration-200"
                >
                  Back to Quizzes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default QuizIndividual;
