import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          const response = await axios.post(`${API_URL}/token/refresh/`, {
            refresh: refreshToken,
          });
          
          const { access } = response.data;
          localStorage.setItem('access_token', access);
          
          originalRequest.headers.Authorization = `Bearer ${access}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, clear tokens and redirect to home
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/';
      }
    }

    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (username, password) =>
    api.post('/token/', { username, password }),
  
  refreshToken: (refresh) =>
    api.post('/token/refresh/', { refresh }),
  
  register: (userData) =>
    api.post('/users/', userData),
  
  getMe: () =>
    api.get('/users/me/'),
};

// Categories API
export const categoriesAPI = {
  getAll: () =>
    api.get('/categories/'),
  
  getById: (id) =>
    api.get(`/categories/${id}/`),
  
  create: (data) =>
    api.post('/categories/', data),
  
  update: (id, data) =>
    api.put(`/categories/${id}/`, data),
  
  delete: (id) =>
    api.delete(`/categories/${id}/`),
};

// Courses API
export const coursesAPI = {
  getAll: (params = {}) =>
    api.get('/courses/', { params }),
  
  getById: (id) =>
    api.get(`/courses/${id}/`),
  
  create: (data) =>
    api.post('/courses/', data),
  
  update: (id, data) =>
    api.put(`/courses/${id}/`, data),
  
  delete: (id) =>
    api.delete(`/courses/${id}/`),
  
  enroll: (courseId) =>
    api.post(`/courses/${courseId}/enroll/`),
  
  getEnrolled: () =>
    api.get('/enrollments/'),
  
  search: (query) =>
    api.get('/courses/search/', { params: { q: query } }),
  
  getQuiz: (courseId, quizId) =>
    api.get(`/courses/${courseId}/quizzes/${quizId}/`),
  
  submitQuiz: (courseId, quizId, answers) =>
    api.post(`/courses/${courseId}/quizzes/${quizId}/submit/`, { answers }),
  
  getQuizzes: (courseId) =>
    api.get(`/courses/${courseId}/quizzes/`),
  
  getMyCourses: () =>
    api.get('/courses/my_courses/'),

  // Course Students
  getCourseStudents: (courseId) =>
    api.get(`/courses/${courseId}/students/`),

  // Coupons
  getCoupons: () =>
    api.get('/coupons/'),
  createCoupon: (data) =>
    api.post('/coupons/', data),
  deleteCoupon: (id) =>
    api.delete(`/coupons/${id}/`),

  // Instructor Payouts
  getMyPayouts: () =>
    api.get('/instructor-payouts/my_payouts/'),
  getRevenueSummary: () =>
    api.get('/instructor-payouts/revenue_summary/'),
  getDashboardAnalytics: () =>
    api.get('/analytics/dashboard/'),

  // Announcements
  getAnnouncements: (courseId) =>
    api.get(`/courses/${courseId}/announcements/`),
  createAnnouncement: (courseId, data) =>
    api.post(`/courses/${courseId}/announcements/`, data),
  deleteAnnouncement: (id) =>
    api.delete(`/announcements/${id}/`),
};

// Quiz API
export const quizAPI = {
  // Quiz attempts
  startAttempt: (quizId) =>
    api.post(`/quizzes/${quizId}/start/`),
  
  submitQuiz: (quizId, answers) =>
    api.post(`/quizzes/${quizId}/submit/`, { answers }),
  
  getAttempts: (quizId) =>
    api.get(`/quizzes/${quizId}/attempts/`),
  
  getAttempt: (attemptId) =>
    api.get(`/quiz-attempts/${attemptId}/`),
  
  getResults: (attemptId) =>
    api.get(`/quiz-attempts/${attemptId}/results/`),
  
  // Questions
  getQuestions: (quizId) =>
    api.get(`/quizzes/${quizId}/questions/`),
  
  getQuestion: (questionId) =>
    api.get(`/questions/${questionId}/`),
};

// Assignment API
export const assignmentAPI = {
  // Assignments
  getAssignments: (courseId) =>
    api.get(`/courses/${courseId}/assignments/`),
  
  getAssignment: (assignmentId) =>
    api.get(`/assignments/${assignmentId}/`),
  
  createAssignment: (courseId, data) =>
    api.post(`/courses/${courseId}/assignments/`, data),
  
  updateAssignment: (assignmentId, data) =>
    api.put(`/assignments/${assignmentId}/`, data),
  
  deleteAssignment: (assignmentId) =>
    api.delete(`/assignments/${assignmentId}/`),
  
  // Submissions
  submitAssignment: (assignmentId, data) =>
    api.post(`/assignments/${assignmentId}/submit/`, data),
  
  getSubmissions: (assignmentId) =>
    api.get(`/assignments/${assignmentId}/submissions/`),
  
  getMySubmissions: () =>
    api.get(`/assignments/my_submissions/`),
  
  gradeSubmission: (submissionId, data) =>
    api.post(`/assignment-submissions/${submissionId}/grade/`, data),
};

// Progress API
export const progressAPI = {
  // Progress tracking
  getMyProgress: () =>
    api.get('/progress/my_progress/'),
  
  markComplete: (lessonId) =>
    api.post('/progress/mark_complete/', { lesson: lessonId }),
  
  updateProgress: (progressId, data) =>
    api.put(`/progress/${progressId}/`, data),
  
  // Bookmarks
  getMyBookmarks: () =>
    api.get('/bookmarks/my_bookmarks/'),
  
  addBookmark: (lessonId, note = '') =>
    api.post('/bookmarks/', { lesson: lessonId, note }),
  
  removeBookmark: (bookmarkId) =>
    api.delete(`/bookmarks/${bookmarkId}/`),
  
  // Notes
  getMyNotes: (lessonId = null) =>
    api.get('/notes/my_notes/', { params: lessonId ? { lesson: lessonId } : {} }),
  
  addNote: (lessonId, content, timestamp = 0) =>
    api.post('/notes/', { lesson: lessonId, content, timestamp }),
  
  updateNote: (noteId, data) =>
    api.put(`/notes/${noteId}/`, data),
  
  deleteNote: (noteId) =>
    api.delete(`/notes/${noteId}/`),
  
  // Certificates
  getMyCertificates: () =>
    api.get('/certificates/my_certificates/'),
  
  generateCertificate: (courseId) =>
    api.post('/certificates/generate/', { course: courseId }),
  
  downloadCertificate: (certificateId) =>
    api.get(`/certificates/${certificateId}/download/`, { responseType: 'blob' }),
  
  verifyCertificate: (certificateNumber) =>
    api.get('/certificates/verify/', { params: { certificate_number: certificateNumber } }),
};

// Payments API
export const paymentsAPI = {
  // Orders
  createOrder: (orderData) =>
    api.post('/orders/', orderData),
  
  checkout: (orderId) =>
    api.post(`/orders/${orderId}/checkout/`),
  
  confirmPayment: (paymentIntentId) =>
    api.post('/orders/confirm_payment/', { payment_intent_id: paymentIntentId }),
  
  getMyOrders: () =>
    api.get('/orders/my_orders/'),
  
  getOrder: (orderId) =>
    api.get(`/orders/${orderId}/`),
  
  // Coupons
  validateCoupon: (code, courseId) =>
    api.post('/coupons/validate/', { code, course_id: courseId }),
  
  getCoupons: () =>
    api.get('/coupons/'),
  
  // Instructor Payouts
  getMyPayouts: () =>
    api.get('/instructor-payouts/my_payouts/'),
  
  getRevenueSummary: () =>
    api.get('/instructor-payouts/revenue_summary/'),
  
  // Analytics
  getDashboardAnalytics: () =>
    api.get('/analytics/dashboard/'),
};

export default api;
