import React from 'react';
import { NavTab } from '../types';
import { TESTIMONIALS } from '../data/mockData';
import { Star, ShieldCheck, MessageSquare, Send, Quote } from 'lucide-react';

interface TestimonialsViewProps {
  onOpenTelegram: () => void;
}

export const TestimonialsView: React.FC<TestimonialsViewProps> = ({ onOpenTelegram }) => {
  return (
    <div className="w-full flex flex-col gap-12 md:gap-16 pt-4 pb-12">
      {/* Header Section */}
      <section className="text-center px-4 md:px-8 max-w-[1200px] mx-auto w-full">
        <span className="inline-block bg-[#EBF3FF] text-[#0053CF] font-inter text-[12px] font-bold py-1 px-3.5 rounded uppercase tracking-wider mb-3">
          TRADER STORIES
        </span>
        <h1 className="font-manrope text-[34px] sm:text-[44px] md:text-[50px] font-extrabold text-[#091C35] mb-4 tracking-tight leading-[1.15]">
          Built on Real Consistency
        </h1>
        <p className="font-inter text-[16px] sm:text-[18px] text-[#44474D] max-w-2xl mx-auto leading-relaxed">
          Read genuine feedback from traders who joined the U.S.H Forex community to replace emotion with systematic execution.
        </p>
      </section>

      {/* Testimonials Bento Cards */}
      <section className="px-4 md:px-8 max-w-[1200px] mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((item) => (
            <div
              key={item.id}
              className="glass-card bg-white p-7 rounded-2xl border border-[#E2E8F0] shadow-sm hover:shadow-md hover:border-[#116AFE]/40 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Rating & Quote icon */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <Quote className="w-6 h-6 text-[#DAE2FF]" />
                </div>

                <p className="font-inter text-[15px] text-[#181C20] leading-relaxed mb-6 italic">
                  "{item.content}"
                </p>
              </div>

              <div className="pt-4 border-t border-[#F1F4F9] flex items-center gap-3.5">
                <img
                  src={item.avatar}
                  alt={item.name}
                  className="w-11 h-11 rounded-full object-cover border border-[#E2E8F0]"
                />
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="font-manrope text-[15px] font-bold text-[#091C35]">{item.name}</span>
                    <ShieldCheck className="w-3.5 h-3.5 text-[#0053CF]" />
                  </div>
                  <span className="font-inter text-[12px] text-[#44474D]">{item.experience}</span>
                  {item.profitSnippet && (
                    <span className="text-[11px] font-semibold text-[#0053CF] bg-[#EBF3FF] px-2 py-0.5 rounded mt-1 w-fit">
                      {item.profitSnippet}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Community Callout */}
      <section className="px-4 md:px-8 max-w-[1200px] mx-auto w-full">
        <div className="bg-[#091C35] text-white p-8 md:p-12 rounded-3xl text-center relative overflow-hidden shadow-xl">
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <h3 className="font-manrope text-[24px] sm:text-[30px] font-bold">
              Ready to trade with clarity?
            </h3>
            <p className="font-inter text-[15px] text-[#B6C7E8]">
              Join over 5,000 active traders receiving daily institutional analysis and trade breakdowns directly on Telegram.
            </p>
            <div className="pt-2">
              <button
                onClick={onOpenTelegram}
                className="inline-flex items-center gap-2 bg-[#116AFE] hover:bg-[#0053CF] text-white px-8 py-3.5 rounded-xl font-inter text-[15px] font-semibold glow-blue transition-all active:scale-95 cursor-pointer shadow-md"
              >
                <Send className="w-4 h-4" />
                <span>Join Official Telegram</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
