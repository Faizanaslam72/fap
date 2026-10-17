import React from 'react';
import { Flame, ShieldAlert } from 'lucide-react';
import { Language } from '../types.ts';
import { sounds, triggerHaptic } from '../utils/audio.ts';

interface HeaderProps {
  language: Language;
  onOpenEmergency: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  onOpenEmergency,
}) => {
  return (
    <header className="flex items-center justify-between gap-4 px-4 py-3 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 sticky top-0 z-30">
      {/* Brand Zone: Named 'Fap Control' */}
      <div className="flex items-center gap-2 shrink-0">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/20">
          <Flame className="w-5 h-5 text-slate-950 fill-current" />
        </div>
        <div className="flex flex-col">
          <span className="text-base font-bold tracking-tight text-white font-display whitespace-nowrap">
            Fap Control
          </span>
          <span className="text-[10px] text-slate-400 font-mono tracking-wider -mt-1">
            WILLPOWER & DISCIPLINE
          </span>
        </div>
      </div>

      {/* Emergency Urge Killer Action button */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={() => {
            sounds.playUrgeBreathingChime();
            triggerHaptic();
            onOpenEmergency();
          }}
          className="min-h-[40px] px-3.5 py-1.5 text-xs font-bold rounded-xl bg-rose-600/20 border border-rose-500/40 text-rose-300 hover:bg-rose-600/30 transition-all flex items-center gap-1.5 whitespace-nowrap active:scale-95 shadow-sm"
          aria-label="Emergency Urge Killer"
        >
          <ShieldAlert className="w-4 h-4 text-rose-400" />
          <span>URGE KILLER</span>
        </button>
      </div>
    </header>
  );
};
