import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Sparkles, Check, Zap, Flame, Droplets, ArrowRight } from 'lucide-react';
import { BRAND_CONFIG, FLAVOR_VARIANTS, PRODUCT_INFO_GRID } from '../data/productData';
import { FlavorId } from '../types';
import { BrandLogo } from './BrandLogo';
import { ProductImage } from './ProductImage';

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

  const isOrange = selectedFlavorId === 'orange';
  const currentVariant = isOrange ? FLAVOR_VARIANTS.orange : FLAVOR_VARIANTS.flavorless;

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
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#00d2ff]/10 border border-[#00d2ff]/30 text-[#00d2ff] text-xs font-label-pkg uppercase tracking-widest mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            PURE PERFORMANCE SPECIFICATION
          </div>
          <h2 className="font-creatine text-4xl sm:text-6xl lg:text-7xl text-white leading-none mb-4">
            YOUR DAILY CREATINE. <span className="text-[#00d2ff]">SIMPLIFIED.</span>
          </h2>
          <p className="font-body text-zinc-400 text-base sm:text-lg leading-relaxed">
            A transparent, uncompromised formula engineered for lifters and athletes. No fillers, no exaggerated hype. Just 25 pure servings built for daily training.
          </p>
        </div>

        {/* Prominent Variant Selector Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12">
          <span className="text-xs font-label-pkg text-zinc-400 uppercase tracking-widest font-semibold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#00d2ff]" />
            CHOOSE VARIANT:
          </span>
          <div className="inline-flex p-1.5 rounded-2xl bg-black/70 border border-white/15 backdrop-blur-md shadow-lg">
            <button
              id="product-variant-orange"
              type="button"
              onClick={() => onSelectFlavor('orange')}
              className={`px-6 py-2.5 rounded-xl font-athletic tracking-wider text-base transition-all cursor-pointer flex items-center gap-2.5 ${
                isOrange
                  ? 'bg-[#ff7700] text-black shadow-[0_0_20px_rgba(255,119,0,0.4)] font-bold'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className={`w-2.5 h-2.5 rounded-full ${isOrange ? 'bg-black' : 'bg-[#ff7700]'}`} />
              <span>ORANGE</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded font-label-pkg ${isOrange ? 'bg-black/20 text-black font-semibold' : 'bg-white/10 text-zinc-400'}`}>
                TAURINE
              </span>
            </button>
            <button
              id="product-variant-unflavoured"
              type="button"
              onClick={() => onSelectFlavor('flavorless')}
              className={`px-6 py-2.5 rounded-xl font-athletic tracking-wider text-base transition-all cursor-pointer flex items-center gap-2.5 ${
                !isOrange
                  ? 'bg-[#00d2ff] text-black shadow-[0_0_20px_rgba(0,210,255,0.4)] font-bold'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className={`w-2.5 h-2.5 rounded-full ${!isOrange ? 'bg-black' : 'bg-[#00d2ff]'}`} />
              <span>UNFLAVOURED</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded font-label-pkg ${!isOrange ? 'bg-black/20 text-black font-semibold' : 'bg-white/10 text-zinc-400'}`}>
                PURE
              </span>
            </button>
          </div>
        </div>

        {/* Large Detailed Product Display with Parallax */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
          
          {/* LEFT: Large Product Visual with Subtle Parallax Tilt */}
          <div className="lg:col-span-6 flex justify-center">
            <motion.div
              style={{ y: imageY, rotate: imageRotate }}
              className="relative w-full max-w-[480px] aspect-square rounded-3xl overflow-hidden bg-gradient-to-b from-[#12151f] to-[#07090c] border border-white/15 p-4 shadow-[0_30px_80px_rgba(0,0,0,0.85)] group"
            >
              <ProductImage
                key={selectedFlavorId}
                variant={isOrange ? 'orange' : 'flavorless'}
                alt={`${BRAND_CONFIG.productName} - ${isOrange ? 'Orange' : 'Unflavoured'} Variant`}
                className="w-full h-full object-contain rounded-2xl group-hover:scale-105 transition-transform duration-700 p-2"
              />

              <div className="absolute top-6 left-6 bg-black/80 backdrop-blur-md border border-white/10 px-3.5 py-1.5 rounded-full text-xs font-label-pkg flex items-center gap-2">
                <BrandLogo variant="symbol" size="xs" />
                <span
                  className={`font-semibold ${
                    isOrange ? 'text-amber-400' : 'text-[#00d2ff]'
                  }`}
                >
                  {isOrange ? 'ORANGE VARIANT' : 'UNFLAVOURED'}
                </span>
              </div>

              <div className="absolute bottom-6 right-6 bg-black/80 backdrop-blur-md border border-white/10 px-3.5 py-1 rounded-full text-xs font-label-pkg text-white tracking-wider">
                25 SERVINGS • 200-MESH
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

              {/* Flavor Selector in Spec Column */}
              <div className="pt-2">
                <span className="text-xs font-label-pkg text-zinc-400 uppercase tracking-widest block mb-2 font-semibold">
                  SELECT FLAVOR:
                </span>
                <div className="grid grid-cols-2 gap-3">
                  {(['orange', 'flavorless'] as const).map((flavorKey) => {
                    const isSelected = selectedFlavorId === flavorKey;
                    const isItemOrange = flavorKey === 'orange';
                    const displayName = isItemOrange ? 'Orange' : 'Unflavoured';

                    return (
                      <button
                        key={flavorKey}
                        id={`product-flavor-${flavorKey}`}
                        type="button"
                        onClick={() => onSelectFlavor(flavorKey)}
                        className={`p-3 rounded-xl border font-athletic tracking-wider text-base transition-all cursor-pointer flex items-center justify-center gap-2.5 ${
                          isSelected
                            ? isItemOrange
                              ? 'bg-[#ff7700] text-black border-[#ff7700] shadow-[0_0_18px_rgba(255,119,0,0.35)] font-bold'
                              : 'bg-[#00d2ff] text-black border-[#00d2ff] shadow-[0_0_18px_rgba(0,210,255,0.35)] font-bold'
                            : 'bg-black/50 text-zinc-300 border-white/15 hover:border-white/40'
                        }`}
                      >
                        <span
                          className={`w-2.5 h-2.5 rounded-full ${
                            isItemOrange ? 'bg-[#ff7700]' : 'bg-[#00d2ff]'
                          } ${isSelected ? 'ring-2 ring-black' : ''}`}
                        />
                        <span>{displayName.toUpperCase()}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <p className="font-body text-zinc-300 text-base leading-relaxed">
              {currentVariant.description}
            </p>

            {/* Packaging and Formula Facts */}
            <div className="space-y-3 pt-2">
              <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 flex items-start gap-3">
                <div className={`w-6 h-6 rounded flex items-center justify-center shrink-0 mt-0.5 ${
                  isOrange ? 'bg-[#ff7700]/10 border border-[#ff7700]/30' : 'bg-[#00d2ff]/10 border border-[#00d2ff]/30'
                }`}>
                  <Check className={`w-3.5 h-3.5 ${isOrange ? 'text-[#ff7700]' : 'text-[#00d2ff]'}`} />
                </div>
                <div>
                  <span className="text-base font-athletic text-white tracking-wide block">
                    25 Full Servings per Container
                  </span>
                  <span className="text-xs font-body text-zinc-400">
                    Generous pack size giving you 25 days of consistent daily supplementation.
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 flex items-start gap-3">
                <div className={`w-6 h-6 rounded flex items-center justify-center shrink-0 mt-0.5 ${
                  isOrange ? 'bg-[#ff7700]/10 border border-[#ff7700]/30' : 'bg-[#00d2ff]/10 border border-[#00d2ff]/30'
                }`}>
                  <Flame className={`w-3.5 h-3.5 ${isOrange ? 'text-[#ff7700]' : 'text-[#00d2ff]'}`} />
                </div>
                <div>
                  <span className="text-base font-athletic text-white tracking-wide block">
                    {isOrange ? '900 mg L-Taurine Formulation' : currentVariant.highlightText}
                  </span>
                  <span className="text-xs font-body text-zinc-400">
                    {isOrange
                      ? 'The Orange variant includes 900 mg L-Taurine as shown directly on the product label claim.'
                      : 'Pure micronized creatine monohydrate with zero added flavorings, sweeteners, or fillers.'}
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 flex items-start gap-3">
                <div className={`w-6 h-6 rounded flex items-center justify-center shrink-0 mt-0.5 ${
                  isOrange ? 'bg-[#ff7700]/10 border border-[#ff7700]/30' : 'bg-[#00d2ff]/10 border border-[#00d2ff]/30'
                }`}>
                  <Sparkles className={`w-3.5 h-3.5 ${isOrange ? 'text-[#ff7700]' : 'text-[#00d2ff]'}`} />
                </div>
                <div>
                  <span className="text-base font-athletic text-white tracking-wide block">
                    {isOrange ? 'Signature Orange Formula' : 'Unflavoured Pure Formula'}
                  </span>
                  <span className="text-xs font-body text-zinc-400">
                    {isOrange
                      ? 'Crisp, refreshing citrus engineered to mix easily with cold water for pre- or post-workout.'
                      : currentVariant.bestFor}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Order Button */}
            <div className="pt-3">
              <button
                id="product-order-cta-btn"
                onClick={() => onOrderNow(selectedFlavorId)}
                className={`inline-flex items-center gap-2.5 font-athletic text-xl tracking-wider py-3.5 px-7 rounded-xl transition-all cursor-pointer active:scale-95 ${
                  isOrange
                    ? 'bg-[#ff7700] hover:bg-[#ff8c26] text-black shadow-[0_0_20px_rgba(255,119,0,0.35)]'
                    : 'bg-[#00d2ff] hover:bg-[#33dbff] text-black shadow-[0_0_20px_rgba(0,210,255,0.35)]'
                }`}
              >
                <Zap className="w-5 h-5 fill-black" />
                <span>
                  {isOrange ? `ORDER NOW — ${currentVariant.formattedPrice}` : 'ORDER UNFLAVOURED NOW — ₹549/-'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

        {/* Premium Information Grid as requested:
            MICRONIZED CREATINE
            25 SERVINGS
            ORANGE / UNFLAVOURED FLAVOR
            DAILY TRAINING
        */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {[
            {
              kicker: 'MICRONIZED',
              label: 'CREATINE',
              subtext: 'Ultra-fine 200-mesh powder for easy mixing',
            },
            {
              kicker: '25',
              label: 'SERVINGS',
              subtext: '25 full servings of daily training supply',
            },
            {
              kicker: isOrange ? 'ORANGE' : 'UNFLAVOURED',
              label: 'FLAVOR',
              subtext: isOrange
                ? 'Refreshing citrus formulated with 900 mg L-Taurine'
                : 'Pure 200-mesh powder with zero added flavorings',
            },
            {
              kicker: 'DAILY',
              label: 'TRAINING',
              subtext: 'Replenish cellular ATP stores consistently',
            },
          ].map((item, idx) => (
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
