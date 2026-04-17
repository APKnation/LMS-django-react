import React from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';

const Home = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-64">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-indigo-900 to-purple-800 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Learning Management System
            </h1>
            <p className="text-xl lg:text-2xl text-indigo-200 mb-8">
              Empowering education through technology
            </p>
            <div className="space-x-4">
              <Link
                to="/login"
                className="inline-block px-8 py-3 bg-white text-indigo-600 font-medium rounded-lg hover:bg-gray-100 transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Trusted by Thousands
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-4xl font-bold text-indigo-600 mb-2">10,000+</div>
              <p className="text-gray-600">Active Students</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-4xl font-bold text-emerald-600 mb-2">500+</div>
              <p className="text-gray-600">Courses Available</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-4xl font-bold text-purple-600 mb-2">98%</div>
              <p className="text-gray-600">Success Rate</p>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Why Choose Our LMS?
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Comprehensive learning platform designed for students and instructors
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="flex-shrink-0 bg-indigo-500 rounded-lg p-3 mx-auto w-16 h-16 flex items-center justify-center mb-4">
              <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Rich Course Content</h3>
            <p className="text-gray-600">Access comprehensive learning materials and resources</p>
          </div>

          <div className="text-center">
            <div className="flex-shrink-0 bg-emerald-500 rounded-lg p-3 mx-auto w-16 h-16 flex items-center justify-center mb-4">
              <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Track Progress</h3>
            <p className="text-gray-600">Monitor your learning journey and achievements</p>
          </div>

          <div className="text-center">
            <div className="flex-shrink-0 bg-purple-500 rounded-lg p-3 mx-auto w-16 h-16 flex items-center justify-center mb-4">
              <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Get Certified</h3>
            <p className="text-gray-600">Earn certificates upon course completion</p>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              What Our Students Say
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center mb-4">
                <img 
                  src="https://picsum.photos/seed/student1/50/50.jpg" 
                  alt="Student" 
                  className="w-12 h-12 rounded-full"
                />
                <div className="ml-4">
                  <h4 className="font-medium text-gray-900">John Doe</h4>
                  <p className="text-sm text-gray-500">Computer Science Student</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "This LMS has transformed my learning experience. The courses are well-structured and the instructors are amazing!"
              </p>
              <div className="flex items-center mt-4">
                <span className="text-yellow-400">★★★★★</span>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center mb-4">
                <img 
                  src="https://picsum.photos/seed/student2/50/50.jpg" 
                  alt="Student" 
                  className="w-12 h-12 rounded-full"
                />
                <div className="ml-4">
                  <h4 className="font-medium text-gray-900">Jane Smith</h4>
                  <p className="text-sm text-gray-500">Business Student</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "I love the flexibility of learning at my own pace. The progress tracking keeps me motivated!"
              </p>
              <div className="flex items-center mt-4">
                <span className="text-yellow-400">★★★★★</span>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center mb-4">
                <img 
                  src="https://picsum.photos/seed/student3/50/50.jpg" 
                  alt="Student" 
                  className="w-12 h-12 rounded-full"
                />
                <div className="ml-4">
                  <h4 className="font-medium text-gray-900">Mike Johnson</h4>
                  <p className="text-sm text-gray-500">Instructor</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "As an instructor, this platform makes it easy to create and manage courses. Highly recommended!"
              </p>
              <div className="flex items-center mt-4">
                <span className="text-yellow-400">★★★★★</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-indigo-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Start Your Learning Journey?
          </h2>
          <p className="text-xl mb-8">
            Join thousands of students already learning with our platform
          </p>
          <div className="space-x-4">
            <Link
              to="/register"
              className="inline-block px-8 py-3 bg-white text-indigo-600 font-medium rounded-lg hover:bg-gray-100 transition-colors"
            >
              Sign Up Now
            </Link>
            <Link
              to="/courses"
              className="inline-block px-8 py-3 border-2 border-white text-white font-medium rounded-lg hover:bg-white hover:text-indigo-600 transition-colors"
            >
              Browse Courses
            </Link>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default Home;
