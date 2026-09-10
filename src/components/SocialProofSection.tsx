import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Star, ShieldCheck, CheckCircle2, MessageSquare, ThumbsUp, Filter } from 'lucide-react';
import { REVIEWS, BRAND_CONFIG } from '../data/productData';

export const SocialProofSection: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<string>('All');

  const filteredReviews = activeFilter === 'All'
    ? REVIEWS
    : REVIEWS.filter((r) => r.flavorUsed.includes(activeFilter));

  return (
    <section id="reviews" className="py-24 bg-[#080809] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#16181f] border border-white/10 text-xs font-mono-code text-[#ccff00] uppercase tracking-widest mb-4">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>COMMUNITY FEEDBACK</span>
            </div>

            {/* Headline from prompt */}
            <h2 className="font-display text-5xl sm:text-6xl lg:text-7xl font-black uppercase text-white tracking-tight leading-none mb-4">
              THE WORK SPEAKS.
            </h2>

            {/* Prominently Display ★★★★★ */}
            <div className="flex items-center gap-3 mt-3">
              <div className="flex items-center text-[#ccff00]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 fill-[#ccff00]" />
                ))}
              </div>
              <span className="font-display text-2xl font-bold text-white tracking-wide">
                {BRAND_CONFIG.rating} OUT OF 5.0
              </span>
              <span className="text-zinc-500 font-mono-code text-sm">
                ({BRAND_CONFIG.reviewCount} Verified Athlete Ratings)
              </span>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-mono-code text-zinc-500 mr-2 flex items-center gap-1">
              <Filter className="w-3 h-3" /> FILTER:
            </span>
            {['All', 'Electric Blue Razz', 'Sour Green Apple', 'Blood Orange Mojito'].map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-3 py-1.5 rounded text-xs font-mono-code cursor-pointer transition-all border ${
                  activeFilter === f
                    ? 'bg-[#ccff00] text-black font-bold border-[#ccff00]'
                    : 'bg-[#121316] text-zinc-400 border-white/10 hover:text-white'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredReviews.map((rev, index) => (
            <motion.div
              key={rev.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-[#111216] border border-white/10 hover:border-[#ccff00]/30 rounded-2xl p-7 flex flex-col justify-between transition-all duration-300 hover:bg-[#14151c]"
            >
              <div>
                {/* Header: Stars + Flavor + Date */}
                <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                  <div className="flex items-center text-[#ccff00]">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#ccff00]" />
                    ))}
                  </div>

                  <div className="flex items-center gap-2 text-xs font-mono-code text-zinc-500">
                    <span className="text-zinc-400 bg-white/5 px-2 py-0.5 rounded border border-white/5">
                      Flavor: {rev.flavorUsed}
                    </span>
                    <span>{rev.date}</span>
                  </div>
                </div>

                {/* Headline */}
                <h4 className="font-display text-2xl font-bold uppercase text-white tracking-wide mb-3">
                  "{rev.headline}"
                </h4>

                {/* Review Text */}
                <p className="text-zinc-300 text-sm leading-relaxed mb-6 font-normal">
                  {rev.reviewText}
                </p>
              </div>

              {/* Author Row with Customer First Name + Verified Purchase Indicator */}
              <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono-code">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center font-bold text-[#ccff00] uppercase text-[11px]">
                    {rev.firstName.charAt(0)}
                  </div>
                  <span className="font-bold text-white text-sm">
                    {rev.firstName}
                  </span>
                  {rev.verified && (
                    <span className="inline-flex items-center gap-1 text-[#ccff00] bg-[#ccff00]/10 px-2 py-0.5 rounded-full text-[10px] font-bold border border-[#ccff00]/20">
                      <CheckCircle2 className="w-3 h-3" />
                      VERIFIED BUYER
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1 text-zinc-500">
                  <ThumbsUp className="w-3 h-3 text-zinc-400" />
                  <span>Helpful (14)</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Realism Notice */}
        <div className="mt-10 text-center text-xs font-mono-code text-zinc-400 border border-dashed border-white/10 p-4 rounded-xl">
          ✓ All athlete reviews authenticated through post-delivery invoice order verification and scratch QR authentication.
        </div>

      </div>
    </section>
  );
};
