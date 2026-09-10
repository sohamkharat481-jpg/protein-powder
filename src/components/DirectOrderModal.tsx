import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Phone, MessageSquare, Flame, Droplets, CheckCircle2, ShieldCheck, Sparkles, ExternalLink } from 'lucide-react';
import { BRAND_CONFIG, FLAVOR_VARIANTS } from '../data/productData';
import { FlavorId } from '../types';

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

  const currentVariant = FLAVOR_VARIANTS[selectedFlavorId];
  const isOrange = selectedFlavorId === 'orange';
  const whatsAppUrl = BRAND_CONFIG.generateWhatsAppLink(currentVariant.name);

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
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00d2ff]/10 border border-[#00d2ff]/30 text-[#00d2ff] text-xs font-mono-code font-bold uppercase tracking-widest mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              DIRECT OWNER DISPATCH
            </div>
            <h3 className="font-display text-3xl sm:text-4xl font-black uppercase text-white tracking-tight leading-none">
              PLACE YOUR COREFUEL ORDER
            </h3>
          </div>

          {/* Notice Message */}
          <div className="p-4 rounded-2xl bg-black/40 border border-white/10 mb-6 text-sm text-zinc-300 leading-relaxed flex items-start gap-3">
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

          {/* Flavor Selector Inside Modal */}
          <div className="mb-6">
            <label className="block text-xs font-mono-code uppercase text-zinc-400 mb-2.5 font-bold tracking-wider">
              SELECTED FLAVOR:
            </label>
            <div className="grid grid-cols-2 gap-3">
              {/* Orange Option */}
              <button
                type="button"
                onClick={() => onSelectFlavor('orange')}
                className={`p-3 rounded-2xl border text-left cursor-pointer transition-all flex items-center justify-between ${
                  isOrange
                    ? 'border-[#ff7700] bg-[#ff7700]/15 text-white shadow-[0_0_20px_rgba(255,119,0,0.25)]'
                    : 'border-white/10 bg-black/40 text-zinc-400 hover:border-white/30 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${isOrange ? 'bg-[#ff7700]' : 'bg-zinc-600'}`} />
                  <div>
                    <div className="font-display text-lg font-bold uppercase leading-none">Orange</div>
                    <div className="text-[10px] font-mono-code text-amber-300">900mg Taurine</div>
                  </div>
                </div>
                {isOrange && <CheckCircle2 className="w-4 h-4 text-[#ff7700]" />}
              </button>

              {/* Flavorless Option */}
              <button
                type="button"
                onClick={() => onSelectFlavor('flavorless')}
                className={`p-3 rounded-2xl border text-left cursor-pointer transition-all flex items-center justify-between ${
                  !isOrange
                    ? 'border-white bg-white/15 text-white shadow-[0_0_20px_rgba(255,255,255,0.2)]'
                    : 'border-white/10 bg-black/40 text-zinc-400 hover:border-white/30 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${!isOrange ? 'bg-white' : 'bg-zinc-600'}`} />
                  <div>
                    <div className="font-display text-lg font-bold uppercase leading-none">Flavorless</div>
                    <div className="text-[10px] font-mono-code text-zinc-300">100% Pure</div>
                  </div>
                </div>
                {!isOrange && <CheckCircle2 className="w-4 h-4 text-white" />}
              </button>
            </div>
          </div>

          {/* Pricing Highlight */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-[#11141c] to-[#0c0e15] border border-white/10 mb-6 flex items-center justify-between">
            <div>
              <span className="text-xs font-mono-code text-zinc-400 block uppercase tracking-wider">
                Price for {currentVariant.name}
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
                100 Full Servings (Micronized)
              </span>
            </div>
          </div>

          {/* Owner Details Card with Clickable Phone */}
          <div className="p-4 rounded-2xl bg-[#141822] border border-white/10 mb-6">
            <span className="text-xs font-mono-code text-zinc-400 block mb-1 uppercase tracking-wider">
              COREFUEL OWNER DIRECT CONTACT:
            </span>
            <a
              href={`tel:${BRAND_CONFIG.ownerPhoneRaw}`}
              className="font-display text-2xl sm:text-3xl font-bold text-white hover:text-[#00d2ff] transition-colors flex items-center gap-2"
            >
              <Phone className="w-5 h-5 text-[#00d2ff]" />
              <span>{BRAND_CONFIG.ownerPhoneDisplay}</span>
            </a>
            <span className="text-[11px] font-mono-code text-zinc-400 block mt-1">
              Tap the buttons below to call or open a pre-filled WhatsApp message.
            </span>
          </div>

          {/* Action Buttons: CALL TO ORDER & WHATSAPP TO ORDER */}
          <div className="space-y-3">
            {/* WHATSAPP TO ORDER */}
            <a
              href={whatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-black font-display text-xl font-black tracking-wide py-4 px-6 rounded-2xl transition-all shadow-[0_0_25px_rgba(37,211,102,0.3)] hover:shadow-[0_0_35px_rgba(37,211,102,0.45)] flex items-center justify-center gap-2.5 cursor-pointer active:scale-[0.98]"
            >
              <MessageSquare className="w-5 h-5 fill-black" />
              <span>WHATSAPP TO ORDER</span>
              <ExternalLink className="w-4 h-4" />
            </a>

            {/* CALL TO ORDER */}
            <a
              href={`tel:${BRAND_CONFIG.ownerPhoneRaw}`}
              className="w-full bg-white/10 hover:bg-white/20 text-white font-display text-xl font-black tracking-wide py-4 px-6 rounded-2xl border border-white/20 hover:border-white/40 transition-all flex items-center justify-center gap-2.5 cursor-pointer active:scale-[0.98]"
            >
              <Phone className="w-5 h-5 text-[#00d2ff]" />
              <span>CALL TO ORDER ({BRAND_CONFIG.ownerPhoneDisplay})</span>
            </a>
          </div>

          {/* Pre-filled Message Note */}
          <div className="mt-4 text-center">
            <span className="text-[11px] font-mono-code text-zinc-500">
              Pre-filled text: "Hi CoreFuel, I want to order CoreFuel Creatine Monohydrate. My preferred flavor is {currentVariant.name}."
            </span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
