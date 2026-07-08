import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { coursesAPI, categoriesAPI } from '../services/api';
import Sidebar from '../components/common/Sidebar';
import Categories from '../components/Categories';
import Footer from '../components/common/Footer';

const Courses = () => {
  const { user, isStudent, isInstructor } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(0);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedCategory) params.category = selectedCategory.id;
      if (selectedLevel !== 'all') params.difficulty = selectedLevel.toLowerCase();
      if (searchTerm) params.search = searchTerm;

      const response = await coursesAPI.getAll(params);
      setCourses(response.data);

      // Force re-render by updating timestamp
      setLastUpdate(Date.now());
      setError(null);
    } catch (error) {
      console.error('Failed to fetch courses:', error);
      setError('Failed to load courses. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchCourses();
    }, 500); // Debounce search

    return () => clearTimeout(timeoutId);
  }, [searchTerm, selectedCategory, selectedLevel]);

  // Auto-refresh courses every 30 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchCourses();
    }, 30000); // Poll every 30 seconds

    return () => clearInterval(intervalId);
  }, [fetchCourses]);

  const levels = ['all', 'Beginner', 'Intermediate', 'Advanced'];

  const handleEnroll = async (courseId) => {
    navigate(`/payment/${courseId}`);
  };

  return (
    <div className="flex min-h-screen bg-canvas-dark text-on-dark">
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-64">
        {/* Header */}
        <div className="bg-canvas-dark border-b border-hairline-on-dark">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <h1 className="text-3xl lg:text-4xl font-bold mb-4 text-on-dark">
                {isInstructor ? 'Course Catalog' : 'Explore Courses'}
              </h1>
              <p className={`text-xl text-muted`}>
                {isInstructor ? 'View all courses in the system' : 'Discover courses that match your interests and career goals'}
              </p>
              {isInstructor && (
                <button
                  onClick={() => navigate('/instructor-courses')}
                  className="mt-4 px-6 py-2 bg-primary text-on-primary rounded-md hover:bg-primary-active font-medium transition-colors duration-200"
                >
                  Manage My Courses
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <div className="bg-surface-card-dark border border-hairline-on-dark rounded-xl p-6">
              <Categories
                onCategorySelect={setSelectedCategory}
                selectedCategory={selectedCategory}
              />

              {/* Level Filter */}
              <div className="mt-6 pt-6 border-t border-hairline-on-dark">
                <h3 className="text-lg font-semibold text-on-dark mb-3">Difficulty Level</h3>
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="w-full px-4 py-2 bg-surface-card-dark text-on-dark border border-hairline-on-dark rounded-md focus:outline-none focus:ring-2 focus:ring-info"
                >
                  {levels.map(level => (
                    <option key={level} value={level}>
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Search Bar */}
            <div className="bg-surface-card-dark border border-hairline-on-dark rounded-xl p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-semibold text-on-dark">
                  Discover Courses
                </label>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-trading-up rounded-full animate-pulse"></div>
                  <span className="text-xs text-muted">Live Search</span>
                </div>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search by title, instructor, or keyword..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-surface-card-dark text-on-dark border border-hairline-on-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-info transition-colors duration-200 placeholder:text-muted"
                />
              </div>
            </div>

            {/* Results Count */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-muted">
                  Found <span className="font-bold text-primary text-lg">{courses.length}</span> courses
                  {selectedCategory && (
                    <span> in <span className="font-semibold text-primary">{selectedCategory.name}</span></span>
                  )}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <button className="px-4 py-2 text-sm bg-surface-card-dark border border-hairline-on-dark rounded-lg hover:bg-surface-elevated-dark transition-colors text-on-dark">
                  <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1.994 1.994 0 013 6.586V4z" />
                  </svg>
                  Filter
                </button>
                <button className="px-4 py-2 text-sm bg-surface-card-dark border border-hairline-on-dark rounded-lg hover:bg-surface-elevated-dark transition-colors text-on-dark">
                  <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                  Sort
                </button>
              </div>
            </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
            </div>
            <p className="text-muted font-medium">Loading amazing courses...</p>
            <p className="text-sm text-muted mt-2">This should only take a moment</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-surface-card-dark rounded-full mb-6">
              <svg className="h-10 w-10 text-trading-down" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-on-dark mb-2">Oops! Something went wrong</h3>
            <p className="text-muted mb-6 max-w-sm mx-auto">{error}</p>
            <button
              onClick={fetchCourses}
              className="px-6 py-3 bg-primary text-on-primary rounded-md hover:bg-primary-active transition-colors duration-200 font-medium"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Course Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map(course => (
              <div key={course.id} className="group relative bg-surface-card-dark border border-hairline-on-dark rounded-xl overflow-hidden hover:bg-surface-elevated-dark transition-colors duration-200">
                {/* Course Image */}
                <div className="relative h-48 overflow-hidden">
                  {course.thumbnail ? (
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-surface-elevated-dark flex items-center justify-center">
                      <svg className="w-16 h-16 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332-.477 4.5-1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                  )}
                  {/* Course Badges */}
                  <div className="absolute top-4 right-4 flex flex-col items-end space-y-2">
                    <span className={`px-3 py-1 text-xs font-bold rounded-full border border-hairline-on-dark ${
                      course.difficulty === 'beginner' ? 'text-trading-up' :
                      course.difficulty === 'intermediate' ? 'text-primary' :
                      'text-trading-down'
                    }`}>
                      {course.difficulty?.charAt(0).toUpperCase() + course.difficulty?.slice(1)}
                    </span>
                    {course.is_free ? (
                      <span className="px-3 py-1 border border-trading-up text-trading-up text-xs font-medium rounded-full">
                        FREE
                      </span>
                    ) : (
                      <span className="px-3 py-1 border border-trading-down text-trading-down text-xs font-medium rounded-full">
                        PAID
                      </span>
                    )}
                  </div>
                </div>

                {/* Course Content */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-3 py-1 bg-surface-elevated-dark text-primary text-xs font-semibold rounded-full">
                      {course.category || 'Uncategorized'}
                    </span>
                    <div className="flex items-center">
                      <div className="flex items-center">
                        <svg className="w-4 h-4 text-primary mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-sm font-semibold text-body-on-dark">{course.rating || '4.5'}</span>
                        <span className="text-xs text-muted ml-1">({course.review_count || '0'})</span>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-on-dark mb-3 line-clamp-2">
                    {course.title}
                  </h3>

                  <p className="text-muted text-sm mb-4 line-clamp-3">
                    {course.description || 'Master this comprehensive course and enhance your skills with expert guidance.'}
                  </p>

                  <div className="flex items-center text-sm text-muted mb-4">
                    <div className="flex items-center mr-4">
                      <svg className="w-4 h-4 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span className="text-primary hover:text-primary-active cursor-pointer font-medium" onClick={() => course.instructor_id && navigate(`/instructor/${course.instructor_id}`)}>
                        {course.instructor_name || 'Expert Instructor'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-muted mb-4">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-1 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{course.duration || '8 weeks'}</span>
                    </div>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-1 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332-.477 4.5-1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      <span>{course.lesson_count || '24'} lessons</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-hairline-on-dark">
                    <div>
                      {course.is_free ? (
                        <div className="flex items-center">
                          <span className="text-2xl font-bold text-trading-up font-plex">FREE</span>
                        </div>
                      ) : (
                        <div>
                          <span className="text-2xl font-bold text-primary font-plex">TZS {course.price || '49,999'}</span>
                          {course.original_price && (
                            <span className="text-sm text-muted line-through ml-2">TZS {course.original_price}</span>
                          )}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => handleEnroll(course.id)}
                      className="px-6 py-3 text-on-dark text-sm font-bold rounded-md transition-colors duration-200 bg-primary hover:bg-primary-active"
                    >
                      <span className="flex items-center">
                        {course.is_free ? (
                          <>
                            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Enroll Free
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            Enroll Now
                          </>
                        )}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Results */}
        {!loading && !error && courses.length === 0 && (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-surface-card-dark rounded-full mb-6">
              <svg className="w-10 h-10 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-on-dark mb-2">No courses found</h3>
            <p className="text-muted mb-6 max-w-sm mx-auto">Try adjusting your search terms or browse different categories to find what you're looking for.</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory(null);
                setSelectedLevel('all');
              }}
              className="px-6 py-3 bg-primary text-on-primary rounded-md hover:bg-primary-active transition-colors duration-200 font-medium"
            >
              Clear Filters
            </button>
          </div>
        )}
          </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Courses;
