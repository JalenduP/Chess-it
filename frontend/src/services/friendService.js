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

const friendService = {
  // Get all friends
  getFriends: async () => {
    const response = await axiosInstance.get('/friends');
    return response.data;
  },

  // Send friend request
  sendFriendRequest: async (username) => {
    const response = await axiosInstance.post('/friends/request', { username });
    return response.data;
  },

  // Respond to friend request
  respondFriendRequest: async (requestId, action) => {
    const response = await axiosInstance.put(`/friends/request/${requestId}`, { action });
    return response.data;
  },

  // Remove friend
  removeFriend: async (friendId) => {
    const response = await axiosInstance.delete(`/friends/${friendId}`);
    return response.data;
  },

  // Search users
  searchUsers: async (query) => {
    const response = await axiosInstance.get(`/user/search?q=${query}`);
    return response.data;
  }
};

export default friendService;
