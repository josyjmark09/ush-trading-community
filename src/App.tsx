import React, { useState, useEffect } from 'react';
import { NavTab } from './types';
import { SiteProvider, useSite } from './context/SiteContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomeView } from './components/HomeView';
import { TelegramModal } from './components/TelegramModal';
import { BrokerModal } from './components/BrokerModal';
import { VipGuideModal } from './components/VipGuideModal';
import { VipGuideView } from './components/VipGuideView';
import { ContactModal } from './components/ContactModal';
import { AdminModal } from './components/AdminModal';

function MainApp() {
  const { settings } = useSite();
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [isVipModalOpen, setIsVipModalOpen] = useState(false);
  const [vipModalTab, setVipModalTab] = useState<'new' | 'existing'>('new');
  const [isTelegramModalOpen, setIsTelegramModalOpen] = useState(false);
  const [isBrokerModalOpen, setIsBrokerModalOpen] = useState(false);
  const [contactModalState, setContactModalState] = useState<{
    isOpen: boolean;
    type: 'contact' | 'disclaimer';
  }>({
    isOpen: false,
    type: 'contact',
  });

  const handleOpenVip = () => {
    setActiveTab('vip-guide');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Sync website favicon and meta with custom branding logo if set
  useEffect(() => {
    const iconHref = settings.branding.logoUrl || '/ush-square.jpg';
    let iconLink = document.querySelector("link[rel~='icon']") as HTMLLinkElement | null;
    if (!iconLink) {
      iconLink = document.createElement('link');
      iconLink.rel = 'icon';
      document.head.appendChild(iconLink);
    }
    iconLink.href = iconHref;

    // Update og:image dynamically if custom logo is uploaded
    if (settings.branding.logoUrl) {
      const ogImg = document.querySelector("meta[property='og:image']") as HTMLMetaElement | null;
      if (ogImg) ogImg.content = settings.branding.logoUrl;
      const twImg = document.querySelector("meta[name='twitter:image']") as HTMLMetaElement | null;
      if (twImg) twImg.content = settings.branding.logoUrl;
    }
  }, [settings.branding.logoUrl]);

  const handleTabChange = (tab: NavTab) => {
    setActiveTab(tab);
    
    // Map tabs to section IDs on the single landing page
    const sectionMap: Partial<Record<NavTab, string>> = {
      home: 'hero',
      services: 'services',
      about: 'about',
      quotes: 'quotes-gallery-1',
      'forex-news': 'quotes-gallery-1',
      testimonials: 'testimonials',
      broker: 'broker',
      faq: 'faq',
    };

    const targetId = sectionMap[tab];
    if (targetId) {
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-[#F7FAFF] text-[#181C20] flex flex-col font-inter selection:bg-[#116AFE]/20 selection:text-[#0053CF]">
      {/* Header with 5-tap logo Admin trigger */}
      <Header
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        onOpenTelegram={handleOpenVip}
        onOpenContact={() => setContactModalState({ isOpen: true, type: 'contact' })}
      />

      {/* Main Content (Home Landing or Dedicated Full-Page VIP Guide) */}
      <main className="flex-grow pt-[70px] sm:pt-[84px] md:pt-[88px] pb-8 px-2 sm:px-4 flex flex-col items-center w-full max-w-full overflow-x-hidden box-border">
        {activeTab === 'vip-guide' ? (
          <VipGuideView setActiveTab={handleTabChange} />
        ) : (
          <div className="w-full flex flex-col items-center animate-soft-entry">
            <HomeView
              setActiveTab={handleTabChange}
              onOpenTelegram={handleOpenVip}
              onOpenBroker={() => handleTabChange('broker')}
              onOpenContact={() => setContactModalState({ isOpen: true, type: 'contact' })}
            />
          </div>
        )}
      </main>

      {/* Footer with dynamic links */}
      <Footer
        setActiveTab={handleTabChange}
        onOpenTelegram={handleOpenVip}
        onOpenContact={() =>
          setContactModalState({ isOpen: true, type: 'contact' })
        }
        onOpenDisclaimer={() =>
          setContactModalState({ isOpen: true, type: 'disclaimer' })
        }
      />

      {/* VIP Step-by-Step Guide Modal (For both new and existing Exness users) */}
      <VipGuideModal
        isOpen={isVipModalOpen}
        defaultTab={vipModalTab}
        onClose={() => setIsVipModalOpen(false)}
      />

      {/* Interactive Modals */}
      <TelegramModal
        isOpen={isTelegramModalOpen}
        onClose={() => setIsTelegramModalOpen(false)}
      />

      <BrokerModal
        isOpen={isBrokerModalOpen}
        onClose={() => setIsBrokerModalOpen(false)}
      />

      <ContactModal
        isOpen={contactModalState.isOpen}
        type={contactModalState.type}
        onClose={() =>
          setContactModalState((prev) => ({ ...prev, isOpen: false }))
        }
      />

      {/* Admin Panel Modal (Opened by tapping logo 5 times) */}
      <AdminModal />
    </div>
  );
}

export default function App() {
  return (
    <SiteProvider>
      <MainApp />
    </SiteProvider>
  );
}
