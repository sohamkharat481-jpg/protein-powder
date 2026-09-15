import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Phone, MessageSquare, Flame, Droplets, CheckCircle2, ShieldCheck, Sparkles, ExternalLink } from 'lucide-react';
import { BRAND_CONFIG, FLAVOR_VARIANTS } from '../data/productData';
import { FlavorId } from '../types';
import { BrandLogo } from './BrandLogo';
import { ProductImage } from './ProductImage';

interface DirectOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedFlavorId: FlavorId;
  onSelectFlavor: (flavorId: FlavorId) => void;
}

export const DirectOrderModal: React.FC<DirectOrderModalProps> = ({
  isOpen,
  onClose,
  selectedFlavorId,
  onSelectFlavor,
}) => {
  if (!isOpen) return null;

  const isOrange = selectedFlavorId === 'orange';
  const currentVariant = isOrange ? FLAVOR_VARIANTS.orange : FLAVOR_VARIANTS.flavorless;
  const currentFlavorName = isOrange ? 'Orange' : 'Unflavoured';
  const whatsAppUrl = BRAND_CONFIG.generateWhatsAppLink(currentFlavorName, BRAND_CONFIG.secondaryPhoneNumericOnly);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-md cursor-pointer"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative w-full max-w-lg rounded-3xl bg-[#0d0f15] border border-white/20 p-6 sm:p-8 shadow-[0_25px_80px_rgba(0,0,0,0.95)] z-10 overflow-hidden text-left"
        >
          {/* Subtle Ambient Glow inside Modal */}
          <div
            className={`absolute -top-24 -right-24 w-64 h-64 rounded-full blur-[100px] pointer-events-none transition-colors duration-500 ${
              isOrange ? 'bg-[#ff7700]/20' : 'bg-[#00d2ff]/20'
            }`}
          />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer z-20 group"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
          </button>

          {/* Header */}
          <div className="mb-6 pr-8">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
              <BrandLogo variant="full" size="sm" showSubtitle />
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00d2ff]/10 border border-[#00d2ff]/30 text-[#00d2ff] text-[11px] font-label-pkg uppercase tracking-wider">
                <Sparkles className="w-3 h-3" />
                <span>DIRECT DISPATCH</span>
              </div>
            </div>
            <h3 className="font-creatine text-3xl sm:text-4xl text-white tracking-tight leading-none mt-2">
              PLACE YOUR ORDER
            </h3>
          </div>

          {/* Notice Message */}
          <div className="p-4 rounded-2xl bg-black/40 border border-white/10 mb-5 text-sm text-zinc-300 leading-relaxed flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#00d2ff]/10 border border-[#00d2ff]/30 flex items-center justify-center shrink-0 mt-0.5">
              <ShieldCheck className="w-4 h-4 text-[#00d2ff]" />
            </div>
            <div>
              <p className="font-medium text-white mb-0.5">
                To place your order, contact the CoreFuel owner directly.
              </p>
              <p className="text-xs text-zinc-400">
                Direct customer service, personalized delivery updates, and authentic batch dispatch.
              </p>
            </div>
          </div>

          {/* Flavor Selection Switcher */}
          <div className="mb-5">
            <span className="text-[11px] font-mono-code text-zinc-400 block uppercase tracking-wider mb-2">
              Selected Flavor:
            </span>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => onSelectFlavor('orange')}
                className={`p-3 rounded-xl border flex items-center gap-2.5 transition-all cursor-pointer ${
                  isOrange
                    ? 'bg-[#ff7700]/15 border-[#ff7700] text-white shadow-[0_0_15px_rgba(255,119,0,0.2)]'
                    : 'bg-black/40 border-white/10 text-zinc-400 hover:border-white/30'
                }`}
              >
                <div className={`w-3 h-3 rounded-full bg-[#ff7700] ${isOrange ? 'shadow-[0_0_8px_#ff7700]' : 'opacity-40'}`} />
                <div className="text-left">
                  <div className="font-athletic text-base tracking-wider leading-none">ORANGE</div>
                  <div className="text-[10px] text-zinc-400 mt-0.5">900mg Taurine</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => onSelectFlavor('flavorless')}
                className={`p-3 rounded-xl border flex items-center gap-2.5 transition-all cursor-pointer ${
                  !isOrange
                    ? 'bg-[#00d2ff]/15 border-[#00d2ff] text-white shadow-[0_0_15px_rgba(0,210,255,0.2)]'
                    : 'bg-black/40 border-white/10 text-zinc-400 hover:border-white/30'
                }`}
              >
                <div className={`w-3 h-3 rounded-full bg-[#00d2ff] ${!isOrange ? 'shadow-[0_0_8px_#00d2ff]' : 'opacity-40'}`} />
                <div className="text-left">
                  <div className="font-athletic text-base tracking-wider leading-none">UNFLAVOURED</div>
                  <div className="text-[10px] text-zinc-400 mt-0.5">Pure 200-Mesh</div>
                </div>
              </button>
            </div>
          </div>

          {/* Pricing & Product Preview Highlight */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-[#11141c] to-[#0c0e15] border border-white/10 mb-6 flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl overflow-hidden bg-black/60 border border-white/10 shrink-0 p-1">
              <ProductImage
                key={selectedFlavorId}
                variant={isOrange ? 'orange' : 'flavorless'}
                alt={`CoreFuel Creatine ${currentFlavorName}`}
                className="w-full h-full object-contain rounded-lg"
              />
            </div>
            <div className="flex-1">
              <span className="text-xs font-mono-code text-zinc-400 block uppercase tracking-wider">
                {currentFlavorName} Variant
              </span>
              <span className="font-display text-3xl font-black text-white">
                {BRAND_CONFIG.priceDisplay}
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs font-mono-code font-bold text-[#00d2ff] bg-[#00d2ff]/10 px-2.5 py-1 rounded border border-[#00d2ff]/20 block">
                {BRAND_CONFIG.shippingNote}
              </span>
              <span className="text-[10px] font-mono-code text-zinc-500 mt-1 block">
                25 Full Servings
              </span>
            </div>
          </div>

          {/* Dual Contact Details Card with Clickable Phones */}
          <div className="p-4 rounded-2xl bg-[#141822] border border-white/10 mb-6 space-y-3">
            <span className="text-xs font-mono-code text-zinc-400 block uppercase tracking-wider font-semibold">
              COREFUEL DIRECT ORDER CONTACTS:
            </span>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Line 2: Order Desk */}
              <div className="p-2.5 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-mono-code text-[#00d2ff] uppercase font-bold tracking-wider">
                    Line 2 (Order Desk)
                  </div>
                  <a
                    href={`tel:${BRAND_CONFIG.secondaryPhoneRaw}`}
                    className="font-display text-lg font-bold text-white hover:text-[#00d2ff] transition-colors"
                  >
                    {BRAND_CONFIG.secondaryPhoneDisplay}
                  </a>
                </div>
                <a
                  href={`tel:${BRAND_CONFIG.secondaryPhoneRaw}`}
                  className="p-2 rounded-lg bg-[#00d2ff]/15 text-[#00d2ff] hover:bg-[#00d2ff]/25"
                  title="Call Line 2"
                >
                  <Phone className="w-4 h-4" />
                </a>
              </div>

              {/* Line 1: Founder Direct */}
              <div className="p-2.5 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-mono-code text-zinc-400 uppercase font-bold tracking-wider">
                    Line 1 (Founder)
                  </div>
                  <a
                    href={`tel:${BRAND_CONFIG.ownerPhoneRaw}`}
                    className="font-display text-lg font-bold text-white hover:text-[#00d2ff] transition-colors"
                  >
                    {BRAND_CONFIG.ownerPhoneDisplay}
                  </a>
                </div>
                <a
                  href={`tel:${BRAND_CONFIG.ownerPhoneRaw}`}
                  className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20"
                  title="Call Line 1"
                >
                  <Phone className="w-4 h-4" />
                </a>
              </div>
            </div>

            <span className="text-[11px] font-mono-code text-zinc-400 block">
              Direct customer service, batch verification, and express courier dispatch.
            </span>
          </div>

          {/* Action Buttons: CALL TO ORDER & WHATSAPP TO ORDER */}
          <div className="space-y-3">
            {/* PRIMARY WHATSAPP TO ORDER (Line 2: 91454 78524) */}
            <a
              href={whatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-black font-display text-lg sm:text-xl font-black tracking-wide py-3.5 sm:py-4 px-6 rounded-2xl transition-all shadow-[0_0_25px_rgba(37,211,102,0.3)] hover:shadow-[0_0_35px_rgba(37,211,102,0.45)] flex items-center justify-center gap-2.5 cursor-pointer active:scale-[0.98]"
            >
              <MessageSquare className="w-5 h-5 fill-black" />
              <span>WHATSAPP TO ORDER ({BRAND_CONFIG.secondaryPhoneDisplay})</span>
              <ExternalLink className="w-4 h-4" />
            </a>

            {/* CALL TO ORDER (Line 2: 91454 78524) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <a
                href={`tel:${BRAND_CONFIG.secondaryPhoneRaw}`}
                className="bg-white/10 hover:bg-white/20 text-white font-display text-base font-black tracking-wide py-3 px-4 rounded-xl border border-white/20 hover:border-white/40 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
              >
                <Phone className="w-4 h-4 text-[#00d2ff]" />
                <span>CALL: {BRAND_CONFIG.secondaryPhoneDisplay}</span>
              </a>

              <a
                href={`tel:${BRAND_CONFIG.ownerPhoneRaw}`}
                className="bg-white/10 hover:bg-white/20 text-white font-display text-base font-black tracking-wide py-3 px-4 rounded-xl border border-white/20 hover:border-white/40 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
              >
                <Phone className="w-4 h-4 text-zinc-300" />
                <span>CALL: {BRAND_CONFIG.ownerPhoneDisplay}</span>
              </a>
            </div>
          </div>

          {/* Pre-filled Message Note */}
          <div className="mt-4 text-center">
            <span className="text-[11px] font-mono-code text-zinc-500">
              Pre-filled text: "Hi CoreFuel, I want to order CoreFuel Creatine Monohydrate ({currentFlavorName} variant, 25 Servings @ ₹549/-). Please confirm delivery."
            </span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
