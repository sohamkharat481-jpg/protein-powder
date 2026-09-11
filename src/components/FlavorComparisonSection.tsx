import React from 'react';
import { motion } from 'motion/react';
import { Zap, Flame, Droplets, Check, ArrowRight } from 'lucide-react';
import { BRAND_CONFIG, FLAVOR_VARIANTS, PRODUCT_IMAGES } from '../data/productData';
import { FlavorId } from '../types';

interface FlavorComparisonSectionProps {
  onOrderFlavor: (flavorId: FlavorId) => void;
}

export const FlavorComparisonSection: React.FC<FlavorComparisonSectionProps> = ({
  onOrderFlavor,
}) => {
  return (
    <section className="py-24 lg:py-32 bg-[#090b10] relative overflow-hidden border-t border-white/5">
      {/* Subtle Background Lighting */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-[#ff7700]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-[#00d2ff]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-label-pkg text-[#00d2ff] tracking-widest uppercase block mb-3">
            CHOOSE YOUR EXPERIENCE
          </span>
          <h2 className="font-creatine text-4xl sm:text-6xl lg:text-7xl text-white leading-none mb-4">
            ONE FORMULA.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff7700] via-white to-[#00d2ff]">
              TWO WAYS TO TAKE IT.
            </span>
          </h2>
          <p className="font-body text-zinc-400 text-base sm:text-lg leading-relaxed">
            Both powered by pure micronized creatine monohydrate with 100 full servings. Same performance, two versatile experiences.
          </p>
        </div>

        {/* Comparison Grid: ORANGE on Left, FLAVORLESS on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          
          {/* LEFT: ORANGE */}
          <motion.div
            initial={{ opacity: 0, x: -25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl bg-gradient-to-b from-[#161310] via-[#100e0c] to-[#0a0908] border border-[#ff7700]/30 hover:border-[#ff7700]/60 p-8 flex flex-col justify-between shadow-[0_20px_60px_rgba(255,119,0,0.1)] transition-all group"
          >
            <div>
              {/* Variant Badge & Icon */}
              <div className="flex items-center justify-between mb-6">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ff7700]/15 border border-[#ff7700]/40 text-amber-400 text-xs font-label-pkg">
                  <Flame className="w-3.5 h-3.5 text-[#ff7700]" />
                  900 MG L-TAURINE
                </div>
                <span className="text-xs font-label-pkg text-zinc-500 tracking-wider">100 SERVINGS</span>
              </div>

              {/* Product Visual */}
              <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden bg-black/60 border border-white/10 mb-6 relative flex items-center justify-center p-4">
                <img
                  src={PRODUCT_IMAGES.orangeTub}
                  alt="CoreFuel Creatine Orange"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Title & Copy as requested */}
              <h3 className="font-creatine text-4xl sm:text-5xl text-white tracking-tight mb-2">
                ORANGE
              </h3>
              <p className="font-body text-zinc-300 text-base leading-relaxed mb-6">
                Bold orange flavor for a refreshing creatine routine.
              </p>

              {/* Key Highlights */}
              <ul className="space-y-2.5 mb-8 text-sm text-zinc-400 font-body">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#ff7700]" />
                  <span>Crisp, thirst-quenching citrus taste with chilled water</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#ff7700]" />
                  <span>Formulated with 900 mg L-Taurine per label</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#ff7700]" />
                  <span>Eliminates the chalkiness of plain powders</span>
                </li>
              </ul>
            </div>

            {/* Price & CTA */}
            <div className="pt-6 border-t border-white/10 flex items-center justify-between gap-4">
              <div>
                <span className="text-xs font-label-pkg text-zinc-500 block uppercase tracking-wider">Price</span>
                <div className="font-creatine text-3xl sm:text-4xl text-white tracking-tight">
                  {BRAND_CONFIG.priceDisplay}
                </div>
                <span className="text-[11px] font-label-pkg text-[#ff7700] tracking-wider">
                  {BRAND_CONFIG.shippingNote}
                </span>
              </div>

              <button
                onClick={() => onOrderFlavor('orange')}
                className="bg-[#ff7700] hover:bg-[#ff8c26] text-black font-athletic text-lg tracking-wider px-6 py-3.5 rounded-xl transition-all shadow-[0_0_20px_rgba(255,119,0,0.35)] cursor-pointer flex items-center gap-2 active:scale-95"
              >
                <span>ORDER ORANGE</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>

          {/* RIGHT: FLAVORLESS */}
          <motion.div
            initial={{ opacity: 0, x: 25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl bg-gradient-to-b from-[#10141d] via-[#0d1017] to-[#08090d] border border-[#00d2ff]/30 hover:border-[#00d2ff]/60 p-8 flex flex-col justify-between shadow-[0_20px_60px_rgba(0,210,255,0.1)] transition-all group"
          >
            <div>
              {/* Variant Badge & Icon */}
              <div className="flex items-center justify-between mb-6">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00d2ff]/15 border border-[#00d2ff]/40 text-[#00d2ff] text-xs font-label-pkg">
                  <Droplets className="w-3.5 h-3.5 text-[#00d2ff]" />
                  100% UNFLAVORED
                </div>
                <span className="text-xs font-label-pkg text-zinc-500 tracking-wider">100 SERVINGS</span>
              </div>

              {/* Product Visual */}
              <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden bg-black/60 border border-white/10 mb-6 relative flex items-center justify-center p-4">
                <img
                  src={PRODUCT_IMAGES.flavorlessTub}
                  alt="CoreFuel Creatine Flavorless"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Title & Copy as requested */}
              <h3 className="font-creatine text-4xl sm:text-5xl text-white tracking-tight mb-2">
                FLAVORLESS
              </h3>
              <p className="font-body text-zinc-300 text-base leading-relaxed mb-6">
                Simple and versatile for your preferred drink or shake.
              </p>

              {/* Key Highlights */}
              <ul className="space-y-2.5 mb-8 text-sm text-zinc-400 font-body">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#00d2ff]" />
                  <span>100% pure micronized creatine monohydrate powder</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#00d2ff]" />
                  <span>Zero sweeteners, zero colors, zero added flavors</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#00d2ff]" />
                  <span>Stacks seamlessly with protein shakes or morning juices</span>
                </li>
              </ul>
            </div>

            {/* Price & CTA */}
            <div className="pt-6 border-t border-white/10 flex items-center justify-between gap-4">
              <div>
                <span className="text-xs font-label-pkg text-zinc-500 block uppercase tracking-wider">Price</span>
                <div className="font-creatine text-3xl sm:text-4xl text-white tracking-tight">
                  {BRAND_CONFIG.priceDisplay}
                </div>
                <span className="text-[11px] font-label-pkg text-[#00d2ff] tracking-wider">
                  {BRAND_CONFIG.shippingNote}
                </span>
              </div>

              <button
                onClick={() => onOrderFlavor('flavorless')}
                className="bg-[#00d2ff] hover:bg-[#33dbff] text-black font-athletic text-lg tracking-wider px-6 py-3.5 rounded-xl transition-all shadow-[0_0_20px_rgba(0,210,255,0.35)] cursor-pointer flex items-center gap-2 active:scale-95"
              >
                <span>ORDER FLAVORLESS</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
};
