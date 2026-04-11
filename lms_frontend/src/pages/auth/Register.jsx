import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: '',
    first_name: '',
    last_name: '',
    is_student: true,
    is_instructor: false,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password !== formData.password2) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setLoading(true);

    // Remove password2 before sending to API
    const { password2, ...registerData } = formData;

    const result = await register(registerData);
    
    if (result.success) {
      navigate('/');
    } else {
      // Format error messages from API
      const errorMsg = typeof result.error === 'object' 
        ? Object.entries(result.error)
            .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
            .join('; ')
        : result.error;
      setError(errorMsg);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 lg:p-8">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col lg:flex-row">
        {/* Left Side - Welcome Section */}
        <div className="lg:w-2/5 bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center text-white p-8 lg:p-12">
          <div className="text-center">
            <p className="text-base lg:text-lg tracking-widest mb-2 lg:mb-4">JOIN</p>
            <h1 className="text-4xl lg:text-5xl font-bold mb-4 lg:mb-6">LMS</h1>
            <p className="text-lg lg:text-xl opacity-90">Learning Management System</p>
            <p className="mt-2 lg:mt-4 text-xs lg:text-sm opacity-80">Start your learning journey today</p>
          </div>
        </div>

        {/* Right Side - Register Form */}
        <div className="w-full lg:w-3/5 flex items-center justify-center bg-white p-6 lg:p-12">
          <div className="w-full max-w-sm space-y-4">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-800 tracking-wide">REGISTER FOR LMS</h2>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded text-sm">
                {error}
              </div>
            )}

            <form className="space-y-3" onSubmit={handleSubmit}>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                placeholder="First Name"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white transition-all text-sm"
              />

              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                placeholder="Last Name"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white transition-all text-sm"
              />

              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                placeholder="Username *"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white transition-all text-sm"
              />

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Email *"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white transition-all text-sm"
              />

              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Password *"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white transition-all text-sm"
              />

              <input
                type="password"
                name="password2"
                value={formData.password2}
                onChange={handleChange}
                required
                placeholder="Confirm Password *"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white transition-all text-sm"
              />

              <div className="bg-gray-50 p-3 rounded">
                <p className="text-xs text-gray-600 mb-2">Register as:</p>
                <div className="flex space-x-4">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="userType"
                      checked={formData.is_student}
                      onChange={() => setFormData({ ...formData, is_student: true, is_instructor: false })}
                      className="w-4 h-4 text-rose-500 border-gray-300 focus:ring-rose-500"
                    />
                    <span className="ml-2 text-xs text-gray-700">Student</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="userType"
                      checked={formData.is_instructor}
                      onChange={() => setFormData({ ...formData, is_student: false, is_instructor: true })}
                      className="w-4 h-4 text-rose-500 border-gray-300 focus:ring-rose-500"
                    />
                    <span className="ml-2 text-xs text-gray-700">Instructor</span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-rose-500 to-orange-500 text-white font-medium rounded hover:from-rose-600 hover:to-orange-600 focus:outline-none focus:ring-2 focus:ring-rose-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {loading ? 'Creating account...' : 'REGISTER'}
              </button>
            </form>

            <div className="text-center">
              <p className="text-xs text-gray-500">
                Already have an account?{' '}
                <Link to="/login" className="text-rose-500 hover:text-rose-600 font-medium transition-colors">
                  Sign in here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
