'use client';
import React, { useState } from 'react';
import { Eye, EyeSlash } from '@phosphor-icons/react/dist/ssr';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input: React.FC<InputProps> = ({ label, className = '', id, type, ...props }) => {
  const [showPassword, setShowPassword] = useState(false);
  // Generate a random ID if not provided, to link label and input
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="w-full flex flex-col gap-2 relative">
      {label && <label htmlFor={inputId} className="text-[10px] uppercase tracking-widest font-bold text-[#787774] font-sans ml-1">{label}</label>}
      <div className="relative">
        <input 
          id={inputId} 
          type={inputType}
          className={`w-full px-5 py-4 bg-emerald-950/5 border border-emerald-950/10 rounded-2xl focus:outline-none focus:ring-1 focus:ring-emerald-900 focus:border-emerald-900 font-sans text-emerald-950 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] placeholder:text-[#787774]/50 hover:bg-emerald-950/10 ${className} ${isPassword ? 'pr-12' : ''}`} 
          {...props} 
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#787774] hover:text-emerald-900 transition-colors focus:outline-none"
            aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
          >
            {showPassword ? <EyeSlash size={20} weight="duotone" /> : <Eye size={20} weight="duotone" />}
          </button>
        )}
      </div>
    </div>
  );
};
