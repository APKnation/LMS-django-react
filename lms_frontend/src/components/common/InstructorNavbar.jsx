import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const InstructorNavbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout(navigate);
    setMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const navItems = [
    { path: '/instructor-dashboard', label: 'Dashboard' },
    { path: '/instructor-courses', label: 'My Courses' },
    { path: '/students', label: 'Students' },
    { path: '/revenue-analytics', label: 'Revenue' },
    { path: '/quiz-management', label: 'Quizzes' },
    { path: '/assignment-management', label: 'Assignments' },
    { path: '/announcements', label: 'Announcements' },
    { path: '/coupons', label: 'Coupons' },
    { path: '/instructor-payouts', label: 'Payouts' },
    { path: '/profile', label: 'Profile' },
  ];

  return (
    <nav className="bg-gradient-to-r from-purple-900 via-purple-800 to-indigo-900 shadow-xl border-b-4 border-purple-500 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          {/* Left side - Logo and main nav */}
          <div className="flex items-center">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center space-x-2">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-2xl">🎓</span>
              </div>
              <Link to="/instructor-dashboard" className="text-2xl font-bold text-white hover:text-purple-200 transition-colors tracking-wide">
                LMS Instructor
              </Link>
            </div>

            {/* Desktop navigation */}
            <div className="hidden lg:flex lg:ml-10 lg:space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`inline-flex items-center px-4 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${
                    isActive(item.path)
                      ? 'bg-white text-purple-900 shadow-md scale-105'
                      : 'text-purple-100 hover:bg-purple-700/50 hover:text-white'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Right side - User menu and mobile menu button */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {/* Desktop user menu */}
                <div className="hidden sm:flex items-center space-x-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-base shadow-md">
                      {user?.first_name?.[0] || user?.username?.[0] || 'I'}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-white">{user?.first_name || user?.username}</span>
                      <span className="text-xs text-purple-200">Instructor</span>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 border border-red-400/30"
                  >
                    Logout
                  </button>
                </div>

                {/* Mobile menu button */}
                <button
                  onClick={toggleMobileMenu}
                  className="lg:hidden p-2 rounded-lg text-white hover:bg-purple-700/50 transition-colors"
                >
                  <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {mobileMenuOpen ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
                    )}
                  </svg>
                </button>
              </>
            ) : (
              <>
                {/* Desktop auth buttons */}
                <div className="hidden sm:flex items-center space-x-3">
                  <Link
                    to="/login"
                    className="px-5 py-2.5 bg-white text-purple-900 hover:bg-purple-100 text-sm font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white text-sm font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    Register
                  </Link>
                </div>

                {/* Mobile menu button */}
                <button
                  onClick={toggleMobileMenu}
                  className="lg:hidden p-2 rounded-lg text-white hover:bg-purple-700/50 transition-colors"
                >
                  <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {mobileMenuOpen ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
                    )}
                  </svg>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`lg:hidden ${mobileMenuOpen ? 'block' : 'hidden'} bg-purple-900/95 backdrop-blur-sm border-t border-purple-700/50`}>
        <div className="px-4 py-6 space-y-2">
          {isAuthenticated ? (
            <>
              <div className="mb-6 pb-4 border-b border-purple-600/50">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                    {user?.first_name?.[0] || user?.username?.[0] || 'I'}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-base font-semibold text-white">{user?.first_name || user?.username}</span>
                    <span className="text-sm text-purple-200">Instructor</span>
                  </div>
                </div>
              </div>
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center px-4 py-3 text-base font-semibold rounded-lg transition-all duration-200 ${
                    isActive(item.path)
                      ? 'bg-white text-purple-900 shadow-md'
                      : 'text-purple-100 hover:bg-purple-700/50'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <button
                onClick={handleLogout}
                className="w-full mt-6 px-4 py-3 bg-red-600 hover:bg-red-700 text-white text-base font-semibold rounded-lg shadow-lg transition-all duration-200"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-3 text-base font-semibold rounded-lg transition-all duration-200 ${
                  isActive('/')
                    ? 'bg-white text-purple-900 shadow-md'
                    : 'text-purple-100 hover:bg-purple-700/50'
                }`}
              >
                Home
              </Link>
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full px-4 py-3 bg-white text-purple-900 hover:bg-purple-100 text-base font-semibold rounded-lg shadow-lg transition-all duration-200 text-center"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full mt-3 px-4 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white text-base font-semibold rounded-lg shadow-lg transition-all duration-200 text-center"
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

export default InstructorNavbar;
