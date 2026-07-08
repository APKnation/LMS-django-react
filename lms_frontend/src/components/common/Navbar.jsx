import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout(navigate); // Pass navigate function to handle redirect
    setMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const navLinkClass = (path) =>
    `inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-[#3b82f6] ${
      isActive(path)
        ? 'bg-[#2b3139] text-[#fcd535]'
        : 'text-[#eaecef] hover:text-white hover:bg-[#1e2329]'
    }`;

  const btnPrimary = 'px-4 py-2 bg-[#fcd535] hover:bg-[#f0b90b] text-[#181a20] text-sm font-semibold rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-[#3b82f6]';
  const btnSecondary = 'px-4 py-2 bg-[#1e2329] hover:bg-[#2b3139] text-white text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-[#3b82f6] border border-[#2b3139]';

  return (
    <nav className="bg-[#0b0e11] border-b border-[#2b3139] relative" style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left side - Logo and main nav */}
          <div className="flex items-center">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link to="/" className="text-2xl font-bold text-[#fcd535] hover:text-[#f0b90b] transition-colors focus:outline-none focus:ring-2 focus:ring-[#3b82f6] rounded-md">
                LMS
              </Link>
            </div>

            {/* Desktop navigation */}
            <div className="hidden lg:flex lg:ml-8 lg:space-x-8">
              <Link to="/" className={navLinkClass('/')}>
                Home
              </Link>
              {isAuthenticated && (
                <>
                  <Link to="/dashboard" className={navLinkClass('/dashboard')}>
                    Dashboard
                  </Link>
                  <Link to="/courses" className={navLinkClass('/courses')}>
                    Courses
                  </Link>
                  <Link to="/enrollments" className={navLinkClass('/enrollments')}>
                    Enrollments
                  </Link>
                  <Link to="/quizzes" className={navLinkClass('/quizzes')}>
                    Quizzes
                  </Link>
                  <Link to="/progress" className={navLinkClass('/progress')}>
                    Progress
                  </Link>
                  <Link to="/profile" className={navLinkClass('/profile')}>
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
                  <span className="text-sm text-[#eaecef]">
                    Welcome, {user?.first_name || user?.username}
                  </span>
                  <button
                    onClick={handleLogout}
                    className={btnSecondary}
                  >
                    Logout
                  </button>
                </div>

                {/* Mobile menu button */}
                <button
                  onClick={toggleMobileMenu}
                  className="lg:hidden h-16 flex items-center p-2 rounded-md text-[#eaecef] hover:text-white hover:bg-[#1e2329] transition-colors focus:outline-none focus:ring-2 focus:ring-[#3b82f6]"
                  style={{ height: 64 }}
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
                  <Link to="/login" className={btnPrimary}>
                    Login
                  </Link>
                  <Link to="/register" className={btnSecondary}>
                    Register
                  </Link>
                </div>

                {/* Mobile menu button */}
                <button
                  onClick={toggleMobileMenu}
                  className="lg:hidden h-16 flex items-center p-2 rounded-md text-[#eaecef] hover:text-white hover:bg-[#1e2329] transition-colors focus:outline-none focus:ring-2 focus:ring-[#3b82f6]"
                  style={{ height: 64 }}
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
      <div className={`lg:hidden ${mobileMenuOpen ? 'block' : 'hidden'}`}>
        <div className="p-4 space-y-2 bg-[#0b0e11] border-t border-[#2b3139]">
          {isAuthenticated ? (
            <>
              <div className="pb-4 border-b border-[#2b3139]">
                <p className="text-sm text-[#eaecef]">
                  Welcome, {user?.first_name || user?.username}
                </p>
              </div>
              <Link to="/" onClick={() => setMobileMenuOpen(false)} className={`block ${navLinkClass('/')}`}>
                Home
              </Link>
              <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className={`block ${navLinkClass('/dashboard')}`}>
                Dashboard
              </Link>
              <Link to="/courses" onClick={() => setMobileMenuOpen(false)} className={`block ${navLinkClass('/courses')}`}>
                Courses
              </Link>
              <Link to="/enrollments" onClick={() => setMobileMenuOpen(false)} className={`block ${navLinkClass('/enrollments')}`}>
                Enrollments
              </Link>
              <Link to="/quizzes" onClick={() => setMobileMenuOpen(false)} className={`block ${navLinkClass('/quizzes')}`}>
                Quizzes
              </Link>
              <Link to="/progress" onClick={() => setMobileMenuOpen(false)} className={`block ${navLinkClass('/progress')}`}>
                Progress
              </Link>
              <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className={`block ${navLinkClass('/profile')}`}>
                Profile
              </Link>
              <button onClick={handleLogout} className="w-full mt-4 px-3 py-2 bg-[#1e2329] hover:bg-[#2b3139] text-white text-sm font-medium rounded-md transition-colors border border-[#2b3139] focus:outline-none focus:ring-2 focus:ring-[#3b82f6]">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/" onClick={() => setMobileMenuOpen(false)} className={`block ${navLinkClass('/')}`}>
                Home
              </Link>
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="block w-full px-3 py-2 bg-[#fcd535] hover:bg-[#f0b90b] text-[#181a20] text-sm font-semibold rounded-md transition-colors text-center focus:outline-none focus:ring-2 focus:ring-[#3b82f6]">
                Login
              </Link>
              <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="block w-full mt-2 px-3 py-2 bg-[#1e2329] hover:bg-[#2b3139] text-white text-sm font-medium rounded-md transition-colors text-center border border-[#2b3139] focus:outline-none focus:ring-2 focus:ring-[#3b82f6]">
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
