import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const tournamentService = {
  // Get all tournaments
  getTournaments: async (status = 'registration') => {
    const response = await axiosInstance.get(`/tournaments?status=${status}`);
    return response.data;
  },

  // Get single tournament
  getTournament: async (id) => {
    const response = await axiosInstance.get(`/tournaments/${id}`);
    return response.data;
  },

  // Create tournament
  createTournament: async (tournamentData) => {
    const response = await axiosInstance.post('/tournaments', tournamentData);
    return response.data;
  },

  // Join tournament
  joinTournament: async (id) => {
    const response = await axiosInstance.post(`/tournaments/${id}/join`);
    return response.data;
  },

  // Leave tournament
  leaveTournament: async (id) => {
    const response = await axiosInstance.delete(`/tournaments/${id}/leave`);
    return response.data;
  },

  // Get my tournaments
  getMyTournaments: async () => {
    const response = await axiosInstance.get('/tournaments/my');
    return response.data;
  }
};

export default tournamentService;