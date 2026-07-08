import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [redirected, setRedirected] = useState(false);

  const { login, user, isInstructor } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get redirect path from location state or default to dashboard
  const from = location.state?.from?.pathname || '/dashboard';

  // Handle redirect after login based on user role
  useEffect(() => {
    if (user && !redirected) {
      setRedirected(true);
      // Redirect based on role
      if (isInstructor) {
        navigate('/instructor-dashboard', { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    }
  }, [user, isInstructor, navigate, from, redirected]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(formData.username, formData.password);

    if (result.success) {
      // Redirect will be handled by useEffect when user state updates
      setLoading(false);
    } else {
      setError(result.error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b0e11] p-4 sm:p-6 lg:p-12" style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif' }}>
      <div className="w-full max-w-md sm:max-w-6xl bg-[#1e2329] rounded-md overflow-hidden flex flex-col lg:flex-row min-h-[600px] lg:min-h-[500px] border border-[#2b3139]">
        {/* Left Side - Welcome Section */}
        <div className="lg:w-2/5 bg-[#fcd535] flex items-center justify-center text-[#181a20] p-8 sm:p-10 lg:p-16">
          <div className="text-center">
            <p className="text-lg sm:text-xl lg:text-2xl tracking-widest mb-4 lg:mb-6 font-semibold">WELCOME TO</p>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-4 lg:mb-6 lg:mb-8" style={{ fontFamily: '"JetBrains Mono", monospace' }}>LMS</h1>
            <p className="text-xl lg:text-3xl font-semibold">Learning Management System</p>
            <p className="mt-4 lg:mt-6 text-sm lg:text-base text-[#181a20] opacity-80">Access your courses and continue learning</p>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-3/5 flex items-center justify-center bg-[#0b0e11] p-8 lg:p-16">
          <div className="w-full max-w-md space-y-6">
            <div className="text-center">
              <h2 className="text-2xl lg:text-3xl font-semibold text-white tracking-wide">LOGIN TO LMS</h2>
            </div>

            {error && (
              <div className="bg-[#2b3139] border border-[#f6465d] text-[#f6465d] px-6 py-4 rounded-md text-base lg:text-lg">
                {error}
              </div>
            )}

            <form className="space-y-5" onSubmit={handleSubmit}>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                placeholder="Username *"
                className="w-full px-4 py-4 bg-[#1e2329] border border-[#2b3139] rounded-md focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-[#3b82f6] transition-colors text-base lg:text-lg text-white placeholder-[#707a8a]"
              />

              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Password *"
                className="w-full px-4 py-4 bg-[#1e2329] border border-[#2b3139] rounded-md focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-[#3b82f6] transition-colors text-base lg:text-lg text-white placeholder-[#707a8a]"
              />

              <div className="flex justify-end">
                <Link to="/forgot-password" className="text-base lg:text-lg text-[#fcd535] hover:text-[#f0b90b] transition-colors focus:outline-none focus:ring-2 focus:ring-[#3b82f6] rounded-sm">
                  Forgot Password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 lg:py-5 bg-[#fcd535] hover:bg-[#f0b90b] text-[#181a20] font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-[#3b82f6] disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-base lg:text-lg"
              >
                {loading ? 'Logging in...' : 'LOGIN'}
              </button>
            </form>

            <div className="text-center">
              <p className="text-sm lg:text-base text-[#707a8a]">
                If you are a new user,{' '}
                <Link to="/register" className="text-[#fcd535] hover:text-[#f0b90b] font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[#3b82f6] rounded-sm">
                  Signup here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
