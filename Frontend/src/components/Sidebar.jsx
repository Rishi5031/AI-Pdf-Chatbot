import React, { useState, useEffect } from 'react';
import { useChatStore } from '../store/chatStore';
import { useAuthStore } from '../store/authStore';
import { useNavigate, Link } from 'react-router-dom';

export default function Sidebar({ isOpen, onClose }) {
  const { conversations, activeConversationId, createNewChat, selectConversation, deleteConversation, togglePin, renameConversation, isInitializing } = useChatStore();
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [chatToDelete, setChatToDelete] = useState(null);
  const [chatToRename, setChatToRename] = useState(null);
  const [newTitle, setNewTitle] = useState('');
  const [openMenuId, setOpenMenuId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isDeletingChat, setIsDeletingChat] = useState(false);

  useEffect(() => {
    const handleClickOutside = () => {
      setOpenMenuId(null);
      setIsProfileDropdownOpen(false);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const confirmLogout = async () => {
    setIsLoggingOut(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    logout();
    navigate('/login');
    setShowLogoutConfirm(false);
    setIsLoggingOut(false);
  };

  const confirmDelete = async () => {
    if (chatToDelete) {
      setIsDeletingChat(true);
      await deleteConversation(chatToDelete.id);
      setIsDeletingChat(false);
      setChatToDelete(null);
    }
  };

  const confirmRename = () => {
    if (chatToRename && newTitle.trim()) {
      renameConversation(chatToRename.id, newTitle.trim());
      setChatToRename(null);
      setNewTitle('');
    }
  };

  const filteredConversations = conversations.filter(c => 
    (c.title || 'new chat').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pinnedChats = filteredConversations.filter(c => c.is_pinned).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  const recentChats = filteredConversations.filter(c => !c.is_pinned).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  const handleSelectChat = (id) => {
    selectConversation(id);
    onClose?.();
    navigate('/dashboard');
  };

  const handleNewChat = async () => {
    await createNewChat();
    onClose?.();
    navigate('/dashboard');
  };

  const renderChatList = (chats) => (
    chats.map((conv) => (
      <div
        key={conv.id}
        className={`w-full group flex items-center justify-between px-3 py-2 rounded-lg text-xs sm:text-sm transition-colors cursor-pointer ${
          activeConversationId === conv.id
            ? 'bg-neutral/10 text-secondary font-medium border-l-4 border-secondary'
            : 'text-primary hover:bg-neutral/10 border-l-4 border-transparent'
        }`}
        onClick={() => handleSelectChat(conv.id)}
      >
        <div className="flex items-center gap-3 truncate">
          <svg className={`w-4 h-4 flex-shrink-0 ${activeConversationId === conv.id ? 'text-secondary' : 'text-neutral'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span key={conv.title || 'new chat'} className="truncate animate-in fade-in duration-500">{conv.title || 'new chat'}</span>
        </div>
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setOpenMenuId(openMenuId === conv.id ? null : conv.id);
            }}
            className={`p-1 rounded transition-all ${
              openMenuId === conv.id ? 'opacity-100 bg-neutral/20 text-primary' : 'opacity-0 group-hover:opacity-100 hover:bg-neutral/20 text-neutral'
            }`}
            title="Options"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM18 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </button>
          
          {openMenuId === conv.id && (
            <div className="absolute right-0 mt-1 w-36 bg-surface rounded-md shadow-lg border border-neutral/20 z-50 overflow-hidden py-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  togglePin(conv.id);
                  setOpenMenuId(null);
                }}
                className="w-full text-left px-3 py-2 text-sm text-primary hover:bg-neutral/10 flex items-center gap-2 transition-colors"
              >
                <svg className="w-4 h-4 text-neutral" fill={conv.is_pinned ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
                {conv.is_pinned ? "Unpin" : "Pin"}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setChatToRename(conv);
                  setNewTitle(conv.title || 'new chat');
                  setOpenMenuId(null);
                }}
                className="w-full text-left px-3 py-2 text-sm text-primary hover:bg-neutral/10 flex items-center gap-2 transition-colors"
              >
                <svg className="w-4 h-4 text-neutral" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Rename
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setChatToDelete(conv);
                  setOpenMenuId(null);
                }}
                className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
              >
                <svg className="w-4 h-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    ))
  );

  return (
    <div className={`fixed inset-y-0 left-0 z-50 w-72 lg:w-64 bg-tertiary flex flex-col h-full flex-shrink-0 transition-transform duration-300 ease-in-out lg:static lg:z-auto lg:translate-x-0 ${isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}`}>
      <div 
        className="p-5 cursor-pointer flex items-center justify-between"
        onClick={() => {
          navigate('/dashboard');
          onClose?.();
        }}
      >
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-secondary tracking-tight">DocIntel AI</h1>
          <p className="text-[10px] sm:text-[11px] text-neutral mt-0.5 tracking-wider uppercase">AI Document Intelligence</p>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose?.();
          }}
          className="lg:hidden p-1.5 rounded-lg text-neutral hover:text-primary hover:bg-neutral/10 transition-colors cursor-pointer min-w-[36px] min-h-[36px] flex items-center justify-center"
          aria-label="Close menu"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="px-5 pb-4">
        <button
          onClick={handleNewChat}
          disabled={isInitializing}
          className="w-full bg-secondary hover:bg-secondary/90 disabled:opacity-50 text-white py-2.5 rounded-lg font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-sm shadow-secondary/20 cursor-pointer"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Chat
        </button>
      </div>

      <div className="px-5 pb-3">
        <div className="relative">
          <svg className="w-4 h-4 text-neutral absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search chats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-surface border border-neutral/20 rounded-lg text-xs sm:text-sm text-primary focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/50 transition-all placeholder-neutral/70"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {isInitializing ? (
          <div className="text-xs sm:text-sm text-neutral">Loading...</div>
        ) : filteredConversations.length === 0 ? (
          <div className="text-xs sm:text-sm text-neutral/70 italic">
            {searchQuery ? "No chats found." : "No history found."}
          </div>
        ) : (
          <>
            {pinnedChats.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-[10px] sm:text-xs font-bold text-neutral/80 uppercase tracking-wider mb-3">Pinned Chats</h3>
                {renderChatList(pinnedChats)}
              </div>
            )}
            
            {recentChats.length > 0 && (
              <div className="space-y-1">
                <h3 className="text-[10px] sm:text-xs font-bold text-neutral uppercase tracking-wider mb-2 ml-1">Recent Documents</h3>
                {renderChatList(recentChats)}
              </div>
            )}
          </>
        )}
      </div>

      {/* User Profile Footer */}
      {user && (
        <div className="mt-auto p-4 border-t border-neutral/10 bg-tertiary relative">
          
          {isProfileDropdownOpen && (
            <div className="absolute bottom-full left-4 right-4 mb-3 bg-surface rounded-xl shadow-xl border border-neutral/20 overflow-hidden animate-in slide-in-from-bottom-2 duration-200 z-50">
               <Link 
                  to="/profile" 
                  className="w-full flex items-center px-4 py-3 text-sm text-primary hover:bg-neutral/10 transition-colors border-b border-neutral/10"
                  onClick={() => {
                    setIsProfileDropdownOpen(false);
                    onClose?.();
                  }}
                >
                  <svg className="w-4 h-4 mr-3 text-neutral" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Settings
                </Link>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsProfileDropdownOpen(false);
                    setShowLogoutConfirm(true);
                  }}
                  className="w-full flex items-center text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <svg className="w-4 h-4 mr-3 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Sign out
                </button>
            </div>
          )}

          <button 
            onClick={(e) => {
              e.stopPropagation();
              setIsProfileDropdownOpen(!isProfileDropdownOpen);
            }} 
            className="w-full flex items-center gap-3 p-2 -m-2 rounded-lg transition-colors text-left"
          >
            <div className="w-9 h-9 rounded-full bg-secondary/10 flex items-center justify-center font-bold text-sm text-secondary overflow-hidden border border-secondary/20 flex-shrink-0">
              {user.profile_picture ? (
                <img 
                  src={
                    user.profile_picture.startsWith('http')
                      ? user.profile_picture
                      : `${import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'}${user.profile_picture}`
                  } 
                  alt={user.name} 
                  className="w-full h-full object-cover" 
                />
              ) : (
                user.name.substring(0, 2).toUpperCase()
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-primary truncate leading-tight">{user.name}</p>
              <p className="text-[11px] text-neutral mt-0.5 tracking-wide">Free Plan</p> 
            </div>
            <svg className={`w-4 h-4 text-neutral flex-shrink-0 transition-transform ${isProfileDropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {chatToDelete && (
        <div className="fixed inset-0 bg-primary/40 flex items-center justify-center z-50 p-4">
          <div className="bg-surface p-6 rounded-xl shadow-2xl max-w-sm w-full border border-neutral/20 animate-in fade-in zoom-in duration-200">
            <h3 className="text-lg font-bold text-primary mb-2 flex items-center gap-2">
              <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Delete Chat
            </h3>
            <p className="text-neutral text-sm mb-6">
              Are you sure you want to delete <span className="font-semibold text-primary">"{chatToDelete.title || 'new chat'}"</span>? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setChatToDelete(null)}
                className="px-4 py-2 text-sm font-medium text-neutral hover:text-primary hover:bg-neutral/10 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={isDeletingChat}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-70 shadow-sm shadow-red-600/20 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {isDeletingChat ? (
                  <>
                    <svg className="w-4 h-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Deleting...
                  </>
                ) : (
                  'Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rename Modal */}
      {chatToRename && (
        <div className="fixed inset-0 bg-primary/40 flex items-center justify-center z-50 p-4">
          <div className="bg-surface p-6 rounded-xl shadow-2xl max-w-sm w-full border border-neutral/20 animate-in fade-in zoom-in duration-200">
            <h3 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Rename Chat
            </h3>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full bg-surface border border-neutral/30 rounded-lg px-4 py-2 text-primary mb-6 focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary"
              placeholder="Enter new chat name"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') confirmRename();
                if (e.key === 'Escape') setChatToRename(null);
              }}
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setChatToRename(null)}
                className="px-4 py-2 text-sm font-medium text-neutral hover:text-primary hover:bg-neutral/10 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmRename}
                disabled={!newTitle.trim()}
                className="px-4 py-2 text-sm font-medium text-white bg-secondary hover:bg-secondary/90 disabled:opacity-50 shadow-sm shadow-secondary/20 rounded-lg transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

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
                onClick={() => setShowLogoutConfirm(false)}
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
    </div>
  );
}
