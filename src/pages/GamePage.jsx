import React, { useState, useMemo } from 'react'; // Import hooks
import { Header } from '../components/Header';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js'; // Import the game logic

// --- (Keep your PlayerCard, GameChat, and MoveHistory components here) ---
const PlayerCard = ({ name, rating, time, isOpponent = false }) => (
  <div className={`p-4 bg-gray-800 rounded-lg ${isOpponent ? 'opacity-70' : ''}`}>
    <div className="flex justify-between items-center">
      <span className="text-xl font-semibold text-white">{name}</span>
      <span className="text-lg text-gray-400">{rating}</span>
    </div>
    <div className="text-4xl font-bold text-white font-mono mt-2">
      {time}
    </div>
  </div>
);
const GameChat = () => (
  <div className="flex flex-col h-full">
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
    <input
      type="text"
      placeholder="Type a message..."
      className="w-full px-4 py-3 text-white bg-gray-700 border-t border-gray-600 focus:outline-none"
    />
  </div>
);
const MoveHistory = () => (
  <div className="p-4 overflow-y-auto">
    <div className="grid grid-cols-3 gap-x-4 gap-y-1 text-white">
      <span className="text-gray-400">1.</span>
      <span>e4</span>
      <span>e5</span>
    </div>
  </div>
);
// --- (End of components) ---


const GamePage = () => {
  const [activeTab, setActiveTab] = useState('chat');
  
  // Create a new chess game instance
  // useMemo ensures this only happens once
  const game = useMemo(() => new Chess(), []);

  // Create a state to store the board's current position (FEN string)
  const [fen, setFen] = useState(game.fen());

  // This function is called when a player drops a piece
  function onDrop(sourceSquare, targetSquare) {
    try {
      const move = game.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: 'q', // Always promote to a queen for simplicity
      });

      // If the move is illegal, chess.js returns null
      if (move === null) return false;

      // Update the board state
      setFen(game.fen());

      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-black">
      <Header />
      
      <div className="flex-grow grid grid-cols-12 gap-4 p-4">

        {/* Left Panel: Player Info & Actions */}
        <div className="col-span-12 lg:col-span-3 order-2 lg:order-1 space-y-4">
          <PlayerCard name="Opponent" rating={1950} time="04:45" isOpponent={true} />
          <div className="w-full max-w-sm mx-auto p-4"></div>
          <PlayerCard name="Jalendu" rating={1945} time="04:52" />
          <div className="flex space-x-2">
            <button className="w-1/2 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600">
              Offer Draw
            </button>
            <button className="w-1/2 py-3 bg-red-700 text-white rounded-lg hover:bg-red-600">
              Resign
            </button>
          </div>
        </div>

        {/* Center Panel: Chessboard */}
        <div className="col-span-12 lg:col-span-6 order-1 lg:order-2 flex items-center justify-center">
          <div className="w-full aspect-square">
            <Chessboard
              id="PlayVsPlayer"
              position={fen}
              onPieceDrop={onDrop}
            />
          </div>
        </div>

        {/* Right Panel: Chat & Moves */}
        <div className="col-span-12 lg:col-span-3 order-3 lg:order-3 bg-gray-900 rounded-2xl border border-gray-800 flex flex-col overflow-hidden">
          <div className="flex border-b border-gray-700">
            <button
              onClick={() => setActiveTab('moves')}
              className={`w-1/2 py-3 font-medium ${activeTab === 'moves' ? 'text-yellow-400 bg-gray-800' : 'text-gray-400 hover:bg-gray-800'}`}
            >
              Moves
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={`w-1/2 py-3 font-medium ${activeTab === 'chat' ? 'text-yellow-400 bg-gray-800' : 'text-gray-400 hover:bg-gray-800'}`}
            >
              Chat
            </button>
          </div>
          <div className="flex-grow">
            {activeTab === 'moves' ? <MoveHistory /> : <GameChat />}
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default GamePage;