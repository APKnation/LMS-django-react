import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { categoriesAPI } from '../services/api';
import Sidebar from '../components/common/Sidebar';

const AdminCategories = () => {
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (user?.is_staff) {
      fetchCategories();
    }
  }, [user]);

  useEffect(() => {
    let filtered = categories;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(c =>
        c.name?.toLowerCase().includes(term) ||
        c.description?.toLowerCase().includes(term)
      );
    }

    setFilteredCategories(filtered);
  }, [categories, searchTerm]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await categoriesAPI.getAll();
      setCategories(response.data || []);
      setError(null);
    } catch (err) {
      setError('Failed to load categories');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    try {
      await categoriesAPI.create(formData);
      setShowCreateForm(false);
      setFormData({ name: '', description: '' });
      await fetchCategories();
    } catch (err) {
      console.error('Failed to create category:', err);
      setError('Failed to create category');
    }
  };

  const handleUpdateCategory = async (categoryId, data) => {
    try {
      await categoriesAPI.update(categoryId, data);
      await fetchCategories();
    } catch (err) {
      console.error('Failed to update category:', err);
      setError('Failed to update category');
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (!window.confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
      return;
    }
    try {
      await categoriesAPI.adminDeleteCategory(categoryId);
      await fetchCategories();
    } catch (err) {
      console.error('Failed to delete category:', err);
      setError('Failed to delete category');
    }
  };

  if (!user?.is_staff) {
    return (
      <div className="flex min-h-screen bg-canvas-dark">
        <Sidebar />
        <div className="flex-1 lg:ml-64">
          <div className="flex items-center justify-center py-12">
            <p className="text-muted">Access denied. Admin only.</p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-screen bg-canvas-dark">
        <Sidebar />
        <div className="flex-1 lg:ml-64">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-info border-t-transparent mx-auto"></div>
              <p className="mt-6 text-lg text-muted font-medium">Loading categories...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-canvas-dark">
      <Sidebar />
      <div className="flex-1 lg:ml-64">
        <div className="bg-surface-elevated-dark text-on-dark border-b border-hairline-on-dark">
          <div className="max-w-7xl mx-auto px-6 py-10 flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-extrabold mb-2">Admin Category Management</h1>
              <p className="text-muted text-lg">Manage course categories</p>
            </div>
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="bg-primary text-on-primary px-6 py-3 rounded-xl font-semibold"
            >
              {showCreateForm ? 'Cancel' : 'Create Category'}
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-10">
          {error && (
            <div className="bg-surface-card-dark border-l-4 border-trading-down text-trading-down px-6 py-4 rounded-r-lg mb-8">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            </div>
          )}

          {showCreateForm && (
            <div className="bg-surface-card-dark rounded-xl p-6 mb-8 border border-hairline-on-dark">
              <h2 className="text-xl font-bold text-on-dark mb-4">Create New Category</h2>
              <form onSubmit={handleCreateCategory}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-body-on-dark mb-2">Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2 border border-hairline-on-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-info bg-surface-card-dark text-on-dark"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-body-on-dark mb-2">Description</label>
                    <input
                      type="text"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-4 py-2 border border-hairline-on-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-info bg-surface-card-dark text-on-dark"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <button
                    type="submit"
                    className="bg-trading-down text-on-primary px-6 py-2 rounded-lg font-semibold"
                  >
                    Create Category
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="bg-surface-card-dark rounded-xl overflow-hidden border border-hairline-on-dark">
            <div className="p-6 border-b border-hairline-on-dark">
              <h2 className="text-2xl font-bold text-on-dark flex items-center mb-4">
                <svg className="w-8 h-8 mr-3 text-info" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                All Categories
              </h2>
              <input
                type="text"
                placeholder="Search categories by name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-hairline-on-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-info bg-surface-card-dark text-on-dark mb-3"
              />
              <p className="text-muted mt-3">{filteredCategories.length} of {categories.length} categories shown</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-surface-elevated-dark">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-muted uppercase tracking-wider">Name</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-muted uppercase tracking-wider">Description</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-muted uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-hairline-on-dark">
                  {filteredCategories.map((category) => (
                    <tr key={category.id} className="hover:bg-surface-elevated-dark">
                      <td className="px-6 py-4">
                        <input
                          type="text"
                          defaultValue={category.name}
                          onBlur={(e) => handleUpdateCategory(category.id, { name: e.target.value })}
                          className="font-semibold text-on-dark bg-transparent border-b border-transparent hover:border-hairline-on-dark focus:border-info focus:outline-none w-full"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="text"
                          defaultValue={category.description || ''}
                          onBlur={(e) => handleUpdateCategory(category.id, { description: e.target.value })}
                          className="text-muted bg-transparent border-b border-transparent hover:border-hairline-on-dark focus:border-info focus:outline-none w-full"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleDeleteCategory(category.id)}
                          className="bg-trading-down text-on-primary px-3 py-1.5 rounded-lg text-xs font-semibold"
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
        </div>
      </div>
    </div>
  );
};

export default AdminCategories;