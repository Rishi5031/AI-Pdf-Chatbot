import React, { useEffect } from 'react';
import ChatWindow from '../components/ChatWindow';
import { useChatStore } from '../store/chatStore';

export default function Dashboard() {
  const { init } = useChatStore();

  useEffect(() => {
    init();
  }, []);

  return (
    <div className="flex-1 h-full w-full bg-white flex overflow-hidden">
      <ChatWindow />
    </div>
  );
}
