import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('adminToken');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

// Job API endpoints
export const jobApi = {
  // Public endpoints
  getJobs: (params) => api.get('/jobs', { params }),
  getJob: (id) => api.get(`/jobs/${id}`),
  clickJob: (id) => api.post(`/jobs/${id}/click`),
  getFilterOptions: () => api.get('/jobs/filters/options'),
  
  // Admin endpoints
  getAdminJobs: (params) => api.get('/jobs/admin/all', { params }),
  getDumpJobs: (params) => api.get('/jobs/admin/dump', { params }),
  createJob: (jobData) => api.post('/jobs', jobData),
  createBulkJobs: (jobs) => api.post('/jobs/bulk', { jobs }),
  updateJob: (id, jobData) => api.put(`/jobs/${id}`, jobData),
  updateJobStatus: (id, status) => api.put(`/jobs/${id}/status`, { status }),
  deleteJob: (id) => api.delete(`/jobs/${id}`),
  processStatusChanges: () => api.post('/jobs/admin/process-status-changes'),
  checkDuplicateHiringLink: (hiringLink, excludeJobId) => 
    api.post('/jobs/check-duplicate', { hiringLink, excludeJobId }),
};

// Admin API endpoints
export const adminApi = {
  login: (credentials) => api.post('/admin/login', credentials),
  getProfile: () => api.get('/admin/profile'),
  updateProfile: (profileData) => api.put('/admin/profile', profileData),
  getAllAdmins: (params) => api.get('/admin/all', { params }),
  createAdmin: (adminData) => api.post('/admin/register', adminData),
  updateAdminPermissions: (id, permissions) => api.put(`/admin/${id}/permissions`, { permissions }),
  updateAdminStatus: (id, isActive) => api.put(`/admin/${id}/status`, { isActive }),
  deleteAdmin: (id) => api.delete(`/admin/${id}`),
  createMainAdmin: (adminData) => api.post('/admin/create-main-admin', adminData),
};

// Analytics API endpoints
export const analyticsApi = {
  getDashboard: (params) => api.get('/analytics/dashboard', { params }),
  getJobAnalytics: (params) => api.get('/analytics/jobs', { params }),
  getJobAnalyticsById: (id, params) => api.get(`/analytics/jobs/${id}`, { params }),
  getCompanyAnalytics: (params) => api.get('/analytics/companies', { params }),
  getTrends: (params) => api.get('/analytics/trends', { params }),
  exportAnalytics: (params) => api.get('/analytics/export', { params }),
};

export default api;