import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from '../components/common/Sidebar';

const Profile = () => {
  const { user, isStudent, isInstructor, updateUser } = useAuth();
  const [isEditing, setIsEditing] = React.useState(false);
  const [formData, setFormData] = React.useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    email: user?.email || '',
    bio: user?.bio || '',
    phone: user?.phone || '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // TODO: Add API call to update profile
      updateUser({ ...user, ...formData });
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const handleCancel = () => {
    setFormData({
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      email: user?.email || '',
      bio: user?.bio || '',
      phone: user?.phone || '',
    });
    setIsEditing(false);
  };

  return (
    <div className="flex min-h-screen bg-canvas-dark text-on-dark">
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-64">
        {/* Profile Header */}
        <div className="bg-canvas-dark border-b border-hairline-on-dark">
          <div className="mx-auto px-4 sm:px-6 lg:px-8 py-5 max-w-7xl">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-on-dark">Profile</h1>
                <p className="text-sm text-muted mt-0.5">Manage your personal information</p>
              </div>
              <div className="flex items-center">
                <span className="px-2.5 py-0.5 bg-primary text-on-primary rounded-full text-xs sm:text-sm">
                  {isStudent ? 'Student' : isInstructor ? 'Instructor' : 'User'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-6 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">

            {/* Left Column - Profile Form */}
            <div className="lg:col-span-2">
              <div className="bg-surface-card-dark border border-hairline-on-dark rounded-xl">
                <div className="px-4 py-3 border-b border-hairline-on-dark">
                  <h2 className="text-base font-medium text-on-dark">Personal Information</h2>
                </div>

                <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-xs font-medium text-muted mb-1">
                        First Name
                      </label>
                      <input
                        type="text"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 bg-surface-card-dark text-on-dark border border-hairline-on-dark rounded-md focus:outline-none focus:ring-2 focus:ring-info disabled:bg-surface-elevated-dark text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-muted mb-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 bg-surface-card-dark text-on-dark border border-hairline-on-dark rounded-md focus:outline-none focus:ring-2 focus:ring-info disabled:bg-surface-elevated-dark text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-muted mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 bg-surface-card-dark text-on-dark border border-hairline-on-dark rounded-md focus:outline-none focus:ring-2 focus:ring-info disabled:bg-surface-elevated-dark text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-muted mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 bg-surface-card-dark text-on-dark border border-hairline-on-dark rounded-md focus:outline-none focus:ring-2 focus:ring-info disabled:bg-surface-elevated-dark text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-muted mb-1">
                      Bio
                    </label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      disabled={!isEditing}
                      rows={3}
                      className="w-full px-3 py-2 bg-surface-card-dark text-on-dark border border-hairline-on-dark rounded-md focus:outline-none focus:ring-2 focus:ring-info disabled:bg-surface-elevated-dark text-sm resize-none"
                      placeholder="Tell us about yourself..."
                    />
                  </div>

                  <div className="flex justify-end space-x-2">
                    {isEditing ? (
                      <>
                        <button
                          type="button"
                          onClick={handleCancel}
                          className="px-3 py-1.5 border border-hairline-on-dark rounded-md text-on-dark hover:bg-surface-elevated-dark transition-colors duration-200 text-sm"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-3 py-1.5 bg-primary text-on-primary rounded-md hover:bg-primary-active transition-colors duration-200 text-sm"
                        >
                          Save Changes
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setIsEditing(true)}
                        className="px-3 py-1.5 bg-primary text-on-primary rounded-md hover:bg-primary-active transition-colors duration-200 text-sm"
                      >
                        Edit Profile
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>

            {/* Right Column - Additional Info */}
            <div className="space-y-4">
              {/* Account Stats */}
              <div className="bg-surface-card-dark border border-hairline-on-dark rounded-xl p-4">
                <h3 className="text-sm font-medium text-on-dark mb-3">Account Statistics</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-xs text-muted">Member Since</span>
                    <span className="text-xs font-medium text-on-dark">
                      {user?.date_joined ? new Date(user.date_joined).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-muted">Account Type</span>
                    <span className="text-xs font-medium text-on-dark">
                      {isStudent ? 'Student' : isInstructor ? 'Instructor' : 'User'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-muted">Account Status</span>
                    <span className="px-1.5 py-0.5 text-trading-up text-xs font-medium rounded-full">Active</span>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div className="bg-surface-card-dark border border-hairline-on-dark rounded-xl p-4">
                <h3 className="text-sm font-medium text-on-dark mb-2">Quick Links</h3>
                <div className="space-y-1">
                  <a
                    href="/dashboard"
                    className="block px-2 py-1.5 text-xs text-body-on-dark hover:bg-surface-elevated-dark rounded-md transition-colors"
                  >
                    📊 Dashboard
                  </a>
                  <a
                    href="/courses"
                    className="block px-2 py-1.5 text-xs text-body-on-dark hover:bg-surface-elevated-dark rounded-md transition-colors"
                  >
                    📚 My Courses
                  </a>
                  <a
                    href="/certificates"
                    className="block px-2 py-1.5 text-xs text-body-on-dark hover:bg-surface-elevated-dark rounded-md transition-colors"
                  >
                    🏆 Certificates
                  </a>
                  <a
                    href="/settings"
                    className="block px-2 py-1.5 text-xs text-body-on-dark hover:bg-surface-elevated-dark rounded-md transition-colors"
                  >
                    ⚙️ Settings
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
