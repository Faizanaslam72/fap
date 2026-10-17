import React, { useState, useEffect } from 'react';
import { Header } from './components/Header.tsx';
import { LiveCounter } from './components/LiveCounter.tsx';
import { TargetCard } from './components/TargetCard.tsx';
import { AnalyticsView } from './components/AnalyticsView.tsx';
import { MilestonesView } from './components/MilestonesView.tsx';
import { RelapseModal } from './components/RelapseModal.tsx';
import { EmergencyUrgeModal } from './components/EmergencyUrgeModal.tsx';
import { BottomNav, NavTab } from './components/BottomNav.tsx';
import { WarriorCodeCard } from './components/WarriorCodeCard.tsx';
import { loadState, saveState, getDefaultState } from './utils/storage.ts';
import { MDFState } from './types.ts';
import {
  RelapseRecord,
  calculateNextTarget,
  formatDurationCompact,
  calculateWorstRelapseDay,
  calculateAverageRelapseTimeOfDay,
  shouldResetForNewYear,
  performNewYearReset,
} from './utils/streakCalculations.ts';
import { sounds, triggerHaptic } from './utils/audio.ts';
import { Lightbulb, Download, CalendarCheck2 } from 'lucide-react';

export default function App() {
  const [state, setState] = useState<MDFState>(() => {
    const loaded = loadState();
    return {
      ...loaded,
      settings: {
        ...loaded.settings,
        language: 'en',
        viewMode: 'mobile-frame',
      },
      lastActiveYear: loaded.lastActiveYear || new Date().getFullYear(),
    };
  });

  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [isRelapseModalOpen, setIsRelapseModalOpen] = useState(false);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [now, setNow] = useState(Date.now());
  const [newYearResetNotice, setNewYearResetNotice] = useState(false);

  // Keep a second tick for live duration calculations and check for New Year reset
  useEffect(() => {
    const timer = setInterval(() => {
      const currentMs = Date.now();
      setNow(currentMs);

      // Automatic New Year reset check:
      // "all data reset to zero automatically on the new year night exactly when januany 1 starts"
      if (shouldResetForNewYear(state.lastActiveYear, currentMs)) {
        const resetFields = performNewYearReset(currentMs);
        setState((prev) => ({
          ...prev,
          ...resetFields,
        }));
        setNewYearResetNotice(true);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [state.lastActiveYear]);

  // Initial check on component mount
  useEffect(() => {
    if (shouldResetForNewYear(state.lastActiveYear, Date.now())) {
      const resetFields = performNewYearReset(Date.now());
      setState((prev) => ({
        ...prev,
        ...resetFields,
      }));
      setNewYearResetNotice(true);
    }
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    saveState(state);
  }, [state]);

  const currentStreakMs = Math.max(0, now - state.currentStreakStartTime);
  const lastRelapse = state.relapses.length > 0 ? state.relapses[0] : null;

  // User logs a relapse:
  // "jab bhi me fap relapse krunga to mera last control time mera next target ban jayega"
  const handleConfirmRelapse = (data: {
    timestamp: number;
    controlDurationMs: number;
    trigger: string;
    note: string;
    moodRating: number;
  }) => {
    const newRecord: RelapseRecord = {
      id: `relapse-${Date.now()}`,
      timestamp: data.timestamp,
      controlDurationMs: data.controlDurationMs,
      trigger: data.trigger,
      note: data.note,
      moodRating: data.moodRating,
    };

    setState((prev) => ({
      ...prev,
      // Last control time is set as next target!
      lastRelapseControlMs: data.controlDurationMs,
      customTargetMs: null,
      currentStreakStartTime: data.timestamp,
      relapses: [newRecord, ...prev.relapses],
      lastActiveYear: new Date(data.timestamp).getFullYear(),
    }));

    // Switch to dashboard so they see the fresh counter and their new target
    setActiveTab('dashboard');
  };

  // Export JSON backup (allows user to keep personal record without cheating)
  const handleExportData = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(state, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `fap_control_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    sounds.playTap();
  };

  const worstDay = calculateWorstRelapseDay(state.relapses);
  const avgTime = calculateAverageRelapseTimeOfDay(state.relapses);
  const currentYear = new Date(now).getFullYear();

  // Main content depending on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-4">
            {/* New Year Auto-Reset Banner if triggered */}
            {newYearResetNotice && (
              <div className="bg-emerald-950/60 border border-emerald-500/40 rounded-2xl p-3.5 flex items-center justify-between text-xs text-emerald-200">
                <div className="flex items-center gap-2">
                  <CalendarCheck2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Happy New Year {currentYear}! All streaks have automatically reset to zero for a clean start.</span>
                </div>
                <button
                  onClick={() => setNewYearResetNotice(false)}
                  className="text-slate-400 hover:text-white ml-2 text-xs font-bold"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Live Counter */}
            <LiveCounter
              currentStreakStartTime={state.currentStreakStartTime}
              language="en"
              onOpenRelapseModal={() => setIsRelapseModalOpen(true)}
            />

            {/* Dynamic Target to Beat Card */}
            <TargetCard
              currentStreakMs={currentStreakMs}
              lastRelapse={lastRelapse}
              customTargetMs={state.customTargetMs}
              language="en"
              onOpenRelapseModal={() => setIsRelapseModalOpen(true)}
            />

            {/* Quick Summary Strip */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div
                onClick={() => {
                  sounds.playTap();
                  setActiveTab('analytics');
                }}
                className="bg-slate-900 border border-slate-800 rounded-xl p-3 cursor-pointer hover:border-slate-700 transition-colors"
              >
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block">
                  AVG RELAPSE TIME
                </span>
                <span className="text-sm font-bold text-rose-400 font-mono mt-0.5 block truncate">
                  {state.relapses.length > 0
                    ? `${avgTime.formatted12h} (${avgTime.periodLabel.split(' ')[0]})`
                    : '--:--'}
                </span>
              </div>

              <div
                onClick={() => {
                  sounds.playTap();
                  setActiveTab('analytics');
                }}
                className="bg-slate-900 border border-slate-800 rounded-xl p-3 cursor-pointer hover:border-slate-700 transition-colors"
              >
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block">
                  WORST RELAPSE DAY
                </span>
                <span className="text-sm font-bold text-amber-400 font-mono mt-0.5 block truncate">
                  {state.relapses.length > 0
                    ? `${worstDay.worstDayName} (${worstDay.worstDayPercentage}%)`
                    : 'None yet'}
                </span>
              </div>
            </div>

            {/* Warrior Code of the Day (100 Quotes) */}
            <WarriorCodeCard
              currentDayNumber={Math.floor(currentStreakMs / (1000 * 60 * 60 * 24)) + 1}
            />

            {/* Clean General Tip */}
            <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-400 text-xs flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                Tip: Charge your phone outside your bedroom after 10 PM to break late-night triggers.
              </span>
            </div>

            {/* Automatic New Year Reset Guarantee Note */}
            <div className="p-2.5 bg-slate-950/40 border border-slate-800/60 rounded-xl text-[11px] text-slate-500 flex items-center gap-2">
              <CalendarCheck2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>
                No manual reset buttons (prevents cheating). All data resets automatically to zero on New Year night (Jan 1, 00:00).
              </span>
            </div>
          </div>
        );

      case 'analytics':
        return (
          <AnalyticsView
            relapses={state.relapses}
            currentStreakMs={currentStreakMs}
            language="en"
          />
        );

      case 'milestones':
        return (
          <MilestonesView
            currentStreakMs={currentStreakMs}
            language="en"
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-start antialiased selection:bg-amber-500 selection:text-slate-950 py-0 sm:py-6">
      {/* Redmi Note 13 Pro Default Frame Canvas */}
      <div className="w-full max-w-[430px] sm:rounded-[46px] sm:border-[8px] sm:border-slate-800 shadow-2xl shadow-black overflow-hidden relative min-h-screen sm:min-h-[890px] bg-slate-950 flex flex-col">
        {/* Redmi Note 13 Pro Simulated Status Bar & Punch-Hole Camera */}
        <div className="w-full flex items-center justify-between px-6 pt-3 pb-1.5 bg-slate-950 text-[11px] text-slate-400 font-mono select-none">
          <span>9:41</span>
          {/* Centered Camera Punch-Hole */}
          <div className="w-3.5 h-3.5 rounded-full bg-slate-900 border border-slate-700/80 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-slate-950" />
          </div>
          <span className="tabular-nums">5G · 100%</span>
        </div>

        {/* Top Header */}
        <Header
          language="en"
          onOpenEmergency={() => setIsEmergencyModalOpen(true)}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-4 pb-24 space-y-4 overflow-y-auto">
          {renderTabContent()}

          {/* Backup Download only - all reset / cheat buttons removed! */}
          <div className="pt-4 border-t border-slate-900 flex items-center justify-between text-xs text-slate-500">
            <span className="text-[11px] text-slate-500">Year {currentYear} Journey</span>
            <button
              onClick={handleExportData}
              className="hover:text-slate-300 flex items-center gap-1 transition-colors text-[11px]"
              title="Download backup file"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Backup</span>
            </button>
          </div>
        </main>

        {/* Bottom Navigation */}
        <BottomNav
          activeTab={activeTab}
          onChangeTab={setActiveTab}
          onOpenUrgeKiller={() => setIsEmergencyModalOpen(true)}
          language="en"
        />
      </div>

      {/* Relapse Logging Modal (The only way to reset current streak) */}
      <RelapseModal
        isOpen={isRelapseModalOpen}
        onClose={() => setIsRelapseModalOpen(false)}
        currentStreakStartTime={state.currentStreakStartTime}
        language="en"
        onConfirmRelapse={handleConfirmRelapse}
      />

      {/* Emergency Urge Killer Modal */}
      <EmergencyUrgeModal
        isOpen={isEmergencyModalOpen}
        onClose={() => setIsEmergencyModalOpen(false)}
        language="en"
      />
    </div>
  );
}
