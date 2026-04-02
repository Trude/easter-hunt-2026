import type { ReactNode } from 'react';

interface Props {
  onClick?: () => void;
  children: ReactNode;
  variant?: 'green' | 'yellow' | 'red' | 'gray';
  disabled?: boolean;
  fullWidth?: boolean;
  className?: string;
}

export default function PixelButton({ onClick, children, variant = 'green', disabled, fullWidth, className = '' }: Props) {
  const variants = {
    green: 'bg-mc-green text-white border-b-4 border-green-800 hover:bg-green-600 active:border-b-0 active:translate-y-1',
    yellow: 'bg-mc-yellow text-black border-b-4 border-yellow-700 hover:bg-yellow-400 active:border-b-0 active:translate-y-1',
    red: 'bg-red-600 text-white border-b-4 border-red-900 hover:bg-red-500 active:border-b-0 active:translate-y-1',
    gray: 'bg-gray-600 text-gray-700 border-b-4 border-gray-800 cursor-not-allowed',
  };

  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`font-pixel text-xs py-3 px-5 rounded transition-all ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {children}
    </button>
  );
}
