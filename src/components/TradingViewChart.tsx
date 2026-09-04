import React, { useState } from 'react';
import { Loader2, ChevronUp, Maximize2 } from 'lucide-react';

interface TradingViewChartProps {
  defaultSymbol?: string;
  defaultInterval?: string;
  className?: string;
  onClose?: () => void;
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
  onClose,
}) => {
  const [isLoading, setIsLoading] = useState(true);

  const chartUrl = buildTradingViewUrl(defaultSymbol, defaultInterval);

  return (
    <div className={`w-full max-w-full flex flex-col ${className}`}>
      {/* Clean Embedded Chart Container */}
      <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-300 shadow-sm overflow-hidden flex flex-col">
        {/* Header Bar */}
        <div className="px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 animate-pulse" />
            <h3 className="font-manrope text-[13.5px] sm:text-[15px] font-bold text-slate-900 truncate">
              Live Technical Chart
            </h3>
            <span className="text-[11.5px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded-sm">
              EUR/USD
            </span>
            <span className="hidden sm:inline-block text-[12px] text-slate-300">•</span>
            <span className="hidden md:inline-block text-[12px] text-slate-500 truncate font-inter">
              Candlesticks, drawing tools & indicators
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-[11.5px] sm:text-[12px] font-bold text-slate-600 hover:text-[#0053CF] bg-white hover:bg-slate-100 border border-slate-200 rounded-md transition-colors cursor-pointer"
              >
                <ChevronUp className="w-3.5 h-3.5 shrink-0" />
                <span>Close Chart</span>
              </button>
            )}
          </div>
        </div>

        {/* Live Interactive Chart Area - Responsive heights */}
        <div className="w-full h-[380px] sm:h-[500px] md:h-[620px] bg-white relative">
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

        {/* Bottom Quick Collapse Bar for Mobile */}
        {onClose && (
          <div className="p-2 sm:p-2.5 bg-slate-50 border-t border-slate-200 text-center">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center justify-center gap-1.5 text-[12px] sm:text-[12.5px] font-bold text-slate-600 hover:text-[#0053CF] transition-colors cursor-pointer py-1 px-3 rounded-md"
            >
              <ChevronUp className="w-3.5 h-3.5" />
              <span>Tap here to collapse live chart</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
