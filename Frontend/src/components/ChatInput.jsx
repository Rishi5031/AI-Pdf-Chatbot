import React, { useState } from 'react';
import { useChatStore } from '../store/chatStore';
import UploadPDF from './UploadPDF';

export default function ChatInput() {
  const [text, setText] = useState('');
  const { sendMessage, isLoading, activeConversationId, streaming } = useChatStore();

  const handleSend = () => {
    if (!text.trim() || isLoading || streaming || !activeConversationId) return;
    sendMessage(text);
    setText('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="bg-surface pt-2 pb-4 px-4 w-full border-t border-transparent">
      <div className="max-w-3xl mx-auto relative flex items-end border border-neutral/20 rounded-xl shadow-sm focus-within:ring-1 focus-within:ring-secondary/50 focus-within:border-secondary/50 bg-surface overflow-hidden">
        
        <div className="flex items-center justify-center pl-2 h-[52px] w-12 flex-shrink-0">
          <UploadPDF />
        </div>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={activeConversationId ? (streaming ? "AI is typing..." : "Ask anything about your documents...") : "Please create a new chat to begin..."}
          disabled={!activeConversationId || streaming}
          className="w-full max-h-32 min-h-[52px] py-3.5 px-3 resize-none focus:outline-none bg-transparent disabled:opacity-50 text-[15px] text-primary placeholder-neutral"
          rows={1}
        />

        <div className="flex items-center justify-center pr-2 h-[52px] w-12 flex-shrink-0">
          <button
            onClick={handleSend}
            disabled={!text.trim() || isLoading || streaming || !activeConversationId}
            className="w-9 h-9 rounded-lg flex items-center justify-center bg-secondary text-white disabled:bg-neutral/20 disabled:text-neutral/40 transition-colors shadow-sm shadow-secondary/20"
          >
            <svg className="w-4 h-4 ml-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>

      </div>
      <div className="text-center text-xs text-neutral/70 mt-3 font-medium">
        DocIntel AI can make mistakes. Verify Important Info.
      </div>
    </div>
  );
}
