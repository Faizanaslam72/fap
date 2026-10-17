export interface RelapseRecord {
  id: string;
  timestamp: number; // Unix timestamp ms when relapse occurred
  controlDurationMs: number; // How long the user controlled/held the streak before this relapse
  trigger: string;
  note?: string;
  moodRating?: number; // 1-5 scale
}

export interface DayStats {
  dayName: string; // "Sunday", "Monday", etc.
  dayIndex: number; // 0 = Sunday, 6 = Saturday
  count: number;
  percentage: number;
}

export interface TimeSlotStats {
  label: string; // "Late Night (11 PM - 4 AM)", etc.
  hoursRange: string;
  count: number;
  percentage: number;
}

/**
 * Calculates the dynamic next target duration in milliseconds.
 * Per user requirement: "jab bhi me fap relapse krunga to mera last control time mera next target ban jayega"
 */
export function calculateNextTarget(
  lastRelapse: RelapseRecord | null,
  fallbackTargetMs: number = 3 * 24 * 60 * 60 * 1000 // 3 days default
): number {
  if (!lastRelapse || lastRelapse.controlDurationMs <= 0) {
    return fallbackTargetMs;
  }
  // The last control time achieved becomes the exact new target to beat!
  return lastRelapse.controlDurationMs;
}

/**
 * Calculates the average control/streak duration across all recorded relapses.
 * Optionally includes the active ongoing streak in the average if requested.
 */
export function calculateAverageControlTime(
  relapses: RelapseRecord[],
  includeCurrentStreakMs?: number
): number {
  const durations: number[] = relapses.map((r) => r.controlDurationMs).filter((d) => d > 0);
  if (includeCurrentStreakMs && includeCurrentStreakMs > 0) {
    durations.push(includeCurrentStreakMs);
  }

  if (durations.length === 0) return 0;
  const sum = durations.reduce((acc, curr) => acc + curr, 0);
  return Math.round(sum / durations.length);
}

/**
 * Calculates the circular average time of day for relapses.
 * Using circular statistics on a 24-hour clock so that 11:30 PM (23:30) and 12:30 AM (00:30)
 * correctly average to 12:00 AM midnight rather than 12:00 noon.
 */
export function calculateAverageRelapseTimeOfDay(relapses: RelapseRecord[]): {
  averageHour: number;
  averageMinute: number;
  formatted12h: string;
  periodLabel: string;
} {
  if (relapses.length === 0) {
    return {
      averageHour: 0,
      averageMinute: 0,
      formatted12h: "--:--",
      periodLabel: "No data yet",
    };
  }

  let sinSum = 0;
  let cosSum = 0;

  for (const r of relapses) {
    const d = new Date(r.timestamp);
    const totalMinutes = d.getHours() * 60 + d.getMinutes();
    // Convert 0..1440 minutes into angle in radians 0..2*PI
    const angle = (totalMinutes / 1440) * 2 * Math.PI;
    sinSum += Math.sin(angle);
    cosSum += Math.cos(angle);
  }

  // Circular mean angle
  let meanAngle = Math.atan2(sinSum, cosSum);
  if (meanAngle < 0) {
    meanAngle += 2 * Math.PI;
  }

  const avgTotalMinutes = Math.round((meanAngle / (2 * Math.PI)) * 1440) % 1440;
  const avgHour = Math.floor(avgTotalMinutes / 60);
  const avgMinute = avgTotalMinutes % 60;

  // Format in 12-hour AM/PM
  const period = avgHour >= 12 ? "PM" : "AM";
  const displayHour = avgHour % 12 === 0 ? 12 : avgHour % 12;
  const displayMinute = avgMinute.toString().padStart(2, "0");
  const formatted12h = `${displayHour}:${displayMinute} ${period}`;

  // Period label
  let periodLabel = "Late Night";
  if (avgHour >= 5 && avgHour < 12) periodLabel = "Morning";
  else if (avgHour >= 12 && avgHour < 17) periodLabel = "Afternoon";
  else if (avgHour >= 17 && avgHour < 22) periodLabel = "Evening";
  else periodLabel = "Late Night / Night";

  return {
    averageHour: avgHour,
    averageMinute: avgMinute,
    formatted12h,
    periodLabel,
  };
}

/**
 * Finds the worst day of the week with the most relapses,
 * along with detailed frequency distribution for all days.
 */
