import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronRight, FastForward, Sparkles } from 'lucide-react';
import { SafeImage } from '../ui/SafeImage';
import { AmbientParticles } from './AmbientParticles';
import { playClick, playGearTurn, playHint, playTowerChime } from '../../audio/soundEngine';

export interface IntroTrailerProps {
  onFinish: () => void;
}

interface TrailerScene {
  id: number;
  background: string;
  particles: 'snow' | 'gold_dust';
  kicker: string;
  headline: string;
  subline: string;
  visual?: 'gears';
  sound: 'chime1' | 'gear' | 'hint' | 'chime2';
  durationMs: number;
}

const TRAILER_SCENES: TrailerScene[] = [
  {
    id: 1,
    background: '/assets/story/prologue_01_frozen_clock.webp',
    particles: 'snow',
    kicker: "La Notte dell'Avvento",
    headline: 'Il Grande Orologio è rimasto fermo...',
    subline: "Una sera di dicembre, all'improvviso, il suo cuore d'ottone si è spento nel gelo.",
    sound: 'chime1',
    durationMs: 6000,
  },
  {
    id: 2,
    background: '/assets/story/prologue_02_sad_villagers.webp',
    particles: 'snow',
    kicker: 'In Piazza',
    headline: 'I bambini e la gente guardano in alto...',
    subline: 'Tristi e impauriti, stringono le lanterne chiedendosi cosa sia successo alla Torre.',
    sound: 'gear',
    durationMs: 6200,
  },
  {
    id: 3,
    background: '/assets/story/prologue_03_still_village.webp',
    particles: 'snow',
    kicker: 'Silenzio sul Paese',
    headline: 'Tutto nel paese si è fermato.',
    subline: 'Le luci delle feste sono spente, la giostra è immobile... senza l’Orologio il Natale non può arrivare.',
    sound: 'chime1',
    durationMs: 6200,
  },
  {
    id: 4,
    background: '/assets/story/prologue_04_archimede_call.webp',
    particles: 'gold_dust',
    kicker: 'Una Speranza lassù',
    headline: 'Archimede vi chiama dalla Torre!',
    subline: 'Solo ritrovando i 3 Ingranaggi Maestri il tempo potrà tornare a scorrere.',
    visual: 'gears',
    sound: 'hint',
    durationMs: 6500,
  },
  {
    id: 5,
    background: '/assets/backgrounds/bg_tower_map.webp',
    particles: 'gold_dust',
    kicker: 'Tocca a Voi',
    headline: "Siete pronti a svelare il mistero dell'Orologio Fermo?",
    subline: 'Il destino del Natale è nelle mani della vostra classe!',
    sound: 'chime2',
    durationMs: 0, // Ultima scena: attende il tocco del pulsante finale
  },
];

