import React, { useState, useMemo } from 'react';
import { 
  Calendar, 
  Newspaper, 
  Clock, 
  ExternalLink, 
  Search, 
  ChevronRight
} from 'lucide-react';

export type NewsImpact = 'high' | 'medium' | 'low';

export interface EconomicEvent {
  id: string;
  time: string;
  date: string;
  dayGroup: 'Today' | 'Tomorrow' | 'This Week';
  currency: 'USD' | 'EUR' | 'GBP' | 'JPY' | 'AUD' | 'CAD' | 'CHF' | 'NZD';
  flag: string;
  event: string;
  impact: NewsImpact;
  actual?: string;
  forecast?: string;
  previous?: string;
  status: 'released' | 'upcoming';
  outcome?: 'beat' | 'miss' | 'neutral';
}

export interface ForexNewsItem {
  id: string;
  title: string;
  summary: string;
  category: 'Central Banks' | 'Forex' | 'Macro' | 'Commodities';
  timeAgo: string;
  source: string;
  impact: NewsImpact;
  url: string;
}

// Authentic Forex Factory Folder Icon Component
export const ForexFactoryFolder: React.FC<{ impact: NewsImpact; className?: string }> = ({ 
  impact, 
  className = 'w-4 h-4' 
}) => {
  const fillColor = impact === 'high' ? '#D32F2F' : impact === 'medium' ? '#F57C00' : '#FBC02D';
  return (
    <svg 
      viewBox="0 0 20 18" 
      fill="none" 
      className={`shrink-0 ${className}`} 
      xmlns="http://www.w3.org/2000/svg"
      aria-label={`${impact} impact event`}
    >
      <path
        d="M2 3.5C2 2.67157 2.67157 2 3.5 2H7.58579C7.98362 2 8.36516 2.15804 8.64645 2.43934L9.93934 3.73223C10.2206 4.01353 10.6022 4.17157 11 4.17157H16.5C17.3284 4.17157 18 4.84315 18 5.67157V14.5C18 15.3284 17.3284 16 16.5 16H3.5C2.67157 16 2 15.3284 2 14.5V3.5Z"
        fill={fillColor}
        stroke="rgba(0,0,0,0.2)"
        strokeWidth="0.75"
      />
      <path
        d="M2 6.5H18V14.5C18 15.3284 17.3284 16 16.5 16H3.5C2.67157 16 2 15.3284 2 14.5V6.5Z"
        fill={fillColor}
      />
    </svg>
  );
};

