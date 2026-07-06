import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input: React.FC<InputProps> = ({ label, className = '', id, ...props }) => {
  // Generate a random ID if not provided, to link label and input
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full flex flex-col gap-2">
      {label && <label htmlFor={inputId} className="text-[10px] uppercase tracking-widest font-bold text-[#787774] font-sans ml-1">{label}</label>}
      <input id={inputId} className={`w-full px-5 py-4 bg-emerald-950/5 border border-emerald-950/10 rounded-2xl focus:outline-none focus:ring-1 focus:ring-emerald-900 focus:border-emerald-900 font-sans text-emerald-950 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] placeholder:text-[#787774]/50 hover:bg-emerald-950/10 ${className}`} {...props} />
    </div>
  );
};
