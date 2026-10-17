import React, { useState } from 'react';
import { Quote, RefreshCw, Shield, Sparkles } from 'lucide-react';
import { WARRIOR_CODE_QUOTES } from '../utils/warriorQuotes.ts';
import { sounds, triggerHaptic } from '../utils/audio.ts';

interface WarriorCodeCardProps {
  currentDayNumber?: number;
}

export const WarriorCodeCard: React.FC<WarriorCodeCardProps> = ({ currentDayNumber = 1 }) => {
  const initialIndex = (Math.max(1, currentDayNumber) - 1) % WARRIOR_CODE_QUOTES.length;
  const [index, setIndex] = useState(initialIndex);

  const quote = WARRIOR_CODE_QUOTES[index];

  const handleNext = () => {
    sounds.playTap();
    triggerHaptic();
    setIndex((prev) => (prev + 1) % WARRIOR_CODE_QUOTES.length);
  };

  const handleRandom = () => {
    sounds.playTap();
    triggerHaptic();
    const randomIndex = Math.floor(Math.random() * WARRIOR_CODE_QUOTES.length);
    setIndex(randomIndex);
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-4 shadow-sm relative overflow-hidden group">
      {/* Ambient background accent */}
      <div className="absolute top-0 right-0 -mr-8 -mt-8 w-24 h-24 bg-amber-500/5 rounded-full blur-xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-amber-500/10 text-amber-400 flex items-center justify-center">
            <Quote className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400 font-display">
            WARRIOR CODE #{quote.id}/100
          </span>
          {quote.category && (
            <span className="text-[10px] bg-slate-950 border border-slate-800 text-slate-400 px-2 py-0.5 rounded-full font-mono">
              {quote.category}
            </span>
          )}
        </div>

        <button
          onClick={handleNext}
          className="text-xs text-slate-400 hover:text-white flex items-center gap-1 bg-slate-950/80 hover:bg-slate-800 px-2 py-1 rounded-lg border border-slate-800 transition-colors"
          title="Next Warrior Code quote (1 of 100)"
          aria-label="Next Quote"
        >
          <RefreshCw className="w-3 h-3 text-amber-400" />
          <span className="text-[11px]">Next</span>
        </button>
      </div>

      {/* Quote text */}
      <blockquote className="text-xs sm:text-sm text-slate-200 font-serif italic leading-relaxed pl-1 border-l-2 border-amber-500/40 my-2">
        "{quote.text}"
      </blockquote>

      {/* Author signature */}
      <div className="text-right text-[11px] font-semibold text-slate-400 font-display mt-1">
        — {quote.author}
      </div>
    </div>
  );
};
