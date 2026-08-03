import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

export default function MainLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col lg:flex-row h-screen w-full font-sans bg-surface overflow-hidden text-primary relative">
      {/* Mobile Top Header */}
      <header className="lg:hidden h-14 bg-surface border-b border-neutral/20 px-4 flex items-center justify-between flex-shrink-0 z-30">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 -ml-1 text-primary hover:bg-neutral/10 rounded-lg transition-colors cursor-pointer min-w-[40px] min-h-[40px] flex items-center justify-center"
            aria-label="Toggle navigation menu"
          >
            {isSidebarOpen ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
          <Link to="/dashboard" className="font-bold text-lg tracking-tight text-secondary">
            DocIntel AI
          </Link>
        </div>
      </header>

      {/* Backdrop Overlay for Mobile Drawer */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-primary/40 backdrop-blur-xs z-40 lg:hidden transition-opacity duration-300"
          aria-hidden="true"
        />
      )}

      {/* Sidebar (Desktop static / Mobile drawer) */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col w-full h-full min-h-0 min-w-0 overflow-hidden relative border-t lg:border-t-0 lg:border-l border-neutral/20 shadow-sm">
        <main className="flex-1 flex flex-col w-full h-full min-h-0 min-w-0 overflow-hidden relative bg-surface">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
