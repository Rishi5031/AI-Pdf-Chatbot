import React from 'react';
import { useChatStore } from '../store/chatStore';

export default function Sidebar() {
  const { conversations, activeConversationId, createNewChat, selectConversation, isInitializing } = useChatStore();

  return (
    <div className="w-64 bg-slate-900 text-white flex flex-col h-full flex-shrink-0">
      <div className="p-4">
        <button
          onClick={createNewChat}
          disabled={isInitializing}
          className="w-full bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white py-3 rounded-lg border border-slate-700 font-medium flex items-center justify-center gap-2 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Chat
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Recent Chats</h3>
        
        {isInitializing ? (
          <div className="text-sm text-slate-400">Loading...</div>
        ) : conversations.length === 0 ? (
          <div className="text-sm text-slate-500 italic">No history found.</div>
        ) : (
          conversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => selectConversation(conv.id)}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm flex items-center gap-3 transition-colors truncate ${
                activeConversationId === conv.id
                  ? 'bg-slate-800 text-white font-medium'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              <span className="truncate">{conv.title || 'New Chat'}</span>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
