import React, { useState } from 'react';
import { FAQS } from '../data/mockData';
import { FAQItem } from '../types';
import { ChevronDown, HelpCircle, Search, MessageCircleQuestion } from 'lucide-react';

interface FAQViewProps {
  onOpenContact: () => void;
}

export const FAQView: React.FC<FAQViewProps> = ({ onOpenContact }) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [expandedId, setExpandedId] = useState<string | null>('faq-1');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['All', 'Community', 'Broker', 'Trading', 'General'];

  const filteredFaqs = FAQS.filter((faq) => {
    const matchesCategory = activeCategory === 'All' || faq.category === activeCategory;
    const matchesSearch = 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleAccordion = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="w-full flex flex-col gap-8 md:gap-12 pt-2 pb-12">
      {/* Header Section */}
      <section className="text-center flex flex-col items-center justify-center px-4 md:px-8 max-w-[1200px] mx-auto w-full">
        <span className="inline-block bg-slate-100 border border-slate-300 text-slate-800 font-inter text-[12px] font-black py-1 px-3.5 rounded-md uppercase tracking-wider mb-2">
          HELP & RESOURCES
        </span>
        <h1 className="font-manrope text-[30px] sm:text-[38px] md:text-[44px] font-black text-slate-900 mb-2 tracking-tight leading-[1.15] text-center">
          Frequently Asked Questions
        </h1>
        <p className="font-inter text-[15px] sm:text-[16px] text-slate-600 max-w-2xl mx-auto leading-relaxed text-center">
          Find answers about our community guidelines, Telegram alerts, recommended broker setups, and trading discipline.
        </p>

        {/* Search Bar */}
        <div className="mt-6 max-w-lg mx-auto relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search questions or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-300 focus:border-[#0053CF] rounded-lg pl-11 pr-4 py-2.5 text-[13.5px] text-slate-900 placeholder-slate-400 outline-none shadow-2xs font-inter"
          />
        </div>
      </section>

      {/* Category Tabs & FAQ Accordion */}
      <section className="px-4 md:px-8 max-w-[900px] mx-auto w-full">
        {/* Category Pills */}
        <div className="flex gap-2 justify-center flex-wrap mb-6">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-md font-inter text-[12.5px] font-bold transition-colors cursor-pointer ${
                activeCategory === cat
                  ? 'bg-[#0053CF] text-white shadow-2xs'
                  : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* FAQ List */}
        <div className="space-y-3">
          {filteredFaqs.length === 0 ? (
            <div className="bg-white p-6 sm:p-8 rounded-xl text-center border border-slate-300 text-slate-600">
              <HelpCircle className="w-7 h-7 text-slate-400 mx-auto mb-2" />
              <p className="font-bold text-slate-900 text-[14px] sm:text-[15px]">No matching questions found</p>
              <p className="text-[12.5px] mt-1 text-slate-500">Try another search keyword or select All categories.</p>
            </div>
          ) : (
            filteredFaqs.map((faq) => {
              const isExpanded = expandedId === faq.id;
              return (
                <div
                  key={faq.id}
                  className="bg-white rounded-lg sm:rounded-xl border border-slate-300 overflow-hidden shadow-2xs"
                >
                  <button
                    onClick={() => toggleAccordion(faq.id)}
                    className="w-full px-3.5 py-3 sm:px-5 sm:py-3.5 text-left flex items-start sm:items-center justify-between gap-2.5 sm:gap-4 hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 flex-1 min-w-0 pr-1">
                      <span className="text-[9.5px] sm:text-[10.5px] font-extrabold text-slate-700 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded uppercase tracking-wider self-start sm:self-center shrink-0">
                        {faq.category}
                      </span>
                      <span className="font-manrope text-[13.5px] sm:text-[15px] font-bold text-slate-900 leading-snug">
                        {faq.question}
                      </span>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 sm:w-5 sm:h-5 text-slate-500 transition-transform duration-200 shrink-0 mt-0.5 sm:mt-0 ${
                        isExpanded ? 'rotate-180 text-[#0053CF]' : ''
                      }`}
                    />
                  </button>

                  {isExpanded && (
                    <div className="px-3.5 pb-3.5 pt-1 sm:px-5 sm:pb-4 text-[13px] sm:text-[14px] font-inter text-slate-700 leading-relaxed border-t border-slate-200 bg-slate-50/50">
                      <p className="pt-2">{faq.answer}</p>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Still have questions */}
        <div className="mt-8 bg-slate-100 border border-slate-300 rounded-xl p-5 text-center">
          <h4 className="font-manrope text-[16px] font-black text-slate-900 mb-1">
            Still have questions?
          </h4>
          <p className="font-inter text-[13.5px] text-slate-600 mb-3">
            Our team and active community moderators are available to help.
          </p>
          <button
            onClick={onOpenContact}
            className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-900 border border-slate-300 font-inter text-[13px] font-bold px-4 py-2 rounded-md transition-colors shadow-2xs cursor-pointer"
          >
            <MessageCircleQuestion className="w-4 h-4 text-[#0053CF]" />
            <span>Contact Support</span>
          </button>
        </div>
      </section>
    </div>
  );
};
