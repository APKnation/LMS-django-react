import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Sidebar = () => {
  const { user, isAuthenticated, logout, isInstructor, isStaff } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout(navigate);
    setSidebarOpen(false);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const studentNavLinks = [
    { to: '/', label: 'Home' },
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/courses', label: 'Courses' },
    { to: '/enrollments', label: 'Enrollments' },
    { to: '/quizzes', label: 'Quizzes' },
    { to: '/progress', label: 'Progress' },
    { to: '/certificates', label: 'Certificates' },
    { to: '/bookmarks', label: 'Bookmarks' },
    { to: '/notes', label: 'Notes' },
    { to: '/profile', label: 'Profile' },
  ];

  const instructorNavLinks = [
    { to: '/', label: 'Home' },
    { to: '/instructor-dashboard', label: 'Dashboard' },
    { to: '/instructor-courses', label: 'My Courses' },
    { to: '/course/create', label: 'Create Course' },
    { to: '/announcements', label: 'Announcements' },
    { to: '/assignment-management', label: 'Assignments' },
    { to: '/quiz-management', label: 'Quiz Management' },
    { to: '/students', label: 'Students' },
    { to: '/payment-history', label: 'Payments' },
    { to: '/profile', label: 'Profile' },
  ];

  const adminNavLinks = [
    { to: '/', label: 'Home' },
    { to: '/admin-dashboard', label: 'Admin Dashboard' },
    { to: '/profile', label: 'Profile' },
  ];

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-indigo-600 text-white rounded-md shadow-lg"
      >
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          {sidebarOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          onClick={toggleSidebar}
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full bg-white shadow-lg border-r border-gray-200 z-50 transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:static lg:z-auto`}
      >
        <div className="flex flex-col h-full w-64">
          {/* Logo */}
          <div className="p-6 border-b border-gray-200">
            <Link to="/" className="text-2xl font-bold text-indigo-600 hover:text-indigo-700 transition-colors">
              LMS
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 overflow-y-auto">
            {isAuthenticated ? (
              <div className="space-y-2">
                <div className={`p-3 mb-4 rounded-lg ${
                  isStaff ? 'bg-red-50' : isInstructor ? 'bg-purple-50' : 'bg-indigo-50'
                }`}>
                  <p className={`text-sm font-medium ${
                    isStaff ? 'text-red-900' : isInstructor ? 'text-purple-900' : 'text-indigo-900'
                  }`}>
                    Welcome, {user?.first_name || user?.username}
                  </p>
                  <p className={`text-xs mt-1 ${
                    isStaff ? 'text-red-700' : isInstructor ? 'text-purple-700' : 'text-indigo-700'
                  }`}>
                    {isStaff ? 'Admin' : isInstructor ? 'Instructor' : 'Student'}
                  </p>
                </div>
                {(isStaff ? adminNavLinks : isInstructor ? instructorNavLinks : studentNavLinks).map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setSidebarOpen(false)}
                    className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      isActive(link.to)
                        ? isStaff
                          ? 'bg-red-100 text-red-700'
                          : isInstructor 
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-indigo-100 text-indigo-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                <button
                  onClick={handleLogout}
                  className="w-full mt-4 px-4 py-3 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {studentNavLinks.slice(0, 1).map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setSidebarOpen(false)}
                    className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      isActive(link.to)
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  to="/login"
                  onClick={() => setSidebarOpen(false)}
                  className="block w-full px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors text-center"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setSidebarOpen(false)}
                  className="block w-full mt-2 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors text-center"
                >
                  Register
                </Link>
              </div>
            )}
          </nav>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
