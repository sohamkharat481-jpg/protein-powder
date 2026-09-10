import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, Plus, Minus, Zap, ChevronUp, Check } from 'lucide-react';
import { BRAND_CONFIG, FlavorOption } from '../data/productData';

interface StickyPurchaseBarProps {
  selectedFlavor: FlavorOption;
  onSelectFlavor: (flavor: FlavorOption) => void;
  flavors: FlavorOption[];
  quantity: number;
  onSetQuantity: (qty: number) => void;
  onAddToCart: () => void;
  onOpenCart: () => void;
}

export const StickyPurchaseBar: React.FC<StickyPurchaseBarProps> = ({
  selectedFlavor,
  onSelectFlavor,
  flavors,
  quantity,
  onSetQuantity,
  onAddToCart,
  onOpenCart,
}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show when scrolled past hero (~550px)
      if (window.scrollY > 550) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="fixed bottom-0 left-0 right-0 z-40 bg-[#0c0d12]/95 backdrop-blur-xl border-t border-white/15 shadow-[0_-10px_35px_rgba(0,0,0,0.8)] py-3 px-4 sm:px-6"
          id="sticky-purchase-bar"
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 flex-wrap sm:flex-nowrap">
            
            {/* Left: Product Image, Name, Price */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-12 h-12 rounded-lg bg-black border border-white/15 overflow-hidden shrink-0">
                <img
                  src={selectedFlavor.image}
                  alt={BRAND_CONFIG.productName}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="truncate">
                <div className="text-[10px] font-mono-code text-zinc-400 uppercase tracking-wider flex items-center gap-1.5 truncate">
                  <span>{BRAND_CONFIG.brandName}</span>
                  <span className="text-zinc-600">•</span>
                  <span className="text-[#ccff00] font-bold">{BRAND_CONFIG.servings}</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-lg sm:text-xl font-black text-white tracking-wide truncate">
                    {BRAND_CONFIG.productName}
                  </span>
                  <span className="font-mono-code text-sm font-bold text-[#ccff00]">
                    ₹{(BRAND_CONFIG.price * quantity).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Flavor Selector + Quantity + ADD TO CART */}
            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              
              {/* Flavor Selector */}
              <div className="relative shrink-0">
                <select
                  value={selectedFlavor.id}
                  onChange={(e) => {
                    const found = flavors.find((f) => f.id === e.target.value);
                    if (found) onSelectFlavor(found);
                  }}
                  className="bg-[#161820] text-zinc-200 border border-white/15 text-xs font-mono-code py-2 px-3 pr-8 rounded-lg cursor-pointer focus:outline-none focus:border-[#ccff00]"
                  id="sticky-flavor-select"
                >
                  {flavors.map((fl) => (
                    <option key={fl.id} value={fl.id} className="bg-zinc-900 text-white">
                      {fl.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center border border-white/15 bg-[#161820] rounded-lg overflow-hidden shrink-0">
                <button
                  onClick={() => onSetQuantity(Math.max(1, quantity - 1))}
                  className="p-2 text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-8 text-center text-xs font-mono-code font-bold text-white">
                  {quantity}
                </span>
                <button
                  onClick={() => onSetQuantity(quantity + 1)}
                  className="p-2 text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* ADD TO CART Button */}
              <button
                onClick={onAddToCart}
                id="sticky-add-to-cart-button"
                className="flex-1 sm:flex-initial bg-[#ccff00] hover:bg-[#d9ff33] text-black font-display text-lg font-black uppercase py-2.5 px-6 rounded-lg transition-all shadow-[0_0_15px_rgba(204,255,0,0.3)] hover:shadow-[0_0_20px_rgba(204,255,0,0.4)] active:scale-95 flex items-center justify-center gap-2 cursor-pointer shrink-0"
              >
                <ShoppingBag className="w-4 h-4 fill-black" />
                <span>ADD TO CART</span>
              </button>
            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
