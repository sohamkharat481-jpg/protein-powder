import React from 'react';
import { motion } from 'motion/react';
import { Zap, Target, Activity, Flame, Shield, Check } from 'lucide-react';
import { BENEFITS } from '../data/productData';

export const BenefitsSection: React.FC = () => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Zap':
        return <Zap className="w-7 h-7 text-[#ccff00]" />;
      case 'Target':
        return <Target className="w-7 h-7 text-[#ccff00]" />;
      case 'Activity':
        return <Activity className="w-7 h-7 text-[#ccff00]" />;
      case 'Flame':
        return <Flame className="w-7 h-7 text-[#ccff00]" />;
      default:
        return <Zap className="w-7 h-7 text-[#ccff00]" />;
    }
  };

  return (
    <section id="benefits" className="py-24 bg-[#0c0d10] relative border-y border-white/5">
      {/* Background Accent Lines */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#16181f] border border-white/10 text-xs font-mono-code text-[#ccff00] uppercase tracking-widest mb-4">
            <span>PERFORMANCE ARCHITECTURE</span>
          </div>
          <h2 className="font-display text-5xl sm:text-6xl lg:text-7xl font-black uppercase text-white tracking-tight leading-none mb-4">
            BUILT FOR THE WORK.
          </h2>
          <p className="text-zinc-400 text-base sm:text-lg max-w-2xl leading-relaxed">
            Every component is calibrated for the athlete who demands uncompromising preparation. Clean, balanced, and engineered for high-intensity training.
          </p>
        </div>

        {/* 4 Premium Benefit Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {BENEFITS.map((b, idx) => (
            <motion.div
              key={b.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="group relative bg-[#121318] hover:bg-[#161820] border border-white/10 hover:border-[#ccff00]/40 rounded-xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
            >
              <div>
                {/* Top Row: Icon + Metric pill */}
                <div className="flex items-center justify-between mb-8">
                  <div className="w-14 h-14 rounded-xl bg-[#191b22] border border-white/10 flex items-center justify-center group-hover:border-[#ccff00]/40 group-hover:scale-105 transition-all">
                    {getIcon(b.iconName)}
                  </div>
                  <span className="text-[11px] font-mono-code font-bold text-zinc-400 bg-white/5 px-2.5 py-1 rounded border border-white/5">
                    {b.metric}
                  </span>
                </div>

                {/* Subtitle / Emoji */}
                <div className="text-xs font-mono-code text-[#ccff00] font-semibold tracking-wider uppercase mb-1">
                  {b.subtitle}
                </div>

                {/* Benefit Title */}
                <h3 className="font-display text-3xl font-black tracking-wide text-white uppercase mb-3 group-hover:text-[#ccff00] transition-colors">
                  {b.title}
                </h3>

                {/* Description */}
                <p className="text-zinc-300 text-sm leading-relaxed mb-6 font-normal">
                  {b.description}
                </p>
              </div>

              {/* Card Footer Quality Indicator */}
              <div className="pt-4 border-t border-white/5 flex items-center gap-2 text-xs font-mono-code text-zinc-500">
                <Check className="w-3.5 h-3.5 text-[#ccff00]" />
                <span>Verified Active Protocol</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Responsible Compliance Notice */}
        <div className="mt-12 p-4 rounded-lg bg-[#111216] border border-white/10 flex items-center gap-3 text-xs text-zinc-400 font-mono-code">
          <Shield className="w-4 h-4 text-[#ccff00] shrink-0" />
          <span>
            Formulated responsibly without unverified stimulants or prohibited substances. Follow label directions and consult your physician prior to introducing sports nutrition supplements to your routine.
          </span>
        </div>

      </div>
    </section>
  );
};
