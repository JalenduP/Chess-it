import React, { useState } from 'react';
import { Header } from '../components/Header';
import { Trophy, Users } from 'lucide-react';

const TournamentPage = () => {
  const [activeTab, setActiveTab] = useState('available');
  
  const TabButton = ({ tabName, title }) => (
    <button
      onClick={() => setActiveTab(tabName)}
      className={`
        px-6 py-3 font-medium text-lg
        ${activeTab === tabName
          ? 'text-yellow-400 border-b-2 border-yellow-400'
          : 'text-gray-500 hover:text-gray-300'
        }
      `}
    >
      {title}
    </button>
  );

  return (
    <div className="min-h-screen bg-black">
      <Header />
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 text-white">
        
        {/* Tabs */}
        <div className="flex mb-8 border-b border-gray-700">
          <TabButton tabName="available" title="Available Tournaments" />
          <TabButton tabName="bracket" title="My Brackets" />
        </div>

        {/* Content Area */}
        {activeTab === 'available' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Example Tournament Card */}
            <div className="bg-gray-800 rounded-2xl p-6 flex flex-col justify-between border border-gray-700">
              <div>
                <Trophy className="w-10 h-10 text-yellow-400 mb-3" />
                <h3 className="text-2xl font-bold text-white mb-2">Annual College Blitz</h3>
                <p className="text-gray-400 mb-4">The main event! A 3+2 blitz tournament open to all students and faculty.</p>
                <div className="flex items-center text-gray-400 mb-2">
                  <Users className="w-4 h-4 mr-2" /> 34/64 Participants
                </div>
                <div className="text-gray-400 text-sm">Starts: October 25, 2025</div>
              </div>
              <button className="w-full mt-6 py-3 font-semibold text-gray-900 bg-yellow-400 rounded-lg hover:bg-yellow-300">
                Join Now
              </button>
            </div>
            {/* More tournament cards... */}
          </div>
        )}

        {activeTab === 'bracket' && (
          <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
            <h2 className="text-2xl font-bold text-white mb-4">My Active Tournaments</h2>
            <p className="text-gray-400">
              Your active tournament brackets will appear here.
              {/* You would render a bracket component here */}
            </p>
          </div>
        )}

      </div>
    </div>
  );
};

export default TournamentPage;