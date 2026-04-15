import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { coursesAPI, categoriesAPI } from '../services/api';
import Navbar from '../components/common/Navbar';
import InstructorNavbar from '../components/common/InstructorNavbar';
import Categories from '../components/Categories';

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
    <div className="min-h-screen bg-gray-50">
      {isInstructor ? <InstructorNavbar /> : <Navbar />}

      {/* Header */}
      <div className={`text-white ${isInstructor ? 'bg-gradient-to-r from-purple-900 to-indigo-800' : 'bg-gradient-to-r from-indigo-900 to-purple-800'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-3xl lg:text-4xl font-bold mb-4">
              {isInstructor ? 'Course Catalog' : 'Explore Courses'}
            </h1>
            <p className={`text-xl ${isInstructor ? 'text-purple-200' : 'text-indigo-200'}`}>
              {isInstructor ? 'View all courses in the system' : 'Discover courses that match your interests and career goals'}
            </p>
            {isInstructor && (
              <button
                onClick={() => navigate('/instructor-courses')}
                className="mt-4 px-6 py-2 bg-white text-purple-700 rounded-md hover:bg-gray-100 font-medium"
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
            <div className="bg-white rounded-lg shadow p-6">
              <Categories 
                onCategorySelect={setSelectedCategory}
                selectedCategory={selectedCategory}
              />
              
              {/* Level Filter */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Difficulty Level</h3>
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Courses
              </label>
              <input
                type="text"
                placeholder="Search by title, instructor, or keyword..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Results Count */}
            <div className="mb-6">
              <p className="text-gray-600">
                Showing <span className="font-semibold">{courses.length}</span> courses
                {selectedCategory && (
                  <span> in <span className="font-semibold text-indigo-600">{selectedCategory.name}</span></span>
                )}
              </p>
            </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <p className="mt-4 text-gray-600">Loading courses...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-red-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01m-6 938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Courses</h3>
            <p className="text-gray-500">{error}</p>
            <button
              onClick={fetchCourses}
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Course Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map(course => (
              <div key={course.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                {/* Course Image */}
                <div className="relative">
                  {course.thumbnail ? (
                    <img 
                      src={course.thumbnail} 
                      alt={course.title}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                      <svg className="w-16 h-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C12 3 2.25 2.25S0 6.253 0 9.253v13C0 19.747 2.25 21.75 12 21.75c2.746 0 4.997-2.253 6.253-6.253V6.253z" />
                      </svg>
                    </div>
                  )}
                  <div className="absolute top-4 right-4 flex flex-col items-end space-y-2">
                    <span className="px-3 py-1 bg-indigo-600 text-white text-xs font-medium rounded-full">
                      {course.difficulty}
                    </span>
                    {course.is_free ? (
                      <span className="px-3 py-1 bg-green-500 text-white text-xs font-medium rounded-full">
                        FREE
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-purple-500 text-white text-xs font-medium rounded-full">
                        PAID
                      </span>
                    )}
                  </div>
                </div>

                {/* Course Content */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-500">{course.category || 'Uncategorized'}</span>
                    <div className="flex items-center">
                      <span className="text-yellow-400">★</span>
                      <span className="text-sm text-gray-600 ml-1">{course.rating || 'No ratings yet'}</span>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {course.title}
                  </h3>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {course.description}
                  </p>

                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <span className="w-4 h-4 mr-1 inline-flex items-center justify-center">👤</span>
                    {course.instructor_name || 'Unknown Instructor'}
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {course.duration || 'Self-paced'}
                    </div>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                      </svg>
                      {course.lesson_count || '0'} lessons
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold text-indigo-600">
                      {course.is_free ? (
                        <span className="text-green-600">FREE</span>
                      ) : (
                        <span>TZS {course.price || '0.00'}</span>
                      )}
                    </div>
                    <button
                      onClick={() => handleEnroll(course.id)}
                      className={`px-4 py-2 text-white text-sm font-medium rounded-md transition-colors ${
                        course.is_free 
                          ? 'bg-green-600 hover:bg-green-700' 
                          : 'bg-indigo-600 hover:bg-indigo-700'
                      }`}
                    >
                      Enroll
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Results */}
        {!loading && !error && courses.length === 0 && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Courses;
