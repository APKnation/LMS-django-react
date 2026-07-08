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
    { to: '/admin-courses', label: 'Courses' },
    { to: '/admin-categories', label: 'Categories' },
    { to: '/admin-enrollments', label: 'Enrollments' },
    { to: '/profile', label: 'Profile' },
  ];

  const currentLinks = isStaff ? adminNavLinks : isInstructor ? instructorNavLinks : studentNavLinks;
  const roleLabel = isStaff ? 'Admin' : isInstructor ? 'Instructor' : 'Student';

  const linkClass = (to) =>
    `block px-4 py-3 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[#3b82f6] ${
      isActive(to)
        ? 'bg-[#2b3139] text-[#fcd535]'
        : 'text-[#eaecef] hover:text-white hover:bg-[#1e2329]'
    }`;

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-[#fcd535] text-[#181a20] rounded-md focus:outline-none focus:ring-2 focus:ring-[#3b82f6]"
        style={{ height: 64 }}
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
          className="lg:hidden fixed inset-0 bg-black bg-opacity-60 z-40"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full bg-[#0b0e11] border-r border-[#2b3139] z-50 transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:static lg:z-auto`}
        style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif' }}
      >
        <div className="flex flex-col h-full w-64">
          {/* Logo */}
          <div className="p-6 border-b border-[#2b3139]">
            <Link to="/" className="text-2xl font-bold text-[#fcd535] hover:text-[#f0b90b] transition-colors focus:outline-none focus:ring-2 focus:ring-[#3b82f6] rounded-md">
              LMS
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 overflow-y-auto">
            {isAuthenticated ? (
              <div className="space-y-2">
                <div className="p-3 mb-4 rounded-md bg-[#1e2329] border border-[#2b3139]">
                  <p className="text-sm font-medium text-[#fcd535]">
                    Welcome, {user?.first_name || user?.username}
                  </p>
                  <p className="text-xs mt-1 text-[#707a8a]">
                    {roleLabel}
                  </p>
                </div>
                {currentLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setSidebarOpen(false)}
                    className={linkClass(link.to)}
                  >
                    {link.label}
                  </Link>
                ))}
                <button
                  onClick={handleLogout}
                  className="w-full mt-4 px-4 py-3 bg-[#1e2329] hover:bg-[#2b3139] text-white text-sm font-medium rounded-md transition-colors border border-[#2b3139] focus:outline-none focus:ring-2 focus:ring-[#3b82f6]"
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
                    className={linkClass(link.to)}
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  to="/login"
                  onClick={() => setSidebarOpen(false)}
                  className="block w-full px-4 py-3 bg-[#fcd535] hover:bg-[#f0b90b] text-[#181a20] text-sm font-semibold rounded-md transition-colors text-center focus:outline-none focus:ring-2 focus:ring-[#3b82f6]"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setSidebarOpen(false)}
                  className="block w-full mt-2 px-4 py-3 bg-[#1e2329] hover:bg-[#2b3139] text-white text-sm font-medium rounded-md transition-colors text-center border border-[#2b3139] focus:outline-none focus:ring-2 focus:ring-[#3b82f6]"
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
