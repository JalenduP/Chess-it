// backend/utils/gameHelpers.js
const { Chess } = require('chess.js');

/**
 * Validate a chess move
 */
const validateMove = (fen, from, to, promotion) => {
  try {
    const chess = new Chess(fen);
    
    // Attempt the move
    const move = chess.move({
      from,
      to,
      promotion: promotion || 'q' // Default to queen
    });

    if (!move) {
      return { valid: false };
    }

    return {
      valid: true,
      newFen: chess.fen(),
      san: move.san,
      isCheck: chess.inCheck(),
      isCheckmate: chess.isCheckmate(),
      isStalemate: chess.isStalemate(),
      isDraw: chess.isDraw(),
      isThreefoldRepetition: chess.isThreefoldRepetition(),
      isInsufficientMaterial: chess.isInsufficientMaterial()
    };
  } catch (error) {
    console.error('Move validation error:', error);
    return { valid: false };
  }
};

/**
 * Calculate remaining time after a move
 */
const calculateTimeAfterMove = (currentTime, increment, lastMoveTime) => {
  if (!lastMoveTime) {
    return currentTime; // First move
  }

  const timeTaken = Date.now() - lastMoveTime;
  const newTime = currentTime - timeTaken + (increment * 1000); // increment is in seconds

  return Math.max(0, newTime); // Don't go below 0
};

/**
 * Generate PGN (Portable Game Notation) from moves
 */
const generatePGN = (moves, whitePlayer, blackPlayer, result) => {
  let pgn = `[Event "Chess.it Game"]\n`;
  pgn += `[Site "Chess.it"]\n`;
  pgn += `[Date "${new Date().toISOString().split('T')[0]}"]\n`;
  pgn += `[White "${whitePlayer}"]\n`;
  pgn += `[Black "${blackPlayer}"]\n`;
  pgn += `[Result "${result}"]\n\n`;

  // Add moves
  for (let i = 0; i < moves.length; i++) {
    if (i % 2 === 0) {
      pgn += `${Math.floor(i / 2) + 1}. `;
    }
    pgn += `${moves[i].san} `;
  }

  pgn += result;

  return pgn;
};

/**
 * Check if time has run out
 */
const checkTimeOut = (game) => {
  if (game.status !== 'active') {
    return { timeOut: false };
  }

  const now = Date.now();
  const timeSinceLastMove = now - game.lastMoveTime;

  if (game.turn === 'white') {
    const whiteTimeRemaining = game.whiteTime - timeSinceLastMove;
    if (whiteTimeRemaining <= 0) {
      return { timeOut: true, loser: 'white' };
    }
  } else {
    const blackTimeRemaining = game.blackTime - timeSinceLastMove;
    if (blackTimeRemaining <= 0) {
      return { timeOut: true, loser: 'black' };
    }
  }

  return { timeOut: false };
};

/**
 * Get current time remaining for both players
 */
const getCurrentTimes = (game) => {
  if (game.status !== 'active') {
    return {
      whiteTime: game.whiteTime,
      blackTime: game.blackTime
    };
  }

  const now = Date.now();
  const timeSinceLastMove = now - game.lastMoveTime;

  if (game.turn === 'white') {
    return {
      whiteTime: Math.max(0, game.whiteTime - timeSinceLastMove),
      blackTime: game.blackTime
    };
  } else {
    return {
      whiteTime: game.whiteTime,
      blackTime: Math.max(0, game.blackTime - timeSinceLastMove)
    };
  }
};

module.exports = {
  validateMove,
  calculateTimeAfterMove,
  generatePGN,
  checkTimeOut,
  getCurrentTimes
};