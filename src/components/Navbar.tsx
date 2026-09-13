import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Zap, Phone, ChevronRight, User, CheckCircle2 } from 'lucide-react';
import { BRAND_CONFIG } from '../data/productData';
import { BrandLogo } from './BrandLogo';
import { UserProfile } from '../types';

interface NavbarProps {
  onOrderNow: () => void;
  onOpenLogin: () => void;
  currentUser: UserProfile | null;
  currentView: 'store' | 'login';
}

const NAV_LINKS = [
  { label: 'Home', href: '#hero' },
  { label: 'Product', href: '#product' },
  { label: 'Benefits', href: '#benefits' },
  { label: 'Why CoreFuel', href: '#why-corefuel' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Contact', href: '#contact' },
];

export const Navbar: React.FC<NavbarProps> = ({
  onOrderNow,
  onOpenLogin,
  currentUser,
  currentView,
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);

      // Determine active section based on scroll position
      const sections = ['hero', 'product', 'benefits', 'why-corefuel', 'faq', 'contact'];
      for (const sectionId of sections.slice().reverse()) {
        const el = document.getElementById(sectionId);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 200) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    if (currentView === 'login') {
      window.location.hash = href;
      return;
    }
    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'py-3 bg-[#07080a]/85 backdrop-blur-xl border-b border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.8)]'
            : 'py-4 bg-transparent border-b border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* LEFT: Official CoreFuel Logo */}
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('#hero');
            }}
            className="flex items-center group cursor-pointer focus:outline-none"
            aria-label="CoreFuel Nutrition Home"
          >
            {/* Desktop / Tablet: Full Official Logo */}
            <div className="hidden sm:block">
              <BrandLogo variant="full" size="sm" showSubtitle className="group-hover:opacity-90 transition-opacity" />
            </div>
            {/* Mobile: Compact Clean Official Logo */}
            <div className="block sm:hidden">
              <BrandLogo variant="compact" size="xs" className="group-hover:opacity-90 transition-opacity" />
            </div>
          </a>

          {/* CENTER: Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 p-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
            {NAV_LINKS.map((link) => {
              const sectionId = link.href.replace('#', '');
              const isActive = currentView === 'store' && activeSection === sectionId;

              return (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(link.href);
                  }}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-label-pkg uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-[#00d2ff] text-black shadow-[0_0_15px_rgba(0,210,255,0.4)] font-bold'
                      : 'text-zinc-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>

          {/* RIGHT: Phone Pills + Google Login + ORDER NOW Button */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Direct Phone Dropdown/Info on Desktop */}
            <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-zinc-300">
              <Phone className="w-3.5 h-3.5 text-[#00d2ff]" />
              <a href={`tel:${BRAND_CONFIG.secondaryPhoneRaw}`} className="hover:text-white font-mono-code">
                {BRAND_CONFIG.secondaryPhoneDisplay}
              </a>
              <span className="text-zinc-600">|</span>
              <a href={`tel:${BRAND_CONFIG.ownerPhoneRaw}`} className="hover:text-white font-mono-code text-zinc-400">
                {BRAND_CONFIG.ownerPhoneDisplay}
              </a>
            </div>

            {/* Google Sign In / Athlete Member Button */}
            <button
              onClick={onOpenLogin}
              id="navbar-google-auth-btn"
              className={`p-2 sm:px-3.5 sm:py-2 rounded-xl border text-xs font-label-pkg tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
                currentUser
                  ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/25'
                  : currentView === 'login'
                  ? 'bg-[#00d2ff]/20 border-[#00d2ff] text-[#00d2ff]'
                  : 'bg-white/5 hover:bg-white/10 border-white/15 text-zinc-200 hover:border-white/30'
              }`}
              title={currentUser ? `Signed in as ${currentUser.name}` : 'Sign in with Google'}
            >
              {currentUser ? (
                <>
                  <div className="w-5 h-5 rounded-full bg-emerald-500 text-black flex items-center justify-center font-bold text-[10px]">
                    {currentUser.name.charAt(0)}
                  </div>
                  <span className="hidden sm:inline-block font-semibold">
                    {currentUser.name.split(' ')[0]}
                  </span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                </>
              ) : (
                <>
                  {/* Google 'G' icon */}
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z" />
                    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z" />
                    <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z" />
                    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
                  </svg>
                  <span className="hidden sm:inline-block">SIGN IN</span>
                </>
              )}
            </button>

            {/* Direct ORDER NOW CTA */}
            <button
              onClick={onOrderNow}
              id="navbar-order-now-btn"
              className="relative group bg-[#00d2ff] hover:bg-[#33dbff] text-black font-athletic text-sm sm:text-base lg:text-lg font-black tracking-wider py-2 px-3 sm:px-5 rounded-xl transition-all duration-200 shadow-[0_0_20px_rgba(0,210,255,0.35)] hover:shadow-[0_0_25px_rgba(0,210,255,0.55)] cursor-pointer flex items-center gap-1.5 sm:gap-2 active:scale-95"
            >
              <Zap className="w-4 h-4 fill-black" />
              <span>ORDER NOW</span>
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 cursor-pointer transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </header>

      {/* Mobile Animated Slide-down Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed top-[65px] left-0 right-0 z-30 bg-[#090b10]/95 backdrop-blur-2xl border-b border-white/10 lg:hidden overflow-hidden shadow-2xl px-4 py-6"
          >
            {/* Mobile Menu Official Brand Header */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
              <BrandLogo variant="full" size="xs" showSubtitle />
              <span className="text-[10px] font-label-pkg text-[#ff7700] uppercase tracking-widest bg-white/5 px-2.5 py-1 rounded-md border border-white/10">
                75 SERVINGS • 3 MONTHS
              </span>
            </div>

            {/* Google Sign In button in mobile menu */}
            <div className="mb-4">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenLogin();
                }}
                className="w-full py-3 px-4 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-sans text-sm font-semibold flex items-center justify-center gap-2.5 transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z" />
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z" />
                  <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z" />
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
                </svg>
                <span>{currentUser ? `Account: ${currentUser.name}` : 'Sign in with Google'}</span>
              </button>
            </div>

            <div className="space-y-2.5 mb-6">
              {NAV_LINKS.map((link) => {
                const sectionId = link.href.replace('#', '');
                const isActive = activeSection === sectionId;

                return (
                  <button
                    key={link.label}
                    onClick={() => handleNavClick(link.href)}
                    className={`w-full text-left py-2.5 px-4 rounded-xl font-athletic text-lg tracking-wider transition-all flex items-center justify-between cursor-pointer ${
                      isActive
                        ? 'bg-[#00d2ff]/15 text-[#00d2ff] border border-[#00d2ff]/40'
                        : 'text-zinc-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span>{link.label}</span>
                    <ChevronRight className="w-4 h-4 opacity-50" />
                  </button>
                );
              })}
            </div>

            {/* Mobile Contact CTAs for BOTH NUMBERS */}
            <div className="pt-4 border-t border-white/10 space-y-2.5">
              <div className="text-[10px] font-label-pkg uppercase tracking-wider text-zinc-400 mb-1">
                DIRECT CONTACT LINES:
              </div>
              
              {/* Line 2 (91454 78524) */}
              <a
                href={`tel:${BRAND_CONFIG.secondaryPhoneRaw}`}
                className="w-full py-2.5 px-4 rounded-xl bg-white/5 border border-white/10 text-white font-label-pkg text-xs tracking-wider flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#00d2ff]" />
                  <span>Line 2: {BRAND_CONFIG.secondaryPhoneDisplay}</span>
                </div>
                <span className="text-[10px] text-[#00d2ff] font-bold">ORDER DESK</span>
              </a>

              {/* Line 1 (97021 53668) */}
              <a
                href={`tel:${BRAND_CONFIG.ownerPhoneRaw}`}
                className="w-full py-2.5 px-4 rounded-xl bg-white/5 border border-white/10 text-zinc-300 font-label-pkg text-xs tracking-wider flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-zinc-400" />
                  <span>Line 1: {BRAND_CONFIG.ownerPhoneDisplay}</span>
                </div>
                <span className="text-[10px] text-zinc-400">FOUNDER</span>
              </a>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOrderNow();
                }}
                className="w-full bg-[#00d2ff] text-black font-athletic text-xl py-3 rounded-xl flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,210,255,0.4)] cursor-pointer tracking-wider mt-3 font-bold"
              >
                <Zap className="w-4 h-4 fill-black" />
                <span>ORDER NOW — {BRAND_CONFIG.priceDisplay}</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
