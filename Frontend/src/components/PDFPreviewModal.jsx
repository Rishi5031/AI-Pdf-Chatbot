import React, { useEffect, useState } from 'react';
import { useDocumentStore } from '../store/documentStore';
import api from '../api/axios';

export default function PDFPreviewModal() {
  const { previewDocumentId, setPreviewDocument, documents } = useDocumentStore();
  const [blobUrl, setBlobUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const doc = documents.find(d => d.id === previewDocumentId);

  useEffect(() => {
    if (!doc) return;

    let isMounted = true;
    const fetchPdf = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await api.get(`/api/documents/${doc.id}/file`, {
          responseType: 'blob'
        });
        
        if (isMounted) {
          const url = URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
          setBlobUrl(url);
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Failed to load PDF:', err);
        if (isMounted) {
          setError('Failed to load PDF. Please try again.');
          setIsLoading(false);
        }
      }
    };

    fetchPdf();

    return () => {
      isMounted = false;
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
      }
    };
  }, [doc]);

  if (!previewDocumentId) return null;

  const handleClose = () => {
    setPreviewDocument(null);
    if (blobUrl) {
      URL.revokeObjectURL(blobUrl);
      setBlobUrl(null);
    }
  };

  return (
    <div className="fixed inset-0 bg-primary/60 flex items-center justify-center z-[100] p-0 sm:p-4 lg:p-6 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-surface w-full h-full sm:h-[90vh] sm:max-w-5xl rounded-none sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden border-0 sm:border border-neutral/20 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-neutral/10 bg-surface">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="min-w-0">
              <h3 className="text-xs sm:text-sm lg:text-[15px] font-bold text-primary truncate">
                {doc ? doc.filename : 'Document Preview'}
              </h3>
              <p className="text-[10px] sm:text-xs text-neutral mt-0.5">Secure PDF Viewer</p>
            </div>
          </div>
          <button 
            onClick={handleClose}
            className="p-2 text-neutral hover:bg-neutral/10 hover:text-red-500 rounded-xl transition-colors cursor-pointer min-w-[40px] min-h-[40px] flex items-center justify-center"
            aria-label="Close preview"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* PDF Viewer */}
        <div className="flex-1 bg-tertiary relative">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full text-neutral px-4 text-center">
              <svg className="w-7 h-7 sm:w-8 sm:h-8 animate-spin text-secondary mb-3 sm:mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <p className="text-xs sm:text-sm font-medium">Loading document securely...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-full text-red-500 px-4 text-center">
              <p className="text-xs sm:text-sm font-medium">{error}</p>
            </div>
          ) : blobUrl ? (
            <iframe 
              src={`${blobUrl}#toolbar=0&view=FitH`}
              className="w-full h-full border-none"
              title="PDF Preview"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-neutral">
              Document not found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
