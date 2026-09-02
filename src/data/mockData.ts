import { Milestone, FeatureItem, ValueCardItem, TestimonialItem, FAQItem, MarketQuote } from '../types';

export const APP_IMAGES = {
  // Main community interface dashboard mockup
  communityDashboard: "https://lh3.googleusercontent.com/aida-public/AB6AXuDECJvpyp6e7IfscQbFFBBnU3JqrQSZEG68PGgaWdZnOOzX8qX27iVGtacWU-gDh6IdIjNT8YXlthQbI3s_dAR_Xd5k_9ZJjPaBnwySzVEP00gVQ9m55VACe0GgaypCzyJs1bVrs1wFFEcbomGxPspMLh_eQAinjR_3t6oZujM_HdAh4az2Jm6w6fQVi-LYfCUs_rTBRe-CGqR2Gn9fDok9Lq4ANe3qUQfE1cOHLAqeAlKPmDDhIjHrHw",
  
  // Telegram community phones in dark mode
  telegramPhones: "https://lh3.googleusercontent.com/aida-public/AB6AXuAFQkRLIQqKs8YsWzxaPQoiDys1LUd7WlN3o8-H7sa4diWOAJc2fnYtCeH8QBc7oWaJZX31yQk56w0zghv4kp_DEqEBZISZqgkPkCzeCJN0UywUDvnAAwg1cNBlfPzctrVMkUksazEDLU2tsV9e1agMe-T29j80iz5RtEfHwahTJq26PiEzde_ALd8eCTK3lG6o8KnZBEUZC0Wghy6PeR_evL854wSJZVoCd4CUsMlNndByBYsZ4ME7Cg",
  
  // Founder portrait
  founderPortrait: "https://lh3.googleusercontent.com/aida-public/AB6AXuCx6BF0dW2XR5zLNgDt2vmxOnQWYhD4UVRxVChF_-IDNxzEBEZEYW0Mdm_ezK89O3PbMd0Rkl5P3Tj-zflZuz9UgTejDZRI677UO6RXvJeGbhtwCXgZUll553MvL2jzB8sSEPyYUI2pi_x17FkNNG1ARn3MCSu7Y4ZOhKIsEE6sWAf6etv2mQSU7M8LJD218Hq1ZxkRePYHY0T6df0V8L_tI1Tn5kt6O1tnHESDQ08q4Tz1yywkxwEJEw",
  
  // Trading philosophy charts on wall screen
  philosophyDashboard: "https://lh3.googleusercontent.com/aida-public/AB6AXuCfe7NjxjDCjKBHiGRl4Hf5b6x1FD-v05DsHK4wGPBJQ4HOLmfO9-RJWqHvi21ljjlZ1MMxUCBjmtD6f6JYT400ddudHIkkxC9PzZl5aHluwmDJ9obHN9Hw-noqsmH8RRtBMIL_cOQx9pqG71rw_QxVnQK1qVmd6Wu-vMDx6IOIUHYqA5p_wUcNHlbDdxEvh743EgDlLvmYRTPcgHEzmXCo6V8UTz19YJAy1ZE4lHCsAUopMh_vowIsAg",
  
  // Broker laptop trading charts
  brokerCharts: "https://lh3.googleusercontent.com/aida-public/AB6AXuC7Ln1CYrHNwbEqsHDuDAswYSIsjPTXEhSyAvVqxn9-XV1BGwfUYFQW46Jrxdwz1ZViUumMiNJzV3hs3aIA8lXP0l9YWo9b-ZmaihxilJzjZvwUIeVq-RbcHEBVpJn7torWZ4bNr-PZAu3TLvlxDtSKg79fQNzeCV48Iggm-2OPyfaDHu56ymtEtinArVxe_1gyw6gMQQqR3fv1IQ3f9BL5S41iVzzlh_OQSmymETlUMhGTg_lwdByTag",
};

export const MILESTONES: Milestone[] = [
  {
    year: "2021",
    title: "The Foundation",
    description: "Started sharing structured market analysis with a small group of dedicated traders.",
    active: true,
  },
  {
    year: "2022",
    title: "Community Growth",
    description: "Launched the official Telegram channel, expanding our reach and daily insights.",
  },
  {
    year: "2023",
    title: "Broker Partnerships",
    description: "Established trusted partnerships to provide our community with the best trading conditions.",
  },
];

