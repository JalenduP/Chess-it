import React, { useState } from 'react';
import { Header } from '../components/Header';
import TournamentCard from '../components/TournamentCard'; // import it

const TournamentPage = () => {
  const [activeTab, setActiveTab] = useState('available');

  // Example data — in future this can come from API
  const tournaments = [
    {
      title: 'Annual College Blitz',
      description: 'The main event! A 3+2 blitz tournament open to all students and faculty.',
      participants: 34,
      maxParticipants: 64,
      startDate: 'October 25, 2025',
    },
    {
      title: 'Faculty Rapid Cup',
      description: 'Exclusive 10+5 rapid tournament for faculty members only.',
      participants: 12,
      maxParticipants: 32,
      startDate: 'November 10, 2025',
    },
    {
      title: 'Freshers Chess Battle',
      description: 'A beginner-friendly 5+0 tournament for first-year students.',
      participants: 28,
      maxParticipants: 64,
      startDate: 'November 15, 2025',
    },
  ];

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

        {/* Content */}
        {activeTab === 'available' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tournaments.map((tournament, index) => (
              <TournamentCard
                key={index}
                title={tournament.title}
                description={tournament.description}
                participants={tournament.participants}
                maxParticipants={tournament.maxParticipants}
                startDate={tournament.startDate}
                onJoin={() => alert(`Joined ${tournament.title}`)}
              />
            ))}
          </div>
        )}

        {activeTab === 'bracket' && (
          <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
            <h2 className="text-2xl font-bold text-white mb-4">My Active Tournaments</h2>
            <p className="text-gray-400">
              Your active tournament brackets will appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TournamentPage;
