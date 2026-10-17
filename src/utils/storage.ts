import { MDFState } from '../types.ts';
import { RelapseRecord } from './streakCalculations.ts';

const STORAGE_KEY = 'mdf_tracker_state_v2';

// Seed initial realistic data for Redmi Note 13 Pro user showcase
export function getDefaultState(): MDFState {
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;
  const hourMs = 60 * 60 * 1000;
  const minMs = 60 * 1000;

  // Realistic past relapses:
  // Concentrated late at night around 11:30 PM - 12:45 AM, heavily on Sundays
  // Find previous Sundays
  const sunday1 = new Date(now - 2 * dayMs);
  while (sunday1.getDay() !== 0) {
    sunday1.setDate(sunday1.getDate() - 1);
  }
  sunday1.setHours(23, 50, 0, 0); // Last Sunday 11:50 PM

  const sunday2 = new Date(sunday1.getTime() - 7 * dayMs);
  sunday2.setHours(23, 30, 0, 0); // Previous Sunday 11:30 PM

  const sunday3 = new Date(sunday1.getTime() - 14 * dayMs);
  sunday3.setHours(0, 15, 0, 0); // Two Sundays ago 12:15 AM

  const friday = new Date(sunday1.getTime() - 9 * dayMs);
  friday.setHours(23, 40, 0, 0); // Friday night 11:40 PM

  const saturday = new Date(sunday1.getTime() - 8 * dayMs);
  saturday.setHours(1, 10, 0, 0); // Saturday late night 1:10 AM

  // Last control time was 3 days 18 hours (90 hours)
  const lastControlDuration = 3 * dayMs + 18 * hourMs + 30 * minMs;

  const sampleRelapses: RelapseRecord[] = [
    {
      id: 'relapse-5',
      timestamp: sunday1.getTime(),
      controlDurationMs: lastControlDuration,
      trigger: 'Late Night Phone Scrolling',
      note: 'Mobile use kr raha tha bed me akele, urge resist nahi hui.',
      moodRating: 2,
    },
    {
      id: 'relapse-4',
      timestamp: saturday.getTime(),
      controlDurationMs: 4 * dayMs + 2 * hourMs,
      trigger: 'Social Media / Reels / Triggers',
      note: 'Instagram explore feed pe trigger hua.',
      moodRating: 2,
    },
    {
      id: 'relapse-3',
      timestamp: sunday2.getTime(),
      controlDurationMs: 3 * dayMs + 6 * hourMs,
      trigger: 'Late Night Phone Scrolling',
      note: 'Raat ko neend nahi aa rahi thi Sunday night ko.',
      moodRating: 3,
    },
    {
      id: 'relapse-2',
      timestamp: friday.getTime(),
      controlDurationMs: 4 * dayMs + 12 * hourMs,
      trigger: 'Boredom & Free Time',
      note: 'Weekend pe koi kaam nahi tha, mind bhatak gaya.',
      moodRating: 2,
    },
    {
      id: 'relapse-1',
      timestamp: sunday3.getTime(),
      controlDurationMs: 2 * dayMs + 8 * hourMs,
      trigger: 'Stress & Frustration',
      note: 'Padhai/work tension me mistake hui.',
      moodRating: 1,
    },
  ];

  // Current streak started immediately after the last relapse (Sunday night)
  const currentStreakStartTime = sunday1.getTime();

  return {
    currentStreakStartTime,
    lastRelapseControlMs: lastControlDuration,
    customTargetMs: null,
    relapses: sampleRelapses,
    notes: [
      "Remember: The urge will pass in 15 minutes if you do pushups or wash face.",
      "Redmi Note 13 Pro lock screen: Keep phone outside bedroom at night!",
    ],
    settings: {
      language: 'en',
      soundEnabled: true,
      hapticsEnabled: true,
      viewMode: 'mobile-frame',
    },
    lastActiveYear: new Date().getFullYear(),
  };
}

export function loadState(): MDFState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const defaultState = getDefaultState();
      saveState(defaultState);
      return defaultState;
    }
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || !parsed.currentStreakStartTime || !Array.isArray(parsed.relapses)) {
      const defaultState = getDefaultState();
      saveState(defaultState);
      return defaultState;
    }
    return {
      ...getDefaultState(),
      ...parsed,
      settings: {
        ...getDefaultState().settings,
        ...(parsed.settings || {}),
      },
    };
  } catch (err) {
    console.error('Failed to load state from localStorage', err);
    return getDefaultState();
  }
}

export function saveState(state: MDFState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error('Failed to save state to localStorage', err);
  }
}

export function clearAllData(): MDFState {
  const freshState: MDFState = {
    currentStreakStartTime: Date.now(),
    lastRelapseControlMs: null,
    customTargetMs: null,
    relapses: [],
    notes: [],
    settings: {
      language: 'en',
      soundEnabled: true,
      hapticsEnabled: true,
      viewMode: 'mobile-frame',
    },
    lastActiveYear: new Date().getFullYear(),
  };
  saveState(freshState);
  return freshState;
}
