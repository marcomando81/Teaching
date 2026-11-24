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
  visual?: 'gears' | 'archimede';
  sound: 'chime1' | 'gear' | 'hint' | 'chime2';
  durationMs: number;
}

const TRAILER_SCENES: TrailerScene[] = [
  {
    id: 1,
    background: '/assets/backgrounds/bg_tower_map.webp',
    particles: 'snow',
    kicker: "La Notte dell'Avvento",
    headline: 'Il Grande Orologio della Torre si è fermato...',
    subline: 'Nel silenzio della neve di dicembre, le lancette non battono più le ore.',
    sound: 'chime1',
    durationMs: 5500,
  },
  {
    id: 2,
    background: '/assets/backgrounds/bg_act2_workshop.webp',
    particles: 'gold_dust',
    kicker: 'Le Sale del Mistero',
    headline: 'Stanze segrete ed enigmi antichi vi attendono.',
    subline: 'Ogni piano della Torre custodisce meccanismi bloccati e indizi nascosti.',
    sound: 'gear',
    durationMs: 5500,
  },
  {
    id: 3,
    background: '/assets/backgrounds/bg_act3_archive.webp',
    particles: 'gold_dust',
    kicker: 'La Missione',
    headline: 'Ritrovate i 3 Ingranaggi Maestri!',
    subline: 'Bronzo, Argento e Oro: solo insieme faranno ripartire il tempo prima di Natale.',
    visual: 'gears',
    sound: 'hint',
    durationMs: 6000,
  },
  {
    id: 4,
    background: '/assets/backgrounds/bg_finale_clockface.webp',
    particles: 'gold_dust',
    kicker: 'Il Gufo Custode',
    headline: 'Archimede vi guiderà lungo la salita...',
    subline: "Ma per aprire le porte d'ottone servirà l'ingegno di tutta la classe!",
    visual: 'archimede',
    sound: 'hint',
    durationMs: 5800,
  },
  {
    id: 5,
    background: '/assets/backgrounds/bg_tower_map.webp',
    particles: 'snow',
    kicker: 'Il Tempo Stringe',
    headline: "Siete pronti a svelare il mistero dell'Orologio Fermo?",
    subline: 'Toccate il pulsante qui sotto per entrare nella Torre!',
    sound: 'chime2',
    durationMs: 0, // Ultima scena: resta in attesa del tocco
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

  // Effetto sonoro dedicato all'ingresso di ogni scena
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

  // Avanzamento automatico stile trailer (tranne ultima scena)
  useEffect(() => {
    if (scene.durationMs <= 0) return;
    const timer = window.setTimeout(() => {
      setSceneIndex((prev) => Math.min(TRAILER_SCENES.length - 1, prev + 1));
    }, scene.durationMs);
    return () => window.clearTimeout(timer);
  }, [scene]);

  return (
    <div className="relative h-screen w-screen overflow-hidden select-none bg-[#0B132B] flex flex-col justify-between">
      {/* Sfondo animato con cross-fade e Ken Burns */}
      <AnimatePresence mode="wait">
        <motion.div
          key={scene.id}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.75, ease: 'easeInOut' }}
          className="absolute inset-0 overflow-hidden"
        >
          <SafeImage
            src={scene.background}
            alt={scene.kicker}
            className="w-full h-full object-cover animate-ken-burns"
          />
          {/* Vignetta cinematografica per contrasto massimo su LIM */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#070E20]/85 via-[#0B132B]/55 to-[#070E20]/92" />
        </motion.div>
      </AnimatePresence>

      {/* Particelle atmosferiche */}
      <AmbientParticles variant={scene.particles} count={22} />

      {/* Banda cinematografica superiore con indicatore progresso */}
      <header className="relative z-20 px-6 pt-5 pb-3 flex items-center justify-between gap-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-950/80 border-2 border-amber-400/70 text-[#FFE169] font-display font-bold text-base md:text-lg tracking-wide">
          <Sparkles className="w-5 h-5 text-amber-300" />
          <span>Prologo — {sceneIndex + 1} / {TRAILER_SCENES.length}</span>
        </div>

        {/* 5 indicatori di scena */}
        <div className="flex items-center gap-2" aria-hidden="true">
          {TRAILER_SCENES.map((s, idx) => (
            <div
              key={s.id}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                idx === sceneIndex
                  ? 'w-10 bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.8)]'
                  : idx < sceneIndex
                    ? 'w-4 bg-amber-300/70'
                    : 'w-4 bg-white/25'
              }`}
            />
          ))}
        </div>
      </header>

      {/* Palcoscenico centrale del trailer */}
      <main className="relative z-20 flex-1 flex flex-col items-center justify-center px-6 md:px-14 text-center max-w-5xl mx-auto w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={scene.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
            className="flex flex-col items-center gap-4 md:gap-5 w-full"
          >
            {/* Elemento visivo speciale: i 3 Ingranaggi Maestri */}
            {scene.visual === 'gears' && (
              <div className="flex items-center justify-center gap-5 md:gap-10 mb-1">
                {[
                  { src: '/assets/gears/gear_bronze.png', label: 'Bronzo', delay: 0.05 },
                  { src: '/assets/gears/gear_silver.png', label: 'Argento', delay: 0.18 },
                  { src: '/assets/gears/gear_gold.png', label: 'Oro', delay: 0.3 },
                ].map((gear) => (
                  <motion.div
                    key={gear.label}
                    initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 180, damping: 16, delay: gear.delay }}
                    className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-slate-950/75 border-4 border-amber-400/90 p-2.5 shadow-[0_0_28px_rgba(251,191,36,0.45)] flex items-center justify-center"
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

            {/* Elemento visivo speciale: Archimede */}
            {scene.visual === 'archimede' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 18, delay: 0.08 }}
                className="w-28 h-28 md:w-36 md:h-36 rounded-full border-4 border-amber-400 bg-slate-950 overflow-hidden shadow-[0_0_32px_rgba(251,191,36,0.5)] mb-1"
              >
                <SafeImage
                  src="/assets/portraits/archimede_mysterious.webp"
                  alt="Archimede, il gufo custode"
                  className="w-full h-full object-cover"
                />
              </motion.div>
            )}

            {/* Occhiello */}
            <span className="inline-block px-5 py-1.5 rounded-full bg-amber-400/20 border-2 border-amber-400/80 text-amber-200 font-display font-bold text-lg md:text-2xl tracking-wider uppercase">
              {scene.kicker}
            </span>

            {/* Titolo cinematografico */}
            <h2 className="font-display text-3xl sm:text-4xl md:text-6xl font-bold text-[#FFE169] title-outline leading-tight max-w-4xl">
              {scene.headline}
            </h2>

            {/* Sottotitolo leggibile a 5 metri */}
            <p className="px-6 py-3 rounded-2xl bg-slate-900/90 border-2 border-amber-400/75 text-[#FEF3C7] text-xl md:text-3xl font-bold leading-snug max-w-4xl shadow-xl">
              {scene.subline}
            </p>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Fascia inferiore ergonomica LIM: Salta Intro + Avanti / Entriamo nella Torre */}
      <footer className="relative z-20 px-6 md:px-10 pb-6 md:pb-8 pt-3 flex flex-col gap-3">
        {/* Barra di avanzamento temporale sottile */}
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
