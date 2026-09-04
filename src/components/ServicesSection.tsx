import React from 'react';
import { 
  GraduationCap, 
  Crown, 
  Zap, 
  Briefcase, 
  TrendingUp, 
  Users, 
  CheckCircle2, 
  ArrowRight, 
  AlertCircle,
  ShieldCheck,
  Send,
  MessageSquare
} from 'lucide-react';
import { useSite } from '../context/SiteContext';
import { ServiceItem } from '../types';

interface ServicesSectionProps {
  onOpenTelegram: () => void;
  onOpenContact: () => void;
  onOpenVipGuide?: () => void;
}

const getServiceIcon = (iconName?: string) => {
  switch (iconName) {
    case 'GraduationCap':
      return <GraduationCap className="w-5 h-5" />;
    case 'Crown':
      return <Crown className="w-5 h-5" />;
    case 'Zap':
      return <Zap className="w-5 h-5" />;
    case 'Briefcase':
      return <Briefcase className="w-5 h-5" />;
    case 'TrendingUp':
      return <TrendingUp className="w-5 h-5" />;
    case 'Users':
    default:
      return <Users className="w-5 h-5" />;
  }
};

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  onOpenTelegram,
  onOpenContact,
}) => {
  const { settings } = useSite();
  const servicesConfig = settings.services;

  if (!servicesConfig || !servicesConfig.services || servicesConfig.services.length === 0) {
    return null;
  }

  const handleCardCta = (service: ServiceItem) => {
    if (service.id === 'service-4') {
      onOpenContact();
    } else {
      onOpenTelegram();
    }
  };

  return (
    <section id="services" className="px-3 sm:px-6 md:px-8 max-w-[1200px] mx-auto w-full scroll-mt-24">
      {/* Section Header */}
      <div className="text-center flex flex-col items-center justify-center mb-8 sm:mb-12 space-y-3 max-w-3xl mx-auto">
        <span className="inline-flex items-center gap-1.5 bg-blue-50 border border-blue-200/80 text-[#0053CF] font-inter text-[11px] sm:text-[12px] font-black px-3 py-1 rounded-md uppercase tracking-wider">
          <ShieldCheck className="w-3.5 h-3.5" />
          {servicesConfig.badgeText || servicesConfig.sectionBadge || "OUR SERVICES"}
        </span>
        <h2 className="font-manrope text-[26px] sm:text-[34px] md:text-[40px] font-black text-slate-900 leading-tight">
          {servicesConfig.title || "Our Services"}
        </h2>
        <p className="font-inter text-[13.5px] sm:text-[15.5px] text-slate-600 leading-relaxed text-center">
          {servicesConfig.subtitle}
        </p>
      </div>

      {/* 6 Services 3x2 Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {servicesConfig.services.map((service, index) => {
          const isSpecialConsult = service.id === 'service-4';
          const isSignals = service.id === 'service-3';

          return (
            <div
              key={service.id || index}
              className="bg-white rounded-xl sm:rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-[#0053CF]/40 transition-all duration-300 p-5 sm:p-6 flex flex-col justify-between group relative overflow-hidden"
            >
              {/* Top Accent Gradient Line on Hover */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-transparent group-hover:bg-[#0053CF] transition-colors duration-300" />

              <div>
                {/* Header Row: Badge, Number, Icon */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] font-bold text-slate-400 bg-slate-100 border border-slate-200/80 px-2 py-0.5 rounded-md">
                      {service.number || `0${index + 1}`}
                    </span>
                    {service.badge && (
                      <span className="text-[11px] font-bold text-[#0053CF] bg-blue-50 border border-blue-100 px-2.5 py-0.5 rounded-md">
                        {service.badge}
                      </span>
                    )}
                  </div>
                  <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 text-[#0053CF] flex items-center justify-center group-hover:scale-105 group-hover:bg-[#0053CF] group-hover:text-white transition-all duration-300 shrink-0">
                    {getServiceIcon(service.icon)}
                  </div>
                </div>

                {/* Title & Tagline */}
                <h3 className="font-manrope text-[18px] sm:text-[19px] font-black text-slate-900 leading-snug group-hover:text-[#0053CF] transition-colors">
                  {service.title}
                </h3>
                <p className="font-inter text-[12.5px] sm:text-[13px] font-bold text-[#0053CF] mt-1 leading-snug">
                  {service.subtitle}
                </p>

                {/* Description */}
                <p className="font-inter text-[12.5px] sm:text-[13px] text-slate-600 leading-relaxed mt-2.5">
                  {service.description}
                </p>

                {/* Inclusions List */}
                <div className="mt-4 pt-3.5 border-t border-slate-100">
                  <div className="font-inter text-[11.5px] font-extrabold uppercase tracking-wider text-slate-400 mb-2.5">
                    {service.includedTitle || "What’s included:"}
                  </div>
                  <ul className="space-y-2">
                    {service.inclusions.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-[12px] sm:text-[12.5px] text-slate-700 font-inter leading-snug">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#0053CF] shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Disclaimer Callout (Signals & Investment Consultation) */}
                {service.disclaimer && (
                  <div className="mt-4 p-2.5 rounded-lg bg-amber-50/70 border border-amber-200/70 text-amber-900 text-[11px] sm:text-[11.5px] font-inter flex items-start gap-2 leading-relaxed">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                    <span>{service.disclaimer}</span>
                  </div>
                )}
              </div>

              {/* Bottom Action Button */}
              <div className="pt-5 mt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => handleCardCta(service)}
                  className={`w-full py-2.5 px-3 rounded-lg font-inter text-[12.5px] sm:text-[13px] font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs active:scale-[0.99] ${
                    isSpecialConsult
                      ? 'bg-slate-900 hover:bg-slate-800 text-white border border-slate-900'
                      : isSignals
                      ? 'bg-[#0053CF] hover:bg-[#0040A2] text-white'
                      : 'bg-slate-50 hover:bg-[#0053CF] text-slate-700 hover:text-white border border-slate-200 hover:border-[#0053CF]'
                  }`}
                >
                  {isSpecialConsult ? (
                    <MessageSquare className="w-3.5 h-3.5 shrink-0" />
                  ) : (
                    <Send className="w-3.5 h-3.5 shrink-0" />
                  )}
                  <span>{service.ctaText || "Join Community"}</span>
                  <ArrowRight className="w-3.5 h-3.5 shrink-0 opacity-70 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
