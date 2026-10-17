import { RelapseRecord } from './utils/streakCalculations.ts';

export type Language = 'ur' | 'en'; // Roman Urdu vs English

export interface AppSettings {
  language: Language;
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  viewMode: 'mobile-frame' | 'responsive';
}

export interface MDFState {
  currentStreakStartTime: number; // Unix timestamp ms
  lastRelapseControlMs: number | null; // Last control time that becomes the next target
  customTargetMs: number | null; // Optional user override
  relapses: RelapseRecord[];
  notes: string[];
  settings: AppSettings;
  lastActiveYear?: number;
}

export interface Quote {
  en: string;
  ur: string; // Roman Urdu
  author: string;
}

export const MOTIVATIONAL_QUOTES: Quote[] = [
  {
    en: "The man who conquers himself is greater than one who conquers a thousand men in battle.",
    ur: "Jo shakhs apne nafs par qabu pata he, wo us se barha he jo maidan me 1000 admiyon ko shikast de.",
    author: "Buddha",
  },
  {
    en: "Temporary pleasure is the poison that kills your future strength.",
    ur: "Chand lamhon ka sakoon tumhari aane wali taqat ko khatam kr deta he. Sabr hi jeet he.",
    author: "Marcus Aurelius",
  },
  {
    en: "Your last control time is your new battle line. Push past it!",
    ur: "Tumhara pichla control time tumhara naya target he. Is bar us record ko torna he!",
    author: "MDF Discipline",
  },
  {
    en: "Discipline equals freedom. Every urge you resist builds an iron mind.",
    ur: "Discipline hi azaadi he. Har dafa jab tum urge ko rokte ho, tumhara dimagh lohey jesa banta he.",
    author: "Jocko Willink",
  },
  {
    en: "Do not count the days, make the days count.",
    ur: "Din mat gino, balkay har din ko qeemti banao.",
    author: "Muhammad Ali",
  },
];

export const RELAPSE_TRIGGERS = [
  { id: 'phone_night', en: 'Late Night Phone Scrolling', ur: 'Raat ko late phone use krna' },
  { id: 'boredom', en: 'Boredom & Free Time', ur: 'Fariq baithna / Boriyat' },
  { id: 'stress', en: 'Stress & Frustration', ur: 'Tension / Zehni dabao' },
  { id: 'social_media', en: 'Social Media / Reels / Triggers', ur: 'Instagram / Reels / Sexy videos' },
  { id: 'loneliness', en: 'Loneliness / Bedroom alone', ur: 'Kamray me akelapan' },
  { id: 'fatigue', en: 'Tiredness & Lack of Sleep', ur: 'Thakawat or neend ki kami' },
  { id: 'peeking', en: 'Just peeking / Curiosity', ur: 'Sirf dekhne ki koshish (Peeking)' },
  { id: 'other', en: 'Other', ur: 'Koi or waja' },
];
