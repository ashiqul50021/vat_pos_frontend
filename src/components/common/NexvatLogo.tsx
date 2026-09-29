import React from 'react';

interface NexvatLogoProps {
  className?: string;
  showSubtitle?: boolean;
  isPos?: boolean;
}

export const NexvatLogo: React.FC<NexvatLogoProps> = ({ className = '', showSubtitle = false, isPos = true }) => {
  return (
    <div className={`flex items-center gap-2 select-none ${className}`}>
      {/* 3 Bars + Trend Arrow Icon */}
      <svg 
        className="w-5 h-5 text-[#1E3A8A] shrink-0" 
        viewBox="0 0 24 24" 
        fill="currentColor"
      >
        {/* 3 vertical bars */}
        <rect x="3" y="13" width="3.2" height="8" rx="0.6" />
        <rect x="8.4" y="9" width="3.2" height="12" rx="0.6" />
        <rect x="13.8" y="5" width="3.2" height="16" rx="0.6" />
        {/* Rising trend arrow line */}
        <path 
          d="M3 11 L9 5 L13 8 L20 2" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2.2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />
        {/* Arrow head */}
        <path 
          d="M15.5 2 H20.2 V6.7" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2.2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />
      </svg>

      <div className="flex items-center gap-1.5">
        <span className="text-base sm:text-lg font-black tracking-tight text-[#1E3A8A] leading-none font-sans">
          NEXVAT
        </span>
        {isPos && (
          <span className="text-base sm:text-lg font-black tracking-tight text-blue-600 leading-none font-sans">
            POS
          </span>
        )}
        {showSubtitle && (
          <span className="text-[10px] font-semibold text-blue-600 tracking-wider uppercase ml-1">
            Gateway
          </span>
        )}
      </div>
    </div>
  );
};
