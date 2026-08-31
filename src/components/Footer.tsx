import React from 'react';
import { NavTab } from '../types';
import { useSite } from '../context/SiteContext';
import { Send, ExternalLink, Mail, MessageSquare } from 'lucide-react';
import logoSvg from './image 1.svg';

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

  const handleTelegram = () => {
    if (settings.social.telegramUrl) {
      window.open(settings.social.telegramUrl, '_blank', 'noopener,noreferrer');
    } else {
      onOpenTelegram();
    }
  };

  return (
    <footer className="bg-[#DFE3E8]/80 text-[#181C20] w-full pt-16 pb-12 border-t border-[#C5C6CE]/50 mt-auto">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-[#C5C6CE]/40">
          
          {/* Brand & Summary */}
          <div className="md:col-span-4 space-y-4">
            <div 
              onClick={() => handleNav('home')} 
              className="flex items-center gap-3 cursor-pointer inline-flex group"
            >
              <div className="w-10 h-10 rounded-xl bg-[#0053CF] flex items-center justify-center p-1 shadow-sm overflow-hidden shrink-0">
                <img 
                  src={settings.branding.logoUrl || logoSvg} 
                  alt={settings.branding.logoAltText || "USH Logo"} 
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-manrope text-[20px] font-extrabold tracking-tight text-[#091C35] leading-none">
                  {settings.branding.brandName}
                </span>
                <span className="text-[9.5px] font-bold text-[#0053CF] uppercase tracking-widest mt-0.5">
                  {settings.branding.tagline}
                </span>
              </div>
            </div>

            <p className="text-[#44474D] font-inter text-[14px] leading-relaxed max-w-sm">
              {settings.branding.footerDescription}
            </p>

            <div className="pt-2">
              <button
                onClick={handleTelegram}
                className="inline-flex items-center gap-2 text-[13px] font-semibold text-[#0053CF] bg-[#EBF3FF] hover:bg-[#DAE2FF] px-3.5 py-2 rounded-lg border border-[#B2C5FF]/50 transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Join Official Telegram Channel</span>
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3">
            <h4 className="font-inter text-[14px] font-bold text-[#091C35] uppercase tracking-wider mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2.5 font-inter text-[14px]">
              <li>
                <button
                  onClick={() => handleNav('home', 'hero')}
                  className="text-[#44474D] hover:text-[#0053CF] transition-colors cursor-pointer"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('home', 'about')}
                  className="text-[#44474D] hover:text-[#0053CF] transition-colors cursor-pointer"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('home', 'broker')}
                  className="text-[#0053CF] font-semibold hover:text-[#0040A2] transition-colors inline-flex items-center gap-1 cursor-pointer"
                >
                  Recommended Broker
                  <ExternalLink className="w-3 h-3" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('home', 'testimonials')}
                  className="text-[#44474D] hover:text-[#0053CF] transition-colors cursor-pointer"
                >
                  Reviews & Experiences
                </button>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="md:col-span-2">
            <h4 className="font-inter text-[14px] font-bold text-[#091C35] uppercase tracking-wider mb-4">
              Resources
            </h4>
            <ul className="space-y-2.5 font-inter text-[14px]">
              <li>
                <button
                  onClick={() => handleNav('home', 'faq')}
                  className="text-[#44474D] hover:text-[#0053CF] transition-colors cursor-pointer"
                >
                  FAQ
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenDisclaimer}
                  className="text-[#44474D] hover:text-[#0053CF] transition-colors cursor-pointer"
                >
                  Risk Disclosure
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenDisclaimer}
                  className="text-[#44474D] hover:text-[#0053CF] transition-colors cursor-pointer"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenDisclaimer}
                  className="text-[#44474D] hover:text-[#0053CF] transition-colors cursor-pointer"
                >
                  Terms of Service
                </button>
              </li>
            </ul>
          </div>

          {/* Connect / Socials */}
          <div className="md:col-span-3">
            <h4 className="font-inter text-[14px] font-bold text-[#091C35] uppercase tracking-wider mb-4">
              Connect
            </h4>
            <ul className="space-y-2.5 font-inter text-[14px]">
              {settings.social.telegramUrl && (
                <li>
                  <a
                    href={settings.social.telegramUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#44474D] hover:text-[#0053CF] transition-colors inline-flex items-center gap-1.5"
                  >
                    <span>Telegram</span>
                    <span className="text-[10px] bg-[#116AFE]/10 text-[#0053CF] px-1.5 py-0.5 rounded font-bold">ACTIVE</span>
                  </a>
                </li>
              )}
              {settings.social.tiktokUrl && (
                <li>
                  <a
                    href={settings.social.tiktokUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#44474D] hover:text-[#0053CF] transition-colors inline-block"
                  >
                    TikTok
                  </a>
                </li>
              )}
              {settings.social.instagramUrl && (
                <li>
                  <a
                    href={settings.social.instagramUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#44474D] hover:text-[#0053CF] transition-colors inline-block"
                  >
                    Instagram
                  </a>
                </li>
              )}
              {settings.social.youtubeUrl && (
                <li>
                  <a
                    href={settings.social.youtubeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#44474D] hover:text-[#0053CF] transition-colors inline-block"
                  >
                    YouTube
                  </a>
                </li>
              )}
              {settings.social.twitterUrl && (
                <li>
                  <a
                    href={settings.social.twitterUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#44474D] hover:text-[#0053CF] transition-colors inline-block"
                  >
                    Twitter / X
                  </a>
                </li>
              )}
              {settings.social.discordUrl && (
                <li>
                  <a
                    href={settings.social.discordUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#44474D] hover:text-[#0053CF] transition-colors inline-block"
                  >
                    Discord Community
                  </a>
                </li>
              )}
              <li>
                <button
                  onClick={onOpenContact}
                  className="text-[#0053CF] font-medium hover:underline cursor-pointer"
                >
                  Contact Us
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-6 text-center border-t border-[#E2E8F0]">
          <p className="font-inter text-[13.5px] text-[#44474D]">
            {settings.branding.copyrightText}
          </p>
        </div>
      </div>
    </footer>
  );
};
