// backend/sockets/chatSocket.js
const Game = require('../models/Game');

const setupChatSocket = (io) => {
  const chatNamespace = io.of('/chat');

  chatNamespace.on('connection', (socket) => {
    console.log(`User connected to chat: ${socket.username}`);

    // Join chat room for a game
    socket.on('joinChat', async ({ gameId }) => {
      try {
        const game = await Game.findById(gameId);

        if (!game) {
          return socket.emit('error', { message: 'Game not found' });
        }

        // Check if user is part of this game
        if (game.white.toString() !== socket.userId && 
            game.black.toString() !== socket.userId) {
          return socket.emit('error', { message: 'Not authorized' });
        }

        socket.join(gameId);
        socket.gameId = gameId;

        socket.emit('chatJoined', { gameId });

      } catch (error) {
        console.error(error);
        socket.emit('error', { message: 'Server error' });
      }
    });

    // Send chat message
    socket.on('sendMessage', ({ gameId, message }) => {
      if (!message || message.trim().length === 0) {
        return;
      }

      // Broadcast message to game room
      chatNamespace.to(gameId).emit('messageReceived', {
        username: socket.username,
        message: message.trim(),
        timestamp: Date.now()
      });
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log(`User disconnected from chat: ${socket.username}`);
    });
  });
};

module.exports = setupChatSocket;