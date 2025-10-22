// src/GamePage.jsx
import React, { useMemo, useState } from 'react';
import ChessboardWrapper from '../components/gamepage/ChessboardWrapper';
import PlayerCard from '../components/gamepage/PlayerCard';
import GameChat from '../components/gamepage/GameChat';
import MoveHistory from '../components/gamepage/MoveHistory';
import DrawLayoverPage from './/DrawLayoverPage';
import ResignOverlay from './ResignOverlay';
import ResignResultPage from './ResignResultPage';
import DrawResultPage from './DrawResultPage';
import TimeUpPage from './TimeUpPage';
import { Chess } from 'chess.js';

export default function GamePage() {
  const [activeTab, setActiveTab] = useState('chat');
  const [isOfferingDraw, setIsOfferingDraw] = useState(false);

  // overlays & results
  const [incomingDraw, setIncomingDraw] = useState(null);
  const [resignOpen, setResignOpen] = useState(false);
  const [resignProcessing, setResignProcessing] = useState(false);
  const [gameOver, setGameOver] = useState(null);

  // chess game instance
  const game = useMemo(() => new Chess(), []);
  const [fen, setFen] = useState(game.fen());

  function onDrop(sourceSquare, targetSquare) {
    try {
      const move = game.move({ from: sourceSquare, to: targetSquare, promotion: 'q' });
      if (!move) return false;
      setFen(game.fen());

      // TODO (Phase 2): socket.emit('makeMove', { gameId, from: sourceSquare, to: targetSquare });

      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  function handleOfferDraw() {
    setIsOfferingDraw(true);

    // TODO (Phase 2): socket.emit('offerDraw', { gameId });

    setTimeout(() => {
      setIsOfferingDraw(false);
      // DO NOT set incomingDraw here in production. Server must notify opponent.
    }, 800);
  }

  function openResign() { setResignOpen(true); }
  function cancelResign() { setResignOpen(false); }

  function confirmResign() {
    setResignProcessing(true);

    // TODO (Phase 2): socket.emit('resign', { gameId }, (ack) => { ... })
    // simulate server reply locally:
    setTimeout(() => {
      setResignProcessing(false);
      setResignOpen(false);

      setGameOver({
        result: 'resignation',
        winnerName: 'Opponent',
        loserName: 'You',
        winnerRating: 1950,
        loserRating: 1945,
        winnerDelta: +12,
        loserDelta: -8,
        timeControl: '5+0',
        movesPlayed: game && typeof game.history === 'function' ? game.history().length : 0,
        duration: '—',
        finalPgn: game && typeof game.pgn === 'function' ? game.pgn() : '',
      });
    }, 900);
  }

  function handleDrawRespond(accept) {
    // TODO (Phase 2): socket.emit('respondDraw', { gameId, accept });
    if (accept) {
      setGameOver({
        result: 'draw',
        reason: 'draw by agreement',
        playerWhiteName: 'White',
        playerBlackName: 'Black',
        whiteRating: 1950,
        blackRating: 1945,
        timeControl: '5+0',
        movesPlayed: game && typeof game.history === 'function' ? game.history().length : 0,
        duration: '—',
        finalPgn: game && typeof game.pgn === 'function' ? game.pgn() : '',
      });
    } else {
      setIncomingDraw(null);
    }
  }

  // DEV-only: simulate timeout (for testing)
  function simulateTimeout() {
    setGameOver({
      result: 'timeout',
      winnerName: 'Opponent',
      loserName: 'You',
      winnerRating: 1950,
      loserRating: 1945,
      winnerDelta: +12,
      loserDelta: -8,
      timeControl: '5+0',
      movesPlayed: game && typeof game.history === 'function' ? game.history().length : 0,
      duration: '3:47',
      finalPgn: game && typeof game.pgn === 'function' ? game.pgn() : '',
    });
  }

  // DEV-only: simulate opponent accepted draw
  function simulateDrawAccepted() {
    setGameOver({
      result: 'draw',
      reason: 'draw by agreement',
      playerWhiteName: 'White',
      playerBlackName: 'Black',
      whiteRating: 1950,
      blackRating: 1945,
      timeControl: '5+0',
      movesPlayed: game && typeof game.history === 'function' ? game.history().length : 0,
      duration: '—',
      finalPgn: game && typeof game.pgn === 'function' ? game.pgn() : '',
    });
  }

  return (
    <div className="min-h-screen flex flex-col bg-black">
      {/* Overlays & result pages */}
      <DrawLayoverPage incomingDraw={incomingDraw} onRespond={handleDrawRespond} onClose={() => setIncomingDraw(null)} />
      <ResignOverlay open={resignOpen} onConfirm={confirmResign} onCancel={cancelResign} processing={resignProcessing} />
      <ResignResultPage gameOver={gameOver} onPlayAgain={() => window.location.reload()} onBack={() => (window.location.href = '/')} />
      <DrawResultPage gameOver={gameOver} onPlayAgain={() => window.location.reload()} onBack={() => (window.location.href = '/')} />
      <TimeUpPage gameOver={gameOver} onPlayAgain={() => window.location.reload()} onBack={() => (window.location.href = '/')} />

      <div className="flex-grow grid grid-cols-12 gap-4 p-4">
        {/* Left Panel */}
        <div className="col-span-12 lg:col-span-3 order-2 lg:order-1 space-y-4">
          <PlayerCard name="Opponent" rating={1950} time="04:45" isOpponent={true} />
          <div className="w-full max-w-sm mx-auto p-4"></div>
          <PlayerCard name="Jalendu" rating={1945} time="04:52" />

          {/* Offer Draw / Resign buttons */}
          <div className="flex space-x-2">
            <button onClick={handleOfferDraw} disabled={isOfferingDraw} className={`w-1/2 py-3 rounded-lg ${isOfferingDraw ? 'bg-yellow-600 text-black' : 'bg-gray-700 text-white hover:bg-gray-600'}`}>
              {isOfferingDraw ? 'Offering...' : 'Offer Draw'}
            </button>

            <button onClick={() => setResignOpen(true)} className="w-1/2 py-3 bg-red-700 text-white rounded-lg hover:bg-red-600">Resign</button>
          </div>

          {/* DEV-only helpers (remove in production) */}
          <div className="mt-3 space-y-2">
            <button onClick={() => setIncomingDraw({ by: 'Opponent', expiresAt: Date.now() + 30000 })} className="text-xs text-gray-400 underline">Simulate incoming draw (dev)</button>
            <div className="flex gap-2">
              <button onClick={simulateDrawAccepted} className="text-xs px-2 py-1 bg-gray-700 rounded text-white">Simulate Draw Result</button>
              <button onClick={simulateTimeout} className="text-xs px-2 py-1 bg-gray-700 rounded text-white">Simulate Timeout Result</button>
            </div>
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
            <button onClick={() => setActiveTab('moves')} className={`w-1/2 py-3 font-medium ${activeTab === 'moves' ? 'text-yellow-400 bg-gray-800' : 'text-gray-400 hover:bg-gray-800'}`}>Moves</button>
            <button onClick={() => setActiveTab('chat')} className={`w-1/2 py-3 font-medium ${activeTab === 'chat' ? 'text-yellow-400 bg-gray-800' : 'text-gray-400 hover:bg-gray-800'}`}>Chat</button>
          </div>

          <div className="flex-grow">
            {activeTab === 'moves' ? <MoveHistory /> : <GameChat />}
          </div>
        </div>
      </div>
    </div>
  );
}
