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

    // Instructor validation
    if (formData.is_instructor) {
      // In a real application, you might want to:
      // 1. Require additional information (qualifications, experience)
      // 2. Send for admin approval
      // 3. Require email verification
      // For now, we'll allow it but show a warning
      const confirmInstructor = window.confirm(
        'You are registering as an Instructor. This role requires approval from administrators. Continue?'
      );
      if (!confirmInstructor) {
        return;
      }
    }

    setLoading(true);

    // Remove password2 before sending to API
    const { password2, ...registerData } = formData;

    const result = await register(registerData);
    
    if (result.success) {
      if (formData.is_instructor) {
        alert('Registration successful! Your instructor account is pending approval from administrators.');
      } else {
        alert('Registration successful! Welcome to LMS.');
      }
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 sm:p-6 lg:p-12">
      <div className="w-full max-w-md sm:max-w-6xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col lg:flex-row min-h-[600px] lg:min-h-[500px]">
        {/* Left Side - Welcome Section */}
        <div className="lg:w-2/5 bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white p-8 sm:p-10 lg:p-16">
          <div className="text-center">
            <p className="text-lg sm:text-xl lg:text-2xl tracking-widest mb-4 lg:mb-6">JOIN</p>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-4 lg:mb-6 lg:mb-8">LMS</h1>
            <p className="text-xl lg:text-3xl opacity-90">Learning Management System</p>
            <p className="mt-4 lg:mt-6 text-sm lg:text-base opacity-80">Create your account and start learning today</p>
          </div>
        </div>

        {/* Right Side - Register Form */}
        <div className="w-full lg:w-3/5 flex items-center justify-center bg-white p-8 lg:p-16">
          <div className="w-full max-w-lg space-y-6">
            <div className="text-center">
              <h2 className="text-2xl lg:text-3xl font-semibold text-gray-800 tracking-wide">REGISTER FOR LMS</h2>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg text-base lg:text-lg">
                {error}
              </div>
            )}

            <form className="space-y-4" onSubmit={handleSubmit}>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                placeholder="First Name"
                className="w-full px-6 py-4 lg:py-5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-base lg:text-lg"
              />

              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                placeholder="Last Name"
                className="w-full px-6 py-4 lg:py-5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-base lg:text-lg"
              />

              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                placeholder="Username *"
                className="w-full px-6 py-4 lg:py-5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-base lg:text-lg"
              />

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Email *"
                className="w-full px-6 py-4 lg:py-5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-base lg:text-lg"
              />

              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Password *"
                className="w-full px-6 py-4 lg:py-5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-base lg:text-lg"
              />

              <input
                type="password"
                name="password2"
                value={formData.password2}
                onChange={handleChange}
                required
                placeholder="Confirm Password *"
                className="w-full px-6 py-4 lg:py-5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-base lg:text-lg"
              />

              <div className="bg-gray-50 p-4 lg:p-5 rounded-lg">
                <p className="text-sm lg:text-base text-gray-600 mb-3 font-medium">Register as:</p>
                <div className="space-y-3">
                  <label className="flex items-start cursor-pointer p-3 bg-white rounded-lg border-2 border-indigo-200 hover:border-indigo-400 transition-colors">
                    <input
                      type="radio"
                      name="userType"
                      checked={formData.is_student}
                      onChange={() => setFormData({ ...formData, is_student: true, is_instructor: false })}
                      className="w-5 h-5 text-indigo-600 border-gray-300 focus:ring-indigo-500 mt-1"
                    />
                    <div className="ml-3">
                      <span className="text-sm lg:text-base font-semibold text-gray-900">Student</span>
                      <p className="text-xs text-gray-500 mt-1">Enroll in courses, track progress, earn certificates</p>
                    </div>
                  </label>
                  <label className="flex items-start cursor-pointer p-3 bg-white rounded-lg border-2 border-gray-200 hover:border-purple-400 transition-colors">
                    <input
                      type="radio"
                      name="userType"
                      checked={formData.is_instructor}
                      onChange={() => setFormData({ ...formData, is_student: false, is_instructor: true })}
                      className="w-5 h-5 text-purple-600 border-gray-300 focus:ring-purple-500 mt-1"
                    />
                    <div className="ml-3">
                      <span className="text-sm lg:text-base font-semibold text-gray-900">Instructor</span>
                      <p className="text-xs text-gray-500 mt-1">Create courses, manage students, track analytics</p>
                    </div>
                  </label>
                </div>
                
                {formData.is_instructor && (
                  <div className="mt-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="flex items-start">
                      <svg className="w-5 h-5 text-purple-600 mt-0.5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div className="text-xs text-purple-800">
                        <p className="font-semibold mb-1">Instructor Registration</p>
                        <p>Instructor accounts require approval from administrators. You'll be able to create courses once approved.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 lg:py-5 bg-gradient-to-r from-indigo-900 to-purple-800 text-white font-semibold rounded-lg hover:from-indigo-800 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-base lg:text-lg"
              >
                {loading ? 'Creating account...' : 'REGISTER'}
              </button>
            </form>

            <div className="text-center">
              <p className="text-sm lg:text-base text-gray-500">
                Already have an account?{' '}
                <Link to="/login" className="text-indigo-600 hover:text-indigo-700 font-semibold transition-colors">
                  Sign in here
                </Link>
              </p>
            </div>

            {/* Information for existing students */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="text-xs text-blue-800">
                  <p className="font-semibold mb-1">Already a student?</p>
                  <p>If you're already registered as a student and want to become an instructor, contact administrators to request an instructor role upgrade.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
