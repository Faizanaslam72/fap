import React, { useState } from 'react';
import {
  Clock,
  Calendar,
  AlertTriangle,
  TrendingUp,
  Flame,
  Moon,
  ChevronDown,
  Filter,
  CheckCircle,
} from 'lucide-react';
import { Language } from '../types.ts';
import {
  calculateAverageControlTime,
  calculateAverageRelapseTimeOfDay,
  calculateWorstRelapseDay,
  calculatePeakRelapseDate,
  formatDurationCompact,
  breakdownDuration,
  RelapseRecord,
} from '../utils/streakCalculations.ts';
import { sounds, triggerHaptic } from '../utils/audio.ts';

interface AnalyticsViewProps {
  relapses: RelapseRecord[];
  currentStreakMs: number;
  language?: Language;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  relapses,
  currentStreakMs,
  language = 'en',
}) => {
  const [filterTrigger, setFilterTrigger] = useState<string>('all');

  // 1. Average Control Time
  const avgControlMs = calculateAverageControlTime(relapses, currentStreakMs);
  const avgControlFormatted = formatDurationCompact(avgControlMs);

  // 2. Average Time of Masturbation (Circular Mean on 24hr Clock)
  const avgTimeOfDay = calculateAverageRelapseTimeOfDay(relapses);

  // 3. Worst Relapse Day Analysis
  const worstDayData = calculateWorstRelapseDay(relapses);
  const peakDate = calculatePeakRelapseDate(relapses);

  // 4. Best Streak achieved
  const allStreakDurations = [...relapses.map((r) => r.controlDurationMs), currentStreakMs];
  const maxStreakMs = Math.max(0, ...allStreakDurations);

  // Filtered relapses list
  const filteredRelapses = relapses
    .filter((r) => filterTrigger === 'all' || r.trigger === filterTrigger)
    .sort((a, b) => b.timestamp - a.timestamp);

  // Time of day segments
  const timeBuckets = {
    lateNight: relapses.filter((r) => {
      const h = new Date(r.timestamp).getHours();
      return h >= 22 || h < 4;
    }).length,
    morning: relapses.filter((r) => {
      const h = new Date(r.timestamp).getHours();
      return h >= 4 && h < 12;
    }).length,
    afternoon: relapses.filter((r) => {
      const h = new Date(r.timestamp).getHours();
      return h >= 12 && h < 18;
    }).length,
    evening: relapses.filter((r) => {
      const h = new Date(r.timestamp).getHours();
      return h >= 18 && h < 22;
    }).length,
  };

  const totalRelapses = relapses.length;

  return (
    <div className="space-y-5">
      {/* SECTION 1: TOP KEY METRICS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Metric 1: Average Control Time */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span className="font-semibold uppercase tracking-wider text-amber-400 font-display">
                {language === 'ur' ? 'Average Control Time' : 'Average Control Streak'}
              </span>
              <TrendingUp className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums tracking-tight mt-1">
              {avgControlFormatted}
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-800/80 text-[11px] text-slate-400">
            {currentStreakMs > avgControlMs ? (
              <span className="text-emerald-400 font-medium">
                {language === 'ur'
                  ? 'Apka current streak average se behtar chal raha he!'
                  : 'Current streak is above your historical average!'}
              </span>
            ) : (
              <span>
                {language === 'ur'
                  ? `Average tak pohnchne me ${formatDurationCompact(avgControlMs - currentStreakMs)} baqi`
                  : `${formatDurationCompact(avgControlMs - currentStreakMs)} to reach average`}
              </span>
            )}
          </div>
        </div>

        {/* Metric 2: Average Time of Masturbation */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span className="font-semibold uppercase tracking-wider text-rose-400 font-display">
                {language === 'ur' ? 'Avg Relapse / Fap Time' : 'Avg Time of Masturbation'}
              </span>
              <Moon className="w-4 h-4 text-rose-400" />
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums tracking-tight">
                {avgTimeOfDay.formatted12h}
              </span>
              <span className="text-xs font-semibold text-rose-400 px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/20">
                {avgTimeOfDay.periodLabel}
              </span>
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
            <span>
              {language === 'ur'
                ? `Khatra Zone: ${avgTimeOfDay.formatted12h} ke qareeb phone door rakhein!`
                : `Danger Zone: High vulnerability detected around ${avgTimeOfDay.formatted12h}.`}
            </span>
          </div>
        </div>
      </div>

      {/* SECTION 2: WORST RELAPSE DAY (KIS DIN SAB SE ZYDA RELAPSE HUE) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-rose-400" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-white font-display">
                {language === 'ur' ? 'Sab Se Zyda Relapse Ka Din' : 'Worst Relapse Day of Week'}
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {language === 'ur'
                ? 'Haftay ke kis din sab se zyda relapse hue or trigger kya tha'
                : 'Day-of-week vulnerability analysis based on your history'}
            </p>
          </div>

          {/* Worst Day Highlight Callout */}
          <div className="bg-rose-950/40 border border-rose-500/30 rounded-xl px-3 py-1.5 flex items-center gap-2 self-start sm:self-auto">
            <span className="text-xs text-rose-300">
              {language === 'ur' ? 'Peak Din:' : 'Worst Day:'}
            </span>
            <span className="text-sm font-bold text-white font-mono">
              {worstDayData.worstDayName}
            </span>
            <span className="text-xs text-rose-400 font-mono">
              ({worstDayData.worstDayCount} relapses · {worstDayData.worstDayPercentage}%)
            </span>
          </div>
        </div>

        {/* Day-of-week Frequency Bar Chart */}
        <div className="space-y-2 mt-3">
          {worstDayData.breakdown.map((day) => {
            const isWorst = day.dayName === worstDayData.worstDayName && day.count > 0;
            return (
              <div key={day.dayName} className="flex items-center gap-2.5 text-xs">
                <span className={`w-20 font-medium ${isWorst ? 'text-rose-400 font-bold' : 'text-slate-400'}`}>
                  {day.dayName.slice(0, 3)}
                  {isWorst && <span className="text-[10px] ml-1 text-rose-400 font-normal">● Peak</span>}
                </span>

                {/* Bar */}
                <div className="flex-1 h-3 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      isWorst ? 'bg-gradient-to-r from-rose-500 to-amber-500' : 'bg-slate-700'
                    }`}
                    style={{ width: `${Math.max(day.percentage, day.count > 0 ? 8 : 0)}%` }}
                  />
                </div>

                {/* Count and percent */}
                <span className="w-16 text-right font-mono tabular-nums text-slate-300 text-[11px]">
                  {day.count} ({day.percentage}%)
                </span>
              </div>
            );
          })}
        </div>

        {/* Peak Date Alert */}
        {peakDate && (
          <div className="mt-4 pt-3 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
            <span>
              {language === 'ur' ? 'Tareekh jis din sab se zyda relapse hue:' : 'Date with most relapses:'}
            </span>
            <span className="font-mono text-slate-200 font-bold">
              {peakDate.dateString} ({peakDate.count} {language === 'ur' ? 'bar' : 'times'})
            </span>
          </div>
        )}
      </div>

      {/* SECTION 3: 24-HOUR VULNERABILITY TIME DISTRIBUTION */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
        <h3 className="text-sm font-bold uppercase tracking-wider text-white font-display mb-1 flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-amber-400" />
          <span>{language === 'ur' ? 'Waqt Ki Taqseem (24-Hour Breakdown)' : '24-Hour Time Distribution'}</span>
        </h3>
        <p className="text-xs text-slate-400 mb-4">
          {language === 'ur'
            ? 'Din ke kis hissay me sab se zyda kamzoori pesh aayi'
            : 'When relapses occur most throughout the 24-hour cycle'}
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {/* Late Night */}
          <div className="bg-slate-950/80 border border-rose-500/30 rounded-xl p-3">
            <div className="flex items-center justify-between text-xs text-rose-400 mb-1">
              <span>{language === 'ur' ? 'Late Night' : 'Late Night'}</span>
              <Moon className="w-3.5 h-3.5" />
            </div>
            <div className="text-[10px] text-slate-500">10 PM - 4 AM</div>
            <div className="text-xl font-bold font-mono text-white mt-1">
              {timeBuckets.lateNight}
              <span className="text-xs text-slate-400 font-normal ml-1">
                ({totalRelapses > 0 ? Math.round((timeBuckets.lateNight / totalRelapses) * 100) : 0}%)
              </span>
            </div>
          </div>

          {/* Morning */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3">
            <div className="flex items-center justify-between text-xs text-blue-400 mb-1">
              <span>{language === 'ur' ? 'Subah' : 'Morning'}</span>
              <span className="text-xs">🌅</span>
            </div>
            <div className="text-[10px] text-slate-500">4 AM - 12 PM</div>
            <div className="text-xl font-bold font-mono text-white mt-1">
              {timeBuckets.morning}
              <span className="text-xs text-slate-400 font-normal ml-1">
                ({totalRelapses > 0 ? Math.round((timeBuckets.morning / totalRelapses) * 100) : 0}%)
              </span>
            </div>
          </div>

          {/* Afternoon */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3">
            <div className="flex items-center justify-between text-xs text-amber-400 mb-1">
              <span>{language === 'ur' ? 'Dopahar' : 'Afternoon'}</span>
              <span className="text-xs">☀️</span>
            </div>
            <div className="text-[10px] text-slate-500">12 PM - 6 PM</div>
            <div className="text-xl font-bold font-mono text-white mt-1">
              {timeBuckets.afternoon}
              <span className="text-xs text-slate-400 font-normal ml-1">
                ({totalRelapses > 0 ? Math.round((timeBuckets.afternoon / totalRelapses) * 100) : 0}%)
              </span>
            </div>
          </div>

          {/* Evening */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3">
            <div className="flex items-center justify-between text-xs text-purple-400 mb-1">
              <span>{language === 'ur' ? 'Shaam' : 'Evening'}</span>
              <span className="text-xs">🌇</span>
            </div>
            <div className="text-[10px] text-slate-500">6 PM - 10 PM</div>
            <div className="text-xl font-bold font-mono text-white mt-1">
              {timeBuckets.evening}
              <span className="text-xs text-slate-400 font-normal ml-1">
                ({totalRelapses > 0 ? Math.round((timeBuckets.evening / totalRelapses) * 100) : 0}%)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 4: DETAILED RELAPSE HISTORY WITH DATES & TIME (AS REQUESTED) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white font-display">
              {language === 'ur' ? 'Relapse History (Tareekh aur Waqt ke Sath)' : 'Relapse Log with Dates & Times'}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {language === 'ur'
                ? 'Har relapse ki exact date, waqt, pichla control time aur waja'
                : 'Exact timestamp, control duration achieved, and trigger for every relapse'}
            </p>
          </div>

          {/* Filter dropdown */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="text-xs text-slate-400">{language === 'ur' ? 'Filter:' : 'Filter:'}</span>
            <select
              value={filterTrigger}
              onChange={(e) => setFilterTrigger(e.target.value)}
              className="bg-slate-950 border border-slate-700 text-xs text-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-amber-400"
              aria-label="Filter relapses by trigger"
            >
              <option value="all">{language === 'ur' ? 'Tamam Triggers' : 'All Triggers'}</option>
              <option value="Late Night Phone Scrolling">Late Night Phone Scrolling</option>
              <option value="Boredom & Free Time">Boredom & Free Time</option>
              <option value="Social Media / Reels / Triggers">Social Media / Reels</option>
              <option value="Stress & Frustration">Stress & Frustration</option>
            </select>
          </div>
        </div>

        {/* Relapses List */}
        {filteredRelapses.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-xs">
            {language === 'ur' ? 'Koi relapse record nahi mila.' : 'No relapse records found.'}
          </div>
        ) : (
          <div className="divide-y divide-slate-800/80">
            {filteredRelapses.map((r) => {
              const dateObj = new Date(r.timestamp);
              const formattedDate = dateObj.toLocaleDateString('en-US', {
                weekday: 'short',
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              });
              const formattedTime = dateObj.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div key={r.id} className="py-3 flex items-start justify-between gap-3 group">
                  <div className="space-y-1">
                    {/* Date and Time row */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-white font-mono">{formattedDate}</span>
                      <span className="text-xs font-bold text-amber-400 font-mono bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                        {formattedTime}
                      </span>
                      <span className="text-[11px] text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded">
                        {r.trigger}
                      </span>
                    </div>

                    {/* Control time achieved before this relapse */}
                    <div className="text-xs text-slate-400 flex items-center gap-2">
                      <span>{language === 'ur' ? 'Control Time:' : 'Streak Controlled:'}</span>
                      <strong className="text-emerald-400 font-mono font-bold">
                        {formatDurationCompact(r.controlDurationMs)}
                      </strong>
                    </div>

                    {/* Note if any */}
                    {r.note && (
                      <p className="text-xs text-slate-400 italic bg-slate-950/50 p-2 rounded-lg border border-slate-800/50 mt-1">
                        "{r.note}"
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
