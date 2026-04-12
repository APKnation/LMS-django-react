import React from 'react';
import Navbar from '../components/common/Navbar';

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
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
              <a
                href="/login"
                className="inline-block px-8 py-3 bg-white text-indigo-600 font-medium rounded-lg hover:bg-gray-100 transition-colors"
              >
                Get Started
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 4.866A3.001 3.001 0 0115 15a3.001 3.001 0 01-2.288-4.866 5.002 5.002 0 01-4.424 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Get Certified</h3>
            <p className="text-gray-600">Earn certificates upon course completion</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
