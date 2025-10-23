// controllers/friendController.js
const User = require('../models/User');

// @desc    Get all friends
// @route   GET /api/friends
// @access  Private
const getFriends = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('friends', 'username email');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ friends: user.friends });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Send friend request
// @route   POST /api/friends/request
// @access  Private
const sendFriendRequest = async (req, res) => {
  try {
    const { recipientId } = req.body;

    if (!recipientId) {
      return res.status(400).json({ message: 'Recipient ID is required' });
    }

    if (recipientId === req.user.id) {
      return res.status(400).json({ message: 'Cannot send friend request to yourself' });
    }

    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ message: 'User not found' });
    }

    const sender = await User.findById(req.user.id);

    // Check if already friends
    if (sender.friends.includes(recipientId)) {
      return res.status(400).json({ message: 'Already friends with this user' });
    }

    // Check if request already sent
    if (recipient.friendRequests.some(req => req.from.toString() === sender._id.toString())) {
      return res.status(400).json({ message: 'Friend request already sent' });
    }

    // Add friend request
    recipient.friendRequests.push({ from: sender._id });
    await recipient.save();

    res.status(201).json({ message: 'Friend request sent successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Respond to friend request (accept/reject)
// @route   PUT /api/friends/request/:requestId
// @access  Private
const respondFriendRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { action } = req.body; // 'accept' or 'reject'

    if (!['accept', 'reject'].includes(action)) {
      return res.status(400).json({ message: 'Invalid action. Use "accept" or "reject"' });
    }

    const user = await User.findById(req.user.id);
    const requestIndex = user.friendRequests.findIndex(
      req => req._id.toString() === requestId
    );

    if (requestIndex === -1) {
      return res.status(404).json({ message: 'Friend request not found' });
    }

    const senderId = user.friendRequests[requestIndex].from;

    if (action === 'accept') {
      // Add each other as friends
      user.friends.push(senderId);
      await user.save();

      const sender = await User.findById(senderId);
      sender.friends.push(user._id);
      await sender.save();

      // Remove the friend request
      user.friendRequests.splice(requestIndex, 1);
      await user.save();

      res.json({ message: 'Friend request accepted' });
    } else {
      // Just remove the friend request
      user.friendRequests.splice(requestIndex, 1);
      await user.save();

      res.json({ message: 'Friend request rejected' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Remove friend
// @route   DELETE /api/friends/:friendId
// @access  Private
const removeFriend = async (req, res) => {
  try {
    const { friendId } = req.params;

    const user = await User.findById(req.user.id);
    const friend = await User.findById(friendId);

    if (!friend) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Remove from both users' friend lists
    user.friends = user.friends.filter(id => id.toString() !== friendId);
    friend.friends = friend.friends.filter(id => id.toString() !== req.user.id);

    await user.save();
    await friend.save();

    res.json({ message: 'Friend removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getFriends,
  sendFriendRequest,
  respondFriendRequest,
  removeFriend
};