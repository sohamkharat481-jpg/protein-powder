import React from 'react';
import { motion } from 'motion/react';
import { Dumbbell, Activity, RotateCcw, CalendarCheck, Sparkles } from 'lucide-react';
import { BENEFITS } from '../data/productData';

const BENEFIT_ICONS = [
  Dumbbell,
  Activity,
  RotateCcw,
  CalendarCheck,
];

export const BenefitsSection: React.FC = () => {
  return (
    <section id="benefits" className="py-24 lg:py-32 bg-[#07080a] relative overflow-hidden">
      {/* Background Subtle Ambience */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-[#00d2ff]/5 rounded-full blur-[180px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#00d2ff]/10 border border-[#00d2ff]/30 text-[#00d2ff] text-xs font-mono-code font-bold uppercase tracking-widest mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            EVIDENCE-BASED PRINCIPLES
          </div>
          <h2 className="font-display text-5xl sm:text-7xl font-black uppercase text-white tracking-tight leading-none mb-4">
            BUILT FOR THE <span className="text-[#00d2ff]">WORK.</span>
          </h2>
          <p className="text-zinc-400 text-base sm:text-lg max-w-2xl mx-auto">
            Responsible performance nutrition designed to support your athletic dedication without exaggerated claims.
          </p>
        </div>

        {/* 4 Interactive Benefit Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {BENEFITS.map((benefit, index) => {
            const IconComponent = BENEFIT_ICONS[index];

            return (
              <motion.div
                key={benefit.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="group relative p-8 rounded-3xl bg-gradient-to-b from-[#10131a] to-[#0a0c10] border border-white/10 hover:border-[#00d2ff]/60 transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_15px_40px_rgba(0,210,255,0.15)] flex flex-col justify-between cursor-default overflow-hidden"
              >
                {/* Subtle top glow highlight on hover */}
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#00d2ff]/0 group-hover:bg-[#00d2ff]/20 rounded-full blur-[50px] transition-all duration-500 pointer-events-none" />

                <div>
                  {/* Top Row: Large Number & Minimal Icon */}
                  <div className="flex items-center justify-between mb-8">
                    <span className="font-display text-5xl font-black text-white/20 group-hover:text-[#00d2ff] transition-colors duration-300">
                      {benefit.step}
                    </span>
                    <div className="w-12 h-12 rounded-2xl bg-black/60 border border-white/10 group-hover:border-[#00d2ff]/40 flex items-center justify-center text-zinc-300 group-hover:text-[#00d2ff] transition-all group-hover:scale-110">
                      <IconComponent className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="font-display text-2xl sm:text-3xl font-black uppercase text-white tracking-wide mb-3 leading-tight">
                    {benefit.title}
                  </h3>

                  {/* Short Description */}
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    {benefit.description}
                  </p>
                </div>

                {/* Bottom Tag */}
                <div className="pt-6 mt-6 border-t border-white/5 text-[11px] font-mono-code text-zinc-500 uppercase tracking-wider group-hover:text-zinc-400 transition-colors">
                  COREFUEL ESSENTIAL
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
