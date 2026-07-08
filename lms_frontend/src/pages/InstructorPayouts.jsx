import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { paymentsAPI } from '../services/api';
import Sidebar from '../components/common/Sidebar';

const InstructorPayouts = () => {
  const { user } = useAuth();
  const [payouts, setPayouts] = useState([]);
  const [revenueSummary, setRevenueSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user?.is_instructor) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [payoutsRes, revenueRes] = await Promise.all([
        paymentsAPI.getMyPayouts(),
        paymentsAPI.getRevenueSummary()
      ]);
      setPayouts(payoutsRes.data);
      setRevenueSummary(revenueRes.data);
      setError(null);
    } catch (err) {
      setError('Failed to load payout data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'bg-trading-up/10 text-trading-up';
      case 'pending': return 'bg-primary/10 text-primary';
      case 'failed': return 'bg-trading-down/10 text-trading-down';
      default: return 'bg-muted/10 text-muted';
    }
  };

  if (!user?.is_instructor) {
    return (
      <div className="flex min-h-screen bg-canvas-dark">
        <Sidebar />
        <div className="flex-1 lg:ml-64">
          <div className="flex items-center justify-center py-12">
            <p className="text-muted">Access denied. Only instructors can view payouts.</p>
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
          <h1 className="text-display-sm font-bold text-on-dark mb-8">Instructor Payouts</h1>

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
              {/* Revenue Summary */}
              {revenueSummary && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-indigo-500 rounded-lg p-3">
                        <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="ml-5">
                        <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                        <p className="text-2xl font-bold text-gray-900">TZS {revenueSummary.total_revenue || '0.00'}</p>
                      </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-green-500 rounded-lg p-3">
                      <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="ml-5">
                      <p className="text-sm font-medium text-gray-500">Total Payouts</p>
                      <p className="text-2xl font-bold text-gray-900">TZS {revenueSummary.total_payouts || '0.00'}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-blue-500 rounded-lg p-3">
                      <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="ml-5">
                      <p className="text-sm font-medium text-gray-500">Pending Payouts</p>
                      <p className="text-2xl font-bold text-gray-900">TZS {revenueSummary.pending_payouts || '0.00'}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Payouts Table */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Payout History</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Period</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {payouts.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                          No payouts found
                        </td>
                      </tr>
                    ) : (
                      payouts.map((payout) => (
                        <tr key={payout.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            #{payout.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            TZS {payout.amount}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {payout.course_title || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(payout.period_start).toLocaleDateString()} - {new Date(payout.period_end).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(payout.status)}`}>
                              {payout.status.charAt(0).toUpperCase() + payout.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(payout.created_at).toLocaleDateString()}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
        </div>
      </div>
    </div>
  );
};

export default InstructorPayouts;
