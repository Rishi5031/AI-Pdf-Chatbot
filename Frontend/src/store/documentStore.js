import { create } from 'zustand';
import { documentService } from '../services/documentService';
import { uploadService } from '../services/uploadService';
import toast from 'react-hot-toast';

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
      set({ documents: docs });
    } catch (error) {
      console.error("Failed to fetch documents:", error);
      set({ error: "Failed to load documents." });
      toast.error("Failed to load documents.");
    } finally {
      set({ isLoading: false });
    }
  },

  uploadDocuments: async (files, conversationId) => {
    if (!conversationId || !files || files.length === 0) return;
    
    set({ isUploading: true, uploadProgress: 0 });
    
    const loadingToast = toast.loading(
      files.length > 1 ? `Uploading ${files.length} documents...` : `Uploading ${files[0].name}...`
    );
    
    let successCount = 0;
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        await uploadService.uploadPDF(file, conversationId, (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          // Calculate overall progress across all files
          const overallProgress = Math.round(((i * 100) + percentCompleted) / files.length);
          set({ uploadProgress: overallProgress });
        });
        successCount++;
      } catch (error) {
        console.error(`Failed to upload ${file.name}:`, error);
        const errMsg = error.response?.data?.detail || `Failed to upload ${file.name}`;
        toast.error(errMsg);
      }
    }
    
    set({ isUploading: false, uploadProgress: 0 });
    
    if (successCount === files.length) {
      toast.success(files.length > 1 ? "All documents uploaded successfully" : "Document uploaded successfully", { id: loadingToast });
    } else if (successCount > 0) {
      toast.success(`Uploaded ${successCount} out of ${files.length} documents`, { id: loadingToast });
    } else {
      toast.error("Failed to upload documents", { id: loadingToast });
    }
    
    // Refresh documents list if any succeeded
    if (successCount > 0) {
      await get().fetchDocuments(conversationId);
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
