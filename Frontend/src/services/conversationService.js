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
  },

  togglePin: async (conversationId) => {
    const response = await api.patch(`/api/conversations/${conversationId}/pin`);
    return response.data;
  },

  renameConversation: async (conversationId, newTitle) => {
    const response = await api.patch(`/api/conversations/${conversationId}/rename`, { title: newTitle });
    return response.data;
  }
};
