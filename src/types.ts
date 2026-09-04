export type NavTab = 'home' | 'services' | 'about' | 'quotes' | 'forex-news' | 'testimonials' | 'broker' | 'faq' | 'vip-guide';


export interface Milestone {
  year: string;
  title: string;
  description: string;
  active?: boolean;
}

export interface FeatureItem {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export interface ValueCardItem {
  id: string;
  icon: string;
  title: string;
  description: string;
  highlight?: boolean;
}

export interface PillarItem {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export interface ReviewItem {
  id: string;
  name: string;
  handle?: string;
  experience?: string;
  avatar?: string;
  content: string;
  profitSnippet?: string;
  rating: number;
  date?: string;
  brokerUsed?: string;
  tradingStyle?: string;
  location?: string;
  country?: string;
  countryCode?: string;
  status: 'approved' | 'pending' | 'rejected';
  submittedAt?: string;
  email?: string;
}

export type TestimonialItem = ReviewItem;

export interface InboxMessage {
  id: string;
  name: string;
  email: string;
  topic?: string;
  accountId?: string;
  message: string;
  submittedAt: string;
  read: boolean;
  status: 'new' | 'in_progress' | 'resolved';
  source: 'contact_form' | 'admin_support' | 'vip_onboarding';
  adminNotes?: string;
}

export interface FeedbackSubmission {
  name: string;
  handle?: string;
  email: string;
  rating: number;
  role?: string;
  comment: string;
  brokerUsed?: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'Community' | 'Broker' | 'Trading' | 'General' | string;
}

export interface MarketQuote {
  pair: string;
  bid: number;
  ask: number;
  change: number;
  direction: 'up' | 'down';
}

export interface SiteBranding {
  brandName: string;
  tagline: string;
  logoUrl?: string;
  logoAltText: string;
  footerDescription?: string;
  copyrightText?: string;
}

export interface HeroSettings {
  badgeText: string;
  badgeSubtext?: string;
  headline: string;
  highlightText: string;
  headingLine1?: string;
  headingLine2?: string;
  subtitle: string;
  cta1Text: string;
  cta1Link: string;
  cta2Text: string;
  cta2Link: string;
  primaryCtaText?: string;
  primaryCtaLink?: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  heroImageUrl?: string;
  chartImageUrl?: string;
  stats?: { label: string; text: string }[];
}

export interface WhatYouGetSettings {
  sectionBadge: string;
  badgeText?: string;
  title: string;
  subtitle: string;
  features: FeatureItem[];
}

export interface CommunitySettings {
  sectionBadge: string;
  badgeText?: string;
  headline: string;
  highlightText: string;
  titleLine1?: string;
  titleHighlight?: string;
  subtitle?: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  communityImageUrl?: string;
  chartImageUrl?: string;
  stat1Number?: string;
  stat1Label?: string;
  stat2Number?: string;
  stat2Label?: string;
  stat3Number?: string;
  stat3Label?: string;
  bulletPoints?: string[];
  stats?: { number: string; label: string }[];
}

export interface BrokerSettings {
  sectionBadge: string;
  badgeText?: string;
  headline: string;
  title?: string;
  subtitle: string;
  brokerName: string;
  brokerTag?: string;
  partnerTag?: string;
  partnerLink: string;
  accountLink?: string;
  helpLink?: string;
  createAccountCtaText: string;
  createAccountCtaLink: string;
  supportHelpCtaText: string;
  supportHelpCtaLink: string;
  spreadsText: string;
  leverageText: string;
  withdrawalsText: string;
  minDepositText: string;
  brokerImageUrl?: string;
  features?: string[];
  featuresList?: string[];
  steps?: { stepNumber: number; title: string; description: string }[];
}

export interface AboutSettings {
  sectionBadge: string;
  badgeText?: string;
  headline: string;
  title?: string;
  highlightText: string;
  subtitle?: string;
  storyParagraph: string;
  missionHeading?: string;
  missionP1?: string;
  missionP2?: string;
  founderLeaderName?: string;
  founderRole?: string;
  leadershipTitle?: string;
  leadershipRole?: string;
  founderImageUrl?: string;
  philosophyTitle?: string;
  philosophyDescription?: string;
  philosophyImageUrl?: string;
  standardCardTitle?: string;
  standardPoints?: string[];
  values?: ValueCardItem[];
  pillars?: PillarItem[];
  milestones?: Milestone[];
}

export interface SocialLinksSettings {
  telegramUrl: string;
  telegramHandle?: string;
  brokerPartnerUrl: string;
  supportEmail: string;
  supportTelegram: string;
  tiktokUrl?: string;
  instagramUrl?: string;
  youtubeUrl?: string;
  snapchatUrl?: string;
  twitterUrl?: string;
  discordUrl?: string;
  whatsappUrl?: string;
}

export interface VipGuideSettings {
  title: string;
  subtitle: string;
  partnerLink: string;
  partnerCode: string;
  vipTelegramUrl: string;
  adminTelegramUser?: string;
  supportHelpText?: string;
}

export interface QuoteItem {
  id: string;
  number?: number;
  quote: string;
  author?: string;
  category?: string;
}

export interface QuoteGallerySettings {
  sectionBadge: string;
  title: string;
  subtitle: string;
  quotes: QuoteItem[];
}

export interface ServiceItem {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  description: string;
  includedTitle?: string;
  inclusions: string[];
  disclaimer?: string;
  badge?: string;
  icon?: string;
  ctaText?: string;
}

export interface ServicesSettings {
  sectionBadge: string;
  badgeText?: string;
  title: string;
  headline?: string;
  subtitle: string;
  services: ServiceItem[];
}

export interface SiteSettings {
  branding: SiteBranding;
  hero: HeroSettings;
  featuresSection?: WhatYouGetSettings;
  whatYouGet: WhatYouGetSettings;
  features?: FeatureItem[];
  services?: ServicesSettings;
  community: CommunitySettings;
  broker: BrokerSettings;
  about: AboutSettings;
  vipGuide?: VipGuideSettings;
  faqs: FAQItem[];
  social: SocialLinksSettings;
  quoteGallery1?: QuoteGallerySettings;
  quoteGallery2?: QuoteGallerySettings;
  moderation: {
    requireReviewApproval: boolean;
  };
}


