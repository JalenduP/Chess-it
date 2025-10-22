// src/components/gamepage/TimeUpPage.jsx
import React from 'react';

/**
 * TimeUpPage
 * Props:
 *  - gameOver: {
 *      result: 'timeout',
 *      winnerName, loserName,
 *      winnerRating, loserRating,
 *      winnerDelta, loserDelta,
 *      timeControl, movesPlayed, duration, finalPgn
 *    }
 *  - onPlayAgain: () => void
 *  - onBack: () => void
 */
export default function TimeUpPage({ gameOver, onPlayAgain, onBack }) {
  if (!gameOver || gameOver.result !== 'timeout') return null;

  const {
    winnerName = 'Opponent',
    loserName = 'You',
    winnerRating = 1950,
    loserRating = 1945,
    winnerDelta = +12,
    loserDelta = -8,
    timeControl = '5+0',
    movesPlayed = 0,
    duration = '0:00',
    finalPgn = '',
  } = gameOver;

  const downloadPgn = () => {
    if (!finalPgn) return;
    const blob = new Blob([finalPgn], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'game.pgn';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-[9997] flex items-center justify-center bg-black bg-opacity-80 p-6">
      <div className="max-w-2xl w-full bg-gradient-to-b from-gray-900 to-gray-800 rounded-2xl p-8 border border-gray-700 shadow-xl">
        <div className="text-center mb-6">
          <div className="inline-block bg-red-900 text-red-100 px-4 py-1 rounded-full text-sm mb-4">Game Over - Time Out</div>
          <h1 className="text-4xl font-bold text-white mb-2">Time&apos;s Up!</h1>
          <p className="text-sm text-gray-400">Better luck next time!</p>
        </div>

        <div className="space-y-4 mb-6">
          {/* Winner */}
          <div className="flex items-center justify-between bg-green-800 bg-opacity-20 border border-green-700 rounded-lg p-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white font-bold">O</div>
              <div>
                <div className="text-white font-semibold">{winnerName}</div>
                <div className="text-xs text-green-200">Winner by timeout</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold text-yellow-400">{winnerRating}</div>
              <div className="text-sm text-green-300">{winnerDelta > 0 ? `+${winnerDelta}` : winnerDelta}</div>
            </div>
          </div>

          {/* Loser */}
          <div className="flex items-center justify-between bg-red-900 bg-opacity-20 border border-red-700 rounded-lg p-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white font-bold">Y</div>
              <div>
                <div className="text-white font-semibold">{loserName}</div>
                <div className="text-xs text-red-200">Lost on time</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold text-yellow-400">{loserRating}</div>
              <div className="text-sm text-red-300">{loserDelta}</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 text-center text-sm text-gray-300 mb-6">
          <div>
            <div className="text-xs text-gray-400">Time Control</div>
            <div className="font-medium">{timeControl}</div>
          </div>
          <div>
            <div className="text-xs text-gray-400">Moves Played</div>
            <div className="font-medium">{movesPlayed}</div>
          </div>
          <div>
            <div className="text-xs text-gray-400">Duration</div>
            <div className="font-medium">{duration}</div>
          </div>
        </div>

        <div className="flex gap-4 justify-center mb-3">
          <button onClick={onPlayAgain} className="px-6 py-3 rounded-lg bg-yellow-400 text-black font-semibold">Play Again</button>
          <button onClick={() => alert('View Leaderboard (placeholder)')} className="px-6 py-3 rounded-lg bg-gray-700 text-white">View Leaderboard</button>
        </div>

        <div className="text-center mt-2">
          <button onClick={downloadPgn} className="text-sm text-yellow-300 underline">Download PGN</button>
        </div>

        <div className="mt-6 text-center">
          <button onClick={onBack} className="text-xs text-gray-400 underline">← Back to Home</button>
        </div>
      </div>
    </div>
  );
}
