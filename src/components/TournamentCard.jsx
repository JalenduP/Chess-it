import React from 'react';
import { Trophy, Users } from 'lucide-react';

const TournamentCard = ({ 
  title, 
  description, 
  participants, 
  maxParticipants, 
  startDate, 
  onJoin 
}) => {
  return (
    <div className="bg-gray-800 rounded-2xl p-6 flex flex-col justify-between border border-gray-700">
      <div>
        <Trophy className="w-10 h-10 text-yellow-400 mb-3" />
        <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
        <p className="text-gray-400 mb-4">{description}</p>
        <div className="flex items-center text-gray-400 mb-2">
          <Users className="w-4 h-4 mr-2" /> {participants}/{maxParticipants} Participants
        </div>
        <div className="text-gray-400 text-sm">Starts: {startDate}</div>
      </div>
      <button
        onClick={onJoin}
        className="w-full mt-6 py-3 font-semibold text-gray-900 bg-yellow-400 rounded-lg hover:bg-yellow-300"
      >
        Join Now
      </button>
    </div>
  );
};

export default TournamentCard;
