import React, { useRef, useEffect } from 'react';
import { useDocumentStore } from '../store/documentStore';
import { useChatStore } from '../store/chatStore';
import DocumentList from './DocumentList';
import ChatToolbar from './ChatToolbar';

export default function DocumentBar() {
  const { activeConversationId } = useChatStore();
  const { uploadDocuments, isUploading, documents, fetchDocuments } = useDocumentStore();
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (activeConversationId) {
      fetchDocuments(activeConversationId);
    }
  }, [activeConversationId, fetchDocuments]);

  const handleFiles = async (files) => {
    if (!files || files.length === 0 || !activeConversationId) return;
    const pdfFiles = Array.from(files).filter(file => file.type === 'application/pdf');
    if (pdfFiles.length > 0) {
      await uploadDocuments(pdfFiles, activeConversationId);
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  if (!activeConversationId) return null;

  return (
    <div className="w-full bg-tertiary border-b border-neutral/10 flex flex-row items-center py-2 sm:py-3 px-3 sm:px-6 min-h-[56px] sm:h-[72px] gap-2 sm:gap-4">
      
      {/* Title */}
      <div className="flex-shrink-0">
        <span className="text-[10px] sm:text-[11px] font-bold text-neutral uppercase tracking-wider whitespace-nowrap">
          WORKSPACE ({documents.length}/20)
        </span>
      </div>

      {/* Document List & Add Button Container */}
      <div className="flex-1 flex flex-row items-center overflow-hidden min-w-0">
        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) => handleFiles(e.target.files)}
          accept="application/pdf"
          multiple
          className="hidden"
        />
        <DocumentList onAddClick={() => !isUploading && fileInputRef.current?.click()} isUploading={isUploading} />
      </div>

      {documents.length > 0 && (
        <div className="flex-shrink-0">
          <ChatToolbar />
        </div>
      )}
    </div>
  );
}
