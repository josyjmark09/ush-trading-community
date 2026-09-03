import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  SiteSettings, 
  ReviewItem, 
  FeatureItem, 
  Milestone, 
  PillarItem, 
  FAQItem,
  InboxMessage,
  QuoteGallerySettings,
  QuoteItem
} from '../types';
import { TESTIMONIALS, FAQS, COMMUNITY_FEATURES, MILESTONES, VALUES } from '../data/mockData';
import { DEFAULT_QUOTE_GALLERY_1, DEFAULT_QUOTE_GALLERY_2 } from '../data/quotesData';

const SETTINGS_STORAGE_KEY = 'ush_site_settings_v2';
const REVIEWS_STORAGE_KEY = 'ush_site_reviews_v3';
const MESSAGES_STORAGE_KEY = 'ush_site_messages_v2';

const INITIAL_SAMPLE_MESSAGES: InboxMessage[] = [];

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  branding: {
    brandName: 'Community of Traders',
    tagline: '',
    logoUrl: '',
    logoAltText: 'USH Community of Traders Logo',
    footerDescription: 'A disciplined trading collective dedicated to high-probability market structure, institutional liquidity breakdowns, and consistent risk management.',
    copyrightText: '© 2026 USH Community of Traders. All rights reserved. Forex and CFD trading involves significant risk of loss.',
  },
  hero: {
    badgeText: 'Join 5,000+ Traders',
    badgeSubtext: 'Free VIP Community • Exness Partner Broker',
    headline: 'Trade With More Clarity.',
    highlightText: 'Learn With a Community.',
    headingLine1: 'Trade With More Clarity.',
    headingLine2: 'Learn With a Community.',
    subtitle: 'Practical forex insights, market education and a growing trading community built to help traders approach the markets with greater structure and discipline.',
    cta1Text: 'Join our trading community',
    cta1Link: '',
    cta2Text: 'Recommended Broker Setup',
    cta2Link: 'https://one.exnessonelink.com/a/yxxz5mlw1n',
    primaryCtaText: 'Join our trading community',
    primaryCtaLink: '',
    secondaryCtaText: 'Recommended Broker Setup',
    secondaryCtaLink: 'https://one.exnessonelink.com/a/yxxz5mlw1n',
    heroImageUrl: '',
    chartImageUrl: '',
    stats: [
      { label: 'Free VIP Group Access', text: '100% Free VIP Group Access' },
      { label: 'Zero Markups', text: 'Zero Markups or Hidden Fees' },
      { label: 'Tier-1 Broker', text: 'Regulated Tier-1 Broker' },
    ],
  },
  whatYouGet: {
    sectionBadge: 'WHAT YOU GET',
    badgeText: 'WHAT YOU GET',
    title: 'Everything You Need to Become a Better Trader',
    subtitle: 'Transparent frameworks, structured education, and real-time market updates with no fluff.',
    features: [
      {
        id: 'insights',
        icon: 'TrendingUp',
        title: 'Market Insights & Daily Analysis',
        description: 'Receive structured daily session breakdowns, high-probability liquidity zones, and disciplined invalidation levels across major FX pairs and Gold.',
      },
      {
        id: 'education',
        icon: 'GraduationCap',
        title: 'Systematic Trading Education',
        description: 'Master structured market mechanics, multi-timeframe confirmation, and strict risk-to-reward frameworks engineered for long-term consistency.',
      },
      {
        id: 'community',
        icon: 'MessageSquare',
        title: 'Interactive Trading Community',
        description: 'Connect with dedicated traders sharing objective chart setups, trade management notes, and macroeconomic developments in real time.',
      },
      {
        id: 'broker',
        icon: 'ShieldCheck',
        title: 'Institutional Broker Access',
        description: 'Trade on Exness with institutional raw spreads from 0.0 pips, zero deposit fees, and instant automated withdrawals 24/7.',
      },
    ],
  },
  community: {
    sectionBadge: 'FREE VIP COMMUNITY',
    badgeText: 'FREE VIP COMMUNITY',
    headline: 'More Than Signals.',
    highlightText: 'A Community Built Around The Market.',
    titleLine1: 'More Than Signals.',
    titleHighlight: 'A Community Built Around The Market.',
    subtitle: 'Join our trading community for daily institutional breakdowns, high-probability market structure setups, and direct guidance alongside experienced traders.',
    description: 'Join our trading community for daily institutional breakdowns, high-probability market structure setups, and direct guidance alongside experienced traders.',
    ctaText: 'Join our trading community',
    ctaLink: '',
    communityImageUrl: '',
    chartImageUrl: '',
    stat1Number: '5,000+',
    stat1Label: 'Community Members',
    stat2Number: 'Daily',
    stat2Label: 'Market Breakdowns',
    stat3Number: '100%',
    stat3Label: 'Free Community Access',
    bulletPoints: [
      'Daily session previews across major FX pairs & Gold',
      'Strict risk management rules (1-2% risk per position)',
      'Real-time trade updates and partial profit alerts',
      'Macroeconomic news debriefs before major central bank events',
    ],
    stats: [
      { number: '5,000+', label: 'Community Members' },
      { number: 'Daily', label: 'Market Breakdowns' },
      { number: '100%', label: 'Free Community Access' },
    ],
  },
  broker: {
    sectionBadge: 'RECOMMENDED BROKER',
    badgeText: 'RECOMMENDED BROKER',
    headline: 'Trade With An Institutional Tier-1 Partner',
    title: 'Trade With An Institutional Tier-1 Partner',
    subtitle: 'We partner exclusively with Exness to provide ultra-low raw spreads, lightning execution, and instant automated withdrawals.',
    brokerName: 'Exness',
    brokerTag: 'Official Partner Broker',
    partnerTag: 'Official Partner Broker',
    partnerLink: 'https://one.exnessonelink.com/a/yxxz5mlw1n',
    accountLink: 'https://one.exnessonelink.com/a/yxxz5mlw1n',
    helpLink: 'https://t.me/+wHFuFFkA2i0xZTA8',
    createAccountCtaText: 'Open Exness Account',
    createAccountCtaLink: 'https://one.exnessonelink.com/a/yxxz5mlw1n',
    supportHelpCtaText: 'Get VIP Setup Support on Telegram',
    supportHelpCtaLink: 'https://t.me/+wHFuFFkA2i0xZTA8',
    spreadsText: 'From 0.0 Pips',
    leverageText: 'Up to 1:Unlimited',
    withdrawalsText: 'Instant & Automated 24/7',
    minDepositText: '$10 Standard / $200 Raw',
    brokerImageUrl: '',
    features: [
      'Regulated by FCA (UK), CySEC, FSCA & FSA',
      'Zero markups on raw spread accounts',
      'Sub-millisecond execution with zero requotes',
      'Instant automated withdrawals to local banks & crypto',
      'Negative balance protection on all retail accounts',
    ],
    featuresList: [
      'Regulated by FCA (UK), CySEC, FSCA & FSA',
      'Zero markups on raw spread accounts',
      'Sub-millisecond execution with zero requotes',
      'Instant automated withdrawals to local banks & crypto',
      'Negative balance protection on all retail accounts',
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Register Account',
        description: 'Click our partner link to create your verified Exness trading profile in under 2 minutes.',
      },
      {
        stepNumber: 2,
        title: 'Select Account Type',
        description: 'Choose the Raw Spread or Standard MT4/MT5 account for optimum pricing on FX pairs & Gold.',
      },
      {
        stepNumber: 3,
        title: 'Connect & Trade',
        description: 'Deposit with your preferred method and apply community market setups with maximum execution speed.',
      },
    ],
  },
  vipGuide: {
    title: 'Join our trading community',
    subtitle: 'Follow the instructions below to join our trading community, for both new and already existing Exness users',
    partnerLink: 'https://one.exnessonelink.com/a/yxxz5mlw1n',
    partnerCode: '1046090975706890644',
    vipTelegramUrl: 'https://t.me/+wHFuFFkA2i0xZTA8',
    adminTelegramUser: 'https://t.me/+wHFuFFkA2i0xZTA8',
    supportHelpText: 'Stay on the website until you complete the full registration process.',
  },
  about: {
    sectionBadge: 'ABOUT US',
    badgeText: 'ABOUT US',
    headline: 'Built For Serious, Disciplined Market Traders',
    title: 'Built For Serious, Disciplined Market Traders',
    highlightText: 'Precision, Integrity & Risk Control',
    subtitle: 'We strip away the noise, gimmicks, and unrealistic promises to deliver structured, high-probability market frameworks.',
    storyParagraph: 'USH was founded with a singular mission: to provide real market clarity without the toxic marketing hype prevalent in the retail trading space. We believe that long-term trading longevity comes down to rigorous risk control, repeatable market mechanics, and a supportive environment of focused peers.',
    missionHeading: 'Trading with Precision, Integrity, and Proven Risk Discipline.',
    missionP1: 'USH was founded with a singular mission: to provide real market clarity without the toxic marketing hype prevalent in the retail trading space.',
    missionP2: 'We believe that long-term trading longevity comes down to rigorous risk control, repeatable market mechanics, and a supportive environment of focused peers.',
    founderLeaderName: 'USH Trading Desk',
    founderRole: 'Market Structure & Execution Lead',
    leadershipTitle: 'USH Trading Desk',
    leadershipRole: 'Market Structure & Execution Lead',
    founderImageUrl: '',
    philosophyTitle: 'The USH Trading Philosophy',
    philosophyDescription: 'Capital preservation precedes capital appreciation. We execute only when liquidity, market structure, and risk-reward dynamically align.',
    philosophyImageUrl: '',
    standardCardTitle: 'Our Trading Standards',
    standardPoints: [
      'Strict Capital Preservation (1% Max Risk)',
      'Zero Gambler Psychology or Martingale Schemes',
      'Rule-Based Multi-Timeframe Confirmation',
      '100% Transparent Review of Wins & Losses',
    ],
    values: VALUES,
    pillars: [
      {
        id: 'clarity',
        icon: 'Eye',
        title: 'Total Clarity',
        description: 'We reject hyper-stimulated hype. Our analysis focuses on structured, objective data to help you see the market clearly.',
      },
      {
        id: 'education',
        icon: 'GraduationCap',
        title: 'Continuous Education',
        description: 'Trading is a discipline. We provide frameworks and community support necessary for steady, long-term improvement.',
      },
      {
        id: 'trust',
        icon: 'ShieldCheck',
        title: 'Institutional Trust',
        description: 'We partner with regulated brokers and maintain uncompromising integrity in every setup shared.',
      },
    ],
    milestones: [
      {
        year: '2021',
        title: 'The Foundation',
        description: 'Started sharing structured market analysis with a small group of dedicated traders.',
        active: true,
      },
      {
        year: '2022',
        title: 'Community Growth',
        description: 'Launched the official Telegram channel, expanding our reach and daily insights.',
      },
      {
        year: '2023',
        title: 'Tier-1 Broker Partnership',
        description: 'Established trusted partnerships to provide our community with the best raw trading conditions.',
      },
      {
        year: '2024',
        title: 'Global Expansion',
        description: 'Serving thousands of active traders across 35+ countries with daily market breakdowns.',
      },
    ],
  },
  faqs: FAQS,
  social: {
    telegramUrl: 'https://t.me/+wHFuFFkA2i0xZTA8',
    telegramHandle: '@USHFOREX',
    brokerPartnerUrl: 'https://one.exnesstrack.net/a/c_iun6m90d5o',
    supportEmail: 'ushforex@gmail.com',
    supportTelegram: 'https://t.me/+wHFuFFkA2i0xZTA8',
    tiktokUrl: 'https://www.tiktok.com/@ush.forex?_r=1&_t=ZS-99MCYEw58JZ',
    instagramUrl: 'https://www.instagram.com/kingsforex01?igsi=OG8ydWJ1ZHFsMHk5&utm_source=qr',
    youtubeUrl: 'https://youtube.com/@ushforex01?si=W3LngDqtaJiICbqe',
    snapchatUrl: 'https://www.snapchat.com/add/kingstrader?share_id=fmGNTTpNRt2kevVID5coag&locale=en_NG',
    twitterUrl: 'https://twitter.com/USHFOREX',
    discordUrl: '',
  },
  quoteGallery1: DEFAULT_QUOTE_GALLERY_1,
  quoteGallery2: DEFAULT_QUOTE_GALLERY_2,
  moderation: {
    requireReviewApproval: true,
  },
};