export function calculateWorstRelapseDay(relapses: RelapseRecord[]): {
  worstDayName: string;
  worstDayCount: number;
  worstDayPercentage: number;
  breakdown: DayStats[];
} {
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const counts = [0, 0, 0, 0, 0, 0, 0];

  for (const r of relapses) {
    const d = new Date(r.timestamp);
    const dayIndex = d.getDay();
    counts[dayIndex]++;
  }

  const total = relapses.length;
  let maxCount = -1;
  let worstIndex = 0;

  for (let i = 0; i < 7; i++) {
    if (counts[i] > maxCount) {
      maxCount = counts[i];
      worstIndex = i;
    }
  }

  const breakdown: DayStats[] = dayNames.map((name, idx) => ({
    dayName: name,
    dayIndex: idx,
    count: counts[idx],
    percentage: total > 0 ? Math.round((counts[idx] / total) * 100) : 0,
  }));

  return {
    worstDayName: total > 0 ? dayNames[worstIndex] : "None yet",
    worstDayCount: total > 0 ? maxCount : 0,
    worstDayPercentage: total > 0 ? Math.round((maxCount / total) * 100) : 0,
    breakdown,
  };
}

/**
 * Finds specific calendar date with highest relapse count.
 */
export function calculatePeakRelapseDate(relapses: RelapseRecord[]): {
  dateString: string;
  count: number;
} | null {
  if (relapses.length === 0) return null;

  const dateMap: Record<string, number> = {};
  for (const r of relapses) {
    const d = new Date(r.timestamp);
    const dateKey = d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
    dateMap[dateKey] = (dateMap[dateKey] || 0) + 1;
  }

  let peakDate = "";
  let peakCount = 0;
  for (const [dateKey, count] of Object.entries(dateMap)) {
    if (count > peakCount) {
      peakCount = count;
      peakDate = dateKey;
    }
  }

  return { dateString: peakDate, count: peakCount };
}

/**
 * Formats milliseconds into human readable components
 */
export function breakdownDuration(ms: number): {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
} {
  const safeMs = Math.max(0, ms);
  const totalSeconds = Math.floor(safeMs / 1000);
  const seconds = totalSeconds % 60;
  const totalMinutes = Math.floor(totalSeconds / 60);
  const minutes = totalMinutes % 60;
  const totalHours = Math.floor(totalMinutes / 60);
  const hours = totalHours % 24;
  const days = Math.floor(totalHours / 24);

  return { days, hours, minutes, seconds };
}

/**
 * Compact string formatting for display (e.g. "3d 14h 22m")
 */
export function formatDurationCompact(ms: number, includeSeconds = false): string {
  if (ms <= 0) return "0m";
  const { days, hours, minutes, seconds } = breakdownDuration(ms);
  const parts: string[] = [];

  if (days > 0) parts.push(`${days}d`);
  if (hours > 0 || days > 0) parts.push(`${hours}h`);
  parts.push(`${minutes}m`);
  if (includeSeconds && days === 0) parts.push(`${seconds}s`);

  return parts.join(" ");
}

import { WARRIOR_RANKS_90, getRankForStreak } from './ranks90.ts';
import type { DailyRank } from './ranks90.ts';
export { WARRIOR_RANKS_90, getRankForStreak };
export type { DailyRank };

// Backward compatibility alias
export type WarriorRank = DailyRank;
export const WARRIOR_RANKS = WARRIOR_RANKS_90;

/**
 * Checks if a new year has started (e.g. at January 1 00:00:00).
 * Per user requirement:
 * "all data reset to zero automatically on the new year night exactly when januany 1 starts"
 */
export function shouldResetForNewYear(
  lastActiveYear: number | undefined,
  currentTimestamp: number = Date.now()
): boolean {
  if (!lastActiveYear) return false;
  const currentYear = new Date(currentTimestamp).getFullYear();
  return currentYear > lastActiveYear;
}

export function performNewYearReset(currentTimestamp: number = Date.now()) {
  const currentYear = new Date(currentTimestamp).getFullYear();
  return {
    currentStreakStartTime: currentTimestamp,
    lastRelapseControlMs: null,
    customTargetMs: null,
    relapses: [] as RelapseRecord[],
    lastActiveYear: currentYear,
  };
}
