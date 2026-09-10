import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Beaker, Check, ChevronRight, FileText, Info, Sparkles, X } from 'lucide-react';
import { INGREDIENTS, BRAND_CONFIG } from '../data/productData';
import { Ingredient } from '../types';

export const FormulaSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeIngredient, setActiveIngredient] = useState<Ingredient | null>(null);
  const [showFactsModal, setShowFactsModal] = useState<boolean>(false);

  const categories = ['All', 'Endurance & Pump', 'Focus & Nootropic', 'Energy & Drive', 'Hydration & Electrolytes'];

  const filteredIngredients = selectedCategory === 'All'
    ? INGREDIENTS
    : INGREDIENTS.filter((item) => item.category === selectedCategory || (selectedCategory === 'Endurance & Pump' && item.category === 'Performance & Power'));

  return (
    <section id="formula" className="py-24 bg-[#080809] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#16181f] border border-white/10 text-xs font-mono-code text-[#ccff00] uppercase tracking-widest mb-4">
              <Beaker className="w-3.5 h-3.5" />
              <span>TRANSPARENT DISCLOSURE</span>
            </div>
            <h2 className="font-display text-5xl sm:text-6xl lg:text-7xl font-black uppercase text-white tracking-tight leading-none">
              WHAT'S INSIDE MATTERS.
            </h2>
            <p className="text-zinc-400 text-base sm:text-lg max-w-2xl mt-4">
              No proprietary hiding. No dusting. Every active compound is quantified so you know precisely what is priming your neuromuscular system.
            </p>
          </div>

          {/* Quick Action: View Supplement Facts Sheet */}
          <button
            onClick={() => setShowFactsModal(true)}
            className="inline-flex items-center gap-2.5 px-5 py-3 rounded-lg bg-[#14151a] hover:bg-[#1d1f27] border border-white/15 hover:border-[#ccff00]/40 text-sm font-mono-code text-white transition-all cursor-pointer w-fit"
            id="view-full-supplement-facts-btn"
          >
            <FileText className="w-4 h-4 text-[#ccff00]" />
            <span>VIEW SUPPLEMENT FACTS PANEL</span>
          </button>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-lg text-xs font-mono-code whitespace-nowrap transition-all cursor-pointer border ${
                selectedCategory === cat
                  ? 'bg-[#ccff00] text-black font-bold border-[#ccff00] shadow-[0_0_12px_rgba(204,255,0,0.25)]'
                  : 'bg-[#121316] text-zinc-400 border-white/10 hover:text-white hover:border-white/25'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Interactive Ingredients Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredIngredients.map((item, index) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              key={item.id}
              onClick={() => setActiveIngredient(item)}
              className="group bg-[#111216] hover:bg-[#15171e] border border-white/10 hover:border-[#ccff00]/50 rounded-xl p-6 transition-all duration-300 flex flex-col justify-between cursor-pointer hover:shadow-[0_8px_25px_rgba(0,0,0,0.6)]"
            >
              <div>
                {/* Category & Dosage Pill */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-mono-code uppercase px-2.5 py-1 rounded bg-white/5 text-zinc-400 border border-white/5">
                    {item.category}
                  </span>
                  <span className="text-sm font-mono-code font-bold text-[#ccff00] bg-[#ccff00]/10 px-2.5 py-0.5 rounded border border-[#ccff00]/20">
                    {item.amount}
                  </span>
                </div>

                {/* Ingredient Title */}
                <h3 className="font-display text-2xl font-black text-white tracking-wide uppercase mb-2 group-hover:text-[#ccff00] transition-colors">
                  {item.name}
                </h3>

                {/* Primary Role */}
                <p className="text-sm text-zinc-300 leading-relaxed mb-4">
                  {item.role}
                </p>
              </div>

              {/* Card Footer: Detail prompt */}
              <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono-code text-zinc-500 group-hover:text-zinc-300 transition-colors">
                <span className="flex items-center gap-1">
                  <Info className="w-3.5 h-3.5 text-[#ccff00]" />
                  <span>Clinical Research Role</span>
                </span>
                <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:translate-x-1 transition-transform group-hover:text-[#ccff00]" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Placeholder Information Note */}
        <div className="mt-8 p-4 rounded-xl bg-[#111216]/60 border border-dashed border-white/15 flex items-center justify-between flex-wrap gap-4 text-xs font-mono-code text-zinc-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#ccff00]"></span>
            <span>NOTE: Brand ingredient placeholders are editable to reflect your confirmed product formulation and lab certificates.</span>
          </div>
          <span className="text-zinc-500">SERVING SIZE: 1 LEVEL SCOOP (15.0g)</span>
        </div>

      </div>

      {/* Ingredient Detail Modal */}
      <AnimatePresence>
        {activeIngredient && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#121317] border border-white/20 rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative"
            >
              <button
                onClick={() => setActiveIngredient(null)}
                className="absolute top-5 right-5 p-2 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-[11px] font-mono-code text-[#ccff00] uppercase tracking-widest mb-1">
                {activeIngredient.category}
              </div>
              <h3 className="font-display text-3xl font-black text-white uppercase mb-1">
                {activeIngredient.name}
              </h3>
              <div className="text-lg font-mono-code font-bold text-[#ccff00] mb-6">
                Active Dosage: {activeIngredient.amount}
              </div>

              <div className="space-y-4 text-sm text-zinc-300">
                <div className="p-4 rounded-lg bg-black/40 border border-white/10">
                  <h4 className="text-xs font-mono-code text-white uppercase font-bold mb-1">
                    Functional Physiological Role
                  </h4>
                  <p className="leading-relaxed text-zinc-300">
                    {activeIngredient.role}
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-black/40 border border-white/10">
                  <h4 className="text-xs font-mono-code text-white uppercase font-bold mb-1">
                    Athletic Application
                  </h4>
                  <p className="leading-relaxed text-zinc-300">
                    {activeIngredient.scienceDetail}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs font-mono-code text-zinc-500">
                  100% Fully Disclosed
                </span>
                <button
                  onClick={() => setActiveIngredient(null)}
                  className="px-4 py-2 bg-[#ccff00] text-black font-mono-code font-bold text-xs rounded uppercase cursor-pointer"
                >
                  Close Window
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Supplement Facts Panel Modal */}
      <AnimatePresence>
        {showFactsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0e0f13] border border-white/20 rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setShowFactsModal(false)}
                className="absolute top-5 right-5 p-2 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Classic Supplement Facts Box Style */}
              <div className="border-4 border-white p-4 bg-white text-black font-sans text-xs">
                <h3 className="text-3xl font-black tracking-tight border-b-8 border-black pb-1 leading-none font-display">
                  Supplement Facts
                </h3>
                <div className="flex justify-between py-1 border-b border-black font-semibold">
                  <span>Serving Size: 1 Scoop (15g)</span>
                  <span>Servings Per Container: {BRAND_CONFIG.servingsCount}</span>
                </div>

                <div className="flex justify-between py-1 border-b-4 border-black font-black text-sm">
                  <span>Amount Per Serving</span>
                  <span>% Daily Value*</span>
                </div>

                {/* Calories / Sodium */}
                <div className="flex justify-between py-1 border-b border-zinc-400">
                  <span className="font-bold">Calories: 5</span>
                  <span></span>
                </div>
                <div className="flex justify-between py-1 border-b border-zinc-400">
                  <span>Total Carbohydrate 1g</span>
                  <span>&lt;1%</span>
                </div>
                <div className="flex justify-between py-1 border-b-4 border-black">
                  <span>Sodium (from Pink Himalayan Sea Salt) 200mg</span>
                  <span>9%</span>
                </div>

                {/* Active Blend List */}
                {INGREDIENTS.map((ing) => (
                  <div key={ing.id} className="flex justify-between py-1 border-b border-zinc-400">
                    <span className="font-bold">{ing.name}</span>
                    <span className="font-bold">{ing.amount} †</span>
                  </div>
                ))}

                <div className="pt-2 text-[10px] leading-tight text-zinc-700">
                  * Percent Daily Values are based on a 2,000 calorie diet.<br />
                  † Daily Value (DV) not established.<br />
                  Other Ingredients: Natural Flavors, Malic Acid, Stevia Leaf Extract, Silicon Dioxide.<br />
                  <strong>100% VEGETARIAN (GREEN DOT) • ZERO SUGAR • GLUTEN FREE</strong><br />
                  <strong>{BRAND_CONFIG.fssaiNumber}</strong> • Manufactured in a GMP & US FDA Registered Facility.
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowFactsModal(false)}
                  className="px-5 py-2.5 bg-[#ccff00] text-black font-mono-code text-xs font-bold rounded uppercase cursor-pointer"
                >
                  Close Facts Panel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
};
