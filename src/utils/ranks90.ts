export interface DailyRank {
  day: number;
  title: string;
  badge: string;
  description: string;
  phase: 'Phase 1: Withdrawal & Reset' | 'Phase 2: Rewiring & Clarity' | 'Phase 3: Mastery & Dominance';
  minDays: number;
  maxDays: number;
}

// 90 distinct daily milestone ranks so the user unlocks a brand new one each day!
const RAW_90_TITLES: Array<{ title: string; badge: string; desc: string }> = [
  // Days 1-10: Immediate Shock & Ground Zero
  { title: "Ground Zero", badge: "🌱", desc: "The hardest 24 hours. Dopamine receptors start seeking baseline balance." },
  { title: "First Dawn", badge: "🌅", desc: "Day 2 conquered. Your conscious prefrontal cortex is taking back control." },
  { title: "Urge Breaker", badge: "🛡️", desc: "Cravings peak today. Every resistance strengthens neuroplasticity." },
  { title: "Mind Fortress", badge: "🧱", desc: "Sleep cycles begin to normalize without late-night stimulation." },
  { title: "The Clean Slate", badge: "🧼", desc: "Initial brain fog starts receding. Concentration begins returning." },
  { title: "Iron Seed", badge: "🌰", desc: "Physical restlessness shifts into pure usable physical energy." },
  { title: "One Week Vanguard", badge: "⚡", desc: "7 Days Clean! Natural androgen receptor sensitivity begins surging." },
  { title: "Clear Horizon", badge: "🌤️", desc: "Emotional highs and lows start balancing out as dopamine levels steady." },
  { title: "Dopamine Pioneer", badge: "🔬", desc: "Small everyday pleasures (food, music, walking) feel much more rewarding." },
  { title: "Decade Warrior", badge: "🔟", desc: "Double digits achieved! You have bypassed 90% of habitual relapsers." },

  // Days 11-20: Neural Reorganization
  { title: "Spark of Vitality", badge: "✨", desc: "Mornings become clearer; waking up without guilt or brain sluggishness." },
  { title: "Silent Guardian", badge: "🛡️", desc: "Automatic phone scrolling urges are losing their subconscious grip." },
  { title: "Unbroken Chain", badge: "🔗", desc: "Habit loop cue-routine-reward is actively breaking down in your brain." },
  { title: "Fortnight Spartan", badge: "⚔️", desc: "2 Weeks Clean! Grey matter density in prefrontal control center grows." },
  { title: "Steadfast Eye", badge: "👁️", desc: "Eye contact feels natural and comfortable. Social anxiety starts diminishing." },
  { title: "The Purifier", badge: "🌊", desc: "Your self-respect and integrity are becoming your core identity." },
  { title: "Grit Builder", badge: "🔨", desc: "Resilience built here translates directly into workouts and productivity." },
  { title: "Mental Aegis", badge: "🛡️", desc: "Impulsive reactions are replaced by calm, calculated responses." },
  { title: "Energy Reservoir", badge: "🔋", desc: "Physical stamina spikes. No mid-day crashes from dopamine spikes." },
  { title: "The Vanguard", badge: "🏹", desc: "20 Days strong! You are entering the elite bracket of discipline." },

  // Days 21-30: The 3-Week Transformation
  { title: "Habit Shatterer", badge: "💥", desc: "21 Days habit threshold! The old neurological groove is deeply fading." },
  { title: "Inner Sovereign", badge: "👑", desc: "You no longer view yourself as an addict, but as a disciplined man." },
  { title: "Voice of Reason", badge: "🗣️", desc: "Vocal resonance and posture improve with restored nervous system tone." },
  { title: "Iron Will Sentinel", badge: "🏰", desc: "Temptations may surface, but your defensive wall holds effortlessly." },
  { title: "Quarter Century", badge: "🎖️", desc: "25 Days! Deep REM sleep stages are restored, bringing vivid dreams." },
  { title: "Neuro-Architect", badge: "🧠", desc: "Synaptic pruning removes the obsessive pathways of artificial stimulation." },
  { title: "True North", badge: "🧭", desc: "Your goals, passions, and life trajectory feel significantly more defined." },
  { title: "Unshakeable", badge: "🏔️", desc: "Stress from daily life no longer triggers a desire for cheap escapism." },
  { title: "Eve of Triumph", badge: "🌙", desc: "29 Days. Poised on the precipice of a full 30-day transformation." },
  { title: "The 30-Day Titan", badge: "🏆", desc: "1 FULL MONTH CLEAN! Dopamine baseline reset benchmark officially unlocked." },

  // Days 31-40: The Forge & Deep Clarity
  { title: "Resilient Core", badge: "💎", desc: "Entering Phase 2. Brain fog is replaced by razor-sharp daily focus." },
  { title: "Calm Storm", badge: "⛈️", desc: "Flatline periods are met with patient resolve instead of panic." },
  { title: "Laser Focus", badge: "🎯", desc: "Ability to do deep work for hours without checking social media." },
  { title: "Vigor Awakening", badge: "🦁", desc: "Physical strength and athletic performance reach brand new personal bests." },
  { title: "Five-Week Sentinel", badge: "⭐", desc: "35 Days! Your dopamine receptors are dense, healthy, and responsive." },
  { title: "The Anchor", badge: "⚓", desc: "Grounded emotional stability. Mood swings are replaced by inner peace." },
  { title: "Dopamine Healer", badge: "🌿", desc: "Natural serotonin and oxytocin synthesis operate at peak health." },
  { title: "Mental Clarity", badge: "💡", desc: "Creativity surges. Problem-solving abilities are faster and sharper." },
  { title: "The Wall", badge: "🧱", desc: "Nothing can provoke an impulse when your purpose is crystal clear." },
  { title: "The Centurion", badge: "🛡️", desc: "40 Days Clean! Biblical milestone. High willpower becomes second nature." },

  // Days 41-50: The High Road
  { title: "Ascendant Mind", badge: "🧗", desc: "You take genuine pride in delayed gratification in all aspects of life." },
  { title: "Disciplined Heart", badge: "❤️", desc: "Real human connections feel genuine, empathetic, and truly fulfilling." },
  { title: "Iron Temperament", badge: "⚙️", desc: "Frustrations bounce off you; emotional mastery is fully visible." },
  { title: "The Beacon", badge: "🗼", desc: "Others notice your calm energy, focus, and quiet presence in the room." },
  { title: "Forty-Five Champion", badge: "🎖️", desc: "HALF-WAY TO 90 DAYS! Half the journey conquered with iron discipline." },
  { title: "Neuro Reborn", badge: "🔬", desc: "Frontal lobe executive function outclasses your primitive impulsivity." },
  { title: "The Alchemist", badge: "⚗️", desc: "Transmuting sexual energy into career, fitness, and artistic milestones." },
  { title: "The Steadfast", badge: "🌲", desc: "Rooted like an ancient oak tree against any sudden wind of temptation." },
  { title: "Seven-Week Spartan", badge: "⚔️", desc: "49 Days! 7 full weeks of continuous clean biological victory." },
  { title: "Half-Century Legend", badge: "🥇", desc: "50 DAYS! An extraordinary achievement in the modern digital age." },

  // Days 51-60: The Sovereign Mind
  { title: "Unyielding Spirit", badge: "🔥", desc: "You have built an internal standard of excellence that cannot be compromised." },
  { title: "Clean Conduit", badge: "⚡", desc: "Life force flows uninterrupted throughout your mental and bodily faculties." },
  { title: "The Tactician", badge: "♟️", desc: "You anticipate danger zones and proactively prevent vulnerable situations." },
  { title: "The Monolith", badge: "🗿", desc: "Standing tall. Urges have shriveled into rare, harmless whispers." },
  { title: "True Willpower", badge: "🔮", desc: "Your word to yourself is bond. When you say you will do it, you do." },
  { title: "Eight-Week Victor", badge: "🏅", desc: "56 Days! 8 complete weeks. Neuroscience confirms irreversible rewiring." },
  { title: "Silent Mountain", badge: "⛰️", desc: "Tranquility in your thoughts. Inner chatter has been replaced by focus." },
  { title: "The Catalyst", badge: "💫", desc: "Your discipline inspires your friends, family, and peers around you." },
  { title: "Eve of 60", badge: "🌌", desc: "Poised to cross the massive two-month threshold of self-control." },
  { title: "Two-Month Sovereign", badge: "👑", desc: "60 DAYS CLEAN! Two full months of clean, unbroken willpower mastery." },

  // Days 61-70: Transcendence & Freedom
  { title: "Transmuted Power", badge: "⚡", desc: "Entering Phase 3: Transcendence. Total freedom from addictive cycles." },
  { title: "Unbound Soul", badge: "🦅", desc: "You no longer fight urges; urges have lost all attraction or power." },
  { title: "Diamond Focus", badge: "💎", desc: "Unbreakable mental clarity. Procrastination is virtually eradicated." },
  { title: "The Stoic", badge: "🏛️", desc: "Emotions are observed without being enslaved by them." },
  { title: "Nine-Week Master", badge: "🎖️", desc: "65 Days! You have reclaimed thousands of wasted hours for your destiny." },
  { title: "Pure Presence", badge: "🧘", desc: "Fully immersed in the present moment without digital escapism." },
  { title: "The Commander", badge: "🎖️", desc: "Master of your own biology, thoughts, feelings, and daily actions." },
  { title: "The Iron Monk", badge: "🥋", desc: "Discipline has evolved from an effort into your effortless nature." },
  { title: "The Apex Hunter", badge: "🏹", desc: "Channeling drive into ambition, business, strength, and life purpose." },
  { title: "Seventy Suns", badge: "☀️", desc: "70 DAYS! 10 full continuous weeks of unbroken clean victory." },

  // Days 71-80: The Elite Tier
  { title: "The Ascended", badge: "🚀", desc: "Reaching heights of focus and calm self-assurance you once thought impossible." },
  { title: "The Unshakable Pillar", badge: "🏛️", desc: "A pillar of strength for yourself and everyone who depends on you." },
  { title: "Harmonic Baseline", badge: "🎶", desc: "Your dopamine reward circuitry is operating in pure natural harmony." },
  { title: "The Alabaster Shield", badge: "🛡️", desc: "Zero vulnerability to artificial dopamine triggers." },
  { title: "Seventy-Five Titan", badge: "🌟", desc: "75 DAYS! Less than 1% of men ever reach this degree of dedication." },
  { title: "The Phoenix", badge: "🦅", desc: "Completely reborn from the ashes of old habits into a new man." },
  { title: "Zenith of Will", badge: "⛰️", desc: "Willpower is no longer a battery that drains; it is an infinite spring." },
  { title: "The Luminary", badge: "💡", desc: "Deep self-respect shines naturally through your words and character." },
  { title: "The Grand Sentinel", badge: "🏰", desc: "Your foundation is so fortified that relapse is an alien thought." },
  { title: "The Octagon Legend", badge: "🛡️", desc: "80 DAYS! 10 days away from the legendary 90-day biological reboot." },

  // Days 81-90: The Final Ascent
  { title: "Count of Nine", badge: "🔢", desc: "The countdown to total mastery is officially underway." },
  { title: "The Untouchable", badge: "🛡️", desc: "Immune to old triggers. You have outgrown your previous self." },
  { title: "The Visionary", badge: "🔮", desc: "Your mind operates on a long-term multi-year vision, not cheap dopamine." },
  { title: "Twelve-Week Titan", badge: "🏆", desc: "84 Days! 12 unbroken weeks. Complete neurogenesis of habit pathways." },
  { title: "Final Five Vanguard", badge: "⭐", desc: "85 Days! 5 days remaining to the ultimate promised milestone." },
  { title: "The Resolute God of Will", badge: "⚡", desc: "Your dedication is absolute. Every promise made to yourself is kept." },
  { title: "Golden Horizon", badge: "🌅", desc: "87 Days! The finish line of the reboot is directly in sight." },
  { title: "The Iron Conqueror", badge: "⚔️", desc: "88 Days! You conquered the battle inside your own skull." },
  { title: "Eve of Ascension", badge: "🌌", desc: "89 Days! Tomorrow you step into the hall of 90-day legends." },
  { title: "Ascended Sovereign", badge: "👑", desc: "90 DAYS COMPLETE! Total biological & psychological reboot achieved. You are FREE." },
];

export const WARRIOR_RANKS_90: DailyRank[] = RAW_90_TITLES.map((item, index) => {
  const day = index + 1;
  let phase: DailyRank['phase'] = 'Phase 1: Withdrawal & Reset';
  if (day > 60) {
    phase = 'Phase 3: Mastery & Dominance';
  } else if (day > 30) {
    phase = 'Phase 2: Rewiring & Clarity';
  }

  return {
    day,
    title: item.title,
    badge: item.badge,
    description: item.desc,
    phase,
    minDays: day - 1,
    maxDays: day,
  };
});

/**
 * Returns the exact daily rank unlocked for a given streak in ms.
 * On Day 1 (0 to 24h), user is on Day 1: Ground Zero.
 * On Day 5, user is on Day 5: The Clean Slate.
 * Capped at Day 90: Ascended Sovereign (or 90+).
 */
export function getRankForStreak(streakMs: number): DailyRank {
  const safeMs = Math.max(0, streakMs);
  const totalDays = safeMs / (1000 * 60 * 60 * 24);
  const currentDayNumber = Math.min(90, Math.floor(totalDays) + 1);
  return WARRIOR_RANKS_90[currentDayNumber - 1];
}
