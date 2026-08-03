import React, { useState } from 'react';
import { useChatStore } from '../store/chatStore';
import { useDocumentStore } from '../store/documentStore';
import SummaryModal from './SummaryModal';

export default function ChatToolbar() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isLoading, streaming, summaryLoading } = useChatStore();
  const { documents } = useDocumentStore();
  
  const hasDocuments = documents && documents.length > 0;
  
  // Disable button if no documents exist or if the app is loading/streaming
  const isDisabled = !hasDocuments || isLoading || streaming || summaryLoading;

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        disabled={isDisabled}
        className={`flex-shrink-0 flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
          isDisabled 
            ? 'bg-neutral/5 text-neutral/40 cursor-not-allowed'
            : 'bg-secondary/10 text-secondary hover:bg-secondary/20'
        }`}
        title={!hasDocuments ? "Upload documents first" : "Summarize uploaded documents"}
      >
        {summaryLoading ? (
          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        )}
        Summarize
      </button>
      
      <SummaryModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
}
