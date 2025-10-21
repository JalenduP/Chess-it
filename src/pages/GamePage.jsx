import React, { useMemo, useState } from 'react';
import ChessboardWrapper from '../components/gamepage/ChessboardWrapper';
import PlayerCard from '../components/gamepage/PlayerCard';
import GameChat from '../components/gamepage/GameChat';
import MoveHistory from '../components/gamepage/MoveHistory';
import DrawLayoverPage from './DrawLayoverPage'; // ✅ imported here
import { Chess } from 'chess.js';

export default function GamePage() {
  const [activeTab, setActiveTab] = useState('chat');
  const [isOfferingDraw, setIsOfferingDraw] = useState(false);

  // ✅ for draw overlay simulation
  const [incomingDraw, setIncomingDraw] = useState(null);
  const [gameOver, setGameOver] = useState(null);

  // single chess game instance
  const game = useMemo(() => new Chess(), []);
  const [fen, setFen] = useState(game.fen());

  function onDrop(sourceSquare, targetSquare) {
    try {
      const move = game.move({ from: sourceSquare, to: targetSquare, promotion: 'q' });
      if (!move) return false;
      setFen(game.fen());

      // TODO: when sockets are added, emit this move to backend here
      // socket.emit('makeMove', { from: sourceSquare, to: targetSquare });

      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  function handleOfferDraw() {
    // disable button briefly
    setIsOfferingDraw(true);

    // TODO: in Phase 2, emit draw offer to backend here
    // socket.emit('offerDraw', { gameId });

    // simulate small delay for now
    setTimeout(() => {
      setIsOfferingDraw(false);
      // simulate incoming draw offer for opponent (local test)
      setIncomingDraw({ by: 'Opponent', expiresAt: Date.now() + 30000 });
    }, 1000);
  }

  function handleResign() {
    // TODO: in Phase 2, emit resign event to backend here
    // socket.emit('resign', { gameId });

    alert('You resigned (placeholder — backend will handle result)');
  }

  // ✅ Function that handles draw response from DrawLayoverPage
  function handleRespond(accept) {
    if (accept) {
      // local behavior: set gameOver locally, update chess.js as needed
      setGameOver({ result: '1/2-1/2', reason: 'draw by agreement' });
    } else {
      setIncomingDraw(null);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-black">
      {/* Header removed */}

      {/* ✅ Draw offer overlay (visible when incomingDraw is set)
          This will be triggered when opponent offers a draw */}
      <DrawLayoverPage
        incomingDraw={incomingDraw}
        onRespond={handleRespond}
        onClose={() => setIncomingDraw(null)}
      />

      <div className="flex-grow grid grid-cols-12 gap-4 p-4">
        {/* Left Panel */}
        <div className="col-span-12 lg:col-span-3 order-2 lg:order-1 space-y-4">
          <PlayerCard name="Opponent" rating={1950} time="04:45" isOpponent={true} />
          <div className="w-full max-w-sm mx-auto p-4"></div>
          <PlayerCard name="Jalendu" rating={1945} time="04:52" />

          {/* Offer Draw / Resign buttons */}
          <div className="flex space-x-2">
            <button
              onClick={handleOfferDraw}
              disabled={isOfferingDraw}
              className={`w-1/2 py-3 rounded-lg ${
                isOfferingDraw
                  ? 'bg-yellow-600 text-black'
                  : 'bg-gray-700 text-white hover:bg-gray-600'
              }`}
            >
              {isOfferingDraw ? 'Offering...' : 'Offer Draw'}
            </button>

            <button
              onClick={handleResign}
              className="w-1/2 py-3 bg-red-700 text-white rounded-lg hover:bg-red-600"
            >
              Resign
            </button>
          </div>
        </div>

        {/* Center Panel */}
        <div className="col-span-12 lg:col-span-6 order-1 lg:order-2 flex items-center justify-center">
          <div className="w-full aspect-square">
            <ChessboardWrapper id="PlayVsPlayer" position={fen} onPieceDrop={onDrop} />
          </div>
        </div>

        {/* Right Panel */}
        <div className="col-span-12 lg:col-span-3 order-3 lg:order-3 bg-gray-900 rounded-2xl border border-gray-800 flex flex-col overflow-hidden">
          <div className="flex border-b border-gray-700">
            <button
              onClick={() => setActiveTab('moves')}
              className={`w-1/2 py-3 font-medium ${
                activeTab === 'moves'
                  ? 'text-yellow-400 bg-gray-800'
                  : 'text-gray-400 hover:bg-gray-800'
              }`}
            >
              Moves
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={`w-1/2 py-3 font-medium ${
                activeTab === 'chat'
                  ? 'text-yellow-400 bg-gray-800'
                  : 'text-gray-400 hover:bg-gray-800'
              }`}
            >
              Chat
            </button>
          </div>

          <div className="flex-grow">
            {/* TODO: Later connect chat input to socket messages */}
            {activeTab === 'moves' ? <MoveHistory /> : <GameChat />}
          </div>
        </div>
      </div>
    </div>
  );
}
