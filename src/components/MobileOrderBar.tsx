import React from 'react';
import { Zap, Phone, MessageSquare } from 'lucide-react';
import { BRAND_CONFIG, FLAVOR_VARIANTS } from '../data/productData';
import { FlavorId } from '../types';

interface MobileOrderBarProps {
  selectedFlavorId: FlavorId;
  onOpenOrderModal: () => void;
}

export const MobileOrderBar: React.FC<MobileOrderBarProps> = ({
  selectedFlavorId,
  onOpenOrderModal,
}) => {
  const currentVariant = FLAVOR_VARIANTS[selectedFlavorId];
  const whatsAppUrl = BRAND_CONFIG.generateWhatsAppLink('Orange', 'secondary');

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 p-3 bg-[#07080a]/90 backdrop-blur-xl border-t border-white/10 shadow-[0_-10px_30px_rgba(0,0,0,0.9)]">
      <div className="flex items-center gap-2 max-w-md mx-auto">
        {/* Quick Call Button (Line 2: 91454 78524) */}
        <a
          href={`tel:${BRAND_CONFIG.secondaryPhoneRaw}`}
          aria-label="Call CoreFuel Order Desk directly"
          className="p-3 rounded-xl bg-white/10 border border-white/20 text-[#00d2ff] hover:bg-white/20 transition-colors flex items-center justify-center shrink-0"
        >
          <Phone className="w-5 h-5" />
        </a>

        {/* Quick WhatsApp Button (Line 2: 91454 78524) */}
        <a
          href={whatsAppUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Order via WhatsApp"
          className="p-3 rounded-xl bg-[#25D366]/20 border border-[#25D366]/40 text-[#25D366] hover:bg-[#25D366]/30 transition-colors flex items-center justify-center shrink-0"
        >
          <MessageSquare className="w-5 h-5" />
        </a>

        {/* Main ORDER NOW CTA */}
        <button
          onClick={onOpenOrderModal}
          id="mobile-order-now-bar-btn"
          className="flex-1 bg-[#00d2ff] active:bg-[#33dbff] text-black font-display text-lg font-black tracking-wide py-3 px-4 rounded-xl flex items-center justify-between shadow-[0_0_20px_rgba(0,210,255,0.4)] cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 fill-black" />
            <span>ORDER NOW</span>
          </div>
          <span className="font-mono-code text-xs font-black bg-black/15 px-2 py-0.5 rounded">
            {BRAND_CONFIG.priceDisplay}
          </span>
        </button>
      </div>
    </div>
  );
};
