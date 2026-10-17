import React, { useState, useRef } from 'react';
import { Award, Lock, CheckCircle2, Flame, Compass, ChevronRight } from 'lucide-react';
import { Language } from '../types.ts';
import { WARRIOR_RANKS_90, getRankForStreak } from '../utils/ranks90.ts';

interface MilestonesViewProps {
  currentStreakMs: number;
  language?: Language;
}

export const MilestonesView: React.FC<MilestonesViewProps> = ({
  currentStreakMs,
}) => {
  const [selectedPhase, setSelectedPhase] = useState<'all' | 'p1' | 'p2' | 'p3'>('all');
  const activeDayRef = useRef<HTMLDivElement | null>(null);

  const safeMs = Math.max(0, currentStreakMs);
  const currentDaysFloat = safeMs / (1000 * 60 * 60 * 24);
  const currentDayNumber = Math.min(90, Math.floor(currentDaysFloat) + 1);
  const currentRank = getRankForStreak(safeMs);

  const unlockedCount = Math.min(90, Math.floor(currentDaysFloat));
  const progressTo90 = Math.min(100, Math.round((currentDaysFloat / 90) * 100));

  const filteredRanks = WARRIOR_RANKS_90.filter((r) => {
    if (selectedPhase === 'p1') return r.day <= 30;
    if (selectedPhase === 'p2') return r.day > 30 && r.day <= 60;
    if (selectedPhase === 'p3') return r.day > 60;
    return true;
  });

  const handleJumpToCurrent = () => {
    if (activeDayRef.current) {
      activeDayRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Overview KPI Card */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-5 shadow-lg">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-amber-400 font-bold uppercase tracking-wider font-display">
              <Award className="w-4 h-4" />
              <span>90-DAY DAILY RANK ODYSSEY</span>
            </div>
            <h3 className="text-xl font-bold text-white font-display mt-0.5 flex items-center gap-2">
              <span>Day {currentDayNumber}: {currentRank.title}</span>
              <span className="text-2xl" role="img" aria-label={currentRank.title}>
                {currentRank.badge}
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Unlock a brand-new distinct warrior rank for every single clean day of your 90-day neurochemical reboot.
            </p>
          </div>

          <button
            onClick={handleJumpToCurrent}
            className="shrink-0 px-2.5 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 text-xs font-semibold flex items-center gap-1 transition-colors"
            title="Scroll to current day rank"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>My Rank</span>
          </button>
        </div>

        {/* 90-Day Progress Bar */}
        <div className="mt-4 pt-3 border-t border-slate-800/80">
          <div className="flex items-center justify-between text-xs font-mono text-slate-300 mb-1.5">
            <span>
              Unlocked: <strong className="text-amber-400 font-bold">{unlockedCount}</strong> / 90 Ranks
            </span>
            <span className="font-bold text-amber-400">{progressTo90}%</span>
          </div>

          <div className="h-2.5 w-full bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-emerald-400 transition-all duration-500"
              style={{ width: `${Math.max(2, progressTo90)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Phase Segmented Filter Controls */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl overflow-x-auto">
        <button
          onClick={() => setSelectedPhase('all')}
          className={`flex-1 shrink-0 min-w-[70px] py-1.5 px-3 text-xs font-medium rounded-lg transition-colors whitespace-nowrap text-center ${
            selectedPhase === 'all'
              ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          All (1–90)
        </button>
        <button
          onClick={() => setSelectedPhase('p1')}
          className={`flex-1 shrink-0 min-w-[85px] py-1.5 px-3 text-xs font-medium rounded-lg transition-colors whitespace-nowrap text-center ${
            selectedPhase === 'p1'
              ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Phase 1 (1–30)
        </button>
        <button
          onClick={() => setSelectedPhase('p2')}
          className={`flex-1 shrink-0 min-w-[85px] py-1.5 px-3 text-xs font-medium rounded-lg transition-colors whitespace-nowrap text-center ${
            selectedPhase === 'p2'
              ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Phase 2 (31–60)
        </button>
        <button
          onClick={() => setSelectedPhase('p3')}
          className={`flex-1 shrink-0 min-w-[85px] py-1.5 px-3 text-xs font-medium rounded-lg transition-colors whitespace-nowrap text-center ${
            selectedPhase === 'p3'
              ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Phase 3 (61–90)
        </button>
      </div>

      {/* 90 Daily Ranks Cards Feed */}
      <div className="space-y-2.5">
        {filteredRanks.map((rank) => {
          const isUnlocked = currentDaysFloat >= rank.day;
          const isCurrent = rank.day === currentDayNumber;
          const daysRemaining = Math.max(0, rank.day - Math.floor(currentDaysFloat));

          return (
            <div
              key={rank.day}
              ref={isCurrent ? activeDayRef : null}
              className={`rounded-2xl p-4 border transition-all ${
                isCurrent
                  ? 'bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border-amber-500/60 shadow-lg shadow-amber-950/30 ring-1 ring-amber-500/40'
                  : isUnlocked
                  ? 'bg-slate-900/90 border-slate-800 text-slate-200'
                  : 'bg-slate-950/40 border-slate-800/60 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 ${
                    isCurrent
                      ? 'bg-amber-500/20 border border-amber-500/40'
                      : isUnlocked
                      ? 'bg-emerald-500/10 border border-emerald-500/20'
                      : 'bg-slate-900 border border-slate-800'
                  }`}>
                    {rank.badge}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[11px] font-mono font-bold text-amber-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                        Day {rank.day}
                      </span>
                      <h4 className="text-sm font-bold text-white font-display">
                        {rank.title}
                      </h4>
                    </div>

                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      {rank.description}
                    </p>
                  </div>
                </div>

                {/* Right Status Badge */}
                <div className="shrink-0">
                  {isCurrent ? (
                    <span className="text-[11px] font-bold text-amber-300 bg-amber-500/20 border border-amber-500/40 px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm animate-pulse">
                      <Flame className="w-3.5 h-3.5 text-amber-400" />
                      <span>Active</span>
                    </span>
                  ) : isUnlocked ? (
                    <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Unlocked</span>
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-500 bg-slate-950 px-2 py-0.5 rounded border border-slate-800/80 flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      <span>{daysRemaining}d left</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
