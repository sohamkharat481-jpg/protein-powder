import React from 'react';
import { motion } from 'motion/react';
import { Phone, MessageSquare, Instagram, ExternalLink, Sparkles, Zap, ShieldCheck } from 'lucide-react';
import { BRAND_CONFIG } from '../data/productData';
import { BrandLogo } from './BrandLogo';

export const ContactSection: React.FC = () => {
  return (
    <section id="contact" className="py-24 lg:py-32 bg-[#090b10] relative overflow-hidden border-t border-white/5">
      {/* Background Accent Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-[#00d2ff]/10 rounded-full blur-[200px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        
        {/* Brand Logo Presentation */}
        <div className="flex flex-col items-center gap-3 mb-6">
          <BrandLogo variant="full" size="md" showSubtitle />
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#00d2ff]/10 border border-[#00d2ff]/30 text-[#00d2ff] text-xs font-mono-code font-bold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            DIRECT HUMAN SUPPORT
          </div>
        </div>

        {/* Headline as requested */}
        <h2 className="font-display text-5xl sm:text-7xl lg:text-8xl font-black uppercase text-white tracking-tight leading-[0.92] mb-6">
          READY TO FUEL<br />
          <span className="text-[#00d2ff]">YOUR TRAINING?</span>
        </h2>

        {/* Copy as requested */}
        <p className="text-xl sm:text-2xl text-zinc-300 font-medium max-w-2xl mx-auto mb-10">
          Place your CoreFuel order directly with us.
        </p>

        {/* Direct Contact Info Highlight Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto mb-10 text-left">
          {/* Phone Card 1: Line 2 (91454 78524) */}
          <div className="p-5 rounded-2xl bg-[#0e1118] border border-[#00d2ff]/30 flex items-center gap-4 relative overflow-hidden group">
            <div className="w-12 h-12 rounded-xl bg-[#00d2ff]/15 border border-[#00d2ff]/30 flex items-center justify-center text-[#00d2ff] shrink-0">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="text-[10px] font-mono-code text-[#00d2ff] uppercase tracking-wider font-bold">
                  Order Line (Instant)
                </span>
              </div>
              <a
                href={`tel:${BRAND_CONFIG.secondaryPhoneRaw}`}
                className="font-display text-xl sm:text-2xl font-bold text-white hover:text-[#00d2ff] transition-colors"
              >
                {BRAND_CONFIG.secondaryPhoneDisplay}
              </a>
            </div>
          </div>

          {/* Phone Card 2: Line 1 (97021 53668) */}
          <div className="p-5 rounded-2xl bg-[#0e1118] border border-white/10 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-300 shrink-0">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-mono-code text-zinc-400 uppercase tracking-wider block mb-0.5">
                Founder Direct Line
              </span>
              <a
                href={`tel:${BRAND_CONFIG.ownerPhoneRaw}`}
                className="font-display text-xl sm:text-2xl font-bold text-white hover:text-[#00d2ff] transition-colors"
              >
                {BRAND_CONFIG.ownerPhoneDisplay}
              </a>
            </div>
          </div>

          {/* Instagram Card */}
          <div className="p-5 rounded-2xl bg-[#0e1118] border border-white/10 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#f09433] via-[#e6683c] to-[#bc1888] flex items-center justify-center text-white shrink-0 shadow-lg">
              <Instagram className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-mono-code text-zinc-400 uppercase tracking-wider block mb-0.5">
                Official Instagram
              </span>
              <a
                href={BRAND_CONFIG.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-display text-lg font-bold text-white hover:text-amber-400 transition-colors"
              >
                {BRAND_CONFIG.instagramHandle}
              </a>
            </div>
          </div>
        </div>

        {/* Action Buttons as requested */}
        <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4 max-w-3xl mx-auto">
          {/* CALL TO ORDER (Line 2: 91454 78524) */}
          <a
            href={`tel:${BRAND_CONFIG.secondaryPhoneRaw}`}
            className="w-full sm:w-auto flex-1 min-w-[200px] bg-white/10 hover:bg-white/20 text-white font-display text-lg sm:text-xl font-black py-4 px-6 rounded-2xl border border-white/20 hover:border-white/40 transition-all flex items-center justify-center gap-2.5 cursor-pointer shadow-lg active:scale-95"
          >
            <Phone className="w-5 h-5 text-[#00d2ff]" />
            <span>CALL ({BRAND_CONFIG.secondaryPhoneDisplay})</span>
          </a>

          {/* WHATSAPP TO ORDER (Line 2: 91454 78524) */}
          <a
            href={BRAND_CONFIG.generateWhatsAppLink('Orange', 'secondary')}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto flex-1 min-w-[220px] bg-[#25D366] hover:bg-[#20bd5a] text-black font-display text-lg sm:text-xl font-black py-4 px-6 rounded-2xl transition-all shadow-[0_0_25px_rgba(37,211,102,0.35)] hover:shadow-[0_0_35px_rgba(37,211,102,0.5)] flex items-center justify-center gap-2.5 cursor-pointer active:scale-95"
          >
            <MessageSquare className="w-5 h-5 fill-black" />
            <span>WHATSAPP TO ORDER</span>
          </a>

          {/* FOLLOW ON INSTAGRAM */}
          <a
            href={BRAND_CONFIG.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto flex-1 min-w-[200px] bg-gradient-to-r from-[#bc1888] to-[#e6683c] hover:opacity-90 text-white font-display text-lg sm:text-xl font-black py-4 px-6 rounded-2xl transition-all shadow-[0_0_25px_rgba(230,104,60,0.35)] flex items-center justify-center gap-2.5 cursor-pointer active:scale-95"
          >
            <Instagram className="w-5 h-5" />
            <span>INSTAGRAM</span>
          </a>
        </div>

        {/* Pricing Subtext */}
        <p className="text-xs font-mono-code text-zinc-500 mt-8">
          CoreFuel Micronized Creatine Monohydrate • {BRAND_CONFIG.priceDisplay} ({BRAND_CONFIG.shippingNote}) • 25 Servings
        </p>

      </div>
    </section>
  );
};
