import React, { useState, useEffect } from 'react';
import { categoriesAPI } from '../services/api';

const Categories = ({ onCategorySelect, selectedCategory }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await categoriesAPI.getAll();
      setCategories(response.data);
      setError(null);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      setError('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-4">
        <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
        <span className="ml-2 text-muted">Loading categories...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-4">
        <p className="text-trading-down">{error}</p>
        <button
          onClick={fetchCategories}
          className="mt-2 text-primary hover:text-primary-active text-sm"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      <h3 className="text-sm font-semibold text-on-dark mb-2">Categories</h3>

      {/* All Categories Option */}
      <button
        onClick={() => onCategorySelect(null)}
        className={`w-full text-left px-3 py-1.5 rounded-lg transition-colors text-xs sm:text-sm ${
          selectedCategory === null
            ? 'bg-primary text-on-primary'
            : 'bg-surface-card-dark text-body-on-dark hover:bg-surface-elevated-dark'
        }`}
      >
        <div className="flex items-center">
          <svg className="w-3.5 h-3.5 mr-1.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <span className="truncate">All Categories</span>
        </div>
      </button>

      {/* Category List */}
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onCategorySelect(category)}
          className={`w-full text-left px-3 py-1.5 rounded-lg transition-colors text-xs sm:text-sm ${
            selectedCategory?.id === category.id
              ? 'bg-primary text-on-primary'
              : 'bg-surface-card-dark text-body-on-dark hover:bg-surface-elevated-dark'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center min-w-0">
              <svg className="w-3.5 h-3.5 mr-1.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              <span className="font-medium truncate">{category.name}</span>
            </div>
            {selectedCategory?.id === category.id && (
              <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
          {category.description && (
            <p className={`text-xs mt-0.5 ml-4 sm:ml-5 ${
              selectedCategory?.id === category.id ? 'text-primary' : 'text-muted'
            }`}>
              {category.description}
            </p>
          )}
        </button>
      ))}

      {categories.length === 0 && (
        <div className="text-center py-4 text-muted">
          <svg className="w-8 h-8 mx-auto mb-1 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          <p className="text-xs">No categories available</p>
        </div>
      )}
    </div>
  );
};

export default Categories;
