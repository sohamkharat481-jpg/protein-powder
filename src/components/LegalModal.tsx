import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Shield, FileText } from 'lucide-react';
import { LEGAL_DOCS } from '../data/productData';

interface LegalModalProps {
  type: 'privacy' | 'terms' | 'shipping' | 'refund' | null;
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ type, onClose }) => {
  if (!type) return null;

  const getDoc = () => {
    switch (type) {
      case 'privacy':
        return LEGAL_DOCS.privacyPolicy;
      case 'terms':
        return LEGAL_DOCS.termsAndConditions;
      case 'shipping':
        return LEGAL_DOCS.shippingPolicy;
      case 'refund':
        return LEGAL_DOCS.refundPolicy;
      default:
        return LEGAL_DOCS.privacyPolicy;
    }
  };

  const doc = getDoc();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-[#121318] border border-white/20 rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[85vh] flex flex-col text-white"
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-xs font-mono-code text-[#ccff00] uppercase mb-1">
          <Shield className="w-3.5 h-3.5" />
          <span>LEGAL PROTOCOL • LAST UPDATED {doc.lastUpdated}</span>
        </div>

        <h3 className="font-display text-3xl font-black uppercase text-white mb-6">
          {doc.title}
        </h3>

        <div className="flex-1 overflow-y-auto pr-2 text-sm text-zinc-300 leading-relaxed space-y-4">
          <p>{doc.content}</p>
          <p className="text-xs font-mono-code text-zinc-400 border-t border-white/10 pt-4">
            For further legal, compliance, or regulatory questions, reach out to our legal department at legal@apexpreworkout.com.
          </p>
        </div>

        <div className="mt-6 pt-4 border-t border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#ccff00] text-black font-mono-code text-xs font-bold rounded uppercase cursor-pointer"
          >
            I Understand
          </button>
        </div>
      </motion.div>
    </div>
  );
};
