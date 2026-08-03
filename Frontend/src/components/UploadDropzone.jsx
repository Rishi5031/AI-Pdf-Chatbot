import React, { useRef, useState } from 'react';
import { useDocumentStore } from '../store/documentStore';
import { useChatStore } from '../store/chatStore';

export default function UploadDropzone() {
  const { uploadDocuments, isUploading, uploadProgress } = useDocumentStore();
  const { activeConversationId } = useChatStore();
  const fileInputRef = useRef(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFiles = async (files) => {
    if (!files || files.length === 0 || !activeConversationId) return;
    
    // Filter for PDFs
    const pdfFiles = Array.from(files).filter(file => file.type === 'application/pdf');
    
    if (pdfFiles.length > 0) {
      await uploadDocuments(pdfFiles, activeConversationId);
    }
    
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  const onDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const onDragLeave = () => {
    setIsDragOver(false);
  };

  return (
    <div className="p-4 border-t border-neutral/10 bg-surface">
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => handleFiles(e.target.files)}
        accept="application/pdf"
        multiple
        className="hidden"
      />
      
      <div 
        onClick={() => !isUploading && activeConversationId && fileInputRef.current?.click()}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        className={`
          flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-xl transition-all cursor-pointer text-center
          ${!activeConversationId ? 'opacity-50 cursor-not-allowed border-neutral/20' : 
            isUploading ? 'border-secondary/50 bg-secondary/5 cursor-wait' : 
            isDragOver ? 'border-secondary bg-secondary/10' : 
            'border-neutral/30 hover:border-secondary hover:bg-neutral/5'}
        `}
      >
        {isUploading ? (
          <div className="w-full">
            <div className="flex justify-between text-[11px] sm:text-xs text-primary font-medium mb-1.5">
              <span>Uploading...</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="w-full bg-neutral/20 rounded-full h-1.5">
              <div 
                className="bg-secondary h-1.5 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          </div>
        ) : (
          <>
            <svg className={`w-5 h-5 sm:w-6 sm:h-6 mb-1.5 sm:mb-2 ${isDragOver ? 'text-secondary' : 'text-neutral'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <span className="text-xs sm:text-sm font-medium text-primary">Upload PDF</span>
            <span className="text-[10px] sm:text-xs text-neutral mt-0.5">Drag & drop or click</span>
          </>
        )}
      </div>
    </div>
  );
}
