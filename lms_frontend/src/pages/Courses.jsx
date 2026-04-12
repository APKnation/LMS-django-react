import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/common/Navbar';

const Courses = () => {
  const { isStudent, isInstructor } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');

  // Mock course data
  const courses = [
    {
      id: 1,
      title: 'Introduction to React',
      instructor: 'John Doe',
      category: 'Programming',
      level: 'Beginner',
      duration: '8 weeks',
      enrolled: 1234,
      rating: 4.8,
      price: 49.99,
      image: 'https://picsum.photos/seed/react-course/400/250.jpg',
      description: 'Learn the fundamentals of React.js and build modern web applications.'
    },
    {
      id: 2,
      title: 'Advanced JavaScript',
      instructor: 'Jane Smith',
      category: 'Programming',
      level: 'Advanced',
      duration: '12 weeks',
      enrolled: 892,
      rating: 4.9,
      price: 79.99,
      image: 'https://picsum.photos/seed/js-course/400/250.jpg',
      description: 'Master advanced JavaScript concepts and best practices.'
    },
    {
      id: 3,
      title: 'UI/UX Design Fundamentals',
      instructor: 'Mike Johnson',
      category: 'Design',
      level: 'Beginner',
      duration: '6 weeks',
      enrolled: 2156,
      rating: 4.7,
      price: 39.99,
      image: 'https://picsum.photos/seed/design-course/400/250.jpg',
      description: 'Learn the principles of user interface and user experience design.'
    },
    {
      id: 4,
      title: 'Digital Marketing Strategy',
      instructor: 'Sarah Wilson',
      category: 'Marketing',
      level: 'Intermediate',
      duration: '10 weeks',
      enrolled: 1567,
      rating: 4.6,
      price: 59.99,
      image: 'https://picsum.photos/seed/marketing-course/400/250.jpg',
      description: 'Develop effective digital marketing strategies for business growth.'
    },
    {
      id: 5,
      title: 'Python for Data Science',
      instructor: 'David Brown',
      category: 'Data Science',
      level: 'Intermediate',
      duration: '14 weeks',
      enrolled: 3421,
      rating: 4.9,
      price: 89.99,
      image: 'https://picsum.photos/seed/python-course/400/250.jpg',
      description: 'Learn Python programming for data analysis and machine learning.'
    },
    {
      id: 6,
      title: 'Business Management',
      instructor: 'Emily Davis',
      category: 'Business',
      level: 'Beginner',
      duration: '8 weeks',
      enrolled: 987,
      rating: 4.5,
      price: 44.99,
      image: 'https://picsum.photos/seed/business-course/400/250.jpg',
      description: 'Essential business management skills for modern organizations.'
    }
  ];

  const categories = ['all', 'Programming', 'Design', 'Marketing', 'Data Science', 'Business'];
  const levels = ['all', 'Beginner', 'Intermediate', 'Advanced'];

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
    const matchesLevel = selectedLevel === 'all' || course.level === selectedLevel;
    
    return matchesSearch && matchesCategory && matchesLevel;
  });

  const handleEnroll = (courseId) => {
    // TODO: Implement enrollment logic
    console.log('Enrolling in course:', courseId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-900 to-purple-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-3xl lg:text-4xl font-bold mb-4">
              Explore Courses
            </h1>
            <p className="text-xl text-indigo-200">
              Discover courses that match your interests and career goals
            </p>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
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

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Level Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Level
              </label>
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

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing <span className="font-semibold">{filteredCourses.length}</span> courses
          </p>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map(course => (
            <div key={course.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              {/* Course Image */}
              <div className="relative">
                <img 
                  src={course.image} 
                  alt={course.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1 bg-indigo-600 text-white text-xs font-medium rounded-full">
                    {course.level}
                  </span>
                </div>
              </div>

              {/* Course Content */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-500">{course.category}</span>
                  <div className="flex items-center">
                    <span className="text-yellow-400">★</span>
                    <span className="text-sm text-gray-600 ml-1">{course.rating}</span>
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {course.title}
                </h3>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {course.description}
                </p>

                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  {course.instructor}
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {course.duration}
                  </div>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                    {course.enrolled.toLocaleString()} enrolled
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-indigo-600">
                    ${course.price}
                  </div>
                  <button
                    onClick={() => handleEnroll(course.id)}
                    className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 transition-colors"
                  >
                    {isStudent ? 'Enroll Now' : isInstructor ? 'View Course' : 'Enroll Now'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredCourses.length === 0 && (
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
  );
};

export default Courses;
