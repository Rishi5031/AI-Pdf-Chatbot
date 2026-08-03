import { create } from 'zustand';
import { conversationService } from '../services/conversationService';
import { chatService } from '../services/chatService';
import { uploadService } from '../services/uploadService';
import { summaryService } from '../services/summaryService';
import { useSuggestionStore } from './suggestionStore';
import toast from 'react-hot-toast';

export const useChatStore = create((set, get) => ({
  conversations: [],
  activeConversationId: null,
  messages: [],
  isLoading: false,
  isUploading: false,
  isInitializing: true,
  streaming: false,
  currentStreamingMessage: '',
  abortController: null,
  streamQueue: '',
  streamInterval: null,
  summaryLoading: false,
  summaryType: null,

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
      let messages = await conversationService.getMessages(id);
      
      // Extract hidden sources from content string
      messages = messages.map(msg => {
        if (msg.role === 'assistant' && msg.content.includes('\n\n__SOURCES__')) {
          const parts = msg.content.split('\n\n__SOURCES__');
          let sources = [];
          try {
            sources = JSON.parse(parts[1]);
          } catch (e) {}
          return {
            ...msg,
            content: parts[0],
            sources: sources
          };
        }
        return msg;
      });

      set({ messages });
      
      // Also clear suggestions when changing conversations
      useSuggestionStore.getState().clearSuggestions();
      
    } catch (error) {
      console.error("Failed to load messages", error);
      toast.error("Failed to load conversation history.");
    } finally {
      set({ isLoading: false });
    }
  },

  sendMessage: async (question) => {
    const { activeConversationId, conversations } = get();
    if (!activeConversationId || !question.trim()) return;

    // Check if it's a new chat to stream title
    const activeConv = conversations.find(c => c.id == activeConversationId);
    const isNewChat = !activeConv.title || activeConv.title.toLowerCase() === 'new chat';

    if (isNewChat) {
      // Clear title so it appears blank instead of 'new chat' while streaming
      set(state => ({
        conversations: state.conversations.map(c => 
          c.id == activeConversationId ? { ...c, title: ' ' } : c
        )
      }));

      chatService.streamTitle(
        activeConversationId,
        question,
        (chunk) => {
          set(state => ({
            conversations: state.conversations.map(c => 
              c.id == activeConversationId ? { ...c, title: (c.title === ' ' ? '' : c.title) + chunk } : c
            )
          }));
        },
        (error) => console.error("Title stream error:", error)
      );
    }

    // Optimistic UI update
    const tempUserMsg = { id: Date.now(), role: 'user', content: question };
    set((state) => ({
      messages: [...state.messages, tempUserMsg],
      isLoading: true,
      streaming: true,
      currentStreamingMessage: '',
      streamQueue: ''
    }));

    // Start typewriter interval for smooth letter-by-letter effect
    const interval = setInterval(() => {
      set(state => {
        if (state.streamQueue.length > 0) {
          // Type 1 character at a time, only speed up if the queue gets massively behind
          const chunkSize = Math.max(1, Math.floor(state.streamQueue.length / 100));
          const chars = state.streamQueue.slice(0, chunkSize);
          return {
            currentStreamingMessage: state.currentStreamingMessage + chars,
            streamQueue: state.streamQueue.slice(chunkSize)
          };
        }
        return state; // No re-render if nothing changed
      });
    }, 100);

    set({ streamInterval: interval });

    const controller = chatService.streamMessage(
      activeConversationId,
      question,
      (chunk) => {
        set((state) => ({
          streamQueue: state.streamQueue + chunk,
          isLoading: false
        }));
      },
      (metadata) => {
        set((state) => {
          clearInterval(state.streamInterval);
          
          let updatedConversations = state.conversations;
          if (metadata.title) {
            updatedConversations = state.conversations.map(c => 
              c.id == activeConversationId ? { ...c, title: metadata.title } : c
            );
          }
          
          // Flush whatever is left in the queue
          let finalContent = state.currentStreamingMessage + state.streamQueue;
          
          let uniqueSources = [];
          if (metadata.sources && metadata.sources.length > 0) {
            uniqueSources = Array.from(new Set(metadata.sources.map(s => s.filename)));
          }

          const botMsg = { 
            id: Date.now() + 1, 
            role: 'assistant', 
            content: finalContent,
            sources: uniqueSources
          };
          
          return {
            messages: [...state.messages, botMsg],
            currentStreamingMessage: '',
            streamQueue: '',
            streaming: false,
            abortController: null,
            streamInterval: null,
            conversations: updatedConversations
          };
        });
      },
      (error) => {
        console.error("Streaming error:", error);
        toast.error("Stream interrupted or failed.");
        set((state) => {
          clearInterval(state.streamInterval);
          
          let finalContent = state.currentStreamingMessage + state.streamQueue;
          if (finalContent) {
            finalContent += "\n\n*(Stream interrupted)*";
            const botMsg = { id: Date.now() + 1, role: 'assistant', content: finalContent };
            return {
              messages: [...state.messages, botMsg],
              currentStreamingMessage: '',
              streamQueue: '',
              streaming: false,
              abortController: null,
              streamInterval: null
            };
          } else {
            const errorMsg = { id: Date.now() + 1, role: 'assistant', content: "Sorry, I encountered an error while processing your request." };
            return {
              messages: [...state.messages, errorMsg],
              currentStreamingMessage: '',
              streamQueue: '',
              streaming: false,
              isLoading: false,
              abortController: null,
              streamInterval: null
            };
          }
        });
      }
    );

    set({ abortController: controller });
  },

  generateSummary: async (summaryType) => {
    const { activeConversationId, conversations } = get();
    if (!activeConversationId) return;

    // Determine user message based on summary type
    const typeLabel = summaryType.charAt(0).toUpperCase() + summaryType.slice(1);
    const question = `Please provide a ${summaryType} summary of the documents.`;

    const tempUserMsg = { id: Date.now(), role: 'user', content: question };
    set((state) => ({
      messages: [...state.messages, tempUserMsg],
      isLoading: true,
      streaming: true,
      summaryLoading: true,
      summaryType: summaryType,
      currentStreamingMessage: '',
      streamQueue: ''
    }));

    const interval = setInterval(() => {
      set(state => {
        if (state.streamQueue.length > 0) {
          const chunkSize = Math.max(1, Math.floor(state.streamQueue.length / 100));
          const chars = state.streamQueue.slice(0, chunkSize);
          return {
            currentStreamingMessage: state.currentStreamingMessage + chars,
            streamQueue: state.streamQueue.slice(chunkSize)
          };
        }
        return state;
      });
    }, 100);

    set({ streamInterval: interval });

    const controller = summaryService.streamSummary(
      activeConversationId,
      summaryType,
      (chunk) => {
        set((state) => ({
          streamQueue: state.streamQueue + chunk,
          isLoading: false
        }));
      },
      (metadata) => {
        set((state) => {
          clearInterval(state.streamInterval);
          
          let finalContent = state.currentStreamingMessage + state.streamQueue;
          let uniqueSources = [];
          if (metadata.sources && metadata.sources.length > 0) {
            uniqueSources = Array.from(new Set(metadata.sources.map(s => s.filename)));
          }

          const botMsg = { 
            id: Date.now() + 1, 
            role: 'assistant', 
            content: finalContent,
            sources: uniqueSources
          };
          
          return {
            messages: [...state.messages, botMsg],
            currentStreamingMessage: '',
            streamQueue: '',
            streaming: false,
            summaryLoading: false,
            summaryType: null,
            abortController: null,
            streamInterval: null
          };
        });
      },
      (error) => {
        console.error("Streaming error:", error);
        toast.error(error.message || "Stream interrupted or failed.");
        set((state) => {
          clearInterval(state.streamInterval);
          
          let finalContent = state.currentStreamingMessage + state.streamQueue;
          if (finalContent) {
            finalContent += "\n\n*(Stream interrupted)*";
            const botMsg = { id: Date.now() + 1, role: 'assistant', content: finalContent };
            return {
              messages: [...state.messages, botMsg],
              currentStreamingMessage: '',
              streamQueue: '',
              streaming: false,
              summaryLoading: false,
              summaryType: null,
              abortController: null,
              streamInterval: null
            };
          } else {
            const errorMsg = { id: Date.now() + 1, role: 'assistant', content: "Sorry, I encountered an error while summarizing your documents." };
            return {
              messages: [...state.messages, errorMsg],
              currentStreamingMessage: '',
              streamQueue: '',
              streaming: false,
              isLoading: false,
              summaryLoading: false,
              summaryType: null,
              abortController: null,
              streamInterval: null
            };
          }
        });
      }
    );

    set({ abortController: controller });
  },

  cancelStreaming: () => {
    const { abortController, currentStreamingMessage, streamQueue, streamInterval } = get();
    if (abortController) {
      abortController.abort();
    }
    if (streamInterval) {
      clearInterval(streamInterval);
    }
    
    let finalContent = currentStreamingMessage + streamQueue;
    if (finalContent) {
      const botMsg = { id: Date.now() + 1, role: 'assistant', content: finalContent + '\n\n*(Stopped by user)*' };
      set((state) => ({
        messages: [...state.messages, botMsg]
      }));
    }
    
    set({ 
      streaming: false, 
      isLoading: false, 
      abortController: null, 
      currentStreamingMessage: '',
      streamQueue: '',
      streamInterval: null,
      summaryLoading: false,
      summaryType: null
    });
  },

  regenerate: () => {
    const { messages } = get();
    for (let i = messages.length - 1; i >= 0; i--) {
        if (messages[i].role === 'user') {
            get().sendMessage(messages[i].content);
            return;
        }
    }
  },

  uploadPDF: async (file) => {
    const { activeConversationId } = get();
    if (!activeConversationId) {
      toast.error("No active conversation to upload to.");
      return;
    }

    set({ isUploading: true });

    try {
      console.log("Starting PDF upload...");
      const response = await uploadService.uploadPDF(file, activeConversationId);
      console.log("PDF upload response:", response);
      
      // Update conversation title if returned
      if (response && response.conversation_title) {
        set((state) => ({
          conversations: state.conversations.map(conv => 
            conv.id === activeConversationId 
              ? { ...conv, title: response.conversation_title }
              : conv
          )
        }));
      }
      
      console.log("Triggering fetchSuggestions...");
      // Trigger fetch suggestions
      useSuggestionStore.getState().fetchSuggestions(activeConversationId);
      console.log("fetchSuggestions triggered");
      
      toast.success("PDF uploaded successfully");
    } catch (error) {
      console.error("Upload error", error);
      toast.error("Failed to upload PDF.");
    } finally {
      set({ isUploading: false });
    }
  },

  deleteConversation: async (id) => {
    try {
      await conversationService.deleteConversation(id);
      
      const { conversations, activeConversationId } = get();
      const updatedConvos = conversations.filter(c => c.id !== id);
      
      set({ conversations: updatedConvos });
      
      if (activeConversationId === id) {
        if (updatedConvos.length > 0) {
          await get().selectConversation(updatedConvos[0].id);
        } else {
          await get().createNewChat();
        }
      }
      
      toast.success("Chat deleted successfully");
    } catch (error) {
      console.error("Failed to delete chat", error);
      toast.error("Failed to delete chat");
    }
  },

  togglePin: async (id) => {
    try {
      const updatedConv = await conversationService.togglePin(id);
      set((state) => ({
        conversations: state.conversations.map(c => 
          c.id === id ? updatedConv : c
        )
      }));
    } catch (error) {
      console.error("Failed to pin chat", error);
      toast.error("Failed to pin chat");
    }
  },

  renameConversation: async (id, newTitle) => {
    try {
      const updatedConv = await conversationService.renameConversation(id, newTitle);
      set((state) => ({
        conversations: state.conversations.map(c => 
          c.id === id ? updatedConv : c
        )
      }));
      toast.success("Chat renamed successfully");
    } catch (error) {
      console.error("Failed to rename chat", error);
      toast.error("Failed to rename chat");
    }
  }
}));
