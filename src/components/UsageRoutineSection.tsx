import React from 'react';
import { motion } from 'motion/react';
import { ROUTINE_STEPS } from '../data/productData';
import { Sparkles, GlassWater, Dumbbell, CircleDot } from 'lucide-react';

const STEP_ICONS = [
  CircleDot,
  GlassWater,
  Dumbbell,
];

export const UsageRoutineSection: React.FC = () => {
  return (
    <section className="py-24 lg:py-32 bg-[#07080a] relative overflow-hidden border-t border-white/5">
      {/* Background Accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[#00d2ff]/5 rounded-full blur-[180px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono-code font-bold uppercase tracking-widest text-zinc-300 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#00d2ff]" />
            SIMPLE THREE-STEP PROTOCOL
          </div>
          <h2 className="font-display text-5xl sm:text-7xl font-black uppercase text-white tracking-tight leading-none mb-4">
            HOW TO <span className="text-[#00d2ff]">USE.</span>
          </h2>
          <p className="text-zinc-400 text-base sm:text-lg">
            No complicated cycling regimens required. Integrate into your daily schedule consistently.
          </p>
        </div>

        {/* Animated Progressive Timeline */}
        <div className="relative">
          
          {/* Connecting Line for Desktop */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#00d2ff]/30 to-transparent -translate-y-1/2 z-0" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            {ROUTINE_STEPS.map((step, idx) => {
              const IconComp = STEP_ICONS[idx];

              return (
                <motion.div
                  key={step.stepNumber}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.15 }}
                  whileHover={{ y: -6 }}
                  className="p-8 rounded-3xl bg-[#0c0e14] border border-white/10 hover:border-[#00d2ff]/40 transition-all duration-300 shadow-[0_15px_35px_rgba(0,0,0,0.6)] flex flex-col justify-between group"
                >
                  <div>
                    {/* Step Number & Icon */}
                    <div className="flex items-center justify-between mb-8">
                      <span className="font-display text-4xl font-black text-[#00d2ff] tracking-tight">
                        {step.stepNumber}
                      </span>
                      <div className="w-12 h-12 rounded-2xl bg-black/60 border border-white/10 group-hover:border-[#00d2ff]/40 flex items-center justify-center text-zinc-300 group-hover:text-[#00d2ff] transition-all">
                        <IconComp className="w-5 h-5" />
                      </div>
                    </div>

                    {/* Step Title as requested: 01 — SCOOP, 02 — MIX, 03 — TRAIN */}
                    <h3 className="font-display text-3xl font-black uppercase text-white tracking-wide mb-3">
                      {step.title}
                    </h3>

                    {/* Step Description as requested */}
                    <p className="text-zinc-400 text-sm leading-relaxed">
                      {step.description}
                    </p>
                  </div>

                  <div className="pt-6 mt-6 border-t border-white/5 text-[10px] font-mono-code text-zinc-500 uppercase">
                    STEP {step.stepNumber} OF 03
                  </div>
                </motion.div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
};
