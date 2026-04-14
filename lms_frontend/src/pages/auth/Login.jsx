import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get redirect path from location state or default to dashboard
  const from = location.state?.from?.pathname || '/';

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
      navigate(from, { replace: true });
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 sm:p-6 lg:p-12">
      <div className="w-full max-w-md sm:max-w-6xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col lg:flex-row min-h-[600px] lg:min-h-[500px]">
        {/* Left Side - Welcome Section */}
        <div className="lg:w-2/5 bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white p-8 sm:p-10 lg:p-16">
          <div className="text-center">
            <p className="text-lg sm:text-xl lg:text-2xl tracking-widest mb-4 lg:mb-6">WELCOME TO</p>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-4 lg:mb-6 lg:mb-8">LMS</h1>
            <p className="text-xl lg:text-3xl opacity-90">Learning Management System</p>
            <p className="mt-4 lg:mt-6 text-sm lg:text-base opacity-80">Access your courses and continue learning</p>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-3/5 flex items-center justify-center bg-white p-8 lg:p-16">
          <div className="w-full max-w-md space-y-6">
            <div className="text-center">
              <h2 className="text-2xl lg:text-3xl font-semibold text-gray-800 tracking-wide">LOGIN TO LMS</h2>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg text-base lg:text-lg">
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
                className="w-full px-6 py-4 lg:py-5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-base lg:text-lg"
              />

              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Password *"
                className="w-full px-6 py-4 lg:py-5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-base lg:text-lg"
              />

              <div className="flex justify-end">
                <Link to="/forgot-password" className="text-base lg:text-lg text-gray-500 hover:text-indigo-500 transition-colors">
                  Forgot Password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 lg:py-5 bg-gradient-to-r from-indigo-900 to-purple-800 text-white font-semibold rounded-lg hover:from-indigo-800 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-base lg:text-lg"
              >
                {loading ? 'Logging in...' : 'LOGIN'}
              </button>
            </form>

            <div className="text-center">
              <p className="text-sm lg:text-base text-gray-500">
                If you are a new user,{' '}
                <Link to="/register" className="text-indigo-600 hover:text-indigo-700 font-semibold transition-colors">
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
