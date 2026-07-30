import React, { useState } from 'react';
import { useChatStore } from '../store/chatStore';
import UploadPDF from './UploadPDF';

export default function ChatInput() {
  const [text, setText] = useState('');
  const { sendMessage, isLoading, activeConversationId } = useChatStore();

  const handleSend = () => {
    if (!text.trim() || isLoading || !activeConversationId) return;
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
    <div className="bg-tertiary pt-4 pb-8 px-4 w-full">
      <div className="max-w-3xl mx-auto relative flex items-end border border-neutral/30 rounded-xl shadow-sm focus-within:ring-1 focus-within:ring-secondary/30 focus-within:border-secondary/30 bg-tertiary overflow-hidden">
        
        <div className="flex items-center pl-2 pb-2 h-[52px]">
          <UploadPDF />
        </div>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={activeConversationId ? "Message ChatGPT..." : "Please create a new chat to begin..."}
          disabled={!activeConversationId}
          className="w-full max-h-32 min-h-[52px] py-3.5 px-3 resize-none focus:outline-none bg-transparent disabled:opacity-50 text-[15px]"
          rows={1}
        />

        <div className="flex items-center pr-2 pb-2 h-[52px]">
          <button
            onClick={handleSend}
            disabled={!text.trim() || isLoading || !activeConversationId}
            className="w-8 h-8 rounded-lg flex items-center justify-center bg-primary text-tertiary disabled:bg-neutral/20 disabled:text-neutral/40 transition-colors"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
               <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
        </div>

      </div>
      {/* <div className="text-center text-xs text-neutral mt-2">
        ChatGPT can make mistakes. Check important info.
      </div> */}
    </div>
  );
}
