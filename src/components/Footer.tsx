import React from 'react';
import { Phone, Instagram, ArrowUp } from 'lucide-react';
import { BRAND_CONFIG } from '../data/productData';
import { BrandLogo } from './BrandLogo';

interface FooterProps {
  onOpenLogin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenLogin }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navLinks = [
    { label: 'Home', href: '#hero' },
    { label: 'Product', href: '#product' },
    { label: 'Benefits', href: '#benefits' },
    { label: 'Why CoreFuel', href: '#why-corefuel' },
    { label: 'FAQ', href: '#faq' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <footer className="bg-[#050608] border-t border-white/10 pt-16 pb-12 text-zinc-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          
          {/* Brand Column */}
          <div className="md:col-span-5 space-y-4">
            <a href="#hero" className="inline-block" aria-label="CoreFuel Nutrition Home">
              <BrandLogo variant="full" size="md" showSubtitle />
            </a>
            
            {/* Tagline as requested */}
            <p className="font-athletic text-xl text-zinc-200 tracking-wider">
              "{BRAND_CONFIG.brandTagline}"
            </p>

            <p className="font-body text-zinc-400 text-xs leading-relaxed max-w-sm">
              CoreFuel Nutrition supplies pure, micronized creatine monohydrate built for disciplined, everyday training. 75 servings in refreshing Orange with 900 mg L-Taurine.
            </p>
          </div>

          {/* Quick Links Column */}
          <div className="md:col-span-3 space-y-3">
            <span className="text-xs font-label-pkg uppercase tracking-wider text-white block mb-2">
              NAVIGATION
            </span>
            <ul className="space-y-2 text-xs font-body">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="hover:text-[#00d2ff] transition-colors flex items-center gap-1.5"
                  >
                    <span>{link.label}</span>
                  </a>
                </li>
              ))}
              {onOpenLogin && (
                <li>
                  <button
                    onClick={onOpenLogin}
                    className="hover:text-[#00d2ff] text-zinc-300 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Athlete Sign In / Portal</span>
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Contact Details Column */}
          <div className="md:col-span-4 space-y-3">
            <span className="text-xs font-label-pkg uppercase tracking-wider text-white block mb-2">
              DIRECT ORDER CONTACTS
            </span>
            
            {/* Phone Link 2 (Order Desk) with Icon */}
            <a
              href={`tel:${BRAND_CONFIG.secondaryPhoneRaw}`}
              className="flex items-center gap-2.5 text-zinc-300 hover:text-[#00d2ff] transition-colors text-sm font-body font-medium"
            >
              <div className="w-8 h-8 rounded-lg bg-[#00d2ff]/10 border border-[#00d2ff]/30 flex items-center justify-center text-[#00d2ff] shrink-0">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] text-zinc-400 block font-mono-code uppercase">Order Desk</span>
                <span className="text-white">{BRAND_CONFIG.secondaryPhoneDisplay}</span>
              </div>
            </a>

            {/* Phone Link 1 (Founder) with Icon */}
            <a
              href={`tel:${BRAND_CONFIG.ownerPhoneRaw}`}
              className="flex items-center gap-2.5 text-zinc-300 hover:text-[#00d2ff] transition-colors text-sm font-body font-medium"
            >
              <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 shrink-0">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] text-zinc-400 block font-mono-code uppercase">Founder Line</span>
                <span>{BRAND_CONFIG.ownerPhoneDisplay}</span>
              </div>
            </a>

            {/* Instagram Link with Icon */}
            <a
              href={BRAND_CONFIG.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 text-zinc-300 hover:text-amber-400 transition-colors text-sm font-body font-medium"
            >
              <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-pink-400 shrink-0">
                <Instagram className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] text-zinc-400 block font-mono-code uppercase">Instagram</span>
                <span>{BRAND_CONFIG.instagramHandle}</span>
              </div>
            </a>

            <div className="pt-2 text-[11px] font-body text-zinc-500">
              Orders dispatched directly across India via Phone or WhatsApp.
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-label-pkg text-zinc-500 tracking-wider">
          <div>
            © {new Date().getFullYear()} {BRAND_CONFIG.brandName}. ALL RIGHTS RESERVED.
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
          >
            <span>BACK TO TOP</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </footer>
  );
};
