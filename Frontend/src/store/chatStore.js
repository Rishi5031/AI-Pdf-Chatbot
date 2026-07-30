import { create } from 'zustand';
import { conversationService } from '../services/conversationService';
import { chatService } from '../services/chatService';
import { uploadService } from '../services/uploadService';
import toast from 'react-hot-toast';

export const useChatStore = create((set, get) => ({
  conversations: [],
  activeConversationId: null,
  messages: [],
  isLoading: false,
  isUploading: false,
  isInitializing: true,

  init: async () => {
    set({ isInitializing: true });
    try {
      const convos = await conversationService.getConversations();
      set({ conversations: convos });

      if (convos.length > 0) {
        // Select the most recent one
        await get().selectConversation(convos[0].id);
      } else {
        // Create new if none exists
        await get().createNewChat();
      }
    } catch (error) {
      console.error("Failed to fetch conversations", error);
      toast.error("Could not load conversations.");
    } finally {
      set({ isInitializing: false });
    }
  },

  createNewChat: async () => {
    try {
      const newChat = await conversationService.createConversation();
      set((state) => ({
        conversations: [newChat, ...state.conversations],
        activeConversationId: newChat.id,
        messages: [],
      }));
    } catch (error) {
      console.error("Failed to create chat", error);
      toast.error("Failed to start a new conversation.");
    }
  },

  selectConversation: async (id) => {
    set({ activeConversationId: id, isLoading: true });
    try {
      const messages = await conversationService.getMessages(id);
      set({ messages });
    } catch (error) {
      console.error("Failed to load messages", error);
      toast.error("Failed to load conversation history.");
    } finally {
      set({ isLoading: false });
    }
  },

  sendMessage: async (question) => {
    const { activeConversationId } = get();
    if (!activeConversationId || !question.trim()) return;

    // Optimistic UI update
    const tempUserMsg = { id: Date.now(), role: 'user', content: question };
    set((state) => ({
      messages: [...state.messages, tempUserMsg],
      isLoading: true
    }));

    try {
      const response = await chatService.sendMessage(activeConversationId, question);
      
      const botMsg = { id: Date.now() + 1, role: 'assistant', content: response.answer };
      
      set((state) => ({
        messages: [...state.messages, botMsg]
      }));
    } catch (error) {
      console.error("Chat error:", error);
      toast.error("Failed to send message.");
      const errorMsg = { id: Date.now() + 1, role: 'assistant', content: "Sorry, I encountered an error while processing your request." };
      set((state) => ({
        messages: [...state.messages, errorMsg]
      }));
    } finally {
      set({ isLoading: false });
    }
  },

  uploadPDF: async (file) => {
    const { activeConversationId } = get();
    if (!activeConversationId) {
      toast.error("No active conversation to upload to.");
      return;
    }

    set({ isUploading: true });
    const loadingToast = toast.loading("Uploading PDF...");

    try {
      await uploadService.uploadPDF(file, activeConversationId);
      toast.success("PDF uploaded successfully", { id: loadingToast });
    } catch (error) {
      console.error("Upload error", error);
      toast.error("Failed to upload PDF.", { id: loadingToast });
    } finally {
      set({ isUploading: false });
    }
  }
}));
