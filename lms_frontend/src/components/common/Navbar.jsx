import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const isActive = (path) => {
  if (path === '/') return location.pathname === '/';
  return location.pathname.startsWith(path);
};

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left side - Logo and main nav */}
          <div className="flex items-center">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link to="/" className="text-2xl font-bold text-indigo-600 hover:text-indigo-700 transition-colors">
                LMS
              </Link>
            </div>

            {/* Desktop navigation */}
            <div className="hidden lg:flex lg:ml-8 lg:space-x-8">
              <Link
                to="/"
                className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive('/')
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                Home
              </Link>
              {isAuthenticated && (
                <>
                  <Link
                    to="/dashboard"
                    className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      isActive('/dashboard')
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/courses"
                    className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      isActive('/courses')
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    Courses
                  </Link>
                  <Link
                    to="/enrollments"
                    className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      isActive('/enrollments')
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    Enrollments
                  </Link>
                  <Link
                    to="/quizzes"
                    className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      isActive('/quizzes')
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    Quizzes
                  </Link>
                  <Link
                    to="/profile"
                    className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      isActive('/profile')
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    Profile
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Right side - User menu and mobile menu button */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {/* Desktop user menu */}
                <div className="hidden sm:flex items-center space-x-4">
                  <span className="text-sm text-gray-700">
                    Welcome, {user?.first_name || user?.username}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-md transition-colors"
                  >
                    Logout
                  </button>
                </div>

                {/* Mobile menu button */}
                <button
                  onClick={toggleMobileMenu}
                  className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {mobileMenuOpen ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    )}
                  </svg>
                </button>
              </>
            ) : (
              <>
                {/* Desktop auth buttons */}
                <div className="hidden sm:flex items-center space-x-4">
                  <Link
                    to="/login"
                    className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-md transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-md transition-colors"
                  >
                    Register
                  </Link>
                </div>

                {/* Mobile menu button */}
                <button
                  onClick={toggleMobileMenu}
                  className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {mobileMenuOpen ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    )}
                  </svg>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`lg:hidden sidebar-mobile ${mobileMenuOpen ? 'sidebar-mobile-open' : 'sidebar-mobile-closed'}`}>
        <div className="p-4 space-y-2">
          {isAuthenticated ? (
            <>
              <div className="pb-4 border-b border-gray-200">
                <p className="text-sm text-gray-700">
                  Welcome, {user?.first_name || user?.username}
                </p>
              </div>
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive('/dashboard')
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                Dashboard
              </Link>
              <Link
                to="/courses"
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive('/courses')
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                Courses
              </Link>
              <Link
                to="/enrollments"
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive('/enrollments')
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                Enrollments
              </Link>
              <Link
                to="/quizzes"
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive('/quizzes')
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                Quizzes
              </Link>
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive('/profile')
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="w-full mt-4 px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-md transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-md transition-colors text-center"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full mt-2 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-md transition-colors text-center"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
