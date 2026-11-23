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

    const colors = ['#FFD859', '#E04248', '#22A85A', '#38BDF8', '#FFFFFF'];
    confetti({
      particleCount: item.isMasterGear ? 120 : 85,
      spread: 85,
      origin: { y: 0.55 },
      colors,
    });
  }, [item]);

  return (
    <div className="fixed inset-0 z-50 bg-[#0F1B35]/80 backdrop-blur-[2px] flex items-center justify-center p-6 overflow-hidden">
      {/* Fascio di luce dorata radiale rotante */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute w-[720px] h-[720px] rounded-full opacity-35 animate-rotate-rays"
        style={{
          background:
            'repeating-conic-gradient(from 0deg, #FFD859 0deg 14deg, transparent 14deg 28deg)',
        }}
      />

      <motion.div
        initial={{ scale: 0.35, opacity: 0, rotate: -3 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 230, damping: 18 }}
        className="storybook-panel relative z-10 w-full max-w-2xl rounded-[32px] p-6 md:p-8 flex flex-col items-center text-center gap-5"
      >
        <div className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-[#E04248] border-[3px] border-[#3A2314] text-white font-display font-bold text-lg md:text-xl uppercase tracking-wide shadow-[0_4px_0_#3A2314]">
          <Sparkles className="w-6 h-6 text-[#FFE169]" />
          <span>{item.isMasterGear ? 'Ingranaggio Maestro Sbloccato!' : 'Nuovo Tesoro Raccolto!'}</span>
        </div>

        <div
          className={`w-44 h-44 md:w-52 md:h-52 rounded-full border-4 border-[#3A2314] ring-4 ring-[#FFD859] bg-[#2B190E] overflow-hidden shadow-[0_8px_0_rgba(58,35,20,0.3)] flex items-center justify-center ${
            item.isMasterGear ? 'p-4' : ''
          }`}
        >
          <SafeImage
            src={item.imagePath}
            alt={item.name}
            className={`w-full h-full ${item.isMasterGear ? 'object-contain' : 'object-cover'}`}
          />
        </div>

        <div className="space-y-3 w-full">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-[#3A2314]">
            {item.name}
          </h2>
          <p className="storybook-subcard text-2xl md:text-3xl font-extrabold text-[#2B190E] rounded-2xl px-6 py-4 leading-snug">
            {item.description}
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            playClick();
            onCollect();
          }}
          className="btn-3d btn-3d-green min-h-16 md:min-h-20 px-10 rounded-2xl font-bold text-2xl flex items-center gap-3 cursor-pointer"
        >
          <Backpack className="w-7 h-7" />
          <span>{buttonLabel}</span>
        </button>
      </motion.div>
    </div>
  );
}
