import axios from 'axios';

// Create axios instance with default configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    
    if (error.response?.status === 429) {
      // Rate limit exceeded
      console.warn('Rate limit exceeded. Please try again later.');
    }
    
    return Promise.reject(error);
  }
);

// API utility functions
export const apiRequest = {
  // Auth endpoints
  login: (credentials) => api.post('/api/auth/login', credentials),
  register: (userData) => api.post('/api/auth/register', userData),
  
  // Teams endpoints
  getTeams: () => api.get('/api/teams'),
  createTeam: (teamData) => api.post('/api/teams', teamData),
  updateTeam: (id, teamData) => api.put(`/api/teams/${id}`, teamData),
  deleteTeam: (id) => api.delete(`/api/teams/${id}`),
  
  // Matches endpoints
  getMatches: () => api.get('/api/matches'),
  getUpcomingMatches: () => api.get('/api/matches/upcoming'),
  createMatch: (matchData) => api.post('/api/matches', matchData),
  updateMatch: (id, matchData) => api.put(`/api/matches/${id}`, matchData),
  
  // Leaderboard endpoints
  getCricketLeaderboard: () => api.get('/api/leaderboard/cricket'),
  getThrowballLeaderboard: () => api.get('/api/leaderboard/throwball'),
  
  // Health check
  healthCheck: () => api.get('/api/health'),
};

export default api;
