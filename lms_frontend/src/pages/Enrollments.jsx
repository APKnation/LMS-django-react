import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { coursesAPI } from '../services/api';
import Navbar from '../components/common/Navbar';

const Enrollments = () => {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('active');

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const fetchEnrollments = async () => {
    try {
      setLoading(true);
      const response = await coursesAPI.getEnrolled();
      console.log('Enrollments API Response:', response.data);
      setEnrollments(response.data);
      setError(null);
    } catch (error) {
      console.error('Failed to fetch enrollments:', error);
      setError('Failed to load your enrollments. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const filteredEnrollments = enrollments.filter(enrollment => {
    if (activeTab === 'active') {
      return enrollment.is_active;
    } else if (activeTab === 'completed') {
      return !enrollment.is_active; // Assuming completed means not active
    } else if (activeTab === 'all') {
      return true;
    }
    return false;
  });

  const getProgressPercentage = (enrollment) => {
    // Since we don't have progress tracking, return based on active status
    if (enrollment.is_active) {
      return 50; // In progress
    } else {
      return 100; // Completed
    }
  };

  const getStatusColor = (isActive) => {
    if (isActive) {
      return 'bg-blue-100 text-blue-800'; // In Progress
    } else {
      return 'bg-emerald-100 text-emerald-800'; // Completed
    }
  };

  const getStatusText = (isActive) => {
    if (isActive) {
      return 'In Progress';
    } else {
      return 'Completed';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-900 to-purple-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-3xl lg:text-4xl font-bold mb-4">
              My Enrollments
            </h1>
            <p className="text-xl text-indigo-200">
              Track your learning progress and achievements
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('active')}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'active'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Active Courses ({enrollments.filter(e => e.status === 'in_progress' || e.status === 'not_started').length})
              </button>
              <button
                onClick={() => setActiveTab('completed')}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'completed'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Completed ({enrollments.filter(e => e.status === 'completed').length})
              </button>
              <button
                onClick={() => setActiveTab('all')}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'all'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                All Courses ({enrollments.length})
              </button>
            </nav>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <p className="mt-4 text-gray-600">Loading your enrollments...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-red-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Enrollments</h3>
            <p className="text-gray-500 mb-4">{error}</p>
            <button
              onClick={fetchEnrollments}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Enrollments List */}
        {!loading && !error && (
          <div className="space-y-6">
            {filteredEnrollments.length === 0 ? (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {activeTab === 'active' ? 'No Active Courses' : 
                   activeTab === 'completed' ? 'No Completed Courses' : 
                   'No Enrollments Found'}
                </h3>
                <p className="text-gray-500">
                  {activeTab === 'active' ? 'You haven\'t started any courses yet. Browse our course catalog to get started!' :
                   activeTab === 'completed' ? 'You haven\'t completed any courses yet. Keep learning!' :
                   'You haven\'t enrolled in any courses yet.'}
                </p>
                <a
                  href="/courses"
                  className="inline-block mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Browse Courses
                </a>
              </div>
            ) : (
              filteredEnrollments.map(enrollment => (
                <div key={enrollment.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <div className="flex flex-col lg:flex-row">
                    {/* Course Image */}
                    <div className="lg:w-1/3">
                      <img
                        src={enrollment.course_thumbnail || 'https://picsum.photos/seed/course' + enrollment.course_id + '/400/250.jpg'}
                        alt={enrollment.course_title}
                        className="w-full h-48 lg:h-full object-cover"
                      />
                    </div>

                    {/* Course Info */}
                    <div className="flex-1 p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            {enrollment.course_title}
                          </h3>
                          <p className="text-gray-600 text-sm mb-2">
                            {enrollment.course_description}
                          </p>
                          <div className="flex items-center text-sm text-gray-500 mb-2">
                            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            {enrollment.course_instructor}
                          </div>
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                          <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(enrollment.is_active)}`}>
                            {enrollment.is_active ? 'In Progress' : 'Completed'}
                          </span>
                          {enrollment.certificate_url && (
                            <a
                              href={enrollment.certificate_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1 bg-emerald-600 text-white text-xs font-medium rounded-full hover:bg-emerald-700"
                            >
                              View Certificate
                            </a>
                          )}
                        </div>
                      </div>

                      {/* Progress Bar */}
                      {enrollment.progress && (
                        <div className="mb-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-gray-700">Progress</span>
                            <span className="text-sm text-gray-500">
                              {getProgressPercentage(enrollment)}% Complete
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${getProgressPercentage(enrollment)}%` }}
                            ></div>
                          </div>
                          <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>{enrollment.progress.completed_lessons || 0} lessons completed</span>
                            <span>{enrollment.progress.total_lessons || 0} total lessons</span>
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex space-x-3">
                        <button className="flex-1 px-4 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700">
                          Continue Learning
                        </button>
                        <button className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50">
                          View Details
                        </button>
                      </div>

                      {/* Enrollment Info */}
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Enrolled:</span>
                            <span className="text-gray-900 font-medium">
                              {new Date(enrollment.enrolled_at).toLocaleDateString()}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500">Duration:</span>
                            <span className="text-gray-900 font-medium">
                              {enrollment.course?.duration || '8 weeks'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
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

export default Enrollments;
