import React, { useState } from 'react';
import { RotateCcw, AlertTriangle, Shield, Check, Heart, X } from 'lucide-react';
import { Language, RELAPSE_TRIGGERS } from '../types.ts';
import { formatDurationCompact, breakdownDuration } from '../utils/streakCalculations.ts';
import { sounds, triggerHaptic } from '../utils/audio.ts';

interface RelapseModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentStreakStartTime: number;
  language: Language;
  onConfirmRelapse: (data: {
    timestamp: number;
    controlDurationMs: number;
    trigger: string;
    note: string;
    moodRating: number;
  }) => void;
}

export const RelapseModal: React.FC<RelapseModalProps> = ({
  isOpen,
  onClose,
  currentStreakStartTime,
  language,
  onConfirmRelapse,
}) => {
  const [selectedTrigger, setSelectedTrigger] = useState(RELAPSE_TRIGGERS[0].en);
  const [note, setNote] = useState('');
  const [moodRating, setMoodRating] = useState(2);
  const [step, setStep] = useState<'reflect' | 'log'>('reflect');

  // Calculate current control time that will become the next target
  const now = Date.now();
  const currentStreakMs = Math.max(0, now - currentStreakStartTime);
  const formattedControlDuration = formatDurationCompact(currentStreakMs, true);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sounds.playTap();
    triggerHaptic();

    onConfirmRelapse({
      timestamp: Date.now(),
      controlDurationMs: currentStreakMs,
      trigger: selectedTrigger,
      note,
      moodRating,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl shadow-rose-950/20 text-slate-100 max-h-[90vh] overflow-y-auto">
        {/* Header with Close */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center">
              <RotateCcw className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-white font-display">
              {language === 'ur' ? 'Relapse Reset & Target Update' : 'Log Relapse & Set Target'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {step === 'reflect' ? (
          /* Step 1: Mindset and Urge reflection */
          <div className="space-y-4">
            <div className="bg-rose-950/30 border border-rose-500/30 rounded-2xl p-4 text-center">
              <AlertTriangle className="w-8 h-8 text-rose-400 mx-auto mb-2" />
              <h4 className="text-sm font-bold text-white">
                {language === 'ur' ? 'Himmat mat haarna! Ye safar ka hissa he.' : 'Stay Strong! This is part of the journey.'}
              </h4>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                {language === 'ur'
                  ? `Apne is dafa ${formattedControlDuration} control kiya. Ye control time ab apka naya target ban jayega!`
                  : `You controlled for ${formattedControlDuration}. This duration will automatically become your NEXT TARGET to beat!`}
              </p>
            </div>

            {/* Target Preview Box */}
            <div className="bg-slate-950 rounded-2xl p-4 border border-amber-500/30 text-center">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-400 block mb-1">
                {language === 'ur' ? 'Aap Ka Naya Target:' : 'Your New Target to Beat:'}
              </span>
              <div className="text-2xl font-bold font-mono text-white text-amber-300">
                {formattedControlDuration}
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">
                {language === 'ur'
                  ? 'Agli bar ap is se zyada sabr kareinge.'
                  : 'Next time you will push past this mark.'}
              </span>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <button
                type="button"
                onClick={() => setStep('log')}
                className="w-full min-h-[46px] rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-rose-900/30 transition-all active:scale-[0.98]"
              >
                <span>{language === 'ur' ? 'Haan, Relapse Log Karein' : 'Continue to Log Relapse'}</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-full min-h-[44px] rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
              >
                {language === 'ur' ? 'Nahi, Ghalati Se Click Hua (Keep Streak)' : 'Cancel (Keep My Current Streak)'}
              </button>
            </div>
          </div>
        ) : (
          /* Step 2: Form submission */
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Trigger Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                {language === 'ur' ? 'Relapse ki asal waja kya thi? (Trigger)' : 'What was the primary trigger?'}
              </label>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {RELAPSE_TRIGGERS.map((trig) => {
                  const isSelected = selectedTrigger === trig.en;
                  return (
                    <button
                      key={trig.id}
                      type="button"
                      onClick={() => {
                        sounds.playTap();
                        setSelectedTrigger(trig.en);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between border transition-all ${
                        isSelected
                          ? 'bg-amber-500/10 border-amber-500 text-amber-300 font-semibold'
                          : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <span>{language === 'ur' ? trig.ur : trig.en}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-amber-400" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Reflection Note */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {language === 'ur'
                  ? 'Aainda is se bachne ke liye koi sabak? (Optional note)'
                  : 'Any lessons learned for next time? (Optional note)'}
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder={
                  language === 'ur'
                    ? 'Maslan: Agli dafa raat ko 11 bajay phone doosre kamray me rakhunga...'
                    : 'e.g. Next time I will put phone in another room before 11 PM...'
                }
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-400 min-h-[70px]"
                maxLength={250}
              />
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setStep('reflect')}
                className="w-1/3 min-h-[44px] rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
              >
                {language === 'ur' ? 'Peechay' : 'Back'}
              </button>
              <button
                type="submit"
                className="w-2/3 min-h-[44px] rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5"
              >
                <span>{language === 'ur' ? 'Save & Start New Streak' : 'Confirm & Set New Target'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
