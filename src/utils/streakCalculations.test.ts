import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateNextTarget,
  calculateAverageControlTime,
  calculateAverageRelapseTimeOfDay,
  calculateWorstRelapseDay,
  calculatePeakRelapseDate,
  formatDurationCompact,
  getRankForStreak,
  shouldResetForNewYear,
  performNewYearReset,
} from './streakCalculations.ts';
import type { RelapseRecord } from './streakCalculations.ts';

test('calculateNextTarget sets last control time as the next target', () => {
  const fallback = 3 * 24 * 60 * 60 * 1000;
  // When no relapse exists yet
  assert.equal(calculateNextTarget(null, fallback), fallback);

  // When user relapsed after controlling for 4 days 6 hours (102 hours)
  const controlTimeMs = 102 * 60 * 60 * 1000;
  const lastRelapse: RelapseRecord = {
    id: 'relapse-1',
    timestamp: Date.now(),
    controlDurationMs: controlTimeMs,
    trigger: 'Late Night Phone Scrolling',
  };

  const nextTarget = calculateNextTarget(lastRelapse);
  assert.equal(nextTarget, controlTimeMs);
});

test('calculateAverageControlTime computes accurate mean streak duration', () => {
  const dayMs = 24 * 60 * 60 * 1000;
  const relapses: RelapseRecord[] = [
    { id: '1', timestamp: 1000, controlDurationMs: 2 * dayMs, trigger: 'Boredom' },
    { id: '2', timestamp: 2000, controlDurationMs: 4 * dayMs, trigger: 'Stress' },
    { id: '3', timestamp: 3000, controlDurationMs: 6 * dayMs, trigger: 'Phone scrolling' },
  ];

  // (2 + 4 + 6) / 3 = 4 days
  const avg = calculateAverageControlTime(relapses);
  assert.equal(avg, 4 * dayMs);

  // Including current ongoing streak of 8 days: (2 + 4 + 6 + 8) / 4 = 5 days
  const avgWithCurrent = calculateAverageControlTime(relapses, 8 * dayMs);
  assert.equal(avgWithCurrent, 5 * dayMs);
});

test('calculateAverageRelapseTimeOfDay correctly averages times across midnight boundary', () => {
  // E.g., one relapse at 11:30 PM (23:30) and one at 12:30 AM (00:30)
  // Linear average would incorrectly yield (23:30 + 00:30) / 2 = 12:00 PM noon!
  // Circular average must correctly yield 12:00 AM midnight (0:00).
  const baseDate = new Date(2026, 9, 15); // Oct 15 2026

  const t1 = new Date(baseDate);
  t1.setHours(23, 30, 0, 0); // 11:30 PM

  const t2 = new Date(baseDate);
  t2.setHours(0, 30, 0, 0); // 12:30 AM

  const relapses: RelapseRecord[] = [
    { id: '1', timestamp: t1.getTime(), controlDurationMs: 10000, trigger: 'Late night' },
    { id: '2', timestamp: t2.getTime(), controlDurationMs: 10000, trigger: 'Late night' },
  ];

  const result = calculateAverageRelapseTimeOfDay(relapses);
  assert.equal(result.averageHour, 0);
  assert.equal(result.averageMinute, 0);
  assert.equal(result.formatted12h, '12:00 AM');
  assert.equal(result.periodLabel, 'Late Night / Night');
});