const SAMPLE_ECONOMIC_EVENTS: EconomicEvent[] = [
  {
    id: 'ff-1',
    date: 'Tue Sep 2',
    dayGroup: 'Today',
    time: '13:30',
    currency: 'USD',
    flag: 'us',
    event: 'Core CPI m/m',
    impact: 'high',
    actual: '0.3%',
    forecast: '0.3%',
    previous: '0.2%',
    status: 'released',
    outcome: 'neutral',
  },
  {
    id: 'ff-2',
    date: 'Tue Sep 2',
    dayGroup: 'Today',
    time: '13:30',
    currency: 'USD',
    flag: 'us',
    event: 'CPI y/y',
    impact: 'high',
    actual: '2.9%',
    forecast: '3.1%',
    previous: '3.2%',
    status: 'released',
    outcome: 'beat',
  },
  {
    id: 'ff-3',
    date: 'Tue Sep 2',
    dayGroup: 'Today',
    time: '15:00',
    currency: 'USD',
    flag: 'us',
    event: 'ISM Services PMI',
    impact: 'high',
    actual: '54.2',
    forecast: '52.0',
    previous: '51.4',
    status: 'released',
    outcome: 'beat',
  },
  {
    id: 'ff-4',
    date: 'Wed Sep 3',
    dayGroup: 'Tomorrow',
    time: '07:00',
    currency: 'GBP',
    flag: 'gb',
    event: 'GDP m/m',
    impact: 'high',
    forecast: '0.2%',
    previous: '0.0%',
    status: 'upcoming',
  },
  {
    id: 'ff-5',
    date: 'Wed Sep 3',
    dayGroup: 'Tomorrow',
    time: '12:45',
    currency: 'EUR',
    flag: 'eu',
    event: 'Main Refinancing Rate',
    impact: 'high',
    forecast: '3.25%',
    previous: '3.50%',
    status: 'upcoming',
  },
  {
    id: 'ff-6',
    date: 'Wed Sep 3',
    dayGroup: 'Tomorrow',
    time: '13:30',
    currency: 'USD',
    flag: 'us',
    event: 'Unemployment Claims',
    impact: 'medium',
    forecast: '218K',
    previous: '221K',
    status: 'upcoming',
  },
  {
    id: 'ff-7',
    date: 'Fri Sep 5',
    dayGroup: 'This Week',
    time: '13:30',
    currency: 'USD',
    flag: 'us',
    event: 'Non-Farm Employment Change',
    impact: 'high',
    forecast: '165K',
    previous: '142K',
    status: 'upcoming',
  },
  {
    id: 'ff-8',
    date: 'Fri Sep 5',
    dayGroup: 'This Week',
    time: '13:30',
    currency: 'USD',
    flag: 'us',
    event: 'Unemployment Rate',
    impact: 'high',
    forecast: '4.1%',
    previous: '4.2%',
    status: 'upcoming',
  },
  {
    id: 'ff-9',
    date: 'Fri Sep 5',
    dayGroup: 'This Week',
    time: '13:30',
    currency: 'CAD',
    flag: 'ca',
    event: 'Employment Change',
    impact: 'high',
    forecast: '27.5K',
    previous: '46.7K',
    status: 'upcoming',
  },
  {
    id: 'ff-10',
    date: 'Mon Sep 8',
    dayGroup: 'This Week',
    time: '03:00',
    currency: 'JPY',
    flag: 'jp',
    event: 'BOJ Monetary Policy Statement',
    impact: 'high',
    forecast: '0.25%',
    previous: '0.25%',
    status: 'upcoming',
  },
  {
    id: 'ff-11',
    date: 'Tue Sep 9',
    dayGroup: 'This Week',
    time: '04:30',
    currency: 'AUD',
    flag: 'au',
    event: 'RBA Cash Rate Statement',
    impact: 'high',
    forecast: '4.35%',
    previous: '4.35%',
    status: 'upcoming',
  },
];

const SAMPLE_FOREX_NEWS: ForexNewsItem[] = [
  {
    id: 'news-1',
    title: 'Dollar index eases as cooler inflation prints fuel Fed rate cut bets',
    summary: 'The greenback faced renewed selling pressure across major pairs after headline CPI slowed more than anticipated, strengthening expectations for a 25bps cut.',
    category: 'Central Banks',
    timeAgo: '28m ago',
    source: 'Forex Factory News',
    impact: 'high',
    url: 'https://www.forexfactory.com/news',
  },
  {
    id: 'news-2',
    title: 'EUR/USD reclaims 1.0850 level ahead of key ECB rate decision',
    summary: 'Euro bulls step in around structural order block support as traders prepare for Christine Lagarde’s press conference and updated macroeconomic forecasts.',
    category: 'Forex',
    timeAgo: '1h ago',
    source: 'Forex Factory Market Pulse',
    impact: 'high',
    url: 'https://www.forexfactory.com/news',
  },
  {
    id: 'news-3',
    title: 'Gold holds steady near record highs above $2,650 on safe-haven flows',
    summary: 'Spot Gold continues to find heavy institutional bids amidst persistent geopolitical tension and central bank reserves accumulation.',
    category: 'Commodities',
    timeAgo: '2h ago',
    source: 'Forex Factory Commodities Desk',
    impact: 'medium',
    url: 'https://www.forexfactory.com/news',
  },
  {
    id: 'news-4',
    title: 'Bank of Japan hints at further policy normalization as wage growth accelerates',
    summary: 'Governor Ueda reiterated that if inflation and economic growth progress in line with forecasts, additional benchmark rate hikes will remain firmly on the table.',
    category: 'Central Banks',
    timeAgo: '3h ago',
    source: 'Forex Factory Asia Wire',
    impact: 'high',
    url: 'https://www.forexfactory.com/news',
  },
  {
    id: 'news-5',
    title: 'Crude Oil pauses recent rally as US inventory data shows surprise build',
    summary: 'WTI crude retreated from session highs as EIA figures recorded an unexpected buildup in commercial crude stockpiles, offsetting supply concerns.',
    category: 'Commodities',
    timeAgo: '4h ago',
    source: 'Forex Factory Energy Wire',
    impact: 'low',
    url: 'https://www.forexfactory.com/news',
  },
];

