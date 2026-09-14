import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, ArrowRight, ShieldCheck, ChevronDown, Sparkles, Flame, Droplets, CheckCircle2 } from 'lucide-react';
import { BRAND_CONFIG, FLAVOR_VARIANTS, PRODUCT_IMAGES } from '../data/productData';
import { FlavorId, FlavorVariant } from '../types';
import { BrandLogo } from './BrandLogo';
import { ProductImage } from './ProductImage';

interface HeroSectionProps {
  selectedFlavorId: FlavorId;
  onSelectFlavor: (flavorId: FlavorId) => void;
  onOrderNow: () => void;
  onExploreProduct: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  selectedFlavorId,
  onSelectFlavor,
  onOrderNow,
  onExploreProduct,
}) => {
  const currentVariant: FlavorVariant = FLAVOR_VARIANTS[selectedFlavorId];
  const isOrange = selectedFlavorId === 'orange';

  // Words for word-by-word animation: "POWER", "EVERY", "REP."
  const headlineWords = ['POWER', 'EVERY', 'REP.'];

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#07080a] pt-24 pb-20 lg:py-24"
    >
      {/* Subtle Floating Ambient Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {[...Array(14)].map((_, i) => (
          <motion.div
            key={i}
            initial={{
              x: Math.sin(i * 1.5) * 400 + (i * 90),
              y: (i * 70) % 700 + 50,
              opacity: 0.15 + ((i % 5) * 0.05),
              scale: 0.6 + ((i % 3) * 0.4),
            }}
            animate={{
              y: [null, '-=60', '+=20'],
              x: [null, '+=30', '-=30'],
              opacity: [0.2, 0.45, 0.2],
            }}
            transition={{
              duration: 8 + (i % 6) * 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className={`absolute w-1.5 h-1.5 rounded-full ${
              i % 3 === 0
                ? 'bg-[#00d2ff] shadow-[0_0_10px_#00d2ff]'
                : i % 3 === 1
                ? 'bg-[#ff7700] shadow-[0_0_10px_#ff7700]'
                : 'bg-white shadow-[0_0_10px_white]'
            }`}
          />
        ))}
      </div>

      {/* Dynamic Atmospheric Glow behind Product & Hero */}
      <div
        className={`absolute top-1/3 right-1/4 w-[550px] h-[550px] rounded-full blur-[170px] pointer-events-none transition-colors duration-700 z-0 ${
          isOrange ? 'bg-[#ff7700]/15' : 'bg-[#00d2ff]/15'
        }`}
      />
      <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-[#00d2ff]/10 rounded-full blur-[160px] pointer-events-none z-0" />

      {/* Subtle Engineered Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* LEFT: Typography & Order Direct Actions */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            
            {/* Top Brand Pill with Official CF Symbol */}
            <motion.div
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md w-fit mb-5 shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
            >
              <BrandLogo variant="symbol" size="xs" />
              <span className="font-micronized text-xs uppercase text-zinc-200 font-semibold tracking-[0.25em]">
                {BRAND_CONFIG.brandName} • 75 SERVINGS
              </span>
            </motion.div>

            {/* Headline with Word-by-Word Reveal - Matching CREATINE on packaging */}
            <h1 className="font-creatine text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-white leading-[0.88] mb-4 flex flex-wrap gap-x-3 sm:gap-x-4">
              {headlineWords.map((word, idx) => (
                <motion.span
                  key={word}
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.15 * idx, ease: 'easeOut' }}
                  className={
                    idx === 2
                      ? 'text-transparent bg-clip-text bg-gradient-to-r from-[#00d2ff] via-[#5ce0ff] to-white drop-shadow-[0_0_35px_rgba(0,210,255,0.4)]'
                      : 'text-white'
                  }
                >
                  {word}
                </motion.span>
              ))}
            </h1>

            {/* Subheadline - Clean modern readable sans-serif */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.55 }}
              className="font-body text-xl sm:text-2xl text-zinc-300 font-normal leading-relaxed mb-6 max-w-2xl"
            >
              {BRAND_CONFIG.subheadline}
            </motion.p>

            {/* Price Badge as requested: "₹549/-" "+ shipping charges" */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.65 }}
              className="flex items-baseline gap-3 mb-6 p-3.5 rounded-2xl bg-[#0e1118]/90 border border-white/10 w-fit backdrop-blur-md shadow-lg"
            >
              <div className="flex items-baseline gap-2.5">
                <span className="font-creatine text-4xl sm:text-5xl text-white tracking-tight">
                  {BRAND_CONFIG.priceDisplay}
                </span>
                <span className="text-xs font-label-pkg uppercase text-[#00d2ff] bg-[#00d2ff]/15 px-2.5 py-1 rounded border border-[#00d2ff]/30 tracking-wider">
                  {BRAND_CONFIG.shippingNote}
                </span>
              </div>
              <span className="text-xs font-label-pkg text-zinc-400 tracking-wider hidden sm:inline">
                • 75 SERVINGS
              </span>
            </motion.div>

            {/* SINGLE ACTIVE FLAVOR DISPLAY (ORANGE ONLY) */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.75 }}
              className="p-4 rounded-2xl bg-[#0d0f15] border border-[#ff7700]/30 max-w-xl mb-8 shadow-xl"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#ff7700]/15 border border-[#ff7700]/30 flex items-center justify-center text-[#ff7700]">
                    <Flame className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-athletic text-2xl text-white tracking-wider uppercase leading-none">
                        ORANGE FLAVOR
                      </span>
                      <span className="text-[10px] font-label-pkg text-amber-300 bg-[#ff7700]/20 px-2 py-0.5 rounded border border-[#ff7700]/30 uppercase tracking-wider">
                        ACTIVE FLAVOR
                      </span>
                    </div>
                    <p className="text-xs font-label-pkg text-zinc-400 mt-1">
                      Formulated with 900 mg L-Taurine • 75 Full Servings
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-creatine text-2xl text-white tracking-tight">
                    {BRAND_CONFIG.priceDisplay}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* CTAs: ORDER NOW and EXPLORE PRODUCT */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.85 }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 max-w-xl mb-6"
            >
              {/* Primary CTA: ORDER NOW */}
              <button
                onClick={onOrderNow}
                id="hero-order-now-btn"
                className="group relative flex-1 bg-[#00d2ff] hover:bg-[#33dbff] text-black font-athletic text-2xl tracking-wider py-4 px-8 rounded-xl transition-all duration-200 shadow-[0_0_30px_rgba(0,210,255,0.4)] hover:shadow-[0_0_40px_rgba(0,210,255,0.6)] active:scale-[0.98] flex items-center justify-center gap-3 cursor-pointer"
              >
                <Zap className="w-5 h-5 fill-black" />
                <span>ORDER NOW</span>
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </button>

              {/* Secondary CTA: EXPLORE PRODUCT */}
              <button
                onClick={onExploreProduct}
                id="hero-explore-product-btn"
                className="flex-1 bg-[#12141a] hover:bg-[#181b24] text-white font-athletic text-xl tracking-wider py-4 px-6 rounded-xl border border-white/15 hover:border-[#00d2ff]/40 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>EXPLORE PRODUCT</span>
                <ChevronDown className="w-4 h-4 text-zinc-400" />
              </button>
            </motion.div>

            {/* Direct Order Trust Strip */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-400 font-label-pkg tracking-wider">
              <span className="flex items-center gap-1.5 text-zinc-300">
                <ShieldCheck className="w-4 h-4 text-[#00d2ff]" />
                ORDER DESK: {BRAND_CONFIG.secondaryPhoneDisplay} / {BRAND_CONFIG.ownerPhoneDisplay}
              </span>
              <span className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                WHATSAPP & CALL DIRECT DISPATCH
              </span>
            </div>

          </div>

          {/* RIGHT: Product Presentation with Scale + Upward Entrance & Smooth Floating Effect */}
          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: 35 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease: 'easeOut' }}
            className="lg:col-span-5 relative flex items-center justify-center"
          >
            {/* Subtle floating wrapper */}
            <motion.div
              animate={{ y: [-6, 6, -6] }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="relative z-10 w-full max-w-[480px] aspect-square rounded-3xl p-3 bg-gradient-to-b from-white/10 via-[#10131a]/90 to-[#090b10] border border-white/15 shadow-[0_30px_90px_-15px_rgba(0,0,0,0.95)] backdrop-blur-md group"
            >
              {/* Floating Badge */}
              <div
                className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20 px-4 py-1 rounded-full text-xs font-label-pkg tracking-widest uppercase shadow-lg flex items-center gap-1.5 border bg-[#090b10] border-[#ff7700]/60 text-amber-400"
              >
                <Flame className="w-3.5 h-3.5 text-[#ff7700]" />
                <span>ACTIVE FLAVOR • 75 SERVINGS</span>
              </div>

              {/* Product Visual Container with Crossfade & Luxury Transition */}
              <div className="w-full h-full rounded-2xl overflow-hidden bg-[#07090c] relative flex items-center justify-center p-2">
                <AnimatePresence mode="wait">
                  <motion.div
                    key="orange-variant"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    transition={{ duration: 0.4 }}
                    className="w-full h-full flex items-center justify-center"
                  >
                    <ProductImage
                      variant="orange"
                      alt={`${BRAND_CONFIG.productName} - Orange Variant`}
                      className="w-full h-full object-contain object-center p-2 rounded-xl group-hover:scale-105 transition-transform duration-700"
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Subtle bottom lighting overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#07080a] via-transparent to-transparent opacity-60 pointer-events-none" />

                {/* Bottom Overlay Info Tag */}
                <div className="absolute bottom-3 left-3 right-3 bg-[#0c0e14]/90 backdrop-blur-md border border-white/15 p-3 rounded-xl shadow-2xl flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-micronized text-zinc-400 uppercase tracking-widest">
                      ACTIVE FORMULA
                    </div>
                    <div className="text-lg font-creatine text-white tracking-tight flex items-center gap-1.5">
                      <span>COREFUEL</span>
                      <span className="text-amber-400">
                        ORANGE
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-base font-creatine text-white tracking-tight">
                      {BRAND_CONFIG.priceDisplay}
                    </div>
                    <div className="text-[10px] font-label-pkg text-[#00d2ff] tracking-wider">
                      {BRAND_CONFIG.shippingNote}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
