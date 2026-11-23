import { motion } from 'motion/react';
import { Clock, Play } from 'lucide-react';
import { SafeImage } from '../ui/SafeImage';
import { AmbientParticles } from '../theater/AmbientParticles';
import { useGameStore } from '../../store/useGameStore';
import { playClick } from '../../audio/soundEngine';

export interface TitleScreenProps {
  onStart: () => void;
}

export function TitleScreen({ onStart }: TitleScreenProps) {
  const completedStations = useGameStore((s) => s.completedStations);
  const hasProgress = completedStations.length > 0;

  return (
    <div className="relative h-screen w-screen overflow-hidden select-none bg-[#0B132B] flex flex-col justify-between">
      {/* Sfondo Torre con Ken Burns */}
      <div className="absolute inset-0 overflow-hidden">
        <SafeImage
          src="/assets/backgrounds/bg_tower_map.webp"
          alt="La Torre del Grande Orologio"
          className="w-full h-full object-cover animate-ken-burns"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/35 to-slate-950/55" />
      </div>

      {/* Neve sospesa */}
      <AmbientParticles variant="snow" count={24} />

      {/* Titolo nella parte alta */}
      <div className="relative z-20 pt-8 md:pt-12 px-6 text-center max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-slate-900/90 border-2 border-amber-400/80 text-amber-300 font-bold text-xl mb-4 shadow-lg"
        >
          <Clock className="w-6 h-6" />
          <span>Escape Room dell&apos;Avvento — Classe 5ª</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl font-black text-amber-300 drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)] leading-tight"
        >
          Il Caso dell&apos;Orologio Fermo
        </motion.h1>

        <p className="mt-3 text-xl md:text-2xl font-bold text-amber-50 drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
          Recupera i 3 Ingranaggi Maestri e risveglia il Grande Orologio della Torre!
        </p>
      </div>

      {/* Pulsante gigante nella fascia inferiore (ergonomia LIM) */}
      <div className="relative z-20 pb-10 md:pb-14 px-6 flex flex-col items-center gap-4">
        <motion.button
          type="button"
          whileTap={{ scale: 0.96 }}
          onClick={() => {
            playClick();
            onStart();
          }}
          className="min-h-20 px-12 md:px-16 rounded-3xl bg-amber-400 text-slate-950 border-4 border-amber-100 font-black text-3xl md:text-4xl flex items-center gap-4 shadow-2xl cursor-pointer"
        >
          <Play className="w-9 h-9 fill-slate-950" />
          <span>{hasProgress ? 'Riprendi Avventura' : 'Inizia Avventura'}</span>
        </motion.button>

        {hasProgress && (
          <p className="px-5 py-1.5 rounded-full bg-slate-900/90 border-2 border-amber-400/60 text-amber-100 font-bold text-xl">
            Stazioni completate: {completedStations.length} / 13
          </p>
        )}
      </div>
    </div>
  );
}
