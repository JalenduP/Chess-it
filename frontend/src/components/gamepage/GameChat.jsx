// src/components/gamepage/GameChat.jsx
import React, { useState, useEffect, useRef } from 'react';
import { IoSend } from 'react-icons/io5';
import socketService from '../../services/socketService';
import authService from '../../services/authService';

export default function GameChat({ gameId }) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const currentUser = authService.getCurrentUser();

  useEffect(() => {
    // Listen for incoming messages
    socketService.onMessageReceived((data) => {
      setMessages(prev => [...prev, {
        username: data.username,
        text: data.message,
        timestamp: data.timestamp,
        isMe: data.username === currentUser?.username
      }]);
    });

    // Scroll to bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentUser]);

  const handleSend = () => {
    if (!message.trim()) return;
    
    // Send message via socket
    socketService.sendMessage(gameId, message.trim());
    
    setMessage('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat messages */}
      <div className="flex-grow p-4 space-y-3 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="text-center text-gray-400 py-8 text-sm">
            No messages yet. Say hello to your opponent!
          </div>
        ) : (
          messages.map((msg, index) => (
            <div 
              key={index} 
              className={`${msg.isMe ? 'text-right' : 'text-left'}`}
            >
              <div className={`inline-block max-w-[80%] rounded-lg px-3 py-2 ${
                msg.isMe 
                  ? 'bg-yellow-600 text-white' 
                  : 'bg-gray-700 text-white'
              }`}>
                <div className="text-xs opacity-75 mb-1">
                  {msg.isMe ? 'You' : msg.username}
                </div>
                <div className="break-words">{msg.text}</div>
                <div className="text-xs opacity-50 mt-1">
                  {formatTime(msg.timestamp)}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input + Send button */}
      <div className="flex border-t border-gray-600">
        <input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          maxLength={200}
          className="flex-grow px-4 py-3 text-white bg-gray-700 focus:outline-none placeholder-gray-400"
        />
        <button
          onClick={handleSend}
          disabled={!message.trim()}
          className="px-5 bg-gray-700 text-yellow-400 hover:bg-gray-600 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <IoSend size={22} />
        </button>
      </div>
    </div>
  );
}