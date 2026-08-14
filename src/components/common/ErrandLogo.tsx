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
    sm: 'w-8 h-8',
    md: 'w-11 h-11',
    lg: 'w-16 h-16',
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
      {/* Exact Errand Runner & MoMo Escrow Coin SVG Mark */}
      <div className={`relative shrink-0 ${sizeClasses[size]}`}>
        <svg
          viewBox="0 0 76 76"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-md"
          data-testid="errand-logo-svg"
        >
          {/* Main Rounded Green Squircle Container */}
          <rect
            x="4"
            y="4"
            width="60"
            height="60"
            rx="22"
            fill="#008852"
            stroke="#023B23"
            strokeWidth="3"
          />

          {/* Speed Motion Lines (Pale Mint Green) */}
          <rect x="17" y="27" width="9.5" height="3" rx="1.5" fill="#7ADAA4" />
          <rect x="15" y="35" width="9" height="3" rx="1.5" fill="#7ADAA4" />
          <rect x="18" y="43" width="7.5" height="3" rx="1.5" fill="#7ADAA4" />

          {/* Stylized White Running Stick Figure */}
          {/* Head */}
          <circle cx="41" cy="23.5" r="4" fill="#FFFFFF" />

          {/* Upper Body / Motion Torso */}
          <path
            d="M34 29.5 C34 27 38.5 27.5 43 28.5"
            stroke="#FFFFFF"
            strokeWidth="3.2"
            strokeLinecap="round"
          />
          <path
            d="M42 28.5 L38 37.5"
            stroke="#FFFFFF"
            strokeWidth="3.4"
            strokeLinecap="round"
          />

          {/* Back Bent Running Leg */}
          <path
            d="M38 37.5 L28 44.5 L23 42.5"
            stroke="#FFFFFF"
            strokeWidth="3.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Front Stride Leg */}
          <path
            d="M38 37.5 L43 44.5 L51 46.5"
            stroke="#FFFFFF"
            strokeWidth="3.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Front Arm reaching to hold Grocery Bag */}
          <path
            d="M42 29 L49 32"
            stroke="#FFFFFF"
            strokeWidth="3.2"
            strokeLinecap="round"
          />

          {/* Grocery Shopping Bag */}
          {/* Bag Handle */}
          <path
            d="M48 34 C48 31 53 31 53 34"
            stroke="#C0392B"
            strokeWidth="1.2"
            fill="none"
            strokeLinecap="round"
          />

          {/* Bag Produce Items (Green Leaf & Red Chili) */}
          <circle cx="49.5" cy="33.5" r="1.5" fill="#2ECC71" />
          <path d="M52 34.5 L53 32" stroke="#E74C3C" strokeWidth="1.6" strokeLinecap="round" />

          {/* Bag Body */}
          <polygon
            points="47.5,34.5 54.5,34.5 53.5,44 48.5,44"
            fill="#E67E22"
            stroke="#D35400"
            strokeWidth="0.8"
          />

          {/* Overlapping Bottom-Right Gold MoMo Escrow Coin */}
          <circle
            cx="58"
            cy="58"
            r="11"
            fill="#06120D"
            stroke="#000000"
            strokeWidth="1.5"
          />
          <circle
            cx="58"
            cy="58"
            r="7.5"
            fill="#F39C12"
          />
        </svg>
      </div>

      {/* Typography & Wordmark */}
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 leading-none">
            {/* Primary Wordmark */}
            <span
              className={`tracking-[-0.03em] ${
                variant === 'dark' ? 'text-white' : 'text-slate-900'
              } ${textSizeClasses[size]}`}
              style={{ letterSpacing: '-0.03em' }}
            >
              ERRAND
            </span>

            {/* Secondary Accent Badge */}
            <span
              className={`font-mono font-black tracking-wider uppercase rounded-full bg-[#16221B] text-[#F39C12] border border-[#22352B] shadow-inner ${badgeSizeClasses[size]}`}
            >
              GHANA
            </span>
          </div>

          {/* Subtitle */}
          <span className="text-[9px] uppercase font-bold tracking-wider text-emerald-700 mt-0.5">
            2PC MoMo Escrow Marketplace
          </span>
        </div>
      )}
    </div>
  );
};
