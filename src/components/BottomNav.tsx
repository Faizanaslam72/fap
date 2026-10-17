import React from 'react';
import { Flame, BarChart3, Award, ShieldAlert } from 'lucide-react';
import { Language } from '../types.ts';
import { sounds, triggerHaptic } from '../utils/audio.ts';

export type NavTab = 'dashboard' | 'analytics' | 'milestones';

interface BottomNavProps {
  activeTab: NavTab;
  onChangeTab: (tab: NavTab) => void;
  onOpenUrgeKiller: () => void;
  language: Language;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onChangeTab,
  onOpenUrgeKiller,
  language,
}) => {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/90 backdrop-blur-md border-t border-slate-800/80 px-2 py-1 max-w-lg mx-auto"
      aria-label="Bottom Navigation"
    >
      <div className="grid grid-cols-4 items-center h-14">
        {/* Tab 1: Dashboard / Counter */}
        <button
          onClick={() => {
            sounds.playTap();
            triggerHaptic();
            onChangeTab('dashboard');
          }}
          className={`flex flex-col items-center justify-center min-h-[44px] rounded-xl transition-colors ${
            activeTab === 'dashboard' ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
          aria-label="Dashboard Tab"
        >
          <Flame className="w-5 h-5" />
          <span className="text-[10px] tracking-tight mt-0.5 whitespace-nowrap">
            {language === 'ur' ? 'Counter' : 'Streak'}
          </span>
        </button>

        {/* Tab 2: Analytics & Stats */}
        <button
          onClick={() => {
            sounds.playTap();
            triggerHaptic();
            onChangeTab('analytics');
          }}
          className={`flex flex-col items-center justify-center min-h-[44px] rounded-xl transition-colors ${
            activeTab === 'analytics' ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
          aria-label="Analytics Tab"
        >
          <BarChart3 className="w-5 h-5" />
          <span className="text-[10px] tracking-tight mt-0.5 whitespace-nowrap">
            {language === 'ur' ? 'Analytics' : 'Insights'}
          </span>
        </button>

        {/* Tab 3: Milestones */}
        <button
          onClick={() => {
            sounds.playTap();
            triggerHaptic();
            onChangeTab('milestones');
          }}
          className={`flex flex-col items-center justify-center min-h-[44px] rounded-xl transition-colors ${
            activeTab === 'milestones' ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
          aria-label="Ranks Tab"
        >
          <Award className="w-5 h-5" />
          <span className="text-[10px] tracking-tight mt-0.5 whitespace-nowrap">
            {language === 'ur' ? 'Ranks' : 'Milestones'}
          </span>
        </button>

        {/* Tab 4: Direct Urge Killer */}
        <button
          onClick={() => {
            sounds.playUrgeBreathingChime();
            triggerHaptic();
            onOpenUrgeKiller();
          }}
          className="flex flex-col items-center justify-center min-h-[44px] rounded-xl text-rose-400 hover:text-rose-300 transition-colors"
          aria-label="Urge Killer Button"
        >
          <ShieldAlert className="w-5 h-5 animate-pulse" />
          <span className="text-[10px] tracking-tight mt-0.5 whitespace-nowrap font-bold text-rose-400">
            {language === 'ur' ? 'Madad' : 'Urge Help'}
          </span>
        </button>
      </div>
    </nav>
  );
};
