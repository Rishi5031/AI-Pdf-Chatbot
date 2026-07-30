import React, { useState, useEffect } from 'react';
import { useChatStore } from '../store/chatStore';

export default function Sidebar() {
  const { conversations, activeConversationId, createNewChat, selectConversation, deleteConversation, togglePin, renameConversation, isInitializing } = useChatStore();
  const [chatToDelete, setChatToDelete] = useState(null);
  const [chatToRename, setChatToRename] = useState(null);
  const [newTitle, setNewTitle] = useState('');
  const [openMenuId, setOpenMenuId] = useState(null);

  useEffect(() => {
    const handleClickOutside = () => setOpenMenuId(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const confirmDelete = () => {
    if (chatToDelete) {
      deleteConversation(chatToDelete.id);
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

  const pinnedChats = conversations.filter(c => c.is_pinned).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  const recentChats = conversations.filter(c => !c.is_pinned).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  const renderChatList = (chats) => (
    chats.map((conv) => (
      <div
        key={conv.id}
        className={`w-full group flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors cursor-pointer ${
          activeConversationId === conv.id
            ? 'bg-neutral/20 text-tertiary font-medium'
            : 'text-tertiary/70 hover:bg-neutral/20 hover:text-tertiary'
        }`}
        onClick={() => selectConversation(conv.id)}
      >
        <div className="flex items-center gap-3 truncate">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          <span className="truncate">{conv.title || 'new chat'}</span>
        </div>
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setOpenMenuId(openMenuId === conv.id ? null : conv.id);
            }}
            className={`p-1 rounded transition-all ${
              openMenuId === conv.id ? 'opacity-100 bg-neutral/30 text-tertiary' : 'opacity-0 group-hover:opacity-100 hover:bg-neutral/30 text-neutral'
            }`}
            title="Options"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM18 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </button>
          
          {openMenuId === conv.id && (
            <div className="absolute right-0 mt-1 w-36 bg-primary rounded-md shadow-lg border border-neutral/30 z-50 overflow-hidden py-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  togglePin(conv.id);
                  setOpenMenuId(null);
                }}
                className="w-full text-left px-3 py-2 text-sm text-tertiary/80 hover:bg-neutral/30 hover:text-tertiary flex items-center gap-2 transition-colors"
              >
                <svg className="w-4 h-4" fill={conv.is_pinned ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
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
                className="w-full text-left px-3 py-2 text-sm text-tertiary/80 hover:bg-neutral/30 hover:text-tertiary flex items-center gap-2 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                className="w-full text-left px-3 py-2 text-sm text-secondary hover:bg-secondary/10 flex items-center gap-2 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
    <div className="w-64 bg-primary text-tertiary flex flex-col h-full flex-shrink-0">
      <div className="p-4">
        <button
          onClick={createNewChat}
          disabled={isInitializing}
          className="w-full bg-neutral/20 hover:bg-neutral/30 disabled:opacity-50 text-tertiary py-3 rounded-lg border border-neutral/30 font-medium flex items-center justify-center gap-2 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          new chat
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {isInitializing ? (
          <div className="text-sm text-neutral">Loading...</div>
        ) : conversations.length === 0 ? (
          <div className="text-sm text-neutral/70 italic">No history found.</div>
        ) : (
          <>
            {pinnedChats.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-neutral/80 uppercase tracking-wider mb-3">Pinned Chats</h3>
                {renderChatList(pinnedChats)}
              </div>
            )}
            
            {recentChats.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-neutral/80 uppercase tracking-wider mb-3">Recent Chats</h3>
                {renderChatList(recentChats)}
              </div>
            )}
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {chatToDelete && (
        <div className="fixed inset-0 bg-primary/60 flex items-center justify-center z-50 p-4">
          <div className="bg-primary p-6 rounded-xl shadow-2xl max-w-sm w-full border border-neutral/30 animate-in fade-in zoom-in duration-200">
            <h3 className="text-lg font-bold text-tertiary mb-2 flex items-center gap-2">
              <svg className="w-5 h-5 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Delete Chat
            </h3>
            <p className="text-tertiary/80 text-sm mb-6">
              Are you sure you want to delete <span className="font-semibold text-tertiary">"{chatToDelete.title || 'new chat'}"</span>? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setChatToDelete(null)}
                className="px-4 py-2 text-sm font-medium text-tertiary/80 hover:text-tertiary hover:bg-neutral/20 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-sm font-medium text-tertiary bg-secondary hover:bg-secondary/80 shadow-sm shadow-secondary/20 rounded-lg transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rename Modal */}
      {chatToRename && (
        <div className="fixed inset-0 bg-primary/60 flex items-center justify-center z-50 p-4">
          <div className="bg-primary p-6 rounded-xl shadow-2xl max-w-sm w-full border border-neutral/30 animate-in fade-in zoom-in duration-200">
            <h3 className="text-lg font-bold text-tertiary mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Rename Chat
            </h3>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full bg-neutral/10 border border-neutral/30 rounded-lg px-4 py-2 text-tertiary mb-6 focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary"
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
                className="px-4 py-2 text-sm font-medium text-tertiary/80 hover:text-tertiary hover:bg-neutral/20 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmRename}
                disabled={!newTitle.trim()}
                className="px-4 py-2 text-sm font-medium text-tertiary bg-secondary hover:bg-secondary/80 disabled:opacity-50 shadow-sm shadow-secondary/20 rounded-lg transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
