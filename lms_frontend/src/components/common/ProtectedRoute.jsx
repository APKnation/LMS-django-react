import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedRoute = ({ children, requireInstructor = false }) => {
  const { isAuthenticated, isInstructor, loading } = useAuth();
  const location = useLocation();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Loading...</div>
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
      <div className="unauthorized-container">
        <h2>Access Denied</h2>
        <p>You need to be an instructor to access this page.</p>
      </div>
    );
  }

  // Render the protected component
  return children;
};

export default ProtectedRoute;
