import React from 'react';
import { motion } from 'motion/react';
import { Check, Sparkles, Zap, ShoppingBag, ShieldCheck, Droplet } from 'lucide-react';
import { BRAND_CONFIG, FlavorOption } from '../data/productData';

interface FlavorSectionProps {
  selectedFlavor: FlavorOption;
  onSelectFlavor: (flavor: FlavorOption) => void;
  flavors: FlavorOption[];
  onBuyNow: () => void;
  onAddToCart: () => void;
}

export const FlavorSection: React.FC<FlavorSectionProps> = ({
  selectedFlavor,
  onSelectFlavor,
  flavors,
  onBuyNow,
  onAddToCart,
}) => {
  return (
    <section id="flavors" className="py-24 bg-[#0c0d11] relative border-y border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-14 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#16181f] border border-white/10 text-xs font-mono-code text-[#ccff00] uppercase tracking-widest mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>SIGNATURE PROFILES</span>
          </div>
          <h2 className="font-display text-5xl sm:text-6xl lg:text-7xl font-black uppercase text-white tracking-tight leading-none mb-4">
            SELECT YOUR FLAVOR.
          </h2>
          <p className="text-zinc-400 text-base sm:text-lg max-w-2xl leading-relaxed">
            Naturally flavored and balanced without artificial syrupy sweetness or chemical aftertaste. Crisp, thirst-quenching, and formulated to drink effortlessly before high-demand sessions.
          </p>
        </div>

        {/* Main Interactive Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left: Product Image that changes dynamically with selected flavor */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="relative w-full max-w-[440px] aspect-square rounded-2xl bg-[#111217] border border-white/10 p-4 shadow-2xl overflow-hidden group">
              
              {/* Radial glow matching the flavor's accent color */}
              <div
                className="absolute inset-0 opacity-20 blur-3xl transition-all duration-700 pointer-events-none"
                style={{ backgroundColor: selectedFlavor.accentColor }}
              />

              <img
                src={selectedFlavor.image}
                alt={`${BRAND_CONFIG.productName} - ${selectedFlavor.name}`}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center rounded-xl transition-all duration-500 group-hover:scale-105"
              />

              {/* Floating Active Badge */}
              <div className="absolute top-6 left-6 z-10">
                <span className="px-3.5 py-1.5 rounded-md bg-black/80 backdrop-blur-md border border-white/15 text-xs font-mono-code text-white uppercase font-bold flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: selectedFlavor.accentColor }}
                  />
                  <span>CURRENT: {selectedFlavor.name}</span>
                </span>
              </div>

              {/* Bottom In-Stock Bar */}
              <div className="absolute bottom-6 left-6 right-6 z-10 bg-black/80 backdrop-blur-md border border-white/15 p-3 rounded-xl flex items-center justify-between text-xs font-mono-code">
                <span className="text-zinc-300">BATCH: FRESH PRODUCTION</span>
                <span className="text-[#ccff00] font-bold">READY TO SHIP</span>
              </div>
            </div>
          </div>

          {/* Right: Flavor Selector Cards & Direct Buy Controls */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            <div>
              <div className="text-xs font-mono-code text-zinc-400 uppercase tracking-wider mb-4 flex items-center justify-between">
                <span>AVAILABLE FLAVOR PROFILES:</span>
                <span className="text-white font-bold">{selectedFlavor.name} SELECTED</span>
              </div>

              {/* 3 Flavor Selector Buttons / Cards */}
              <div className="space-y-4 mb-8">
                {flavors.map((fl) => {
                  const isSelected = selectedFlavor.id === fl.id;
                  return (
                    <button
                      key={fl.id}
                      onClick={() => onSelectFlavor(fl)}
                      className={`w-full p-4 rounded-xl border text-left transition-all duration-200 cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'bg-[#151720] border-[#ccff00] shadow-[0_0_20px_rgba(204,255,0,0.18)]'
                          : 'bg-[#111216] border-white/10 hover:border-white/25 hover:bg-[#14151a]'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        {/* Flavor Color Pip */}
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center border border-white/20 shadow-sm"
                          style={{ backgroundColor: `${fl.accentColor}25` }}
                        >
                          <span
                            className="w-3.5 h-3.5 rounded-full"
                            style={{ backgroundColor: fl.accentColor }}
                          />
                        </div>

                        <div>
                          <div className="font-display text-2xl font-bold uppercase text-white tracking-wide flex items-center gap-2">
                            <span>{fl.name}</span>
                            {isSelected && (
                              <span className="text-[10px] font-mono-code text-black bg-[#ccff00] px-2 py-0.5 rounded font-bold">
                                ACTIVE
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-zinc-400 font-mono-code mt-0.5">
                            {fl.flavorNotes}
                          </div>
                        </div>
                      </div>

                      {/* Right side check / select state */}
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono-code text-zinc-500 hidden sm:inline">
                          30 Servings
                        </span>
                        <div
                          className={`w-6 h-6 rounded-full border flex items-center justify-center ${
                            isSelected
                              ? 'bg-[#ccff00] border-[#ccff00] text-black'
                              : 'border-white/20 text-transparent'
                          }`}
                        >
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Price & Guarantee Callout (Price Remains Visible) */}
              <div className="p-5 rounded-xl bg-[#111216] border border-white/10 mb-6 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono-code text-zinc-500 uppercase block">
                    PRICE PER TUB
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="font-display text-4xl font-black text-white">
                      {BRAND_CONFIG.formattedPrice}
                    </span>
                    <span className="text-sm font-mono-code text-zinc-500 line-through">
                      {BRAND_CONFIG.formattedOriginalPrice}
                    </span>
                    <span className="text-xs font-mono-code text-[#ccff00] font-bold ml-1">
                      SAVE {BRAND_CONFIG.saveAmount}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-mono-code text-zinc-300 font-bold">
                    {BRAND_CONFIG.servings}
                  </div>
                  <div className="text-[11px] font-mono-code text-zinc-400">
                    {BRAND_CONFIG.costPerServing}
                  </div>
                </div>
              </div>
            </div>

            {/* Direct Buy Buttons (Remain Accessible) */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={onBuyNow}
                id="flavor-section-buy-now"
                className="flex-1 bg-[#ccff00] hover:bg-[#d9ff33] text-black font-display text-2xl font-black uppercase py-4 px-6 rounded-lg transition-all shadow-[0_0_25px_rgba(204,255,0,0.3)] hover:shadow-[0_0_35px_rgba(204,255,0,0.5)] active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
              >
                <Zap className="w-5 h-5 fill-black" />
                <span>BUY NOW • {BRAND_CONFIG.formattedPrice}</span>
              </button>

              <button
                onClick={onAddToCart}
                id="flavor-section-add-to-cart"
                className="bg-[#181920] hover:bg-[#20222c] border border-white/15 hover:border-white/30 text-white font-display text-xl font-bold uppercase py-4 px-6 rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShoppingBag className="w-5 h-5 text-[#ccff00]" />
                <span>ADD TO CART</span>
              </button>
            </div>

            <div className="mt-4 flex items-center justify-center gap-2 text-xs font-mono-code text-zinc-400">
              <ShieldCheck className="w-4 h-4 text-[#ccff00]" />
              <span>30-Day Money-Back Guarantee • Free Express Air Shipping across India</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
