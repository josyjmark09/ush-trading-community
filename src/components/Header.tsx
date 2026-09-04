import React, { useRef, useState, useEffect } from 'react';
import { NavTab } from '../types';
import { Send, Phone, Menu, X, ChevronRight, ExternalLink } from 'lucide-react';
import { useSite } from '../context/SiteContext';
import logoSvg from './image 1.svg';

interface HeaderProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  onOpenTelegram: () => void;
  onOpenContact?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  activeTab, 
  setActiveTab, 
  onOpenTelegram,
  onOpenContact 
}) => {
  const { settings, openAdmin } = useSite();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Logo 5-tap detector for Admin Panel login (completely silent)
  const tapCountRef = useRef(0);
  const tapTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Close mobile menu on escape key or resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  const navItems: Array<{
    id?: NavTab;
    label: string;
    shortLabel?: string;
    href?: string;
    isExternal?: boolean;
  }> = [
    { id: 'home', label: 'Home' },
    { label: 'Forex Factory', href: 'https://www.forexfactory.com', isExternal: true },
    { id: 'services', label: 'Our Services', shortLabel: 'Services' },
    { id: 'about', label: 'About' },
    { id: 'quotes', label: 'Trading Quotes', shortLabel: 'Quotes' },
    { id: 'testimonials', label: 'Reviews' },
    { id: 'broker', label: 'Recommended Broker', shortLabel: 'Broker' },
    { id: 'faq', label: 'FAQ' },
  ];

  const handleNavClick = (tab: NavTab) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
  };

  const handleTelegramClick = () => {
    onOpenTelegram();
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-white border-b border-slate-300 shadow-2xs">
      <div className="flex justify-between items-center h-16 sm:h-18 px-3 sm:px-6 md:px-8 max-w-[1200px] mx-auto w-full relative">
        {/* Brand Logo & Title */}
        <button 
          onClick={handleLogoTap}
          className="flex items-center gap-1.5 sm:gap-2.5 cursor-pointer group text-left shrink-0 mr-1.5 sm:mr-3 xl:mr-6 min-w-0"
          aria-label={settings.branding.brandName}
        >
          <img 
            src={settings.branding.logoUrl || logoSvg} 
            alt={settings.branding.logoAltText || "USH Logo"} 
            className="h-8 sm:h-9 md:h-10 w-auto max-h-10 object-contain shrink-0"
          />
          <div className="flex flex-col justify-center shrink-0">
            <span className="font-manrope text-[14px] sm:text-[16px] xl:text-[17px] font-black tracking-tight text-slate-900 leading-tight whitespace-nowrap">
              {settings.branding.brandName}
            </span>
            {settings.branding.tagline && (
              <span className="text-[8px] sm:text-[9px] xl:text-[9.5px] font-bold text-[#0053CF] tracking-wider uppercase mt-0.5 whitespace-nowrap">
                {settings.branding.tagline}
              </span>
            )}
          </div>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-3 xl:gap-5 justify-center flex-1">
          {navItems.map((item) => {
            if (item.href) {
              return (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-inter text-[12.5px] xl:text-[13.5px] leading-[20px] transition-colors py-1 relative font-bold whitespace-nowrap cursor-pointer text-slate-700 hover:text-[#0053CF] inline-flex items-center gap-1"
                >
                  <span>{item.label}</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              );
            }

            const isActive = item.id ? activeTab === item.id : false;
            const displayLabel = item.shortLabel ? (
              <>
                <span className="hidden xl:inline">{item.label}</span>
                <span className="xl:hidden">{item.shortLabel}</span>
              </>
            ) : (
              item.label
            );

            return (
              <button
                key={item.id || item.label}
                onClick={() => item.id && handleNavClick(item.id)}
                className={`font-inter text-[12.5px] xl:text-[13.5px] leading-[20px] transition-colors py-1 relative font-bold whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'text-[#0053CF]'
                    : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                {displayLabel}
                {isActive && (
                  <span className="absolute -bottom-2 left-0 right-0 h-[2px] bg-[#0053CF] rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Action Button & Mobile Menu Toggle */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 ml-1.5 sm:ml-3 xl:ml-6">
          {/* Join Community CTA */}
          <button
            onClick={handleTelegramClick}
            className="flex items-center gap-1.5 bg-[#0053CF] hover:bg-[#0040A2] text-white font-inter text-[12px] sm:text-[13px] font-bold py-2 px-2.5 sm:py-2.5 sm:px-4.5 rounded-lg shadow-2xs transition-colors cursor-pointer whitespace-nowrap min-h-[38px] sm:min-h-[42px]"
          >
            <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span className="sm:hidden">Join</span>
            <span className="hidden sm:inline">Join Community</span>
          </button>

          {/* Customer Support Telephone Icon Button */}
          {onOpenContact && (
            <button
              onClick={onOpenContact}
              className="flex items-center justify-center w-8.5 h-8.5 sm:w-10 sm:h-10 rounded-lg text-slate-700 hover:text-[#0053CF] bg-slate-100 hover:bg-blue-50 border border-slate-300 transition-colors cursor-pointer shrink-0"
              title="Customer Care & Support"
              aria-label="Customer Care & Support"
            >
              <Phone className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            </button>
          )}

          {/* Mobile Hamburger Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            className="lg:hidden flex items-center justify-center w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-lg text-slate-700 hover:text-[#0053CF] bg-slate-100 hover:bg-blue-50 border border-slate-300 transition-colors cursor-pointer shrink-0"
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5 text-[#0053CF]" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-300 shadow-lg animate-soft-entry">
          <div className="px-4 py-3 space-y-1">
            {navItems.map((item) => {
              if (item.href) {
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-[14.5px] font-bold transition-colors cursor-pointer text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                  >
                    <span>{item.label}</span>
                    <ExternalLink className="w-4 h-4 text-slate-400" />
                  </a>
                );
              }

              const isActive = item.id ? activeTab === item.id : false;
              return (
                <button
                  key={item.id || item.label}
                  onClick={() => item.id && handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-[14.5px] font-bold transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-blue-50 text-[#0053CF] font-black'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <span>{item.label}</span>
                  <ChevronRight className={`w-4 h-4 ${isActive ? 'text-[#0053CF]' : 'text-slate-400'}`} />
                </button>
              );
            })}

            <div className="pt-2 mt-2 border-t border-slate-200 flex flex-col gap-2">
              <button
                onClick={handleTelegramClick}
                className="w-full flex items-center justify-center gap-2 bg-[#0053CF] hover:bg-[#0040A2] text-white py-2.5 px-4 rounded-lg font-inter text-[14px] font-bold shadow-xs cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Join Official VIP Group</span>
              </button>
              {onOpenContact && (
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenContact();
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 py-2.5 px-4 rounded-lg font-inter text-[13.5px] font-bold border border-slate-300 cursor-pointer"
                >
                  <Phone className="w-4 h-4 text-[#0053CF]" />
                  <span>Contact Customer Support</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
