import React from 'react';
import { useDocumentStore } from '../store/documentStore';

export default function DocumentCard({ document, onDeleteClick }) {
  const { setPreviewDocument } = useDocumentStore();
  // Use a pseudo size since backend doesn't provide it yet
  // but if it ever does, this could be document.size
  const size = "1.2 MB"; 

  return (
    <div 
      onClick={() => setPreviewDocument(document.id)}
      className="group flex-shrink-0 flex items-center px-3 py-2 bg-white border border-neutral/20 rounded-[12px] hover:border-neutral/40 transition-colors min-w-[200px] max-w-[260px] relative cursor-pointer"
    >
      
      {/* Icon */}
      <div className="flex items-center justify-center text-secondary mr-3 bg-secondary/10 w-8 h-8 rounded-lg">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>

      {/* Info */}
      <div className="flex flex-col min-w-[120px] max-w-[180px]">
        <p className="text-[12px] font-semibold text-primary truncate" title={document.filename}>
          {document.filename}
        </p>
        <div className="flex items-center ">
          <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5"></span>
          <p className="text-[10px] text-neutral/80 font-medium">
            Synced
          </p>
        </div>
      </div>

      {/* Close/Delete Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDeleteClick(document);
        }}
        className="absolute right-2 opacity-0 group-hover:opacity-100 p-1 text-neutral/40 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
        title="Delete Document"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

    </div>
  );
}
