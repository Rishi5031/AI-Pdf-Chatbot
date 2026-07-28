import React, { useState } from 'react';
import UploadBox from '../components/UploadBox';
import NewChatButton from '../components/NewChatButton';
import { useChat } from '../hooks/useChat';

export default function Home() {
  const [question, setQuestion] = useState("");
  const {
    sessionId,
    messages,
    activeFile,
    isLoading,
    isInitializing,
    askQuestion,
    handleUploadSuccess
  } = useChat();

  const handleSend = () => {
    if (!sessionId || isInitializing) return;
    askQuestion(question);
    setQuestion("");
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="flex h-screen w-full bg-tertiary font-sans">
      {/* Sidebar */}
      <aside className="w-80 bg-white border-r border-slate-200 flex flex-col justify-between p-4 flex-shrink-0">
        <div className="flex-1 overflow-auto flex flex-col">
          <div className="flex items-center gap-3 px-2 mb-6 mt-2 flex-shrink-0">
            <div className="w-8 h-8 bg-secondary rounded flex items-center justify-center text-white font-bold">
              P
            </div>
            <div>
              <h1 className="text-primary font-bold leading-tight">PDF Insight AI</h1>
              <p className="text-neutral text-xs">Researcher Pro</p>
            </div>
          </div>

          <div className="px-2 mb-6 flex-shrink-0">
            <div className="relative">
              <svg className="w-4 h-4 text-neutral absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input 
                type="text" 
                placeholder="Search files..." 
                className="w-full pl-9 pr-4 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 transition-all"
              />
            </div>
          </div>
          
          <div className="flex justify-between items-center mb-4 px-2 flex-shrink-0">
            <h3 className="font-bold text-primary text-sm">Recent Files</h3>
            <a href="#" className="text-secondary text-xs font-bold hover:underline">History</a>
          </div>
          
          <div className="space-y-3 px-2 pb-4 overflow-y-auto flex-1">
            {/* File Card 1 (Active) */}
            {activeFile && (
              <div className="bg-white border border-slate-200 rounded-xl p-3 flex items-center justify-between shadow-sm cursor-pointer">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#e8f0fe] rounded-lg flex items-center justify-center text-secondary">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                         <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                       <div className="text-sm font-bold text-primary line-clamp-1">{activeFile}</div>
                       <div className="text-[11px] text-neutral">Just now • uploaded</div>
                    </div>
                 </div>
                 <div className="w-2 h-2 bg-secondary rounded-full"></div>
              </div>
            )}
          </div>
        </div>

        <div>
          <NewChatButton />
          <nav className="space-y-1">
            <a href="#" className="flex items-center gap-3 px-3 py-2 text-neutral hover:bg-slate-50 hover:text-primary rounded-lg transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Help
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2 text-neutral hover:bg-slate-50 hover:text-primary rounded-lg transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </a>
          </nav>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-tertiary">


        {/* Two-Column Content Area */}
        <div className="flex-1 overflow-hidden flex">
          
          {/* Left Column (Chat Area) */}
          <div className="flex-1 flex flex-col h-full border-r border-slate-200">
            
            {/* Active Document Top Bar */}
            {/* <div className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-6 flex-shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center text-white">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                     <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-secondary uppercase tracking-wider">Active Document</div>
                  <div className="font-bold text-primary">{activeFile}</div>
                </div>
              </div>
              <div className="flex gap-3">
                <button className="text-neutral hover:text-primary">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                </button>
                <button className="text-neutral hover:text-primary">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                  </svg>
                </button>
              </div>
            </div> */}
            
            {/* Chat Messages */}
            <div className="flex-1 overflow-auto p-6 space-y-6">
              {messages.map((msg, i) => (
                <div key={i} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                  {msg.role === 'bot' && (
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-white flex-shrink-0 mt-1 shadow-sm">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                         <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                  
                  <div className={`max-w-[80%] ${msg.role === 'user' ? 'bg-primary text-white' : 'bg-slate-100 text-slate-700'} rounded-2xl p-4 text-[15px] leading-relaxed shadow-sm`}>
                    {msg.content}
                    
                    {/* Bot action buttons (Helpful/Copy) */}
                    {msg.role === 'bot' && !msg.suggestions && (
                       <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-200/50 text-xs text-neutral font-medium">
                         <button className="flex items-center gap-1 hover:text-primary">
                           <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.514" />
                           </svg>
                           Helpful
                         </button>
                         <button className="flex items-center gap-1 hover:text-primary">
                           <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.714.211-1.412.608-2.006L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.514" />
                           </svg>
                           Not helpful
                         </button>
                         <button className="flex items-center gap-1 ml-auto hover:text-primary">
                           <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                           </svg>
                           Copy
                         </button>
                       </div>
                    )}
                    
                    {/* Bot Suggestions */}
                    {msg.suggestions && (
                      <div className="flex gap-3 mt-4">
                        {msg.suggestions.map((sug, idx) => (
                          <button key={idx} onClick={() => askQuestion(sug)} className="bg-white border border-secondary text-secondary text-sm font-medium py-1.5 px-4 rounded-full hover:bg-slate-50 transition-colors">
                            {sug}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {msg.role === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white flex-shrink-0 mt-1 shadow-sm">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
              
              {isLoading && (
                 <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-white flex-shrink-0 mt-1 shadow-sm">
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </div>
                    <div className="bg-slate-100 rounded-2xl p-4 text-[15px] shadow-sm flex items-center gap-1">
                       <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                       <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: "0.2s"}}></span>
                       <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: "0.4s"}}></span>
                    </div>
                 </div>
              )}
            </div>

            {/* Chat Input */}
            <div className="p-4 bg-white border-t border-slate-200">
              <div className="max-w-3xl mx-auto">
                <div className="relative flex items-center">
                  <input 
                    type="text" 
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={isInitializing || !sessionId}
                    placeholder={isInitializing || !sessionId ? "Creating new chat session..." : "Ask a question about your document..."} 
                    className="w-full border border-slate-300 rounded-full py-3.5 pl-6 pr-24 focus:outline-none focus:ring-2 focus:ring-secondary/30 shadow-sm text-[15px] disabled:opacity-50 disabled:bg-slate-50"
                  />
                  <div className="absolute right-2 flex items-center gap-1">
                    <UploadBox variant="icon" onUploadSuccess={handleUploadSuccess} />
                    <button onClick={handleSend} disabled={!question.trim() || isInitializing || !sessionId} className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center hover:bg-slate-800 disabled:opacity-50 transition-colors shadow-md">
                      <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20">
                         <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="text-center mt-3 text-[10px] text-neutral/70 font-medium tracking-wide">
                  AI CAN MAKE MISTAKES. CHECK IMPORTANT INFO.
                </div>
              </div>
            </div>
            
          </div>

        </div>
      </main>
    </div>
  );
}
