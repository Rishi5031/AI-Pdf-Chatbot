import React, { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import { useChatStore } from './store/chatStore';

export default function App() {
  const { init } = useChatStore();

  useEffect(() => {
    init();
  }, []);

  return (
    <div className="flex h-screen w-full font-sans bg-white overflow-hidden text-slate-800">
      <Toaster position="top-right" />
      <Sidebar />
      <ChatWindow />
    </div>
  );
}