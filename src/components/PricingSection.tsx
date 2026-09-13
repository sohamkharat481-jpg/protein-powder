import React from 'react';
import { motion } from 'motion/react';
import { Zap, Check, ShieldCheck, Flame, Phone, MessageSquare } from 'lucide-react';
import { BRAND_CONFIG } from '../data/productData';
import { FlavorId } from '../types';

interface PricingSectionProps {
  onPlaceOrder: (flavorId: FlavorId) => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ onPlaceOrder }) => {
  return (
    <section className="py-24 lg:py-32 bg-[#090b10] relative overflow-hidden border-t border-white/5">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[#ff7700]/5 rounded-full blur-[180px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading as requested */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#ff7700]/10 border border-[#ff7700]/30 text-[#ff7700] text-xs font-label-pkg uppercase tracking-widest mb-4">
            TRANSPARENT DIRECT PURCHASE
          </div>
          <h2 className="font-creatine text-5xl sm:text-7xl text-white leading-none mb-4">
            SIMPLE PRICING.<br />
            <span className="text-[#ff7700]">NO CONFUSION.</span>
          </h2>
          <p className="font-body text-zinc-400 text-base sm:text-lg leading-relaxed">
            No middleman markups, fake coupon games, or confusing subscriptions. Pure formula at an honest price.
          </p>
        </div>

        {/* Single Prominent Pricing Card (ORANGE - 75 SERVINGS - 3 MONTHS) */}
        <div className="max-w-xl mx-auto mb-12">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -4 }}
            className="rounded-3xl bg-[#0e1118] border border-[#ff7700]/40 hover:border-[#ff7700]/70 p-8 sm:p-10 flex flex-col justify-between shadow-[0_25px_60px_rgba(0,0,0,0.85)] transition-all relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-[#ff7700]/10 rounded-full blur-[50px] pointer-events-none" />

            <div>
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ff7700]/15 text-[#ff7700] text-xs font-label-pkg">
                  <Flame className="w-3.5 h-3.5" />
                  CITRUS ORANGE • ACTIVE FLAVOR
                </div>
                <span className="text-xs font-label-pkg text-amber-400 font-semibold tracking-wider">75 SERVINGS • 3 MONTHS</span>
              </div>

              <h3 className="font-creatine text-4xl sm:text-5xl text-white tracking-tight mb-4">
                ORANGE FORMULA
              </h3>

              {/* Price Tag as requested */}
              <div className="mb-6 p-4 rounded-2xl bg-black/40 border border-white/5">
                <div className="font-creatine text-5xl sm:text-6xl text-white tracking-tight leading-none mb-1">
                  {BRAND_CONFIG.priceDisplay}
                </div>
                <div className="text-xs font-label-pkg text-amber-400 tracking-wider">
                  {BRAND_CONFIG.shippingNote}
                </div>
              </div>

              {/* Inclusions */}
              <ul className="space-y-3 mb-8 text-sm text-zinc-300 font-body">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#ff7700]" />
                  <span>75 full servings (3 months supply) of micronized creatine monohydrate</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#ff7700]" />
                  <span>Formulated with 900 mg L-Taurine</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#ff7700]" />
                  <span>Crisp, refreshing citrus flavor profile</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#ff7700]" />
                  <span>Ultra-fine 200-mesh instant dispersion in water</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#ff7700]" />
                  <span>Direct delivery from CoreFuel owner</span>
                </li>
              </ul>
            </div>

            {/* PLACE ORDER Button */}
            <button
              onClick={() => onPlaceOrder('orange')}
              className="w-full bg-[#ff7700] hover:bg-[#ff8c26] text-black font-athletic text-xl tracking-wider py-4 px-6 rounded-xl transition-all shadow-[0_0_25px_rgba(255,119,0,0.35)] cursor-pointer flex items-center justify-center gap-2 active:scale-95"
            >
              <Zap className="w-5 h-5 fill-black" />
              <span>PLACE ORDER NOW — {BRAND_CONFIG.priceDisplay}</span>
            </button>
          </motion.div>
        </div>

        {/* Direct Order Guarantee Strip */}
        <div className="p-6 rounded-2xl bg-black/50 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#00d2ff]/10 border border-[#00d2ff]/30 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-[#00d2ff]" />
            </div>
            <div>
              <div className="font-athletic text-white text-base tracking-wider">DIRECT ORDER GUARANTEE</div>
              <div className="font-body text-xs text-zinc-400">Owner Contact: {BRAND_CONFIG.ownerPhoneDisplay} • Fast Dispatch Across India</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a
              href={`tel:${BRAND_CONFIG.ownerPhoneRaw}`}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-label-pkg text-zinc-200 flex items-center gap-1.5 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#00d2ff]" />
              CALL OWNER
            </a>
            <a
              href={BRAND_CONFIG.generateWhatsAppLink('Orange')}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-[#25D366]/20 hover:bg-[#25D366]/30 border border-[#25D366]/40 text-xs font-label-pkg text-[#25D366] flex items-center gap-1.5 transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              WHATSAPP
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};
