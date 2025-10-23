// src/components/gamepage/MoveHistory.jsx
import React from 'react';

export default function MoveHistory({ moves = [] }) {
  // Group moves into pairs (white and black)
  const movePairs = [];
  for (let i = 0; i < moves.length; i += 2) {
    movePairs.push({
      moveNumber: Math.floor(i / 2) + 1,
      white: moves[i]?.san || '',
      black: moves[i + 1]?.san || ''
    });
  }

  return (
    <div className="p-4 overflow-y-auto">
      {movePairs.length === 0 ? (
        <div className="text-center text-gray-400 py-8">
          No moves yet. Game will start soon!
        </div>
      ) : (
        <div className="space-y-1">
          {movePairs.map((pair) => (
            <div 
              key={pair.moveNumber} 
              className="grid grid-cols-[40px_1fr_1fr] gap-2 text-white hover:bg-gray-800 px-2 py-1 rounded"
            >
              <span className="text-gray-400 font-mono text-sm">
                {pair.moveNumber}.
              </span>
              <span className="font-medium">{pair.white}</span>
              <span className="font-medium">{pair.black}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}