import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Zap, Phone, ChevronRight } from 'lucide-react';
import { BRAND_CONFIG } from '../data/productData';

interface NavbarProps {
  onOrderNow: () => void;
}

const NAV_LINKS = [
  { label: 'Home', href: '#hero' },
  { label: 'Product', href: '#product' },
  { label: 'Benefits', href: '#benefits' },
  { label: 'Why CoreFuel', href: '#why-corefuel' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Contact', href: '#contact' },
];

export const Navbar: React.FC<NavbarProps> = ({ onOrderNow }) => {
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
            : 'py-5 bg-transparent border-b border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* LEFT: CoreFuel Logo */}
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('#hero');
            }}
            className="flex items-center gap-2.5 group cursor-pointer"
          >
            <div className="w-9 h-9 bg-black border border-[#00d2ff]/60 rounded-lg flex items-center justify-center font-display text-xl font-black text-[#00d2ff] tracking-tighter group-hover:border-[#00d2ff] group-hover:shadow-[0_0_15px_rgba(0,210,255,0.4)] transition-all">
              CF
            </div>
            <div className="flex flex-col">
              <span className="font-display text-2xl font-black tracking-tight text-white leading-none">
                CORE<span className="text-[#00d2ff]">FUEL</span>
              </span>
              <span className="text-[10px] font-mono-code text-zinc-400 tracking-widest leading-none mt-0.5">
                NUTRITION
              </span>
            </div>
          </a>

          {/* CENTER: Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2 p-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
            {NAV_LINKS.map((link) => {
              const sectionId = link.href.replace('#', '');
              const isActive = activeSection === sectionId;

              return (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(link.href);
                  }}
                  className={`px-4 py-1.5 rounded-full text-xs font-mono-code font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-[#00d2ff] text-black shadow-[0_0_15px_rgba(0,210,255,0.4)]'
                      : 'text-zinc-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>

          {/* RIGHT: ORDER NOW Button & Mobile Menu Toggle */}
          <div className="flex items-center gap-3">
            {/* Direct ORDER NOW CTA */}
            <button
              onClick={onOrderNow}
              id="navbar-order-now-btn"
              className="relative group bg-[#00d2ff] hover:bg-[#33dbff] text-black font-display text-base sm:text-lg font-black tracking-wide py-2 px-4 sm:px-6 rounded-xl transition-all duration-200 shadow-[0_0_20px_rgba(0,210,255,0.35)] hover:shadow-[0_0_25px_rgba(0,210,255,0.55)] cursor-pointer flex items-center gap-2 active:scale-95"
            >
              <Zap className="w-4 h-4 fill-black" />
              <span>ORDER NOW</span>
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 cursor-pointer transition-colors"
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
            className="fixed top-[65px] left-0 right-0 z-30 bg-[#090b10]/95 backdrop-blur-2xl border-b border-white/10 md:hidden overflow-hidden shadow-2xl px-4 py-6"
          >
            <div className="space-y-3 mb-6">
              {NAV_LINKS.map((link) => {
                const sectionId = link.href.replace('#', '');
                const isActive = activeSection === sectionId;

                return (
                  <button
                    key={link.label}
                    onClick={() => handleNavClick(link.href)}
                    className={`w-full text-left py-3 px-4 rounded-xl font-display text-xl font-bold uppercase tracking-wider transition-all flex items-center justify-between cursor-pointer ${
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

            {/* Mobile Call CTA */}
            <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
              <a
                href={`tel:${BRAND_CONFIG.ownerPhoneRaw}`}
                className="w-full py-3 px-4 rounded-xl bg-white/5 border border-white/10 text-white font-mono-code text-xs font-bold flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4 text-[#00d2ff]" />
                <span>Call Owner: {BRAND_CONFIG.ownerPhoneDisplay}</span>
              </a>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOrderNow();
                }}
                className="w-full bg-[#00d2ff] text-black font-display text-xl font-black py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,210,255,0.4)] cursor-pointer"
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
