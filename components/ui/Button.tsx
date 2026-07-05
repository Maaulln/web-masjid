import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
}

export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseStyle = 'px-4 py-2 rounded-md font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  const variants = {
    primary: 'bg-emerald-700 hover:bg-emerald-800 text-white focus:ring-emerald-500',
    secondary: 'bg-amber-600 hover:bg-amber-700 text-white focus:ring-amber-500',
    outline: 'border border-emerald-700 text-emerald-700 hover:bg-emerald-50 focus:ring-emerald-500'
  };
  return (
    <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};
