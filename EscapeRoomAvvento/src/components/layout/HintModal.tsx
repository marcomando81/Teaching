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

const HINT_BADGE_COLORS = [
  'bg-[#FFD859] text-[#3A2314]',
  'bg-[#74D4FF] text-[#0A2E47]',
  'bg-[#4FE08A] text-[#0D351C]',
];

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
          className="fixed inset-0 z-50 bg-[#0F1B35]/75 backdrop-blur-[2px] flex items-center justify-center p-4 md:p-8"
          onClick={() => {
            playClick();
            onClose();
          }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 14 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 280, damping: 24 }}
            onClick={(e) => e.stopPropagation()}
            className="storybook-panel w-full max-w-4xl max-h-[90vh] rounded-[30px] p-6 md:p-8 flex flex-col gap-5"
          >
            {/* Intestazione Taccuino di Archimede */}
            <div className="flex items-center gap-5 border-b-2 border-[#D4B27D] pb-4">
              <div className="w-24 h-24 md:w-28 md:h-28 shrink-0 rounded-full border-4 border-[#3A2314] ring-4 ring-[#F5B82E] bg-[#1D2B4A] overflow-hidden shadow-[0_5px_0_rgba(58,35,20,0.3)]">
                <SafeImage
                  src="/assets/portraits/archimede_thinking.webp"
                  alt="Archimede pensieroso"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#27A6E8] text-white border-2 border-[#3A2314] font-display font-bold text-base mb-1.5 shadow-[0_2px_0_#3A2314]">
                  <Lightbulb className="w-5 h-5" />
                  <span>Il Taccuino di Archimede</span>
                </div>
                <h2 className="font-display text-2xl md:text-3xl font-bold text-[#2B190E] truncate">
                  {stationTitle}
                </h2>
              </div>
            </div>

            {/* Lista indizi rivelati */}
            <div className="flex-1 overflow-y-auto space-y-3.5 pr-1">
              {hints.slice(0, visibleCount).map((hintText, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="storybook-subcard rounded-2xl p-4 md:p-5 flex items-start gap-4"
                >
                  <span
                    className={`w-11 h-11 shrink-0 rounded-full border-[3px] border-[#3A2314] font-display font-bold text-2xl flex items-center justify-center shadow-[0_3px_0_#3A2314] ${
                      HINT_BADGE_COLORS[idx % HINT_BADGE_COLORS.length]
                    }`}
                  >
                    {idx + 1}
                  </span>
                  <p className="text-xl md:text-2xl font-extrabold text-[#2B190E] leading-snug pt-0.5">
                    {hintText}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Pulsanti in fascia bassa */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t-2 border-[#D4B27D]">
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
                  className="btn-3d btn-3d-sky min-h-16 px-8 rounded-2xl font-bold text-xl md:text-2xl flex items-center gap-3 cursor-pointer"
                >
                  <Lightbulb className="w-7 h-7" />
                  Mostra Indizio {visibleCount + 1} di 3
                </button>
              ) : (
                <span className="px-4 py-2 rounded-xl bg-[#DCFCE7] border-2 border-[#22A85A] text-[#14532D] text-lg md:text-xl font-extrabold">
                  Tutti e 3 gli indizi sono visibili!
                </span>
              )}

              <button
                type="button"
                onClick={() => {
                  playClick();
                  onClose();
                }}
                className="btn-3d btn-3d-gold min-h-16 px-8 rounded-2xl font-bold text-xl md:text-2xl flex items-center gap-3 cursor-pointer ml-auto"
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
