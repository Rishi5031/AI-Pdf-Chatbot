import React, { createContext, useState } from 'react';

export const ChatContext = createContext(null);

export const ChatProvider = ({ children }) => {
  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [activeFile, setActiveFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  return (
    <ChatContext.Provider
      value={{
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
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
