import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedRoute = ({ children, requireInstructor = false }) => {
  const { isAuthenticated, isInstructor, loading } = useAuth();
  const location = useLocation();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0b0e11]">
        <div className="text-[#eaecef] text-sm" style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif' }}>
          Loading...
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if instructor access is required
  if (requireInstructor && !isInstructor) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0b0e11] px-4">
        <div className="max-w-md w-full bg-[#1e2329] border border-[#2b3139] rounded-md p-6 text-center" style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif' }}>
          <h2 className="text-xl font-semibold text-white mb-2">Access Denied</h2>
          <p className="text-sm text-[#707a8a]">You need to be an instructor to access this page.</p>
        </div>
      </div>
    );
  }

  // Render the protected component
  return children;
};

export default ProtectedRoute;
