import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input: React.FC<InputProps> = ({ label, className = '', id, ...props }) => {
  // Generate a random ID if not provided, to link label and input
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full flex flex-col gap-2">
      {label && <label htmlFor={inputId} className="text-[11px] uppercase tracking-wider font-semibold text-[#787774] font-sans">{label}</label>}
      <input id={inputId} className={`px-3 py-2 bg-white border border-[#EAEAEA] rounded-[4px] focus:outline-none focus:ring-1 focus:ring-emerald-950 focus:border-emerald-950 font-sans text-emerald-950 transition-colors ${className}`} {...props} />
    </div>
  );
};
