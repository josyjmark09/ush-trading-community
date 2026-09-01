import React from 'react';
import { useLiveForexQuotes } from '../hooks/useLiveForexQuotes';

export const LiveQuotesTicker: React.FC = React.memo(() => {
  const liveQuotes = useLiveForexQuotes();

  return (
    <div className="bg-white border border-slate-300 rounded-lg py-2 px-2 shadow-2xs max-w-[1200px] mx-auto w-full overflow-hidden animate-soft-entry mb-3 sm:mb-6 md:mb-8">
      <div className="relative w-full overflow-hidden ticker-fade-mask">
        <div className="animate-ticker-continuous flex items-center gap-6 sm:gap-8 text-[12.5px] font-inter">
          {[...liveQuotes, ...liveQuotes].map((q, idx) => (
            <div
              key={`${q.pair}-${idx}`}
              className="flex items-center gap-2 shrink-0 px-2 py-0.5 rounded select-none"
            >
              <span className="font-bold text-slate-900 tracking-tight">{q.pair}</span>
              <span className="text-slate-700 font-mono text-[12px] font-medium">
                {q.bid.toLocaleString(undefined, {
                  minimumFractionDigits: q.pair.includes('JPY') || q.pair.includes('XAU') || q.pair.includes('BTC') || q.pair.includes('US') || q.pair.includes('NAS') ? 2 : 4,
                  maximumFractionDigits: q.pair.includes('JPY') || q.pair.includes('XAU') || q.pair.includes('BTC') || q.pair.includes('US') || q.pair.includes('NAS') ? 2 : 4,
                })}
              </span>
              <span
                className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                  q.direction === 'up'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                    : 'bg-rose-50 text-rose-700 border border-rose-300'
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
