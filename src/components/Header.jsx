import React from "react";
import { NavLink } from "react-router-dom";
import { User } from "lucide-react";

// Header with profile dropdown using NavLink for Settings and Logout
// - Keeps the same visual style you provided (Tailwind classes)
// - Accessible: supports keyboard (Esc to close) and closes when clicking outside
// - Replace the username "Jalendu" or avatar as needed

export const Header = () => {
  // This function tells NavLink how to style itself
  const getNavLinkClass = ({ isActive }) => {
    return isActive
      ? "text-white px-3 py-2 rounded-md text-sm font-medium" // Active link style
      : "text-gray-400 hover:bg-gray-800 hover:text-white px-3 py-2 rounded-md text-sm font-medium"; // Inactive link style
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
              <span className="text-2xl font-bold text-yellow-400">
                chess it
              </span>
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
                <span className="mr-2">Jalendu</span>
                <User className="h-6 w-6 p-1 bg-gray-700 rounded-full" />
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
        </div>
      </div>
    </nav>
  );
};

export default Header;
