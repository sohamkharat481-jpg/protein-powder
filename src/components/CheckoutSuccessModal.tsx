import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, PackageCheck, Zap, X, ArrowRight, Truck, FileText, Smartphone } from 'lucide-react';
import { BRAND_CONFIG } from '../data/productData';

interface CheckoutSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderNumber: string;
}

export const CheckoutSuccessModal: React.FC<CheckoutSuccessModalProps> = ({
  isOpen,
  onClose,
  orderNumber,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-[#121318] border border-white/20 rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative text-center text-white"
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Celebration Icon */}
        <div className="w-20 h-20 rounded-2xl bg-[#ccff00]/10 border border-[#ccff00]/40 flex items-center justify-center mx-auto mb-6 shadow-[0_0_25px_rgba(204,255,0,0.25)]">
          <PackageCheck className="w-10 h-10 text-[#ccff00]" />
        </div>

        <div className="text-xs font-mono-code text-[#ccff00] uppercase tracking-widest font-bold mb-1">
          PAYMENT CONFIRMED • ORDER RECEIVED
        </div>
        <h3 className="font-display text-4xl sm:text-5xl font-black uppercase tracking-tight mb-2">
          READY FOR DISPATCH.
        </h3>
        <p className="text-zinc-300 text-sm mb-6 leading-relaxed">
          Order ID: <span className="font-mono-code text-[#ccff00] font-bold">{orderNumber}</span>. Your nitrogen-sealed tub is being packed at our automated fulfillment hub.
        </p>

        {/* Specs Box with Realistic Indian Shipping Details */}
        <div className="p-4 rounded-xl bg-black/50 border border-white/10 text-left text-xs font-mono-code space-y-2.5 mb-6">
          <div className="flex justify-between items-center pb-2 border-b border-white/10">
            <span className="text-zinc-400">CARRIER:</span>
            <span className="text-white font-bold flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-[#ccff00]" />
              BlueDart Express Air (AWB #BD-982401IN)
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-zinc-400">ESTIMATED TRANSIT:</span>
            <span className="text-[#ccff00] font-bold">24–48 HOURS (Metro Air)</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-zinc-400">DISPATCH ORIGIN:</span>
            <span className="text-white">Bhiwandi Hub / Bengaluru Central</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-zinc-400">DISPATCH ALERTS:</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <Smartphone className="w-3 h-3" />
              WhatsApp & SMS Sent
            </span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-white/10 text-[11px]">
            <span className="text-zinc-400">TAX INVOICE:</span>
            <span className="text-zinc-300 flex items-center gap-1">
              <FileText className="w-3 h-3 text-[#ccff00]" />
              GST Compliant (18%) E-Way Bill Attached
            </span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-[#ccff00] hover:bg-[#d9ff33] text-black font-display text-xl font-bold uppercase py-3.5 rounded-xl transition-all shadow-[0_0_20px_rgba(204,255,0,0.3)] cursor-pointer flex items-center justify-center gap-2"
        >
          <span>RETURN TO STORE</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </motion.div>
    </div>
  );
};
