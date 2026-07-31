import React, { useState } from 'react';
import { useDocumentStore } from '../store/documentStore';

export default function DeleteDocumentDialog({ document, onClose }) {
  const { deleteDocument } = useDocumentStore();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    await deleteDocument(document.id);
    setIsDeleting(false);
    onClose();
  };

  if (!document) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-surface rounded-2xl shadow-xl border border-neutral/20 max-w-sm w-full p-6 animate-in zoom-in-95 duration-200">
        <h3 className="text-xl font-bold text-primary mb-2">Delete Document</h3>
        <p className="text-neutral text-sm mb-6">
          Are you sure you want to delete <span className="font-semibold text-primary">{document.filename}</span>? This action cannot be undone and will remove it from the conversation's knowledge base.
        </p>
        
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 text-sm font-medium text-neutral hover:text-primary transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-4 py-2 text-sm font-medium bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
          >
            {isDeleting ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Deleting...
              </>
            ) : (
              'Delete'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
