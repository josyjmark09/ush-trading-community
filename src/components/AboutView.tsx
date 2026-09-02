import React, { useState } from 'react';
import { NavTab } from '../types';
import { APP_IMAGES, MILESTONES, VALUES } from '../data/mockData';
import { 
  Eye, 
  GraduationCap, 
  Users, 
  CheckCircle, 
  Send, 
  ChevronRight, 
  Award, 
  ShieldCheck 
} from 'lucide-react';

interface AboutViewProps {
  setActiveTab: (tab: NavTab) => void;
  onOpenTelegram: () => void;
  onOpenBroker: () => void;
}

export const AboutView: React.FC<AboutViewProps> = ({
  setActiveTab,
  onOpenTelegram,
  onOpenBroker,
}) => {
  const [selectedMilestone, setSelectedMilestone] = useState<string>('2021');

  const getValueIcon = (iconName: string) => {
    switch (iconName) {
      case 'Eye':
        return <Eye className="w-5 h-5 text-[#0053CF]" />;
      case 'GraduationCap':
        return <GraduationCap className="w-5 h-5 text-[#0053CF]" />;
      case 'Users':
        return <Users className="w-5 h-5 text-[#0053CF]" />;
      default:
        return <Award className="w-5 h-5 text-[#0053CF]" />;
    }
  };

  return (
    <div className="w-full flex flex-col gap-8 md:gap-14 pt-1 sm:pt-2 pb-10 sm:pb-12">
      {/* Hero Section */}
      <section className="px-3 sm:px-6 md:px-8 max-w-[1200px] mx-auto w-full">
        <div className="flex flex-col md:flex-row gap-6 md:gap-14 items-center">
          {/* Left Column Text */}
          <div className="flex-1 space-y-3 sm:space-y-4 text-left">
            <span className="inline-block bg-slate-100 border border-slate-300 text-slate-900 font-inter text-[11px] sm:text-[12px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider">
              Our Story
            </span>
            <h1 className="font-manrope text-[28px] sm:text-[38px] md:text-[48px] font-black text-slate-900 leading-[1.15] tracking-tight">
              Built on Clarity. <br />
              <span className="text-[#0053CF]">Driven by Education.</span>
            </h1>
            <p className="font-inter text-[13.5px] sm:text-[16px] text-slate-600 leading-relaxed">
              U.S.H Forex was founded with a singular purpose: to cut through the noise of the trading industry and provide institutional-grade insights paired with actionable education for the modern retail trader.
            </p>
            <div className="pt-1 sm:pt-2 flex flex-col sm:flex-row gap-2.5 sm:gap-3">
              <button
                onClick={onOpenTelegram}
                className="inline-flex items-center justify-center gap-2 bg-[#0053CF] hover:bg-[#0040A2] text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg font-inter text-[13.5px] sm:text-[14px] font-bold shadow-xs transition-colors cursor-pointer w-full sm:w-auto"
              >
                <Send className="w-4 h-4" />
                <span>Join Our Community</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Values Grid */}
      <section className="px-3 sm:px-6 md:px-8 max-w-[1200px] mx-auto w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 sm:gap-5">
          {VALUES.map((val) => (
            <div
              key={val.id}
              className="p-4 sm:p-6 rounded-xl border border-slate-300 bg-white hover:border-[#0053CF] transition-colors flex flex-col items-start gap-2 sm:gap-3 shadow-xs"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center bg-slate-100 text-[#0053CF]">
                {getValueIcon(val.icon)}
              </div>
              <h3 className="font-manrope text-[16px] sm:text-[18px] font-black text-slate-900">
                {val.title}
              </h3>
              <p className="font-inter text-[13px] sm:text-[14px] text-slate-600 leading-relaxed">
                {val.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Timeline Section ("Our Journey") */}
      <section className="px-4 md:px-8 max-w-[1200px] mx-auto w-full">
        <div className="text-center mb-10 space-y-1.5">
          <h2 className="font-manrope text-[28px] sm:text-[34px] font-black text-slate-900">
            Our Journey
          </h2>
          <p className="font-inter text-[15px] text-slate-600 max-w-xl mx-auto">
            From a small analysis group to a growing community of disciplined traders.
          </p>
        </div>

        {/* Timeline Path */}
        <div className="relative max-w-3xl mx-auto">
          {/* Vertical Line */}
          <div className="absolute left-4 sm:left-1/2 top-4 bottom-4 w-0.5 bg-slate-300 -translate-x-1/2" />

          <div className="space-y-8">
            {MILESTONES.map((item, idx) => {
              const isEven = idx % 2 === 0;
              return (
                <div
                  key={item.year}
                  onClick={() => setSelectedMilestone(item.year)}
                  className={`relative flex flex-col sm:flex-row items-start gap-6 cursor-pointer group ${
                    isEven ? 'sm:flex-row-reverse' : ''
                  }`}
                >
                  {/* Timeline Dot */}
                  <div className="absolute left-4 sm:left-1/2 top-4 -translate-x-1/2 w-4 h-4 rounded-full bg-white border-4 border-[#0053CF] shadow-xs z-10" />

                  {/* Card */}
                  <div className={`ml-10 sm:ml-0 sm:w-1/2 ${isEven ? 'sm:pl-10 text-left' : 'sm:pr-10 text-left sm:text-right'}`}>
                    <div className="bg-white p-5 rounded-xl border border-slate-300 shadow-xs hover:border-[#0053CF] transition-colors">
                      <span className="font-inter text-[12px] text-[#0053CF] font-black uppercase tracking-wider block mb-1">
                        {item.year}
                      </span>
                      <h4 className="font-manrope text-[17px] font-black text-slate-900 mb-1">
                        {item.title}
                      </h4>
                      <p className="font-inter text-[13.5px] text-slate-600 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};
