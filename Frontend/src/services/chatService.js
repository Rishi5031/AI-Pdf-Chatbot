import api from '../api/axios';

export const chatService = {
  sendMessage: async (conversationId, question) => {
    const response = await api.post('/api/chat', {
      conversation_id: conversationId,
      question: question
    });
    return response.data;
  },
  
  generateTitle: async (conversationId, question) => {
    const response = await api.post('/api/chat/generate-title', {
      conversation_id: conversationId,
      question: question
    });
    return response.data;
  }
};
