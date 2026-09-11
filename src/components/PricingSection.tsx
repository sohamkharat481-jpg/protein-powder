import React from 'react';
import { motion } from 'motion/react';
import { Zap, Check, ShieldCheck, Flame, Droplets, Phone, MessageSquare } from 'lucide-react';
import { BRAND_CONFIG } from '../data/productData';
import { FlavorId } from '../types';

interface PricingSectionProps {
  onPlaceOrder: (flavorId: FlavorId) => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ onPlaceOrder }) => {
  return (
    <section className="py-24 lg:py-32 bg-[#090b10] relative overflow-hidden border-t border-white/5">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[#00d2ff]/5 rounded-full blur-[180px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading as requested */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#00d2ff]/10 border border-[#00d2ff]/30 text-[#00d2ff] text-xs font-label-pkg uppercase tracking-widest mb-4">
            TRANSPARENT DIRECT PURCHASE
          </div>
          <h2 className="font-creatine text-5xl sm:text-7xl text-white leading-none mb-4">
            SIMPLE PRICING.<br />
            <span className="text-[#00d2ff]">NO CONFUSION.</span>
          </h2>
          <p className="font-body text-zinc-400 text-base sm:text-lg leading-relaxed">
            No middleman markups, fake coupon games, or confusing subscriptions. Pure formula at an honest price.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          
          {/* ORANGE CARD */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -6 }}
            className="rounded-3xl bg-[#0e1118] border border-[#ff7700]/30 hover:border-[#ff7700]/60 p-8 sm:p-10 flex flex-col justify-between shadow-[0_20px_50px_rgba(0,0,0,0.8)] transition-all relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#ff7700]/10 rounded-full blur-[40px] pointer-events-none" />

            <div>
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ff7700]/15 text-[#ff7700] text-xs font-label-pkg">
                  <Flame className="w-3.5 h-3.5" />
                  CITRUS ORANGE
                </div>
                <span className="text-xs font-label-pkg text-zinc-500 tracking-wider">100 SERVINGS</span>
              </div>

              <h3 className="font-creatine text-4xl sm:text-5xl text-white tracking-tight mb-4">
                ORANGE
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
                  <span>100 full servings of micronized creatine</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#ff7700]" />
                  <span>Formulated with 900 mg L-Taurine</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#ff7700]" />
                  <span>Refreshing citrus flavor profile</span>
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
              className="w-full bg-[#ff7700] hover:bg-[#ff8c26] text-black font-athletic text-xl tracking-wider py-4 px-6 rounded-xl transition-all shadow-[0_0_20px_rgba(255,119,0,0.35)] cursor-pointer flex items-center justify-center gap-2 active:scale-95"
            >
              <Zap className="w-5 h-5 fill-black" />
              <span>PLACE ORDER</span>
            </button>
          </motion.div>

          {/* FLAVORLESS CARD */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            whileHover={{ y: -6 }}
            className="rounded-3xl bg-[#0e1118] border border-[#00d2ff]/30 hover:border-[#00d2ff]/60 p-8 sm:p-10 flex flex-col justify-between shadow-[0_20px_50px_rgba(0,0,0,0.8)] transition-all relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#00d2ff]/10 rounded-full blur-[40px] pointer-events-none" />

            <div>
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00d2ff]/15 text-[#00d2ff] text-xs font-label-pkg">
                  <Droplets className="w-3.5 h-3.5" />
                  100% UNFLAVORED
                </div>
                <span className="text-xs font-label-pkg text-zinc-500 tracking-wider">100 SERVINGS</span>
              </div>

              <h3 className="font-creatine text-4xl sm:text-5xl text-white tracking-tight mb-4">
                FLAVORLESS
              </h3>

              {/* Price Tag as requested */}
              <div className="mb-6 p-4 rounded-2xl bg-black/40 border border-white/5">
                <div className="font-creatine text-5xl sm:text-6xl text-white tracking-tight leading-none mb-1">
                  {BRAND_CONFIG.priceDisplay}
                </div>
                <div className="text-xs font-label-pkg text-[#00d2ff] tracking-wider">
                  {BRAND_CONFIG.shippingNote}
                </div>
              </div>

              {/* Inclusions */}
              <ul className="space-y-3 mb-8 text-sm text-zinc-300 font-body">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#00d2ff]" />
                  <span>100 full servings of micronized creatine</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#00d2ff]" />
                  <span>Zero sweeteners, zero flavors, zero additives</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#00d2ff]" />
                  <span>Ideal for stacking into whey protein shakes</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#00d2ff]" />
                  <span>Direct delivery from CoreFuel owner</span>
                </li>
              </ul>
            </div>

            {/* PLACE ORDER Button */}
            <button
              onClick={() => onPlaceOrder('flavorless')}
              className="w-full bg-[#00d2ff] hover:bg-[#33dbff] text-black font-athletic text-xl tracking-wider py-4 px-6 rounded-xl transition-all shadow-[0_0_20px_rgba(0,210,255,0.35)] cursor-pointer flex items-center justify-center gap-2 active:scale-95"
            >
              <Zap className="w-5 h-5 fill-black" />
              <span>PLACE ORDER</span>
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
              href={BRAND_CONFIG.generateWhatsAppLink('Orange or Flavorless')}
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
