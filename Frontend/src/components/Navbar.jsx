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
      <nav className="bg-surface text-primary border-b border-neutral/20 h-14 sm:h-16 flex-shrink-0 flex items-center justify-between px-3 sm:px-6 z-10 relative">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <Link to="/" className="flex items-center gap-2 group min-w-0">
            <span className="font-bold text-lg sm:text-xl tracking-tight text-secondary truncate">DocIntel AI</span>
          </Link>
        </div>

        <div className="flex items-center gap-2 sm:gap-5 flex-shrink-0">
          {isAuthenticated && user ? (
            <>
              {/* Help Icon */}
              <button className="text-secondary hover:text-secondary/80 transition-colors p-1" title="Help">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
              
              {/* Settings Icon */}
              <button className="text-secondary hover:text-secondary/80 transition-colors p-1" title="Settings">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>

              <div className="h-6 w-px bg-neutral/20 mx-1"></div>

              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 hover:bg-neutral/10 py-1.5 px-2 rounded-lg transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-tertiary flex items-center justify-center font-bold text-sm text-primary overflow-hidden border border-neutral/30">
                    {user.profile_picture ? (
                      <img src={user.profile_picture} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      user.name.substring(0, 2).toUpperCase()
                    )}
                  </div>
                  <span className="text-sm font-medium text-primary hidden sm:block truncate max-w-[120px]">{user.name}</span>
                  <svg className="w-4 h-4 text-neutral" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-surface rounded-xl shadow-xl border border-neutral/20 overflow-hidden animate-in fade-in zoom-in duration-200 z-50">
                  <div className="px-4 py-3 border-b border-neutral/20">
                    <p className="text-sm font-medium text-primary truncate">{user.name}</p>
                    <p className="text-xs text-neutral truncate mt-0.5">{user.email}</p>
                  </div>
                  <div className="py-1">
                    <Link 
                      to="/profile" 
                      className="flex items-center px-4 py-2 text-sm text-primary hover:bg-neutral/10 transition-colors"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Profile Settings
                    </Link>
                    <button 
                      onClick={handleLogoutClick}
                      className="w-full flex items-center text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
            </>
          ) : (
            <div className="flex items-center gap-2 sm:gap-3">
              <Link to="/login" className="text-xs sm:text-sm font-medium text-primary hover:text-secondary transition-colors">
                Sign in
              </Link>
              <Link to="/register" className="text-xs sm:text-sm font-medium bg-secondary text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg shadow-sm hover:bg-secondary/90 transition-colors">
                Sign up
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-primary/40 p-4">
          <div className="bg-surface rounded-xl shadow-2xl max-w-sm w-full p-6 border border-neutral/20 animate-in fade-in zoom-in duration-200">
            <h3 className="text-lg font-bold text-primary mb-2 flex items-center gap-2">
              <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sign out
            </h3>
            <p className="text-neutral text-sm mb-6">
              Are you sure you want to sign out? You will need to log in again to access your chats.
            </p>
            <div className="flex justify-end gap-3 w-full">
              <button 
                onClick={cancelLogout}
                disabled={isLoggingOut}
                className="px-4 py-2 text-sm font-medium text-neutral hover:text-primary hover:bg-neutral/10 rounded-lg transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button 
                onClick={confirmLogout}
                disabled={isLoggingOut}
                className="px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 shadow-sm shadow-red-600/20 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
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
