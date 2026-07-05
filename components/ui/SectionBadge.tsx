import React from 'react';

export const SectionBadge = ({ children }: { children: React.ReactNode }) => {
  return (
    <span className="rounded-full px-4 py-1.5 text-[10px] uppercase tracking-[0.2em] font-bold text-emerald-900 border border-emerald-900/10 bg-emerald-50/50 backdrop-blur-md shadow-sm w-max inline-block">
      {children}
    </span>
  );
};