export const VALUES: ValueCardItem[] = [
  {
    id: "clarity",
    icon: "Eye",
    title: "Total Clarity",
    description: "We reject the hyper-stimulated hype. Our market analysis focuses on structured, objective data to help you see the market clearly.",
  },
  {
    id: "education",
    icon: "GraduationCap",
    title: "Continuous Education",
    description: "Trading is a discipline. We provide the tools, frameworks, and community support necessary for steady, long-term improvement.",
    highlight: true,
  },
  {
    id: "trust",
    icon: "Users",
    title: "Institutional Trust",
    description: "We partner with regulated, trusted brokers and maintain a high standard of professional integrity in everything we share.",
  },
];

export const COMMUNITY_FEATURES: FeatureItem[] = [
  {
    id: "insights",
    icon: "TrendingUp",
    title: "Market Insights",
    description: "Daily market updates, breakdowns and trading opportunities.",
  },
  {
    id: "education",
    icon: "GraduationCap",
    title: "Trading Education",
    description: "Structured lessons, trading concepts and strategy breakdowns.",
  },
  {
    id: "community",
    icon: "MessageSquare",
    title: "Trading Community",
    description: "Join a community of traders, share ideas and grow together.",
  },
  {
    id: "broker",
    icon: "ShieldCheck",
    title: "Broker Access",
    description: "Access our recommended broker with exclusive benefits.",
  },
];

export const LIVE_QUOTES: MarketQuote[] = [
  { pair: "EUR/USD", bid: 1.0842, ask: 1.0843, change: +0.28, direction: "up" },
  { pair: "GBP/USD", bid: 1.2915, ask: 1.2917, change: +0.41, direction: "up" },
  { pair: "USD/JPY", bid: 151.24, ask: 151.26, change: -0.19, direction: "down" },
  { pair: "USD/CHF", bid: 0.8872, ask: 0.8874, change: -0.12, direction: "down" },
  { pair: "AUD/USD", bid: 0.6548, ask: 0.6550, change: +0.33, direction: "up" },
  { pair: "USD/CAD", bid: 1.3962, ask: 1.3964, change: +0.08, direction: "up" },
  { pair: "NZD/USD", bid: 0.5895, ask: 0.5897, change: +0.22, direction: "up" },
  { pair: "EUR/GBP", bid: 0.8394, ask: 0.8396, change: -0.15, direction: "down" },
  { pair: "EUR/JPY", bid: 163.98, ask: 164.01, change: +0.14, direction: "up" },
  { pair: "GBP/JPY", bid: 195.32, ask: 195.36, change: +0.26, direction: "up" },
  { pair: "AUD/JPY", bid: 99.02, ask: 99.05, change: +0.18, direction: "up" },
  { pair: "XAU/USD", bid: 2684.50, ask: 2685.10, change: +1.14, direction: "up" },
  { pair: "XAG/USD", bid: 31.42, ask: 31.45, change: +0.86, direction: "up" },
  { pair: "US30", bid: 43910.00, ask: 43915.00, change: +0.45, direction: "up" },
  { pair: "NAS100", bid: 20850.00, ask: 20855.00, change: +0.62, direction: "up" },
  { pair: "BTC/USD", bid: 92450.00, ask: 92480.00, change: +2.35, direction: "up" },
];

// Verified reviews submitted by real traders (moderated before going live)
export const TESTIMONIALS: TestimonialItem[] = [];

export const FAQS: FAQItem[] = [
  {
    id: "faq-1",
    category: "Community",
    question: "How do I join the U.S.H Forex Telegram Community?",
    answer: "You can click any 'Join Telegram' button on this platform. Access to our public market breakdown channel is completely free, providing daily charts, macro overviews, and educational write-ups.",
  },
  {
    id: "faq-2",
    category: "Broker",
    question: "Why does U.S.H Forex recommend Exness?",
    answer: "We partner exclusively with top-tier regulated entities. Exness is overseen by tier-1 authorities including the FCA (UK), CySEC, and FSCA, offering ultra-low spreads from 0.0 pips, instant automated withdrawals, and execution speeds under 0.01 seconds.",
  },
  {
    id: "faq-3",
    category: "Trading",
    question: "What is U.S.H Forex's core trading methodology?",
    answer: "Our methodology centers on market structure, institutional order flow, liquidity imbalances, and strict multi-timeframe confirmation. We prioritize risk-to-reward ratios of 1:2.5 or higher and advocate for risking no more than 1% per setup.",
  },
  {
    id: "faq-4",
    category: "General",
    question: "Is this suitable for beginner traders?",
    answer: "Yes. We offer foundational educational guides that explain risk management, lot size calculation, platform navigation (MT4/MT5), and psychological discipline before taking real market positions.",
  },
  {
    id: "faq-5",
    category: "Broker",
    question: "Are there any fees or hidden costs to open an account?",
    answer: "No. Opening a trading account through our recommended link is 100% free with no hidden maintenance fees. You also gain eligibility for our partner community perks and exclusive trade setups.",
  },
];
