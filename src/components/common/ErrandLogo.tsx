import React from 'react';

interface ErrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export const ErrandLogo: React.FC<ErrandLogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
}) => {
  const sizeClasses = {
    sm: 'w-7 h-7',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
  };

  const textSizeClasses = {
    sm: 'text-base font-bold',
    md: 'text-xl font-extrabold',
    lg: 'text-3xl font-extrabold',
  };

  return (
    <div className={`flex items-center gap-2.5 ${className}`} data-testid="errand-logo-container">
      {/* Dynamic Ghana Shield Brandmark */}
      <div className={`relative flex items-center justify-center rounded-xl bg-gradient-to-br from-emerald-600 via-emerald-800 to-slate-900 shadow-lg shadow-emerald-950/40 p-1 border border-emerald-500/30 ${sizeClasses[size]}`}>
        <svg
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow"
          data-testid="errand-logo-svg"
        >
          {/* Outer Shield Hexagon */}
          <path
            d="M20 3L35 10V22C35 30 20 37 20 37C20 37 5 30 5 22V10L20 3Z"
            fill="#006B3F"
            stroke="#FCD116"
            strokeWidth="1.5"
          />
          {/* Inner Golden Escrow Vault Star & Market Basket */}
          <path
            d="M20 12L22.5 17.5L28.5 18L24 22L25.5 28L20 25L14.5 28L16 22L11.5 18L17.5 17.5L20 12Z"
            fill="#FCD116"
          />
          <circle cx="20" cy="20" r="3" fill="#CE1126" />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col">
          <div className={`tracking-tight flex items-center gap-1 text-slate-100 ${textSizeClasses[size]}`}>
            <span>ERRAND</span>
            <span className="text-amber-400 font-black">GHANA</span>
          </div>
          <span className="text-[10px] uppercase font-semibold tracking-wider text-emerald-400 -mt-1">
            2PC MoMo Escrow Marketplace
          </span>
        </div>
      )}
    </div>
  );
};
