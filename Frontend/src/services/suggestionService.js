import api from '../api/axios';

export const suggestionService = {
  getSuggestions: async (conversationId) => {
    console.log("Fetching suggestions for conversation:", conversationId);
    try {
      // Add a cache-buster to prevent the browser from returning the initial empty [] response
      const timestamp = new Date().getTime();
      const response = await api.get(`/api/conversations/${conversationId}/suggestions?t=${timestamp}`);
      console.log("Suggestions response:", response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching suggested questions:', error);
      throw error;
    }
  }
};
