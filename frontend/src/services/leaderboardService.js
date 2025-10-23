import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

const leaderboardService = {
  // Get leaderboard
  getLeaderboard: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.department) params.append('department', filters.department);
    if (filters.batch) params.append('batch', filters.batch);
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);

    const response = await axiosInstance.get(`/leaderboard?${params.toString()}`);
    return response.data;
  },

  // Get user rank
  getUserRank: async (userId) => {
    const response = await axiosInstance.get(`/leaderboard/rank/${userId}`);
    return response.data;
  }
};

export default leaderboardService;
