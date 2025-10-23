import React from 'react';

export default function PlayerCard({ name, rating, time, isOpponent = false }) {
  return (
    <div className={`p-4 bg-gray-800 rounded-lg ${isOpponent ? 'opacity-70' : ''}`}>
      <div className="flex justify-between items-center">
        <span className="text-xl font-semibold text-white">{name}</span>
        <span className="text-lg text-gray-400">{rating}</span>
      </div>
      <div className="text-4xl font-bold text-white font-mono mt-2">{time}</div>
    </div>
  );
}
