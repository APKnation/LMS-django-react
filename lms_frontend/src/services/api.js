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

// Courses API
export const coursesAPI = {
  getAll: (params = {}) =>
    api.get('/courses/', { params }),
  
  getById: (id) =>
    api.get(`/courses/${id}/`),
  
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
};

export default api;
