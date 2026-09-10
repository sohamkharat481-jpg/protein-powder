import React from 'react';
import { motion } from 'motion/react';
import { AlertCircle, Clock, CheckCircle2 } from 'lucide-react';
import { USAGE_STEPS } from '../data/productData';

export const HowToUseSection: React.FC = () => {
  return (
    <section id="how-to-use" className="py-24 bg-[#080809] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mb-16 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#16181f] border border-white/10 text-xs font-mono-code text-[#ccff00] uppercase tracking-widest mb-4">
            <span>PREPARATION PROTOCOL</span>
          </div>
          <h2 className="font-display text-5xl sm:text-6xl lg:text-7xl font-black uppercase text-white tracking-tight leading-none mb-4">
            HOW TO USE.
          </h2>
          <p className="text-zinc-400 text-base sm:text-lg max-w-2xl leading-relaxed">
            A simplified, three-step ritual to prime your neuromuscular pathways for maximum output.
          </p>
        </div>

        {/* 3 Step Sequence */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          
          {/* Subtle connecting line across desktop */}
          <div className="hidden md:block absolute top-14 left-1/6 right-1/6 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent z-0" />

          {USAGE_STEPS.map((step, idx) => (
            <motion.div
              key={step.stepNumber}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              className="relative z-10 bg-[#121318] border border-white/10 rounded-2xl p-7 flex flex-col justify-between hover:border-[#ccff00]/40 transition-all duration-300 group"
            >
              <div>
                {/* Step Big Number & Timing */}
                <div className="flex items-center justify-between mb-8">
                  <div className="w-16 h-16 rounded-xl bg-black border border-white/10 group-hover:border-[#ccff00]/40 flex items-center justify-center font-display text-3xl font-black text-[#ccff00] transition-all">
                    {step.stepNumber}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-mono-code text-zinc-400 bg-white/5 px-3 py-1 rounded-full border border-white/5">
                    <Clock className="w-3.5 h-3.5 text-[#ccff00]" />
                    <span>{step.timing}</span>
                  </div>
                </div>

                {/* Step Title */}
                <h3 className="font-display text-3xl font-black uppercase tracking-wide text-white mb-3 group-hover:text-[#ccff00] transition-colors">
                  {step.stepNumber} — {step.title}
                </h3>

                {/* Step Description */}
                <p className="text-zinc-300 text-sm leading-relaxed mb-6 font-normal">
                  {step.description}
                </p>
              </div>

              <div className="pt-4 border-t border-white/5 flex items-center gap-2 text-xs font-mono-code text-zinc-500">
                <CheckCircle2 className="w-4 h-4 text-[#ccff00]" />
                <span>Protocol Step Verified</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Small safety note (Mandatory in prompt) */}
        <div className="mt-12 p-5 rounded-xl bg-[#14151a] border border-white/15 flex flex-col sm:flex-row items-start sm:items-center gap-4 text-xs font-mono-code text-zinc-300">
          <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0">
            <AlertCircle className="w-5 h-5 text-amber-400" />
          </div>
          <div className="leading-relaxed">
            <strong className="text-white font-bold block mb-0.5 uppercase tracking-wide">
              SAFETY NOTICE & RECOMMENDED SERVING GUIDELINE
            </strong>
            Always follow the product label instructions and do not exceed the recommended daily serving. Do not combine with other caffeinated products or stimulants. Keep out of reach of children. Discontinue use and consult your healthcare provider if you experience adverse symptoms.
          </div>
        </div>

      </div>
    </section>
  );
};
