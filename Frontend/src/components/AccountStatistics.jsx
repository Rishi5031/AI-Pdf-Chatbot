import React from 'react';

export default function AccountStatistics({ statistics, createdAt }) {
  const formattedSince = createdAt
    ? new Date(createdAt).toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
      })
    : 'Aug 2026';

  const statsList = [
    {
      id: 'chats',
      label: 'CHATS',
      value: statistics?.conversations ?? 1,
      icon: (
        <svg className="w-4 h-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
    },
    {
      id: 'docs',
      label: 'DOCS',
      value: statistics?.documents ?? 0,
      icon: (
        <svg className="w-4 h-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      id: 'messages',
      label: 'MESSAGES',
      value: statistics?.messages ?? 0,
      icon: (
        <svg className="w-4 h-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
    {
      id: 'since',
      label: 'SINCE',
      value: formattedSince,
      icon: (
        <svg className="w-4 h-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-6 shadow-xs mb-4 sm:mb-6">
      <div className="flex items-center gap-2 mb-4 sm:mb-5">
        <svg className="w-5 h-5 text-indigo-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        <h2 className="text-base sm:text-lg font-bold text-slate-800">Activity Statistics</h2>
      </div>

      <div className="grid grid-cols-2 gap-2.5 sm:gap-3.5">
        {statsList.map((stat) => (
          <div
            key={stat.id}
            className="p-3 sm:p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/80 flex flex-col items-start justify-between min-h-[84px] sm:min-h-[90px] min-w-0"
          >
            <div className="mb-1.5 sm:mb-2 flex-shrink-0">{stat.icon}</div>
            <div className="w-full min-w-0">
              <p className="text-base sm:text-xl font-bold text-slate-900 leading-tight truncate">
                {stat.value}
              </p>
              <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase mt-0.5 truncate">
                {stat.label}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
