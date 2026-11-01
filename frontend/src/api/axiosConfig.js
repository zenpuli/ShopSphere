import axios from 'axios';

// Create configured Axios instance
const api = axios.create({
  baseURL: 'http://localhost:8080',
  withCredentials: true, // Essential for Spring Security session cookie (SHOPSPHERE_SESSION)
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Response interceptor for unified error formatting
api.interceptors.response.use(
  (response) => response,
  (error) => {
    let message = 'An unexpected error occurred. Please try again.';
    if (error.response?.data?.message) {
      message = error.response.data.message;
    } else if (error.message) {
      message = error.message;
    }
    return Promise.reject(new Error(message));
  }
);

export default api;
