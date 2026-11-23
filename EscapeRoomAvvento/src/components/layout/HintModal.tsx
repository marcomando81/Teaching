import { AnimatePresence, motion } from 'motion/react';
import { Lightbulb, X } from 'lucide-react';
import { useGameStore } from '../../store/useGameStore';
import { SafeImage } from '../ui/SafeImage';
import { playClick, playHint } from '../../audio/soundEngine';

export interface HintModalProps {
  isOpen: boolean;
  onClose: () => void;
  stationTitle: string;
  hints: [string, string, string];
}

export function HintModal({ isOpen, onClose, stationTitle, hints }: HintModalProps) {
  const hintsRevealedCount = useGameStore((s) => s.hintsRevealedCount);
  const revealNextHint = useGameStore((s) => s.revealNextHint);

  const visibleCount = Math.max(1, hintsRevealedCount);
  const canRevealMore = visibleCount < 3;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-slate-950/85 flex items-center justify-center p-4 md:p-8"
          onClick={() => {
            playClick();
            onClose();
          }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.92, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 24 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-4xl max-h-[90vh] rounded-3xl bg-slate-900 border-4 border-amber-400 shadow-2xl p-6 md:p-8 flex flex-col gap-5"
          >
            {/* Intestazione con Archimede thinking */}
            <div className="flex items-center gap-5">
              <div className="w-24 h-24 md:w-28 md:h-28 shrink-0 rounded-full border-4 border-amber-400 bg-slate-950 overflow-hidden shadow-lg">
                <SafeImage
                  src="/assets/portraits/archimede_thinking.webp"
                  alt="Archimede pensieroso"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 text-amber-300 font-bold text-xl">
                  <Lightbulb className="w-6 h-6" />
                  <span>Consigli di Archimede</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-extrabold text-white truncate">
                  {stationTitle}
                </h2>
              </div>
            </div>

            {/* Lista indizi rivelati */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
              {hints.slice(0, visibleCount).map((hintText, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl bg-slate-950/90 border-2 border-amber-400/70 p-4 md:p-5 flex items-start gap-4"
                >
                  <span className="w-11 h-11 shrink-0 rounded-full bg-amber-400 text-slate-950 font-black text-2xl flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <p className="text-xl md:text-2xl font-semibold text-amber-50 leading-snug">
                    {hintText}
                  </p>
                </div>
              ))}
            </div>

            {/* Pulsanti in fascia bassa */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t-2 border-amber-400/40">
              {canRevealMore ? (
                <button
                  type="button"
                  onClick={() => {
                    playHint();
                    if (hintsRevealedCount === 0) {
                      revealNextHint();
                    }
                    revealNextHint();
                  }}
                  className="min-h-16 px-8 rounded-2xl bg-sky-500 text-slate-950 font-black text-xl md:text-2xl flex items-center gap-3 shadow-lg active:scale-95 transition-transform cursor-pointer"
                >
                  <Lightbulb className="w-7 h-7" />
                  Mostra Indizio {visibleCount + 1} di 3
                </button>
              ) : (
                <span className="text-xl font-bold text-amber-200">
                  Tutti e 3 gli indizi sono visibili!
                </span>
              )}

              <button
                type="button"
                onClick={() => {
                  playClick();
                  onClose();
                }}
                className="min-h-16 px-8 rounded-2xl bg-amber-400 text-slate-950 font-black text-xl md:text-2xl flex items-center gap-3 shadow-lg active:scale-95 transition-transform cursor-pointer ml-auto"
              >
                <X className="w-7 h-7" />
                Torna all&apos;Enigma
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
