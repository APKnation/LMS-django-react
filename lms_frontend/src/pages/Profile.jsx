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
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-on-dark">Profile</h1>
                <p className="text-muted mt-1">Manage your personal information</p>
              </div>
              <div className="flex items-center space-x-4">
                <span className="px-3 py-1 bg-primary text-on-primary rounded-full text-sm">
                  {isStudent ? 'Student' : isInstructor ? 'Instructor' : 'User'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left Column - Profile Form */}
          <div className="lg:col-span-2">
            <div className="bg-surface-card-dark border border-hairline-on-dark rounded-xl">
              <div className="px-6 py-4 border-b border-hairline-on-dark">
                <h2 className="text-lg font-medium text-on-dark">Personal Information</h2>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-muted mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 bg-surface-card-dark text-on-dark border border-hairline-on-dark rounded-md focus:outline-none focus:ring-2 focus:ring-info disabled:bg-surface-elevated-dark"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-muted mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 bg-surface-card-dark text-on-dark border border-hairline-on-dark rounded-md focus:outline-none focus:ring-2 focus:ring-info disabled:bg-surface-elevated-dark"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 bg-surface-card-dark text-on-dark border border-hairline-on-dark rounded-md focus:outline-none focus:ring-2 focus:ring-info disabled:bg-surface-elevated-dark"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 bg-surface-card-dark text-on-dark border border-hairline-on-dark rounded-md focus:outline-none focus:ring-2 focus:ring-info disabled:bg-surface-elevated-dark"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted mb-2">
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    disabled={!isEditing}
                    rows={4}
                    className="w-full px-3 py-2 bg-surface-card-dark text-on-dark border border-hairline-on-dark rounded-md focus:outline-none focus:ring-2 focus:ring-info disabled:bg-surface-elevated-dark"
                    placeholder="Tell us about yourself..."
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  {isEditing ? (
                    <>
                      <button
                        type="button"
                        onClick={handleCancel}
                        className="px-4 py-2 border border-hairline-on-dark rounded-md text-on-dark hover:bg-surface-elevated-dark transition-colors duration-200"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-primary text-on-primary rounded-md hover:bg-primary-active transition-colors duration-200"
                      >
                        Save Changes
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="px-4 py-2 bg-primary text-on-primary rounded-md hover:bg-primary-active transition-colors duration-200"
                    >
                      Edit Profile
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* Right Column - Additional Info */}
          <div className="space-y-8">
            {/* Account Stats */}
            <div className="bg-surface-card-dark border border-hairline-on-dark rounded-xl p-6">
              <h3 className="text-lg font-medium text-on-dark mb-4">Account Statistics</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-muted">Member Since</span>
                  <span className="text-sm font-medium text-on-dark">
                    {user?.date_joined ? new Date(user.date_joined).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted">Account Type</span>
                  <span className="text-sm font-medium text-on-dark">
                    {isStudent ? 'Student' : isInstructor ? 'Instructor' : 'User'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted">Account Status</span>
                  <span className="px-2 py-1 text-trading-up text-xs font-medium rounded-full">Active</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-surface-card-dark border border-hairline-on-dark rounded-xl p-6">
              <h3 className="text-lg font-medium text-on-dark mb-4">Quick Links</h3>
              <div className="space-y-3">
                <a
                  href="/dashboard"
                  className="block px-3 py-2 text-sm text-body-on-dark hover:bg-surface-elevated-dark rounded-md transition-colors"
                >
                  📊 Dashboard
                </a>
                <a
                  href="/courses"
                  className="block px-3 py-2 text-sm text-body-on-dark hover:bg-surface-elevated-dark rounded-md transition-colors"
                >
                  📚 My Courses
                </a>
                <a
                  href="/certificates"
                  className="block px-3 py-2 text-sm text-body-on-dark hover:bg-surface-elevated-dark rounded-md transition-colors"
                >
                  🏆 Certificates
                </a>
                <a
                  href="/settings"
                  className="block px-3 py-2 text-sm text-body-on-dark hover:bg-surface-elevated-dark rounded-md transition-colors"
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
