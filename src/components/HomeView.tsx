import React from 'react';
import { NavTab } from '../types';
import { useLiveForexQuotes } from '../hooks/useLiveForexQuotes';
import { useSite } from '../context/SiteContext';
import { ReviewsSection } from './ReviewsSection';
import { APP_IMAGES } from '../data/mockData';
import chartImage2 from './image 2.png';
import chartImage3 from './image 3.png';

import { 
  Users, 
  Send, 
  ArrowRight, 
  TrendingUp, 
  GraduationCap, 
  MessageSquare, 
  ShieldCheck, 
  ExternalLink,
  Eye,
  Award,
  BookOpen,
  Gavel,
  Lock,
  CheckCircle,
  HelpCircle,
  Search,
  MessageCircleQuestion,
  ChevronDown
} from 'lucide-react';

interface HomeViewProps {
  setActiveTab: (tab: NavTab) => void;
  onOpenTelegram: () => void;
  onOpenBroker: () => void;
  onOpenContact: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  setActiveTab,
  onOpenTelegram,
  onOpenBroker,
  onOpenContact,
}) => {
  const { settings } = useSite();
  const liveQuotes = useLiveForexQuotes();

  // FAQ interactive state
  const [activeFaqCategory, setActiveFaqCategory] = React.useState<string>('All');
  const [expandedFaqId, setExpandedFaqId] = React.useState<string | null>(settings.faqs[0]?.id || 'faq-1');
  const [faqSearch, setFaqSearch] = React.useState<string>('');

  const faqCategories = ['All', 'Community', 'Broker', 'Trading', 'General'];

  const filteredFaqs = (settings.faqs || []).filter((faq) => {
    const matchesCategory = activeFaqCategory === 'All' || faq.category === activeFaqCategory;
    const matchesSearch = 
      faq.question.toLowerCase().includes(faqSearch.toLowerCase()) ||
      faq.answer.toLowerCase().includes(faqSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getFeatureIcon = (iconName: string) => {
    switch (iconName) {
      case 'TrendingUp':
        return <TrendingUp className="w-6 h-6 text-[#0053CF]" />;
      case 'GraduationCap':
        return <GraduationCap className="w-6 h-6 text-[#0053CF]" />;
      case 'MessageSquare':
        return <MessageSquare className="w-6 h-6 text-[#0053CF]" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-6 h-6 text-[#0053CF]" />;
      default:
        return <TrendingUp className="w-6 h-6 text-[#0053CF]" />;
    }
  };

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

  const handleHeroCta1 = () => {
    const link = settings.hero?.cta1Link || settings.hero?.primaryCtaLink;
    if (link && link !== '#') {
      window.open(link, '_blank', 'noopener,noreferrer');
    } else {
      onOpenTelegram();
    }
  };

  const handleHeroCta2 = () => {
    const link = settings.hero?.cta2Link || settings.hero?.secondaryCtaLink;
    if (link && link.startsWith('http')) {
      window.open(link, '_blank', 'noopener,noreferrer');
    } else {
      onOpenBroker();
    }
  };

  const handleCommunityCta = () => {
    const link = settings.community?.ctaLink;
    if (link && link !== '#') {
      window.open(link, '_blank', 'noopener,noreferrer');
    } else {
      onOpenTelegram();
    }
  };

  const handleBrokerAccountCta = () => {
    const link = settings.broker?.accountLink || settings.broker?.createAccountCtaLink || settings.broker?.partnerLink;
    if (link && link !== '#') {
      window.open(link, '_blank', 'noopener,noreferrer');
    } else {
      onOpenBroker();
    }
  };

  const handleBrokerHelpCta = () => {
    const link = settings.broker?.helpLink || settings.broker?.supportHelpCtaLink;
    if (link && link !== '#') {
      window.open(link, '_blank', 'noopener,noreferrer');
    } else {
      onOpenTelegram();
    }
  };

  return (
    <div className="w-full flex flex-col pt-0 sm:pt-1 pb-16">
      
      {/* 1. Live Market Ticker Bar */}
      <div className="bg-white/90 backdrop-blur-md border border-[#E2E8F0] rounded-xl py-2 px-2 shadow-xs max-w-[1200px] mx-auto w-full overflow-hidden animate-soft-entry mb-3 sm:mb-6 md:mb-8">
        <div className="relative w-full overflow-hidden ticker-fade-mask">
          <div className="animate-ticker-continuous flex items-center gap-10 text-[13px] font-inter">
            {[...liveQuotes, ...liveQuotes].map((q, idx) => (
              <div
                key={`${q.pair}-${idx}`}
                className="flex items-center gap-2.5 shrink-0 hover:bg-[#F1F4F9]/80 px-3 py-1.5 rounded-lg transition-colors cursor-default select-none"
              >
                <span className="font-bold text-[#091C35] tracking-tight">{q.pair}</span>
                <span className="text-[#33373D] font-mono text-[12px] font-medium">
                  {q.bid.toLocaleString(undefined, {
                    minimumFractionDigits: q.pair.includes('JPY') || q.pair.includes('XAU') || q.pair.includes('BTC') || q.pair.includes('US') || q.pair.includes('NAS') ? 2 : 4,
                    maximumFractionDigits: q.pair.includes('JPY') || q.pair.includes('XAU') || q.pair.includes('BTC') || q.pair.includes('US') || q.pair.includes('NAS') ? 2 : 4,
                  })}
                </span>
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded transition-all duration-300 ${
                    q.direction === 'up'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                      : 'bg-rose-50 text-rose-700 border border-rose-200/60'
                  }`}
                >
                  {q.change >= 0 ? `+${q.change.toFixed(2)}%` : `${q.change.toFixed(2)}%`}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Hero Section */}
      <section id="hero" className="relative px-4 md:px-8 max-w-[1200px] mx-auto w-full flex flex-col items-center text-center overflow-hidden pt-0 sm:pt-2 pb-6 md:pb-10 mb-10 md:mb-16 scroll-mt-24">
        <div className="absolute inset-0 grid-bg-subtle -z-20 pointer-events-none opacity-30" />

        <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6 animate-soft-entry relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 bg-[#0053CF] border border-[#116AFE] rounded-full text-[#D5E3FF] font-inter text-[12px] sm:text-[13px] font-semibold mb-1 shadow-md shadow-blue-600/20 shine-effect animate-stagger-1">
            <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#93C5FD]" />
            <span className="text-[#BAE6FD] font-semibold tracking-wide">
              {settings.hero?.badgeText || "Join 5,000+ Traders"}
            </span>
          </div>

          {/* Display Heading */}
          <h1 className="font-manrope text-[36px] sm:text-[44px] md:text-[54px] font-extrabold text-[#091C35] leading-[1.12] tracking-tight animate-stagger-2">
            {settings.hero?.headline || settings.hero?.headingLine1 || "Trade With More Clarity."} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0053CF] via-[#116AFE] to-[#001B3D]">
              {settings.hero?.highlightText || settings.hero?.headingLine2 || "Learn With a Community."}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="font-inter text-[16px] sm:text-[18px] text-[#44474D] max-w-2xl mx-auto leading-relaxed animate-stagger-3">
            {settings.hero?.subtitle}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4 animate-stagger-3">
            <button
              onClick={handleHeroCta1}
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 bg-gradient-to-r from-[#116AFE] to-[#0053CF] hover:from-[#0053CF] hover:to-[#0040A2] text-white px-8 py-4 rounded-xl font-inter text-[15px] font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 cursor-pointer glow-blue shine-effect"
            >
              <Send className="w-4 h-4" />
              <span>{settings.hero?.cta1Text || settings.hero?.primaryCtaText || "Join the Telegram Community"}</span>
            </button>
            <button
              onClick={handleHeroCta2}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white hover:bg-[#F1F4F9] text-[#091C35] border border-[#C5C6CE] px-8 py-4 rounded-xl font-inter text-[15px] font-semibold shadow-sm hover:shadow transition-all duration-200 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-[#0053CF]" />
              <span>{settings.hero?.cta2Text || settings.hero?.secondaryCtaText || "Recommended Broker Setup"}</span>
            </button>
          </div>
        </div>

        {/* Dashboard Showcase Image */}
        <div className="mt-12 md:mt-16 w-full max-w-5xl relative group animate-soft-entry">
          <div className="relative p-2 sm:p-3 rounded-2xl bg-white border border-[#D5E3FF] shadow-xl overflow-hidden">
            <img
              src={settings.hero?.heroImageUrl || settings.hero?.chartImageUrl || chartImage2}
              alt="Forex Trading Analysis Chart"
              className="w-full h-auto rounded-xl border border-[#E2E8F0] object-cover"
              loading="eager"
            />
          </div>
        </div>
      </section>

      {/* 3. Reviews & Feedback Carousel (Right under Hero, before WHAT YOU GET) */}
      <div id="testimonials" className="scroll-mt-24">
        <ReviewsSection />
      </div>

      {/* 4. Features Grid ("WHAT YOU GET" - Informational Only without 'Learn more') */}
      <section id="features" className="px-4 md:px-8 max-w-[1200px] mx-auto w-full scroll-mt-24">
        <div className="text-center mb-10 space-y-2">
          <span className="text-[#0053CF] font-inter text-[13px] font-bold uppercase tracking-wider block">
            {settings.featuresSection?.badgeText || settings.whatYouGet?.badgeText || settings.whatYouGet?.sectionBadge || "WHAT YOU GET"}
          </span>
          <h2 className="font-manrope text-[28px] sm:text-[34px] font-bold text-[#091C35]">
            {settings.featuresSection?.title || settings.whatYouGet?.title || "Everything You Need to Become a Better Trader"}
          </h2>
          {(settings.featuresSection?.subtitle || settings.whatYouGet?.subtitle) && (
            <p className="font-inter text-[15px] text-[#44474D] max-w-xl mx-auto">
              {settings.featuresSection?.subtitle || settings.whatYouGet?.subtitle}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {(settings.features || settings.whatYouGet?.features || []).map((feature) => (
            <div
              key={feature.id}
              className="glass-card bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-sm flex flex-col justify-start group hover:border-[#B2C5FF] hover:shadow-md transition-all duration-200"
            >
              <div className="w-12 h-12 rounded-xl bg-[#EBF3FF] flex items-center justify-center text-[#0053CF] mb-4 group-hover:bg-[#DAE2FF] transition-colors shrink-0">
                {getFeatureIcon(feature.icon)}
              </div>
              <h3 className="font-manrope text-[18px] font-bold text-[#091C35] mb-2">
                {feature.title}
              </h3>
              <p className="font-inter text-[14px] text-[#44474D] leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Distinct Spacer Gap as requested */}
      <div className="my-10 sm:my-14" />

      {/* 5. Deep Dive Section ("COMMUNITY") */}
      <section id="community" className="bg-white text-[#091C35] py-12 md:py-16 px-6 md:px-10 relative overflow-hidden rounded-3xl mx-4 md:mx-8 max-w-[1200px] xl:mx-auto border border-[#E2E8F0] shadow-sm scroll-mt-24">
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column Text */}
          <div className="lg:col-span-6 space-y-6">
            <span className="inline-block text-[#0053CF] font-inter text-[12px] font-bold uppercase tracking-wider bg-[#EBF3FF] border border-[#D5E3FF] px-3.5 py-1 rounded-full">
              {settings.community?.badgeText || settings.community?.sectionBadge || "COMMUNITY"}
            </span>
            <h2 className="font-manrope text-[32px] sm:text-[38px] font-extrabold leading-[1.2] text-[#091C35] tracking-tight">
              {settings.community?.headline || settings.community?.titleLine1 || "More Than Signals."} <br />
              <span className="text-[#0053CF]">{settings.community?.highlightText || settings.community?.titleHighlight || "A Community Built Around The Market."}</span>
            </h2>
            <p className="font-inter text-[15px] sm:text-[16px] text-[#44474D] leading-relaxed">
              {settings.community?.subtitle || settings.community?.description}
            </p>

            <div className="pt-2">
              <button
                onClick={handleCommunityCta}
                className="flex items-center justify-center gap-2.5 bg-[#0053CF] hover:bg-[#0040A2] text-white px-8 py-4 rounded-xl font-inter text-[15px] font-semibold glow-blue hover:-translate-y-0.5 transition-all duration-200 shadow-md cursor-pointer w-full sm:w-auto"
              >
                <span>{settings.community?.ctaText || "Join the Telegram Community"}</span>
                <Send className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[#E5E8ED] text-center sm:text-left">
              <div>
                <div className="font-manrope text-[24px] font-bold text-[#091C35]">
                  {settings.community?.stat1Number || settings.community?.stats?.[0]?.number || "5,000+"}
                </div>
                <div className="text-[12px] text-[#75777E]">
                  {settings.community?.stat1Label || settings.community?.stats?.[0]?.label || "Community Members"}
                </div>
              </div>
              <div>
                <div className="font-manrope text-[24px] font-bold text-[#091C35]">
                  {settings.community?.stat2Number || settings.community?.stats?.[1]?.number || "Daily"}
                </div>
                <div className="text-[12px] text-[#75777E]">
                  {settings.community?.stat2Label || settings.community?.stats?.[1]?.label || "Market Breakdowns"}
                </div>
              </div>
              <div>
                <div className="font-manrope text-[24px] font-bold text-[#0053CF]">
                  {settings.community?.stat3Number || settings.community?.stats?.[2]?.number || "100%"}
                </div>
                <div className="text-[12px] text-[#75777E]">
                  {settings.community?.stat3Label || settings.community?.stats?.[2]?.label || "Free Telegram Channel"}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column Forex Chart Image */}
          <div className="lg:col-span-6 relative flex justify-center">
            <div className="relative w-full max-w-lg rounded-2xl overflow-hidden border border-[#D5E3FF] shadow-lg bg-white p-2 sm:p-3">
              <img
                src={settings.community?.communityImageUrl || settings.community?.chartImageUrl || chartImage3}
                alt="Forex Technical Analysis Chart"
                className="w-full h-auto rounded-xl object-cover border border-[#E2E8F0]"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Distinct Spacer Gap as requested */}
      <div className="my-10 sm:my-14" />

      {/* 6. ABOUT Section (Right after Community, as specifically instructed) */}
      <section id="about" className="px-4 md:px-8 max-w-[1200px] mx-auto w-full scroll-mt-24">
        <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-sm p-6 sm:p-10 md:p-12">
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-14 items-center mb-12">
            {/* Left Column Story */}
            <div className="flex-1 space-y-5 text-left">
              <span className="inline-block bg-[#D5E3FF] text-[#0040A2] font-inter text-[12px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                {settings.about?.badgeText || settings.about?.sectionBadge || "ABOUT US"}
              </span>
              <h2 className="font-manrope text-[32px] sm:text-[40px] md:text-[46px] font-extrabold text-[#091C35] leading-[1.15] tracking-tight">
                {settings.about?.headline || settings.about?.title || "Built For Serious, Disciplined Market Traders"} <br />
                <span className="text-[#0053CF]">{settings.about?.highlightText || settings.about?.subtitle || "Precision, Integrity & Risk Control"}</span>
              </h2>
              <p className="font-inter text-[16px] text-[#44474D] leading-relaxed">
                {settings.about?.storyParagraph || settings.about?.missionP1}
              </p>
              <div className="pt-2 flex flex-wrap gap-4">
                <button
                  onClick={onOpenTelegram}
                  className="flex items-center gap-2 bg-[#116AFE] hover:bg-[#0053CF] text-white px-6 py-3.5 rounded-xl font-inter text-[14px] font-semibold glow-blue transition-all active:scale-95 cursor-pointer shadow-md"
                >
                  <Send className="w-4 h-4" />
                  <span>Join Our Telegram</span>
                </button>
                <button
                  onClick={onOpenBroker}
                  className="flex items-center gap-2 bg-white hover:bg-[#F1F4F9] text-[#091C35] border border-[#C5C6CE] px-6 py-3.5 rounded-xl font-inter text-[14px] font-semibold transition-colors cursor-pointer shadow-xs"
                >
                  <ShieldCheck className="w-4 h-4 text-[#0053CF]" />
                  <span>Recommended Broker</span>
                </button>
              </div>
            </div>

            {/* Right Column Founder Image */}
            <div className="flex-1 w-full max-w-md">
              <div className="relative w-full aspect-[4/3] rounded-2xl p-2 bg-gradient-to-b from-[#116AFE]/25 via-[#0053CF]/15 to-transparent border-2 border-[#116AFE] shadow-xl overflow-hidden shine-effect">
                <img
                  src={settings.about?.founderImageUrl || APP_IMAGES.founderPortrait}
                  alt="U.S.H Leadership"
                  className="w-full h-full object-cover rounded-xl shadow-sm"
                  loading="lazy"
                />
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-3 rounded-xl border border-white/80 shadow-md flex items-center justify-between z-10">
                  <div>
                    <div className="font-manrope text-[14px] font-bold text-[#091C35]">
                      {settings.about?.founderLeaderName || settings.about?.leadershipTitle || "USH Trading Desk"}
                    </div>
                    <div className="font-inter text-[11.5px] text-[#44474D]">
                      {settings.about?.founderRole || settings.about?.leadershipRole || "Market Structure & Execution Lead"}
                    </div>
                  </div>
                  <span className="text-[10.5px] bg-[#EBF3FF] text-[#0053CF] px-2.5 py-1 rounded-full font-bold">
                    VERIFIED
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Mission & Values Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-[#E5E8ED]">
            {(settings.about?.values || []).map((val) => (
              <div
                key={val.id}
                className={`p-6 rounded-2xl border transition-all duration-300 flex flex-col items-start gap-3 ${
                  val.highlight
                    ? 'border-[#116AFE]/40 shadow-sm bg-gradient-to-b from-white to-[#F6F9FE]'
                    : 'border-[#E2E8F0] bg-white hover:border-[#B2C5FF]'
                }`}
              >
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                  val.highlight ? 'bg-[#116AFE]/15 text-[#0053CF]' : 'bg-[#EBEEF3] text-[#0053CF]'
                }`}>
                  {getValueIcon(val.icon)}
                </div>
                <h3 className="font-manrope text-[18px] font-bold text-[#091C35]">
                  {val.title}
                </h3>
                <p className="font-inter text-[14px] text-[#44474D] leading-relaxed">
                  {val.description}
                </p>
              </div>
            ))}
          </div>

          {/* Philosophy Strip */}
          <div className="mt-8 bg-[#F1F4F9] rounded-2xl p-6 md:p-8 border border-[#C5C6CE]/40 flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1 space-y-2">
              <h3 className="font-manrope text-[20px] sm:text-[24px] font-bold text-[#091C35]">
                {settings.about?.philosophyTitle || "The USH Trading Philosophy"}
              </h3>
              <p className="font-inter text-[14.5px] text-[#44474D] leading-relaxed">
                {settings.about?.philosophyDescription || "Capital preservation precedes capital appreciation. We execute only when liquidity, market structure, and risk-reward dynamically align."}
              </p>
            </div>
            <div className="w-full md:w-64 rounded-xl overflow-hidden border border-[#C5C6CE]/50 bg-white shadow-xs shrink-0">
              <img
                src={settings.about?.philosophyImageUrl || APP_IMAGES.philosophyDashboard}
                alt="Philosophy Terminal"
                className="w-full h-36 object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Distinct Spacer Gap as requested */}
      <div className="my-10 sm:my-14" />

      {/* 7. RECOMMENDED BROKER Section (Following About section, as requested) */}
      <section id="broker" className="px-4 md:px-8 max-w-[1200px] mx-auto w-full scroll-mt-24">
        <div className="text-center mb-8 space-y-2">
          <span className="inline-block bg-[#EBF3FF] text-[#0053CF] font-inter text-[12px] font-bold py-1 px-3.5 rounded-full uppercase tracking-wider">
            {settings.broker?.badgeText || settings.broker?.sectionBadge || "RECOMMENDED BROKER"}
          </span>
          <h2 className="font-manrope text-[30px] sm:text-[38px] font-extrabold text-[#091C35] tracking-tight">
            {settings.broker?.headline || settings.broker?.title || "Trade With An Institutional Tier-1 Partner"}
          </h2>
          <p className="font-inter text-[15px] sm:text-[17px] text-[#44474D] max-w-2xl mx-auto leading-relaxed">
            {settings.broker?.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Main Broker Info Card */}
          <div className="md:col-span-8 bg-white rounded-3xl border border-[#E2E8F0] shadow-sm p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden">
            <div className="relative z-10">
              {/* Top row with logo & clean inline status */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-3">
                  <div className="h-12 px-4 flex items-center justify-center bg-[#F1F4F9] rounded-xl border border-[#E2E8F0]">
                    <span className="font-manrope text-[24px] font-extrabold text-[#091C35] tracking-tight">
                      {settings.broker?.brokerName || "Exness"}
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                    {settings.broker?.brokerTag || settings.broker?.partnerTag || "Official Partner Broker"}
                  </span>
                </div>

                <div className="flex gap-2 flex-wrap">
                  <span className="flex items-center gap-1.5 bg-[#EBF3FF] text-[#0053CF] px-3 py-1 rounded-md text-[12px] font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#0053CF]" />
                    <span>Regulated</span>
                  </span>
                  <span className="flex items-center gap-1.5 bg-[#EBF3FF] text-[#0053CF] px-3 py-1 rounded-md text-[12px] font-semibold">
                    <Lock className="w-3.5 h-3.5 text-[#0053CF]" />
                    <span>Trusted</span>
                  </span>
                </div>
              </div>

              {/* Core Features & Platform Image */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 items-center">
                <ul className="space-y-4 font-inter text-[15px] text-[#181C20]">
                  {(settings.broker?.features || settings.broker?.featuresList || []).map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-[#0053CF] mt-0.5 shrink-0" />
                      <span className="font-medium">{feat}</span>
                    </li>
                  ))}
                </ul>

                <div className="relative rounded-2xl overflow-hidden border border-[#E2E8F0] shadow-inner bg-[#091C35] h-48 md:h-full min-h-[170px]">
                  <img
                    src={settings.broker?.brokerImageUrl || APP_IMAGES.brokerCharts}
                    alt="Exness Platform"
                    className="w-full h-full object-cover opacity-85"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#091C35] via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 text-white text-[12px] font-inter">
                    <span className="font-bold">MT4 / MT5 / WebTerminal</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="relative z-10 pt-6 border-t border-[#F1F4F9] flex flex-col sm:flex-row items-center gap-4">
              <button
                onClick={handleBrokerAccountCta}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#0053CF] hover:bg-[#0040A2] text-white px-8 py-3.5 rounded-xl font-inter text-[15px] font-semibold glow-blue transition-all cursor-pointer shadow-md"
              >
                <span>Open {settings.broker?.brokerName || "Exness"} Account</span>
                <ExternalLink className="w-4 h-4" />
              </button>

              <button
                onClick={handleBrokerHelpCta}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-[#44474D] hover:text-[#091C35] px-4 py-2 font-inter text-[14px] font-medium cursor-pointer"
              >
                <span>Need setup help? Contact Support</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Side Regulation & Security Cards */}
          <div className="md:col-span-4 flex flex-col gap-6">
            <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-sm p-6 flex flex-col justify-between h-full hover:shadow-md transition-shadow">
              <div>
                <div className="flex items-center gap-3 mb-3 text-[#091C35]">
                  <div className="w-10 h-10 rounded-xl bg-[#EBF3FF] flex items-center justify-center text-[#0053CF]">
                    <Gavel className="w-5 h-5" />
                  </div>
                  <h3 className="font-manrope text-[20px] font-bold">Tier-1 Regulated</h3>
                </div>
                <p className="font-inter text-[14px] text-[#44474D] leading-relaxed mb-4">
                  Multi-regulated and globally compliant, ensuring segregated client accounts and strict financial auditing.
                </p>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-[#F1F4F9]">
                <span className="bg-[#F1F4F9] border border-[#E5E8ED] px-3 py-1 rounded text-[12px] font-bold text-[#091C35]">
                  FCA
                </span>
                <span className="bg-[#F1F4F9] border border-[#E5E8ED] px-3 py-1 rounded text-[12px] font-bold text-[#091C35]">
                  CySEC
                </span>
                <span className="bg-[#F1F4F9] border border-[#E5E8ED] px-3 py-1 rounded text-[12px] font-bold text-[#091C35]">
                  FSCA
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Distinct Spacer Gap as requested */}
      <div className="my-10 sm:my-14" />

      {/* 8. FAQ Section (Last before footer, as explicitly instructed) */}
      <section id="faq" className="px-4 md:px-8 max-w-[1000px] mx-auto w-full scroll-mt-24">
        <div className="text-center mb-8 space-y-2">
          <span className="inline-block bg-[#EBF3FF] text-[#0053CF] font-inter text-[12px] font-bold py-1 px-3.5 rounded-full uppercase tracking-wider">
            HELP & RESOURCES
          </span>
          <h2 className="font-manrope text-[32px] sm:text-[40px] font-extrabold text-[#091C35] tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="font-inter text-[15px] sm:text-[17px] text-[#44474D] max-w-xl mx-auto leading-relaxed">
            Find quick answers about community access, broker onboarding, and trading discipline.
          </p>

          {/* Search Bar */}
          <div className="mt-6 max-w-md mx-auto relative">
            <Search className="w-4 h-4 text-[#75777E] absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search questions or keywords..."
              value={faqSearch}
              onChange={(e) => setFaqSearch(e.target.value)}
              className="w-full bg-white border border-[#C5C6CE] focus:border-[#0053CF] rounded-xl pl-11 pr-4 py-2.5 text-[13.5px] text-[#181C20] placeholder-[#75777E] outline-hidden shadow-xs focus:ring-2 focus:ring-[#116AFE]/20 transition-all font-inter"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex gap-2 justify-center flex-wrap mb-6">
          {faqCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFaqCategory(cat)}
              className={`px-3.5 py-1.5 rounded-lg font-inter text-[12.5px] font-semibold transition-all cursor-pointer ${
                activeFaqCategory === cat
                  ? 'bg-[#0053CF] text-white shadow-xs'
                  : 'bg-white border border-[#E2E8F0] text-[#44474D] hover:bg-[#F1F4F9]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* FAQ Accordion Items */}
        <div className="space-y-3.5">
          {filteredFaqs.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl text-center border border-[#E2E8F0] text-[#44474D]">
              <HelpCircle className="w-8 h-8 text-[#75777E] mx-auto mb-2" />
              <p className="font-semibold text-[#091C35]">No matching questions found</p>
              <p className="text-[13px] mt-1">Try another search keyword or select All categories.</p>
            </div>
          ) : (
            filteredFaqs.map((faq) => {
              const isExpanded = expandedFaqId === faq.id;
              return (
                <div
                  key={faq.id}
                  className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden transition-all shadow-xs"
                >
                  <button
                    onClick={() => setExpandedFaqId(isExpanded ? null : faq.id)}
                    className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 hover:bg-[#F7FAFF] transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-[10.5px] font-bold text-[#0053CF] bg-[#EBF3FF] px-2 py-0.5 rounded uppercase shrink-0">
                        {faq.category}
                      </span>
                      <span className="font-manrope text-[15px] sm:text-[16px] font-bold text-[#091C35]">
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
                    <div className="px-5 pb-5 pt-1 text-[14px] font-inter text-[#44474D] leading-relaxed border-t border-[#F1F4F9]">
                      <p className="pt-2">{faq.answer}</p>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Still have questions banner */}
        <div className="mt-8 bg-[#F1F4F9] border border-[#E5E8ED] rounded-2xl p-5 text-center">
          <h4 className="font-manrope text-[16px] font-bold text-[#091C35] mb-1">
            Still have questions?
          </h4>
          <p className="font-inter text-[13.5px] text-[#44474D] mb-3">
            Our team and active community moderators are available to help.
          </p>
          <button
            onClick={onOpenContact}
            className="inline-flex items-center gap-2 bg-white hover:bg-[#EBF3FF] text-[#0053CF] border border-[#B2C5FF] font-inter text-[13px] font-semibold px-4 py-2 rounded-lg transition-colors shadow-xs cursor-pointer"
          >
            <MessageCircleQuestion className="w-4 h-4" />
            <span>Contact Support</span>
          </button>
        </div>
      </section>

    </div>
  );
};
