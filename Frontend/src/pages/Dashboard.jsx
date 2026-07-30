import React, { useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import ChatWindow from '../components/ChatWindow';
import { useChatStore } from '../store/chatStore';

export default function Dashboard() {
  const { init } = useChatStore();

  useEffect(() => {
    init();
  }, []);

  return (
    <div className="flex h-full w-full overflow-hidden">
      <Sidebar />
      <ChatWindow />
    </div>
  );
}
