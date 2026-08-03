import { create } from 'zustand';
import { documentService } from '../services/documentService';
import { uploadService } from '../services/uploadService';
import toast from 'react-hot-toast';
import { useSuggestionStore } from './suggestionStore';

export const useDocumentStore = create((set, get) => ({
  documents: [],
  isLoading: false,
  isUploading: false,
  uploadProgress: 0,
  error: null,
  previewDocumentId: null,

  setPreviewDocument: (id) => set({ previewDocumentId: id }),

  fetchDocuments: async (conversationId) => {
    if (!conversationId) return;
    set({ isLoading: true, error: null });
    try {
      const docs = await documentService.getDocumentsByConversation(conversationId);
      set({ documents: Array.isArray(docs) ? docs : [] });
    } catch (error) {
      console.error("Failed to fetch documents:", error);
      set({ documents: [], error: null });
    } finally {
      set({ isLoading: false });
    }
  },

  uploadDocuments: async (files, conversationId) => {
    if (!conversationId || !files || files.length === 0) return;
    
    set({ isUploading: true, uploadProgress: 0 });
    
    let successCount = 0;
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        await uploadService.uploadPDF(file, conversationId, (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 90) / progressEvent.total);
          // Calculate overall progress across all files (scaled to 90%)
          const overallProgress = Math.round(((i * 90) + percentCompleted) / files.length);
          set({ uploadProgress: Math.min(overallProgress, 90) });
        });
        set({ uploadProgress: 95 });
        successCount++;
      } catch (error) {
        console.error(`Failed to upload ${file.name}:`, error);
        const errMsg = error.response?.data?.detail || `Failed to upload ${file.name}`;
        toast.error(errMsg);
      }
    }
    
    set({ isUploading: false, uploadProgress: 0 });
    
    if (successCount === files.length) {
      toast.success(files.length > 1 ? "All documents uploaded successfully" : "Document uploaded successfully");
    } else if (successCount > 0) {
      toast.success(`Uploaded ${successCount} out of ${files.length} documents`);
    } else {
      toast.error("Failed to upload documents");
    }
    
    // Refresh documents list if any succeeded
    if (successCount > 0) {
      await get().fetchDocuments(conversationId);
      useSuggestionStore.getState().fetchSuggestions(conversationId);
    }
  },

  deleteDocument: async (documentId) => {
    try {
      await documentService.deleteDocument(documentId);
      set((state) => ({
        documents: state.documents.filter(doc => doc.id !== documentId)
      }));
      toast.success("Document deleted");
    } catch (error) {
      console.error("Failed to delete document:", error);
      toast.error("Failed to delete document.");
    }
  },

  clearDocuments: () => set({ documents: [] }),
}));
