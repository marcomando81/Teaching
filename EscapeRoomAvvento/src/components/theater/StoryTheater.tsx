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
      {/* Sfondo illustrato con Ken Burns molto più luminoso */}
      <div className="absolute inset-0 overflow-hidden">
        <SafeImage
          src={backgroundPath}
          alt={backgroundAlt}
          className="w-full h-full object-cover animate-ken-burns"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#10203E]/70 via-[#10203E]/15 to-transparent" />
      </div>

      {/* Particelle ambientali leggere */}
      <AmbientParticles variant={particleVariant} />

      {/* Area fumetto dialogo nella metà inferiore */}
      <div className="relative z-20 w-full max-w-5xl mx-auto px-4 md:px-8 pb-4 md:pb-7">
        <div className="flex flex-col md:flex-row items-center md:items-end gap-4 md:gap-6">
          {/* Medaglione rotondo di Archimede */}
          <motion.div
            key={`owl-${currentBeat.expression}`}
            initial={{ scale: 0.9, opacity: 0.7 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            className="w-28 h-28 md:w-36 md:h-36 shrink-0 rounded-full border-4 border-[#3A2314] ring-4 ring-[#FFD859] bg-[#1D2B4A] overflow-hidden shadow-[0_6px_0_rgba(58,35,20,0.45)]"
          >
            <SafeImage
              src={PORTRAIT_BY_EXPRESSION[currentBeat.expression]}
              alt={`Archimede (${currentBeat.expression})`}
              className="w-full h-full object-cover"
            />
          </motion.div>

          {/* Fumetto in pergamena calda con codina verso Archimede */}
          <motion.div
            key={beatIndex}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22 }}
            className="storybook-panel speech-tail-left flex-1 w-full rounded-[28px] p-4 md:p-6 flex flex-col md:flex-row items-center gap-4 md:gap-6"
          >
            <div className="flex-1 min-w-0 space-y-2 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-between gap-3">
                <span className="inline-flex items-center px-4 py-1 rounded-full bg-[#FFD859] text-[#3A2314] border-2 border-[#3A2314] font-display font-bold text-lg uppercase tracking-wide shadow-[0_2px_0_#3A2314]">
                  {currentBeat.speaker}
                </span>

                {/* Pallini progresso lettura */}
                <div className="flex items-center gap-2" aria-label={`Battuta ${beatIndex + 1} di ${beats.length}`}>
                  {beats.map((_, idx) => (
                    <span
                      key={idx}
                      className={`h-3 rounded-full border-2 border-[#3A2314] transition-all ${
                        idx === beatIndex
                          ? 'w-7 bg-[#E04248]'
                          : idx < beatIndex
                          ? 'w-3 bg-[#22A85A]'
                          : 'w-3 bg-[#EAD3A8]'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <p className="text-xl sm:text-2xl md:text-[26px] font-extrabold text-[#2B190E] leading-snug">
                {currentBeat.text}
              </p>
            </div>

            {/* Pulsante 3D gigante Avanti (avanzamento SOLO manuale) */}
            <button
              type="button"
              onClick={handleNext}
              className="btn-3d btn-3d-gold min-h-16 md:min-h-18 px-7 rounded-2xl font-bold text-2xl flex items-center justify-center gap-2.5 shrink-0 cursor-pointer w-full md:w-auto"
            >
              <span>{isLastBeat ? finishButtonLabel : 'Avanti'}</span>
              <ArrowRight className="w-7 h-7" />
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
