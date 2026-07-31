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
    <>
      <ChatWindow />
      <PDFPreviewModal />
    </>
  );
}
