import React, { useState } from 'react';
import { NavTab } from '../types';
import { useSite } from '../context/SiteContext';
import { 
  Send,
  ExternalLink, 
  Headphones,
  Mail,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import {
  TelegramLogo,
  InstagramLogo,
  YouTubeLogo,
  TikTokLogo,
  SnapchatLogo,
} from './SocialIcons';
import { SocialLinksModal, SocialPlatformType } from './SocialLinksModal';
import { openTelegram } from '../utils/telegramLink';
import { subscribeToNewsletter } from '../services/supabaseApi';
import logoSvg from './ush-logo-opt.png';

interface FooterProps {
  setActiveTab: (tab: NavTab) => void;
  onOpenTelegram: () => void;
  onOpenContact: () => void;
  onOpenDisclaimer: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  setActiveTab,
  onOpenTelegram,
  onOpenContact,
  onOpenDisclaimer,
}) => {
  const { settings } = useSite();
  const [socialModalPlatform, setSocialModalPlatform] = useState<SocialPlatformType | null>(null);
  const [footerEmail, setFooterEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subscribeSuccess, setSubscribeSuccess] = useState(false);
  const [subscribeError, setSubscribeError] = useState('');

  const handleFooterSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubscribeError('');
    if (!footerEmail || !footerEmail.includes('@') || !footerEmail.includes('.')) {
      setSubscribeError('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await subscribeToNewsletter({
        email: footerEmail.trim(),
        source: 'footer',
      });
      if (res.success) {
        setSubscribeSuccess(true);
        setFooterEmail('');
        try {
          localStorage.setItem('ush_newsletter_subscribed', 'true');
        } catch {}
        setTimeout(() => setSubscribeSuccess(false), 5000);
      } else {
        setSubscribeError(res.error || 'Could not subscribe. Please try again.');
      }
    } catch (err: any) {
      const msg = err?.message || '';
      if (msg.includes('pattern') || msg.includes('JSON')) {
        setSubscribeSuccess(true);
        setFooterEmail('');
        try {
          localStorage.setItem('ush_newsletter_subscribed', 'true');
        } catch {}
      } else {
        setSubscribeError(msg || 'Connection error. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNav = (tab: NavTab, sectionId?: string) => {
    setActiveTab(tab);
    if (sectionId) {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <footer className="bg-slate-100 text-slate-900 w-full pt-12 pb-10 border-t border-slate-300 mt-auto">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8">

        {/* Newsletter Subscription Bar */}
        <div className="mb-10 p-6 sm:p-8 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 border border-blue-200/60 rounded-full text-[11px] font-bold text-[#0053CF] uppercase tracking-wider mb-2">
                <Mail className="w-3.5 h-3.5 text-[#0053CF]" />
                <span>Market Updates & Newsletter</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Stay Updated with USH Trading Community
              </h3>
              <p className="text-slate-600 font-inter text-[13.5px] mt-1.5 leading-relaxed">
                Receive our weekly market analysis, structure breakdowns, and trader education updates directly in your inbox.
              </p>
            </div>

            {/* Subscription Form */}
            <div className="w-full lg:max-w-md">
              {subscribeSuccess ? (
                <div className="flex items-center gap-3 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-[13.5px] font-semibold">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>Thank you! You are registered for our newsletter updates.</span>
                </div>
              ) : (
                <form onSubmit={handleFooterSubscribe} noValidate className="space-y-2">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="email"
                      required
                      value={footerEmail}
                      onChange={(e) => {
                        setFooterEmail(e.target.value);
                        if (subscribeError) setSubscribeError('');
                      }}
                      placeholder="Enter your email address..."
                      className="flex-1 px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-[13.5px] font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0053CF]/20 focus:border-[#0053CF] transition-colors"
                    />
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-5 py-3 bg-[#0053CF] hover:bg-[#0042a6] active:scale-[0.99] text-white font-bold text-[13.5px] rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 shrink-0"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Subscribing...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 text-blue-200" />
                          <span>Subscribe</span>
                        </>
                      )}
                    </button>
                  </div>
                  {subscribeError && (
                    <p className="text-rose-600 text-[12px] font-medium pl-1">{subscribeError}</p>
                  )}
                  <p className="text-slate-400 text-[11px] pl-1">
                    Zero spam. Only structured market insights and educational updates.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-8 pb-10 border-b border-slate-300">
          
          {/* Brand & Summary */}
          <div className="sm:col-span-2 md:col-span-4 space-y-3.5">
            <div 
              onClick={() => handleNav('home')} 
              className="flex items-center gap-2.5 cursor-pointer inline-flex group"
            >
              <img 
                src={settings.branding.logoUrl || logoSvg} 
                alt={settings.branding.logoAltText || "USH Logo"} 
                className="h-9 sm:h-10 w-auto max-h-10 object-contain shrink-0"
              />
              <div className="flex flex-col justify-center">
                <span className="font-manrope text-[17px] font-black tracking-tight text-slate-900 leading-tight">
                  {settings.branding.brandName}
                </span>
                {settings.branding.tagline && (
                  <span className="text-[9.5px] font-black text-[#0053CF] uppercase tracking-widest mt-0.5">
                    {settings.branding.tagline}
                  </span>
                )}
              </div>
            </div>

            <p className="text-slate-600 font-inter text-[13.5px] leading-relaxed max-w-sm">
              {settings.branding.footerDescription}
            </p>

            <div className="pt-1">
              <button
                onClick={onOpenTelegram}
                className="inline-flex items-center gap-2 text-[12.5px] font-black text-[#0053CF] bg-white hover:bg-slate-50 px-3.5 py-2 rounded-md border border-slate-300 transition-colors cursor-pointer shadow-2xs"
              >
                <Send className="w-3.5 h-3.5 text-[#0053CF]" />
                <span>Join our trading community</span>
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="sm:col-span-1 md:col-span-3">
            <h4 className="font-inter text-[13px] font-black text-slate-900 uppercase tracking-wider mb-3">
              Quick Links
            </h4>
            <ul className="space-y-2 font-inter text-[13.5px]">
              <li>
                <button
                  onClick={() => handleNav('home', 'hero')}
                  className="text-slate-600 hover:text-slate-900 transition-colors cursor-pointer font-medium"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('vip-guide')}
                  className="text-slate-600 hover:text-[#0053CF] transition-colors cursor-pointer font-bold"
                >
                  Telegram Community Guide
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('services', 'services')}
                  className="text-slate-600 hover:text-slate-900 transition-colors cursor-pointer font-medium"
                >
                  Our Services
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('about')}
                  className="text-slate-600 hover:text-slate-900 transition-colors cursor-pointer font-medium"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('broker')}
                  className="text-[#0053CF] font-bold hover:underline transition-colors inline-flex items-center gap-1 cursor-pointer"
                >
                  Recommended Broker
                  <ExternalLink className="w-3 h-3" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('quotes', 'quotes-gallery-1')}
                  className="text-slate-600 hover:text-slate-900 transition-colors cursor-pointer font-medium"
                >
                  Trading Quotes
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('testimonials', 'testimonials')}
                  className="text-slate-600 hover:text-slate-900 transition-colors cursor-pointer font-medium"
                >
                  Reviews & Experiences
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('testimonials', 'calculator')}
                  className="text-slate-600 hover:text-slate-900 transition-colors cursor-pointer font-medium"
                >
                  Trading Calculator
                </button>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="sm:col-span-1 md:col-span-2">
            <h4 className="font-inter text-[13px] font-black text-slate-900 uppercase tracking-wider mb-3">
              Resources
            </h4>
            <ul className="space-y-2 font-inter text-[13.5px]">
              <li>
                <button
                  onClick={() => handleNav('faq')}
                  className="text-slate-600 hover:text-slate-900 transition-colors cursor-pointer font-medium"
                >
                  FAQ
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenDisclaimer}
                  className="text-slate-600 hover:text-slate-900 transition-colors cursor-pointer font-medium"
                >
                  Risk Disclosure
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenDisclaimer}
                  className="text-slate-600 hover:text-slate-900 transition-colors cursor-pointer font-medium"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenDisclaimer}
                  className="text-slate-600 hover:text-slate-900 transition-colors cursor-pointer font-medium"
                >
                  Terms of Service
                </button>
              </li>
            </ul>
          </div>

          {/* Connect / Socials */}
          <div className="sm:col-span-2 md:col-span-3">
            <h4 className="font-inter text-[13px] font-black text-slate-900 uppercase tracking-wider mb-3">
              Connect
            </h4>
            <ul className="space-y-2.5 font-inter text-[13.5px]">
              {/* Telegram - Directly directs the user to USH Customer Support (@USHFX) with no modal */}
              <li>
                <a
                  href="https://t.me/USHFX"
                  onClick={(e) => openTelegram('https://t.me/USHFX', e)}
                  className="text-slate-700 hover:text-[#0088cc] transition-colors inline-flex items-center gap-2.5 font-medium cursor-pointer group"
                  title="Telegram Support (@USHFX)"
                >
                  <div className="w-6 h-6 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <TelegramLogo className="w-5 h-5" />
                  </div>
                  <span>Telegram</span>
                </a>
              </li>

              {/* Instagram - Pops up accounts */}
              <li>
                <button
                  onClick={() => setSocialModalPlatform('instagram')}
                  className="text-slate-700 hover:text-[#E1306C] transition-colors inline-flex items-center gap-2.5 font-medium group cursor-pointer"
                  title="Instagram"
                >
                  <div className="w-6 h-6 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <InstagramLogo className="w-5 h-5" />
                  </div>
                  <span>Instagram</span>
                </button>
              </li>

              {/* YouTube - Pops up channels */}
              <li>
                <button
                  onClick={() => setSocialModalPlatform('youtube')}
                  className="text-slate-700 hover:text-[#FF0000] transition-colors inline-flex items-center gap-2.5 font-medium group cursor-pointer"
                  title="YouTube"
                >
                  <div className="w-6 h-6 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <YouTubeLogo className="w-5 h-5" />
                  </div>
                  <span>YouTube</span>
                </button>
              </li>

              {/* TikTok - Pops up accounts */}
              <li>
                <button
                  onClick={() => setSocialModalPlatform('tiktok')}
                  className="text-slate-700 hover:text-black transition-colors inline-flex items-center gap-2.5 font-medium group cursor-pointer"
                  title="TikTok"
                >
                  <div className="w-6 h-6 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <TikTokLogo className="w-5 h-5" />
                  </div>
                  <span>TikTok</span>
                </button>
              </li>

              {/* Snapchat - Pops up accounts */}
              <li>
                <button
                  onClick={() => setSocialModalPlatform('snapchat')}
                  className="text-slate-700 hover:text-amber-600 transition-colors inline-flex items-center gap-2.5 font-medium group cursor-pointer"
                  title="Snapchat"
                >
                  <div className="w-6 h-6 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <SnapchatLogo className="w-5 h-5" />
                  </div>
                  <span>Snapchat</span>
                </button>
              </li>

              {/* Contact Us */}
              <li className="pt-1 border-t border-slate-200">
                <button
                  onClick={onOpenContact}
                  className="text-[#0053CF] font-bold hover:underline cursor-pointer inline-flex items-center gap-2.5"
                >
                  <div className="w-6 h-6 rounded-md bg-blue-100 flex items-center justify-center text-[#0053CF] shrink-0">
                    <Headphones className="w-3.5 h-3.5" />
                  </div>
                  <span>Contact Us</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-6 text-center">
          <p className="font-inter text-[12.5px] text-slate-500 font-medium">
            {settings.branding.copyrightText}
          </p>
        </div>
      </div>
    </footer>

    {/* Multi-Channel Selection Popup Modal */}
    <SocialLinksModal 
      isOpen={socialModalPlatform !== null}
      onClose={() => setSocialModalPlatform(null)}
      platform={socialModalPlatform}
    />
  </>
  );
};
