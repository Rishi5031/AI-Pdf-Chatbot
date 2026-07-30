import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogoutClick = () => {
    setDropdownOpen(false);
    setShowLogoutConfirm(true);
  };

  const confirmLogout = async () => {
    setIsLoggingOut(true);
    // Simulate a brief delay for the loader
    await new Promise(resolve => setTimeout(resolve, 800));
    logout();
    navigate('/login');
    setShowLogoutConfirm(false);
    setIsLoggingOut(false);
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  return (
    <>
      <nav className="bg-primary text-tertiary border-b border-neutral/30 h-16 flex-shrink-0 flex items-center justify-between px-6 z-10 relative">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <svg className="w-5 h-5 text-tertiary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <span className="font-bold text-lg tracking-tight">AI PDF Chatbot</span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {isAuthenticated && user ? (
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 hover:bg-neutral/20 py-1.5 px-3 rounded-lg transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-secondary/80 flex items-center justify-center font-bold text-sm shadow-sm overflow-hidden border border-neutral/30">
                  {user.profile_picture ? (
                    <img src={user.profile_picture} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    user.name.charAt(0).toUpperCase()
                  )}
                </div>
                <span className="text-sm font-medium hidden sm:block">{user.name}</span>
                <svg className="w-4 h-4 text-neutral" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-primary rounded-xl shadow-xl border border-neutral/30 overflow-hidden animate-in fade-in zoom-in duration-200 z-50">
                  <div className="px-4 py-3 border-b border-neutral/30">
                    <p className="text-sm font-medium text-tertiary truncate">{user.name}</p>
                    <p className="text-xs text-neutral truncate mt-0.5">{user.email}</p>
                  </div>
                  <div className="py-1">
                    <Link 
                      to="/profile" 
                      className="flex items-center px-4 py-2 text-sm text-tertiary hover:bg-neutral/20 transition-colors"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Profile Settings
                    </Link>
                    <button 
                      onClick={handleLogoutClick}
                      className="w-full flex items-center px-4 py-2 text-sm text-secondary hover:bg-neutral/20 transition-colors"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-sm font-medium text-tertiary hover:text-tertiary/80 transition-colors">
                Sign in
              </Link>
              <Link to="/register" className="text-sm font-medium bg-secondary text-tertiary px-4 py-2 rounded-lg shadow-sm hover:bg-secondary/90 transition-colors">
                Sign up
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-primary/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Sign out</h3>
            <p className="text-gray-600 text-sm mb-6">
              Are you sure you want to sign out? You will need to log in again to access your chats.
            </p>
            <div className="flex gap-3 w-full">
              <button 
                onClick={cancelLogout}
                disabled={isLoggingOut}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button 
                onClick={confirmLogout}
                disabled={isLoggingOut}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {isLoggingOut ? (
                  <>
                    <svg className="w-4 h-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing out...
                  </>
                ) : (
                  'Sign out'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
