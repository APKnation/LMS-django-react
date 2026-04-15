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
  const [couponCode, setCouponCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponValid, setCouponValid] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvc: ''
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

  const validateCoupon = async () => {
    if (!couponCode.trim()) return;
    
    try {
      const response = await paymentsAPI.validateCoupon(couponCode, courseId);
      if (response.data.valid) {
        setCouponValid(true);
        setDiscountAmount(parseFloat(response.data.discount_amount));
      } else {
        setCouponValid(false);
        setDiscountAmount(0);
        setError(response.data.error);
      }
    } catch (err) {
      setCouponValid(false);
      setDiscountAmount(0);
      setError('Invalid coupon code');
    }
  };

  const createOrder = async () => {
    try {
      setProcessing(true);
      setError(null);
      
      const response = await paymentsAPI.createOrder(courseId, couponCode || null);
      setOrder(response.data);
      
      // Initiate checkout
      const checkoutResponse = await paymentsAPI.checkout(response.data.id);
      
      // In a real app, you would use Stripe Elements here
      // For now, simulate payment completion
      await simulatePayment(checkoutResponse.data.order.stripe_payment_intent_id);
      
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to process payment');
      console.error(err);
    } finally {
      setProcessing(false);
    }
  };

  const simulatePayment = async (paymentIntentId) => {
    try {
      await paymentsAPI.confirmPayment(paymentIntentId);
      navigate(`/courses/${courseId}`);
    } catch (err) {
      setError('Payment confirmation failed');
      console.error(err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCardDetails(prev => ({ ...prev, [name]: value }));
  };

  const finalPrice = course ? (course.price - discountAmount).toFixed(2) : '0.00';

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading payment details...</p>
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
          <h1 className="text-3xl font-bold">Secure Checkout</h1>
          <p className="text-indigo-200 mt-2">Complete your course enrollment</p>
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

            {/* Coupon Code */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Apply Coupon</h2>
              <div className="flex space-x-4">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="Enter coupon code"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  onClick={validateCoupon}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Apply
                </button>
              </div>
              {couponValid === true && (
                <p className="mt-2 text-sm text-green-600">Coupon applied successfully! You saved ${discountAmount.toFixed(2)}</p>
              )}
              {couponValid === false && (
                <p className="mt-2 text-sm text-red-600">Invalid or expired coupon code</p>
              )}
            </div>

            {/* Payment Form */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Details</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                  <input
                    type="text"
                    name="number"
                    value={cardDetails.number}
                    onChange={handleInputChange}
                    placeholder="1234 5678 9012 3456"
                    maxLength="19"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                    <input
                      type="text"
                      name="expiry"
                      value={cardDetails.expiry}
                      onChange={handleInputChange}
                      placeholder="MM/YY"
                      maxLength="5"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">CVC</label>
                    <input
                      type="text"
                      name="cvc"
                      value={cardDetails.cvc}
                      onChange={handleInputChange}
                      placeholder="123"
                      maxLength="3"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Course Price</span>
                  <span className="font-medium">${course ? course.price.toFixed(2) : '0.00'}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span className="font-medium">-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t pt-3 flex justify-between">
                  <span className="text-lg font-semibold">Total</span>
                  <span className="text-lg font-bold text-indigo-600">${finalPrice}</span>
                </div>
              </div>
              
              {error && (
                <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}
              
              <button
                onClick={createOrder}
                disabled={processing}
                className={`w-full mt-6 py-3 rounded-lg font-medium transition-colors ${
                  processing
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                }`}
              >
                {processing ? 'Processing...' : `Pay $${finalPrice}`}
              </button>
              
              <div className="mt-4 text-center text-xs text-gray-500">
                <p>🔒 Secure payment powered by Stripe</p>
                <p className="mt-1">Your payment information is encrypted and secure</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