// Aliases for compatibility
DEFAULT_SITE_SETTINGS.featuresSection = DEFAULT_SITE_SETTINGS.whatYouGet;
DEFAULT_SITE_SETTINGS.features = DEFAULT_SITE_SETTINGS.whatYouGet.features;

interface SiteContextType {
  settings: SiteSettings;
  reviews: ReviewItem[];
  approvedReviews: ReviewItem[];
  pendingReviews: ReviewItem[];
  messages: InboxMessage[];
  unreadMessagesCount: number;
  isAdminOpen: boolean;
  openAdmin: () => void;
  closeAdmin: () => void;
  updateSettings: (newSettings: Partial<SiteSettings> | ((prev: SiteSettings) => SiteSettings)) => void;
  resetSettings: () => void;
  updateQuoteGallery1: (gallery: Partial<QuoteGallerySettings>) => void;
  updateQuoteGallery2: (gallery: Partial<QuoteGallerySettings>) => void;
  addQuoteToGallery: (galleryNum: 1 | 2, quote: Omit<QuoteItem, 'id'>) => void;
  deleteQuoteFromGallery: (galleryNum: 1 | 2, quoteId: string) => void;
  updateQuoteInGallery: (galleryNum: 1 | 2, quoteId: string, updated: Partial<QuoteItem>) => void;
  approveReview: (id: string) => void;
  rejectReview: (id: string) => void;
  deleteReview: (id: string) => void;
  addReview: (review: Omit<ReviewItem, 'id' | 'status' | 'submittedAt'> & { status?: 'approved' | 'pending' | 'rejected' }) => { success: boolean; requiresApproval: boolean };
  updateReview: (id: string, updated: Partial<ReviewItem>) => void;
  toggleAutoApproveReviews: (val?: boolean) => void;
  addInboxMessage: (messageData: Omit<InboxMessage, 'id' | 'submittedAt' | 'read' | 'status'> & { status?: 'new' | 'in_progress' | 'resolved'; adminNotes?: string }) => void;
  markMessageRead: (id: string, read?: boolean) => void;
  updateMessageStatus: (id: string, status: 'new' | 'in_progress' | 'resolved') => void;
  deleteMessage: (id: string) => void;
  addAdminNote: (id: string, note: string) => void;
  clearAllMessages: () => void;
  exportSettingsJson: () => string;
  importSettingsJson: (jsonStr: string) => boolean;
}

