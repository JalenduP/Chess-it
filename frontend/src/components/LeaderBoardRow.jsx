import React from 'react';

const LeaderBoardRow = ({ player, myName }) => {
  const isMe = player.name === myName;

  return (
    <tr className={isMe ? 'bg-yellow-900 bg-opacity-30' : 'hover:bg-gray-800'}>
      <td className="px-6 py-4 whitespace-nowrap text-lg font-medium text-white">
        {player.rank}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-lg text-white">
        {player.name}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-lg font-bold text-yellow-400">
        {player.rating}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-lg text-green-400">
        {player.wins}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-lg text-red-400">
        {player.losses}
      </td>
    </tr>
  );
};

export default LeaderBoardRow;
