import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import type { OwlExpression, StoryBeat } from '../../types/game';
import { SafeImage } from '../ui/SafeImage';
import { AmbientParticles } from './AmbientParticles';
import { playClick } from '../../audio/soundEngine';

export interface StoryTheaterProps {
  backgroundPath: string;
  backgroundAlt: string;
  beats: StoryBeat[];
  particleVariant?: 'snow' | 'gold_dust';
  finishButtonLabel?: string;
  onComplete: () => void;
}

const PORTRAIT_BY_EXPRESSION: Record<OwlExpression, string> = {
  mysterious: '/assets/portraits/archimede_mysterious.webp',
  thinking: '/assets/portraits/archimede_thinking.webp',
  celebrating: '/assets/portraits/archimede_celebrating.webp',
};

export function StoryTheater({
  backgroundPath,
  backgroundAlt,
  beats,
  particleVariant = 'gold_dust',
  finishButtonLabel = 'Inizia Enigma',
  onComplete,
}: StoryTheaterProps) {
  const [beatIndex, setBeatIndex] = useState(0);

  useEffect(() => {
    setBeatIndex(0);
  }, [beats]);

  const currentBeat = beats[beatIndex];
  const isLastBeat = beatIndex >= beats.length - 1;

  if (!currentBeat) {
    return null;
  }

  const handleNext = () => {
    playClick();
    if (isLastBeat) {
      onComplete();
    } else {
      setBeatIndex((prev) => prev + 1);
    }
  };

  return (
    <div className="relative w-full h-full overflow-hidden flex flex-col justify-end">
      {/* Sfondo con Ken Burns CSS */}
      <div className="absolute inset-0 overflow-hidden">
        <SafeImage
          src={backgroundPath}
          alt={backgroundAlt}
          className="w-full h-full object-cover animate-ken-burns"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/40 to-slate-950/30" />
      </div>

      {/* Particelle ambientali leggere */}
      <AmbientParticles variant={particleVariant} />

      {/* Area dialogo nella metà inferiore dello schermo */}
      <div className="relative z-20 w-full max-w-5xl mx-auto px-4 md:px-8 pb-5 md:pb-8">
        <motion.div
          key={beatIndex}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="rounded-3xl bg-slate-900/92 border-4 border-amber-400/90 shadow-2xl p-5 md:p-7 flex flex-col md:flex-row items-center gap-5 md:gap-7"
        >
          {/* Medaglione Archimede */}
          <div className="w-28 h-28 md:w-36 md:h-36 shrink-0 rounded-full border-4 border-amber-400 bg-slate-950 overflow-hidden shadow-xl">
            <SafeImage
              src={PORTRAIT_BY_EXPRESSION[currentBeat.expression]}
              alt={`Archimede (${currentBeat.expression})`}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Testo battuta leggibile a 5 metri */}
          <div className="flex-1 min-w-0 space-y-2 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-between gap-3">
              <span className="inline-block px-4 py-1 rounded-full bg-amber-400 text-slate-950 font-black text-lg uppercase tracking-wide">
                {currentBeat.speaker}
              </span>
              <span className="text-lg font-bold text-amber-200">
                {beatIndex + 1} / {beats.length}
              </span>
            </div>
            <p className="text-2xl md:text-3xl font-bold text-amber-50 leading-snug">
              {currentBeat.text}
            </p>
          </div>

          {/* Pulsante gigante Avanti (avanzamento SOLO manuale) */}
          <button
            type="button"
            onClick={handleNext}
            className="min-h-16 md:min-h-20 px-8 rounded-2xl bg-amber-400 text-slate-950 font-black text-2xl flex items-center justify-center gap-3 shadow-xl active:scale-95 transition-transform shrink-0 cursor-pointer w-full md:w-auto"
          >
            <span>{isLastBeat ? finishButtonLabel : 'Avanti'}</span>
            <ArrowRight className="w-7 h-7" />
          </button>
        </motion.div>
      </div>
    </div>
  );
}
