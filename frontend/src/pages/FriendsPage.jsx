// src/pages/FriendsPage.jsx
import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import FriendRow from "../components/FriendRow";
import friendService from "../services/friendService";

const FriendsPage = () => {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    fetchFriends();
  }, []);

  const fetchFriends = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await friendService.getFriends();
      
      if (response.friends) {
        const formattedFriends = response.friends.map(friend => ({
          id: friend._id,
          name: friend.username,
          rating: friend.rating || 1500,
          online: friend.isOnline || false
        }));
        setFriends(formattedFriends);
      }
    } catch (err) {
      console.error("Failed to fetch friends:", err);
      setError("Failed to load friends. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (id) => {
    if (!window.confirm("Are you sure you want to remove this friend?")) {
      return;
    }

    try {
      await friendService.removeFriend(id);
      setFriends(prev => prev.filter(f => f.id !== id));
    } catch (err) {
      console.error("Failed to remove friend:", err);
      alert("Failed to remove friend. Please try again.");
    }
  };

  const handleSearch = async () => {
    if (searchQuery.length < 2) {
      alert("Please enter at least 2 characters");
      return;
    }

    setSearching(true);
    try {
      const response = await friendService.searchUsers(searchQuery);
      
      if (response.success && response.users) {
        setSearchResults(response.users);
      }
    } catch (err) {
      console.error("Search failed:", err);
      alert("Failed to search users. Please try again.");
    } finally {
      setSearching(false);
    }
  };

  const handleSendRequest = async (userId) => {
    try {
      await friendService.sendFriendRequest(userId);
      alert("Friend request sent!");
      setSearchResults(prev => prev.filter(u => u._id !== userId));
    } catch (err) {
      console.error("Failed to send request:", err);
      alert(err.response?.data?.message || "Failed to send friend request.");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Header />

      <main className="flex-grow max-w-7xl mx-auto px-6 py-10 mt-4">
        <div className="flex items-start justify-between mb-6">
          <h1 className="text-4xl font-extrabold">Friends</h1>

          <button
            onClick={() => setShowAddModal(true)}
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

        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-300 text-sm">
            {error}
          </div>
        )}

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
            <div className="p-6 text-gray-400 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-yellow-400 mb-4"></div>
              <p>Loading friends...</p>
            </div>
          ) : friends.length === 0 ? (
            <div className="p-6 text-gray-400">No friends yet. Add someone!</div>
          ) : (
            <div className="divide-y divide-gray-800">
              {friends.map((f) => (
                <FriendRow key={f.id} friend={f} onRemove={handleRemove} />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Add Friend Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4">
          <div className="bg-gray-900 rounded-xl border border-gray-700 p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Add Friend</h2>
            
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search by username..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
              />
            </div>

            <button
              onClick={handleSearch}
              disabled={searching}
              className="w-full mb-4 bg-yellow-400 text-black px-4 py-2 rounded-lg hover:brightness-95 disabled:opacity-50"
            >
              {searching ? "Searching..." : "Search"}
            </button>

            {searchResults.length > 0 && (
              <div className="mb-4 max-h-60 overflow-y-auto">
                {searchResults.map(user => (
                  <div key={user._id} className="flex justify-between items-center p-3 bg-gray-800 rounded-lg mb-2">
                    <div>
                      <div className="font-medium">{user.username}</div>
                      <div className="text-sm text-gray-400">Rating: {user.rating}</div>
                    </div>
                    <button
                      onClick={() => handleSendRequest(user._id)}
                      className="bg-yellow-400 text-black px-3 py-1 rounded text-sm"
                    >
                      Add
                    </button>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={() => {
                setShowAddModal(false);
                setSearchQuery("");
                setSearchResults([]);
              }}
              className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FriendsPage;