export function IntroTrailer({ onFinish }: IntroTrailerProps) {
  const [sceneIndex, setSceneIndex] = useState(0);
  const scene = TRAILER_SCENES[sceneIndex];
  const isLast = sceneIndex === TRAILER_SCENES.length - 1;

  const handleNext = useCallback(() => {
    playClick();
    if (isLast) {
      onFinish();
    } else {
      setSceneIndex((prev) => Math.min(TRAILER_SCENES.length - 1, prev + 1));
    }
  }, [isLast, onFinish]);

  const handleSkip = useCallback(() => {
    playClick();
    onFinish();
  }, [onFinish]);

  useEffect(() => {
    if (scene.sound === 'chime1') {
      playTowerChime(1);
    } else if (scene.sound === 'chime2') {
      playTowerChime(2);
    } else if (scene.sound === 'gear') {
      playGearTurn();
    } else if (scene.sound === 'hint') {
      playHint();
    }
  }, [scene]);

  useEffect(() => {
    if (scene.durationMs <= 0) return;
    const timer = window.setTimeout(() => {
      setSceneIndex((prev) => Math.min(TRAILER_SCENES.length - 1, prev + 1));
    }, scene.durationMs);
    return () => window.clearTimeout(timer);
  }, [scene]);

  return (
    <div className="relative h-screen w-screen overflow-hidden select-none bg-[#070E20] flex flex-col justify-between">
      {/* Illustrazione a schermo pieno con cross-fade e Ken Burns lento */}
      <AnimatePresence mode="wait">
        <motion.div
          key={scene.id}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.85, ease: 'easeInOut' }}
          className="absolute inset-0 overflow-hidden"
        >
          <SafeImage
            src={scene.background}
            alt={scene.kicker}
            className="w-full h-full object-cover animate-ken-burns"
          />
          {/* Gradiente morbido: lascia l'illustrazione ben visibile al centro e scurisce solo in basso per i sottotitoli */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#070E20]/55 via-transparent via-45% to-[#070E20]/95" />
        </motion.div>
      </AnimatePresence>

      {/* Neve o pulviscolo dorato */}
      <AmbientParticles variant={scene.particles} count={22} />

      {/* Barra superiore discreta */}
      <header className="relative z-20 px-6 pt-4 pb-2 flex items-center justify-between gap-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-950/75 border-2 border-amber-400/75 text-[#FFE169] font-display font-bold text-base md:text-lg tracking-wide">
          <Sparkles className="w-5 h-5 text-amber-300" />
          <span>Prologo — {sceneIndex + 1} / {TRAILER_SCENES.length}</span>
        </div>

        <div className="flex items-center gap-2" aria-hidden="true">
          {TRAILER_SCENES.map((s, idx) => (
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

      {/* Spazio aperto per far respirare l'illustrazione + sottotitolo cinematografico in basso */}
      <main className="relative z-20 flex-1 flex flex-col items-center justify-end px-6 md:px-12 pb-4 text-center max-w-5xl mx-auto w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={scene.id}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
            className="flex flex-col items-center gap-3 w-full"
          >
            {scene.visual === 'gears' && (
              <div className="flex items-center justify-center gap-4 md:gap-7 mb-1">
                {[
                  { src: '/assets/gears/gear_bronze.png', label: 'Bronzo', delay: 0.06 },
                  { src: '/assets/gears/gear_silver.png', label: 'Argento', delay: 0.18 },
                  { src: '/assets/gears/gear_gold.png', label: 'Oro', delay: 0.3 },
                ].map((gear) => (
                  <motion.div
                    key={gear.label}
                    initial={{ opacity: 0, scale: 0.5, rotate: -40 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 180, damping: 16, delay: gear.delay }}
                    className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-slate-950/80 border-[3px] border-amber-400/90 p-2 shadow-[0_0_24px_rgba(251,191,36,0.45)] flex items-center justify-center"
                  >
                    <SafeImage
                      src={gear.src}
                      alt={`Ingranaggio ${gear.label}`}
                      className="w-full h-full object-contain"
                    />
                  </motion.div>
                ))}
              </div>
            )}

            <div className="w-full max-w-4xl rounded-3xl bg-slate-950/85 border-2 border-amber-400/80 px-6 py-4 md:px-8 md:py-5 shadow-2xl space-y-2">
              <span className="inline-block px-4 py-0.5 rounded-full bg-amber-400/20 border border-amber-400/70 text-amber-200 font-display font-bold text-base md:text-lg tracking-wider uppercase">
                {scene.kicker}
              </span>
              <h2 className="font-display text-2xl sm:text-3xl md:text-5xl font-bold text-[#FFE169] leading-tight">
                {scene.headline}
              </h2>
              <p className="text-[#FEF3C7] text-lg sm:text-xl md:text-2xl font-bold leading-snug">
                {scene.subline}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Fascia inferiore ergonomica LIM */}
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
            <span>Salta Intro</span>
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="btn-3d btn-3d-gold min-h-16 md:min-h-20 px-8 md:px-12 rounded-[24px] font-display font-bold text-2xl md:text-3xl flex items-center gap-3 cursor-pointer"
          >
            <span>{isLast ? 'Entriamo nella Torre!' : 'Avanti'}</span>
            <ChevronRight className="w-8 h-8 stroke-[3]" />
          </button>
        </div>
      </footer>
    </div>
  );
}
