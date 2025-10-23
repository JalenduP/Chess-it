// src/pages/GamePage.jsx - FULLY INTEGRATED
import React, { useMemo, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ChessboardWrapper from '../components/gamepage/ChessboardWrapper';
import PlayerCard from '../components/gamepage/PlayerCard';
import GameChat from '../components/gamepage/GameChat';
import MoveHistory from '../components/gamepage/MoveHistory';
import DrawLayoverPage from './DrawLayoverPage';
import ResignOverlay from './ResignOverlay';
import ResignResultPage from './ResignResultPage';
import DrawResultPage from './DrawResultPage';
import TimeUpPage from './TimeUpPage';
import socketService from '../services/socketService';
import gameService from '../services/gameService';
import authService from '../services/authService';
import { Chess } from 'chess.js';

export default function GamePage() {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser();

  const [activeTab, setActiveTab] = useState('chat');
  const [isOfferingDraw, setIsOfferingDraw] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Game state
  const [gameData, setGameData] = useState(null);
  const [playerColor, setPlayerColor] = useState(null);
  
  // Overlays & results
  const [incomingDraw, setIncomingDraw] = useState(null);
  const [resignOpen, setResignOpen] = useState(false);
  const [resignProcessing, setResignProcessing] = useState(false);
  const [gameOver, setGameOver] = useState(null);

  // Chess game instance
  const game = useMemo(() => new Chess(), []);
  const [fen, setFen] = useState(game.fen());

  // Time management
  const [whiteTime, setWhiteTime] = useState(0);
  const [blackTime, setBlackTime] = useState(0);

  // Initialize game and socket connection
  useEffect(() => {
    const initGame = async () => {
      try {
        // Connect sockets
        const gameSocket = socketService.connectGame();
        const chatSocket = socketService.connectChat();

        // Fetch game data
        const response = await gameService.getGame(gameId);
        
        if (response.success && response.game) {
          setGameData(response.game);
          
          // Set initial position
          if (response.game.fen) {
            game.load(response.game.fen);
            setFen(response.game.fen);
          }

          // Set times
          setWhiteTime(response.game.whiteTime || 0);
          setBlackTime(response.game.blackTime || 0);
        }

        // Join game room
        socketService.joinGame(gameId);
        socketService.joinChat(gameId);

        // Setup socket listeners
        setupSocketListeners();

        setLoading(false);
      } catch (err) {
        console.error('Failed to initialize game:', err);
        setError('Failed to load game. Redirecting...');
        setTimeout(() => navigate('/dashboard'), 3000);
      }
    };

    initGame();

    // Cleanup on unmount
    return () => {
      socketService.disconnectAll();
    };
  }, [gameId]);

  // Timer effect
  useEffect(() => {
    if (!gameData || gameData.status !== 'active' || gameOver) return;

    const interval = setInterval(() => {
      if (gameData.turn === 'white') {
        setWhiteTime(t => Math.max(0, t - 1000));
      } else {
        setBlackTime(t => Math.max(0, t - 1000));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [gameData, gameOver]);

  // Setup all socket event listeners
  const setupSocketListeners = () => {
    // Game state updates
    socketService.onGameState((data) => {
      console.log('Game state received:', data);
      setGameData(data.game);
      setPlayerColor(data.playerColor);
      
      if (data.game.fen) {
        game.load(data.game.fen);
        setFen(data.game.fen);
      }
    });

    // Move made
    socketService.onMoveMade((data) => {
      console.log('Move made:', data);
      setGameData(data.game);
      
      if (data.game.fen) {
        game.load(data.game.fen);
        setFen(data.game.fen);
      }

      // Update times
      setWhiteTime(data.game.whiteTime || 0);
      setBlackTime(data.game.blackTime || 0);
    });

    // Game over
    socketService.onGameOver((data) => {
      console.log('Game over:', data);
      setGameData(data.game);
      
      // Format game over data for result pages
      const result = {
        result: data.game.result,
        resultReason: data.game.resultReason,
        winnerName: data.game.result === 'white_wins' ? 
          data.game.white.username : data.game.black.username,
        loserName: data.game.result === 'white_wins' ? 
          data.game.black.username : data.game.white.username,
        winnerRating: data.game.result === 'white_wins' ? 
          data.game.white.rating : data.game.black.rating,
        loserRating: data.game.result === 'white_wins' ? 
          data.game.black.rating : data.game.white.rating,
        winnerDelta: data.game.result === 'white_wins' ? 
          data.game.whiteRatingChange : data.game.blackRatingChange,
        loserDelta: data.game.result === 'white_wins' ? 
          data.game.blackRatingChange : data.game.whiteRatingChange,
        timeControl: `${data.game.timeControl.minutes}+${data.game.timeControl.increment}`,
        movesPlayed: data.game.moves?.length || 0,
        duration: '—', // Calculate if needed
        finalPgn: data.game.pgn || '',
      };

      if (data.game.result === 'draw') {
        result.playerWhiteName = data.game.white.username;
        result.playerBlackName = data.game.black.username;
        result.whiteRating = data.game.white.rating;
        result.blackRating = data.game.black.rating;
        result.reason = data.game.resultReason;
      }

      setGameOver(result);
    });

    // Draw offered
    socketService.onDrawOffered((data) => {
      console.log('Draw offered:', data);
      setIncomingDraw({
        by: data.by,
        expiresAt: data.expiresAt
      });
    });

    // Draw declined
    socketService.onDrawDeclined(() => {
      console.log('Draw declined');
      setIncomingDraw(null);
      alert('Draw offer declined');
    });

    // Errors
    socketService.onError((data) => {
      console.error('Socket error:', data);
      setError(data.message);
      setTimeout(() => setError(''), 5000);
    });
  };

  // Handle piece drop
  function onDrop(sourceSquare, targetSquare) {
    // Check if it's player's turn
    if (!gameData || gameData.status !== 'active') return false;
    if (playerColor !== gameData.turn) return false;

    try {
      const move = game.move({ 
        from: sourceSquare, 
        to: targetSquare, 
        promotion: 'q' 
      });
      
      if (!move) return false;

      // Optimistically update UI
      setFen(game.fen());

      // Send move to server
      socketService.makeMove(gameId, sourceSquare, targetSquare, 'q');

      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  // Handle draw offer
  function handleOfferDraw() {
    setIsOfferingDraw(true);
    socketService.offerDraw(gameId);
    
    setTimeout(() => {
      setIsOfferingDraw(false);
    }, 800);
  }

  // Handle resign
  function openResign() { 
    setResignOpen(true); 
  }
  
  function cancelResign() { 
    setResignOpen(false); 
  }

  function confirmResign() {
    setResignProcessing(true);
    socketService.resign(gameId);
  }

  // Handle draw response
  function handleDrawRespond(accept) {
    socketService.respondDraw(gameId, accept);
    setIncomingDraw(null);
  }

  // Format time display
  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400 mb-4"></div>
          <p className="text-white text-lg">Loading game...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !gameData) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-lg mb-4">{error}</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 bg-yellow-400 text-black rounded-lg font-semibold"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Waiting for opponent
  if (gameData && gameData.status === 'waiting') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400 mb-4"></div>
          <p className="text-white text-lg">Waiting for opponent...</p>
          <p className="text-gray-400 text-sm mt-2">
            Time Control: {gameData.timeControl.minutes}+{gameData.timeControl.increment}
          </p>
        </div>
      </div>
    );
  }

  const whitePlayer = gameData?.white;
  const blackPlayer = gameData?.black;
  const isWhite = playerColor === 'white';

  return (
    <div className="min-h-screen flex flex-col bg-black">
      {/* Overlays & result pages */}
      <DrawLayoverPage 
        incomingDraw={incomingDraw} 
        onRespond={handleDrawRespond} 
        onClose={() => setIncomingDraw(null)} 
      />
      <ResignOverlay 
        open={resignOpen} 
        onConfirm={confirmResign} 
        onCancel={cancelResign} 
        processing={resignProcessing} 
      />
      <ResignResultPage 
        gameOver={gameOver?.result === 'resignation' ? gameOver : null} 
        onPlayAgain={() => navigate('/dashboard')} 
        onBack={() => navigate('/dashboard')} 
      />
      <DrawResultPage 
        gameOver={gameOver?.result === 'draw' ? gameOver : null} 
        onPlayAgain={() => navigate('/dashboard')} 
        onBack={() => navigate('/dashboard')} 
      />
      <TimeUpPage 
        gameOver={gameOver?.result === 'timeout' ? gameOver : null} 
        onPlayAgain={() => navigate('/dashboard')} 
        onBack={() => navigate('/dashboard')} 
      />

      {/* Error banner */}
      {error && (
        <div className="bg-red-500/20 border-b border-red-500 px-4 py-3 text-red-300 text-sm">
          {error}
        </div>
      )}

      <div className="flex-grow grid grid-cols-12 gap-4 p-4">
        {/* Left Panel */}
        <div className="col-span-12 lg:col-span-3 order-2 lg:order-1 space-y-4">
          <PlayerCard 
            name={isWhite ? blackPlayer?.username : whitePlayer?.username} 
            rating={isWhite ? blackPlayer?.rating : whitePlayer?.rating} 
            time={formatTime(isWhite ? blackTime : whiteTime)} 
            isOpponent={true} 
          />
          
          <div className="w-full max-w-sm mx-auto p-4"></div>
          
          <PlayerCard 
            name={isWhite ? whitePlayer?.username : blackPlayer?.username} 
            rating={isWhite ? whitePlayer?.rating : blackPlayer?.rating} 
            time={formatTime(isWhite ? whiteTime : blackTime)} 
          />

          {/* Action buttons */}
          {gameData?.status === 'active' && (
            <div className="flex space-x-2">
              <button 
                onClick={handleOfferDraw} 
                disabled={isOfferingDraw} 
                className={`w-1/2 py-3 rounded-lg ${isOfferingDraw ? 'bg-yellow-600 text-black' : 'bg-gray-700 text-white hover:bg-gray-600'} disabled:opacity-50`}
              >
                {isOfferingDraw ? 'Offering...' : 'Offer Draw'}
              </button>

              <button 
                onClick={openResign} 
                className="w-1/2 py-3 bg-red-700 text-white rounded-lg hover:bg-red-600"
              >
                Resign
              </button>
            </div>
          )}
        </div>

        {/* Center Panel - Chessboard */}
        <div className="col-span-12 lg:col-span-6 order-1 lg:order-2 flex items-center justify-center">
          <div className="w-full aspect-square">
            <ChessboardWrapper 
              id="PlayVsPlayer" 
              position={fen} 
              onPieceDrop={onDrop}
              boardOrientation={playerColor === 'black' ? 'black' : 'white'}
            />
          </div>
        </div>

        {/* Right Panel - Chat/Moves */}
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

          <div className="flex-grow overflow-y-auto">
            {activeTab === 'moves' ? (
              <MoveHistory moves={gameData?.moves || []} />
            ) : (
              <GameChat gameId={gameId} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}