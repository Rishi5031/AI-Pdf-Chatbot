import { create } from 'zustand';
import { suggestionService } from '../services/suggestionService';

export const useSuggestionStore = create((set) => ({
  suggestions: [],
  loading: false,
  error: null,

  fetchSuggestions: async (conversationId) => {
    if (!conversationId) return;
    set({ loading: true, error: null });
    try {
      const data = await suggestionService.getSuggestions(conversationId);
      set({ suggestions: data, loading: false });
    } catch (err) {
      set({ 
        loading: false, 
        error: err?.response?.data?.detail || 'Failed to fetch suggestions' 
      });
    }
  },

  clearSuggestions: () => {
    set({ suggestions: [], loading: false, error: null });
  }
}));
