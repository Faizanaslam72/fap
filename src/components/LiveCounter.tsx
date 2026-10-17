import React, { useEffect, useState } from 'react';
import { Shield, Sparkles, Award } from 'lucide-react';
import { Language } from '../types.ts';
import { breakdownDuration, getRankForStreak } from '../utils/streakCalculations.ts';

interface LiveCounterProps {
  currentStreakStartTime: number;
  language: Language;
  onOpenRelapseModal: () => void;
}

export const LiveCounter: React.FC<LiveCounterProps> = ({
  currentStreakStartTime,
  language,
  onOpenRelapseModal,
}) => {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const streakMs = Math.max(0, now - currentStreakStartTime);
  const { days, hours, minutes, seconds } = breakdownDuration(streakMs);
  const currentRank = getRankForStreak(streakMs);

  const startDateFormatted = new Date(currentStreakStartTime).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950 border border-slate-800 p-5 shadow-xl shadow-black/40">
      {/* Background glow & watermark-free ambient accent */}
      <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-12 -mb-12 w-48 h-48 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top row: Rank badge + start time */}
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="flex items-center gap-2">
          <span className="text-2xl" role="img" aria-label={currentRank.title}>
            {currentRank.badge}
          </span>
          <div>
            <div className="text-xs font-semibold text-amber-400 font-display uppercase tracking-wider flex items-center gap-1.5">
              <span>Day {currentRank.day}: {currentRank.title}</span>
              <Sparkles className="w-3 h-3 text-amber-400" />
            </div>
            <div className="text-[11px] text-slate-400">{currentRank.description}</div>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[10px] uppercase tracking-wider text-slate-500 block">
            {language === 'ur' ? 'SHURUAT KI TAREEKH' : 'STREAK STARTED'}
          </span>
          <span className="text-xs text-slate-300 font-mono tabular-nums">{startDateFormatted}</span>
        </div>
      </div>

      {/* Hero Counter Grid */}
      <div className="grid grid-cols-4 gap-2 text-center my-3 relative z-10">
        {/* Days */}
        <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3 flex flex-col items-center">
          <span className="text-3xl sm:text-4xl font-extrabold text-white font-mono tabular-nums tracking-tight">
            {days}
          </span>
          <span className="text-[10px] font-semibold text-slate-400 tracking-wider uppercase mt-1">
            {language === 'ur' ? 'Din' : 'Days'}
          </span>
        </div>

        {/* Hours */}
        <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3 flex flex-col items-center">
          <span className="text-3xl sm:text-4xl font-extrabold text-white font-mono tabular-nums tracking-tight">
            {hours.toString().padStart(2, '0')}
          </span>
          <span className="text-[10px] font-semibold text-slate-400 tracking-wider uppercase mt-1">
            {language === 'ur' ? 'Ghantay' : 'Hours'}
          </span>
        </div>

        {/* Minutes */}
        <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3 flex flex-col items-center">
          <span className="text-3xl sm:text-4xl font-extrabold text-white font-mono tabular-nums tracking-tight">
            {minutes.toString().padStart(2, '0')}
          </span>
          <span className="text-[10px] font-semibold text-slate-400 tracking-wider uppercase mt-1">
            {language === 'ur' ? 'Min' : 'Mins'}
          </span>
        </div>

        {/* Seconds with glowing tick */}
        <div className="bg-slate-950/70 border border-amber-500/20 rounded-xl p-3 flex flex-col items-center relative overflow-hidden">
          <span className="text-3xl sm:text-4xl font-extrabold text-amber-400 font-mono tabular-nums tracking-tight">
            {seconds.toString().padStart(2, '0')}
          </span>
          <span className="text-[10px] font-semibold text-amber-500/80 tracking-wider uppercase mt-1">
            {language === 'ur' ? 'Sec' : 'Secs'}
          </span>
          <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
        </div>
      </div>

      {/* Streak motivational subtext */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 relative z-10">
        <div className="flex items-center gap-1.5">
          <Shield className="w-3.5 h-3.5 text-emerald-400" />
          <span>
            {language === 'ur'
              ? 'Nafs par qabu qayam he. Himmat mat haarna!'
              : 'Willpower active. Every second is neural rewiring.'}
          </span>
        </div>
      </div>
    </div>
  );
};
