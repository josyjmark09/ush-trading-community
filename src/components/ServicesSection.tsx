import React from 'react';
import { 
  GraduationCap, 
  Crown, 
  Zap, 
  Briefcase, 
  TrendingUp, 
  Users, 
  CheckCircle2, 
  AlertCircle,
  ShieldCheck,
} from 'lucide-react';
import { useSite } from '../context/SiteContext';

interface ServicesSectionProps {
  onOpenTelegram?: () => void;
  onOpenContact?: () => void;
  onOpenVipGuide?: () => void;
}

const getServiceIcon = (iconName?: string) => {
  switch (iconName) {
    case 'GraduationCap':
      return <GraduationCap className="w-5 h-5 text-[#0053CF]" />;
    case 'Crown':
      return <Crown className="w-5 h-5 text-[#0053CF]" />;
    case 'Zap':
      return <Zap className="w-5 h-5 text-[#0053CF]" />;
    case 'Briefcase':
      return <Briefcase className="w-5 h-5 text-[#0053CF]" />;
    case 'TrendingUp':
      return <TrendingUp className="w-5 h-5 text-[#0053CF]" />;
    case 'Users':
    default:
      return <Users className="w-5 h-5 text-[#0053CF]" />;
  }
};

export const ServicesSection: React.FC<ServicesSectionProps> = () => {
  const { settings } = useSite();
  const servicesConfig = settings.services;

  if (!servicesConfig || !servicesConfig.services || servicesConfig.services.length === 0) {
    return null;
  }

  return (
    <section id="services" className="px-3 sm:px-6 md:px-8 max-w-[1200px] mx-auto w-full scroll-mt-24">
      {/* Section Header */}
      <div className="text-center flex flex-col items-center justify-center mb-6 sm:mb-12 space-y-2 sm:space-y-3 max-w-3xl mx-auto">
        <span className="inline-flex items-center gap-1.5 bg-blue-50 border border-blue-200/80 text-[#0053CF] font-inter text-[11px] sm:text-[12px] font-black px-3 py-1 rounded-md uppercase tracking-wider">
          <ShieldCheck className="w-3.5 h-3.5" />
          {servicesConfig.badgeText || servicesConfig.sectionBadge || "OUR SERVICES"}
        </span>
        <h2 className="font-manrope text-[24px] sm:text-[34px] md:text-[40px] font-black text-slate-900 leading-tight">
          {servicesConfig.title || "Our Services"}
        </h2>
        <p className="font-inter text-[13px] sm:text-[15.5px] text-slate-600 leading-relaxed text-center px-1">
          {servicesConfig.subtitle}
        </p>
      </div>

      {/* 6 Services Clean Cards Grid (No bottom CTA button, matching design) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {servicesConfig.services.map((service, index) => (
          <div
            key={service.id || index}
            className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:border-[#0053CF]/40 hover:shadow-xs transition-all duration-300 p-4 sm:p-6 flex flex-col justify-start"
          >
            {/* Top Row: Icon and Luxury Editorial Number */}
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-50 border border-blue-100/80 flex items-center justify-center shrink-0">
                {getServiceIcon(service.icon)}
              </div>
              <span className="font-luxury text-[24px] sm:text-[30px] font-normal text-slate-300 group-hover:text-[#0053CF]/70 transition-colors select-none tracking-tight">
                {service.number || `0${index + 1}`}
              </span>
            </div>

            {/* Title */}
            <h3 className="font-manrope text-[16.5px] sm:text-[18.5px] font-bold text-slate-900 leading-snug">
              {service.title}
            </h3>

            {/* Subtitle */}
            <p className="font-inter text-[12px] sm:text-[13px] font-semibold text-[#0053CF] mt-1 mb-2 leading-snug">
              {service.subtitle}
            </p>

            {/* Description */}
            {service.description ? (
              <p className="font-inter text-[12.5px] sm:text-[13px] text-slate-600 leading-relaxed mb-3 sm:mb-4">
                {service.description}
              </p>
            ) : null}

            {/* Inclusions List */}
            <div className="pt-3 border-t border-slate-100 flex-1">
              <div className="font-inter text-[11px] sm:text-[11.5px] font-extrabold uppercase tracking-wider text-slate-400 mb-2">
                {service.includedTitle || "What’s included:"}
              </div>
              <ul className="space-y-1.5 sm:space-y-2">
                {service.inclusions.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-[12px] sm:text-[12.5px] text-slate-700 font-inter leading-snug">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#0053CF] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Disclaimer Callout (For Signals & Consultation) */}
            {service.disclaimer && (
              <div className="mt-4 p-2.5 rounded-lg bg-amber-50/70 border border-amber-200/70 text-amber-900 text-[11px] sm:text-[11.5px] font-inter flex items-start gap-2 leading-relaxed">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                <span>{service.disclaimer}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};
