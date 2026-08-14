import React from 'react';

interface ErrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  variant?: 'light' | 'dark';
}

export const ErrandLogo: React.FC<ErrandLogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
  variant = 'light',
}) => {
  const sizeClasses = {
    sm: 'w-7 h-7',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
  };

  const textSizeClasses = {
    sm: 'text-sm font-black',
    md: 'text-xl font-black',
    lg: 'text-3xl font-black',
  };

  const badgeSizeClasses = {
    sm: 'text-[9px] px-1.5 py-0.2',
    md: 'text-[10px] px-2 py-0.5',
    lg: 'text-xs px-2.5 py-0.5',
  };

  return (
    <div className={`flex items-center gap-2.5 ${className}`} data-testid="errand-logo-container">
      {/* "The Velocity Escrow Loop" Monogram Icon */}
      <div
        className={`relative flex items-center justify-center rounded-2xl bg-[#0D1512] shadow-md border border-[#22352B] p-1.5 shrink-0 overflow-hidden ${sizeClasses[size]}`}
      >
        {/* Subtle Ambient Radial Glow */}
        <div className="absolute inset-0 bg-gradient-to-tr from-[#0D1512] via-transparent to-[#D4F938]/15 pointer-events-none" />

        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full relative z-10 drop-shadow-sm"
          data-testid="errand-logo-svg"
        >
          <defs>
            {/* Electric Apex Lime Gradient */}
            <linearGradient id="apexVelocityGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#D4F938" />
              <stop offset="60%" stopColor="#A3E635" />
              <stop offset="100%" stopColor="#10B981" />
            </linearGradient>

            {/* Escrow Core Loop Gradient */}
            <linearGradient id="escrowVaultGrad" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#D4F938" />
              <stop offset="100%" stopColor="#047857" />
            </linearGradient>

            {/* Ambient Shadow Filter */}
            <filter id="apexGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background Ambient Escrow Ring */}
          <circle
            cx="24"
            cy="24"
            r="19"
            stroke="#1B2B23"
            strokeWidth="1.5"
            strokeDasharray="3 3"
          />

          {/* Velocity Escrow Knot / Monogram "E" Runner Loop */}
          {/* Top Wing of "E" & Fast Runner Curve */}
          <path
            d="M12 14C12 11.7909 13.7909 10 16 10H33C35.2091 10 37 11.7909 37 14C37 16.2091 35.2091 18 33 18H21C18.7909 18 17 19.7909 17 22V24"
            stroke="url(#apexVelocityGrad)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Central Escrow Lock Loop & Middle "E" Bar */}
          <path
            d="M14 24H30C32.2091 24 34 25.7909 34 28C34 30.2091 32.2091 32 30 32H16C13.7909 32 12 30.2091 12 28V16"
            stroke="url(#escrowVaultGrad)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Bottom Speed Runner Track & Lock Base */}
          <path
            d="M18 38H33C35.2091 38 37 36.2091 37 34C37 31.7909 35.2091 30 33 30"
            stroke="url(#apexVelocityGrad)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Core Escrow Node (2PC Commit Core) */}
          <circle
            cx="24"
            cy="24"
            r="3"
            fill="#D4F938"
            filter="url(#apexGlow)"
          />
        </svg>
      </div>

      {/* Typography & Wordmark */}
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 leading-none">
            {/* Primary Wordmark: Heavy Grotesque Geometric Font */}
            <span
              className={`tracking-[-0.03em] ${
                variant === 'dark' ? 'text-white' : 'text-slate-900'
              } ${textSizeClasses[size]}`}
              style={{ letterSpacing: '-0.03em' }}
            >
              ERRAND
            </span>

            {/* Secondary Badge: Uppercase Monospaced Pill in Apex Lime */}
            <span
              className={`font-mono font-black tracking-wider uppercase rounded-full bg-[#16221B] text-[#D4F938] border border-[#22352B] shadow-inner ${badgeSizeClasses[size]}`}
            >
              GHANA
            </span>
          </div>

          {/* Subline */}
          <span className="text-[9px] uppercase font-bold tracking-wider text-emerald-700 mt-0.5">
            2PC MoMo Escrow Marketplace
          </span>
        </div>
      )}
    </div>
  );
};
