import React, { useEffect } from 'react';
import ChatWindow from '../components/ChatWindow';
import PDFPreviewModal from '../components/PDFPreviewModal';
import { useChatStore } from '../store/chatStore';

export default function Dashboard() {
  const { init } = useChatStore();

  useEffect(() => {
    init();
  }, [init]);

  return (
    <div className="flex-1 flex flex-col min-h-0 min-w-0 h-full w-full overflow-hidden relative bg-surface">
      <ChatWindow />
      <PDFPreviewModal />
    </div>
  );
}
