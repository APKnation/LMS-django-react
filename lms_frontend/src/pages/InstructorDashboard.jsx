import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { coursesAPI, paymentsAPI } from '../services/api';
import Sidebar from '../components/common/Sidebar';
import { useNavigate } from 'react-router-dom';

const InstructorDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    totalRevenue: 0,
    activeCourses: 0
  });
  const [recentCourses, setRecentCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user?.is_instructor) {
      navigate('/dashboard');
      return;
    }
    fetchDashboardData();
  }, [user, navigate]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [coursesRes, revenueRes] = await Promise.all([
        coursesAPI.getMyCourses(),
        paymentsAPI.getDashboardAnalytics()
      ]);
      
      const courses = coursesRes.data;
      const analytics = revenueRes.data;

      setStats({
        totalCourses: courses.length,
        totalStudents: analytics?.total_students || 0,
        totalRevenue: analytics?.total_revenue || 0,
        activeCourses: courses.filter(c => c.is_published).length
      });

      setRecentCourses(courses.slice(0, 5));
      setError(null);
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      title: 'Create New Course',
      description: 'Start creating a new course',
      path: '/course/create'
    },
    {
      title: 'Manage Courses',
      description: 'View and edit your courses',
      path: '/instructor-courses'
    },
    {
      title: 'Revenue Analytics',
      description: 'View your revenue and sales',
      path: '/revenue-analytics'
    },
    {
      title: 'Student Management',
      description: 'Manage enrolled students',
      path: '/students'
    },
    {
      title: 'Quiz Management',
      description: 'Create and manage quizzes',
      path: '/quiz-management'
    },
    {
      title: 'Assignments',
      description: 'Manage course assignments',
      path: '/assignment-management'
    },
    {
      title: 'Announcements',
      description: 'Send course announcements',
      path: '/announcements'
    },
    {
      title: 'Coupons',
      description: 'Manage discount coupons',
      path: '/coupons'
    }
  ];

  if (!user?.is_instructor) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-canvas-dark">
      <Sidebar />
      <div className="flex-1 lg:ml-64">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-display-sm font-bold text-on-dark">Instructor Dashboard</h1>
            <p className="text-body-on-dark mt-2">Welcome back, {user?.username}!</p>
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
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-surface-card-dark rounded-xl p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-surface-elevated-dark rounded-lg p-3">
                    <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <div className="ml-5">
                    <p className="text-caption text-muted">Total Courses</p>
                    <p className="text-2xl font-bold text-on-dark font-plex">{stats.totalCourses}</p>
                  </div>
                </div>
              </div>
              <div className="bg-surface-card-dark rounded-xl p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-surface-elevated-dark rounded-lg p-3">
                    <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <div className="ml-5">
                    <p className="text-caption text-muted">Total Students</p>
                    <p className="text-2xl font-bold text-on-dark font-plex">{stats.totalStudents}</p>
                  </div>
                </div>
              </div>
              <div className="bg-surface-card-dark rounded-xl p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-surface-elevated-dark rounded-lg p-3">
                    <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-5">
                    <p className="text-caption text-muted">Total Revenue</p>
                    <p className="text-2xl font-bold text-on-dark font-plex">TZS {stats.totalRevenue}</p>
                  </div>
                </div>
              </div>
              <div className="bg-surface-card-dark rounded-xl p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-surface-elevated-dark rounded-lg p-3">
                    <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-5">
                    <p className="text-caption text-muted">Active Courses</p>
                    <p className="text-2xl font-bold text-on-dark font-plex">{stats.activeCourses}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-surface-card-dark rounded-xl p-6 mb-8">
              <h2 className="text-title-md text-on-dark mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {quickActions.map((action) => (
                  <button
                    key={action.path}
                    onClick={() => navigate(action.path)}
                    className="p-4 border border-hairline-on-dark rounded-lg hover:bg-surface-elevated-dark transition-colors text-left"
                  >
                    <h3 className="font-semibold text-on-dark">{action.title}</h3>
                    <p className="text-body-md text-muted">{action.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Recent Courses */}
            <div className="bg-surface-card-dark rounded-xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-title-md text-on-dark">Recent Courses</h2>
                <button
                  onClick={() => navigate('/courses')}
                  className="text-primary hover:text-primary-active text-sm font-medium"
                >
                  View All
                </button>
              </div>
              {recentCourses.length === 0 ? (
                <p className="text-muted text-center py-8">No courses created yet</p>
              ) : (
                <div className="space-y-3">
                  {recentCourses.map((course) => (
                    <div
                      key={course.id}
                      className="flex items-center justify-between p-4 border border-hairline-on-dark rounded-lg hover:bg-surface-elevated-dark transition-colors"
                    >
                      <div className="flex-1">
                        <h3 className="font-semibold text-on-dark">{course.title}</h3>
                        <p className="text-body-md text-muted">{course.description?.substring(0, 100)}...</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          course.is_published ? 'bg-trading-up/10 text-trading-up' : 'bg-muted/10 text-muted'
                        }`}>
                          {course.is_published ? 'Published' : 'Draft'}
                        </span>
                        <button
                          onClick={() => navigate(`/courses/${course.id}`)}
                          className="text-primary hover:text-primary-active"
                        >
                          View
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboard;
