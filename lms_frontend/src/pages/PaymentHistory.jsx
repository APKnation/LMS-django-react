import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { paymentsAPI } from '../services/api';
import Sidebar from '../components/common/Sidebar';

const PaymentHistory = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await paymentsAPI.getMyOrders();
      setOrders(response.data || []);
    } catch (err) {
      setError('Failed to load payment history');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-trading-up';
      case 'pending':
        return 'text-primary';
      case 'failed':
        return 'text-trading-down';
      case 'refunded':
        return 'text-muted';
      default:
        return 'text-muted';
    }
  };

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    return order.status === filter;
  });

  const totalSpent = orders
    .filter(order => order.status === 'completed')
    .reduce((sum, order) => sum + parseFloat(order.final_price), 0);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-canvas-dark text-on-dark">
        <Sidebar />
        <div className="flex-1 lg:ml-64">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted">Loading payment history...</p>
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
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-on-dark">Payment History</h1>
            <p className="text-muted mt-2">View all your course purchases</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {error && (
            <div className="bg-surface-card-dark border border-hairline-on-dark text-trading-down px-6 py-4 rounded-lg mb-6">
              {error}
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            <div className="bg-surface-card-dark border border-hairline-on-dark rounded-xl p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-surface-elevated-dark rounded-lg p-3">
                  <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-5">
                  <p className="text-sm font-medium text-muted">Total Spent</p>
                  <p className="text-2xl font-bold text-on-dark font-plex">TZS {totalSpent.toFixed(2)}</p>
                </div>
              </div>
            </div>

            <div className="bg-surface-card-dark border border-hairline-on-dark rounded-xl p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-surface-elevated-dark rounded-lg p-3">
                  <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-5">
                  <p className="text-sm font-medium text-muted">Completed Orders</p>
                  <p className="text-2xl font-bold text-on-dark font-plex">
                    {orders.filter(o => o.status === 'completed').length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-surface-card-dark border border-hairline-on-dark rounded-xl p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-surface-elevated-dark rounded-lg p-3">
                  <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <div className="ml-5">
                  <p className="text-sm font-medium text-muted">Total Orders</p>
                  <p className="text-2xl font-bold text-on-dark font-plex">{orders.length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filter */}
          <div className="bg-surface-card-dark border border-hairline-on-dark rounded-xl p-6 mb-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-on-dark">Order History</h2>
              <div className="flex space-x-2">
                {['all', 'completed', 'pending', 'failed'].map(status => (
                  <button
                    key={status}
                    onClick={() => setFilter(status)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      filter === status
                        ? 'bg-primary text-on-primary'
                        : 'bg-surface-elevated-dark text-on-dark hover:bg-surface-card-dark'
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Orders List */}
          <div className="bg-surface-card-dark border border-hairline-on-dark rounded-xl">
            {filteredOrders.length === 0 ? (
              <div className="p-12 text-center">
                <svg className="mx-auto h-16 w-16 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <h3 className="mt-4 text-lg font-medium text-on-dark">No orders found</h3>
                <p className="mt-2 text-muted">Start learning by enrolling in courses</p>
              </div>
            ) : (
              <div className="divide-y divide-hairline-on-dark">
                {filteredOrders.map((order) => (
                  <div key={order.id} className="p-6 hover:bg-surface-elevated-dark transition-colors duration-200">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4">
                          <h3 className="text-lg font-semibold text-on-dark">
                            {order.course_details?.title || 'Course'}
                          </h3>
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </div>
                        <div className="mt-2 flex items-center space-x-6 text-sm text-muted">
                          <span>Order ID: #{order.id}</span>
                          <span>Date: {new Date(order.created_at).toLocaleDateString()}</span>
                          {order.completed_at && (
                            <span>Completed: {new Date(order.completed_at).toLocaleDateString()}</span>
                          )}
                        </div>
                        {order.coupon && (
                          <div className="mt-2 text-sm text-trading-up">
                            Coupon Applied: {order.coupon_code} (-TZS {order.discount_amount})
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-on-dark font-plex">TZS {order.final_price}</p>
                        {order.discount_amount > 0 && (
                          <p className="text-sm text-muted line-through">TZS {order.original_price}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentHistory;
