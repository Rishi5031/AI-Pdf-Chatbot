import React, { useRef, useEffect } from 'react';
import { useDocumentStore } from '../store/documentStore';
import { useChatStore } from '../store/chatStore';
import DocumentList from './DocumentList';

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
    <div className="w-full bg-tertiary border-b border-neutral/10 flex flex-row items-center py-3 px-6 h-[72px]">
      
      {/* Title */}
      <div className="flex-shrink-0 mr-6">
        <span className="text-[11px] font-bold text-neutral uppercase tracking-wider">
          WORKSPACE ({documents.length}/20)
        </span>
      </div>

      {/* Document List & Add Button Container */}
      <div className="flex-1 flex flex-row items-center overflow-hidden">
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

    </div>
  );
}
