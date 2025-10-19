import React from 'react';
import { Header } from '../components/Header';
import LeaderBoardRow from '../components/LeaderBoardRow';

// Mock data - replace with API data later
const leaderboardData = [
  { rank: 1, name: 'Saksham', rating: 2105, wins: 150, losses: 45 },
  { rank: 2, name: 'Touqeer', rating: 2088, wins: 142, losses: 50 },
  { rank: 3, name: 'Kostubh', rating: 1950, wins: 120, losses: 40 },
  { rank: 4, name: 'Jalendu', rating: 1945, wins: 130, losses: 55 },
  { rank: 5, name: 'Tanish', rating: 1812, wins: 100, losses: 60 },
  { rank: 6, name: 'Sourabh', rating: 1790, wins: 95, losses: 62 },
];

const LeaderboardPage = () => {
  const myName = 'Jalendu'; // You’ll get this from AuthContext later

  return (
    <div className="min-h-screen bg-black">
      <Header />

      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Title and Filters */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-4 md:mb-0">
            Leaderboard
          </h1>

          <div className="flex space-x-4">
            <select className="bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400">
              <option>Filter by Department</option>
              <option>CSE</option>
              <option>ECE</option>
            </select>
            <select className="bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400">
              <option>Filter by Batch</option>
              <option>2024</option>
              <option>2025</option>
            </select>
          </div>
        </div>

        {/* Leaderboard Table */}
        <div className="bg-gray-900 rounded-2xl shadow-lg border border-gray-800 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-800">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Rank</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Name</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Rating</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Wins</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Losses</th>
              </tr>
            </thead>

            <tbody className="bg-gray-900 divide-y divide-gray-800">
              {leaderboardData.map((player) => (
                <LeaderBoardRow key={player.rank} player={player} myName={myName} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;
