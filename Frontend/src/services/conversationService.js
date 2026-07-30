import api from '../api/axios';

export const conversationService = {
  getConversations: async () => {
    const response = await api.get('/api/conversations');
    return response.data;
  },

  createConversation: async () => {
    const response = await api.post('/api/conversations');
    return response.data;
  },

  getMessages: async (conversationId) => {
    const response = await api.get(`/api/conversations/${conversationId}/messages`);
    return response.data;
  },

  deleteConversation: async (conversationId) => {
    const response = await api.delete(`/api/conversations/${conversationId}`);
    return response.data;
  }
};
