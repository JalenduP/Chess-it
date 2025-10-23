// src/services/socketService.js
import { io } from 'socket.io-client';

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';

class SocketService {
  constructor() {
    this.gameSocket = null;
    this.chatSocket = null;
  }

  // Connect to game namespace
  connectGame() {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      throw new Error('No auth token found');
    }

    this.gameSocket = io(`${SOCKET_URL}/game`, {
      auth: {
        token
      }
    });

    return this.gameSocket;
  }

  // Connect to chat namespace
  connectChat() {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      throw new Error('No auth token found');
    }

    this.chatSocket = io(`${SOCKET_URL}/chat`, {
      auth: {
        token
      }
    });

    return this.chatSocket;
  }

  // Game socket methods
  joinGame(gameId) {
    if (!this.gameSocket) {
      throw new Error('Game socket not connected');
    }
    this.gameSocket.emit('joinGame', { gameId });
  }

  makeMove(gameId, from, to, promotion = 'q') {
    if (!this.gameSocket) {
      throw new Error('Game socket not connected');
    }
    this.gameSocket.emit('makeMove', { gameId, from, to, promotion });
  }

  offerDraw(gameId) {
    if (!this.gameSocket) {
      throw new Error('Game socket not connected');
    }
    this.gameSocket.emit('offerDraw', { gameId });
  }

  respondDraw(gameId, accept) {
    if (!this.gameSocket) {
      throw new Error('Game socket not connected');
    }
    this.gameSocket.emit('respondDraw', { gameId, accept });
  }

  resign(gameId) {
    if (!this.gameSocket) {
      throw new Error('Game socket not connected');
    }
    this.gameSocket.emit('resign', { gameId });
  }

  // Chat socket methods
  joinChat(gameId) {
    if (!this.chatSocket) {
      throw new Error('Chat socket not connected');
    }
    this.chatSocket.emit('joinChat', { gameId });
  }

  sendMessage(gameId, message) {
    if (!this.chatSocket) {
      throw new Error('Chat socket not connected');
    }
    this.chatSocket.emit('sendMessage', { gameId, message });
  }

  // Event listeners
  onGameState(callback) {
    if (this.gameSocket) {
      this.gameSocket.on('gameState', callback);
    }
  }

  onMoveMade(callback) {
    if (this.gameSocket) {
      this.gameSocket.on('moveMade', callback);
    }
  }

  onGameOver(callback) {
    if (this.gameSocket) {
      this.gameSocket.on('gameOver', callback);
    }
  }

  onDrawOffered(callback) {
    if (this.gameSocket) {
      this.gameSocket.on('drawOffered', callback);
    }
  }

  onDrawDeclined(callback) {
    if (this.gameSocket) {
      this.gameSocket.on('drawDeclined', callback);
    }
  }

  onError(callback) {
    if (this.gameSocket) {
      this.gameSocket.on('error', callback);
    }
    if (this.chatSocket) {
      this.chatSocket.on('error', callback);
    }
  }

  onMessageReceived(callback) {
    if (this.chatSocket) {
      this.chatSocket.on('messageReceived', callback);
    }
  }

  // Disconnect
  disconnectGame() {
    if (this.gameSocket) {
      this.gameSocket.disconnect();
      this.gameSocket = null;
    }
  }

  disconnectChat() {
    if (this.chatSocket) {
      this.chatSocket.disconnect();
      this.chatSocket = null;
    }
  }

  disconnectAll() {
    this.disconnectGame();
    this.disconnectChat();
  }
}

export default new SocketService();