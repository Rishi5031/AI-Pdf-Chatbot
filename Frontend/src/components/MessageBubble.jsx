import React from 'react';
import ReactMarkdown from 'react-markdown';

export default function MessageBubble({ message }) {
  const isUser = message.role === 'user';

  return (
    <div className="py-3 flex justify-center w-full">
      <div className={`max-w-3xl w-full px-4 flex ${isUser ? 'justify-end' : 'justify-start'}`}>
        
        {isUser ? (
          <div className="flex items-start gap-4 max-w-[85%]">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 font-semibold text-sm shadow-sm bg-primary text-white">
              U
            </div>
            <div className="pt-2 text-primary text-[15px] font-medium leading-relaxed">
              <p className="whitespace-pre-wrap m-0">{message.content}</p>
            </div>
          </div>
        ) : (
          <div className="flex items-start gap-4 w-full bg-tertiary border border-neutral/20 rounded-2xl p-6 shadow-sm">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 font-semibold text-sm shadow-sm bg-secondary text-white">
              AI
            </div>
            <div className="flex-1 overflow-x-auto pt-1.5 prose prose-slate max-w-none text-primary text-[15px] leading-relaxed prose-p:my-2 prose-ul:my-2 prose-li:my-0.5">
              <ReactMarkdown>{message.content}</ReactMarkdown>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
