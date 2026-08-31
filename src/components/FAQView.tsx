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
    <div className="w-full flex flex-col gap-12 md:gap-16 pt-4 pb-12">
      {/* Header Section */}
      <section className="text-center px-4 md:px-8 max-w-[1200px] mx-auto w-full">
        <span className="inline-block bg-[#EBF3FF] text-[#0053CF] font-inter text-[12px] font-bold py-1 px-3.5 rounded uppercase tracking-wider mb-3">
          HELP & RESOURCES
        </span>
        <h1 className="font-manrope text-[34px] sm:text-[44px] md:text-[50px] font-extrabold text-[#091C35] mb-4 tracking-tight leading-[1.15]">
          Frequently Asked Questions
        </h1>
        <p className="font-inter text-[16px] sm:text-[18px] text-[#44474D] max-w-2xl mx-auto leading-relaxed">
          Find answers about our community guidelines, Telegram alerts, recommended broker setups, and trading discipline.
        </p>

        {/* Search Bar */}
        <div className="mt-8 max-w-lg mx-auto relative">
          <Search className="w-5 h-5 text-[#75777E] absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search questions or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-[#C5C6CE] focus:border-[#0053CF] rounded-xl pl-12 pr-4 py-3 text-[14px] text-[#181C20] placeholder-[#75777E] outline-none shadow-sm focus:ring-2 focus:ring-[#116AFE]/20 transition-all"
          />
        </div>
      </section>

      {/* Category Tabs & FAQ Accordion */}
      <section className="px-4 md:px-8 max-w-[900px] mx-auto w-full">
        {/* Category Pills */}
        <div className="flex gap-2 justify-center flex-wrap mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-lg font-inter text-[13px] font-semibold transition-all ${
                activeCategory === cat
                  ? 'bg-[#0053CF] text-white shadow-sm'
                  : 'bg-white border border-[#E2E8F0] text-[#44474D] hover:bg-[#F1F4F9]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {filteredFaqs.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl text-center border border-[#E2E8F0] text-[#44474D]">
              <HelpCircle className="w-8 h-8 text-[#75777E] mx-auto mb-2" />
              <p className="font-semibold text-[#091C35]">No matching questions found</p>
              <p className="text-[13px] mt-1">Try another search keyword or select All categories.</p>
            </div>
          ) : (
            filteredFaqs.map((faq) => {
              const isExpanded = expandedId === faq.id;
              return (
                <div
                  key={faq.id}
                  className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden transition-all shadow-sm"
                >
                  <button
                    onClick={() => toggleAccordion(faq.id)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 hover:bg-[#F7FAFF] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] font-bold text-[#0053CF] bg-[#EBF3FF] px-2 py-0.5 rounded uppercase">
                        {faq.category}
                      </span>
                      <span className="font-manrope text-[16px] font-bold text-[#091C35]">
                        {faq.question}
                      </span>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-[#75777E] transition-transform duration-200 shrink-0 ${
                        isExpanded ? 'rotate-180 text-[#0053CF]' : ''
                      }`}
                    />
                  </button>

                  {isExpanded && (
                    <div className="px-6 pb-5 pt-1 text-[14px] font-inter text-[#44474D] leading-relaxed border-t border-[#F1F4F9]">
                      <p className="pt-2">{faq.answer}</p>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Still have questions? */}
        <div className="mt-12 bg-[#F1F4F9] border border-[#E5E8ED] rounded-2xl p-6 text-center">
          <h4 className="font-manrope text-[18px] font-bold text-[#091C35] mb-1">
            Still have questions?
          </h4>
          <p className="font-inter text-[14px] text-[#44474D] mb-4">
            Our team and active community moderators are available to help.
          </p>
          <button
            onClick={onOpenContact}
            className="inline-flex items-center gap-2 bg-white hover:bg-[#EBF3FF] text-[#0053CF] border border-[#B2C5FF] font-inter text-[13px] font-semibold px-5 py-2.5 rounded-lg transition-colors shadow-sm"
          >
            <MessageCircleQuestion className="w-4 h-4" />
            <span>Contact Support</span>
          </button>
        </div>
      </section>
    </div>
  );
};
