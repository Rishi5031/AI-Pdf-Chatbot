import api from '../api/axios';

export const documentService = {
  getDocumentsByConversation: async (conversationId) => {
    const response = await api.get(`/api/conversations/${conversationId}/documents`);
    return response.data;
  },

  getDocument: async (documentId) => {
    const response = await api.get(`/api/documents/${documentId}`);
    return response.data;
  },

  deleteDocument: async (documentId) => {
    const response = await api.delete(`/api/documents/${documentId}`);
    return response.data;
  }
};
