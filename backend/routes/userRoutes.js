// backend/routes/userRoutes.js (UPDATED)
const express = require('express');
const router = express.Router();
const { 
  getUserProfile, 
  updateUserProfile,
  updateUserSettings,
  deleteUserAccount,
  searchUsers
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');

// All user routes are protected
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.put('/settings', protect, updateUserSettings);
router.delete('/', protect, deleteUserAccount);
router.get('/search', protect, searchUsers);

module.exports = router;