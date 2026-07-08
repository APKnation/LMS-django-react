import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { coursesAPI } from '../services/api';
import Sidebar from '../components/common/Sidebar';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, isStudent, isInstructor } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalCourses: 0,
    completed: 0,
    inProgress: 0,
    certificates: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Redirect instructors to instructor dashboard
  useEffect(() => {
    if (isInstructor) {
      navigate('/instructor-dashboard');
    }
  }, [isInstructor, navigate]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch both APIs in parallel
      const [enrollmentsResponse, allCoursesResponse] = await Promise.all([
        coursesAPI.getEnrolled(),
        coursesAPI.getAll()
      ]);

      const enrollments = enrollmentsResponse.data || [];
      const allCourses = allCoursesResponse.data || [];

      // Calculate stats from real data
      const stats = {
        totalCourses: allCourses.length,
        enrolledCourses: enrollments.length,
        completed: enrollments.filter(e => !e.is_active).length,
        inProgress: enrollments.filter(e => e.is_active).length,
        certificates: enrollments.filter(e => e.certificate_url).length
      };

      setStats(stats);

      // Create recent activity from enrollments
      const recentActivity = enrollments.slice(0, 5).map(enrollment => ({
        id: enrollment.id,
        type: 'enrollment',
        title: `Enrolled in ${enrollment.course_title || 'Course'}`,
        description: enrollment.course_description || 'Course enrollment',
        timestamp: enrollment.enrolled_at,
        status: enrollment.is_active ? 'active' : 'completed'
      }));

      setRecentActivity(recentActivity);
      setError(null);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      setError('Failed to load dashboard data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Auto-refresh dashboard data every 30 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchDashboardData();
    }, 30000); // Poll every 30 seconds

    return () => clearInterval(intervalId);
  }, [fetchDashboardData]);

  return (
    <div className="flex min-h-screen bg-canvas-dark text-on-dark">
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-64">
        {/* Dashboard Header */}
        <div className="bg-canvas-dark border-b border-hairline-on-dark">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-on-dark">Dashboard</h1>
                <p className="text-muted mt-1">Welcome back, {user?.first_name || user?.username}</p>
              </div>
              <div className="flex items-center space-x-4">
                <span className={`px-3 py-1 rounded-full text-sm border ${
                  user?.is_instructor && !user?.is_instructor_approved
                    ? 'border-primary text-primary'
                    : isStudent
                    ? 'bg-primary text-on-primary'
                    : isInstructor
                    ? 'border border-hairline-on-dark text-on-dark bg-surface-elevated-dark'
                    : 'border border-hairline-on-dark text-muted bg-surface-elevated-dark'
                }`}>
                  {user?.is_instructor && !user?.is_instructor_approved
                    ? 'Pending Instructor'
                    : isStudent
                    ? 'Student'
                    : isInstructor
                    ? 'Instructor'
                    : 'User'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Instructor Approval Warning */}
        {user?.is_instructor && !user?.is_instructor_approved && (
          <div className="bg-surface-card-dark border-l-4 border-primary p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-primary" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-body-on-dark">
                  <strong>Instructor Account Pending Approval</strong> - Your instructor account is awaiting approval from administrators. You will be able to create courses once approved.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left Column - Main Stats */}
          <div className="lg:col-span-2 space-y-8">
            {/* Stats Overview */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-on-dark">Learning Overview</h2>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-trading-up rounded-full animate-pulse"></div>
                  <span className="text-sm text-muted">Live Stats</span>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
                <div className="bg-surface-card-dark border border-hairline-on-dark rounded-xl p-6">
                  <div className="flex items-center mb-4">
                    <div className="flex-shrink-0 bg-surface-elevated-dark rounded-xl p-3">
                      <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-semibold text-muted uppercase tracking-wider">Total</p>
                      <p className="text-3xl font-bold text-on-dark font-plex">{stats.totalCourses}</p>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-hairline-on-dark">
                    <p className="text-sm text-muted">Enrolled: <span className="font-semibold text-primary">{stats.enrolledCourses}</span></p>
                  </div>
                </div>

                <div className="bg-surface-card-dark border border-hairline-on-dark rounded-xl p-6">
                  <div className="flex items-center mb-4">
                    <div className="flex-shrink-0 bg-surface-elevated-dark rounded-xl p-3">
                      <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-semibold text-muted uppercase tracking-wider">Completed</p>
                      <p className="text-3xl font-bold text-on-dark font-plex">{stats.completed}</p>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-hairline-on-dark">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 text-trading-up mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm text-muted">Great Progress!</span>
                    </div>
                  </div>
                </div>

                <div className="bg-surface-card-dark border border-hairline-on-dark rounded-xl p-6">
                  <div className="flex items-center mb-4">
                    <div className="flex-shrink-0 bg-surface-elevated-dark rounded-xl p-3">
                      <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-semibold text-muted uppercase tracking-wider">In Progress</p>
                      <p className="text-3xl font-bold text-on-dark font-plex">{stats.inProgress}</p>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-hairline-on-dark">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-primary rounded-full animate-pulse mr-2"></div>
                      <span className="text-sm text-muted">Keep Going!</span>
                    </div>
                  </div>
                </div>

                <div className="bg-surface-card-dark border border-hairline-on-dark rounded-xl p-6">
                  <div className="flex items-center mb-4">
                    <div className="flex-shrink-0 bg-surface-elevated-dark rounded-xl p-3">
                      <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-semibold text-muted uppercase tracking-wider">Certificates</p>
                      <p className="text-3xl font-bold text-on-dark font-plex">{stats.certificates}</p>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-hairline-on-dark">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 text-primary mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-sm text-muted">Achievement Unlocked!</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Recent Activity */}
            <section className="bg-surface-card-dark border border-hairline-on-dark rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-on-dark">Recent Activity</h2>
                <button className="text-sm text-primary hover:text-primary-active font-medium transition-colors">View All →</button>
              </div>

              {/* Loading State */}
              {loading && (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                  <p className="text-muted font-medium">Loading recent activity...</p>
                </div>
              )}

              {/* Error State */}
              {error && (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-surface-elevated-dark rounded-full mb-4">
                    <svg className="h-8 w-8 text-trading-down" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-on-dark mb-2">Error Loading Activity</h3>
                  <p className="text-muted mb-4">{error}</p>
                  <button
                    onClick={fetchDashboardData}
                    className="px-6 py-2 bg-primary text-on-primary rounded-md hover:bg-primary-active transition-colors duration-200 font-medium"
                  >
                    Try Again
                  </button>
                </div>
              )}

              {/* Activity List */}
              {!loading && !error && (
                <>
                  {recentActivity.length === 0 ? (
                    <div className="text-center py-16">
                      <div className="inline-flex items-center justify-center w-20 h-20 bg-surface-elevated-dark rounded-full mb-6">
                        <svg className="w-10 h-10 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 012 2h2A2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-on-dark mb-2">No recent activity</h3>
                      <p className="text-muted max-w-sm mx-auto">Your recent learning activities will appear here once you start taking courses and engaging with content.</p>
                      <button className="mt-6 px-6 py-2 bg-primary text-on-primary rounded-md hover:bg-primary-active transition-colors duration-200 font-medium">
                        Explore Courses
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {recentActivity.map((activity, index) => (
                        <div key={activity.id} className="bg-surface-card-dark border border-hairline-on-dark rounded-xl p-4 hover:bg-surface-elevated-dark transition-colors duration-200">
                          <div className="flex items-start">
                            <div className="flex-shrink-0">
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-surface-elevated-dark`}>
                                <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                              </div>
                            </div>
                            <div className="ml-4 flex-1">
                              <div>
                                <h4 className="text-sm font-semibold text-on-dark">{activity.title}</h4>
                                <p className="text-sm text-muted mt-1">{activity.description}</p>
                              </div>
                              <div className="flex items-center justify-between mt-3">
                                <div className="flex items-center text-xs text-muted">
                                  <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  {new Date(activity.date).toLocaleDateString()}
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                  activity.status === 'completed' ? 'text-trading-up' :
                                  activity.status === 'in_progress' ? 'text-primary' :
                                  'text-muted'
                                }`}>
                                  {activity.status === 'completed' ? 'Completed' :
                                   activity.status === 'in_progress' ? 'In Progress' : 'Not Started'}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </section>
          </div>

          {/* Right Column - Quick Actions */}
          <div className="space-y-8">
            {/* User Profile Card */}
            <section className="bg-surface-card-dark border border-hairline-on-dark rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-on-dark">Profile</h2>
                <button className="text-sm text-primary hover:text-primary-active font-medium transition-colors">Edit →</button>
              </div>
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-surface-elevated-dark rounded-full flex items-center justify-center text-primary text-xl font-bold">
                    {user?.first_name?.[0]}{user?.last_name?.[0]}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-on-dark">{user?.first_name} {user?.last_name}</h3>
                    <p className="text-sm text-muted">{user?.email}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-surface-elevated-dark rounded-lg">
                    <span className="text-sm text-muted">Role</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      isStudent ? 'bg-primary text-on-primary' :
                      isInstructor ? 'border border-hairline-on-dark text-on-dark' :
                      'border border-hairline-on-dark text-muted'
                    }`}>
                      {isStudent ? 'Student' : isInstructor ? 'Instructor' : 'User'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-surface-elevated-dark rounded-lg">
                    <span className="text-sm text-muted">Member Since</span>
                    <span className="text-sm font-medium text-on-dark">{new Date(user?.date_joined).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Quick Actions */}
            <section className="bg-surface-card-dark border border-hairline-on-dark rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-on-dark">Quick Actions</h2>
                <div className="w-2 h-2 bg-trading-up rounded-full animate-pulse"></div>
              </div>
              <div className="space-y-3">
                {isInstructor && (
                  <button
                    onClick={() => window.location.href = '/course/create'}
                    className="group w-full flex items-center px-4 py-3 bg-primary text-on-primary font-medium rounded-md hover:bg-primary-active transition-colors duration-200"
                  >
                    <svg className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Create Course
                  </button>
                )}
                <button className="group w-full flex items-center px-4 py-3 bg-primary text-on-primary font-medium rounded-md hover:bg-primary-active transition-colors duration-200">
                  <svg className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Browse Courses
                </button>
                <button className="group w-full flex items-center px-4 py-3 bg-primary text-on-primary font-medium rounded-md hover:bg-primary-active transition-colors duration-200">
                  <svg className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                  My Certificates
                </button>
                <button className="w-full flex items-center px-4 py-3 border border-hairline-on-dark rounded-md text-on-dark hover:bg-surface-elevated-dark transition-colors duration-200">
                  <svg className="h-5 w-5 mr-3 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Edit Profile
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default Dashboard;
