import React, { useState, useEffect } from 'react';
import { NavTab } from './types';
import { SiteProvider, useSite } from './context/SiteContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomeView } from './components/HomeView';
import { TelegramModal } from './components/TelegramModal';
import { BrokerModal } from './components/BrokerModal';
import { ContactModal } from './components/ContactModal';
import { AdminModal } from './components/AdminModal';

function MainApp() {
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [isTelegramModalOpen, setIsTelegramModalOpen] = useState(false);
  const [isBrokerModalOpen, setIsBrokerModalOpen] = useState(false);
  const [contactModalState, setContactModalState] = useState<{
    isOpen: boolean;
    type: 'contact' | 'disclaimer';
  }>({
    isOpen: false,
    type: 'contact',
  });

  const handleTabChange = (tab: NavTab) => {
    setActiveTab(tab);
    
    // Map tabs to section IDs on the single landing page
    const sectionMap: Record<NavTab, string> = {
      home: 'hero',
      about: 'about',
      broker: 'broker',
      testimonials: 'testimonials',
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
    <div className="min-h-screen bg-[#F7FAFF] text-[#181C20] flex flex-col font-inter selection:bg-[#116AFE]/20 selection:text-[#0053CF]">
      {/* Header with 5-tap logo Admin trigger */}
      <Header
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        onOpenTelegram={() => setIsTelegramModalOpen(true)}
      />

      {/* Main Single Landing Page Content */}
      <main className="flex-grow pt-[84px] md:pt-[88px] pb-8 px-2 sm:px-4 flex flex-col items-center w-full">
        <div className="w-full flex flex-col items-center animate-soft-entry">
          <HomeView
            setActiveTab={handleTabChange}
            onOpenTelegram={() => setIsTelegramModalOpen(true)}
            onOpenBroker={() => setIsBrokerModalOpen(true)}
            onOpenContact={() => setContactModalState({ isOpen: true, type: 'contact' })}
          />
        </div>
      </main>

      {/* Footer with dynamic links */}
      <Footer
        setActiveTab={handleTabChange}
        onOpenTelegram={() => setIsTelegramModalOpen(true)}
        onOpenContact={() =>
          setContactModalState({ isOpen: true, type: 'contact' })
        }
        onOpenDisclaimer={() =>
          setContactModalState({ isOpen: true, type: 'disclaimer' })
        }
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
