import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { dark, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const getDashboardLink = () => {
    if (!user) return "/login";
    return "/dashboard";
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">🚌</span>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
              TicketBari
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="hover:text-purple-600 dark:hover:text-purple-400 transition">Home</Link>
            <Link to="/all-tickets" className="hover:text-purple-600 dark:hover:text-purple-400 transition">All Tickets</Link>
            {user ? (
              <Link to={getDashboardLink()} className="hover:text-purple-600 dark:hover:text-purple-400 transition">Dashboard</Link>
            ) : (
              <>
                <Link to="/login" className="hover:text-purple-600 dark:hover:text-purple-400 transition">Login</Link>
                <Link to="/register" className="hover:text-purple-600 dark:hover:text-purple-400 transition">Register</Link>
              </>
            )}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition">
              {dark ? "☀️" : "🌙"}
            </button>
            {user && (
              <div className="relative">
                <button onClick={() => setDropdown(!dropdown)} className="flex items-center gap-2 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                  <img src={user.image || "https://ui-avatars.com/api/?name=" + user.name} alt="" className="w-8 h-8 rounded-full" />
                  <span className="text-sm font-medium">{user.name}</span>
                </button>
                {dropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1">
                    <Link to={getDashboardLink()} className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700" onClick={() => setDropdown(false)}>My Profile</Link>
                    <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700">Logout</button>
                  </div>
                )}
              </div>
            )}
          </div>

          <button onClick={() => setOpen(!open)} className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {open ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {open && (
          <div className="md:hidden pb-4 space-y-2">
            <Link to="/" className="block px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800" onClick={() => setOpen(false)}>Home</Link>
            <Link to="/all-tickets" className="block px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800" onClick={() => setOpen(false)}>All Tickets</Link>
            {user ? (
              <>
                <Link to={getDashboardLink()} className="block px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800" onClick={() => setOpen(false)}>Dashboard</Link>
                <button onClick={() => { handleLogout(); setOpen(false); }} className="block w-full text-left px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="block px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800" onClick={() => setOpen(false)}>Login</Link>
                <Link to="/register" className="block px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800" onClick={() => setOpen(false)}>Register</Link>
              </>
            )}
            <button onClick={toggleTheme} className="block w-full text-left px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
              {dark ? "☀️ Light Mode" : "🌙 Dark Mode"}
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
