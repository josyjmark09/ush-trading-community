import React, { useState, useRef } from 'react';
import { NavTab } from '../types';
import { Send, Menu, X, ArrowRight, ShieldCheck, Sliders } from 'lucide-react';
import { useSite } from '../context/SiteContext';
import logoSvg from './image 1.svg';

interface HeaderProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  onOpenTelegram: () => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, onOpenTelegram }) => {
  const { settings, openAdmin } = useSite();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Logo 5-tap detector for Admin Panel login (completely silent)
  const tapCountRef = useRef(0);
  const tapTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleLogoTap = () => {
    tapCountRef.current += 1;
    const currentTaps = tapCountRef.current;

    if (tapTimerRef.current) {
      clearTimeout(tapTimerRef.current);
    }

    if (currentTaps >= 5) {
      tapCountRef.current = 0;
      openAdmin();
      return;
    }

    tapTimerRef.current = setTimeout(() => {
      tapCountRef.current = 0;
    }, 2200);

    handleNavClick('home');
  };

  const navItems: { id: NavTab; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'testimonials', label: 'Reviews' },
    { id: 'broker', label: 'Recommended Broker' },
    { id: 'faq', label: 'FAQ' },
  ];

  const handleNavClick = (tab: NavTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTelegramClick = () => {
    if (settings.social.telegramUrl) {
      window.open(settings.social.telegramUrl, '_blank', 'noopener,noreferrer');
    } else {
      onOpenTelegram();
    }
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-[#F7FAFF]/95 backdrop-blur-md border-b border-[#C5C6CE]/30 shadow-xs transition-all duration-300">
      <div className="flex justify-between items-center h-20 px-3 sm:px-6 md:px-8 max-w-[1200px] mx-auto w-full relative">
        {/* Logo */}
        <button 
          onClick={handleLogoTap}
          className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group text-left transition-transform active:scale-98"
          aria-label={settings.branding.brandName}
        >
          <img 
            src={settings.branding.logoUrl || logoSvg} 
            alt={settings.branding.logoAltText || "USH Logo"} 
            className="h-10 sm:h-12 w-auto max-w-[56px] object-contain shrink-0 transition-transform group-hover:scale-105"
          />
          <div className="flex flex-col">
            <span className="font-manrope text-[18px] sm:text-[21px] md:text-[22px] font-extrabold tracking-tight text-[#091C35] leading-none">
              {settings.branding.brandName}
            </span>
            <span className="text-[9px] sm:text-[10px] font-semibold text-[#0053CF] tracking-widest uppercase mt-0.5">
              {settings.branding.tagline}
            </span>
          </div>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-7">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`font-inter text-[14px] leading-[20px] transition-all duration-200 py-2 relative font-medium whitespace-nowrap ${
                  isActive
                    ? 'text-[#0053CF] font-bold'
                    : 'text-[#44474D] hover:text-[#0053CF]'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#0053CF] rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Action Button & Mobile Menu Toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={handleTelegramClick}
            className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-[#116AFE] to-[#0053CF] hover:from-[#0053CF] hover:to-[#0040A2] text-white font-inter text-[13.5px] sm:text-[14px] font-semibold py-2.5 px-4 sm:px-5 rounded-lg shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 active:scale-95 cursor-pointer glow-blue whitespace-nowrap"
          >
            <Send className="w-4 h-4" />
            <span>Join Telegram</span>
          </button>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#091C35] hover:bg-[#EBF3FF] rounded-lg transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-xl border-b border-[#E5E8ED] px-5 py-6 shadow-xl animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col space-y-3">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center justify-between text-left py-3 px-4 rounded-xl text-[15px] font-medium transition-all ${
                    isActive
                      ? 'bg-[#EBF3FF] text-[#0053CF] font-bold'
                      : 'text-[#181C20] hover:bg-[#F1F4F9]'
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive ? (
                    <span className="w-2 h-2 rounded-full bg-[#0053CF]" />
                  ) : (
                    <ArrowRight className="w-4 h-4 text-[#75777E]" />
                  )}
                </button>
              );
            })}

            <div className="pt-3 border-t border-[#E5E8ED] mt-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleTelegramClick();
                }}
                className="w-full flex items-center justify-center gap-2.5 bg-[#116AFE] hover:bg-[#0053CF] text-white font-inter text-[15px] font-semibold py-3.5 px-4 rounded-xl shadow-md transition-all active:scale-98 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Join Official Telegram</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
