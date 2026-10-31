import React from 'react';
import { Eye } from 'lucide-react';
import { useVisitorCounter } from '../../hooks/useVisitorCounter.ts';

interface VisitorCounterProps {
  variant?: 'footer' | 'navbar-desktop' | 'navbar-mobile-strip' | 'navbar-drawer';
  className?: string;
}

export const VisitorCounter: React.FC<VisitorCounterProps> = ({
  variant = 'footer',
  className = '',
}) => {
  const { formattedCount, loading } = useVisitorCounter();

  // 1. Dark Navy Footer layout (subtle pill, champagne gold eye, crisp white numbers)
  if (variant === 'footer') {
    return (
      <div
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#121f2f] hover:bg-[#16273b] border border-[#20364e] hover:border-[#b8863b]/60 rounded-full text-xs text-gray-300 shadow-2xs transition-colors select-none ${className}`}
        title="Official Website Visitor Count"
      >
        <Eye className="w-3.5 h-3.5 text-[#b8863b] shrink-0" />
        {loading ? (
          <span className="w-11 h-3 bg-gray-700/60 rounded animate-pulse inline-block" />
        ) : (
          <span className="font-semibold text-white tabular-nums tracking-tight text-[11.5px]">
            {formattedCount}
          </span>
        )}
        <span className="text-[10.5px] text-gray-400 font-medium">
          Visitors
        </span>
      </div>
    );
  }

  // 1. Mobile top sub-bar layout (ultra-compact, prevents any main navbar overflow)
  if (variant === 'navbar-mobile-strip') {
    return (
      <div
        className={`flex items-center gap-1.5 text-[#14283B] select-none ${className}`}
        title="Verified Website Visitor Count"
      >
        <Eye className="w-3 h-3 text-[#b8863b] shrink-0" />
        {loading ? (
          <span className="w-10 h-3 bg-[#ebdcc9]/70 rounded animate-pulse inline-block" />
        ) : (
          <span className="font-bold text-[11px] tabular-nums tracking-tight">
            {formattedCount}
          </span>
        )}
        <span className="text-[10px] font-medium text-[#64748b]">
          Visitors
        </span>
      </div>
    );
  }

  // 2. Mobile drawer layout (prominent elegant card inside expanded menu)
  if (variant === 'navbar-drawer') {
    return (
      <div
        className={`flex items-center justify-between p-2.5 bg-[#faf7f2] border border-[#ebdcc9] rounded-lg select-none ${className}`}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-md bg-white border border-[#ebdcc9] flex items-center justify-center text-[#b8863b] shadow-2xs">
            <Eye className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              {loading ? (
                <span className="w-14 h-3.5 bg-[#ebdcc9]/70 rounded animate-pulse inline-block" />
              ) : (
                <span className="text-xs font-bold text-[#14283B] tabular-nums">
                  {formattedCount}
                </span>
              )}
              <span className="text-[11px] font-medium text-[#64748b]">
                Visitors
              </span>
            </div>
            <span className="text-[9.5px] text-[#94a3b8] block">
              Official Website Visits
            </span>
          </div>
        </div>
        <span className="text-[9.5px] font-semibold text-[#b8863b] bg-white px-2 py-0.5 rounded border border-[#ebdcc9]">
          Live
        </span>
      </div>
    );
  }

  // 3. Desktop & Tablet default layout (compact badge beside Translate and Appointment)
  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-[#fbf9f4] hover:bg-white border border-[#ebdcc9] rounded-md shadow-2xs transition-colors select-none text-xs ${className}`}
      title="Official Website Visitor Count"
    >
      <Eye className="w-3.5 h-3.5 text-[#b8863b] shrink-0" />
      {loading ? (
        <span className="w-11 h-3.5 bg-[#ebdcc9]/70 rounded animate-pulse inline-block" />
      ) : (
        <span className="font-bold text-[#14283B] tabular-nums tracking-tight">
          {formattedCount}
        </span>
      )}
      <span className="text-[11px] font-medium text-[#64748b] hidden md:inline">
        Visitors
      </span>
    </div>
  );
};

