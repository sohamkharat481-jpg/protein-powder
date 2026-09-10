import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Star, ShieldCheck, Zap, ArrowRight, Sparkles, CheckCircle2, ChevronDown, MapPin, Truck } from 'lucide-react';
import { BRAND_CONFIG, FlavorOption } from '../data/productData';

interface HeroSectionProps {
  selectedFlavor: FlavorOption;
  onSelectFlavor: (flavor: FlavorOption) => void;
  flavors: FlavorOption[];
  onBuyNow: () => void;
  onExploreFormula: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  selectedFlavor,
  onSelectFlavor,
  flavors,
  onBuyNow,
  onExploreFormula,
}) => {
  const [pincode, setPincode] = useState('');
  const [pincodeStatus, setPincodeStatus] = useState<string | null>(null);

  const checkPincode = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPin = pincode.trim();
    if (cleanPin.length === 6 && /^\d+$/.test(cleanPin)) {
      if (cleanPin.startsWith('11') || cleanPin.startsWith('40') || cleanPin.startsWith('56') || cleanPin.startsWith('50') || cleanPin.startsWith('60') || cleanPin.startsWith('70') || cleanPin.startsWith('41')) {
        setPincodeStatus(`⚡ Express Delivery Available for ${cleanPin}: Guaranteed delivery in 24–48 hours via BlueDart Air`);
      } else {
        setPincodeStatus(`✓ Standard Delivery to ${cleanPin}: Estimated 2–3 business days with Free Shipping`);
      }
    } else {
      setPincodeStatus('Please enter a valid 6-digit Indian PIN code (e.g. 560001, 400001)');
    }
  };

  return (
    <section
      id="hero"
      className="relative min-h-[calc(100vh-80px)] flex items-center justify-center overflow-hidden bg-[#080809] pt-4 pb-16 lg:py-12"
    >
      {/* Cinematic Ambient Background Lighting */}
      <div className="absolute top-1/4 right-1/4 w-[450px] h-[450px] bg-[#ccff00]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[350px] h-[350px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />
      
      {/* Subtle Grid Lines for Athletic Tech Aesthetic */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* LEFT COLUMN: Editorial Copy & Conversion Controls */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="lg:col-span-7 flex flex-col justify-center text-left"
          >
            {/* Trust & Social Proof Eyebrow + FSSAI & Veg Dot */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <div className="inline-flex items-center gap-2.5 bg-[#131418] border border-white/10 rounded-full px-4 py-1.5 shadow-sm">
                <div className="flex items-center text-[#ccff00]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-[#ccff00]" />
                  ))}
                </div>
                <span className="text-xs font-mono-code text-zinc-300 font-semibold tracking-wider">
                  {BRAND_CONFIG.rating} / 5.0 RATING
                </span>
                <span className="text-zinc-600">•</span>
                <span className="text-xs font-mono-code text-zinc-400">
                  {BRAND_CONFIG.reviewCount} INDIAN ATHLETES
                </span>
              </div>

              {/* 100% Vegetarian Green Dot Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#101912] border border-emerald-500/30 text-emerald-400 text-xs font-mono-code font-bold">
                <span className="w-3 h-3 rounded-sm border border-emerald-500 flex items-center justify-center p-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                </span>
                <span>100% VEGETARIAN</span>
              </div>

              {/* FSSAI Verified Badge */}
              <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-zinc-400 text-[11px] font-mono-code">
                <CheckCircle2 className="w-3 h-3 text-[#ccff00]" />
                <span>{BRAND_CONFIG.fssaiNumber}</span>
              </div>
            </div>

            {/* Main Editorial Headline */}
            <h1 className="font-display text-6xl sm:text-7xl lg:text-8xl xl:text-9xl font-black uppercase tracking-tight text-white leading-[0.9] mb-6">
              TURN ON.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ccff00] via-[#e2fd52] to-white">
                GO HARD.
              </span>
            </h1>

            {/* Editorial Subheadline */}
            <p className="text-lg sm:text-xl text-zinc-300 max-w-2xl font-normal leading-relaxed mb-8">
              Engineered with 8,000mg pure fermented citrulline and 350mg dual-stage caffeine to fuel your training, sharpen your focus, and bring relentless intensity to every gym session.
            </p>

            {/* Spec Bar: Price in INR, Servings, Net Quantity */}
            <div className="grid grid-cols-3 gap-3 p-4 rounded-xl bg-[#111216] border border-white/10 max-w-xl mb-8">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono-code text-zinc-500 uppercase block">PRICE</span>
                  <span className="text-[10px] font-mono-code text-[#ccff00] font-bold">SAVE {BRAND_CONFIG.saveAmount}</span>
                </div>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-2xl sm:text-3xl font-bold font-display text-white tracking-wide">
                    {BRAND_CONFIG.formattedPrice}
                  </span>
                  <span className="text-xs text-zinc-500 line-through">
                    {BRAND_CONFIG.formattedOriginalPrice}
                  </span>
                </div>
                <span className="text-[10px] font-mono-code text-zinc-400 mt-0.5 block">
                  {BRAND_CONFIG.costPerServing}
                </span>
              </div>

              <div className="border-l border-white/10 pl-3">
                <span className="text-[10px] font-mono-code text-zinc-500 uppercase block">SERVINGS</span>
                <span className="text-base font-bold font-display text-zinc-200 mt-0.5 block">
                  {BRAND_CONFIG.servings}
                </span>
                <span className="text-[10px] font-mono-code text-zinc-500 mt-0.5 block">
                  15g Precision Scoop
                </span>
              </div>

              <div className="border-l border-white/10 pl-3">
                <span className="text-[10px] font-mono-code text-zinc-500 uppercase block">NET QUANTITY</span>
                <span className="text-base font-bold font-display text-zinc-200 mt-0.5 block truncate">
                  {BRAND_CONFIG.netQuantity}
                </span>
                <span className="text-[10px] font-mono-code text-zinc-500 mt-0.5 block">
                  UV-Sealed Tub
                </span>
              </div>
            </div>

            {/* Quick Flavor Selector in Hero */}
            <div className="mb-8">
              <div className="flex items-center justify-between max-w-xl mb-2.5">
                <span className="text-xs font-mono-code text-zinc-400 tracking-wider uppercase">
                  SELECTED FLAVOR: <span className="text-white font-bold">{selectedFlavor.name}</span>
                </span>
                <span className="text-xs text-zinc-400 font-mono-code">
                  {selectedFlavor.flavorNotes}
                </span>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {flavors.map((flavor) => {
                  const isSelected = selectedFlavor.id === flavor.id;
                  return (
                    <button
                      key={flavor.id}
                      onClick={() => onSelectFlavor(flavor)}
                      className={`px-4 py-2 rounded-lg text-xs font-mono-code font-bold tracking-wider transition-all flex items-center gap-2 cursor-pointer border ${
                        isSelected
                          ? 'bg-[#ccff00] text-black border-[#ccff00] shadow-[0_0_15px_rgba(204,255,0,0.3)]'
                          : 'bg-[#121316] text-zinc-300 border-white/10 hover:border-white/30'
                      }`}
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: flavor.accentColor }}
                      />
                      <span>{flavor.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Primary & Secondary Call To Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 max-w-xl mb-6">
              <button
                onClick={onBuyNow}
                id="hero-buy-now-button"
                className="group relative flex-1 bg-[#ccff00] hover:bg-[#d9ff33] text-black font-display text-2xl font-black tracking-wide py-4 px-8 rounded-lg transition-all duration-200 shadow-[0_0_30px_rgba(204,255,0,0.3)] hover:shadow-[0_0_40px_rgba(204,255,0,0.5)] active:scale-[0.98] flex items-center justify-center gap-3 cursor-pointer"
              >
                <Zap className="w-5 h-5 fill-black" />
                <span>BUY NOW • {BRAND_CONFIG.formattedPrice}</span>
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={onExploreFormula}
                id="hero-explore-formula-button"
                className="flex-1 bg-[#14151a] hover:bg-[#1c1d24] text-white font-display text-xl font-bold tracking-wide py-4 px-6 rounded-lg border border-white/15 hover:border-white/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>EXPLORE FORMULA</span>
                <ChevronDown className="w-4 h-4 text-zinc-400" />
              </button>
            </div>

            {/* Indian Pincode Delivery Estimator */}
            <div className="max-w-xl mb-6 p-3.5 rounded-xl bg-[#0f1014] border border-white/10">
              <form onSubmit={checkPincode} className="flex items-center gap-2">
                <div className="relative flex-1">
                  <MapPin className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    maxLength={6}
                    value={pincode}
                    onChange={(e) => {
                      setPincode(e.target.value);
                      if (pincodeStatus) setPincodeStatus(null);
                    }}
                    placeholder="Enter 6-digit Pincode (e.g. 560001, 400001)"
                    className="w-full bg-black/40 border border-white/15 pl-9 pr-3 py-2 rounded-lg text-xs font-mono-code text-white placeholder-zinc-500 focus:outline-none focus:border-[#ccff00]"
                  />
                </div>
                <button
                  type="submit"
                  className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-xs font-mono-code text-white font-bold rounded-lg transition-colors cursor-pointer shrink-0"
                >
                  CHECK DELIVERY
                </button>
              </form>
              {pincodeStatus && (
                <div className="mt-2 text-[11px] font-mono-code text-[#ccff00] flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 shrink-0" />
                  <span>{pincodeStatus}</span>
                </div>
              )}
            </div>

            {/* Assurance Badges */}
            <div className="flex flex-wrap items-center gap-5 text-xs text-zinc-400 font-mono-code">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#ccff00]" />
                FREE EXPRESS AIR SHIPPING
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#ccff00]" />
                CASH ON DELIVERY / UPI
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#ccff00]" />
                30-DAY GUARANTEE
              </span>
            </div>
          </motion.div>

          {/* RIGHT COLUMN: 3D Product Jar Showcase with Dramatic Lighting & Floating Particles */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            className="lg:col-span-5 relative flex items-center justify-center"
          >
            {/* Floating Energy Rings & Glow */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-72 h-72 sm:w-96 sm:h-96 rounded-full border border-[#ccff00]/20 animate-pulse" />
              <div className="w-[340px] h-[340px] sm:w-[460px] sm:h-[460px] rounded-full border border-white/5" />
              <div className="w-[420px] h-[420px] sm:w-[540px] sm:h-[540px] rounded-full border border-[#ccff00]/10" />
            </div>

            {/* Central Product Jar Frame */}
            <div className="relative z-10 w-full max-w-[460px] aspect-square rounded-2xl p-3 bg-gradient-to-b from-white/10 via-white/5 to-transparent border border-white/15 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.9)] backdrop-blur-sm group">
              
              {/* Top Pill Tag */}
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20 bg-black/90 border border-[#ccff00]/50 text-[#ccff00] px-4 py-1 rounded-full text-[11px] font-mono-code font-bold tracking-widest uppercase shadow-lg flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>OFFICIAL AUTHENTIC EDITION</span>
              </div>

              {/* Product Image */}
              <div className="w-full h-full rounded-xl overflow-hidden bg-[#0c0d10] relative flex items-center justify-center">
                <img
                  src={selectedFlavor.image}
                  alt={`${BRAND_CONFIG.fullProductTitle} in ${selectedFlavor.name}`}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center transform transition-transform duration-700 group-hover:scale-105"
                />

                {/* Subtle dark gradient overlay on bottom for high contrast label readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#080809] via-transparent to-transparent opacity-60 pointer-events-none" />

                {/* Floating Specs Card */}
                <div className="absolute bottom-4 left-4 right-4 bg-[#121317]/90 backdrop-blur-md border border-white/15 p-3.5 rounded-xl shadow-2xl flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-mono-code text-zinc-400 uppercase tracking-wider">
                      FORMULA KEY
                    </div>
                    <div className="text-sm font-display font-bold text-white tracking-wide">
                      8,000MG CITRULLINE + 350MG CAFFEINE
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] font-mono-code text-[#ccff00] font-bold">
                      IN STOCK
                    </div>
                    <div className="text-xs font-mono-code text-zinc-400">
                      DISPATCHES TODAY
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Energy Particle Accents */}
            <div className="absolute -top-4 -right-4 w-3 h-3 rounded-full bg-[#ccff00] shadow-[0_0_12px_#ccff00] animate-ping" />
            <div className="absolute top-1/2 -left-6 w-2 h-2 rounded-full bg-[#ccff00]/60 shadow-[0_0_8px_#ccff00]" />
            <div className="absolute -bottom-2 right-1/4 w-2.5 h-2.5 rounded-full bg-white/40" />
          </motion.div>

        </div>
      </div>
    </section>
  );
};
