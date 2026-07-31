import React from 'react';
import { useChatStore } from '../store/chatStore';

const options = [
  {
    id: 'short',
    title: 'Short Summary',
    description: 'A brief 150-250 word overview focusing on the main purpose and conclusions.',
    icon: '📄'
  },
  {
    id: 'detailed',
    title: 'Detailed Summary',
    description: 'Comprehensive analysis with headings, findings, policies, and recommendations.',
    icon: '📚'
  },
  {
    id: 'executive',
    title: 'Executive Summary',
    description: 'High-level business impact, risks, opportunities, and professional recommendations.',
    icon: '📊'
  },
  {
    id: 'bullet',
    title: 'Bullet Summary',
    description: 'Concise bullet points highlighting important facts, dates, and findings.',
    icon: '📋'
  }
];

function SummaryOption({ option, onClick }) {
  return (
    <button
      onClick={() => onClick(option.id)}
      className="w-full text-left p-4 rounded-xl border border-neutral/10 bg-surface hover:bg-neutral/5 hover:border-secondary/30 hover:shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-secondary/50 group flex items-start gap-4"
    >
      <div className="text-3xl flex-shrink-0 bg-tertiary p-2 rounded-lg group-hover:scale-105 transition-transform">
        {option.icon}
      </div>
      <div>
        <h3 className="font-semibold text-primary text-base mb-1">{option.title}</h3>
        <p className="text-sm text-neutral/80 leading-relaxed">{option.description}</p>
      </div>
    </button>
  );
}

export default function SummaryModal({ isOpen, onClose }) {
  const { generateSummary } = useChatStore();

  if (!isOpen) return null;

  const handleSelect = (summaryType) => {
    generateSummary(summaryType);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div 
        className="bg-surface rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden border border-neutral/10"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex justify-between items-center p-6 border-b border-neutral/10">
          <div>
            <h2 className="text-xl font-bold text-primary">Summarize Documents</h2>
            <p className="text-sm text-neutral mt-1">Select how you want your documents summarized</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-neutral/10 text-neutral transition-colors focus:outline-none focus:ring-2 focus:ring-secondary/50"
            aria-label="Close modal"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-6 grid gap-3">
          {options.map(option => (
            <SummaryOption key={option.id} option={option} onClick={handleSelect} />
          ))}
        </div>
      </div>
    </div>
  );
}
