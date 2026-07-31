import api from '../api/axios';
import { getToken } from '../utils/token';

const fetchStream = (url, body, onChunk, onMetadata, onError) => {
  const abortController = new AbortController();
  const token = getToken();
  const baseURL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
  
  fetch(`${baseURL}${url}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    },
    body: JSON.stringify(body),
    signal: abortController.signal
  }).then(async (response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let buffer = "";
    
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      buffer += decoder.decode(value, { stream: true });
      
      const parts = buffer.split('\n\n');
      buffer = parts.pop() || "";
      
      for (const part of parts) {
        const lines = part.split('\n');
        const dataLines = lines
          .filter(line => line.startsWith('data: '))
          .map(line => line.slice(6));
          
        if (dataLines.length === 0) continue;
        const content = dataLines.join('\n');
        
        if (content.trim() === "[ERROR]" || content.trim() === "[ERROR: Failed to generate response]") {
          throw new Error("Server failed to generate response.");
        }
        
        try {
          const json = JSON.parse(content);
          if (json && json.type === "metadata") {
            if (onMetadata) onMetadata(json);
            continue;
          }
        } catch (e) {
          // Not JSON, it is a text chunk
        }
        
        if (onChunk) onChunk(content);
      }
    }
  }).catch(err => {
    if (err.name === 'AbortError') {
      console.log('Stream aborted');
    } else {
      if (onError) onError(err);
    }
  });

  return abortController;
};

export const chatService = {
  sendMessage: async (conversationId, question) => {
    const response = await api.post('/api/chat', {
      conversation_id: conversationId,
      question: question
    });
    return response.data;
  },

  streamMessage: (conversationId, question, onChunk, onMetadata, onError) => {
    return fetchStream('/api/chat/stream', { conversation_id: conversationId, question }, onChunk, onMetadata, onError);
  },
  
  streamTitle: (conversationId, question, onChunk, onError) => {
    return fetchStream('/api/chat/generate-title', { conversation_id: conversationId, question }, onChunk, null, onError);
  }
};
