import React from "react";

/**
 * Props:
 *  - friend: { id, name, rating, online }
 *  - onRemove: function(id)
 */
const FriendRow = ({ friend, onRemove }) => {
  const { id, name, rating, online } = friend;

  return (
    <div
      key={id}
      className="grid grid-cols-12 gap-4 items-center px-6 py-6 bg-[#0f1720] last:rounded-b-2xl"
    >
      <div className="col-span-5">
        <span className="text-lg">{name}</span>
      </div>

      <div className="col-span-2 text-center">
        <span className="text-yellow-400 font-extrabold text-lg">{rating}</span>
      </div>

      <div className="col-span-3 text-center">
        <span
          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
            online ? "bg-green-800 text-green-200" : "bg-gray-700 text-gray-300"
          }`}
        >
          <span
            className={`h-2 w-2 rounded-full ${online ? "bg-green-400" : "bg-gray-500"}`}
          />
          {online ? "online" : "offline"}
        </span>
      </div>

      <div className="col-span-2 text-right">
        <button
          onClick={() => onRemove(id)}
          className="bg-yellow-400 text-black px-4 py-2 rounded-lg font-medium hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-yellow-300"
        >
          Remove
        </button>
      </div>
    </div>
  );
};

export default FriendRow;
