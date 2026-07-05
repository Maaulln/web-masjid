import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
}

export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseStyle = 'px-4 py-2 rounded-[4px] font-sans font-semibold transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-offset-2 focus:ring-emerald-950 active:scale-[0.98]';
  const variants = {
    primary: 'bg-emerald-950 hover:bg-[#333333] text-white',
    secondary: 'bg-[#FBFBFA] hover:bg-[#EAEAEA] text-emerald-950',
    outline: 'border border-[#EAEAEA] text-emerald-950 hover:bg-[#FBFBFA]'
  };
  return (
    <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};
