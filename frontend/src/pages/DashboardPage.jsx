// src/pages/DashboardPage.jsx
import React, { useState } from "react";
import { Header } from "../components/Header";
import { useNavigate } from "react-router-dom";
import gameService from "../services/gameService";

const TimeButton = ({ time, increment, type, onClick, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="bg-gray-800 border border-gray-700 rounded-lg p-6 text-center hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
  >
    <div className="text-4xl font-bold text-white">
      {time}
      <span className="text-yellow-400">+{increment}</span>
    </div>
    <div className="text-gray-400 mt-1">{type}</div>
  </button>
);

const DashboardPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTimeControlClick = async (minutes, increment) => {
    setLoading(true);
    setError("");

    try {
      const response = await gameService.createGame({ minutes, increment });
      
      if (response.success && response.game) {
        // Navigate to game page with the game ID
        navigate(`/game/${response.game._id}`);
      }
    } catch (err) {
      console.error("Failed to create game:", err);
      setError(err.response?.data?.message || "Failed to start game. Please try again.");
      setTimeout(() => setError(""), 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <Header />

      <div className="max-w-3xl mx-auto py-12 px-4">
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-300 text-sm">
            {error}
          </div>
        )}

        {loading && (
          <div className="mb-6 p-4 bg-yellow-500/20 border border-yellow-500 rounded-lg text-yellow-300 text-sm">
            Finding an opponent...
          </div>
        )}

        <div className="grid grid-cols-3 gap-4">
          {/* Bullet */}
          <TimeButton 
            time="2" 
            increment="0" 
            type="Bullet" 
            onClick={() => handleTimeControlClick(2, 0)}
            disabled={loading}
          />
          <TimeButton 
            time="2" 
            increment="1" 
            type="Bullet" 
            onClick={() => handleTimeControlClick(2, 1)}
            disabled={loading}
          />
          <TimeButton 
            time="3" 
            increment="0" 
            type="Bullet" 
            onClick={() => handleTimeControlClick(3, 0)}
            disabled={loading}
          />

          {/* Blitz */}
          <TimeButton 
            time="3" 
            increment="2" 
            type="Blitz" 
            onClick={() => handleTimeControlClick(3, 2)}
            disabled={loading}
          />
          <TimeButton 
            time="5" 
            increment="0" 
            type="Blitz" 
            onClick={() => handleTimeControlClick(5, 0)}
            disabled={loading}
          />
          <TimeButton 
            time="5" 
            increment="3" 
            type="Blitz" 
            onClick={() => handleTimeControlClick(5, 3)}
            disabled={loading}
          />

          {/* Rapid */}
          <TimeButton 
            time="10" 
            increment="0" 
            type="Rapid" 
            onClick={() => handleTimeControlClick(10, 0)}
            disabled={loading}
          />
          <TimeButton 
            time="10" 
            increment="3" 
            type="Rapid" 
            onClick={() => handleTimeControlClick(10, 3)}
            disabled={loading}
          />
          <TimeButton 
            time="15" 
            increment="10" 
            type="Rapid" 
            onClick={() => handleTimeControlClick(15, 10)}
            disabled={loading}
          />
        </div>

        {/* Challenge a Friend */}
        <div className="mt-6">
          <button 
            className="w-full bg-gray-700 text-gray-300 py-4 rounded-lg hover:bg-gray-600 disabled:opacity-50"
            disabled={loading}
            onClick={() => navigate('/friends')}
          >
            Challenge a friend
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;