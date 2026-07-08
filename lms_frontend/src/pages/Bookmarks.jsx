import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { progressAPI } from '../services/api';
import Sidebar from '../components/common/Sidebar';

const Bookmarks = () => {
  const { user } = useAuth();
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const fetchBookmarks = async () => {
    try {
      setLoading(true);
      const response = await progressAPI.getMyBookmarks();
      setBookmarks(response.data || []);
    } catch (err) {
      setError('Failed to load bookmarks');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveBookmark = async (bookmarkId) => {
    try {
      await progressAPI.removeBookmark(bookmarkId);
      setBookmarks(bookmarks.filter(b => b.id !== bookmarkId));
    } catch (err) {
      console.error('Failed to remove bookmark:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-canvas-dark text-on-dark">
        <Sidebar />
        <div className="flex-1 lg:ml-64">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted">Loading bookmarks...</p>
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
            <h1 className="text-3xl font-bold text-on-dark">My Bookmarks</h1>
            <p className="text-muted mt-2">Your saved lessons for quick access</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {error && (
            <div className="bg-surface-card-dark border border-hairline-on-dark text-trading-down px-6 py-4 rounded-lg mb-6">
              {error}
            </div>
          )}

          {bookmarks.length === 0 ? (
            <div className="bg-surface-card-dark border border-hairline-on-dark rounded-lg p-12 text-center">
              <svg className="mx-auto h-16 w-16 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-on-dark">No bookmarks yet</h3>
              <p className="mt-2 text-muted">Bookmark lessons you want to revisit later</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bookmarks.map((bookmark) => (
                <div key={bookmark.id} className="bg-surface-card-dark border border-hairline-on-dark rounded-lg hover:bg-surface-elevated-dark transition-colors duration-200">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-on-dark mb-1">
                          {bookmark.lesson_details?.title || 'Lesson'}
                        </h3>
                        <p className="text-sm text-muted">
                          {bookmark.lesson_details?.course_title || 'Course'}
                        </p>
                      </div>
                      <button
                        onClick={() => handleRemoveBookmark(bookmark.id)}
                        className="text-muted hover:text-trading-down transition-colors"
                        title="Remove bookmark"
                      >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    {bookmark.note && (
                      <div className="bg-surface-elevated-dark p-3 rounded-lg mb-4">
                        <p className="text-sm text-body-on-dark">{bookmark.note}</p>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-xs text-muted">
                      <span>Added {new Date(bookmark.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        )}
        </div>
      </div>
    </div>
  );
};

export default Bookmarks;
