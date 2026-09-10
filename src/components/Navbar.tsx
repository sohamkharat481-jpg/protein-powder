import React, { useState, useEffect } from 'react';
import { ShoppingBag, Menu, X, ShieldCheck, Zap } from 'lucide-react';
import { BRAND_CONFIG } from '../data/productData';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  onBuyNow: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ cartCount, onOpenCart, onBuyNow }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Shop', href: '#hero' },
    { label: 'Benefits', href: '#benefits' },
    { label: 'Formula', href: '#formula' },
    { label: 'Showcase', href: '#showcase' },
    { label: 'How To Use', href: '#how-to-use' },
    { label: 'Flavors', href: '#flavors' },
    { label: 'Reviews', href: '#reviews' },
    { label: 'FAQ', href: '#faq' },
  ];

  return (
    <>
      {/* Top Banner */}
      <div className="bg-[#111216] border-b border-white/5 py-2 px-4 text-center text-xs font-mono-code text-zinc-400 tracking-wider flex items-center justify-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-[#ccff00] animate-pulse"></span>
        <span>FREE EXPRESS AIR SHIPPING ACROSS INDIA ON ORDERS OVER ₹{BRAND_CONFIG.shippingThreshold.toLocaleString('en-IN')}</span>
        <span className="hidden sm:inline text-zinc-600">•</span>
        <span className="hidden sm:inline text-zinc-400">FSSAI CERTIFIED • 100% VEG • COD AVAILABLE</span>
      </div>

      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#080809]/95 backdrop-blur-md border-b border-white/10 shadow-2xl shadow-black/80 py-3.5'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo */}
          <a
            href="#hero"
            className="flex items-center gap-2.5 group cursor-pointer"
            id="brand-logo-link"
          >
            <div className="w-9 h-9 bg-black border border-[#ccff00]/40 rounded flex items-center justify-center font-display text-xl font-extrabold text-[#ccff00] tracking-tighter group-hover:border-[#ccff00] group-hover:shadow-[0_0_15px_rgba(204,255,0,0.3)] transition-all">
              A
            </div>
            <div className="flex flex-col">
              <span className="font-display text-2xl font-black tracking-tight text-white group-hover:text-zinc-200 leading-none">
                {BRAND_CONFIG.brandLogoText}
              </span>
              <span className="text-[9px] font-mono-code text-zinc-400 tracking-widest uppercase">
                {BRAND_CONFIG.brandLogoSubtitle}
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium tracking-wide text-zinc-300 hover:text-[#ccff00] transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[#ccff00] hover:after:w-full after:transition-all"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Actions: Buy Now + Cart */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenCart}
              className="relative p-2.5 rounded-lg border border-white/10 bg-[#121316] hover:border-[#ccff00]/40 hover:bg-[#18191f] transition-all text-white cursor-pointer"
              aria-label="View Cart"
              id="navbar-cart-button"
            >
              <ShoppingBag className="w-5 h-5 text-zinc-200" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#ccff00] text-black text-[11px] font-mono-code font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              onClick={onBuyNow}
              className="hidden sm:inline-flex items-center justify-center gap-2 bg-[#ccff00] hover:bg-[#d9ff33] text-black font-display text-lg font-bold px-5 py-2 rounded tracking-wide transition-all duration-200 active:scale-95 shadow-[0_0_20px_rgba(204,255,0,0.25)] hover:shadow-[0_0_25px_rgba(204,255,0,0.4)] cursor-pointer"
              id="navbar-buy-button"
            >
              <Zap className="w-4 h-4 fill-black" />
              <span>BUY NOW</span>
              <span className="text-black/60 font-mono-code text-xs ml-1">• {BRAND_CONFIG.formattedPrice}</span>
            </button>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-lg border border-white/10 bg-[#121316] text-white hover:border-zinc-500 cursor-pointer"
              aria-label="Toggle navigation"
              id="mobile-nav-toggle"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#0e0f12] border-b border-white/10 px-6 py-5 mt-3 space-y-4">
            <div className="grid grid-cols-2 gap-2">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2.5 text-sm font-medium text-zinc-300 hover:text-[#ccff00] bg-zinc-900/60 rounded border border-white/5"
                >
                  {link.label}
                </a>
              ))}
            </div>
            <div className="pt-2 border-t border-white/10 flex flex-col gap-3">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onBuyNow();
                }}
                className="w-full bg-[#ccff00] text-black font-display text-xl font-bold py-3 rounded flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4 fill-black" />
                BUY NOW • {BRAND_CONFIG.formattedPrice}
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
