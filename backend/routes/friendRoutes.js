const express = require('express');
const router = express.Router();
const {
  getFriends,
  sendFriendRequest,
  respondFriendRequest,
  removeFriend
} = require('../controllers/friendController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getFriends);
router.post('/request', protect, sendFriendRequest);
router.put('/request/:requestId', protect, respondFriendRequest);
router.delete('/:friendId', protect, removeFriend);

module.exports = router;