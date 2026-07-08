import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { paymentsAPI } from '../services/api';
import Sidebar from '../components/common/Sidebar';

const RevenueAnalytics = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user?.is_instructor) {
      fetchAnalytics();
    }
  }, [user]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await paymentsAPI.getDashboardAnalytics();
      setAnalytics(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load analytics data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!user?.is_instructor) {
    return (
      <div className="flex min-h-screen bg-canvas-dark">
        <Sidebar />
        <div className="flex-1 lg:ml-64">
          <div className="flex items-center justify-center py-12">
            <p className="text-muted">Access denied. Only instructors can view analytics.</p>
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
          <h1 className="text-display-sm font-bold text-on-dark mb-8">Revenue Analytics</h1>

          {error && (
            <div className="bg-trading-down/10 border border-trading-down/40 text-trading-down px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : analytics ? (
            <div className="space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-surface-card-dark rounded-xl p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-surface-elevated-dark rounded-lg p-3">
                      <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="ml-5">
                      <p className="text-caption text-muted">Total Revenue</p>
                      <p className="text-2xl font-bold text-on-dark font-plex">TZS {analytics.total_revenue || '0.00'}</p>
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
                                          <p className="text-caption text-muted">Total Sales</p>
                                          <p className="text-2xl font-bold text-on-dark font-plex">{analytics.total_sales || 0}</p>
                  </div>
                </div>
              </div>
                <div className="bg-surface-card-dark rounded-xl p-6">
                <div className="flex items-center">
                    <div className="flex-shrink-0 bg-surface-elevated-dark rounded-lg p-3">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <div className="ml-5">
                                          <p className="text-caption text-muted">Total Students</p>
                                          <p className="text-2xl font-bold text-on-dark font-plex">{analytics.total_students || 0}</p>
                  </div>
                </div>
              </div>
                <div className="bg-surface-card-dark rounded-xl p-6">
                <div className="flex items-center">
                    <div className="flex-shrink-0 bg-surface-elevated-dark rounded-lg p-3">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div className="ml-5">
                                          <p className="text-caption text-muted">Avg. Completion</p>
                                          <p className="text-2xl font-bold text-on-dark font-plex">{analytics.avg_completion || 0}%</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Course Revenue */}
            <div className="bg-surface-card-dark rounded-xl p-6">
              <h2 className="text-title-md text-on-dark mb-4">Revenue by Course</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-hairline-on-dark">
                  <thead className="bg-surface-elevated-dark">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">Course</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">Sales</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">Revenue</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">Completion Rate</th>
                    </tr>
                  </thead>
                  <tbody className="bg-surface-card-dark divide-y divide-hairline-on-dark">
                    {analytics.course_revenue && analytics.course_revenue.length > 0 ? (
                      analytics.course_revenue.map((course, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-on-dark">{course.title}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-plex text-muted">{course.sales}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-on-dark font-plex">TZS {course.revenue}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-plex text-muted">{course.completion_rate}%</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="px-6 py-12 text-center text-muted">
                          No revenue data available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-muted">
            No analytics data available
          </div>
        )}
        </div>
      </div>
    </div>
  );
};

export default RevenueAnalytics;
