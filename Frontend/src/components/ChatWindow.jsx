import React, { useEffect, useRef } from 'react';
import { useChatStore } from '../store/chatStore';
import MessageBubble from './MessageBubble';
import ChatInput from './ChatInput';
import DocumentBar from './DocumentBar';

export default function ChatWindow() {
  const { 
    messages, isLoading, isInitializing, activeConversationId, 
    streaming, currentStreamingMessage, cancelStreaming, regenerate 
  } = useChatStore();
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading, currentStreamingMessage]);

  if (isInitializing) {
    return (
      <div className="flex-1 flex items-center justify-center bg-surface">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-surface overflow-hidden relative">
      <DocumentBar />

      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center max-w-3xl mx-auto px-4 pb-20">
            
            {/* Welcome Graphic */}
            <div className="w-20 h-20 bg-surface border-2 border-neutral/10 rounded-2xl flex items-center justify-center mb-8 shadow-sm">
              <svg className="w-10 h-10 text-secondary" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
              </svg>
            </div>
            
            <h2 className="text-3xl font-bold text-primary mb-4 tracking-tight">How can I help you today?</h2>
            <p className="text-base text-neutral text-center max-w-md mb-2">
              Upload a PDF using the paperclip icon below and ask me questions about its content.
            </p>
            <p className="text-xs text-neutral/70 font-medium mb-12">
              You can upload up to 20 documents in a single chat.
            </p>

            {/* Suggestion Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
              
              <button className="flex flex-col items-start p-5 bg-surface border border-neutral/20 rounded-xl hover:border-secondary hover:shadow-md hover:shadow-secondary/10 transition-all text-left group">
                <svg className="w-5 h-5 text-secondary mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="text-sm font-medium text-primary group-hover:text-secondary transition-colors">Summarize complex legal terms</span>
              </button>

              <button className="flex flex-col items-start p-5 bg-surface border border-neutral/20 rounded-xl hover:border-secondary hover:shadow-md hover:shadow-secondary/10 transition-all text-left group">
                <svg className="w-5 h-5 text-secondary mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span className="text-sm font-medium text-primary group-hover:text-secondary transition-colors">Analyze financial trends</span>
              </button>
              
            </div>
          </div>
        ) : (
          <div className="pb-4">
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
            
            {streaming && currentStreamingMessage && (
              <MessageBubble 
                key="streaming" 
                message={{ role: 'assistant', content: currentStreamingMessage }} 
                isStreaming={true} 
              />
            )}
            
            {isLoading && !currentStreamingMessage && (
              <div className="py-3 flex justify-center w-full">
                <div className="max-w-3xl w-full px-4 flex justify-start">
                  <div className="flex items-start gap-4 w-full bg-tertiary border border-neutral/20 rounded-2xl p-6 shadow-sm">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 font-semibold text-sm shadow-sm bg-secondary text-white">
                      AI
                    </div>
                    <div className="flex-1 pt-2.5 flex items-center gap-1.5">
                      <span className="w-2 h-2 bg-neutral/50 rounded-full animate-bounce"></span>
                      <span className="w-2 h-2 bg-neutral/50 rounded-full animate-bounce" style={{animationDelay: "0.2s"}}></span>
                      <span className="w-2 h-2 bg-neutral/50 rounded-full animate-bounce" style={{animationDelay: "0.4s"}}></span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex justify-center mt-6 mb-2">
              {streaming ? (
                <button 
                  onClick={cancelStreaming}
                  className="px-5 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-full text-sm font-semibold flex items-center transition-colors border border-red-200 shadow-sm"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <rect x="6" y="6" width="12" height="12" strokeWidth={2} />
                  </svg>
                  Stop Generating
                </button>
              ) : (
                messages.length > 0 && messages[messages.length - 1].role === 'assistant' && (
                  <button 
                    onClick={regenerate}
                    className="px-5 py-2 bg-surface hover:bg-neutral/5 text-secondary rounded-full text-sm font-semibold flex items-center transition-colors border border-neutral/20 shadow-sm"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Regenerate
                  </button>
                )
              )}
            </div>

            <div ref={bottomRef} className="h-4" />
          </div>
        )}
      </div>

      <ChatInput />
    </div>
  );
}