test('calculateWorstRelapseDay identifies peak relapse day of week', () => {
  // Construct 3 relapses on Sunday, 1 on Monday, 0 on others
  // Sunday is day 0
  const sunday1 = new Date('2026-10-04T22:00:00Z'); // Sunday
  const sunday2 = new Date('2026-10-11T23:00:00Z'); // Sunday
  const sunday3 = new Date('2026-10-18T01:00:00Z'); // Local Sunday depending on tz, let's set day explicitly
  const sundayDate = new Date(2026, 9, 18); // Oct 18 2026 is Sunday
  const mondayDate = new Date(2026, 9, 19); // Oct 19 2026 is Monday

  const relapses: RelapseRecord[] = [
    { id: '1', timestamp: sundayDate.getTime(), controlDurationMs: 10000, trigger: 'A' },
    { id: '2', timestamp: sundayDate.getTime() + 1000, controlDurationMs: 10000, trigger: 'B' },
    { id: '3', timestamp: sundayDate.getTime() + 2000, controlDurationMs: 10000, trigger: 'C' },
    { id: '4', timestamp: mondayDate.getTime(), controlDurationMs: 10000, trigger: 'D' },
  ];

  const worst = calculateWorstRelapseDay(relapses);
  assert.equal(worst.worstDayName, 'Sunday');
  assert.equal(worst.worstDayCount, 3);
  assert.equal(worst.worstDayPercentage, 75);
});

test('formatDurationCompact formats properly', () => {
  const oneDayTwoHours = (24 + 2) * 60 * 60 * 1000 + 15 * 60 * 1000;
  assert.equal(formatDurationCompact(oneDayTwoHours), '1d 2h 15m');
});

test('getRankForStreak assigns correct daily rank across 90 days', () => {
  const dayMs = 24 * 60 * 60 * 1000;
  assert.equal(getRankForStreak(0.5 * dayMs).day, 1);
  assert.equal(getRankForStreak(0.5 * dayMs).title, 'Ground Zero');
  assert.equal(getRankForStreak(1.2 * dayMs).day, 2);
  assert.equal(getRankForStreak(1.2 * dayMs).title, 'First Dawn');
  assert.equal(getRankForStreak(6.5 * dayMs).day, 7);
  assert.equal(getRankForStreak(6.5 * dayMs).title, 'One Week Vanguard');
  assert.equal(getRankForStreak(29.5 * dayMs).day, 30);
  assert.equal(getRankForStreak(29.5 * dayMs).title, 'The 30-Day Titan');
  assert.equal(getRankForStreak(89.5 * dayMs).day, 90);
  assert.equal(getRankForStreak(89.5 * dayMs).title, 'Ascended Sovereign');
});

test('shouldResetForNewYear triggers exactly when year increments to January 1', () => {
  // On Dec 31, 2026 23:59:59
  const dec31 = new Date(2026, 11, 31, 23, 59, 59).getTime();
  assert.equal(shouldResetForNewYear(2026, dec31), false);

  // Exactly Jan 1, 2027 00:00:00
  const jan1 = new Date(2027, 0, 1, 0, 0, 0).getTime();
  assert.equal(shouldResetForNewYear(2026, jan1), true);

  const resetState = performNewYearReset(jan1);
  assert.equal(resetState.lastActiveYear, 2027);
  assert.equal(resetState.relapses.length, 0);
  assert.equal(resetState.currentStreakStartTime, jan1);
  assert.equal(resetState.lastRelapseControlMs, null);
});

test('WARRIOR_CODE_QUOTES contains exactly 100 high-caliber warrior quotes', async () => {
  const { WARRIOR_CODE_QUOTES, getWarriorQuoteByDay } = await import('./warriorQuotes.ts');
  assert.equal(WARRIOR_CODE_QUOTES.length, 100);

  // Verify first quote matches user example
  assert.match(WARRIOR_CODE_QUOTES[0].text, /conquers himself/);

  // Verify all quotes have non-empty text and author
  for (let i = 0; i < 100; i++) {
    assert.equal(WARRIOR_CODE_QUOTES[i].id, i + 1);
    assert.ok(WARRIOR_CODE_QUOTES[i].text.length > 10);
    assert.ok(WARRIOR_CODE_QUOTES[i].author.length > 2);
  }

  // Verify day index lookup
  assert.equal(getWarriorQuoteByDay(1).id, 1);
  assert.equal(getWarriorQuoteByDay(100).id, 100);
});
