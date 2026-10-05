import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { progressAPI, coursesAPI } from '../services/api';
import Sidebar from '../components/common/Sidebar';

const Progress = () => {
  const { user, isStudent } = useAuth();
  const [progressData, setProgressData] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchProgressData();
  }, []);

  const fetchProgressData = async () => {
    try {
      setLoading(true);
      const [progressResponse, enrolledResponse] = await Promise.all([
        progressAPI.getMyProgress(),
        coursesAPI.getEnrolled()
      ]);

      setProgressData(progressResponse.data || []);
      setEnrolledCourses(enrolledResponse.data || []);
    } catch (err) {
      setError('Failed to load progress data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const calculateCourseProgress = (courseId) => {
    const courseProgress = progressData.filter(p => p.lesson_details?.course === courseId);
    if (courseProgress.length === 0) return 0;
    const completed = courseProgress.filter(p => p.completed).length;
    return Math.round((completed / courseProgress.length) * 100);
  };

  const totalCompleted = progressData.filter(p => p.completed).length;
  const totalProgress = progressData.length;

  if (loading) {
    return (
      <div className="flex min-h-screen bg-canvas-dark text-on-dark">
        <Sidebar />
        <div className="flex-1 lg:ml-64">
          <div className="flex items-center justify-center h-64 sm:h-80">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 border-b-2 border-primary mx-auto"></div>
              <p className="mt-3 sm:mt-4 text-sm text-muted">Loading progress...</p>
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
        <div className="flex-1 lg:ml-64">
          <div className="mx-auto px-4 sm:px-6 lg:px-8 py-6 max-w-7xl">
            <div className="bg-surface-card-dark border border-hairline-on-dark text-trading-down px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-canvas-dark text-on-dark">
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-64">
        {/* Header */}
        <div className="bg-canvas-dark border-b border-hairline-on-dark">
          <div className="mx-auto px-4 sm:px-6 lg:px-8 py-6 max-w-7xl">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-on-dark">My Progress</h1>
            <p className="text-sm text-muted mt-1">Track your learning journey</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-6 max-w-7xl">
          {/* Overview Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4">
            <div className="bg-surface-card-dark border border-hairline-on-dark rounded-xl p-3 sm:p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-surface-elevated-dark rounded-lg p-2">
                  <svg className="h-4 sm:h-5 w-4 sm:w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-2 sm:ml-3">
                  <p className="text-xs sm:text-sm font-medium text-muted">Lessons Completed</p>
                  <p className="text-base sm:text-lg font-bold text-on-dark font-plex">{totalCompleted}/{totalProgress}</p>
                </div>
              </div>
            </div>

            <div className="bg-surface-card-dark border border-hairline-on-dark rounded-xl p-3 sm:p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-surface-elevated-dark rounded-lg p-2">
                  <svg className="h-4 sm:h-5 w-4 sm:w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div className="ml-2 sm:ml-3">
                  <p className="text-xs sm:text-sm font-medium text-muted">Enrolled Courses</p>
                  <p className="text-base sm:text-lg font-bold text-on-dark font-plex">{enrolledCourses.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-surface-card-dark border border-hairline-on-dark rounded-xl p-3 sm:p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-surface-elevated-dark rounded-lg p-2">
                  <svg className="h-4 sm:h-5 w-4 sm:w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <div className="ml-2 sm:ml-3">
                  <p className="text-xs sm:text-sm font-medium text-muted">Overall Progress</p>
                  <p className="text-base sm:text-lg font-bold text-on-dark font-plex">
                    {totalProgress > 0 ? Math.round((totalCompleted / totalProgress) * 100) : 0}%
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-surface-card-dark border border-hairline-on-dark rounded-xl p-3 sm:p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-surface-elevated-dark rounded-lg p-2">
                  <svg className="h-4 sm:h-5 w-4 sm:w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-2 sm:ml-3">
                  <p className="text-xs sm:text-sm font-medium text-muted">Time Learning</p>
                  <p className="text-base sm:text-lg font-bold text-on-dark font-plex">Active</p>
                </div>
              </div>
            </div>
          </div>

          {/* Course Progress */}
          <div className="bg-surface-card-dark border border-hairline-on-dark rounded-xl mb-4">
            <div className="px-4 py-3 border-b border-hairline-on-dark">
              <h2 className="text-base sm:text-lg font-semibold text-on-dark">Course Progress</h2>
            </div>
            <div className="p-4">
              {enrolledCourses.length === 0 ? (
                <div className="text-center py-8 text-muted">
                  <svg className="mx-auto h-8 w-8 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <p className="mt-2 text-sm">No enrolled courses yet</p>
                  <a href="/courses" className="mt-1 inline-block text-primary hover:text-primary-active text-sm">
                    Browse courses
                  </a>
                </div>
              ) : (
                <div className="space-y-3">
                  {enrolledCourses.map((enrollment) => {
                    const progress = calculateCourseProgress(enrollment.course);
                    return (
                      <div key={enrollment.id} className="border border-hairline-on-dark rounded-lg p-3 hover:bg-surface-elevated-dark transition-colors duration-200">
                        <div className="flex items-center justify-between mb-2">
                          <div className="min-w-0">
                            <h3 className="text-sm font-semibold text-on-dark truncate">{enrollment.course_title || 'Course'}</h3>
                            <p className="text-xs text-muted truncate">{enrollment.course_description || 'Course description'}</p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                              progress === 100 ? 'text-trading-up' : 'text-primary'
                            }`}>
                              {progress}% Complete
                            </span>
                          </div>
                        </div>
                        <div className="w-full bg-surface-elevated-dark rounded-full h-1.5">
                          <div
                            className={`h-1.5 rounded-full transition-all ${
                              progress === 100 ? 'bg-trading-up' : 'bg-primary'
                            }`}
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-surface-card-dark border border-hairline-on-dark rounded-xl">
            <div className="px-4 py-3 border-b border-hairline-on-dark">
              <h2 className="text-base sm:text-lg font-semibold text-on-dark">Recent Activity</h2>
            </div>
            <div className="p-4">
              {progressData.length === 0 ? (
                <div className="text-center py-8 text-muted">
                  <svg className="mx-auto h-8 w-8 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="mt-2 text-sm">No recent activity</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {progressData.slice(0, 5).map((progress) => (
                    <div key={progress.id} className="flex items-center p-2.5 bg-surface-elevated-dark rounded-lg">
                      <div className={`flex-shrink-0 rounded-full p-1.5 ${progress.completed ? 'bg-surface-card-dark' : 'bg-surface-card-dark'}`}>
                        <svg className={`h-4 w-4 ${progress.completed ? 'text-trading-up' : 'text-primary'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          {progress.completed ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          )}
                        </svg>
                      </div>
                      <div className="ml-3 flex-1 min-w-0">
                        <p className="text-xs sm:text-sm font-medium text-on-dark truncate">
                          {progress.lesson_details?.title || 'Lesson'}
                        </p>
                        <p className="text-xs text-muted">
                          {progress.completed ? 'Completed' : 'In progress'} • {progress.completed_at ? new Date(progress.completed_at).toLocaleDateString() : 'Recently'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
      </div>
      </div>
    </div>
  );
};

export default Progress;
