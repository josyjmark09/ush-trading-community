import React, { useState } from 'react';
import { 
  Users, 
  Send, 
  ShieldCheck, 
  ExternalLink, 
  CheckCircle, 
  ArrowRight, 
  Gavel, 
  Search, 
  HelpCircle, 
  ChevronDown, 
  MessageCircleQuestion, 
  Activity, 
  TrendingUp, 
  BookOpen, 
  Award, 
  Target, 
  Compass, 
  Lock 
} from 'lucide-react';
import { useSite } from '../context/SiteContext';
import { LiveQuotesTicker } from './LiveQuotesTicker';
import { ReviewsSection } from './ReviewsSection';
import { APP_IMAGES } from '../data/mockData';
import chartImage2 from './image 2.png';
import chartImage3 from './image 3.png';

interface HomeViewProps {
  onOpenTelegram: () => void;
  onOpenBroker: () => void;
  onOpenContact: () => void;
  onOpenVipGuide?: () => void;
}

const getFeatureIcon = (iconName?: string) => {
  switch (iconName) {
    case 'trending-up':
      return <TrendingUp className="w-5 h-5 text-[#0053CF]" />;
    case 'activity':
      return <Activity className="w-5 h-5 text-[#0053CF]" />;
    case 'book-open':
      return <BookOpen className="w-5 h-5 text-[#0053CF]" />;
    case 'users':
      return <Users className="w-5 h-5 text-[#0053CF]" />;
    case 'award':
      return <Award className="w-5 h-5 text-[#0053CF]" />;
    case 'target':
      return <Target className="w-5 h-5 text-[#0053CF]" />;
    case 'compass':
      return <Compass className="w-5 h-5 text-[#0053CF]" />;
    case 'shield':
    default:
      return <ShieldCheck className="w-5 h-5 text-[#0053CF]" />;
  }
};

const getValueIcon = (iconName?: string) => {
  switch (iconName) {
    case 'target':
      return <Target className="w-5 h-5" />;
    case 'shield':
      return <ShieldCheck className="w-5 h-5" />;
    case 'compass':
      return <Compass className="w-5 h-5" />;
    case 'award':
    default:
      return <Award className="w-5 h-5" />;
  }
};

const ExnessLogo: React.FC<{ className?: string; size?: 'sm' | 'md' | 'lg' }> = ({ className = '', size = 'md' }) => {
  const iconDimensions = size === 'lg' ? 'w-8 h-8' : size === 'sm' ? 'w-5 h-5' : 'w-6 h-6';
  const textStyles = size === 'lg' ? 'text-[22px] tracking-tight' : size === 'sm' ? 'text-[15px]' : 'text-[18px]';

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      <div className={`${iconDimensions} bg-[#FFD400] rounded-md flex items-center justify-center p-1 shadow-xs shrink-0`}>
        <div className="w-full h-full bg-[#111111] rounded-sm flex items-center justify-center">
          <span className="text-[#FFD400] font-black text-[13px] leading-none tracking-tighter">e</span>
        </div>
      </div>
      <span className={`font-manrope font-black text-[#111111] leading-none ${textStyles}`}>
        exness
      </span>
    </div>
  );
};

const ExnessBrandCard: React.FC = () => {
  const { settings } = useSite();
  const partnerLink = settings.broker?.affiliateUrl || settings.vipGuide?.partnerLink || "https://one.exnessonelink.com/a/yxxz5mlw1n";

  return (
    <a
      href={partnerLink}
      target="_blank"
      rel="noreferrer"
      className="group relative block w-full aspect-[16/9] rounded-xl overflow-hidden bg-slate-900 border border-slate-700 shadow-sm hover:border-[#0053CF] transition-colors"
    >
      <img
        src={settings.broker?.brokerCardImageUrl || APP_IMAGES.brokerCharts}
        alt="Exness Trading Terminal"
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-5">
        <div className="flex items-center gap-2 text-white font-manrope font-bold text-[16px]">
          <span>Trade on Exness Terminal</span>
          <ExternalLink className="w-4 h-4 text-[#FFD400]" />
        </div>
        <p className="text-[12px] text-slate-300 font-inter mt-1">
          Zero-spread raw liquidity with sub-millisecond execution.
        </p>
      </div>
    </a>
  );
};

