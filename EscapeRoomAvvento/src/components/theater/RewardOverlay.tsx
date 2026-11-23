import { useEffect } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { Backpack, Sparkles } from 'lucide-react';
import type { InventoryItem } from '../../types/game';
import { SafeImage } from '../ui/SafeImage';
import { playClick, playSuccess, playTowerChime } from '../../audio/soundEngine';

export interface RewardOverlayProps {
  item: InventoryItem;
  buttonLabel?: string;
  onCollect: () => void;
}

export function RewardOverlay({
  item,
  buttonLabel = 'Metti nello Zaino',
  onCollect,
}: RewardOverlayProps) {
  useEffect(() => {
    if (item.isMasterGear) {
      playTowerChime(2);
    }
    playSuccess();

    const colors = ['#F59E0B', '#FDE68A', '#FFFFFF', '#38BDF8'];
    confetti({
      particleCount: item.isMasterGear ? 120 : 80,
      spread: 85,
      origin: { y: 0.55 },
      colors,
    });
  }, [item]);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 flex items-center justify-center p-6 overflow-hidden">
      {/* Fascio di luce radiale rotante in CSS */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute w-[680px] h-[680px] rounded-full opacity-25 animate-rotate-rays"
        style={{
          background:
            'repeating-conic-gradient(from 0deg, #F59E0B 0deg 15deg, transparent 15deg 30deg)',
        }}
      />

      <motion.div
        initial={{ scale: 0.2, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 220, damping: 18 }}
        className="relative z-10 w-full max-w-2xl rounded-3xl bg-slate-900/95 border-4 border-amber-400 shadow-2xl p-7 md:p-9 flex flex-col items-center text-center gap-6"
      >
        <div className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-amber-400/20 border-2 border-amber-400 text-amber-300 font-black text-xl uppercase tracking-wider">
          <Sparkles className="w-6 h-6" />
          <span>{item.isMasterGear ? 'Ingranaggio Maestro Sbloccato!' : 'Oggetto Raccolto!'}</span>
        </div>

        <div
          className={`w-48 h-48 md:w-56 md:h-56 rounded-full border-4 border-amber-400 bg-slate-950 overflow-hidden shadow-2xl flex items-center justify-center ${
            item.isMasterGear ? 'p-4' : ''
          }`}
        >
          <SafeImage
            src={item.imagePath}
            alt={item.name}
            className={`w-full h-full ${item.isMasterGear ? 'object-contain' : 'object-cover'}`}
          />
        </div>

        <div className="space-y-3">
          <h2 className="text-3xl md:text-4xl font-extrabold text-amber-300">
            {item.name}
          </h2>
          <p className="text-2xl md:text-3xl font-bold text-white bg-slate-950/90 border-2 border-amber-400/70 rounded-2xl px-6 py-4 leading-snug">
            {item.description}
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            playClick();
            onCollect();
          }}
          className="min-h-16 md:min-h-20 px-10 rounded-2xl bg-amber-400 text-slate-950 font-black text-2xl flex items-center gap-3 shadow-xl active:scale-95 transition-transform cursor-pointer"
        >
          <Backpack className="w-7 h-7" />
          <span>{buttonLabel}</span>
        </button>
      </motion.div>
    </div>
  );
}