const SiteContext = createContext<SiteContextType | undefined>(undefined);

export const SiteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SiteSettings>(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const mergedWhatYouGet = { ...DEFAULT_SITE_SETTINGS.whatYouGet, ...(parsed.whatYouGet || parsed.featuresSection || {}) };
        const mergedHero = { ...DEFAULT_SITE_SETTINGS.hero, ...(parsed.hero || {}) };
        const mergedCommunity = { ...DEFAULT_SITE_SETTINGS.community, ...(parsed.community || {}) };
        const mergedBroker = { ...DEFAULT_SITE_SETTINGS.broker, ...(parsed.broker || {}) };
        const mergedAbout = { ...DEFAULT_SITE_SETTINGS.about, ...(parsed.about || {}) };
        const mergedVipGuide = { ...DEFAULT_SITE_SETTINGS.vipGuide, ...(parsed.vipGuide || {}) };

        // Upgrade legacy CTA texts
        const isLegacyCta = (text?: string) => 
          !text || 
          text === 'Join Our Free VIP Group' || 
          text === 'Join the Telegram Community' || 
          text === 'Join Telegram' ||
          text.toLowerCase().includes('on telegram');

        const upgradedCtaText = isLegacyCta(mergedHero.cta1Text)
          ? 'Join our trading community'
          : mergedHero.cta1Text;

        const upgradedCommunityCta = isLegacyCta(mergedCommunity.ctaText)
          ? 'Join our trading community'
          : mergedCommunity.ctaText;

        // Ensure functional working Telegram links
        const fixTelegramLink = (url?: string) => {
          if (!url || url === 'https://t.me/ushforex_official' || url === '@ushforex_official') {
            return 'https://t.me/+wHFuFFkA2i0xZTA8';
          }
          return url;
        };

        return {
          ...DEFAULT_SITE_SETTINGS,
          ...parsed,
          quoteGallery1: {
            ...(parsed.quoteGallery1 || DEFAULT_QUOTE_GALLERY_1),
            quotes: ((parsed.quoteGallery1?.quotes || DEFAULT_QUOTE_GALLERY_1.quotes) || []).map((q: any) => ({
              ...q,
              author: 'USH',
            })),
          },
          quoteGallery2: {
            ...(parsed.quoteGallery2 || DEFAULT_QUOTE_GALLERY_2),
            quotes: ((parsed.quoteGallery2?.quotes || DEFAULT_QUOTE_GALLERY_2.quotes) || []).map((q: any) => ({
              ...q,
              author: 'USH',
            })),
          },
          branding: { 
            ...DEFAULT_SITE_SETTINGS.branding, 
            ...(parsed.branding || {}),
            brandName: (!parsed.branding?.brandName || parsed.branding?.brandName === 'USH' || parsed.branding?.brandName === 'U.S.H Forex') 
              ? 'Community of Traders' 
              : parsed.branding.brandName,
            tagline: (parsed.branding?.tagline === 'COMMUNITY OF TRADERS') ? '' : (parsed.branding?.tagline ?? '')
          },
          hero: {
            ...mergedHero,
            headline: mergedHero.headline || mergedHero.headingLine1 || DEFAULT_SITE_SETTINGS.hero.headline,
            highlightText: mergedHero.highlightText || mergedHero.headingLine2 || DEFAULT_SITE_SETTINGS.hero.highlightText,
            headingLine1: mergedHero.headingLine1 || mergedHero.headline || DEFAULT_SITE_SETTINGS.hero.headingLine1,
            headingLine2: mergedHero.headingLine2 || mergedHero.highlightText || DEFAULT_SITE_SETTINGS.hero.headingLine2,
            cta1Text: upgradedCtaText,
            cta1Link: mergedHero.cta1Link || DEFAULT_SITE_SETTINGS.hero.cta1Link,
            cta2Text: mergedHero.cta2Text || mergedHero.secondaryCtaText || DEFAULT_SITE_SETTINGS.hero.cta2Text,
            cta2Link: mergedHero.cta2Link || DEFAULT_SITE_SETTINGS.hero.cta2Link,
            primaryCtaText: upgradedCtaText,
            primaryCtaLink: mergedHero.primaryCtaLink || DEFAULT_SITE_SETTINGS.hero.primaryCtaLink,
            secondaryCtaText: mergedHero.secondaryCtaText || mergedHero.cta2Text || DEFAULT_SITE_SETTINGS.hero.secondaryCtaText,
            secondaryCtaLink: mergedHero.secondaryCtaLink || DEFAULT_SITE_SETTINGS.hero.secondaryCtaLink,
          },
          whatYouGet: mergedWhatYouGet,
          featuresSection: mergedWhatYouGet,
          features: Array.isArray(parsed.features) && parsed.features.length > 0 ? parsed.features : mergedWhatYouGet.features,
          community: {
            ...mergedCommunity,
            headline: mergedCommunity.headline || mergedCommunity.titleLine1 || DEFAULT_SITE_SETTINGS.community.headline,
            highlightText: mergedCommunity.highlightText || mergedCommunity.titleHighlight || DEFAULT_SITE_SETTINGS.community.highlightText,
            titleLine1: mergedCommunity.titleLine1 || mergedCommunity.headline || DEFAULT_SITE_SETTINGS.community.titleLine1,
            titleHighlight: mergedCommunity.titleHighlight || mergedCommunity.highlightText || DEFAULT_SITE_SETTINGS.community.titleHighlight,
            ctaText: upgradedCommunityCta,
          },
          broker: {
            ...mergedBroker,
            headline: mergedBroker.headline || mergedBroker.title || DEFAULT_SITE_SETTINGS.broker.headline,
            title: mergedBroker.title || mergedBroker.headline || DEFAULT_SITE_SETTINGS.broker.title,
            brokerTag: mergedBroker.brokerTag || mergedBroker.partnerTag || DEFAULT_SITE_SETTINGS.broker.brokerTag,
            partnerTag: mergedBroker.partnerTag || mergedBroker.brokerTag || DEFAULT_SITE_SETTINGS.broker.partnerTag,
            partnerLink: mergedBroker.partnerLink || DEFAULT_SITE_SETTINGS.broker.partnerLink,
            accountLink: mergedBroker.accountLink || DEFAULT_SITE_SETTINGS.broker.accountLink,
            helpLink: fixTelegramLink(mergedBroker.helpLink),
            createAccountCtaLink: mergedBroker.createAccountCtaLink || DEFAULT_SITE_SETTINGS.broker.createAccountCtaLink,
            supportHelpCtaLink: fixTelegramLink(mergedBroker.supportHelpCtaLink),
            features: mergedBroker.features || mergedBroker.featuresList || DEFAULT_SITE_SETTINGS.broker.features,
            featuresList: mergedBroker.featuresList || mergedBroker.features || DEFAULT_SITE_SETTINGS.broker.featuresList,
          },
          vipGuide: {
            ...mergedVipGuide,
            title: isLegacyCta(mergedVipGuide.title) ? 'Join our trading community' : (mergedVipGuide.title || 'Join our trading community'),
            vipTelegramUrl: fixTelegramLink(mergedVipGuide.vipTelegramUrl),
            adminTelegramUser: fixTelegramLink(mergedVipGuide.adminTelegramUser),
          },
          about: {
            ...mergedAbout,
            headline: mergedAbout.headline || mergedAbout.title || DEFAULT_SITE_SETTINGS.about.headline,
            title: mergedAbout.title || mergedAbout.headline || DEFAULT_SITE_SETTINGS.about.title,
            highlightText: mergedAbout.highlightText || mergedAbout.subtitle || DEFAULT_SITE_SETTINGS.about.highlightText,
            founderLeaderName: mergedAbout.founderLeaderName || mergedAbout.leadershipTitle || DEFAULT_SITE_SETTINGS.about.founderLeaderName,
            leadershipTitle: mergedAbout.leadershipTitle || mergedAbout.founderLeaderName || DEFAULT_SITE_SETTINGS.about.leadershipTitle,
            founderRole: mergedAbout.founderRole || mergedAbout.leadershipRole || DEFAULT_SITE_SETTINGS.about.founderRole,
            leadershipRole: mergedAbout.leadershipRole || mergedAbout.founderRole || DEFAULT_SITE_SETTINGS.about.leadershipRole,
            storyParagraph: mergedAbout.storyParagraph || mergedAbout.missionP1 || DEFAULT_SITE_SETTINGS.about.storyParagraph,
            values: mergedAbout.values || VALUES,
            pillars: mergedAbout.pillars || DEFAULT_SITE_SETTINGS.about.pillars,
          },
          social: { 
            ...DEFAULT_SITE_SETTINGS.social, 
            ...(parsed.social || {}),
            supportEmail: 'ushforex@gmail.com',
            telegramUrl: fixTelegramLink(parsed.social?.telegramUrl),
            supportTelegram: fixTelegramLink(parsed.social?.supportTelegram),
          },
          moderation: { ...DEFAULT_SITE_SETTINGS.moderation, ...(parsed.moderation || {}) },
          faqs: Array.isArray(parsed.faqs) && parsed.faqs.length > 0 ? parsed.faqs : DEFAULT_SITE_SETTINGS.faqs,
        };
      }
    } catch (e) {
      console.warn('Could not parse saved site settings:', e);
    }
    return DEFAULT_SITE_SETTINGS;
  });

  const [reviews, setReviews] = useState<ReviewItem[]>(() => {
    try {
      const saved = localStorage.getItem(REVIEWS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const demoNames = ['Marcus Sterling', 'Elena Rostova', 'David Mwangi', 'Carlos Mendez', 'Sophia Chen', 'Tariq Al-Mansoor'];
          const userOnly = parsed.filter((r: ReviewItem) => !demoNames.includes(r.name) && !['1', '2', '3', '4', '5', '6'].includes(r.id));
          return userOnly;
        }
      }
    } catch (e) {
      console.warn('Could not parse saved reviews:', e);
    }
    return [];
  });

  const [messages, setMessages] = useState<InboxMessage[]>(() => {
    try {
      const saved = localStorage.getItem(MESSAGES_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const realOnly = parsed.filter((m: InboxMessage) => m.id !== 'msg-1' && m.id !== 'msg-2');
          return realOnly;
        }
      }
    } catch (e) {
      console.warn('Could not parse saved inbox messages:', e);
    }
    return INITIAL_SAMPLE_MESSAGES;
  });

  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    } catch (e) {
      console.error('Error saving settings to localStorage:', e);
    }
  }, [settings]);

  useEffect(() => {
    try {
      localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(reviews));
    } catch (e) {
      console.error('Error saving reviews to localStorage:', e);
    }
  }, [reviews]);

  useEffect(() => {
    try {
      localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(messages));
    } catch (e) {
      console.error('Error saving messages to localStorage:', e);
    }
  }, [messages]);

  const openAdmin = () => setIsAdminOpen(true);
  const closeAdmin = () => setIsAdminOpen(false);

  const updateSettings = (newSettings: Partial<SiteSettings> | ((prev: SiteSettings) => SiteSettings)) => {
    setSettings((prev) => {
      if (typeof newSettings === 'function') {
        return newSettings(prev);
      }
      return {
        ...prev,
        ...newSettings,
        branding: { ...prev.branding, ...(newSettings.branding || {}) },
        hero: { ...prev.hero, ...(newSettings.hero || {}) },
        whatYouGet: { ...prev.whatYouGet, ...(newSettings.whatYouGet || {}) },
        community: { ...prev.community, ...(newSettings.community || {}) },
        broker: { ...prev.broker, ...(newSettings.broker || {}) },
        about: { ...prev.about, ...(newSettings.about || {}) },
        social: { ...prev.social, ...(newSettings.social || {}) },
        moderation: { ...prev.moderation, ...(newSettings.moderation || {}) },
        quoteGallery1: newSettings.quoteGallery1 ? { ...(prev.quoteGallery1 || DEFAULT_QUOTE_GALLERY_1), ...newSettings.quoteGallery1 } : (prev.quoteGallery1 || DEFAULT_QUOTE_GALLERY_1),
        quoteGallery2: newSettings.quoteGallery2 ? { ...(prev.quoteGallery2 || DEFAULT_QUOTE_GALLERY_2), ...newSettings.quoteGallery2 } : (prev.quoteGallery2 || DEFAULT_QUOTE_GALLERY_2),
      };
    });
  };

  const updateQuoteGallery1 = (gallery: Partial<QuoteGallerySettings>) => {
    setSettings((prev) => ({
      ...prev,
      quoteGallery1: {
        ...(prev.quoteGallery1 || DEFAULT_QUOTE_GALLERY_1),
        ...gallery,
      },
    }));
  };

  const updateQuoteGallery2 = (gallery: Partial<QuoteGallerySettings>) => {
    setSettings((prev) => ({
      ...prev,
      quoteGallery2: {
        ...(prev.quoteGallery2 || DEFAULT_QUOTE_GALLERY_2),
        ...gallery,
      },
    }));
  };

  const addQuoteToGallery = (galleryNum: 1 | 2, quote: Omit<QuoteItem, 'id'>) => {
    const key = galleryNum === 1 ? 'quoteGallery1' : 'quoteGallery2';
    const fallback = galleryNum === 1 ? DEFAULT_QUOTE_GALLERY_1 : DEFAULT_QUOTE_GALLERY_2;
    const current = settings[key] || fallback;
    const nextNumber = (current.quotes.length > 0 ? Math.max(...current.quotes.map(q => q.number || 0)) : 0) + 1;
    const newQuote: QuoteItem = {
      ...quote,
      id: `q-${galleryNum}-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      number: quote.number ?? nextNumber,
    };
    setSettings((prev) => {
      const active = prev[key] || fallback;
      return {
        ...prev,
        [key]: {
          ...active,
          quotes: [newQuote, ...active.quotes],
        },
      };
    });
  };

  const deleteQuoteFromGallery = (galleryNum: 1 | 2, quoteId: string) => {
    const key = galleryNum === 1 ? 'quoteGallery1' : 'quoteGallery2';
    const fallback = galleryNum === 1 ? DEFAULT_QUOTE_GALLERY_1 : DEFAULT_QUOTE_GALLERY_2;
    setSettings((prev) => {
      const current = prev[key] || fallback;
      return {
        ...prev,
        [key]: {
          ...current,
          quotes: current.quotes.filter((q) => q.id !== quoteId),
        },
      };
    });
  };

  const updateQuoteInGallery = (galleryNum: 1 | 2, quoteId: string, updated: Partial<QuoteItem>) => {
    const key = galleryNum === 1 ? 'quoteGallery1' : 'quoteGallery2';
    const fallback = galleryNum === 1 ? DEFAULT_QUOTE_GALLERY_1 : DEFAULT_QUOTE_GALLERY_2;
    setSettings((prev) => {
      const current = prev[key] || fallback;
      return {
        ...prev,
        [key]: {
          ...current,
          quotes: current.quotes.map((q) => (q.id === quoteId ? { ...q, ...updated } : q)),
        },
      };
    });
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SITE_SETTINGS);
    setReviews(TESTIMONIALS);
    setMessages(INITIAL_SAMPLE_MESSAGES);
    try {
      localStorage.removeItem(SETTINGS_STORAGE_KEY);
      localStorage.removeItem(REVIEWS_STORAGE_KEY);
      localStorage.removeItem(MESSAGES_STORAGE_KEY);
    } catch (e) {
      console.error(e);
    }
  };

  const approvedReviews = reviews.filter((r) => r.status === 'approved');
  const pendingReviews = reviews.filter((r) => r.status === 'pending');

  const approveReview = (id: string) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'approved' } : r))
    );
  };

  const rejectReview = (id: string) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'rejected' } : r))
    );
  };

  const deleteReview = (id: string) => {
    setReviews((prev) => prev.filter((r) => r.id !== id));
  };

  const updateReview = (id: string, updated: Partial<ReviewItem>) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...updated } : r))
    );
  };

  const addReview = (
    reviewData: Omit<ReviewItem, 'id' | 'status' | 'submittedAt'> & { status?: 'approved' | 'pending' | 'rejected' }
  ) => {
    const requiresApproval = settings.moderation.requireReviewApproval;
    const initialStatus = reviewData.status || (requiresApproval ? 'pending' : 'approved');

    const newReview: ReviewItem = {
      ...reviewData,
      id: `review-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      status: initialStatus,
      submittedAt: new Date().toISOString().split('T')[0],
    };

    setReviews((prev) => [newReview, ...prev]);

    return {
      success: true,
      requiresApproval: initialStatus === 'pending',
    };
  };

  const toggleAutoApproveReviews = (val?: boolean) => {
    setSettings((prev) => ({
      ...prev,
      moderation: {
        ...prev.moderation,
        requireReviewApproval: val !== undefined ? val : !prev.moderation.requireReviewApproval,
      },
    }));
  };

  const unreadMessagesCount = messages.filter((m) => !m.read).length;

  const addInboxMessage = (
    messageData: Omit<InboxMessage, 'id' | 'submittedAt' | 'read' | 'status'> & { status?: 'new' | 'in_progress' | 'resolved'; adminNotes?: string }
  ) => {
    const newMsg: InboxMessage = {
      ...messageData,
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      submittedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      read: false,
      status: messageData.status || 'new',
    };
    setMessages((prev) => [newMsg, ...prev]);
  };

  const markMessageRead = (id: string, read = true) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, read } : m))
    );
  };

  const updateMessageStatus = (id: string, status: 'new' | 'in_progress' | 'resolved') => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status, read: status !== 'new' ? true : m.read } : m))
    );
  };

  const deleteMessage = (id: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== id));
  };

  const addAdminNote = (id: string, note: string) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, adminNotes: note } : m))
    );
  };

  const clearAllMessages = () => {
    setMessages([]);
  };

  const exportSettingsJson = (): string => {
    return JSON.stringify({ settings, reviews, messages }, null, 2);
  };

  const importSettingsJson = (jsonStr: string): boolean => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed.settings) {
        setSettings(parsed.settings);
      }
      if (Array.isArray(parsed.reviews)) {
        setReviews(parsed.reviews);
      }
      if (Array.isArray(parsed.messages)) {
        setMessages(parsed.messages);
      }
      return true;
    } catch (e) {
      console.error('Failed to import JSON configuration:', e);
      return false;
    }
  };

  return (
    <SiteContext.Provider
      value={{
        settings,
        reviews,
        approvedReviews,
        pendingReviews,
        messages,
        unreadMessagesCount,
        isAdminOpen,
        openAdmin,
        closeAdmin,
        updateSettings,
        resetSettings,
        updateQuoteGallery1,
        updateQuoteGallery2,
        addQuoteToGallery,
        deleteQuoteFromGallery,
        updateQuoteInGallery,
        approveReview,
        rejectReview,
        deleteReview,
        addReview,
        updateReview,
        toggleAutoApproveReviews,
        addInboxMessage,
        markMessageRead,
        updateMessageStatus,
        deleteMessage,
        addAdminNote,
        clearAllMessages,
        exportSettingsJson,
        importSettingsJson,
      }}
    >
      {children}
    </SiteContext.Provider>
  );
};

export const useSite = () => {
  const context = useContext(SiteContext);
  if (!context) {
    throw new Error('useSite must be used within a SiteProvider');
  }
  return context;
};
