import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { paymentsAPI, coursesAPI } from '../services/api';
import Navbar from '../components/common/Navbar';

const Payment = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [course, setCourse] = useState(null);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [mobileMoneyDetails, setMobileMoneyDetails] = useState({
    provider: '',
    phoneNumber: '',
    accountName: ''
  });

  useEffect(() => {
    fetchCourseDetails();
  }, [courseId]);

  const fetchCourseDetails = async () => {
    try {
      setLoading(true);
      const response = await coursesAPI.getById(courseId);
      setCourse(response.data);
    } catch (err) {
      setError('Failed to load course details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFreeEnrollment = async (courseId) => {
    try {
      await coursesAPI.enroll(courseId);
      alert('Successfully enrolled in free course!');
      navigate(`/courses/${courseId}`);
    } catch (err) {
      // If already enrolled, redirect anyway
      if (err.response?.data?.success) {
        navigate(`/courses/${courseId}`);
      } else {
        console.error('Failed to enroll:', err);
      }
    }
  };

  const createOrder = async () => {
    try {
      setProcessing(true);
      setError(null);
      
      const orderData = {
        course: parseInt(courseId),
        payment_method: paymentMethod,
        mobile_money_phone: paymentMethod !== 'card' ? mobileMoneyDetails.phoneNumber : '',
        mobile_money_account_name: paymentMethod !== 'card' ? mobileMoneyDetails.accountName : ''
      };
      
      const response = await paymentsAPI.createOrder(orderData);
      setOrder(response.data);

      // Initiate checkout
      const checkoutResponse = await paymentsAPI.checkout(response.data.id);

      // Handle mobile money payments
      if (paymentMethod !== 'card') {
        if (checkoutResponse.data.payment_id) {
          alert('Payment initiated! Please complete payment on your phone.');
          // In production, you would poll for payment status
          // For now, navigate to course page
          navigate(`/courses/${courseId}`);
        } else {
          setError('Payment failed. Please try again.');
        }
      } else {
        // Handle card payments with ClickPesa
        if (checkoutResponse.data.payment_url) {
          // Redirect to ClickPesa payment page
          window.location.href = checkoutResponse.data.payment_url;
        } else {
          setError('Payment initialization failed');
        }
      }

    } catch (err) {
      setError(err.response?.data?.error || 'Failed to process payment');
      console.error(err);
    } finally {
      setProcessing(false);
    }
  };

  const handlePaymentConfirmation = async (paymentId) => {
    try {
      const response = await paymentsAPI.confirmPayment(paymentId);
      if (response.data.success) {
        alert('Payment successful! You are now enrolled in the course.');
        navigate(`/courses/${courseId}`);
      } else {
        setError('Payment confirmation failed');
      }
    } catch (err) {
      setError('Payment confirmation failed');
      console.error(err);
    }
  };

  const handleMobileMoneyChange = (e) => {
    const { name, value } = e.target;
    setMobileMoneyDetails(prev => ({ ...prev, [name]: value }));
  };

  const paymentMethods = [
    { id: 'card', name: 'Credit/Debit Card', icon: '💳', image: null },
    { id: 'mpesa', name: 'M-Pesa', icon: null, image: '/vodacom.png' },
    { id: 'tigopesa', name: 'Tigo Pesa', icon: null, image: '/tigopesa.png' },
    { id: 'airtel', name: 'Airtel Money', icon: null, image: '/airtel.png' },
    { id: 'halotel', name: 'Halotel Money', icon: null, image: '/halotel.png' },
    { id: 'ttcl', name: 'TTCL Money', icon: null, image: '/ttcl.png' },
    { id: 'yas', name: 'Yas Money', icon: null, image: '/yas.png' }
  ];

  const finalPrice = course ? parseFloat(course.price).toFixed(2) : '0.00';

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Processing enrollment...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-900 to-purple-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold">
            {course?.is_free ? 'Free Course Enrollment' : 'Secure Checkout'}
          </h1>
          <p className="text-indigo-200 mt-2">
            {course?.is_free ? 'Enroll in this free course' : 'Complete your course enrollment'}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Course Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Course Information</h2>
              {course && (
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{course.title}</h3>
                  <p className="text-gray-600 mb-4">{course.description}</p>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-500">Instructor: {course.instructor_name || 'Instructor'}</span>
                    <span className="text-sm text-gray-500">Duration: {course.duration || 'N/A'}</span>
                  </div>
                </div>
              )}
            </div>


            {/* Free Course Enrollment - Only for free courses */}
            {course?.is_free && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Free Course Enrollment</h2>
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <svg className="h-8 w-8 text-green-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-lg font-semibold text-green-800">This course is FREE</span>
                  </div>
                  <p className="text-gray-600 mb-4">Enroll now to start learning without any payment required.</p>
                  <button
                    onClick={() => handleFreeEnrollment(course.id)}
                    disabled={processing}
                    className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
                  >
                    {processing ? 'Enrolling...' : 'Enroll Now - FREE'}
                  </button>
                </div>
              </div>
            )}

            {/* Payment Form - Only for paid courses */}
            {!course?.is_free && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Details</h2>
                
                {/* Payment Method Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">Select Payment Method</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {paymentMethods.map((method) => (
                      <button
                        key={method.id}
                        onClick={() => setPaymentMethod(method.id)}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          paymentMethod === method.id
                            ? 'border-indigo-600 bg-indigo-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="text-center">
                          {method.image ? (
                            <div className="relative w-16 h-16 mx-auto mb-2 flex items-center justify-center bg-white rounded-lg p-2">
                              <img 
                                src={method.image} 
                                alt={method.name}
                                className="max-w-full max-h-full object-contain"
                              />
                            </div>
                          ) : (
                            <div className="text-2xl mb-1">{method.icon}</div>
                          )}
                          <div className="text-xs font-medium text-gray-700">{method.name}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Card Payment Information */}
                {paymentMethod === 'card' && (
                  <div className="space-y-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-sm text-blue-800">
                        <strong>💳 Card Payment:</strong> You will be redirected to ClickPesa's secure payment page to complete your payment.
                      </p>
                    </div>
                  </div>
                )}

                {/* Mobile Money Payment Form */}
                {paymentMethod !== 'card' && (
                  <div className="space-y-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-sm text-blue-800">
                        <strong>💳 Mobile Money Payment:</strong> You will be redirected to complete payment on your phone.
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={mobileMoneyDetails.phoneNumber}
                        onChange={handleMobileMoneyChange}
                        placeholder="255712345678"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      <p className="mt-1 text-xs text-gray-500">Enter your mobile money phone number (e.g., 255712345678)</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Account Name</label>
                      <input
                        type="text"
                        name="accountName"
                        value={mobileMoneyDetails.accountName}
                        onChange={handleMobileMoneyChange}
                        placeholder="Enter your name of account"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      <p className="mt-1 text-xs text-gray-500">Enter the name registered with your mobile money account</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow p-6 sticky top-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Course Price</span>
                    <span className="font-medium">
                      {course?.is_free ? 'FREE' : `TZS ${course ? parseFloat(course.price).toFixed(2) : '0.00'}`}
                    </span>
                  </div>
                  <div className="border-t pt-3 flex justify-between">
                    <span className="text-lg font-semibold">Total</span>
                    <span className="text-lg font-bold text-indigo-600">
                      {course?.is_free ? 'FREE' : `TZS ${finalPrice}`}
                    </span>
                  </div>
                </div>
                
                {error && (
                  <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                  </div>
                )}
                
                {!course?.is_free && (
                  <button
                    onClick={createOrder}
                    disabled={processing}
                    className={`w-full mt-6 py-3 rounded-lg font-medium transition-colors ${
                      processing
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                    }`}
                  >
                    {processing ? 'Processing...' : `Pay TZS ${finalPrice} with ${paymentMethods.find(m => m.id === paymentMethod)?.name}`}
                  </button>
                )}
                
                {!course?.is_free && paymentMethod === 'card' && (
                  <div className="mt-4 text-center text-xs text-gray-500">
                    <p>🔒 Secure payment powered by ClickPesa</p>
                    <p className="mt-1">Your payment information is encrypted and secure</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
