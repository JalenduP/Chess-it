import React, { useState } from 'react';
import { IoSend } from 'react-icons/io5'; // using react-icons for the paper-plane icon

export default function GameChat() {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (!message.trim()) return;
    console.log('Send:', message); // 🔹 Replace with socket.emit('sendChat', { gameId, text: message });
    setMessage('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat messages */}
      <div className="flex-grow p-4 space-y-4 overflow-y-auto">
        <div>
          <span className="font-bold text-gray-400">Opponent: </span>
          <span className="text-white">Good luck!</span>
        </div>
        <div>
          <span className="font-bold text-yellow-400">You: </span>
          <span className="text-white">You too!</span>
        </div>
      </div>

      {/* Input + Send button */}
      <div className="flex border-t border-gray-600">
        <input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-grow px-4 py-3 text-white bg-gray-700 focus:outline-none"
        />
        <button
          onClick={handleSend}
          className="px-5 bg-gray-700 text-yellow-400 hover:bg-gray-600 flex items-center justify-center"
        >
          <IoSend size={22} />
        </button>
      </div>
    </div>
  );
}
