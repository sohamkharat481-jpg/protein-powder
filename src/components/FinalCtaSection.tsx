import React from 'react';
import { motion } from 'motion/react';
import { Zap, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { BRAND_CONFIG, FlavorOption } from '../data/productData';

interface FinalCtaSectionProps {
  selectedFlavor: FlavorOption;
  onBuyNow: () => void;
}

export const FinalCtaSection: React.FC<FinalCtaSectionProps> = ({ selectedFlavor, onBuyNow }) => {
  return (
    <section className="py-28 bg-[#080809] relative overflow-hidden border-t border-white/10">
      
      {/* Dramatic Backlight & Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#ccff00]/10 rounded-full blur-[180px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-gradient-to-b from-[#14151b] via-[#0f1014] to-[#080809] border border-white/15 rounded-3xl p-8 sm:p-12 lg:p-16 shadow-[0_30px_90px_rgba(0,0,0,0.9)] relative overflow-hidden">
          
          {/* Subtle Grid overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none opacity-40" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
            
            {/* Left Copy & Direct CTA */}
            <div className="lg:col-span-7 text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-black/60 border border-[#ccff00]/40 text-xs font-mono-code text-[#ccff00] uppercase tracking-widest mb-6">
                <Zap className="w-3.5 h-3.5 fill-[#ccff00]" />
                <span>COMMITTED ATHLETE PROTOCOL</span>
              </div>

              {/* Exact Headline from Prompt */}
              <h2 className="font-display text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black uppercase text-white tracking-tight leading-[0.9] mb-6">
                YOUR NEXT SESSION<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ccff00] to-white">
                  STARTS HERE.
                </span>
              </h2>

              {/* Exact Subheadline from Prompt */}
              <p className="text-lg sm:text-xl text-zinc-300 max-w-xl font-normal leading-relaxed mb-8">
                Fuel your routine. Lock in your focus. Make every session count.
              </p>

              {/* Price & Guarantee snippet */}
              <div className="flex items-center gap-6 mb-8 flex-wrap">
                <div>
                  <span className="text-[10px] font-mono-code text-zinc-500 uppercase block">PRICE</span>
                  <div className="flex items-baseline gap-2">
                    <span className="font-display text-4xl font-black text-white">
                      {BRAND_CONFIG.formattedPrice}
                    </span>
                    <span className="text-sm font-mono-code text-zinc-500 line-through">
                      {BRAND_CONFIG.formattedOriginalPrice}
                    </span>
                  </div>
                </div>

                <div className="border-l border-white/10 pl-6">
                  <span className="text-[10px] font-mono-code text-zinc-500 uppercase block">SERVINGS</span>
                  <span className="font-display text-2xl font-bold text-zinc-200">
                    {BRAND_CONFIG.servings}
                  </span>
                </div>

                <div className="border-l border-white/10 pl-6">
                  <span className="text-[10px] font-mono-code text-zinc-500 uppercase block">FLAVOR</span>
                  <span className="font-display text-2xl font-bold text-[#ccff00]">
                    {selectedFlavor.name}
                  </span>
                </div>
              </div>

              {/* Large CTA Button (BUY NOW →) */}
              <button
                onClick={onBuyNow}
                id="final-cta-buy-now-button"
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-4 bg-[#ccff00] hover:bg-[#d9ff33] text-black font-display text-3xl font-black tracking-wide py-5 px-10 rounded-xl transition-all duration-200 shadow-[0_0_35px_rgba(204,255,0,0.35)] hover:shadow-[0_0_50px_rgba(204,255,0,0.55)] active:scale-[0.98] cursor-pointer"
              >
                <span>BUY NOW →</span>
              </button>

              {/* Assurances */}
              <div className="mt-8 flex flex-wrap items-center gap-5 text-xs text-zinc-400 font-mono-code">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#ccff00]" />
                  Ships in 24 Hours via BlueDart Air
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#ccff00]" />
                  Instant UPI & Cash on Delivery
                </span>
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#ccff00]" />
                  30-Day Money-Back Guarantee
                </span>
              </div>
            </div>

            {/* Right: Product Image beside CTA */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-[380px] aspect-square rounded-2xl bg-[#0d0e12] border border-white/15 p-4 shadow-2xl group">
                <img
                  src={selectedFlavor.image}
                  alt={`${BRAND_CONFIG.productName} Pre-Workout Tub`}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover rounded-xl transition-transform duration-500 group-hover:scale-105"
                />

                <div className="absolute bottom-6 left-6 right-6 bg-black/85 backdrop-blur-md border border-white/15 p-3 rounded-xl flex items-center justify-between text-xs font-mono-code">
                  <span className="text-zinc-300">CLINICAL FORMULATION</span>
                  <span className="text-[#ccff00] font-bold">100% TRANSPARENT</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
