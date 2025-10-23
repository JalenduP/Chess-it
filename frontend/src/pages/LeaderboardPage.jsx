// src/pages/LeaderboardPage.jsx
import React, { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import LeaderBoardRow from '../components/LeaderBoardRow';
import leaderboardService from '../services/leaderboardService';
import authService from '../services/authService';

const LeaderboardPage = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    department: '',
    batch: '',
  });

  const currentUser = authService.getCurrentUser();
  const myName = currentUser?.username || '';

  useEffect(() => {
    fetchLeaderboard();
  }, [filters]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await leaderboardService.getLeaderboard(filters);
      
      if (response.success && response.leaderboard) {
        setLeaderboardData(response.leaderboard);
      }
    } catch (err) {
      console.error('Failed to fetch leaderboard:', err);
      setError('Failed to load leaderboard. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

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
            <select 
              className="bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              value={filters.department}
              onChange={(e) => handleFilterChange('department', e.target.value)}
            >
              <option value="">All Departments</option>
              <option value="CSE">CSE</option>
              <option value="ECE">ECE</option>
              <option value="ME">ME</option>
              <option value="CE">CE</option>
              <option value="Other">Other</option>
            </select>
            
            <select 
              className="bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              value={filters.batch}
              onChange={(e) => handleFilterChange('batch', e.target.value)}
            >
              <option value="">All Batches</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
              <option value="2022">2022</option>
              <option value="2021">2021</option>
            </select>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-300 text-sm">
            {error}
          </div>
        )}

        {/* Leaderboard Table */}
        <div className="bg-gray-900 rounded-2xl shadow-lg border border-gray-800 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-400">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-yellow-400 mb-4"></div>
              <p>Loading leaderboard...</p>
            </div>
          ) : leaderboardData.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              No players found. Try adjusting your filters.
            </div>
          ) : (
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
                  <LeaderBoardRow 
                    key={player.userId} 
                    player={{
                      rank: player.rank,
                      name: player.username,
                      rating: player.rating,
                      wins: player.wins,
                      losses: player.losses
                    }} 
                    myName={myName} 
                  />
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;