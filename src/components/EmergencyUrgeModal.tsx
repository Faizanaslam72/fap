import React, { useState, useEffect } from 'react';
import { ShieldAlert, HeartPulse, RefreshCw, X, Dumbbell, Droplets, Footprints } from 'lucide-react';
import { Language } from '../types.ts';
import { WARRIOR_CODE_QUOTES, getRandomWarriorQuote } from '../utils/warriorQuotes.ts';
import { sounds, triggerHaptic } from '../utils/audio.ts';

interface EmergencyUrgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  language?: Language;
}

export const EmergencyUrgeModal: React.FC<EmergencyUrgeModalProps> = ({
  isOpen,
  onClose,
  language = 'en',
}) => {
  const [quoteIndex, setQuoteIndex] = useState(() => Math.floor(Math.random() * WARRIOR_CODE_QUOTES.length));
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [breathCounter, setBreathCounter] = useState(4);
  const [pushupCount, setPushupCount] = useState(0);

  // Breathing Box timer: 4s Inhale, 4s Hold, 4s Exhale
  useEffect(() => {
    if (!isOpen) return;

    const timer = setInterval(() => {
      setBreathCounter((prev) => {
        if (prev <= 1) {
          setBreathPhase((currentPhase) => {
            if (currentPhase === 'inhale') {
              sounds.playUrgeBreathingChime();
              return 'hold';
            }
            if (currentPhase === 'hold') {
              return 'exhale';
            }
            sounds.playUrgeBreathingChime();
            return 'inhale';
          });
          return 4;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  const currentQuote = WARRIOR_CODE_QUOTES[quoteIndex] || WARRIOR_CODE_QUOTES[0];

  const nextQuote = () => {
    sounds.playTap();
    triggerHaptic();
    setQuoteIndex((prev) => (prev + 1) % WARRIOR_CODE_QUOTES.length);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md bg-slate-900 border border-rose-500/40 rounded-3xl p-6 shadow-2xl shadow-rose-950/40 text-slate-100 max-h-[90vh] overflow-y-auto">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center animate-pulse">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-display">
                {language === 'ur' ? 'URGE KILLER (Panic Button)' : 'EMERGENCY URGE KILLER'}
              </h3>
              <p className="text-[11px] text-rose-300">
                {language === 'ur' ? 'Urge sirf 10-15 minute rehti he. Sabr karein!' : 'The urge will pass in 10-15 minutes.'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1. Tactical Breathing Circle */}
        <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800 flex flex-col items-center justify-center text-center my-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 font-mono mb-1">
            {language === 'ur' ? 'Dopamine Shock Breathing' : 'Box Breathing Reset'}
          </span>

          {/* Animated Circle */}
          <div className="relative w-28 h-28 flex items-center justify-center my-1.5">
            <div
              className={`absolute inset-0 rounded-full border-4 transition-all duration-1000 ${
                breathPhase === 'inhale'
                  ? 'scale-110 border-emerald-400 bg-emerald-500/10'
                  : breathPhase === 'hold'
                  ? 'scale-110 border-amber-400 bg-amber-500/10'
                  : 'scale-90 border-blue-400 bg-blue-500/10'
              }`}
            />
            <div className="text-center z-10">
              <div className="text-2xl font-extrabold font-mono text-white tabular-nums">
                {breathCounter}
              </div>
              <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider mt-0.5">
                {breathPhase === 'inhale' && (language === 'ur' ? 'Saans Lein' : 'Inhale')}
                {breathPhase === 'hold' && (language === 'ur' ? 'Rokein' : 'Hold')}
                {breathPhase === 'exhale' && (language === 'ur' ? 'Chorrein' : 'Exhale')}
              </div>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 mt-2">
            {language === 'ur'
              ? 'Gehri saans lene se dimagh ka flight-or-fight response shant hota he.'
              : 'Deep breathing cools the limbic urge circuit in the brain.'}
          </p>
        </div>

        {/* 2. Immediate Physical Action Checklist */}
        <div className="space-y-2 my-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300 font-display block">
            {language === 'ur' ? 'Fori Amal (Urge Khatam Karne Ke Tareeqay):' : 'Immediate Physical Actions:'}
          </span>

          {/* Pushups counter */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Dumbbell className="w-4 h-4 text-amber-400" />
              <div>
                <div className="text-xs font-semibold text-white">
                  {language === 'ur' ? '20 Pushups Lagayein' : 'Do 20 Pushups Now'}
                </div>
                <div className="text-[10px] text-slate-400">
                  {language === 'ur' ? 'Blood flow muscles ki taraf shift hoga' : 'Diverts blood flow to major muscles'}
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                sounds.playTap();
                setPushupCount((c) => Math.min(20, c + 5));
              }}
              className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg font-mono tabular-nums"
            >
              +{5} ({pushupCount}/20)
            </button>
          </div>

          {/* Cold Water */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex items-center gap-2">
            <Droplets className="w-4 h-4 text-blue-400 shrink-0" />
            <div className="text-xs text-slate-300">
              <strong className="text-white block">
                {language === 'ur' ? 'Thanda Paani Moonh Par Dalein' : 'Splash Cold Water on Face'}
              </strong>
              <span className="text-[10px] text-slate-400">
                {language === 'ur' ? 'Vagus nerve activate hoti he' : 'Triggers mammalian dive reflex'}
              </span>
            </div>
          </div>

          {/* Leave Bedroom */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex items-center gap-2">
            <Footprints className="w-4 h-4 text-emerald-400 shrink-0" />
            <div className="text-xs text-slate-300">
              <strong className="text-white block">
                {language === 'ur' ? 'Kamray Se Bahar Niklein' : 'Leave the Room Immediately'}
              </strong>
              <span className="text-[10px] text-slate-400">
                {language === 'ur' ? 'Akelapan khatam karein, lounge ya walk pe jayein' : 'Break isolation right away'}
              </span>
            </div>
          </div>
        </div>

        {/* 3. Motivational Quote Box (100 Warrior Code Quotes) */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 my-3 relative">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider font-mono">
                WARRIOR CODE #{currentQuote.id}/100
              </span>
              {currentQuote.category && (
                <span className="text-[9px] bg-slate-900 border border-slate-700 text-slate-300 px-1.5 py-0.5 rounded">
                  {currentQuote.category}
                </span>
              )}
            </div>
            <button
              onClick={nextQuote}
              className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
              title="Next Warrior Code (1 of 100)"
              aria-label="Next Warrior Code"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-xs text-slate-200 italic leading-relaxed">
            "{currentQuote.text}"
          </p>
          <span className="text-[10px] text-slate-400 block mt-1.5 text-right font-medium">
            — {currentQuote.author}
          </span>
        </div>

        {/* Close / I Resisted Button */}
        <button
          onClick={() => {
            sounds.playTargetBeat();
            triggerHaptic();
            onClose();
          }}
          className="w-full min-h-[46px] rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/30 transition-all active:scale-[0.98] mt-2"
        >
          <HeartPulse className="w-4 h-4" />
          <span>{language === 'ur' ? 'Alhamdulillah! Urge Par Qabu Pa Liya' : 'I Conquered the Urge!'}</span>
        </button>
      </div>
    </div>
  );
};
