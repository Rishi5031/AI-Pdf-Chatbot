import React, { useState } from 'react';
import { useDocumentStore } from '../store/documentStore';
import DocumentCard from './DocumentCard';
import DeleteDocumentDialog from './DeleteDocumentDialog';

export default function DocumentList({ onAddClick, isUploading }) {
  const { documents, isLoading } = useDocumentStore();
  const [docToDelete, setDocToDelete] = useState(null);

  if (isLoading) {
    return (
      <div className="flex flex-row gap-2 overflow-hidden pb-1">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse flex items-center px-2.5 py-1.5 bg-white border border-neutral/20 rounded-[10px] min-w-[150px]">
            <div className="w-4 h-4 bg-neutral/20 rounded mr-2"></div>
            <div className="flex-1 space-y-1.5">
              <div className="h-2 bg-neutral/20 rounded w-20"></div>
              <div className="h-1.5 bg-neutral/20 rounded w-12"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (documents.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-row gap-3 overflow-x-auto scrollbar-none items-center w-full pb-1">
      {documents.map((doc) => (
        <DocumentCard 
          key={doc.id} 
          document={doc} 
          onDeleteClick={(document) => setDocToDelete(document)} 
        />
      ))}
      
      <button 
        onClick={onAddClick}
        disabled={isUploading || documents.length >= 20}
        className="flex-shrink-0 flex items-center justify-center w-16 h-12 bg-white border border-dashed border-neutral/30 rounded-xl hover:border-neutral/50 hover:bg-neutral/5 transition-colors disabled:opacity-50"
      >
        <svg className="w-5 h-5 text-neutral/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button>
      
      {docToDelete && (
        <DeleteDocumentDialog 
          document={docToDelete} 
          onClose={() => setDocToDelete(null)} 
        />
      )}
    </div>
  );
}
