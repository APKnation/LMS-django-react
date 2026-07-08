import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { progressAPI } from '../services/api';
import Sidebar from '../components/common/Sidebar';

const Notes = () => {
  const { user } = useAuth();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingNote, setEditingNote] = useState(null);
  const [editContent, setEditContent] = useState('');

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const response = await progressAPI.getMyNotes();
      setNotes(response.data || []);
    } catch (err) {
      setError('Failed to load notes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNote = async (noteId) => {
    try {
      await progressAPI.deleteNote(noteId);
      setNotes(notes.filter(n => n.id !== noteId));
    } catch (err) {
      console.error('Failed to delete note:', err);
    }
  };

  const handleEditNote = (note) => {
    setEditingNote(note.id);
    setEditContent(note.content);
  };

  const handleSaveEdit = async () => {
    try {
      await progressAPI.updateNote(editingNote, { content: editContent });
      setNotes(notes.map(n => n.id === editingNote ? { ...n, content: editContent } : n));
      setEditingNote(null);
      setEditContent('');
    } catch (err) {
      console.error('Failed to update note:', err);
    }
  };

  const handleCancelEdit = () => {
    setEditingNote(null);
    setEditContent('');
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-canvas-dark text-on-dark">
        <Sidebar />
        <div className="flex-1 lg:ml-64">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted">Loading notes...</p>
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
            <h1 className="text-3xl font-bold text-on-dark">My Notes</h1>
            <p className="text-muted mt-2">Your lesson notes and annotations</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {error && (
            <div className="bg-surface-card-dark border border-hairline-on-dark text-trading-down px-6 py-4 rounded-lg mb-6">
              {error}
            </div>
          )}

          {notes.length === 0 ? (
            <div className="bg-surface-card-dark border border-hairline-on-dark rounded-lg p-12 text-center">
              <svg className="mx-auto h-16 w-16 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-on-dark">No notes yet</h3>
              <p className="mt-2 text-muted">Take notes while watching lessons to track your learning</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {notes.map((note) => (
                <div key={note.id} className="bg-surface-card-dark border border-hairline-on-dark rounded-lg hover:bg-surface-elevated-dark transition-colors duration-200">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-semibold text-on-dark">
                        {note.lesson_details?.title || 'Lesson'}
                      </h3>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditNote(note)}
                          className="text-muted hover:text-primary transition-colors"
                          title="Edit note"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteNote(note.id)}
                          className="text-muted hover:text-trading-down transition-colors"
                          title="Delete note"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    <p className="text-sm text-muted mb-3">
                      {note.lesson_details?.course_title || 'Course'}
                    </p>

                    {editingNote === note.id ? (
                      <div className="space-y-3">
                        <textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          className="w-full p-3 bg-surface-card-dark text-on-dark border border-hairline-on-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-info text-sm"
                          rows={4}
                        />
                        <div className="flex space-x-2">
                          <button
                            onClick={handleSaveEdit}
                            className="px-3 py-1 bg-primary text-on-primary text-sm rounded-md hover:bg-primary-active transition-colors duration-200"
                          >
                            Save
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="px-3 py-1 bg-surface-elevated-dark text-on-dark text-sm rounded-md border border-hairline-on-dark hover:bg-surface-card-dark transition-colors duration-200"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-surface-elevated-dark p-3 rounded-lg">
                        <p className="text-sm text-body-on-dark whitespace-pre-wrap">{note.content}</p>
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-4 text-xs text-muted">
                      <span>
                        {note.timestamp > 0 && `@ ${Math.floor(note.timestamp / 60)}:${(note.timestamp % 60).toString().padStart(2, '0')}`}
                      </span>
                      <span>{new Date(note.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notes;
