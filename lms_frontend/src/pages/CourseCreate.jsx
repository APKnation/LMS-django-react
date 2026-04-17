import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { coursesAPI, categoriesAPI } from '../services/api';
import Sidebar from '../components/common/Sidebar';

const CourseCreate = () => {
  const { user, isInstructor } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    thumbnail: null,
    difficulty: 'beginner',
    status: 'draft',
    is_free: true,
    price: '0.00'
  });
  
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);

  const difficulties = ['beginner', 'intermediate', 'advanced'];
  const statuses = ['draft', 'published'];

  React.useEffect(() => {
    fetchCategories();
    // Check if user is instructor
    if (!isInstructor) {
      navigate('/courses');
    }
  }, [isInstructor, navigate]);

  const fetchCategories = async () => {
    try {
      const response = await categoriesAPI.getAll();
      setCategories(response.data || []);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    
    if (type === 'file') {
      setFormData(prev => ({ ...prev, [name]: files[0] }));
      if (name === 'thumbnail' && files[0]) {
        setThumbnailPreview(URL.createObjectURL(files[0]));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title.trim()) {
      setError('Course title is required');
      return;
    }
    
    if (!formData.description.trim()) {
      setError('Course description is required');
      return;
    }
    
    if (!formData.is_free && (!formData.price || parseFloat(formData.price) <= 0)) {
      setError('Price must be greater than 0 for paid courses');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('difficulty', formData.difficulty);
      data.append('status', formData.status);
      data.append('is_free', formData.is_free);
      data.append('price', formData.is_free ? '0.00' : formData.price);
      
      if (formData.category) {
        data.append('category', formData.category);
      }
      
      if (formData.thumbnail) {
        data.append('thumbnail', formData.thumbnail);
      }
      
      const response = await coursesAPI.create(data);
      alert('Course created successfully!');
      navigate('/courses');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create course. Please try again.');
      console.error('Failed to create course:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/courses');
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-64">
        {/* Header */}
        <div className="bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">Create New Course</h1>
              <p className="text-purple-200 text-lg">Share your knowledge and inspire learners</p>
              <div className="mt-6 inline-flex items-center px-4 py-2 bg-white/20 rounded-full backdrop-blur-sm">
                <svg className="w-5 h-5 mr-2 text-purple-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332-.477 4.5-1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <span className="text-purple-100 font-medium">Instructor Portal</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-2xl shadow-xl p-8">
          {error && (
            <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl mb-6 flex items-center">
              <svg className="w-5 h-5 mr-3 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="font-semibold">Error</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Course Title */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <label className="block text-sm font-semibold text-gray-900 mb-3 flex items-center">
                <svg className="w-4 h-4 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2 2v5a2 2 0 002 2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707L19.586 19H2a1 1 0 01-1-1v-5a1 1 0 011-1h7z" />
                </svg>
                Course Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter an engaging course title"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                required
              />
            </div>

            {/* Course Description */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <label className="block text-sm font-semibold text-gray-900 mb-3 flex items-center">
                <svg className="w-4 h-4 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2 2v5a2 2 0 002 2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707L19.586 19H2a1 1 0 01-1-1v-5a1 1 0 011-1h7z" />
                </svg>
                Course Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe what students will learn and the course objectives..."
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 resize-none"
                required
              />
            </div>

            {/* Category */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <label className="block text-sm font-semibold text-gray-900 mb-3 flex items-center">
                <svg className="w-4 h-4 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h10M7 12h10m-7 5h10M7 17h10M3 21a1 1 0 01-1-1h18a1 1 0 01-1 1v-7a1 1 0 011-1H4a1 1 0 01-1 1v7a1 1 0 011 1h18z" />
                </svg>
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              >
                <option value="">Select a category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Difficulty */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <label className="block text-sm font-semibold text-gray-900 mb-3 flex items-center">
                <svg className="w-4 h-4 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l4-4m0 0l4 4m-4-4l4 4" />
                </svg>
                Difficulty Level
              </label>
              <select
                name="difficulty"
                value={formData.difficulty}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              >
                {difficulties.map(diff => (
                  <option key={diff} value={diff} className={diff === formData.difficulty ? 'bg-indigo-50 text-indigo-700' : ''}>
                    {diff.charAt(0).toUpperCase() + diff.slice(1)}
                  </option>
                ))}
              </select>
              <p className="mt-2 text-xs text-gray-500">Select the appropriate difficulty level for your target audience</p>
            </div>

            {/* Status */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <label className="block text-sm font-semibold text-gray-900 mb-3 flex items-center">
                <svg className="w-4 h-4 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2m0 0l-2-2m6 0l-2 2m0 0l2 2m-6 0l-2-2" />
                </svg>
                Course Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              >
                {statuses.map(status => (
                  <option key={status} value={status} className={status === formData.status ? 'bg-indigo-50 text-indigo-700' : ''}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
              <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start">
                  <svg className="w-4 h-4 mr-2 text-blue-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h18v4h1m1-4v4m-9 2h6a2 2 0 002 2v8a2 2 0 002 2h6a2 2 0 002-2V6a2 2 0 00-2-2H8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <p className="text-sm font-semibold text-blue-900">Visibility Status</p>
                    <p className="text-xs text-blue-700 mt-1">Draft: Only visible to you | Published: Visible to all students</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Course Type - Free or Paid */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-xl border border-indigo-200">
              <label className="block text-sm font-semibold text-gray-900 mb-4 flex items-center">
                <svg className="w-4 h-4 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .343-3.757-3.684 2.928-.464 1.062-.11 2.055-.03.928.994.144.798.392.247-1.822-.034-.928-.386-.598-.762-.423-1.256.082-.391-.277.582-.395.93-.26.432.217-.674.31-.09-.03-.28-.154-.52-.146-.833.656-.816-.578.703.193-.31-.69-.284-.144-.47-.195-.857-.232-1.18-.117-.526-.045-.768.06-.227-.245-.365-.228-.817-.138-.902-.139-.823-.068-.12-.063-.215-.09-.61-.125-.182-.054-.004-.179-.007-.335.018-.62-.003-.225.023-.461.04-.265-.065-.308-.099-.493-.124-.887-.159-.534-.007-.995-.07-.69.025-.923-.04-.66.014-.8-.049-.626-.06-.363-.062-.263-.062-.263-.147-.81-.14-.805-.085-.805-.123-.424-.089-.805-.079-.673-.08-.36-.063-.263" />
                </svg>
                Course Type *
              </label>
              <div className="grid grid-cols-2 gap-4">
                <label className={`relative cursor-pointer rounded-xl p-4 border-2 transition-all duration-200 ${
                  formData.is_free 
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 border-green-300 text-white shadow-lg' 
                    : 'bg-white border-gray-300 text-gray-700 hover:border-indigo-400'
                }`}>
                  <input
                    type="radio"
                    name="is_free"
                    value="true"
                    checked={formData.is_free === true}
                    onChange={() => setFormData(prev => ({ ...prev, is_free: true }))}
                    className="sr-only"
                  />
                  <div className="flex items-center">
                    <svg className="w-6 h-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332-.477 4.5-1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <div>
                      <p className="font-bold">Free Course</p>
                      <p className="text-sm opacity-90">Open to everyone</p>
                    </div>
                  </div>
                </label>
                <label className={`relative cursor-pointer rounded-xl p-4 border-2 transition-all duration-200 ${
                  !formData.is_free 
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 border-indigo-300 text-white shadow-lg' 
                    : 'bg-white border-gray-300 text-gray-700 hover:border-indigo-400'
                }`}>
                  <input
                    type="radio"
                    name="is_free"
                    value="false"
                    checked={formData.is_free === false}
                    onChange={() => setFormData(prev => ({ ...prev, is_free: false }))}
                    className="sr-only"
                  />
                  <div className="flex items-center">
                    <svg className="w-6 h-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M3 10h2l-2.4 2M3 17h2l.4 2M3 24h2l-2.4 2M7 7h10l-4-4m0 0l4 4m-4-4l4 4" />
                    </svg>
                    <div>
                      <p className="font-bold">Paid Course</p>
                      <p className="text-sm opacity-90">Students pay to enroll</p>
                    </div>
                  </div>
                </label>
              </div>
              <p className="mt-3 text-xs text-gray-600 text-center">Choose whether students can access this course for free or need to pay</p>
            </div>

            {/* Price - Only show if not free */}
            {!formData.is_free && (
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-200">
                <label className="block text-sm font-semibold text-gray-900 mb-3 flex items-center">
                  <svg className="w-4 h-4 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .343-3.757-3.684 2.928-.464 1.062-.11 2.055-.03.928.994.144.798.392.247-1.822-.034-.928-.386-.598-.762-.423-1.256.082-.391-.277.582-.395.93-.26.432.217-.674.31-.09-.03-.28-.154-.52-.146-.833.656-.816-.578.703.193-.31-.69-.284-.144-.47-.195-.857-.232-1.18-.117-.526-.045-.768.06-.227-.245-.365-.228-.817-.138-.902-.139-.823-.068-.12-.063-.215-.09-.61-.125-.182-.054-.004-.179-.007-.335.018-.62-.003-.225.023-.461.04-.265-.065-.308-.099-.493-.124-.887-.159-.534-.007-.995-.07-.69.025-.923-.04-.66.014-.8-.049-.626-.06-.363-.062-.263-.062-.263-.147-.81-.14-.805-.085-.805-.123-.424-.089-.805-.079-.673-.08-.36-.063-.263" />
                  </svg>
                  Course Price (TZS) *
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-3.5 text-indigo-600 font-semibold">TZS</span>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    className="w-full pl-16 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    required={!formData.is_free}
                  />
                </div>
                <p className="mt-2 text-xs text-indigo-600">Set competitive pricing for your course content</p>
              </div>
            )}

            {/* Thumbnail */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <label className="block text-sm font-semibold text-gray-900 mb-3 flex items-center">
                <svg className="w-4 h-4 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0 2.828 0 012.828 0 012.828 0 011.656l-4.586 4.586a2 2 0 01-2.828 2.828 0 012.828 0 01-1.656l4.586 4.586a2 2 0 01.828 2.828 0 01.828 2.828z" />
                </svg>
                Course Thumbnail
              </label>
              <div className="relative">
                <input
                  type="file"
                  name="thumbnail"
                  onChange={handleChange}
                  accept="image/*"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                />
                {thumbnailPreview && (
                  <div className="mt-4">
                    <div className="relative group">
                      <img
                        src={thumbnailPreview}
                        alt="Thumbnail preview"
                        className="w-full h-48 object-cover rounded-xl shadow-lg group-hover:shadow-2xl transition-shadow duration-300"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity duration-300 rounded-xl flex items-center justify-center">
                        <svg className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0 2.828 0 012.828 0 012.828 0 011.656l-4.586 4.586a2 2 0 01-2.828 2.828 0 012.828 0 01-1.656l4.586 4.586a2 2 0 01.828 2.828 0 01.828 2.828z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start">
                  <svg className="w-4 h-4 mr-2 text-blue-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h18v4h1m1-4v4m-9 2h6a2 2 0 002 2v8a2 2 0 002 2h6a2 2 0 002-2V6a2 2 0 00-2-2H8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <p className="text-sm font-semibold text-blue-900">Image Guidelines</p>
                    <p className="text-xs text-blue-700 mt-1">Recommended: 1280x720px, Max 5MB, JPG/PNG format</p>
                  </div>
                </div>
              </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 pt-8 border-t border-gray-200">
              <button
                type="button"
                onClick={handleCancel}
                className="group px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-all duration-200 font-medium"
              >
                <svg className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l-7-7m7 7l7-7" />
                </svg>
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="group px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 font-medium shadow-lg transform hover:scale-105 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4h18a2 2 0 002 2v-4a2 2 0 00-2-2H6a2 2 0 00-2 2v4a2 2 0 002 2h6z"></path>
                    </svg>
                    Creating Course...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Create Course
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
      </div>
    </div>
  );
};

export default CourseCreate;
