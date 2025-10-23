import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Add token to requests
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

const gameService = {
  // Create a new game (matchmaking)
  createGame: async (timeControl) => {
    const response = await axiosInstance.post('/games/create', { timeControl });
    return response.data;
  },

  // Get game by ID
  getGame: async (gameId) => {
    const response = await axiosInstance.get(`/games/${gameId}`);
    return response.data;
  },

  // Get game history
  getGameHistory: async (page = 1, limit = 20) => {
    const response = await axiosInstance.get(`/games/history?page=${page}&limit=${limit}`);
    return response.data;
  },

  // Resign game
  resignGame: async (gameId) => {
    const response = await axiosInstance.post(`/games/${gameId}/resign`);
    return response.data;
  }
};

export default gameService;
