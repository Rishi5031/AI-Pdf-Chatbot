import React, { useRef } from 'react';
import { useChatStore } from '../store/chatStore';
import { useDocumentStore } from '../store/documentStore';

export default function UploadPDF() {
  const { activeConversationId } = useChatStore();
  const { uploadDocuments, isUploading } = useDocumentStore();
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const files = e.target.files;
    if (files && files.length > 0 && activeConversationId) {
      const pdfFiles = Array.from(files).filter(file => file.type === 'application/pdf');
      if (pdfFiles.length > 0) {
        await uploadDocuments(pdfFiles, activeConversationId);
      }
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="relative">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="application/pdf"
        multiple
        className="hidden"
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading || !activeConversationId}
        className="p-2 text-neutral/80 hover:text-primary hover:bg-neutral/10 rounded-lg transition-colors disabled:opacity-50"
        title="Upload PDF"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
        </svg>
      </button>
    </div>
  );
}
