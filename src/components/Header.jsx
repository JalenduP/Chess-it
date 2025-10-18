import React from 'react';
import { NavLink } from 'react-router-dom'; // Import NavLink
import { User } from 'lucide-react';

export const Header = () => {
  // This function tells NavLink how to style itself
  const getNavLinkClass = ({ isActive }) => {
    return isActive
      ? 'text-white px-3 py-2 rounded-md text-sm font-medium' // Active link style
      : 'text-gray-400 hover:bg-gray-800 hover:text-white px-3 py-2 rounded-md text-sm font-medium'; // Inactive link style
  };

  return (
    <nav className="bg-black border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Side: Logo and Nav */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-2xl font-bold text-yellow-400">chess it</span>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <NavLink to="/dashboard" className={getNavLinkClass}>
                  Quick Play
                </NavLink>
                <NavLink to="/tournaments" className={getNavLinkClass}>
                  Tournaments
                </NavLink>
                <NavLink to="/leaderboard" className={getNavLinkClass}>
                  Leaderboard
                </NavLink>
              </div>
            </div>
          </div>
          
          {/* Right Side: User Profile */}
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              <button className="flex items-center text-sm rounded-full text-gray-400 hover:text-white focus:outline-none">
                <span className="mr-2">Jalendu</span>
                <User className="h-6 w-6 p-1 bg-gray-700 rounded-full" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};