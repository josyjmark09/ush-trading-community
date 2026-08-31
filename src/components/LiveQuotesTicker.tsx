import React from 'react';
import { useLiveForexQuotes } from '../hooks/useLiveForexQuotes';

export const LiveQuotesTicker: React.FC = React.memo(() => {
  const liveQuotes = useLiveForexQuotes();

  return (
    <div className="bg-white/95 backdrop-blur-md border border-[#E2E8F0] rounded-xl py-2 px-2 shadow-xs max-w-[1200px] mx-auto w-full overflow-hidden animate-soft-entry mb-3 sm:mb-6 md:mb-8">
      <div className="relative w-full overflow-hidden ticker-fade-mask">
        <div className="animate-ticker-continuous flex items-center gap-8 sm:gap-10 text-[13px] font-inter">
          {[...liveQuotes, ...liveQuotes].map((q, idx) => (
            <div
              key={`${q.pair}-${idx}`}
              className="flex items-center gap-2.5 shrink-0 hover:bg-[#F1F4F9]/80 px-2.5 py-1 rounded-lg transition-colors cursor-default select-none"
            >
              <span className="font-bold text-[#091C35] tracking-tight">{q.pair}</span>
              <span className="text-[#33373D] font-mono text-[12px] font-medium">
                {q.bid.toLocaleString(undefined, {
                  minimumFractionDigits: q.pair.includes('JPY') || q.pair.includes('XAU') || q.pair.includes('BTC') || q.pair.includes('US') || q.pair.includes('NAS') ? 2 : 4,
                  maximumFractionDigits: q.pair.includes('JPY') || q.pair.includes('XAU') || q.pair.includes('BTC') || q.pair.includes('US') || q.pair.includes('NAS') ? 2 : 4,
                })}
              </span>
              <span
                className={`text-[10px] font-bold px-1.5 py-0.5 rounded transition-all duration-300 ${
                  q.direction === 'up'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                    : 'bg-rose-50 text-rose-700 border border-rose-200/60'
                }`}
              >
                {q.change >= 0 ? `+${q.change.toFixed(2)}%` : `${q.change.toFixed(2)}%`}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

LiveQuotesTicker.displayName = 'LiveQuotesTicker';
