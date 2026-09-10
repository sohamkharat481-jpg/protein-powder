import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HelpCircle, ChevronDown, CheckCircle2 } from 'lucide-react';
import { FAQ_ITEMS } from '../data/productData';

export const FaqSection: React.FC = () => {
  const [openIndices, setOpenIndices] = useState<number[]>([0]);

  const toggleAccordion = (index: number) => {
    if (openIndices.includes(index)) {
      setOpenIndices(openIndices.filter((i) => i !== index));
    } else {
      setOpenIndices([...openIndices, index]);
    }
  };

  return (
    <section id="faq" className="py-24 bg-[#0c0d11] relative border-t border-white/5">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#16181f] border border-white/10 text-xs font-mono-code text-[#ccff00] uppercase tracking-widest mb-4">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>ATHLETE INQUIRIES</span>
          </div>
          <h2 className="font-display text-5xl sm:text-6xl font-black uppercase text-white tracking-tight leading-none mb-4">
            FREQUENTLY ASKED QUESTIONS.
          </h2>
          <p className="text-zinc-400 text-base leading-relaxed">
            Essential facts, usage protocols, and formulation details to maximize your training experience.
          </p>
        </div>

        {/* Accordion List containing all 8 questions from prompt */}
        <div className="space-y-3">
          {FAQ_ITEMS.map((faq, index) => {
            const isOpen = openIndices.includes(index);
            return (
              <div
                key={faq.question}
                className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? 'bg-[#14151b] border-[#ccff00]/40 shadow-[0_4px_20px_rgba(0,0,0,0.4)]'
                    : 'bg-[#111216] border-white/10 hover:border-white/20'
                }`}
              >
                <button
                  onClick={() => toggleAccordion(index)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="font-display text-xl sm:text-2xl font-bold uppercase text-white tracking-wide">
                    {faq.question}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center border shrink-0 transition-transform duration-300 ${
                      isOpen
                        ? 'bg-[#ccff00] text-black border-[#ccff00] rotate-180'
                        : 'bg-white/5 text-zinc-400 border-white/10'
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
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-6 sm:px-6 sm:pb-6 text-zinc-300 text-sm sm:text-base leading-relaxed border-t border-white/5 pt-4">
                        <p>{faq.answer}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Support Callout */}
        <div className="mt-12 text-center text-xs font-mono-code text-zinc-400">
          Have a question not answered here? Reach our athlete support team at{' '}
          <a
            href="mailto:support@apexpreworkout.com"
            className="text-[#ccff00] underline hover:text-[#d9ff33]"
          >
            support@apexpreworkout.com
          </a>
        </div>

      </div>
    </section>
  );
};
