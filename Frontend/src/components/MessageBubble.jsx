import React from 'react';
import ReactMarkdown from 'react-markdown';
import { useDocumentStore } from '../store/documentStore';

export default function MessageBubble({ message, isStreaming = false }) {
  const { documents, setPreviewDocument } = useDocumentStore();
  const isUser = message.role === 'user';

  const handleSourceClick = (e, filename) => {
    e.preventDefault();
    e.stopPropagation();
    
    // 1. Try exact match
    let doc = documents.find(d => d.filename === filename);
    
    // 2. Try partial match or case-insensitive match
    if (!doc) {
      doc = documents.find(d => 
        d.filename.toLowerCase() === filename.toLowerCase() ||
        d.filename.includes(filename) || 
        filename.includes(d.filename)
      );
    }
    
    // 3. Ultimate fallback: if there are ANY documents, just open the first one
    if (!doc && documents.length > 0) {
      doc = documents[0];
    }
    
    if (doc) {
      setPreviewDocument(doc.id);
    } else {
      alert("No document found to preview! Documents length: " + documents.length);
    }
  };

  return (
    <div className="py-2 sm:py-3 flex justify-center w-full">
      <div className={`max-w-3xl w-full px-3 sm:px-4 flex ${isUser ? 'justify-end' : 'justify-start'}`}>
        
        {isUser ? (
          <div className="flex items-start gap-2.5 sm:gap-4 max-w-[90%] sm:max-w-[85%]">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center flex-shrink-0 font-semibold text-xs sm:text-sm shadow-sm bg-primary text-white">
              U
            </div>
            <div className="pt-1.5 sm:pt-2 text-primary text-sm sm:text-[15px] font-medium leading-relaxed min-w-0 break-words [overflow-wrap:anywhere]">
              <p className="whitespace-pre-wrap m-0">{message.content}</p>
            </div>
          </div>
        ) : (
          <div className="flex items-start gap-3 sm:gap-4 w-full bg-tertiary border border-neutral/20 rounded-2xl p-4 sm:p-6 shadow-sm min-w-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center flex-shrink-0 font-semibold text-xs sm:text-sm shadow-sm bg-secondary text-white mt-1">
              AI
            </div>
            <div className="flex-1 min-w-0 pt-1 prose prose-slate max-w-none text-primary text-sm sm:text-[15px] leading-relaxed prose-p:my-2 prose-ul:my-2 prose-li:my-0.5 break-words [overflow-wrap:anywhere]">
              <ReactMarkdown
                components={{
                  pre: ({ node, ...props }) => (
                    <div className="overflow-x-auto max-w-full my-2 rounded-lg bg-neutral/10 p-2 sm:p-3 text-xs sm:text-sm">
                      <pre {...props} className="m-0 overflow-x-auto whitespace-pre font-mono" />
                    </div>
                  ),
                  table: ({ node, ...props }) => (
                    <div className="overflow-x-auto max-w-full my-3">
                      <table {...props} className="min-w-full divide-y divide-neutral/20 text-xs sm:text-sm" />
                    </div>
                  ),
                  a: ({ node, ...props }) => {
                    if (props.href && props.href.startsWith('#source:')) {
                      const filename = decodeURIComponent(props.href.replace('#source:', ''));
                      return (
                        <span 
                          onClick={(e) => handleSourceClick(e, filename)}
                          className="inline-flex items-center align-middle text-secondary font-semibold text-xs sm:text-[13px] mx-1 cursor-pointer hover:underline break-all"
                        >
                          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>
                          <span className="truncate max-w-[200px] sm:max-w-none">{props.children}</span>
                        </span>
                      );
                    }
                    return <a {...props} className="text-secondary break-all" />;
                  }
                }}
              >
                {message.content + (isStreaming ? ' ▋' : '')}
              </ReactMarkdown>
              
              {message.sources && message.sources.length > 0 && (
                <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-neutral/10 flex flex-wrap items-center gap-1.5">
                  <span className="font-semibold text-primary text-xs sm:text-[14px]">Sources:</span>
                  {message.sources.map(filename => (
                    <span 
                      key={filename}
                      onClick={(e) => handleSourceClick(e, filename)}
                      className="inline-flex items-center align-middle text-secondary font-semibold text-xs sm:text-[13px] cursor-pointer hover:underline break-all"
                    >
                      <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                      <span className="truncate max-w-[180px] sm:max-w-none">{filename}</span>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
