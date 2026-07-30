import React from 'react';
import ReactMarkdown from 'react-markdown';

export default function MessageBubble({ message }) {
  const isUser = message.role === 'user';

  return (
    <div className={`py-6 flex justify-center ${isUser ? '' : 'bg-slate-50 border-y border-slate-100'}`}>
      <div className="max-w-3xl w-full px-4 flex gap-6">
        {/* Avatar */}
        <div className={`w-8 h-8 rounded-sm flex items-center justify-center flex-shrink-0 font-semibold text-sm shadow-sm ${
          isUser ? 'bg-primary text-white' : 'bg-[#10a37f] text-white'
        }`}>
          {isUser ? 'U' : 'AI'}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-x-auto pt-1 prose prose-slate max-w-none text-slate-800">
          {isUser ? (
            <p className="whitespace-pre-wrap m-0">{message.content}</p>
          ) : (
            <ReactMarkdown>{message.content}</ReactMarkdown>
          )}
        </div>
      </div>
    </div>
  );
}
