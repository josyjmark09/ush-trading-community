import React from 'react';
import { NavTab } from '../types';
import { TESTIMONIALS } from '../data/mockData';
import { Star, ShieldCheck, Send, Quote } from 'lucide-react';

interface TestimonialsViewProps {
  onOpenTelegram: () => void;
}

export const TestimonialsView: React.FC<TestimonialsViewProps> = ({ onOpenTelegram }) => {
  return (
    <div className="w-full flex flex-col gap-8 md:gap-12 pt-2 pb-12">
      {/* Header Section */}
      <section className="text-center flex flex-col items-center justify-center px-4 md:px-8 max-w-[1200px] mx-auto w-full">
        <span className="inline-block bg-slate-100 border border-slate-300 text-slate-800 font-inter text-[12px] font-black py-1 px-3.5 rounded-md uppercase tracking-wider mb-2">
          TRADER STORIES
        </span>
        <h1 className="font-manrope text-[30px] sm:text-[38px] md:text-[44px] font-black text-slate-900 mb-2 tracking-tight leading-[1.15] text-center">
          Built on Real Consistency
        </h1>
        <p className="font-inter text-[15px] sm:text-[16px] text-slate-600 max-w-2xl mx-auto leading-relaxed text-center">
          Read genuine feedback from traders who joined the USH Community of Traders to replace emotion with systematic execution.
        </p>
      </section>

      {/* Testimonials Cards */}
      <section className="px-4 md:px-8 max-w-[1200px] mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {TESTIMONIALS.map((item) => (
            <div
              key={item.id}
              className="bg-white p-6 rounded-xl border border-slate-300 shadow-xs hover:border-[#0053CF] transition-colors flex flex-col justify-between"
            >
              <div>
                {/* Rating & Quote icon */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <Quote className="w-5 h-5 text-slate-300" />
                </div>

                <p className="font-inter text-[14px] text-slate-800 leading-relaxed mb-5">
                  "{item.content}"
                </p>
              </div>

              <div className="pt-3.5 border-t border-slate-200 flex items-center gap-3">
                <img
                  src={item.avatar}
                  alt={item.name}
                  className="w-10 h-10 rounded-md object-cover border border-slate-300"
                />
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="font-manrope text-[14.5px] font-black text-slate-900">{item.name}</span>
                    <ShieldCheck className="w-3.5 h-3.5 text-[#0053CF]" />
                  </div>
                  <span className="font-inter text-[12px] text-slate-500 font-medium">{item.experience}</span>
                  {item.profitSnippet && (
                    <span className="text-[11px] font-bold text-slate-800 bg-slate-100 border border-slate-300 px-2 py-0.5 rounded mt-1 w-fit">
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
        <div className="bg-slate-900 text-white p-8 md:p-10 rounded-2xl text-center border border-slate-800 shadow-sm">
          <div className="max-w-2xl mx-auto space-y-3">
            <h3 className="font-manrope text-[24px] sm:text-[28px] font-black">
              Ready to trade with clarity?
            </h3>
            <p className="font-inter text-[14.5px] text-slate-300">
              Join over 20,000 active traders receiving daily institutional analysis and trade breakdowns directly on Telegram.
            </p>
            <div className="pt-2">
              <button
                onClick={onOpenTelegram}
                className="inline-flex items-center gap-2 bg-[#0053CF] hover:bg-[#0040A2] text-white px-7 py-3 rounded-lg font-inter text-[14.5px] font-bold transition-colors cursor-pointer shadow-xs"
              >
                <Send className="w-4 h-4" />
                <span>Join our trading community</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
