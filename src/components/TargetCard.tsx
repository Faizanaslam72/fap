import React from 'react';
import { Target, Trophy, ArrowUpRight, RotateCcw, CheckCircle2, Flame } from 'lucide-react';
import { Language } from '../types.ts';
import {
  formatDurationCompact,
  calculateNextTarget,
  RelapseRecord,
} from '../utils/streakCalculations.ts';
import { sounds, triggerHaptic } from '../utils/audio.ts';

interface TargetCardProps {
  currentStreakMs: number;
  lastRelapse: RelapseRecord | null;
  customTargetMs: number | null;
  language: Language;
  onOpenRelapseModal: () => void;
}

export const TargetCard: React.FC<TargetCardProps> = ({
  currentStreakMs,
  lastRelapse,
  customTargetMs,
  language,
  onOpenRelapseModal,
}) => {
  // Dynamic target per user prompt:
  // "jab bhi me fap relapse krunga to mera last control time mera next target ban jayega"
  const dynamicTargetMs = calculateNextTarget(lastRelapse);
  const activeTargetMs = customTargetMs || dynamicTargetMs;

  const isBeaten = currentStreakMs >= activeTargetMs;
  const progressRatio = Math.min(1, currentStreakMs / Math.max(1, activeTargetMs));
  const progressPercentage = Math.min(100, Math.round(progressRatio * 100));

  const diffMs = currentStreakMs - activeTargetMs;
  const remainingMs = Math.max(0, activeTargetMs - currentStreakMs);

  return (
    <div className={`rounded-2xl border p-5 transition-all relative overflow-hidden ${
      isBeaten
        ? 'bg-gradient-to-br from-emerald-950/60 via-slate-900 to-slate-950 border-emerald-500/50 shadow-lg shadow-emerald-950/30'
        : 'bg-gradient-to-br from-slate-900 to-slate-950 border-slate-800 shadow-md'
    }`}>
      {/* Top Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
            isBeaten ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
          }`}>
            {isBeaten ? <Trophy className="w-5 h-5" /> : <Target className="w-5 h-5" />}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 font-display">
                NEXT TARGET TO BEAT
              </span>
            </div>
            <h2 className="text-xl font-bold text-white font-display mt-0.5 flex items-center gap-2">
              <span className="font-mono tabular-nums">{formatDurationCompact(activeTargetMs)}</span>
              {isBeaten && (
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  RECORD BEATEN!
                </span>
              )}
            </h2>
          </div>
        </div>
      </div>

      {/* Dynamic Rule Explainer for User */}
      <div className="text-[11px] text-slate-400 mb-4 bg-slate-950/60 rounded-lg p-2.5 border border-slate-800/60 flex items-center gap-2">
        <Flame className="w-4 h-4 text-orange-400 shrink-0" />
        <span>
          Rule: Whenever you relapse, your last control duration automatically becomes your next milestone target to beat!
        </span>
      </div>

      {/* Progress Bar & Status */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-slate-400">Streak vs Target:</span>
          <span className={`font-bold tabular-nums ${isBeaten ? 'text-emerald-400' : 'text-amber-400'}`}>
            {progressPercentage}%
          </span>
        </div>

        {/* Progress bar container */}
        <div className="h-3 w-full bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isBeaten
                ? 'bg-gradient-to-r from-emerald-500 to-teal-400 shadow-sm shadow-emerald-500/50'
                : 'bg-gradient-to-r from-amber-500 to-orange-500 shadow-sm shadow-amber-500/50'
            }`}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        {/* Remaining / Exceeded Status Text */}
        <div className="pt-1 flex items-center justify-between text-xs">
          {isBeaten ? (
            <div className="text-emerald-300 font-medium flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
              <span>
                Surpassed previous record by +{formatDurationCompact(diffMs)}!
              </span>
            </div>
          ) : (
            <div className="text-slate-400 flex items-center gap-1 font-mono">
              <span className="text-amber-400 font-bold tabular-nums">
                {formatDurationCompact(remainingMs)}
              </span>
              <span>remaining to beat record</span>
            </div>
          )}
        </div>
      </div>

      {/* Action Row: Log Relapse Button */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-3">
        <div className="text-[11px] text-slate-500">
          {lastRelapse ? (
            <span>
              Last Streak:{' '}
              <strong className="text-slate-300 font-mono">
                {formatDurationCompact(lastRelapse.controlDurationMs)}
              </strong>
            </span>
          ) : (
            <span>First streak in progress</span>
          )}
        </div>

        <button
          onClick={() => {
            sounds.playTap();
            triggerHaptic();
            onOpenRelapseModal();
          }}
          className="min-h-[44px] px-3.5 py-1.5 rounded-xl bg-slate-800/90 hover:bg-rose-950/40 border border-slate-700 hover:border-rose-500/50 text-slate-300 hover:text-rose-300 transition-all text-xs font-semibold flex items-center gap-2 active:scale-95 shadow-sm"
          aria-label="Log a Relapse"
        >
          <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
          <span>Log Relapse (Reset)</span>
        </button>
      </div>
    </div>
  );
};
