import { useContext, useEffect } from 'react';
import { ChatContext } from '../context/ChatContext';
import api from '../services/api';
import toast from 'react-hot-toast';

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }

  const {
    sessionId,
    setSessionId,
    messages,
    setMessages,
    activeFile,
    setActiveFile,
    isLoading,
    setIsLoading,
    isInitializing,
    setIsInitializing
  } = context;

  const createNewSession = async () => {
    setIsInitializing(true);
    try {
      const response = await api.post('/api/session/new');
      setSessionId(response.data.session_id);
    } catch (error) {
      console.error('Failed to create new session:', error);
      toast.error('Could not initialize chat session.');
    } finally {
      setIsInitializing(false);
    }
  };

  // Initialize session on mount if none exists
  useEffect(() => {
    if (!sessionId) {
      createNewSession();
    }
  }, []);

  const startNewChat = async () => {
    setMessages([]);
    setActiveFile(null);
    await createNewSession();
  };

  const askQuestion = async (qText) => {
    if (!qText.trim() || !sessionId) return;
    
    const userMsg = { id: Date.now(), role: 'user', content: qText };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const response = await api.post("/api/chat", { 
        question: qText,
        session_id: sessionId 
      });
      const results = response.data;

      let botResponse = "";
      if (results && results.answer) {
        botResponse = results.answer;
      } else {
        botResponse = "I couldn't find an answer to that in the document.";
      }

      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'bot', content: botResponse }]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'bot', content: "Sorry, I encountered an error while processing your request." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadSuccess = (filename) => {
    setActiveFile(filename);
    setMessages([
      {
        id: Date.now(),
        role: 'bot',
        content: `Hello! I've analyzed ${filename}. How can I help you today?`,
        suggestions: ["Summarize main findings", "Explain methodology"]
      }
    ]);
  };

  return {
    sessionId,
    messages,
    activeFile,
    isLoading,
    isInitializing,
    startNewChat,
    askQuestion,
    handleUploadSuccess
  };
};
