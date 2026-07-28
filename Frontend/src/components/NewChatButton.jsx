import React from 'react';
import { useChat } from '../hooks/useChat';

export default function NewChatButton() {
  const { startNewChat, isInitializing } = useChat();

  return (
    <button 
      onClick={startNewChat}
      disabled={isInitializing}
      className="w-full bg-primary text-white py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 mb-6 shadow hover:bg-slate-800 disabled:opacity-50 transition-colors"
    >
      {isInitializing ? (
        <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      ) : (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      )}
      {isInitializing ? 'Creating Session...' : 'New Chat'}
    </button>
  );
}
