// src/pages/TournamentPage.jsx
import React, { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import TournamentCard from '../components/TournamentCard';
import tournamentService from '../services/tournamentService';

const TournamentPage = () => {
  const [activeTab, setActiveTab] = useState('available');
  const [tournaments, setTournaments] = useState([]);
  const [myTournaments, setMyTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (activeTab === 'available') {
      fetchTournaments();
    } else {
      fetchMyTournaments();
    }
  }, [activeTab]);

  const fetchTournaments = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await tournamentService.getTournaments('registration');
      
      if (response.success && response.tournaments) {
        setTournaments(response.tournaments);
      }
    } catch (err) {
      console.error('Failed to fetch tournaments:', err);
      setError('Failed to load tournaments. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchMyTournaments = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await tournamentService.getMyTournaments();
      
      if (response.success && response.tournaments) {
        setMyTournaments(response.tournaments);
      }
    } catch (err) {
      console.error('Failed to fetch my tournaments:', err);
      setError('Failed to load your tournaments. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinTournament = async (tournamentId) => {
    try {
      const response = await tournamentService.joinTournament(tournamentId);
      
      if (response.success) {
        alert('Successfully joined tournament!');
        fetchTournaments(); // Refresh the list
      }
    } catch (err) {
      console.error('Failed to join tournament:', err);
      alert(err.response?.data?.message || 'Failed to join tournament. Please try again.');
    }
  };

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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-black">
      <Header />
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 text-white">
        
        {/* Tabs */}
        <div className="flex mb-8 border-b border-gray-700">
          <TabButton tabName="available" title="Available Tournaments" />
          <TabButton tabName="bracket" title="My Tournaments" />
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-300 text-sm">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400 mb-4"></div>
            <p className="text-gray-400">Loading tournaments...</p>
          </div>
        ) : (
          <>
            {/* Available Tournaments Tab */}
            {activeTab === 'available' && (
              <div>
                {tournaments.length === 0 ? (
                  <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 text-center">
                    <p className="text-gray-400 text-lg">No tournaments available at the moment.</p>
                    <p className="text-gray-500 text-sm mt-2">Check back later for new tournaments!</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tournaments.map((tournament) => (
                      <TournamentCard
                        key={tournament._id}
                        title={tournament.title}
                        description={tournament.description}
                        participants={tournament.participants?.length || 0}
                        maxParticipants={tournament.maxParticipants}
                        startDate={formatDate(tournament.startDate)}
                        onJoin={() => handleJoinTournament(tournament._id)}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* My Tournaments Tab */}
            {activeTab === 'bracket' && (
              <div>
                {myTournaments.length === 0 ? (
                  <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
                    <h2 className="text-2xl font-bold text-white mb-4">My Active Tournaments</h2>
                    <p className="text-gray-400">
                      You haven't joined any tournaments yet. Browse available tournaments to get started!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {myTournaments.map((tournament) => (
                      <div 
                        key={tournament._id}
                        className="bg-gray-800 rounded-2xl p-6 border border-gray-700"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-2xl font-bold text-white mb-2">{tournament.title}</h3>
                            <p className="text-gray-400">{tournament.description}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            tournament.status === 'registration' ? 'bg-yellow-800 text-yellow-100' :
                            tournament.status === 'in_progress' ? 'bg-green-800 text-green-100' :
                            'bg-gray-700 text-gray-300'
                          }`}>
                            {tournament.status.replace('_', ' ').toUpperCase()}
                          </span>
                        </div>

                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <div className="text-gray-400">Participants</div>
                            <div className="text-white font-medium">
                              {tournament.participants?.length || 0}/{tournament.maxParticipants}
                            </div>
                          </div>
                          <div>
                            <div className="text-gray-400">Time Control</div>
                            <div className="text-white font-medium">
                              {tournament.timeControl.minutes}+{tournament.timeControl.increment}
                            </div>
                          </div>
                          <div>
                            <div className="text-gray-400">Start Date</div>
                            <div className="text-white font-medium">
                              {formatDate(tournament.startDate)}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default TournamentPage;