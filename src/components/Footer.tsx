import React from 'react';
import { Mail, Instagram, Headphones, Shield, ArrowUp, Zap, CheckCircle2, Phone } from 'lucide-react';
import { BRAND_CONFIG } from '../data/productData';

interface FooterProps {
  onOpenLegal: (type: 'privacy' | 'terms' | 'shipping' | 'refund') => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenLegal }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#060708] border-t border-white/10 text-zinc-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-16">
          
          {/* Col 1: Brand & Identity */}
          <div className="lg:col-span-2">
            <a href="#hero" className="flex items-center gap-2.5 mb-4 group cursor-pointer">
              <div className="w-9 h-9 bg-black border border-[#ccff00]/50 rounded flex items-center justify-center font-display text-xl font-extrabold text-[#ccff00] tracking-tighter">
                A
              </div>
              <div className="flex flex-col">
                <span className="font-display text-2xl font-black tracking-tight text-white leading-none">
                  {BRAND_CONFIG.brandLogoText}
                </span>
                <span className="text-[9px] font-mono-code text-zinc-500 tracking-widest uppercase">
                  {BRAND_CONFIG.brandLogoSubtitle}
                </span>
              </div>
            </a>

            <p className="text-zinc-400 text-xs sm:text-sm max-w-sm leading-relaxed mb-4">
              A high-performance sports nutrition pre-workout engineered for focused athletes and serious lifters across India. 100% transparent clinical dosages. Zero banned stimulants.
            </p>

            <div className="space-y-1.5 text-xs font-mono-code text-zinc-400">
              <div className="flex items-center gap-2 text-[#ccff00]">
                <span className="w-2 h-2 rounded-full bg-[#ccff00] animate-pulse" />
                <span>{BRAND_CONFIG.fssaiNumber}</span>
              </div>
              <div className="text-zinc-500">
                100% Vegetarian (Green Dot) • US FDA Registered Facility • Informed-Choice Tested
              </div>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div>
            <h4 className="text-xs font-mono-code font-bold uppercase tracking-wider text-white mb-4">
              NAVIGATION
            </h4>
            <ul className="space-y-2.5 text-xs font-mono-code">
              <li>
                <a href="#hero" className="hover:text-[#ccff00] transition-colors">
                  Shop Pre-Workout
                </a>
              </li>
              <li>
                <a href="#formula" className="hover:text-[#ccff00] transition-colors">
                  Formula & Ingredients
                </a>
              </li>
              <li>
                <a href="#showcase" className="hover:text-[#ccff00] transition-colors">
                  Packaging & Scoop
                </a>
              </li>
              <li>
                <a href="#how-to-use" className="hover:text-[#ccff00] transition-colors">
                  How To Use & Dosage
                </a>
              </li>
              <li>
                <a href="#reviews" className="hover:text-[#ccff00] transition-colors">
                  Athlete Reviews
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-[#ccff00] transition-colors">
                  Frequently Asked Questions
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Legal Links */}
          <div>
            <h4 className="text-xs font-mono-code font-bold uppercase tracking-wider text-white mb-4">
              POLICIES & TRUST
            </h4>
            <ul className="space-y-2.5 text-xs font-mono-code">
              <li>
                <button
                  onClick={() => onOpenLegal('privacy')}
                  className="hover:text-[#ccff00] transition-colors text-left cursor-pointer"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenLegal('terms')}
                  className="hover:text-[#ccff00] transition-colors text-left cursor-pointer"
                >
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenLegal('shipping')}
                  className="hover:text-[#ccff00] transition-colors text-left cursor-pointer"
                >
                  Shipping & Delivery (India)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenLegal('refund')}
                  className="hover:text-[#ccff00] transition-colors text-left cursor-pointer"
                >
                  30-Day Money-Back Policy
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Social */}
          <div>
            <h4 className="text-xs font-mono-code font-bold uppercase tracking-wider text-white mb-4">
              INDIAN ATHLETE SUPPORT
            </h4>
            <ul className="space-y-3 text-xs font-mono-code">
              <li>
                <a
                  href={`mailto:${BRAND_CONFIG.supportEmail}`}
                  className="flex items-center gap-2 hover:text-[#ccff00] transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-[#ccff00]" />
                  <span>{BRAND_CONFIG.supportEmail}</span>
                </a>
              </li>
              <li>
                <a
                  href={`tel:${BRAND_CONFIG.supportPhone}`}
                  className="flex items-center gap-2 hover:text-[#ccff00] transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-[#ccff00]" />
                  <span>{BRAND_CONFIG.supportPhone} (10 AM - 7 PM IST)</span>
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-[#ccff00] transition-colors"
                >
                  <Instagram className="w-3.5 h-3.5 text-[#ccff00]" />
                  <span>{BRAND_CONFIG.instagramHandle}</span>
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Indian Payment Gateway & Certification Badges */}
        <div className="py-6 border-y border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs font-mono-code text-zinc-400">
          <div className="flex items-center gap-2">
            <span className="text-zinc-500 uppercase">ACCEPTED PAYMENT METHODS:</span>
            <div className="flex items-center gap-2 flex-wrap text-white font-bold">
              <span className="px-2 py-1 bg-white/5 rounded border border-white/10 text-[11px]">UPI (GPAY / PHONEPE / PAYTM)</span>
              <span className="px-2 py-1 bg-white/5 rounded border border-white/10 text-[11px]">RUPAY / VISA / MASTERCARD</span>
              <span className="px-2 py-1 bg-white/5 rounded border border-white/10 text-[11px]">NETBANKING</span>
              <span className="px-2 py-1 bg-white/5 rounded border border-white/10 text-[11px]">CASH ON DELIVERY (COD)</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[#ccff00] font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              100% AUTHENTICITY GUARANTEE
            </span>
          </div>
        </div>

        {/* FSSAI & Nutraceutical Compliance Notice */}
        <div className="p-5 rounded-xl bg-[#0d0e12] border border-white/10 my-8 text-[11px] font-mono-code text-zinc-500 leading-relaxed">
          <div className="flex items-start gap-2.5">
            <Shield className="w-4 h-4 text-[#ccff00] shrink-0 mt-0.5" />
            <div>
              <strong className="text-zinc-300 font-bold block mb-1">
                FSSAI COMPLIANCE & NUTRACEUTICAL USAGE NOTICE ({BRAND_CONFIG.fssaiNumber})
              </strong>
              *This product is a health supplement and not for medicinal use. Dietary food supplements should not be used as a substitute for a varied diet. Not recommended for children, pregnant or lactating women, or individuals sensitive to caffeine. High caffeine content (350mg per recommended daily serving of 15g). Do not exceed the recommended daily usage.
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Back to Top */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono-code text-zinc-500">
          <div>
            © {new Date().getFullYear()} {BRAND_CONFIG.brandName} Private Limited • {BRAND_CONFIG.productName}. All rights reserved. Prices inclusive of all taxes (GST 18%).
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 text-zinc-400 hover:text-[#ccff00] transition-colors cursor-pointer"
          >
            <span>BACK TO TOP</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </footer>
  );
};
