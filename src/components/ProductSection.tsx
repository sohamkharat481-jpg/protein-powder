import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Sparkles, Check, Zap, Flame, Droplets, ArrowRight } from 'lucide-react';
import { BRAND_CONFIG, FLAVOR_VARIANTS, PRODUCT_INFO_GRID } from '../data/productData';
import { FlavorId } from '../types';
import { BrandLogo } from './BrandLogo';

interface ProductSectionProps {
  selectedFlavorId: FlavorId;
  onSelectFlavor: (flavorId: FlavorId) => void;
  onOrderNow: (flavorId: FlavorId) => void;
}

export const ProductSection: React.FC<ProductSectionProps> = ({
  selectedFlavorId,
  onSelectFlavor,
  onOrderNow,
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  // Parallax subtle shifts
  const imageY = useTransform(scrollYProgress, [0, 1], [-20, 20]);
  const imageRotate = useTransform(scrollYProgress, [0, 1], [-1.5, 1.5]);

  const currentVariant = FLAVOR_VARIANTS[selectedFlavorId];
  const isOrange = selectedFlavorId === 'orange';

  return (
    <section
      id="product"
      ref={sectionRef}
      className="py-24 lg:py-32 bg-[#090a0e] relative overflow-hidden border-t border-white/5"
    >
      {/* Dynamic Background Lighting that shifts with scroll */}
      <motion.div
        style={{ y: imageY }}
        className={`absolute top-1/3 left-1/4 w-[500px] h-[500px] rounded-full blur-[170px] pointer-events-none transition-colors duration-700 ${
          isOrange ? 'bg-[#ff7700]/10' : 'bg-[#00d2ff]/10'
        }`}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Headline */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#00d2ff]/10 border border-[#00d2ff]/30 text-[#00d2ff] text-xs font-label-pkg uppercase tracking-widest mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            PURE PERFORMANCE SPECIFICATION
          </div>
          <h2 className="font-creatine text-4xl sm:text-6xl lg:text-7xl text-white leading-none mb-4">
            YOUR DAILY CREATINE. <span className="text-[#00d2ff]">SIMPLIFIED.</span>
          </h2>
          <p className="font-body text-zinc-400 text-base sm:text-lg leading-relaxed">
            A transparent, uncompromised formula engineered for lifters and athletes. No fillers, no exaggerated hype. Just 100 pure servings built for your daily training.
          </p>
        </div>

        {/* Large Detailed Product Display with Parallax */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
          
          {/* LEFT: Large Product Visual with Subtle Parallax Tilt */}
          <div className="lg:col-span-6 flex justify-center">
            <motion.div
              style={{ y: imageY, rotate: imageRotate }}
              className="relative w-full max-w-[480px] aspect-square rounded-3xl overflow-hidden bg-gradient-to-b from-[#12151f] to-[#07090c] border border-white/15 p-4 shadow-[0_30px_80px_rgba(0,0,0,0.85)] group"
            >
              <img
                src={currentVariant.image}
                alt={`${BRAND_CONFIG.productName} - ${currentVariant.name}`}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-700"
              />

              <div className="absolute top-6 left-6 bg-black/80 backdrop-blur-md border border-white/10 px-3.5 py-1.5 rounded-full text-xs font-label-pkg flex items-center gap-2">
                <BrandLogo variant="symbol" size="xs" />
                <span className={isOrange ? 'text-amber-400 font-semibold' : 'text-[#00d2ff] font-semibold'}>
                  {currentVariant.name.toUpperCase()} VARIANT
                </span>
              </div>

              <div className="absolute bottom-6 right-6 bg-black/80 backdrop-blur-md border border-white/10 px-3.5 py-1 rounded-full text-xs font-label-pkg text-white tracking-wider">
                100 SERVINGS • 200-MESH
              </div>
            </motion.div>
          </div>

          {/* RIGHT: Detailed Authentic Specifications */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <BrandLogo variant="full" size="sm" showSubtitle className="mb-3" />
              <h3 className="flex flex-col mb-2">
                <span className="font-creatine text-4xl sm:text-6xl text-white leading-[0.9]">
                  CREATINE
                </span>
                <span className="font-monohydrate text-xl sm:text-2xl text-zinc-300 tracking-[0.22em] mt-1">
                  MONOHYDRATE
                </span>
              </h3>
              <div className="text-xs font-micronized text-zinc-400 tracking-[0.2em] uppercase font-semibold">
                MICRONIZED • 100 SERVINGS • {BRAND_CONFIG.priceDisplay} ({BRAND_CONFIG.shippingNote})
              </div>
            </div>

            <p className="font-body text-zinc-300 text-base leading-relaxed">
              CoreFuel Creatine Monohydrate is micronized to an ultra-fine 200-mesh powder for rapid dispersion in liquid. Designed specifically to replenish cellular ATP stores during high-intensity training.
            </p>

            {/* Packaging and Formula Facts */}
            <div className="space-y-3 pt-2">
              <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 flex items-start gap-3">
                <div className="w-6 h-6 rounded bg-[#00d2ff]/10 border border-[#00d2ff]/30 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5 text-[#00d2ff]" />
                </div>
                <div>
                  <span className="text-base font-athletic text-white tracking-wide block">100 Full Servings per Container</span>
                  <span className="text-xs font-body text-zinc-400">Generous pack size giving you over 3 months of consistent daily supplementation.</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 flex items-start gap-3">
                <div className="w-6 h-6 rounded bg-[#ff7700]/10 border border-[#ff7700]/30 flex items-center justify-center shrink-0 mt-0.5">
                  <Flame className="w-3.5 h-3.5 text-[#ff7700]" />
                </div>
                <div>
                  <span className="text-base font-athletic text-white tracking-wide block">900 mg L-Taurine on Orange Packaging</span>
                  <span className="text-xs font-body text-zinc-400">The Orange variant includes 900 mg L-Taurine as shown directly on the product label claim.</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 flex items-start gap-3">
                <div className="w-6 h-6 rounded bg-white/10 border border-white/20 flex items-center justify-center shrink-0 mt-0.5">
                  <Droplets className="w-3.5 h-3.5 text-white" />
                </div>
                <div>
                  <span className="text-base font-athletic text-white tracking-wide block">Two Distinct Flavors: Orange & Flavorless</span>
                  <span className="text-xs font-body text-zinc-400">Choose between refreshing citrus orange or 100% pure neutral powder for mixing into whey.</span>
                </div>
              </div>
            </div>

            {/* Quick Order Button */}
            <div className="pt-3">
              <button
                onClick={() => onOrderNow(selectedFlavorId)}
                className="inline-flex items-center gap-2.5 bg-[#00d2ff] hover:bg-[#33dbff] text-black font-athletic text-xl tracking-wider py-3.5 px-7 rounded-xl transition-all shadow-[0_0_20px_rgba(0,210,255,0.35)] cursor-pointer active:scale-95"
              >
                <Zap className="w-5 h-5 fill-black" />
                <span>ORDER {currentVariant.name.toUpperCase()} NOW — {BRAND_CONFIG.priceDisplay}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

        {/* Premium Information Grid as requested:
            MICRONIZED CREATINE
            100 SERVINGS
            2 FLAVORS
            DAILY TRAINING
        */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {PRODUCT_INFO_GRID.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="p-6 sm:p-7 rounded-2xl bg-[#0c0e14] border border-white/10 hover:border-[#00d2ff]/40 transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="font-creatine text-3xl sm:text-4xl lg:text-5xl text-white leading-none tracking-tight group-hover:text-[#00d2ff] transition-colors mb-1">
                  {item.kicker}
                </div>
                <div className="font-athletic text-xl sm:text-2xl text-zinc-200 tracking-wider mb-3">
                  {item.label}
                </div>
                <p className="font-body text-zinc-400 text-xs sm:text-sm leading-relaxed">
                  {item.subtext}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-white/5 text-[10px] font-label-pkg text-zinc-500 tracking-widest">
                COREFUEL SPECIFICATION
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
