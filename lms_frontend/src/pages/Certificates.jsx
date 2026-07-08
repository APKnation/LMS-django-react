import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { progressAPI, coursesAPI } from '../services/api';
import Sidebar from '../components/common/Sidebar';

const Certificates = () => {
  const { user, isStudent } = useAuth();
  const [certificates, setCertificates] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCertificates();
    fetchEnrolledCourses();
  }, []);

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      const response = await progressAPI.getMyCertificates();
      setCertificates(response.data || []);
    } catch (err) {
      setError('Failed to load certificates');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchEnrolledCourses = async () => {
    try {
      const response = await coursesAPI.getEnrolled();
      setEnrolledCourses(response.data || []);
    } catch (err) {
      console.error('Failed to load enrolled courses:', err);
    }
  };

  const handleGenerateCertificate = async (courseId) => {
    try {
      await progressAPI.generateCertificate(courseId);
      // Refresh certificates
      await fetchCertificates();
    } catch (err) {
      console.error('Failed to generate certificate:', err);
      setError(err.response?.data?.error || 'Failed to generate certificate');
    }
  };

  const handleDownloadCertificate = async (certificateId) => {
    try {
      const response = await progressAPI.downloadCertificate(certificateId);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `certificate_${certificateId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Failed to download certificate:', err);
    }
  };

  const getCertificateStatus = (courseId) => {
    const certificate = certificates.find(c => c.course === courseId);
    if (certificate) return 'issued';
    return 'available';
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-canvas-dark text-on-dark">
        <Sidebar />
        <div className="flex-1 lg:ml-64">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent mx-auto"></div>
              <p className="mt-6 text-lg text-muted font-medium">Loading certificates...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-canvas-dark text-on-dark">
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-64">
        {/* Header */}
        <div className="bg-canvas-dark border-b border-hairline-on-dark">
          <div className="max-w-7xl mx-auto px-6 py-10">
            <h1 className="text-4xl font-extrabold mb-2 text-on-dark">My Certificates</h1>
            <p className="text-muted text-lg">Your earned course completion certificates</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-10">
        {error && (
          <div className="bg-surface-card-dark border-l-4 border-trading-down text-trading-down px-6 py-4 rounded-r-lg mb-8">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          </div>
        )}

        {/* Issued Certificates */}
        <div className="mb-14">
          <h2 className="text-3xl font-bold text-on-dark mb-8 flex items-center">
            <svg className="w-8 h-8 mr-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Issued Certificates
          </h2>
          {certificates.length === 0 ? (
            <div className="bg-surface-card-dark border border-hairline-on-dark rounded-xl p-16 text-center">
              <div className="bg-surface-elevated-dark rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                <svg className="h-12 w-12 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-on-dark mb-2">No certificates yet</h3>
              <p className="text-muted">Complete courses to earn certificates</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {certificates.map((certificate) => (
                <div key={certificate.id} className="bg-surface-card-dark border border-hairline-on-dark rounded-xl">
                  <div className="p-8">
                    <div className="flex items-center mb-6">
                      <div className="flex-shrink-0 bg-surface-elevated-dark rounded-xl p-4">
                        <svg className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="ml-5">
                        <h3 className="font-bold text-on-dark text-lg">
                          {certificate.course_details?.title || 'Course'}
                        </h3>
                        <p className="text-sm text-primary font-medium">Certificate of Completion</p>
                      </div>
                    </div>

                    <div className="bg-surface-elevated-dark rounded-xl p-4 mb-6 space-y-3">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted">Certificate ID:</span>
                        <span className="text-on-dark font-plex font-semibold bg-surface-card-dark px-3 py-1 rounded-lg">{certificate.certificate_number}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted">Issued:</span>
                        <span className="text-on-dark font-semibold">{new Date(certificate.issued_at).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDownloadCertificate(certificate.id)}
                      className="w-full py-3 bg-primary text-on-primary rounded-md hover:bg-primary-active transition-colors duration-200 font-semibold flex items-center justify-center"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Download PDF
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Available Certificates */}
        <div>
          <h2 className="text-3xl font-bold text-on-dark mb-8 flex items-center">
            <svg className="w-8 h-8 mr-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            Available Certificates
          </h2>
          {enrolledCourses.length === 0 ? (
            <div className="bg-surface-card-dark border border-hairline-on-dark rounded-xl p-16 text-center">
              <div className="bg-surface-elevated-dark rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                <svg className="h-12 w-12 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-on-dark mb-2">No enrolled courses</h3>
              <p className="text-muted">Enroll in courses to earn certificates</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {enrolledCourses
                .filter(enrollment => getCertificateStatus(enrollment.course) === 'available')
                .map((enrollment) => (
                  <div key={enrollment.id} className="bg-surface-card-dark border border-hairline-on-dark rounded-xl">
                    <div className="p-8">
                      <div className="flex items-center mb-6">
                        <div className="flex-shrink-0 bg-surface-elevated-dark rounded-xl p-4">
                          <svg className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                        </div>
                        <div className="ml-5">
                          <h3 className="font-bold text-on-dark text-lg">
                            {enrollment.course_title || 'Course'}
                          </h3>
                          <p className="text-sm text-muted font-medium">Complete course to earn certificate</p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleGenerateCertificate(enrollment.course?.id || enrollment.course_id || enrollment.course)}
                        className="w-full py-3 bg-primary text-on-primary rounded-md hover:bg-primary-active transition-colors duration-200 font-semibold flex items-center justify-center"
                      >
                        <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Generate Certificate
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          )}

          {enrolledCourses.length > 0 && enrolledCourses.filter(e => getCertificateStatus(e.course) === 'available').length === 0 && (
            <div className="bg-surface-card-dark border border-hairline-on-dark rounded-xl p-8 text-center">
              <div className="bg-surface-elevated-dark rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-muted font-medium">All enrolled courses have certificates issued</p>
            </div>
          )}
        </div>
      </div>
      </div>
    </div>
  );
};

export default Certificates;
