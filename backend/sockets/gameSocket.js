// backend/sockets/gameSocket.js
const Game = require('../models/Game');
const User = require('../models/User');
const { validateMove, calculateTimeAfterMove, generatePGN } = require('../utils/gameHelpers');
const { calculateEloChange } = require('../utils/eloRating');

const setupGameSocket = (io) => {
  const gameNamespace = io.of('/game');

  gameNamespace.on('connection', (socket) => {
    console.log(`User connected to game: ${socket.username}`);

    // Join a game room
    socket.on('joinGame', async ({ gameId }) => {
      try {
        const game = await Game.findById(gameId)
          .populate('white', 'username rating')
          .populate('black', 'username rating');

        if (!game) {
          return socket.emit('error', { message: 'Game not found' });
        }

        // Check if user is part of this game
        if (game.white._id.toString() !== socket.userId && 
            game.black._id.toString() !== socket.userId) {
          return socket.emit('error', { message: 'Not authorized' });
        }

        socket.join(gameId);
        socket.gameId = gameId;

        // Determine player color
        socket.playerColor = game.white._id.toString() === socket.userId ? 'white' : 'black';

        // Send current game state
        socket.emit('gameState', {
          game,
          playerColor: socket.playerColor
        });

        // Notify opponent
        socket.to(gameId).emit('opponentJoined', {
          username: socket.username
        });

      } catch (error) {
        console.error(error);
        socket.emit('error', { message: 'Server error' });
      }
    });

    // Make a move
    socket.on('makeMove', async ({ gameId, from, to, promotion }) => {
      try {
        const game = await Game.findById(gameId);

        if (!game || game.status !== 'active') {
          return socket.emit('error', { message: 'Game not found or not active' });
        }

        // Check if it's player's turn
        const playerColor = game.white.toString() === socket.userId ? 'white' : 'black';
        if (game.turn !== playerColor) {
          return socket.emit('error', { message: 'Not your turn' });
        }

        // Validate move
        const moveResult = validateMove(game.fen, from, to, promotion);

        if (!moveResult.valid) {
          return socket.emit('error', { message: 'Invalid move' });
        }

        // Calculate time after move
        const timeField = playerColor === 'white' ? 'whiteTime' : 'blackTime';
        game[timeField] = calculateTimeAfterMove(
          game[timeField],
          game.timeControl.increment,
          game.lastMoveTime
        );

        // Update game state
        game.fen = moveResult.newFen;
        game.moves.push({
          from,
          to,
          san: moveResult.san,
          timestamp: Date.now()
        });
        game.turn = playerColor === 'white' ? 'black' : 'white';
        game.lastMoveTime = Date.now();

        // Check for game end conditions
        let gameEnded = false;
        let result = null;
        let resultReason = null;

        if (moveResult.isCheckmate) {
          gameEnded = true;
          result = playerColor === 'white' ? 'white_wins' : 'black_wins';
          resultReason = 'checkmate';
        } else if (moveResult.isStalemate) {
          gameEnded = true;
          result = 'draw';
          resultReason = 'stalemate';
        } else if (moveResult.isThreefoldRepetition) {
          gameEnded = true;
          result = 'draw';
          resultReason = 'threefold_repetition';
        } else if (moveResult.isInsufficientMaterial) {
          gameEnded = true;
          result = 'draw';
          resultReason = 'insufficient_material';
        }

        if (gameEnded) {
          game.status = 'completed';
          game.result = result;
          game.resultReason = resultReason;
          game.completedAt = Date.now();

          // Calculate ELO changes
          const whitePlayer = await User.findById(game.white);
          const blackPlayer = await User.findById(game.black);

          const whiteScore = result === 'white_wins' ? 1 : result === 'draw' ? 0.5 : 0;
          const { whiteChange, blackChange } = calculateEloChange(
            whitePlayer.rating,
            blackPlayer.rating,
            whiteScore
          );

          game.whiteRatingChange = whiteChange;
          game.blackRatingChange = blackChange;

          // Update player stats
          whitePlayer.rating += whiteChange;
          blackPlayer.rating += blackChange;

          if (result === 'white_wins') {
            whitePlayer.wins += 1;
            blackPlayer.losses += 1;
          } else if (result === 'black_wins') {
            blackPlayer.wins += 1;
            whitePlayer.losses += 1;
          } else {
            whitePlayer.draws += 1;
            blackPlayer.draws += 1;
          }

          await whitePlayer.save();
          await blackPlayer.save();

          // Generate PGN
          game.pgn = generatePGN(
            game.moves,
            whitePlayer.username,
            blackPlayer.username,
            result === 'white_wins' ? '1-0' : result === 'black_wins' ? '0-1' : '1/2-1/2'
          );
        }

        await game.save();

        // Broadcast move to both players
        const populatedGame = await Game.findById(gameId)
          .populate('white', 'username rating')
          .populate('black', 'username rating');

        gameNamespace.to(gameId).emit('moveMade', {
          game: populatedGame,
          move: {
            from,
            to,
            san: moveResult.san
          }
        });

        if (gameEnded) {
          gameNamespace.to(gameId).emit('gameOver', {
            game: populatedGame
          });
        }

      } catch (error) {
        console.error(error);
        socket.emit('error', { message: 'Server error' });
      }
    });

    // Offer draw
    socket.on('offerDraw', async ({ gameId }) => {
      try {
        const game = await Game.findById(gameId);

        if (!game || game.status !== 'active') {
          return socket.emit('error', { message: 'Game not found or not active' });
        }

        const playerColor = game.white.toString() === socket.userId ? 'white' : 'black';

        // Set draw offer
        game.drawOffer = {
          by: playerColor,
          timestamp: Date.now(),
          expiresAt: Date.now() + 30000 // 30 seconds
        };

        await game.save();

        // Notify opponent
        socket.to(gameId).emit('drawOffered', {
          by: socket.username,
          expiresAt: game.drawOffer.expiresAt
        });

        socket.emit('drawOfferSent');

      } catch (error) {
        console.error(error);
        socket.emit('error', { message: 'Server error' });
      }
    });

    // Respond to draw offer
    socket.on('respondDraw', async ({ gameId, accept }) => {
      try {
        const game = await Game.findById(gameId);

        if (!game || game.status !== 'active') {
          return socket.emit('error', { message: 'Game not found or not active' });
        }

        if (!game.drawOffer || !game.drawOffer.by) {
          return socket.emit('error', { message: 'No draw offer' });
        }

        const playerColor = game.white.toString() === socket.userId ? 'white' : 'black';

        // Can't respond to own draw offer
        if (game.drawOffer.by === playerColor) {
          return socket.emit('error', { message: 'Cannot respond to own draw offer' });
        }

        if (accept) {
          // Accept draw
          game.status = 'completed';
          game.result = 'draw';
          game.resultReason = 'agreement';
          game.completedAt = Date.now();

          // Calculate ELO changes for draw
          const whitePlayer = await User.findById(game.white);
          const blackPlayer = await User.findById(game.black);

          const { whiteChange, blackChange } = calculateEloChange(
            whitePlayer.rating,
            blackPlayer.rating,
            0.5 // Draw score
          );

          game.whiteRatingChange = whiteChange;
          game.blackRatingChange = blackChange;

          // Update player stats
          whitePlayer.rating += whiteChange;
          blackPlayer.rating += blackChange;
          whitePlayer.draws += 1;
          blackPlayer.draws += 1;

          await whitePlayer.save();
          await blackPlayer.save();

          // Generate PGN
          game.pgn = generatePGN(
            game.moves,
            whitePlayer.username,
            blackPlayer.username,
            '1/2-1/2'
          );

          await game.save();

          const populatedGame = await Game.findById(gameId)
            .populate('white', 'username rating')
            .populate('black', 'username rating');

          gameNamespace.to(gameId).emit('gameOver', {
            game: populatedGame
          });
        } else {
          // Decline draw
          game.drawOffer = {
            by: null,
            timestamp: null,
            expiresAt: null
          };
          await game.save();

          socket.to(gameId).emit('drawDeclined');
          socket.emit('drawOfferDeclined');
        }

      } catch (error) {
        console.error(error);
        socket.emit('error', { message: 'Server error' });
      }
    });

    // Resign
    socket.on('resign', async ({ gameId }) => {
      try {
        const game = await Game.findById(gameId);

        if (!game || game.status !== 'active') {
          return socket.emit('error', { message: 'Game not found or not active' });
        }

        const playerColor = game.white.toString() === socket.userId ? 'white' : 'black';

        // Update game result
        game.result = playerColor === 'white' ? 'black_wins' : 'white_wins';
        game.resultReason = 'resignation';
        game.status = 'completed';
        game.completedAt = Date.now();

        // Calculate ELO changes
        const whitePlayer = await User.findById(game.white);
        const blackPlayer = await User.findById(game.black);

        const { whiteChange, blackChange } = calculateEloChange(
          whitePlayer.rating,
          blackPlayer.rating,
          game.result === 'white_wins' ? 1 : 0
        );

        game.whiteRatingChange = whiteChange;
        game.blackRatingChange = blackChange;

        // Update player stats
        whitePlayer.rating += whiteChange;
        blackPlayer.rating += blackChange;

        if (game.result === 'white_wins') {
          whitePlayer.wins += 1;
          blackPlayer.losses += 1;
        } else {
          blackPlayer.wins += 1;
          whitePlayer.losses += 1;
        }

        await whitePlayer.save();
        await blackPlayer.save();

        // Generate PGN
        game.pgn = generatePGN(
          game.moves,
          whitePlayer.username,
          blackPlayer.username,
          game.result === 'white_wins' ? '1-0' : '0-1'
        );

        await game.save();

        const populatedGame = await Game.findById(gameId)
          .populate('white', 'username rating')
          .populate('black', 'username rating');

        gameNamespace.to(gameId).emit('gameOver', {
          game: populatedGame
        });

      } catch (error) {
        console.error(error);
        socket.emit('error', { message: 'Server error' });
      }
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log(`User disconnected from game: ${socket.username}`);
    });
  });
};

module.exports = setupGameSocket;