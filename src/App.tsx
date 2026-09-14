/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ProductSection } from './components/ProductSection';
import { BenefitsSection } from './components/BenefitsSection';
import { UsageRoutineSection } from './components/UsageRoutineSection';
import { WhyCoreFuelSection } from './components/WhyCoreFuelSection';
import { PricingSection } from './components/PricingSection';
import { FaqSection } from './components/FaqSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { DirectOrderModal } from './components/DirectOrderModal';
import { MobileOrderBar } from './components/MobileOrderBar';
import { LoginPage } from './components/LoginPage';
import { FlavorId, UserProfile } from './types';

export default function App() {
  // Global selected flavor state: 'orange'
  const [selectedFlavorId, setSelectedFlavorId] = useState<FlavorId>('orange');
  const [isOrderModalOpen, setIsOrderModalOpen] = useState<boolean>(false);

  // View state: 'store' | 'login'
  const [currentView, setCurrentView] = useState<'store' | 'login'>(() => {
    return window.location.hash === '#login' ? 'login' : 'store';
  });

  // User state: isolated per session, verified with server
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  // Sync session on mount with server
  useEffect(() => {
    const sessionId = localStorage.getItem('corefuel_session_id');
    const headers: Record<string, string> = {};
    if (sessionId) {
      headers['Authorization'] = `Bearer ${sessionId}`;
    }

    fetch('/api/auth/me', {
      credentials: 'include',
      headers,
    })
      .then(async (res) => {
        try {
          return await res.json();
        } catch {
          return { authenticated: false };
        }
      })
      .then((data) => {
        if (data && data.authenticated && data.user) {
          setCurrentUser(data.user);
        } else {
          localStorage.removeItem('corefuel_session_id');
          setCurrentUser(null);
        }
      })
      .catch(() => {
        setCurrentUser(null);
      });
  }, []);

  // Desktop subtle cursor-following glow
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Sync hash changes for easy browser back/forward and direct links
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#login') {
        setCurrentView('login');
      } else if (currentView === 'login' && window.location.hash !== '#login') {
        setCurrentView('store');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [currentView]);

  const handleLoginSuccess = (user: UserProfile, sessionId?: string) => {
    if (sessionId) {
      localStorage.setItem('corefuel_session_id', sessionId);
    }
    setCurrentUser(user);
  };

  const handleLogout = async () => {
    const sessionId = localStorage.getItem('corefuel_session_id');
    const headers: Record<string, string> = {};
    if (sessionId) {
      headers['Authorization'] = `Bearer ${sessionId}`;
    }

    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
        headers,
      });
    } catch {}
    localStorage.removeItem('corefuel_session_id');
    setCurrentUser(null);
  };

  const handleOpenLogin = () => {
    window.location.hash = '#login';
    setCurrentView('login');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToStore = () => {
    window.location.hash = '#hero';
    setCurrentView('store');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenOrderModal = (flavorId?: FlavorId) => {
    if (flavorId) {
      setSelectedFlavorId(flavorId);
    }
    setIsOrderModalOpen(true);
  };

  const handleScrollToSection = (sectionId: string) => {
    if (currentView === 'login') {
      setCurrentView('store');
      window.location.hash = `#${sectionId}`;
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      return;
    }
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#07080a] text-[#e8e9ec] font-sans antialiased overflow-x-hidden selection:bg-[#00d2ff] selection:text-black relative">
      
      {/* Subtle cursor-following glow for Desktop */}
      <div
        className="pointer-events-none fixed -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[#00d2ff]/4 blur-[130px] z-50 transition-opacity duration-300 hidden lg:block"
        style={{
          left: `${mousePos.x}px`,
          top: `${mousePos.y}px`,
        }}
      />

      {/* 1. Minimal Sticky Navbar */}
      <Navbar
        onOrderNow={() => handleOpenOrderModal()}
        onOpenLogin={handleOpenLogin}
        currentUser={currentUser}
        currentView={currentView}
      />

      {/* Conditional View Rendering */}
      {currentView === 'login' ? (
        <LoginPage
          onBackToStore={handleBackToStore}
          currentUser={currentUser}
          onLoginSuccess={handleLoginSuccess}
          onLogout={handleLogout}
          onOrderNow={(flavorId) => {
            if (flavorId) setSelectedFlavorId(flavorId);
            setIsOrderModalOpen(true);
          }}
        />
      ) : (
        <main className="pb-16 md:pb-0">
          {/* 2. Hero Section — Cinematic with Interactive Flavor Selector & Particles */}
          <HeroSection
            selectedFlavorId={selectedFlavorId}
            onSelectFlavor={(id) => setSelectedFlavorId(id)}
            onOrderNow={() => handleOpenOrderModal()}
            onExploreProduct={() => handleScrollToSection('product')}
          />

          {/* 3. Product Section: "YOUR DAILY CREATINE. SIMPLIFIED." with 4-Item Grid */}
          <ProductSection
            selectedFlavorId={selectedFlavorId}
            onSelectFlavor={(id) => setSelectedFlavorId(id)}
            onOrderNow={(id) => handleOpenOrderModal(id)}
          />

          {/* 4. Benefits Section: "BUILT FOR THE WORK." (4 Interactive Cards) */}
          <BenefitsSection />

          {/* 5. How To Use: 01 SCOOP, 02 MIX, 03 TRAIN Animated Timeline */}
          <UsageRoutineSection />

          {/* 7. Why CoreFuel: "BUILT FOR PEOPLE WHO SHOW UP." with Gym Imagery & 5 Pillars */}
          <WhyCoreFuelSection />

          {/* 8. Pricing Section: "SIMPLE PRICING. NO CONFUSION." (Direct Place Order) */}
          <PricingSection
            onPlaceOrder={(flavorId) => handleOpenOrderModal(flavorId)}
          />

          {/* 9. FAQ: 6 Accordion Items */}
          <FaqSection />

          {/* 10. Contact Section: "READY TO FUEL YOUR TRAINING?" with Call, WhatsApp, Instagram */}
          <ContactSection />
        </main>
      )}

      {/* 11. Footer: Tagline, Navigation, Both Phone Lines, and Instagram */}
      <Footer onOpenLogin={handleOpenLogin} />

      {/* Direct Order Modal: "PLACE YOUR COREFUEL ORDER" (Direct Call & WhatsApp Flow) */}
      <DirectOrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        selectedFlavorId={selectedFlavorId}
        onSelectFlavor={(id) => setSelectedFlavorId(id)}
      />

      {/* Mobile Floating Order Pill Bar (only in store view) */}
      {currentView === 'store' && (
        <MobileOrderBar
          selectedFlavorId={selectedFlavorId}
          onOpenOrderModal={() => handleOpenOrderModal()}
        />
      )}
    </div>
  );
}
