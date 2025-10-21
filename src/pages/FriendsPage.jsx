import React, { useState, useEffect } from "react";
import Header from "../components/Header"; // adjust if needed
import FriendRow from "../components/FriendRow";

const FriendsPage = () => {
  const [friends, setFriends] = useState([
    { id: 1, name: "Saksham", rating: 2105, online: true },
    { id: 2, name: "Touqeer", rating: 2088, online: true },
    { id: 3, name: "Kostubh", rating: 1950, online: false },
    { id: 4, name: "Tanish", rating: 1812, online: true },
    { id: 5, name: "Sourabh", rating: 1790, online: false },
    { id: 1, name: "Saksham", rating: 2105, online: true },
    { id: 2, name: "Touqeer", rating: 2088, online: true },
    { id: 3, name: "Kostubh", rating: 1950, online: false },
    { id: 4, name: "Tanish", rating: 1812, online: true },
    { id: 5, name: "Sourabh", rating: 1790, online: false },
    { id: 1, name: "Saksham", rating: 2105, online: true },
    { id: 2, name: "Touqeer", rating: 2088, online: true },
    { id: 3, name: "Kostubh", rating: 1950, online: false },
    { id: 4, name: "Tanish", rating: 1812, online: true },
    { id: 5, name: "Sourabh", rating: 1790, online: false },
  ]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // fetch friends from API example
    // setLoading(true);
    // fetch("/api/friends").then(...).finally(() => setLoading(false));
  }, []);

  const handleAddFriend = () => {
    const newFriend = {
      id: Date.now(),
      name: "New Friend",
      rating: 1600,
      online: false,
    };
    setFriends((prev) => [...prev, newFriend]);
  };

  const handleRemove = (id) => {
    setFriends((prev) => prev.filter((f) => f.id !== id));
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Header />

      <main className="flex-grow max-w-7xl mx-auto px-6 py-10 mt-4">
        <div className="flex items-start justify-between mb-6">
          <h1 className="text-4xl font-extrabold">Friends</h1>

          <button
            onClick={handleAddFriend}
            className="flex items-center gap-2 bg-yellow-400 text-black px-5 py-3 rounded-lg shadow-md hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-yellow-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Add Friend
          </button>
        </div>

        <div className="rounded-2xl overflow-hidden border border-gray-700">
          <div className="bg-[#2a3440] px-6 py-4">
            <div className="grid grid-cols-12 gap-4 text-sm text-gray-300 uppercase">
              <div className="col-span-5">Name</div>
              <div className="col-span-2 text-center">Rating</div>
              <div className="col-span-3 text-center">Status</div>
              <div className="col-span-2 text-right">Action</div>
            </div>
          </div>

          {loading ? (
            <div className="p-6 text-gray-400">Loading friends...</div>
          ) : friends.length === 0 ? (
            <div className="p-6 text-gray-400">No friends yet. Add someone!</div>
          ) : (
            /* parent wrapper keeps divide and allows FriendRow's last:rounded-b-2xl to work */
            <div className="divide-y divide-gray-800">
              {friends.map((f) => (
                <FriendRow key={f.id} friend={f} onRemove={handleRemove} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default FriendsPage;