export const ForexFactoryNews: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'calendar' | 'news'>('calendar');
  const [timeFilter, setTimeFilter] = useState<'All' | 'Today' | 'Tomorrow' | 'This Week'>('All');
  const [impactFilter, setImpactFilter] = useState<'all' | 'high' | 'medium-high'>('all');
  const [selectedCurrency, setSelectedCurrency] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [newsCategory, setNewsCategory] = useState<string>('All');

  const currencies = ['ALL', 'USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF'];

  const filteredEvents = useMemo(() => {
    return SAMPLE_ECONOMIC_EVENTS.filter((evt) => {
      // Timeframe match
      if (timeFilter !== 'All' && evt.dayGroup !== timeFilter) {
        return false;
      }

      // Impact match
      if (impactFilter === 'high' && evt.impact !== 'high') {
        return false;
      } else if (impactFilter === 'medium-high' && evt.impact === 'low') {
        return false;
      }

      // Currency match
      if (selectedCurrency !== 'ALL' && evt.currency !== selectedCurrency) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchEvt = evt.event.toLowerCase().includes(q);
        const matchCur = evt.currency.toLowerCase().includes(q);
        if (!matchEvt && !matchCur) return false;
      }

      return true;
    });
  }, [timeFilter, impactFilter, selectedCurrency, searchQuery]);

  const filteredNews = useMemo(() => {
    return SAMPLE_FOREX_NEWS.filter((item) => {
      const matchesCat = newsCategory === 'All' || item.category === newsCategory;
      const matchesSearch = 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.summary.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [newsCategory, searchQuery]);

  return (
    <section 
      id="forex-news" 
      className="relative w-full max-w-[1200px] mx-auto px-3 sm:px-6 md:px-8 py-6 sm:py-10 scroll-mt-24"
    >
      {/* Container: Real Forex Factory Signature Navy Theme */}
      <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-300 shadow-sm overflow-hidden">
        
        {/* 1. Real Forex Factory Dark Navy Header */}
        <div className="bg-[#18324f] text-white px-3.5 sm:px-6 py-3 sm:py-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-3">
            {/* Authentic Forex Factory Logo */}
            <div className="flex items-center gap-1">
              <span className="font-extrabold tracking-tight text-white text-[15px] sm:text-[17px] font-sans">
                FOREX
              </span>
              <span className="bg-[#ffba00] text-[#18324f] font-black text-[12px] sm:text-[13px] px-1.5 py-0.5 rounded-xs tracking-tight font-sans">
                FACTORY
              </span>
            </div>

            <div className="h-4 w-px bg-slate-600 hidden xs:block" />

            {/* View Tab Buttons */}
            <div className="flex items-center bg-[#102237] p-0.5 rounded-md border border-slate-700">
              <button
                type="button"
                onClick={() => setActiveTab('calendar')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[11.5px] sm:text-[12px] font-bold transition-colors cursor-pointer ${
                  activeTab === 'calendar'
                    ? 'bg-[#18324f] text-white shadow-2xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Calendar</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('news')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[11.5px] sm:text-[12px] font-bold transition-colors cursor-pointer ${
                  activeTab === 'news'
                    ? 'bg-[#18324f] text-white shadow-2xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Newspaper className="w-3.5 h-3.5" />
                <span>News</span>
              </button>
            </div>
          </div>

          {/* Right: Live Clock & Real Forex Factory Direct Link */}
          <div className="flex items-center gap-2 self-stretch sm:self-auto justify-between sm:justify-end text-[11px] sm:text-[12px]">
            <div className="flex items-center gap-1.5 text-slate-300 font-mono">
              <Clock className="w-3 h-3 text-[#ffba00]" />
              <span>GMT 13:30</span>
            </div>

            <a
              href="https://www.forexfactory.com/calendar"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-white bg-white/10 hover:bg-white/20 border border-white/20 px-2.5 py-1 rounded text-[11px] font-bold transition-colors cursor-pointer"
            >
              <span>forexfactory.com</span>
              <ExternalLink className="w-3 h-3 text-[#ffba00]" />
            </a>
          </div>
        </div>

        {/* 2. Authentic Filter Bar */}
        <div className="p-3 sm:p-4 bg-[#f4f7f9] border-b border-slate-200 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          
          {activeTab === 'calendar' ? (
            <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 sm:gap-4 flex-wrap">
              {/* Day filter */}
              <div className="flex items-center gap-1 text-[11.5px]">
                <span className="text-slate-500 font-bold font-inter mr-1 shrink-0">Date:</span>
                {(['All', 'Today', 'Tomorrow', 'This Week'] as const).map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setTimeFilter(d)}
                    className={`px-2.5 py-1 rounded font-bold transition-colors cursor-pointer text-[11px] sm:text-[11.5px] ${
                      timeFilter === d
                        ? 'bg-[#18324f] text-white shadow-2xs'
                        : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-300'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>

              {/* Impact filter with authentic Forex Factory Folder icons */}
              <div className="flex items-center gap-1 text-[11.5px]">
                <span className="text-slate-500 font-bold font-inter mr-1 shrink-0">Impact:</span>
                <div className="flex items-center bg-white border border-slate-300 rounded overflow-hidden p-0.5">
                  <button
                    type="button"
                    onClick={() => setImpactFilter('all')}
                    className={`px-2 py-0.5 rounded text-[11px] font-bold transition-colors cursor-pointer ${
                      impactFilter === 'all'
                        ? 'bg-[#18324f] text-white'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    All
                  </button>
                  <button
                    type="button"
                    onClick={() => setImpactFilter('high')}
                    className={`px-2 py-0.5 rounded text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer ${
                      impactFilter === 'high'
                        ? 'bg-[#D32F2F] text-white'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <ForexFactoryFolder impact="high" className="w-3.5 h-3.5" />
                    <span>Red Only</span>
                  </button>
                </div>
              </div>

              {/* Currency pills: Clean wrap, no overflow scrollbar */}
              <div className="flex items-center gap-1 text-[11.5px] flex-wrap">
                <span className="text-slate-500 font-bold font-inter mr-1 shrink-0">Currency:</span>
                <div className="flex items-center gap-1 flex-wrap">
                  {currencies.map((curr) => (
                    <button
                      key={curr}
                      type="button"
                      onClick={() => setSelectedCurrency(curr)}
                      className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold transition-colors cursor-pointer ${
                        selectedCurrency === curr
                          ? 'bg-[#18324f] text-white'
                          : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-300'
                      }`}
                    >
                      {curr}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* News Topic Switcher */
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-slate-500 font-bold text-[11.5px] mr-1">Category:</span>
              {['All', 'Central Banks', 'Forex', 'Commodities'].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setNewsCategory(cat)}
                  className={`px-2.5 py-1 rounded text-[11.5px] font-bold transition-colors cursor-pointer ${
                    newsCategory === cat
                      ? 'bg-[#18324f] text-white'
                      : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-300'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          {/* Search box */}
          <div className="relative w-full md:w-56 shrink-0 mt-1 md:mt-0">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search event, currency..."
              className="w-full pl-7 pr-2.5 py-1 text-[12px] bg-white border border-slate-300 rounded focus:border-[#18324f] focus:outline-hidden font-inter"
            />
          </div>
        </div>

        {/* 3. CALENDAR CONTENT */}
        {activeTab === 'calendar' && (
          <div>
            {/* MOBILE VIEW (<sm): Authentic Forex Factory Mobile Layout */}
            <div className="block sm:hidden divide-y divide-slate-200">
              {filteredEvents.length === 0 ? (
                <div className="text-center py-8 px-4 text-slate-500 font-inter text-[13px]">
                  No economic releases found matching your search.
                </div>
              ) : (
                filteredEvents.map((evt) => (
                  <div key={evt.id} className="p-3 bg-white hover:bg-slate-50 transition-colors">
                    {/* Header Row: Date/Time + Currency Flag + Forex Factory Folder */}
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] font-mono font-bold text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded">
                          {evt.time}
                        </span>

                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-100 font-mono font-bold text-[11px] text-slate-800 border border-slate-200">
                          <img
                            src={`https://flagcdn.com/w20/${evt.flag}.png`}
                            alt={evt.currency}
                            className="w-3.5 h-2.5 object-cover rounded-2xs inline-block"
                          />
                          {evt.currency}
                        </span>

                        {/* Real Forex Factory Folder Icon */}
                        <ForexFactoryFolder impact={evt.impact} className="w-3.5 h-3.5" />
                      </div>

                      <span className="text-[10.5px] font-mono text-slate-500">
                        {evt.date}
                      </span>
                    </div>

                    {/* Event Title */}
                    <h4 className="font-manrope font-bold text-[13px] text-slate-900 leading-snug mb-2">
                      {evt.event}
                    </h4>

                    {/* Numbers: Actual | Forecast | Previous */}
                    <div className="grid grid-cols-3 gap-1.5 bg-[#f7f9fa] rounded-lg p-2 border border-slate-200 text-center">
                      <div>
                        <span className="text-[9.5px] font-bold uppercase text-slate-500 block">Actual</span>
                        {evt.actual ? (
                          <span className={`font-mono font-black text-[12px] block mt-0.5 ${
                            evt.outcome === 'beat' 
                              ? 'text-emerald-700 font-extrabold' 
                              : evt.outcome === 'miss' 
                              ? 'text-rose-700 font-extrabold' 
                              : 'text-slate-900'
                          }`}>
                            {evt.actual}
                          </span>
                        ) : (
                          <span className="text-slate-400 font-mono text-[11px] italic block mt-0.5">Upcoming</span>
                        )}
                      </div>

                      <div className="border-x border-slate-200">
                        <span className="text-[9.5px] font-bold uppercase text-slate-500 block">Forecast</span>
                        <span className="font-mono text-[12px] text-slate-700 font-semibold block mt-0.5">
                          {evt.forecast || '-'}
                        </span>
                      </div>

                      <div>
                        <span className="text-[9.5px] font-bold uppercase text-slate-500 block">Previous</span>
                        <span className="font-mono text-[12px] text-slate-500 block mt-0.5">
                          {evt.previous || '-'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* DESKTOP VIEW (sm+): Authentic Forex Factory Table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#e4ebf2] border-b border-slate-300 text-[11px] font-manrope font-bold text-[#18324f] uppercase tracking-wider">
                    <th className="py-2 px-3">Date</th>
                    <th className="py-2 px-2">Time (GMT)</th>
                    <th className="py-2 px-2 text-center">Cur</th>
                    <th className="py-2 px-2 text-center">Imp</th>
                    <th className="py-2 px-3">Detail / Economic Event</th>
                    <th className="py-2 px-3 text-right">Actual</th>
                    <th className="py-2 px-3 text-right">Forecast</th>
                    <th className="py-2 px-3 text-right">Previous</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-[12.5px] font-inter">
                  {filteredEvents.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-center py-8 text-slate-500 font-inter">
                        No economic releases found matching your search.
                      </td>
                    </tr>
                  ) : (
                    filteredEvents.map((evt, idx) => {
                      const isAlternate = idx % 2 === 1;
                      return (
                        <tr 
                          key={evt.id} 
                          className={`hover:bg-[#f0f4f8] transition-colors ${
                            isAlternate ? 'bg-[#f7f9fa]' : 'bg-white'
                          }`}
                        >
                          {/* Date */}
                          <td className="py-2.5 px-3 whitespace-nowrap font-mono text-slate-600 text-[11.5px]">
                            {evt.date}
                          </td>

                          {/* Time */}
                          <td className="py-2.5 px-2 whitespace-nowrap font-mono font-bold text-slate-900 text-[12px]">
                            {evt.time}
                          </td>

                          {/* Currency */}
                          <td className="py-2.5 px-2 text-center whitespace-nowrap">
                            <span className="inline-flex items-center gap-1 font-mono font-bold text-[11px] text-slate-800">
                              <img
                                src={`https://flagcdn.com/w20/${evt.flag}.png`}
                                alt={evt.currency}
                                className="w-3.5 h-2.5 object-cover rounded-2xs inline-block"
                              />
                              {evt.currency}
                            </span>
                          </td>

                          {/* Impact Folder */}
                          <td className="py-2.5 px-2 text-center whitespace-nowrap">
                            <div className="flex justify-center">
                              <ForexFactoryFolder impact={evt.impact} className="w-4 h-4" />
                            </div>
                          </td>

                          {/* Event Name */}
                          <td className="py-2.5 px-3">
                            <span className="font-manrope font-bold text-slate-900 block leading-tight">
                              {evt.event}
                            </span>
                          </td>

                          {/* Actual */}
                          <td className="py-2.5 px-3 text-right whitespace-nowrap">
                            {evt.actual ? (
                              <span className={`font-mono font-black text-[12.5px] ${
                                evt.outcome === 'beat' 
                                  ? 'text-emerald-700' 
                                  : evt.outcome === 'miss' 
                                  ? 'text-rose-700' 
                                  : 'text-slate-900'
                              }`}>
                                {evt.actual}
                              </span>
                            ) : (
                              <span className="text-slate-400 font-mono text-[11px] italic">Upcoming</span>
                            )}
                          </td>

                          {/* Forecast */}
                          <td className="py-2.5 px-3 text-right whitespace-nowrap font-mono text-slate-700 text-[12px]">
                            {evt.forecast || '-'}
                          </td>

                          {/* Previous */}
                          <td className="py-2.5 px-3 text-right whitespace-nowrap font-mono text-slate-500 text-[12px]">
                            {evt.previous || '-'}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 4. NEWS CONTENT */}
        {activeTab === 'news' && (
          <div className="p-3 sm:p-5 divide-y divide-slate-200">
            {filteredNews.length === 0 ? (
              <div className="text-center py-8 text-slate-500 font-inter">
                No market news articles match your current topic filter.
              </div>
            ) : (
              filteredNews.map((news) => (
                <div key={news.id} className="py-3.5 first:pt-0 last:pb-0 group">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-slate-100 text-[#18324f] border border-slate-200">
                        {news.category}
                      </span>
                      <span className="text-[11px] text-slate-400 font-inter flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{news.timeAgo}</span>
                      </span>
                      <span className="text-[11px] font-medium text-slate-500 hidden sm:inline">
                        • {news.source}
                      </span>
                    </div>

                    <a
                      href={news.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-[11.5px] text-[#0053CF] font-bold hover:underline"
                    >
                      <span>Read Story</span>
                      <ChevronRight className="w-3 h-3" />
                    </a>
                  </div>

                  <h3 className="font-manrope font-bold text-[14px] sm:text-[15.5px] text-slate-900 group-hover:text-[#0053CF] transition-colors leading-snug mb-1">
                    <a href={news.url} target="_blank" rel="noreferrer">
                      {news.title}
                    </a>
                  </h3>

                  <p className="text-[12.5px] text-slate-600 font-inter leading-relaxed max-w-4xl">
                    {news.summary}
                  </p>
                </div>
              ))
            )}
          </div>
        )}

        {/* 5. Footer strip */}
        <div className="px-3.5 sm:px-6 py-2.5 bg-[#f4f7f9] border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] font-inter text-slate-600">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
            <span>Real Forex Factory Calendar • Calibrated to GMT standard market sessions</span>
          </div>

          <a 
            href="https://www.forexfactory.com/calendar" 
            target="_blank" 
            rel="noreferrer"
            className="text-[#18324f] hover:underline font-bold"
          >
            Visit official ForexFactory.com ↗
          </a>
        </div>

      </div>
    </section>
  );
};
