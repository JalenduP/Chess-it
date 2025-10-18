import React from 'react';
import { Header } from '../components/Header';
import { Link } from 'react-router-dom'; // Import Link

// A reusable component for the time-control buttons
const TimeButton = ({ time, increment, type }) => (
  // Use Link and pass a mock game ID
  <Link 
    to="/game/12345" 
    className="bg-gray-800 border border-gray-700 rounded-lg p-6 text-center hover:bg-gray-700 transition-colors"
  >
    <div className="text-4xl font-bold text-white">
      {time}<span className="text-yellow-400">+{increment}</span>
    </div>
    <div className="text-gray-400 mt-1">{type}</div>
  </Link>
);

const DashboardPage = () => {
  // ... (rest of the component stays the same) ...
  return (
    <div className="min-h-screen bg-black">
      <Header />
      
      <div className="max-w-3xl mx-auto py-12 px-4">
        <div className="grid grid-cols-3 gap-4">
          {/* Time Controls */}
          <TimeButton time="2" increment="0" type="Bullet" />
          <TimeButton time="2" increment="1" type="Bullet" />
          <TimeButton time="3" increment="0" type="Bullet" />
          
          <TimeButton time="3" increment="2" type="Blitz" />
          <TimeButton time="5" increment="0" type="Blitz" />
          <TimeButton time="5" increment="3" type="Blitz" />
          
          <TimeButton time="10" increment="0" type="Rapid" />
          <TimeButton time="10" increment="3" type="Rapid" />
          <TimeButton time="15" increment="10" type="Rapid" />
        </div>
        
        {/* Challenge a Friend */}
        <div className="mt-6">
          <button className="w-full bg-gray-700 text-gray-300 py-4 rounded-lg hover:bg-gray-600">
            Challenge a friend
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;