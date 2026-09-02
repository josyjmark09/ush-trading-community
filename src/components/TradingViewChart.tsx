import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';

interface TradingViewChartProps {
  defaultSymbol?: string;
  defaultInterval?: string;
  className?: string;
}

function buildTradingViewUrl(symbol: string = 'FX:EURUSD', interval: string = '60'): string {
  const params = new URLSearchParams({
    symbol: symbol,
    interval: interval,
    theme: 'light',
    style: '1',
    locale: 'en',
    enable_publishing: 'false',
    hide_side_toolbar: '0',
    allow_symbol_change: '1',
    save_image: '1',
    withdateranges: '1',
    hide_top_toolbar: '0',
  });
  return `https://s.tradingview.com/widgetembed/?${params.toString()}`;
}

export const TradingViewChart: React.FC<TradingViewChartProps> = ({
  defaultSymbol = 'FX:EURUSD',
  defaultInterval = '60',
  className = '',
}) => {
  const [isLoading, setIsLoading] = useState(true);

  const chartUrl = buildTradingViewUrl(defaultSymbol, defaultInterval);

  return (
    <div className={`w-full flex flex-col ${className}`}>
      {/* Clean Embedded Chart Container */}
      <div className="bg-white rounded-xl border border-slate-300 shadow-sm overflow-hidden flex flex-col">
        {/* Header Bar */}
        <div className="px-3.5 sm:px-4 py-2.5 sm:py-3 bg-white border-b border-slate-200 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
            <h3 className="font-manrope text-[14px] sm:text-[15px] font-bold text-slate-900 truncate">
              Live Technical Chart
            </h3>
            <span className="hidden sm:inline-block text-[12px] text-slate-300">•</span>
            <span className="hidden sm:inline-block text-[12px] text-slate-500 truncate font-inter">
              Full drawing tools, indicators & multi-timeframe analysis
            </span>
          </div>
        </div>

        {/* Live Interactive Chart Area */}
        <div className="w-full h-[460px] sm:h-[560px] md:h-[640px] bg-white relative">
          {isLoading && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white text-slate-500 gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-[#0053CF]" />
              <span className="text-[12px] sm:text-[13px] font-medium font-inter">Loading live market chart...</span>
            </div>
          )}

          <iframe
            src={chartUrl}
            title="TradingView Live Chart"
            className="w-full h-full border-0 block"
            allow="fullscreen; clipboard-read; clipboard-write"
            loading="eager"
            onLoad={() => setIsLoading(false)}
          />
        </div>
      </div>
    </div>
  );
};
