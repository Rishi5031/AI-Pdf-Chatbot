import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function MainLayout() {
  return (
    <div className="flex flex-col h-screen w-full font-sans bg-tertiary overflow-hidden text-primary">
      <Navbar />
      <main className="flex-1 overflow-hidden relative flex">
        <Outlet />
      </main>
    </div>
  );
}
