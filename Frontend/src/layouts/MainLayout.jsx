import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

export default function MainLayout() {
  return (
    <div className="flex h-screen w-full font-sans bg-surface overflow-hidden text-primary">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden relative border-l border-neutral/20 shadow-sm">
        <main className="flex-1 overflow-hidden relative flex bg-surface">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
