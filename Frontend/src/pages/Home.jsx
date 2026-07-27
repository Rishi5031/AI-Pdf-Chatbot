import React from 'react';
import UploadBox from '../components/UploadBox';

export default function Home() {
  return (
    <div className="flex h-screen w-full bg-tertiary font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between p-4 flex-shrink-0">
        <div>
          <div className="flex items-center gap-3 px-2 mb-8 mt-2">
            <div className="w-8 h-8 bg-secondary rounded flex items-center justify-center text-white font-bold">
              P
            </div>
            <div>
              <h1 className="text-primary font-bold leading-tight">PDF Insight AI</h1>
              <p className="text-neutral text-xs">Researcher Pro</p>
            </div>
          </div>
          
          <nav className="space-y-1">
            <a href="#" className="flex items-center gap-3 px-3 py-2 bg-slate-100 text-secondary font-medium rounded-lg">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Documents
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2 text-neutral hover:bg-slate-50 hover:text-primary rounded-lg transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Chat History
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2 text-neutral hover:bg-slate-50 hover:text-primary rounded-lg transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              Bookmarks
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2 text-neutral hover:bg-slate-50 hover:text-primary rounded-lg transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Settings
            </a>
          </nav>
        </div>

        <div>
          {/* <button className="w-full bg-primary text-white py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 mb-6 shadow hover:bg-slate-800 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Document
          </button> */}
          
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
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 flex-shrink-0">
          <div className="flex items-center gap-8">
            <h2 className="text-xl font-bold text-primary">Dashboard</h2>
            <nav className="flex gap-6 mt-1">
              <a href="#" className="text-secondary font-medium border-b-2 border-secondary px-1">Dashboard</a>
              <a href="#" className="text-neutral hover:text-primary pb-2 px-1 transition-colors">Analytics</a>
              <a href="#" className="text-neutral hover:text-primary pb-2 px-1 transition-colors">Team</a>
            </nav>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <svg className="w-4 h-4 text-neutral absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input 
                type="text" 
                placeholder="Search insights..." 
                className="pl-9 pr-4 py-1.5 bg-slate-100 border border-slate-200 rounded-full text-sm w-64 focus:outline-none focus:ring-2 focus:ring-secondary/20"
              />
            </div>
            <button className="bg-secondary text-white px-5 py-1.5 rounded-full text-sm font-medium hover:bg-blue-600 transition-colors">
              Upgrade Plan
            </button>
            <button className="text-neutral hover:text-primary mx-1">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
            <div className="w-8 h-8 bg-slate-200 rounded-full overflow-hidden border border-slate-300">
              <img src="https://ui-avatars.com/api/?name=User&background=random" alt="Profile" />
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-auto p-8">
          <div className="max-w-4xl mx-auto flex flex-col items-center">
            
            <div className="text-center mb-12 mt-4">
              <h1 className="text-[40px] font-bold text-primary mb-4">Intelligent Document Clarity</h1>
              <p className="text-neutral max-w-2xl mx-auto text-base">
                Transform your research process by chatting directly with your data. Extract
                insights, summarize papers, and cross-reference sources in seconds.
              </p>
            </div>

            {/* Upload Area */}
            <div className="w-full max-w-2xl bg-white rounded-[24px] p-12 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center relative">
              <UploadBox />
            </div>

            {/* Recent Documents */}
            {/* <div className="w-full max-w-2xl mt-12">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-[15px] font-bold text-primary">Recent Documents</h3>
                <a href="#" className="text-secondary text-sm font-medium hover:underline">View all history</a>
              </div>
              
              <div className="grid grid-cols-3 gap-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col h-32 hover:shadow-md transition-shadow cursor-pointer relative">
                    <div className="w-10 h-10 bg-[#e8f0fe] rounded flex items-center justify-center text-secondary mb-3">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <button className="absolute top-4 right-3 text-slate-400 hover:text-slate-600">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div> */}

          </div>
        </div>
      </main>
    </div>
  );
}
