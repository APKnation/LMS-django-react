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
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 lg:ml-64">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading certificates...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-64">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-900 to-purple-800 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold">My Certificates</h1>
            <p className="text-indigo-200 mt-2">Your earned course completion certificates</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Issued Certificates */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Issued Certificates</h2>
          {certificates.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">No certificates yet</h3>
              <p className="mt-2 text-gray-500">Complete courses to earn certificates</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {certificates.map((certificate) => (
                <div key={certificate.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="flex-shrink-0 bg-indigo-100 rounded-full p-3">
                        <svg className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <h3 className="font-semibold text-gray-900">
                          {certificate.course_details?.title || 'Course'}
                        </h3>
                        <p className="text-sm text-gray-500">Certificate of Completion</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Certificate ID:</span>
                        <span className="text-gray-900 font-mono">{certificate.certificate_number}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Issued:</span>
                        <span className="text-gray-900">{new Date(certificate.issued_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => handleDownloadCertificate(certificate.id)}
                      className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                    >
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
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Available Certificates</h2>
          {enrolledCourses.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">No enrolled courses</h3>
              <p className="mt-2 text-gray-500">Enroll in courses to earn certificates</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrolledCourses
                .filter(enrollment => getCertificateStatus(enrollment.course) === 'available')
                .map((enrollment) => (
                  <div key={enrollment.id} className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center mb-4">
                      <div className="flex-shrink-0 bg-gray-100 rounded-full p-3">
                        <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <h3 className="font-semibold text-gray-900">
                          {enrollment.course_title || 'Course'}
                        </h3>
                        <p className="text-sm text-gray-500">Complete course to earn certificate</p>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => handleGenerateCertificate(enrollment.course)}
                      className="w-full py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
                    >
                      Generate Certificate
                    </button>
                  </div>
                ))}
            </div>
          )}
          
          {enrolledCourses.length > 0 && enrolledCourses.filter(e => getCertificateStatus(e.course) === 'available').length === 0 && (
            <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
              All enrolled courses have certificates issued
            </div>
          )}
        </div>
      </div>
      </div>
    </div>
  );
};

export default Certificates;
