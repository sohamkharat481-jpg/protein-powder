import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, HelpCircle, MessageSquare } from 'lucide-react';
import { FAQ_ITEMS, BRAND_CONFIG } from '../data/productData';

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 lg:py-32 bg-[#07080a] relative overflow-hidden border-t border-white/5">
      {/* Background Ambience */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[450px] bg-[#00d2ff]/5 rounded-full blur-[170px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono-code font-bold uppercase tracking-widest text-[#00d2ff] mb-4">
            <HelpCircle className="w-3.5 h-3.5" />
            CLEAR ANSWERS
          </div>
          <h2 className="font-display text-5xl sm:text-7xl font-black uppercase text-white tracking-tight leading-none mb-4">
            FREQUENTLY ASKED <span className="text-[#00d2ff]">QUESTIONS.</span>
          </h2>
          <p className="text-zinc-400 text-base sm:text-lg">
            Everything you need to know about CoreFuel Creatine Monohydrate, dosing, and ordering.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={index}
                className="rounded-2xl bg-[#0c0e14] border border-white/10 overflow-hidden transition-colors duration-200"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-5 sm:px-8 sm:py-6 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className="font-display text-xl sm:text-2xl font-bold uppercase text-white tracking-wide">
                    {item.question}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full border border-white/10 flex items-center justify-center shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 bg-[#00d2ff]/20 text-[#00d2ff] border-[#00d2ff]/40' : 'text-zinc-400'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                      <div className="px-6 pb-6 sm:px-8 sm:pb-6 text-zinc-300 text-sm sm:text-base leading-relaxed border-t border-white/5 pt-4">
                        {item.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Direct Contact Prompt under FAQ */}
        <div className="mt-12 text-center p-6 rounded-2xl bg-white/5 border border-white/10">
          <p className="text-zinc-300 text-sm mb-3">
            Have a specific question about your routine or bulk orders?
          </p>
          <a
            href={BRAND_CONFIG.generateWhatsAppLink('General Inquiry')}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs font-mono-code font-bold uppercase text-[#00d2ff] hover:underline"
          >
            <MessageSquare className="w-4 h-4 text-[#25D366]" />
            Ask CoreFuel directly on WhatsApp ({BRAND_CONFIG.ownerPhoneDisplay})
          </a>
        </div>

      </div>
    </section>
  );
};
