import React from 'react';
import { motion } from 'motion/react';
import { PRODUCT_IMAGES } from '../data/productData';
import { ShieldCheck, Target, Zap, Clock, Sparkles } from 'lucide-react';

const PILLARS = [
  {
    title: 'DISCIPLINE',
    desc: 'Daily commitment without relying on temporary motivation.',
    icon: Target,
  },
  {
    title: 'CONSISTENCY',
    desc: '100 full servings engineered for months of uninterrupted training.',
    icon: Clock,
  },
  {
    title: 'TRAINING',
    desc: 'Built specifically for progressive resistance and intense gym sessions.',
    icon: Zap,
  },
  {
    title: 'PERFORMANCE',
    desc: 'Pure ATP replenishment supporting cellular energy and power output.',
    icon: Sparkles,
  },
  {
    title: 'SIMPLICITY',
    desc: 'Direct, honest ingredients with zero proprietary blends or fake claims.',
    icon: ShieldCheck,
  },
];

export const WhyCoreFuelSection: React.FC = () => {
  return (
    <section
      id="why-corefuel"
      className="relative min-h-[750px] py-24 lg:py-32 flex items-center justify-center overflow-hidden border-t border-white/5"
    >
      {/* Background Cinematic Image with Heavy Dark Atmospheric Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={PRODUCT_IMAGES.cinematicGymDuo}
          alt="CoreFuel Gym Training Campaign"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center filter brightness-[0.35] contrast-125 scale-105"
        />
        {/* Dark Vignette & Gradient Overlays for Guaranteed High Contrast Typography */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#07080a] via-[#07080a]/80 to-[#07080a]/90" />
        <div className="absolute inset-0 bg-[#07080a]/60 backdrop-blur-[2px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        
        {/* Main Cinematic Statement */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-xs font-mono-code font-bold uppercase tracking-widest text-[#00d2ff] mb-6"
          >
            <Sparkles className="w-3.5 h-3.5" />
            COREFUEL PHILOSOPHY
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-display text-5xl sm:text-7xl lg:text-8xl font-black uppercase text-white tracking-tight leading-[0.92] mb-6"
          >
            BUILT FOR PEOPLE<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00d2ff] via-[#5ce0ff] to-white">
              WHO SHOW UP.
            </span>
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="space-y-2 text-xl sm:text-2xl text-zinc-200 font-medium leading-relaxed max-w-2xl mx-auto"
          >
            <p>Consistency isn't built in a day.</p>
            <p className="text-[#00d2ff] font-semibold">
              It's built every time you choose to show up.
            </p>
          </motion.div>
        </div>

        {/* 5 Focus Pillars: Discipline, Consistency, Training, Performance, Simplicity */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 max-w-6xl mx-auto">
          {PILLARS.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="p-5 rounded-2xl bg-black/60 backdrop-blur-md border border-white/10 hover:border-[#00d2ff]/40 transition-all text-center flex flex-col items-center justify-start group"
              >
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#00d2ff] mb-3 group-hover:scale-110 transition-transform">
                  <Icon className="w-4 h-4" />
                </div>
                <h4 className="font-display text-xl font-bold uppercase text-white tracking-wide mb-1.5">
                  {pillar.title}
                </h4>
                <p className="text-zinc-400 text-xs leading-relaxed">
                  {pillar.desc}
                </p>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