export const HomeView: React.FC<HomeViewProps> = ({
  onOpenTelegram,
  onOpenBroker,
  onOpenContact,
  onOpenVipGuide,
}) => {
  const { settings } = useSite();
  const [activeFaqCategory, setActiveFaqCategory] = useState<string>('All');
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>(null);
  const [faqSearchQuery, setFaqSearchQuery] = useState<string>('');

  const faqCategories = ['All', 'Community', 'Broker', 'Trading', 'General'];

  const filteredFaqs = (settings.faqs || []).filter((faq) => {
    const matchesCategory = activeFaqCategory === 'All' || faq.category === activeFaqCategory;
    const matchesSearch = 
      faq.question.toLowerCase().includes(faqSearchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(faqSearchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleHeroCta1 = () => {
    if (onOpenVipGuide) {
      onOpenVipGuide();
    } else {
      onOpenTelegram();
    }
  };

  const handleHeroCta2 = () => {
    onOpenBroker();
  };

  const handleCommunityCta = () => {
    if (onOpenVipGuide) {
      onOpenVipGuide();
    } else {
      onOpenTelegram();
    }
  };

  const handleBrokerAccountCta = () => {
    const link = settings.broker?.affiliateUrl || settings.vipGuide?.partnerLink;
    if (link) {
      window.open(link, '_blank', 'noopener,noreferrer');
    } else {
      onOpenBroker();
    }
  };

  const handleBrokerHelpCta = () => {
    const link = settings.vipGuide?.vipTelegramUrl || settings.social?.telegramUrl;
    if (link) {
      window.open(link, '_blank', 'noopener,noreferrer');
    } else {
      onOpenTelegram();
    }
  };

  return (
    <div className="w-full flex flex-col pt-0 sm:pt-1 pb-16">
      
      {/* 1. Live Market Ticker Bar */}
      <LiveQuotesTicker />

      {/* 2. Hero Section */}
      <section id="hero" className="relative px-4 sm:px-6 md:px-8 max-w-[1200px] mx-auto w-full flex flex-col items-center text-center overflow-hidden pt-3 sm:pt-6 pb-8 md:pb-12 mb-10 sm:mb-14 md:mb-16 scroll-mt-24">
        <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6 md:space-y-7 relative z-10">
          {/* Badge */}
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-slate-100 border border-slate-300 rounded-md text-slate-800 font-inter text-[12px] sm:text-[13px] font-bold">
              <Users className="w-3.5 h-3.5 text-[#0053CF]" />
              <span>
                {settings.hero?.badgeText || "Join 5,000+ Traders"}
              </span>
            </div>
          </div>

          {/* Display Heading */}
          <h1 className="font-manrope text-[32px] sm:text-[44px] md:text-[54px] font-black text-slate-900 leading-[1.2] sm:leading-[1.15] tracking-tight">
            {settings.hero?.headline || settings.hero?.headingLine1 || "Trade With More Clarity."} <br className="hidden sm:inline" />
            <span className="text-[#0053CF] sm:mt-1 inline-block">
              {settings.hero?.highlightText || settings.hero?.headingLine2 || "Learn With a Community."}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="font-inter text-[15px] sm:text-[17px] md:text-[18px] text-slate-600 max-w-2xl mx-auto leading-[1.65] sm:leading-relaxed px-2 sm:px-0">
            {settings.hero?.subtitle}
          </p>

          {/* Action Button */}
          <div className="flex justify-center items-center pt-2 sm:pt-4">
            <button
              onClick={handleHeroCta1}
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 bg-[#0053CF] hover:bg-[#0040A2] text-white px-8 py-3.5 sm:py-4 rounded-lg font-inter text-[15px] sm:text-[16px] font-bold shadow-sm hover:shadow transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>{settings.hero?.cta1Text || settings.hero?.primaryCtaText || "Join Our Free VIP Group"}</span>
            </button>
          </div>
        </div>

        {/* Dashboard Showcase Image */}
        <div className="mt-8 sm:mt-12 md:mt-14 w-full max-w-5xl relative">
          <div className="relative p-2 sm:p-3 rounded-xl bg-white border border-slate-300 shadow-sm overflow-hidden">
            <img
              src={settings.hero?.heroImageUrl || settings.hero?.chartImageUrl || chartImage2}
              alt="Forex Trading Analysis Chart"
              className="w-full h-auto rounded-lg border border-slate-200 object-cover"
              loading="eager"
            />
          </div>
        </div>
      </section>

      {/* 3. Reviews Section */}
      <div id="testimonials" className="scroll-mt-24">
        <ReviewsSection />
      </div>

      {/* 4. Features Grid ("WHAT YOU GET") */}
      <section id="features" className="px-3 sm:px-6 md:px-8 max-w-[1200px] mx-auto w-full scroll-mt-24">
        <div className="text-center mb-6 sm:mb-8 space-y-1">
          <span className="text-[#0053CF] font-inter text-[11px] sm:text-[12.5px] font-extrabold uppercase tracking-wider block">
            {settings.featuresSection?.badgeText || settings.whatYouGet?.badgeText || settings.whatYouGet?.sectionBadge || "WHAT YOU GET"}
          </span>
          <h2 className="font-manrope text-[24px] sm:text-[30px] md:text-[34px] font-black text-slate-900 leading-tight">
            {settings.featuresSection?.title || settings.whatYouGet?.title || "Everything You Need to Become a Better Trader"}
          </h2>
          <p className="font-inter text-[13.5px] sm:text-[15px] text-slate-600 max-w-xl mx-auto px-1">
            {settings.featuresSection?.subtitle || settings.whatYouGet?.subtitle || "No guesswork. Just data-backed execution, disciplined risk rules, and daily mentorship."}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5">
          {(settings.featuresSection?.features || settings.whatYouGet?.features || []).map((feat) => (
            <div
              key={feat.id}
              className="bg-white p-4 sm:p-5.5 rounded-xl border border-slate-300 shadow-xs hover:border-[#0053CF] transition-colors flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center bg-slate-100 text-[#0053CF]">
                  {getFeatureIcon(feat.icon)}
                </div>
                <h3 className="font-manrope text-[15px] sm:text-[17px] font-black text-slate-900 leading-snug">
                  {feat.title}
                </h3>
                <p className="font-inter text-[13px] sm:text-[13.5px] text-slate-600 leading-relaxed">
                  {feat.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Distinct Spacer */}
      <div className="my-8 sm:my-12 md:my-14" />

      {/* 5. Community Spotlight Banner */}
      <section className="px-3 sm:px-6 md:px-8 max-w-[1200px] mx-auto w-full">
        <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-300 shadow-xs p-4 sm:p-8 md:p-10 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
          {/* Left Column Info */}
          <div className="lg:col-span-6 space-y-3 sm:space-y-4 text-left">
            <span className="inline-block bg-slate-100 border border-slate-300 text-slate-900 font-inter text-[11px] sm:text-[12px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider">
              {settings.community?.badgeText || settings.community?.sectionBadge || "COMMUNITY HIGHLIGHT"}
            </span>
            <h2 className="font-manrope text-[24px] sm:text-[30px] md:text-[34px] font-black text-slate-900 leading-tight">
              {settings.community?.title || "Daily Institutional Analysis Direct to Your Phone"}
            </h2>
            <p className="font-inter text-[13.5px] sm:text-[15px] text-slate-600 leading-relaxed">
              {settings.community?.description || "Stop trading in isolation. Get daily key level breakdowns, London & New York session plans, live trade recaps, and weekly macro analysis inside the official VIP group."}
            </p>

            <ul className="space-y-1.5 sm:space-y-2 font-inter text-[13px] sm:text-[14px] text-slate-800 pt-0.5">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#0053CF] shrink-0" />
                <span>Morning session bias & key liquidity pools</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#0053CF] shrink-0" />
                <span>High-probability SMC setups with defined invalidation</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#0053CF] shrink-0" />
                <span>100% Free access via our official broker partnership</span>
              </li>
            </ul>

            <div className="pt-1.5 sm:pt-2">
              <button
                onClick={handleCommunityCta}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#0053CF] hover:bg-[#0040A2] text-white px-6 sm:px-7 py-2.5 sm:py-3 rounded-lg font-inter text-[14px] font-bold shadow-xs transition-colors cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>{settings.community?.ctaText || "Join Our Free VIP Group"}</span>
              </button>
            </div>
          </div>

          {/* Right Column Chart Image */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="w-full max-w-lg rounded-xl overflow-hidden border border-slate-300 shadow-xs bg-white p-1.5 sm:p-2.5">
              <img
                src={settings.community?.communityImageUrl || settings.community?.chartImageUrl || chartImage3}
                alt="Forex Technical Analysis Chart"
                className="w-full h-auto rounded-lg object-cover border border-slate-200"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Distinct Spacer */}
      <div className="my-8 sm:my-12 md:my-14" />

      {/* 6. ABOUT Section */}
      <section id="about" className="px-3 sm:px-6 md:px-8 max-w-[1200px] mx-auto w-full scroll-mt-24">
        <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-300 shadow-xs p-4 sm:p-8 md:p-10">
          <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 lg:gap-12 items-center mb-6 sm:mb-8">
            {/* Left Column Story */}
            <div className="flex-1 space-y-3 sm:space-y-4 text-left">
              <span className="inline-block bg-slate-100 border border-slate-300 text-slate-900 font-inter text-[11px] sm:text-[12px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider">
                {settings.about?.badgeText || settings.about?.sectionBadge || "ABOUT US"}
              </span>
              <h2 className="font-manrope text-[24px] sm:text-[30px] md:text-[36px] font-black text-slate-900 leading-tight">
                {settings.about?.headline || settings.about?.title || "Built by Traders. Driven by Discipline."}
              </h2>
              <p className="font-inter text-[13.5px] sm:text-[15px] text-slate-600 leading-relaxed">
                {settings.about?.storyParagraph1 || settings.about?.description || "U.S.H Forex was established with a singular objective: to cut through the hype of modern retail trading and provide structured, objective analysis grounded in institutional market structure."}
              </p>
              {settings.about?.storyParagraph2 && (
                <p className="font-inter text-[13.5px] sm:text-[15px] text-slate-600 leading-relaxed">
                  {settings.about?.storyParagraph2}
                </p>
              )}

              <div className="pt-1.5 sm:pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
                <button
                  onClick={onOpenTelegram}
                  className="inline-flex items-center justify-center gap-2 bg-[#0053CF] hover:bg-[#0040A2] text-white px-5 py-2.5 rounded-lg font-inter text-[13.5px] font-bold transition-colors cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Join Our Community</span>
                </button>
                <button
                  onClick={onOpenBroker}
                  className="inline-flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-300 px-4 py-2.5 rounded-lg font-inter text-[13.5px] font-bold transition-colors cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 text-[#0053CF]" />
                  <span>Recommended Broker</span>
                </button>
              </div>
            </div>

            {/* Right Column Founder Image */}
            <div className="flex-1 w-full max-w-md">
              <div className="relative w-full aspect-[4/3] rounded-xl p-1.5 sm:p-2 bg-slate-100 border border-slate-300 shadow-sm overflow-hidden">
                <img
                  src={settings.about?.founderImageUrl || APP_IMAGES.founderPortrait}
                  alt="U.S.H Leadership"
                  className="w-full h-full object-cover rounded-lg"
                  loading="lazy"
                />
                <div className="absolute bottom-3 left-3 right-3 bg-white/95 p-2.5 sm:p-3 rounded-lg border border-slate-300 shadow-sm flex items-center justify-between z-10">
                  <div>
                    <div className="font-manrope text-[13px] sm:text-[14px] font-black text-slate-900">
                      {settings.about?.founderLeaderName || settings.about?.leadershipTitle || "USH Trading Desk"}
                    </div>
                    <div className="font-inter text-[11px] sm:text-[11.5px] text-slate-600 font-medium">
                      {settings.about?.founderRole || settings.about?.leadershipRole || "Market Structure & Execution Lead"}
                    </div>
                  </div>
                  <span className="text-[10px] bg-slate-100 border border-slate-300 text-slate-800 px-2 py-0.5 rounded font-black">
                    VERIFIED
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Mission & Values Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-5 pt-4 sm:pt-6 border-t border-slate-200">
            {(settings.about?.values || []).map((val) => (
              <div
                key={val.id}
                className="p-3.5 sm:p-5 rounded-xl border border-slate-300 bg-white hover:border-[#0053CF] transition-colors flex flex-col items-start gap-2"
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center bg-slate-100 text-[#0053CF]">
                  {getValueIcon(val.icon)}
                </div>
                <h3 className="font-manrope text-[15px] sm:text-[17px] font-black text-slate-900">
                  {val.title}
                </h3>
                <p className="font-inter text-[12.5px] sm:text-[13.5px] text-slate-600 leading-relaxed">
                  {val.description}
                </p>
              </div>
            ))}
          </div>

          {/* Philosophy Strip */}
          <div className="mt-5 sm:mt-7 bg-slate-50 rounded-xl p-4 sm:p-6 border border-slate-300 flex flex-col md:flex-row items-center gap-4 sm:gap-5">
            <div className="flex-1 space-y-1 sm:space-y-1.5">
              <h3 className="font-manrope text-[17px] sm:text-[20px] md:text-[22px] font-black text-slate-900">
                {settings.about?.philosophyTitle || "The USH Trading Philosophy"}
              </h3>
              <p className="font-inter text-[13px] sm:text-[14px] text-slate-600 leading-relaxed">
                {settings.about?.philosophyDescription || "Capital preservation precedes capital appreciation. We execute only when liquidity, market structure, and risk-reward dynamically align."}
              </p>
            </div>
            <div className="w-full md:w-60 rounded-lg overflow-hidden border border-slate-300 bg-white shadow-2xs shrink-0">
              <img
                src={settings.about?.philosophyImageUrl || APP_IMAGES.philosophyDashboard}
                alt="Philosophy Terminal"
                className="w-full h-28 sm:h-32 object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Distinct Spacer */}
      <div className="my-8 sm:my-12 md:my-14" />

      {/* 7. Recommended Broker Section */}
      <section id="broker" className="px-3 sm:px-6 md:px-8 max-w-[1200px] mx-auto w-full scroll-mt-24">
        <div className="text-center mb-6 sm:mb-8 space-y-1">
          <span className="text-[#0053CF] font-inter text-[11px] sm:text-[12.5px] font-extrabold uppercase tracking-wider block">
            {settings.broker?.badgeText || settings.broker?.sectionBadge || "RECOMMENDED BROKER"}
          </span>
          <h2 className="font-manrope text-[24px] sm:text-[30px] md:text-[34px] font-black text-slate-900 leading-tight">
            {settings.broker?.title || "Why We Trade With Exness"}
          </h2>
          <p className="font-inter text-[13.5px] sm:text-[15px] text-slate-600 max-w-xl mx-auto px-1">
            {settings.broker?.subtitle || "Fast execution, zero commissions on major pairs, and instant withdrawals ensure our community trades with maximum edge."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-5">
          {/* Main Exness Card */}
          <div className="md:col-span-8 bg-white rounded-xl sm:rounded-2xl border border-slate-300 shadow-xs p-4 sm:p-7 md:p-8 flex flex-col justify-between">
            <div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
                <ExnessLogo size="lg" />
                <div className="flex gap-2">
                  <span className="flex items-center gap-1.5 bg-slate-100 border border-slate-300 text-slate-800 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-md text-[11px] sm:text-[12px] font-bold">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#0053CF]" />
                    <span>Regulated</span>
                  </span>
                  <span className="flex items-center gap-1.5 bg-slate-100 border border-slate-300 text-slate-800 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-md text-[11px] sm:text-[12px] font-bold">
                    <Lock className="w-3.5 h-3.5 text-[#0053CF]" />
                    <span>Trusted</span>
                  </span>
                </div>
              </div>

              {/* Core Benefits */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-5 items-center">
                <div className="lg:col-span-6 space-y-2.5">
                  <h3 className="font-manrope text-[13.5px] sm:text-[14px] font-black text-slate-900 uppercase tracking-wider">
                    Benefits of Trading with Exness
                  </h3>
                  <ul className="space-y-2 font-inter text-[13px] sm:text-[13.5px] text-slate-800">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-[#0053CF] mt-0.5 shrink-0" />
                      <span>Ultra-low raw spreads starting from 0.0 pips</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-[#0053CF] mt-0.5 shrink-0" />
                      <span>Instant 24/7 automated withdrawals</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-[#0053CF] mt-0.5 shrink-0" />
                      <span>0% deposit and withdrawal commission</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-[#0053CF] mt-0.5 shrink-0" />
                      <span>Sub-millisecond execution with zero requotes</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-[#0053CF] mt-0.5 shrink-0" />
                      <span>Multi-regulated Tier-1 security (FCA, CySEC, FSCA)</span>
                    </li>
                  </ul>
                </div>

                {/* Exness Card */}
                <div className="lg:col-span-6">
                  <ExnessBrandCard />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center gap-2.5 sm:gap-3">
              <button
                onClick={handleBrokerAccountCta}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#0053CF] hover:bg-[#0040A2] text-white px-6 sm:px-7 py-2.5 sm:py-3 rounded-lg font-inter text-[13.5px] sm:text-[14.5px] font-bold transition-colors cursor-pointer shadow-xs"
              >
                <span>Open Exness Account</span>
                <ExternalLink className="w-4 h-4" />
              </button>

              <button
                onClick={handleBrokerHelpCta}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-slate-700 hover:text-slate-900 px-3 py-2 font-inter text-[13px] font-bold cursor-pointer"
              >
                <span>Need setup help? Contact Support</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Side Regulation Cards */}
          <div className="md:col-span-4 flex flex-col gap-4">
            <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-300 shadow-xs p-4 sm:p-6 flex flex-col justify-between h-full">
              <div>
                <div className="flex items-center gap-2.5 mb-2.5 text-slate-900">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-slate-100 flex items-center justify-center text-[#0053CF]">
                    <Gavel className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
                  </div>
                  <h3 className="font-manrope text-[17px] sm:text-[19px] font-black">Tier-1 Regulated</h3>
                </div>
                <p className="font-inter text-[13px] text-slate-600 leading-relaxed mb-3">
                  Multi-regulated and globally compliant, ensuring segregated client accounts and strict financial auditing.
                </p>
              </div>

              <div className="flex items-center gap-2 pt-2.5 border-t border-slate-200">
                <span className="bg-slate-100 border border-slate-300 px-2.5 py-1 rounded-md text-[11.5px] font-black text-slate-900">
                  FCA
                </span>
                <span className="bg-slate-100 border border-slate-300 px-2.5 py-1 rounded-md text-[11.5px] font-black text-slate-900">
                  CySEC
                </span>
                <span className="bg-slate-100 border border-slate-300 px-2.5 py-1 rounded-md text-[11.5px] font-black text-slate-900">
                  FSCA
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Distinct Spacer */}
      <div className="my-8 sm:my-12 md:my-14" />

      {/* 8. FAQ Section */}
      <section id="faq" className="px-3 sm:px-6 md:px-8 max-w-[1000px] mx-auto w-full scroll-mt-24">
        <div className="text-center mb-6 sm:mb-7 space-y-1">
          <span className="text-[#0053CF] font-inter text-[11px] sm:text-[12.5px] font-extrabold uppercase tracking-wider block">
            {settings.faqSection?.badgeText || settings.faqSection?.sectionBadge || "FAQ"}
          </span>
          <h2 className="font-manrope text-[24px] sm:text-[30px] md:text-[34px] font-black text-slate-900 leading-tight">
            {settings.faqSection?.title || "Frequently Asked Questions"}
          </h2>
          <p className="font-inter text-[13.5px] sm:text-[15px] text-slate-600 max-w-xl mx-auto px-1">
            {settings.faqSection?.subtitle || "Everything you need to know about our community, VIP channel, broker partnership, and setup process."}
          </p>
        </div>

        {/* Search & Category Filter */}
        <div className="space-y-3 mb-5">
          <div className="relative max-w-md mx-auto">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search questions..."
              value={faqSearchQuery}
              onChange={(e) => setFaqSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-300 focus:border-[#0053CF] rounded-lg pl-9 pr-3.5 py-2 text-[13px] text-slate-900 placeholder-slate-400 outline-none shadow-2xs font-inter"
            />
          </div>

          <div className="flex gap-1.5 justify-center flex-wrap">
            {faqCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFaqCategory(cat)}
                className={`px-2.5 py-1 rounded-md text-[11.5px] font-bold font-inter transition-colors cursor-pointer ${
                  activeFaqCategory === cat
                    ? 'bg-[#0053CF] text-white shadow-2xs'
                    : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Accordion list */}
        <div className="space-y-2 sm:space-y-2.5">
          {filteredFaqs.length === 0 ? (
            <div className="bg-white p-6 sm:p-8 rounded-xl text-center border border-slate-300 text-slate-600">
              <HelpCircle className="w-7 h-7 text-slate-400 mx-auto mb-2" />
              <p className="font-bold text-slate-900 text-[14px] sm:text-[15px]">No questions found</p>
              <p className="text-[12.5px] mt-1 text-slate-500">Try another keyword or select All categories.</p>
            </div>
          ) : (
            filteredFaqs.map((faq) => {
              const isExpanded = expandedFaqId === faq.id;
              return (
                <div
                  key={faq.id}
                  className="bg-white rounded-lg sm:rounded-xl border border-slate-300 overflow-hidden shadow-2xs"
                >
                  <button
                    onClick={() => setExpandedFaqId(isExpanded ? null : faq.id)}
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

        {/* Support contact bar */}
        <div className="mt-6 sm:mt-8 bg-slate-100 border border-slate-300 rounded-xl p-4 sm:p-5 text-center">
          <h4 className="font-manrope text-[15px] sm:text-[16px] font-black text-slate-900 mb-1">
            Have a question that's not answered here?
          </h4>
          <p className="font-inter text-[12.5px] sm:text-[13.5px] text-slate-600 mb-3">
            Reach out to our team directly and we'll assist you with setup or community questions.
          </p>
          <button
            onClick={onOpenContact}
            className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-900 border border-slate-300 font-inter text-[12.5px] sm:text-[13px] font-bold px-3.5 py-2 rounded-md transition-colors shadow-2xs cursor-pointer"
          >
            <MessageCircleQuestion className="w-4 h-4 text-[#0053CF]" />
            <span>Contact Support Desk</span>
          </button>
        </div>
      </section>

    </div>
  );
};
