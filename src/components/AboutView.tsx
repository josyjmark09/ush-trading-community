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
  BookOpen, 
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
        return <Eye className="w-6 h-6 text-[#0053CF]" />;
      case 'GraduationCap':
        return <GraduationCap className="w-6 h-6 text-[#0053CF]" />;
      case 'Users':
        return <Users className="w-6 h-6 text-[#0053CF]" />;
      default:
        return <Award className="w-6 h-6 text-[#0053CF]" />;
    }
  };

  return (
    <div className="w-full flex flex-col gap-16 md:gap-24 pt-4 pb-12">
      {/* Hero Section */}
      <section className="px-4 md:px-8 max-w-[1200px] mx-auto w-full">
        <div className="flex flex-col md:flex-row gap-10 md:gap-16 items-center">
          {/* Left Column Text */}
          <div className="flex-1 space-y-5 text-left">
            <span className="inline-block bg-[#D5E3FF] text-[#0040A2] font-inter text-[12px] font-bold px-3 py-1 rounded uppercase tracking-wider">
              Our Story
            </span>
            <h1 className="font-manrope text-[36px] sm:text-[44px] md:text-[50px] font-extrabold text-[#091C35] leading-[1.15] tracking-tight">
              Built on Clarity. <br />
              <span className="text-[#0053CF]">Driven by Education.</span>
            </h1>
            <p className="font-inter text-[17px] text-[#44474D] leading-relaxed">
              U.S.H Forex was founded with a singular purpose: to cut through the noise of the trading industry and provide institutional-grade insights paired with actionable education for the modern retail trader.
            </p>
            <div className="pt-2 flex flex-wrap gap-4">
              <button
                onClick={onOpenTelegram}
                className="flex items-center gap-2 bg-[#116AFE] hover:bg-[#0053CF] text-white px-6 py-3 rounded-lg font-inter text-[14px] font-semibold glow-blue transition-all active:scale-95 cursor-pointer shadow-md"
              >
                <Send className="w-4 h-4" />
                <span>Join Our Telegram</span>
              </button>
              <button
                onClick={() => setActiveTab('broker')}
                className="flex items-center gap-2 bg-white hover:bg-[#F1F4F9] text-[#091C35] border border-[#C5C6CE] px-6 py-3 rounded-lg font-inter text-[14px] font-semibold transition-colors cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-[#0053CF]" />
                <span>Recommended Broker</span>
              </button>
            </div>
          </div>

          {/* Right Column Founder Image */}
          <div className="flex-1 w-full max-w-lg">
            <div className="relative w-full aspect-[4/3] rounded-2xl p-2.5 bg-gradient-to-b from-[#116AFE]/25 via-[#0053CF]/15 to-transparent border-2 border-[#116AFE] shadow-2xl backdrop-blur-md overflow-hidden shine-effect">
              <img
                src={APP_IMAGES.founderPortrait}
                alt="U.S.H Forex Founder in Modern Corporate Setting"
                className="w-full h-full object-cover rounded-xl shadow-sm"
                loading="eager"
              />
              <div className="absolute bottom-5 left-5 right-5 bg-white/90 backdrop-blur-md p-3.5 rounded-xl border border-white/80 shadow-md flex items-center justify-between z-10">
                <div>
                  <div className="font-manrope text-[15px] font-bold text-[#091C35]">U.S.H Leadership</div>
                  <div className="font-inter text-[12px] text-[#44474D]">Systematic Forex Strategy & Community</div>
                </div>
                <span className="text-[11px] bg-[#EBF3FF] text-[#0053CF] px-2.5 py-1 rounded-full font-bold">
                  VERIFIED
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Values Grid */}
      <section className="px-4 md:px-8 max-w-[1200px] mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {VALUES.map((val) => (
            <div
              key={val.id}
              className={`glass-card p-7 rounded-2xl border transition-all duration-300 flex flex-col items-start gap-4 relative overflow-hidden ${
                val.highlight
                  ? 'border-[#116AFE]/40 shadow-lg glow-blue bg-gradient-to-b from-white to-[#F6F9FE]'
                  : 'border-[#E2E8F0] hover:shadow-md hover:border-[#B2C5FF]'
              }`}
            >
              {val.highlight && (
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#116AFE]/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl pointer-events-none" />
              )}
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                val.highlight ? 'bg-[#116AFE]/15 text-[#0053CF]' : 'bg-[#EBEEF3] text-[#0053CF]'
              }`}>
                {getValueIcon(val.icon)}
              </div>
              <h3 className="font-manrope text-[20px] font-bold text-[#091C35]">
                {val.title}
              </h3>
              <p className="font-inter text-[15px] text-[#44474D] leading-relaxed">
                {val.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Trading Philosophy Section */}
      <section className="px-4 md:px-8 max-w-[1200px] mx-auto w-full">
        <div className="bg-[#F1F4F9] rounded-2xl p-6 md:p-10 border border-[#C5C6CE]/50 relative overflow-hidden shadow-sm">
          {/* Decorative subtle dot grid */}
          <div className="absolute inset-0 opacity-10 pointer-events-none grid-bg-subtle" />

          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 md:gap-12">
            {/* Chart screen image */}
            <div className="flex-1 w-full">
              <div className="rounded-xl overflow-hidden shadow-md border border-[#C5C6CE]/40 bg-white">
                <img
                  src={APP_IMAGES.philosophyDashboard}
                  alt="U.S.H Forex Market Analysis Terminal and Chart Structure"
                  className="w-full h-auto object-cover"
                  loading="lazy"
                />
              </div>
            </div>

            {/* Philosophy description */}
            <div className="flex-1 space-y-4">
              <h2 className="font-manrope text-[28px] sm:text-[34px] font-bold text-[#091C35]">
                Our Trading Philosophy
              </h2>
              <p className="font-inter text-[16px] text-[#44474D] leading-relaxed">
                We believe that consistent trading results come from a structured approach to risk management and market structure.
              </p>

              <ul className="space-y-3.5 pt-2 font-inter text-[15px] text-[#44474D]">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#0053CF] shrink-0 mt-0.5" />
                  <span>Focus on high-probability setups over frequency.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#0053CF] shrink-0 mt-0.5" />
                  <span>Strict risk management parameters to protect capital.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#0053CF] shrink-0 mt-0.5" />
                  <span>Continuous adaptation to changing market conditions.</span>
                </li>
              </ul>

              <div className="pt-3">
                <button
                  onClick={onOpenTelegram}
                  className="inline-flex items-center gap-2 text-[#0053CF] font-semibold text-[14px] hover:text-[#0040A2]"
                >
                  <span>See our daily market prep write-ups in Telegram</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section ("Our Journey") */}
      <section className="px-4 md:px-8 max-w-[1200px] mx-auto w-full">
        <div className="text-center mb-12 space-y-2">
          <h2 className="font-manrope text-[28px] sm:text-[34px] font-bold text-[#091C35]">
            Our Journey
          </h2>
          <p className="font-inter text-[16px] text-[#44474D] max-w-xl mx-auto">
            From a small analysis group to a growing community of disciplined traders.
          </p>
        </div>

        {/* Timeline Path */}
        <div className="relative max-w-3xl mx-auto">
          {/* Vertical Line */}
          <div className="absolute left-4 sm:left-1/2 top-4 bottom-4 w-0.5 bg-[#E5E8ED] -translate-x-1/2" />

          <div className="space-y-10">
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
                  <div className="absolute left-4 sm:left-1/2 top-4 -translate-x-1/2 w-4 h-4 rounded-full bg-white border-4 border-[#0053CF] shadow-sm z-10 group-hover:scale-125 transition-transform" />

                  {/* Card */}
                  <div className={`ml-10 sm:ml-0 sm:w-1/2 ${isEven ? 'sm:pl-10 text-left' : 'sm:pr-10 text-left sm:text-right'}`}>
                    <div className="glass-card bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-sm group-hover:shadow-md group-hover:border-[#116AFE]/40 transition-all">
                      <span className="font-inter text-[12px] text-[#0053CF] font-bold uppercase tracking-wider block mb-1">
                        {item.year}
                      </span>
                      <h4 className="font-manrope text-[18px] font-bold text-[#091C35] mb-1.5">
                        {item.title}
                      </h4>
                      <p className="font-inter text-[14px] text-[#44474D] leading-relaxed">
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
