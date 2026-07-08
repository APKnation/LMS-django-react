import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { paymentsAPI } from '../services/api';
import Sidebar from '../components/common/Sidebar';

const Coupons = () => {
  const { user } = useAuth();
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    discount_type: 'percentage',
    discount_value: '',
    max_uses: '',
    valid_from: '',
    valid_until: '',
    is_active: true
  });

  useEffect(() => {
    if (user?.is_staff || user?.is_instructor) {
      fetchCoupons();
    }
  }, [user]);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const response = await paymentsAPI.getCoupons();
      setCoupons(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load coupons');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    try {
      await paymentsAPI.createCoupon(formData);
      setShowCreateForm(false);
      setFormData({
        code: '',
        discount_type: 'percentage',
        discount_value: '',
        max_uses: '',
        valid_from: '',
        valid_until: '',
        is_active: true
      });
      fetchCoupons();
    } catch (err) {
      setError('Failed to create coupon');
      console.error(err);
    }
  };

  const handleDeleteCoupon = async (id) => {
    try {
      await paymentsAPI.deleteCoupon(id);
      fetchCoupons();
    } catch (err) {
      setError('Failed to delete coupon');
      console.error(err);
    }
  };

  if (!user?.is_instructor && !user?.is_staff) {
    return (
      <div className="flex min-h-screen bg-canvas-dark">
        <Sidebar />
        <div className="flex-1 lg:ml-64">
          <div className="flex items-center justify-center py-12">
            <p className="text-muted">Access denied. Only instructors and staff can manage coupons.</p>
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
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-on-dark">Coupons</h1>
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="px-4 py-2 bg-primary text-on-primary rounded-lg hover:bg-primary-active"
            >
              {showCreateForm ? 'Cancel' : 'Create Coupon'}
            </button>
          </div>

          {error && (
            <div className="bg-surface-card-dark border border-hairline-on-dark text-trading-down px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          {showCreateForm && (
            <div className="bg-surface-card-dark rounded-xl p-6 mb-6 border border-hairline-on-dark">
              <h2 className="text-xl font-semibold text-on-dark mb-4">Create New Coupon</h2>
              <form onSubmit={handleCreateCoupon} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-body-on-dark mb-2">Code</label>
                    <input
                      type="text"
                      value={formData.code}
                      onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                      className="w-full px-4 py-2 border border-hairline-on-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-info bg-surface-card-dark text-on-dark"
                      required
                    />
                  </div>
                  <div>
                  <label className="block text-sm font-medium text-body-on-dark mb-2">Discount Type</label>
                  <select
                    value={formData.discount_type}
                    onChange={(e) => setFormData({...formData, discount_type: e.target.value})}
                    className="w-full px-4 py-2 border border-hairline-on-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-info bg-surface-card-dark text-on-dark"
                  >
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed Amount (TZS)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-body-on-dark mb-2">Discount Value</label>
                  <input
                    type="number"
                    value={formData.discount_value}
                    onChange={(e) => setFormData({...formData, discount_value: e.target.value})}
                    className="w-full px-4 py-2 border border-hairline-on-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-info bg-surface-card-dark text-on-dark"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-body-on-dark mb-2">Max Uses</label>
                  <input
                    type="number"
                    value={formData.max_uses}
                    onChange={(e) => setFormData({...formData, max_uses: e.target.value})}
                    className="w-full px-4 py-2 border border-hairline-on-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-info bg-surface-card-dark text-on-dark"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-body-on-dark mb-2">Valid From</label>
                  <input
                    type="date"
                    value={formData.valid_from}
                    onChange={(e) => setFormData({...formData, valid_from: e.target.value})}
                    className="w-full px-4 py-2 border border-hairline-on-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-info bg-surface-card-dark text-on-dark"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-body-on-dark mb-2">Valid Until</label>
                  <input
                    type="date"
                    value={formData.valid_until}
                    onChange={(e) => setFormData({...formData, valid_until: e.target.value})}
                    className="w-full px-4 py-2 border border-hairline-on-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-info bg-surface-card-dark text-on-dark"
                    required
                  />
                </div>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                  className="mr-2"
                />
                <label htmlFor="is_active" className="text-sm text-muted">Active</label>
              </div>
              <button
                type="submit"
                className="w-full px-4 py-2 bg-primary text-on-primary rounded-lg hover:bg-primary-active"
              >
                Create Coupon
              </button>
            </form>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-info"></div>
          </div>
        ) : (
          <div className="bg-surface-card-dark rounded-xl border border-hairline-on-dark">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-hairline-on-dark">
                <thead className="bg-surface-elevated-dark">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">Code</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">Discount</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">Uses</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">Valid Period</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-hairline-on-dark">
                  {coupons.map((coupon) => (
                    <tr key={coupon.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-semibold text-info font-mono">{coupon.code}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-muted font-mono">
                        {coupon.discount_type === 'percentage' 
                          ? `${coupon.discount_value}%`
                          : `TZS ${coupon.discount_value}`}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-muted font-mono">
                        {coupon.times_used}/{coupon.max_uses || '∞'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted">
                        {new Date(coupon.valid_from).toLocaleDateString()} - {new Date(coupon.valid_until).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          coupon.is_active ? 'text-trading-up' : 'text-trading-down'
                        }`}>
                          {coupon.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleDeleteCoupon(coupon.id)}
                          className="text-trading-down hover:text-trading-down"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
};

export default Coupons;