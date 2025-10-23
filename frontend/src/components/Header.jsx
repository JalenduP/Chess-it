// src/components/Header.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import { User } from "lucide-react";
import authService from "../services/authService";

export const Header = () => {
  const currentUser = authService.getCurrentUser();
  const username = currentUser?.username || "Guest";

  const getNavLinkClass = ({ isActive }) => {
    return isActive
      ? "text-white px-3 py-2 rounded-md text-sm font-medium"
      : "text-gray-400 hover:bg-gray-800 hover:text-white px-3 py-2 rounded-md text-sm font-medium";
  };

  const [menuOpen, setMenuOpen] = React.useState(false);
  const menuRef = React.useRef(null);
  const buttonRef = React.useRef(null);

  React.useEffect(() => {
    function handleOutsideClick(e) {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target)
      ) {
        setMenuOpen(false);
      }
    }

    function handleEsc(e) {
      if (e.key === "Escape") setMenuOpen(false);
    }

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  return (
    <nav className="bg-black border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Side: Logo and Nav */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <NavLink to="/dashboard" className="text-2xl font-bold text-yellow-400">
                chess it
              </NavLink>
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
          <div className="hidden md:block relative">
            <div className="ml-4 flex items-center md:ml-6">
              {currentUser && (
                <div className="mr-4 text-right">
                  <div className="text-sm text-gray-300">{username}</div>
                  <div className="text-xs text-yellow-400">
                    Rating: {currentUser.rating || 1500}
                  </div>
                </div>
              )}

              {/* Profile button */}
              <button
                ref={buttonRef}
                onClick={() => setMenuOpen((s) => !s)}
                aria-haspopup="true"
                aria-expanded={menuOpen}
                aria-controls="profile-menu"
                className="flex items-center text-sm rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400"
                title="Open profile menu"
              >
                <User className="h-8 w-8 p-1 bg-gray-700 rounded-full" />
              </button>

              {/* Dropdown menu */}
              {menuOpen && (
                <div
                  ref={menuRef}
                  id="profile-menu"
                  role="menu"
                  aria-label="Profile options"
                  className="origin-top-right absolute right-0 mt-12 w-44 rounded-md shadow-lg bg-black border border-gray-700 ring-1 ring-black ring-opacity-5 z-50"
                >
                  <div className="py-1" role="none">
                    <NavLink
                      to="/friends"
                      className={({ isActive }) =>
                        (isActive
                          ? "bg-gray-800 text-white"
                          : "text-gray-300") +
                        " block px-4 py-2 text-sm hover:bg-gray-800 hover:text-white"
                      }
                      onClick={() => setMenuOpen(false)}
                      role="menuitem"
                    >
                      Friends
                    </NavLink>

                    <NavLink
                      to="/settings"
                      className={({ isActive }) =>
                        (isActive
                          ? "bg-gray-800 text-white"
                          : "text-gray-300") +
                        " block px-4 py-2 text-sm hover:bg-gray-800 hover:text-white"
                      }
                      onClick={() => setMenuOpen(false)}
                      role="menuitem"
                    >
                      Settings
                    </NavLink>

                    <NavLink
                      to="/logout"
                      className={({ isActive }) =>
                        (isActive
                          ? "bg-gray-800 text-white"
                          : "text-gray-300") +
                        " block px-4 py-2 text-sm hover:bg-gray-800 hover:text-white"
                      }
                      onClick={() => setMenuOpen(false)}
                      role="menuitem"
                    >
                      Logout
                    </NavLink>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMenuOpen((s) => !s)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-700">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <NavLink
              to="/dashboard"
              className={getNavLinkClass}
              onClick={() => setMenuOpen(false)}
            >
              Quick Play
            </NavLink>
            <NavLink
              to="/tournaments"
              className={getNavLinkClass}
              onClick={() => setMenuOpen(false)}
            >
              Tournaments
            </NavLink>
            <NavLink
              to="/leaderboard"
              className={getNavLinkClass}
              onClick={() => setMenuOpen(false)}
            >
              Leaderboard
            </NavLink>
            <NavLink
              to="/friends"
              className={getNavLinkClass}
              onClick={() => setMenuOpen(false)}
            >
              Friends
            </NavLink>
            <NavLink
              to="/settings"
              className={getNavLinkClass}
              onClick={() => setMenuOpen(false)}
            >
              Settings
            </NavLink>
            <NavLink
              to="/logout"
              className={getNavLinkClass}
              onClick={() => setMenuOpen(false)}
            >
              Logout
            </NavLink>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Header;