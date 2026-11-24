import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { ChevronRight, FastForward, Sparkles } from 'lucide-react';
import { SafeImage } from '../ui/SafeImage';
import { AmbientParticles } from './AmbientParticles';
import { playClick, playSuccess, playTowerChime } from '../../audio/soundEngine';

export interface EpilogueTrailerProps {
  onFinish: () => void;
}

interface EpilogueScene {
  id: number;
  background: string;
  particles: 'snow' | 'gold_dust';
  kicker: string;
  headline: string;
  subline: string;
  sound: 'chime3' | 'celebrate';
  durationMs: number;
}

const EPILOGUE_SCENES: EpilogueScene[] = [
  {
    id: 1,
    background: '/assets/story/epilogue_01_clock_awakens.webp',
    particles: 'gold_dust',
    kicker: 'Il Risveglio della Torre',
    headline: 'Il Grande Orologio è ripartito!',
    subline: "I 3 Ingranaggi Maestri girano insieme: una luce dorata avvolge il cielo e le campane tornano a suonare!",
    sound: 'chime3',
    durationMs: 6500,
  },
  {
    id: 2,
    background: '/assets/story/epilogue_02_happy_villagers.webp',
    particles: 'snow',
    kicker: 'Festa in Paese',
    headline: 'La gioia torna tra i bambini e le famiglie!',
    subline: 'Le luci di Natale brillano ovunque in piazza: grazie al vostro ingegno, il Natale è salvo!',
    sound: 'celebrate',
    durationMs: 0, // Resta in attesa del tocco per aprire la celebrazione finale
  },
];

export function EpilogueTrailer({ onFinish }: EpilogueTrailerProps) {
  const [sceneIndex, setSceneIndex] = useState(0);
  const scene = EPILOGUE_SCENES[sceneIndex];
  const isLast = sceneIndex === EPILOGUE_SCENES.length - 1;

  const handleNext = useCallback(() => {
    playClick();
    if (isLast) {
      onFinish();
    } else {
      setSceneIndex((prev) => Math.min(EPILOGUE_SCENES.length - 1, prev + 1));
    }
  }, [isLast, onFinish]);

  const handleSkip = useCallback(() => {
    playClick();
    onFinish();
  }, [onFinish]);

  useEffect(() => {
    if (scene.sound === 'chime3') {
      playTowerChime(3);
    } else if (scene.sound === 'celebrate') {
      playSuccess();
      const colors = ['#FFD859', '#E04248', '#22A85A', '#38BDF8', '#FFFFFF'];
      confetti({ particleCount: 90, spread: 95, origin: { y: 0.55 }, colors });
    }
  }, [scene]);

  useEffect(() => {
    if (scene.durationMs <= 0) return;
    const timer = window.setTimeout(() => {
      setSceneIndex((prev) => Math.min(EPILOGUE_SCENES.length - 1, prev + 1));
    }, scene.durationMs);
    return () => window.clearTimeout(timer);
  }, [scene]);

  return (
    <div className="relative h-screen w-screen overflow-hidden select-none bg-[#0B1630] flex flex-col justify-between">
      <AnimatePresence mode="wait">
        <motion.div
          key={scene.id}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: 'easeInOut' }}
          className="absolute inset-0 overflow-hidden"
        >
          <SafeImage
            src={scene.background}
            alt={scene.kicker}
            className="w-full h-full object-cover animate-ken-burns"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0A142B]/45 via-transparent via-45% to-[#070E20]/92" />
        </motion.div>
      </AnimatePresence>

      <AmbientParticles variant={scene.particles} count={26} />

      <header className="relative z-20 px-6 pt-4 pb-2 flex items-center justify-between gap-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-950/75 border-2 border-amber-400/80 text-[#FFE169] font-display font-bold text-base md:text-lg tracking-wide">
          <Sparkles className="w-5 h-5 text-amber-300" />
          <span>Epilogo — {sceneIndex + 1} / {EPILOGUE_SCENES.length}</span>
        </div>

        <div className="flex items-center gap-2" aria-hidden="true">
          {EPILOGUE_SCENES.map((s, idx) => (
            <div
              key={s.id}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                idx === sceneIndex
                  ? 'w-10 bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.85)]'
                  : idx < sceneIndex
                    ? 'w-4 bg-amber-300/75'
                    : 'w-4 bg-white/30'
              }`}
            />
          ))}
        </div>
      </header>

      <main className="relative z-20 flex-1 flex flex-col items-center justify-end px-6 md:px-12 pb-4 text-center max-w-5xl mx-auto w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={scene.id}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
            className="w-full max-w-4xl rounded-3xl bg-slate-950/85 border-2 border-amber-400/85 px-6 py-4 md:px-8 md:py-5 shadow-2xl space-y-2"
          >
            <span className="inline-block px-4 py-0.5 rounded-full bg-amber-400/20 border border-amber-400/75 text-amber-200 font-display font-bold text-base md:text-lg tracking-wider uppercase">
              {scene.kicker}
            </span>
            <h2 className="font-display text-2xl sm:text-3xl md:text-5xl font-bold text-[#FFE169] leading-tight">
              {scene.headline}
            </h2>
            <p className="text-[#FEF3C7] text-lg sm:text-xl md:text-2xl font-bold leading-snug">
              {scene.subline}
            </p>
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="relative z-20 px-6 md:px-10 pb-5 md:pb-7 pt-2 flex flex-col gap-3">
        <div className="w-full h-1.5 bg-white/15 rounded-full overflow-hidden">
          {scene.durationMs > 0 ? (
            <motion.div
              key={`bar-${scene.id}`}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: scene.durationMs / 1000, ease: 'linear' }}
              style={{ transformOrigin: 'left center' }}
              className="h-full bg-amber-400"
            />
          ) : (
            <div className="h-full w-full bg-amber-400" />
          )}
        </div>

        <div className="flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={handleSkip}
            className="btn-3d btn-3d-wood min-h-14 md:min-h-16 px-6 md:px-8 rounded-2xl font-display font-bold text-xl md:text-2xl text-[#FFE38E] flex items-center gap-2.5 cursor-pointer"
          >
            <FastForward className="w-6 h-6" />
            <span>Salta</span>
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="btn-3d btn-3d-gold min-h-16 md:min-h-20 px-8 md:px-12 rounded-[24px] font-display font-bold text-2xl md:text-3xl flex items-center gap-3 cursor-pointer"
          >
            <span>{isLast ? 'Festeggiamo!' : 'Avanti'}</span>
            <ChevronRight className="w-8 h-8 stroke-[3]" />
          </button>
        </div>
      </footer>
    </div>
  );
}
