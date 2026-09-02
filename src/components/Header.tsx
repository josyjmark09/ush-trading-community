import React, { useRef } from 'react';
import { NavTab } from '../types';
import { Send, Phone } from 'lucide-react';
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
    { id: 'forex-news', label: 'Forex News' },
    { id: 'testimonials', label: 'Reviews' },
    { id: 'broker', label: 'Recommended Broker' },
    { id: 'faq', label: 'FAQ' },
  ];

  const handleNavClick = (tab: NavTab) => {
    setActiveTab(tab);
  };

  const handleTelegramClick = () => {
    onOpenTelegram();
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-white border-b border-slate-300 shadow-2xs">
      <div className="flex justify-between items-center h-16 sm:h-18 px-4 md:px-8 max-w-[1200px] mx-auto w-full relative">
        {/* Brand Logo & Title */}
        <button 
          onClick={handleLogoTap}
          className="flex items-center gap-2.5 cursor-pointer group text-left"
          aria-label={settings.branding.brandName}
        >
          <img 
            src={settings.branding.logoUrl || logoSvg} 
            alt={settings.branding.logoAltText || "USH Logo"} 
            className="h-9 sm:h-10 w-auto max-h-10 object-contain shrink-0"
          />
          <div className="flex flex-col justify-center">
            <span className="font-manrope text-[16px] sm:text-[17px] font-black tracking-tight text-slate-900 leading-tight">
              {settings.branding.brandName}
            </span>
            {settings.branding.tagline && (
              <span className="text-[9px] sm:text-[9.5px] font-bold text-[#0053CF] tracking-wider uppercase mt-0.5">
                {settings.branding.tagline}
              </span>
            )}
          </div>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`font-inter text-[13.5px] leading-[20px] transition-colors py-1 relative font-bold whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'text-[#0053CF]'
                    : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute -bottom-2 left-0 right-0 h-[2px] bg-[#0053CF] rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Action Button & Contact Support Icon */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={handleTelegramClick}
            className="hidden sm:flex items-center gap-2 bg-[#0053CF] hover:bg-[#0040A2] text-white font-inter text-[13px] font-bold py-2.5 px-4.5 rounded-lg shadow-2xs transition-colors cursor-pointer whitespace-nowrap"
          >
            <Send className="w-4 h-4" />
            <span>Join Free VIP Group</span>
          </button>

          {/* Customer Support Telephone Icon Button */}
          {onOpenContact && (
            <button
              onClick={onOpenContact}
              className="flex items-center justify-center w-10 h-10 rounded-lg text-slate-700 hover:text-[#0053CF] bg-slate-100 hover:bg-blue-50 border border-slate-300 transition-colors cursor-pointer"
              title="Customer Care & Support"
              aria-label="Customer Care & Support"
            >
              <Phone className="w-4.5 h-4.5" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
