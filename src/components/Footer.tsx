import React from 'react';
import { Phone, Instagram, ArrowUp } from 'lucide-react';
import { BRAND_CONFIG } from '../data/productData';

export const Footer: React.FC = () => {
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
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-black border border-[#00d2ff]/60 rounded-lg flex items-center justify-center font-display text-lg font-black text-[#00d2ff]">
                CF
              </div>
              <span className="font-display text-2xl font-black tracking-tight text-white">
                CORE<span className="text-[#00d2ff]">FUEL</span>
              </span>
            </div>
            
            {/* Tagline as requested */}
            <p className="font-display text-xl font-bold text-zinc-200 uppercase tracking-wide">
              "{BRAND_CONFIG.brandTagline}"
            </p>

            <p className="text-zinc-400 text-xs leading-relaxed max-w-sm">
              CoreFuel Nutrition supplies pure, micronized creatine monohydrate built for disciplined, everyday training. 100 servings in refreshing Orange and versatile Flavorless.
            </p>
          </div>

          {/* Quick Links Column */}
          <div className="md:col-span-3 space-y-3">
            <span className="text-xs font-mono-code font-bold uppercase tracking-wider text-white block mb-2">
              NAVIGATION
            </span>
            <ul className="space-y-2 text-xs font-mono-code">
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
            </ul>
          </div>

          {/* Contact Details Column */}
          <div className="md:col-span-4 space-y-3">
            <span className="text-xs font-mono-code font-bold uppercase tracking-wider text-white block mb-2">
              DIRECT OWNER CONTACT
            </span>
            
            {/* Phone Link with Icon */}
            <a
              href={`tel:${BRAND_CONFIG.ownerPhoneRaw}`}
              className="flex items-center gap-2.5 text-zinc-300 hover:text-[#00d2ff] transition-colors text-sm font-medium"
            >
              <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[#00d2ff] shrink-0">
                <Phone className="w-4 h-4" />
              </div>
              <span>{BRAND_CONFIG.ownerPhoneDisplay}</span>
            </a>

            {/* Instagram Link with Icon */}
            <a
              href={BRAND_CONFIG.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 text-zinc-300 hover:text-amber-400 transition-colors text-sm font-medium"
            >
              <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-pink-400 shrink-0">
                <Instagram className="w-4 h-4" />
              </div>
              <span>{BRAND_CONFIG.instagramHandle}</span>
            </a>

            <div className="pt-2 text-[11px] font-mono-code text-zinc-500">
              Orders placed directly via Phone or WhatsApp. No cart or automated checkout required.
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono-code text-zinc-500">
          <div>
            © {new Date().getFullYear()} {BRAND_CONFIG.brandName}. All rights reserved.
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
