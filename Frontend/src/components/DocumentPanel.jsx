import React, { useEffect } from 'react';
import { useChatStore } from '../store/chatStore';
import { useDocumentStore } from '../store/documentStore';
import DocumentList from './DocumentList';
import UploadDropzone from './UploadDropzone';

export default function DocumentPanel({ isOpen, onClose }) {
  const { activeConversationId } = useChatStore();
  const { fetchDocuments, documents } = useDocumentStore();

  useEffect(() => {
    if (activeConversationId) {
      fetchDocuments(activeConversationId);
    }
  }, [activeConversationId, fetchDocuments]);

  return (
    <div className={`
      absolute lg:relative z-40 h-full bg-surface border-r border-neutral/10 shadow-sm flex flex-col transition-all duration-300 ease-in-out
      ${isOpen ? 'w-72 md:w-80 translate-x-0' : 'w-72 md:w-80 -translate-x-full lg:translate-x-0'}
      lg:w-80 flex-shrink-0
    `}>
      
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-neutral/10 h-16">
        <div>
          <h2 className="text-sm font-semibold text-primary uppercase tracking-wider">Documents</h2>
          <p className="text-xs text-neutral mt-0.5">{documents.length} files uploaded</p>
        </div>
        
        {/* Mobile Close Button */}
        <button 
          onClick={onClose}
          className="lg:hidden p-2 text-neutral hover:text-primary hover:bg-neutral/10 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Document List */}
      <DocumentList />

      {/* Upload Area */}
      <UploadDropzone />
      
    </div>
  );
}
