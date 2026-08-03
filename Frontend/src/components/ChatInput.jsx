import React, { useState, useRef, useEffect } from 'react';
import { useChatStore } from '../store/chatStore';
import { useDocumentStore } from '../store/documentStore';
import UploadPDF from './UploadPDF';

export default function ChatInput() {
  const [text, setText] = useState('');
  const textareaRef = useRef(null);

  const { sendMessage, isLoading, activeConversationId, streaming } = useChatStore();
  const { isUploading, uploadProgress } = useDocumentStore();

  // Auto-grow textarea height dynamically up to 160px (~6 lines)
  const adjustHeight = () => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = 'auto';
      const targetHeight = Math.min(Math.max(el.scrollHeight, 52), 160);
      el.style.height = `${targetHeight}px`;
    }
  };

  useEffect(() => {
    adjustHeight();
  }, [text]);

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed || isLoading || streaming || isUploading || !activeConversationId) return;

    sendMessage(trimmed);
    setText('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const isSendDisabled = !text.trim() || isLoading || streaming || isUploading || !activeConversationId;
  const isInputDisabled = !activeConversationId || streaming;

  const getStatusMessage = () => {
    if (uploadProgress < 90) {
      return `Uploading PDF document (${uploadProgress}%)...`;
    }
    return `Extracting text & indexing vectors... Please wait`;
  };

  return (
    <div className="bg-surface pt-2 pb-3 sm:pb-4 px-2 sm:px-4 w-full flex-shrink-0 border-t border-transparent">
      {/* Uploading Status Banner */}
      {isUploading && (
        <div className="max-w-3xl mx-auto mb-2 px-3 sm:px-3.5 py-2 bg-indigo-50 border border-indigo-200/80 rounded-xl flex items-center justify-between text-xs text-indigo-700 font-medium animate-in fade-in duration-200 shadow-2xs">
          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
            <svg className="w-4 h-4 animate-spin text-indigo-600 flex-shrink-0" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="truncate">{getStatusMessage()}</span>
          </div>
          <span className="font-bold bg-indigo-600 text-white px-2 py-0.5 rounded text-[10px] tracking-wide uppercase flex-shrink-0 ml-2">
            Processing
          </span>
        </div>
      )}

      <div className="max-w-3xl mx-auto relative flex items-end border border-neutral/20 rounded-xl shadow-sm focus-within:ring-1 focus-within:ring-secondary/50 focus-within:border-secondary/50 bg-surface overflow-hidden">
        {/* Upload Paperclip Icon Button */}
        <div className="flex items-center justify-center pl-2 sm:pl-2.5 h-[52px] w-10 sm:w-11 flex-shrink-0">
          <UploadPDF />
        </div>

        {/* Auto-Expanding Textarea */}
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            activeConversationId
              ? streaming
                ? 'AI is typing...'
                : isUploading
                ? 'Processing document...'
                : 'Ask anything about your documents...'
              : 'Please create a new chat to begin...'
          }
          disabled={isInputDisabled}
          className="w-full min-w-0 min-h-[52px] max-h-[160px] py-[13px] px-1 sm:px-2 resize-none focus:outline-none bg-transparent disabled:opacity-50 text-sm sm:text-[15px] leading-6 text-primary placeholder-neutral overflow-y-auto"
          rows={1}
        />

        {/* Send Button */}
        <div className="flex items-center justify-center pr-2 sm:pr-2.5 h-[52px] w-10 sm:w-11 flex-shrink-0">
          <button
            onClick={handleSend}
            disabled={isSendDisabled}
            className="w-9 h-9 rounded-lg flex items-center justify-center bg-secondary text-white disabled:bg-neutral/20 disabled:text-neutral/40 transition-colors shadow-sm shadow-secondary/20 cursor-pointer disabled:cursor-not-allowed min-w-[36px] min-h-[36px]"
            title={isUploading ? 'Upload in progress' : 'Send message'}
          >
            <svg className="w-4 h-4 ml-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
      <div className="text-center text-[10px] sm:text-xs text-neutral/70 mt-2 sm:mt-3 font-medium">
        DocIntel AI can make mistakes. Verify Important Info.
      </div>
    </div>
  );
}
