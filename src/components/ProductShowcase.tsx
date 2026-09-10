import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, Compass, Layers, Sparkles, Droplets, Utensils, Maximize2 } from 'lucide-react';
import { SHOWCASE_ANGLES, BRAND_CONFIG, FlavorOption } from '../data/productData';

interface ProductShowcaseProps {
  selectedFlavor: FlavorOption;
}

export const ProductShowcase: React.FC<ProductShowcaseProps> = ({ selectedFlavor }) => {
  const [activeAngleIndex, setActiveAngleIndex] = useState(0);

  const activeAngle = SHOWCASE_ANGLES[activeAngleIndex];

  return (
    <section id="showcase" className="py-24 bg-[#0a0b0e] relative border-y border-white/5 overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-[#ccff00]/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-14 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#16181f] border border-white/10 text-xs font-mono-code text-[#ccff00] uppercase tracking-widest mb-4">
            <Camera className="w-3.5 h-3.5" />
            <span>EDITORIAL VISUAL ARCHIVE</span>
          </div>
          <h2 className="font-display text-5xl sm:text-6xl lg:text-7xl font-black uppercase text-white tracking-tight leading-none mb-4">
            YOUR PRE. YOUR RITUAL.
          </h2>
          <p className="text-zinc-400 text-base sm:text-lg max-w-2xl leading-relaxed">
            From the tactile scoop and ultra-micronized crystal texture to the crisp dissolution in cold water—every touchpoint is engineered for elite training preparation.
          </p>
        </div>

        {/* Showcase Grid: Left Main Focus + Right Thumbnails / Specs */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Main Visual Display (8 Cols) */}
          <div className="lg:col-span-8 flex flex-col justify-between">
            <div className="relative aspect-[4/3] sm:aspect-[16/10] rounded-2xl overflow-hidden bg-[#111217] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] group">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeAngle.id}
                  src={activeAngle.image}
                  alt={activeAngle.title}
                  referrerPolicy="no-referrer"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="w-full h-full object-cover object-center"
                />
              </AnimatePresence>

              {/* Dark vignette overlay for text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />

              {/* Angle Tag Badge */}
              <div className="absolute top-4 left-4 z-10">
                <span className="px-3 py-1.5 rounded-md bg-black/70 backdrop-blur-md border border-white/15 text-[11px] font-mono-code text-[#ccff00] tracking-wider uppercase font-bold">
                  {activeAngle.tag}
                </span>
              </div>

              {/* Floating Product Specification Overlay (Requested in Prompt) */}
              <div className="absolute bottom-6 left-6 right-6 z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <div className="text-xs font-mono-code text-[#ccff00] uppercase font-bold tracking-wider mb-1">
                    {activeAngle.specLabel}: {activeAngle.specValue}
                  </div>
                  <h3 className="font-display text-3xl sm:text-4xl font-black text-white uppercase tracking-wide">
                    {activeAngle.title}
                  </h3>
                  <p className="text-sm text-zinc-300 max-w-lg mt-1">
                    {activeAngle.caption}
                  </p>
                </div>

                <div className="bg-black/60 backdrop-blur-md border border-white/10 px-4 py-2 rounded-lg shrink-0">
                  <span className="text-[10px] font-mono-code text-zinc-400 block uppercase">FRAME VIEW</span>
                  <span className="text-sm font-mono-code font-bold text-white">0{activeAngleIndex + 1} / 04</span>
                </div>
              </div>
            </div>

            {/* Angle Selectors / Thumbnails Below */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
              {SHOWCASE_ANGLES.map((angle, idx) => (
                <button
                  key={angle.id}
                  onClick={() => setActiveAngleIndex(idx)}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                    activeAngleIndex === idx
                      ? 'bg-[#181a22] border-[#ccff00] shadow-[0_0_15px_rgba(204,255,0,0.15)]'
                      : 'bg-[#111216] border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-black">
                    <img
                      src={angle.image}
                      alt={angle.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="overflow-hidden">
                    <div className="text-[10px] font-mono-code text-[#ccff00] truncate uppercase font-bold">
                      {angle.tag.split('//')[0]}
                    </div>
                    <div className="text-xs font-bold text-white truncate">
                      {angle.title}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Floating Product Information Sidecard (4 Cols) */}
          <div className="lg:col-span-4 flex flex-col justify-between bg-[#121318] border border-white/10 rounded-2xl p-6 sm:p-7">
            <div>
              <div className="text-xs font-mono-code text-zinc-500 uppercase tracking-widest mb-2">
                PRODUCT PROFILE
              </div>
              <h3 className="font-display text-3xl font-black uppercase text-white tracking-wide mb-6">
                RITUAL METRICS
              </h3>

              {/* Floating product information items (Prompt requirements) */}
              <div className="space-y-4">
                
                {/* 1. Servings */}
                <div className="p-4 rounded-xl bg-black/40 border border-white/10">
                  <div className="flex items-center gap-2 text-xs font-mono-code text-zinc-400 mb-1">
                    <Layers className="w-4 h-4 text-[#ccff00]" />
                    <span>SERVINGS PER CONTAINER</span>
                  </div>
                  <div className="text-xl font-display font-bold text-white">
                    {BRAND_CONFIG.servings}
                  </div>
                  <div className="text-xs text-zinc-400 mt-0.5">
                    30 days of high-intent preparation (15g per scoop)
                  </div>
                </div>

                {/* 2. Flavor */}
                <div className="p-4 rounded-xl bg-black/40 border border-white/10">
                  <div className="flex items-center gap-2 text-xs font-mono-code text-zinc-400 mb-1">
                    <Sparkles className="w-4 h-4 text-[#ccff00]" />
                    <span>SELECTED FLAVOR</span>
                  </div>
                  <div className="text-xl font-display font-bold text-white flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: selectedFlavor.accentColor }} />
                    <span>{selectedFlavor.name}</span>
                  </div>
                  <div className="text-xs text-zinc-400 mt-0.5">
                    {selectedFlavor.flavorNotes}
                  </div>
                </div>

                {/* 3. Net Quantity */}
                <div className="p-4 rounded-xl bg-black/40 border border-white/10">
                  <div className="flex items-center gap-2 text-xs font-mono-code text-zinc-400 mb-1">
                    <Droplets className="w-4 h-4 text-[#ccff00]" />
                    <span>NET QUANTITY</span>
                  </div>
                  <div className="text-xl font-display font-bold text-white">
                    {BRAND_CONFIG.netQuantity}
                  </div>
                  <div className="text-xs text-zinc-400 mt-0.5">
                    Sealed in nitrogen-flushed UV matte tub
                  </div>
                </div>

                {/* 4. Suggested Use */}
                <div className="p-4 rounded-xl bg-black/40 border border-white/10">
                  <div className="flex items-center gap-2 text-xs font-mono-code text-zinc-400 mb-1">
                    <Utensils className="w-4 h-4 text-[#ccff00]" />
                    <span>SUGGESTED USE</span>
                  </div>
                  <div className="text-base font-semibold text-zinc-200">
                    Take 1 scoop in 10-14 oz water 20-30 min pre-workout
                  </div>
                  <div className="text-xs text-zinc-500 mt-1">
                    Start with 1/2 scoop to gauge initial tolerance
                  </div>
                </div>

              </div>
            </div>

            {/* Quality seal */}
            <div className="mt-6 pt-5 border-t border-white/10 flex items-center justify-between text-xs font-mono-code text-zinc-400">
              <span>ZERO CHALK • INSTANT MIX</span>
              <span className="text-[#ccff00] font-bold">100% SOLUBLE</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
