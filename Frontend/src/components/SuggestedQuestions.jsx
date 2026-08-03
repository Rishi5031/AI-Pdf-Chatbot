import React, { useEffect } from 'react';
import { useSuggestionStore } from '../store/suggestionStore';
import { useChatStore } from '../store/chatStore';
import { useDocumentStore } from '../store/documentStore';

export default function SuggestedQuestions() {
  const { suggestions, loading, error, fetchSuggestions } = useSuggestionStore();
  const { sendMessage, activeConversationId } = useChatStore();
  const { isUploading } = useDocumentStore();

  console.log("SuggestedQuestions render:", { suggestions, loading, isUploading, activeConversationId, error });

  useEffect(() => {
    if (activeConversationId) {
      fetchSuggestions(activeConversationId);
    }
  }, [activeConversationId, fetchSuggestions]);

  // If loading or uploading, show skeletons
  if (loading || isUploading) {
    return (
      <div className="w-full mt-8">
        <h3 className="text-sm font-semibold text-neutral mb-3 px-1">Suggested Questions</h3>
        <div className="flex flex-col gap-3 w-full">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse flex flex-col p-4 bg-surface border border-neutral/10 rounded-xl h-[72px]">
              <div className="h-4 bg-neutral/20 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-neutral/20 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // If no suggestions, return null
  if (!suggestions || suggestions.length === 0) {
    return null;
  }

  return (
    <div className="w-full mt-6 sm:mt-8">
      <h3 className="text-xs sm:text-sm font-semibold text-neutral mb-2 sm:mb-3 px-1">Suggested Questions</h3>
      <div className="flex flex-col gap-2.5 sm:gap-3 w-full">
        {suggestions.map((suggestion) => (
          <button 
            key={suggestion.id}
            onClick={() => sendMessage(suggestion.question)}
            className="flex flex-col items-start p-3 sm:p-4 bg-surface border border-neutral/20 rounded-xl hover:border-secondary hover:shadow-md hover:shadow-secondary/10 transition-all text-left group cursor-pointer focus:outline-none focus:ring-2 focus:ring-secondary/50"
          >
            <span className="text-xs sm:text-sm font-medium text-primary group-hover:text-secondary transition-colors line-clamp-2">
              {suggestion.question}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
