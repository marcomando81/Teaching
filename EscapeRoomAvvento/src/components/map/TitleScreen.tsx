import { motion } from 'motion/react';
import { Play, Sparkles, Star } from 'lucide-react';
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
    <div className="relative h-screen w-screen overflow-hidden select-none bg-[#162646] flex flex-col justify-between">
      {/* Sfondo Torre con Ken Burns ben visibile */}
      <div className="absolute inset-0 overflow-hidden">
        <SafeImage
          src="/assets/backgrounds/bg_tower_map.webp"
          alt="La Torre del Grande Orologio"
          className="w-full h-full object-cover animate-ken-burns"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0E1C38]/55 via-transparent to-[#0E1C38]/65" />
      </div>

      {/* Neve sospesa */}
      <AmbientParticles variant="snow" count={24} />

      {/* Copertina libro illustrato nella parte alta */}
      <div className="relative z-20 pt-6 md:pt-10 px-6 text-center max-w-4xl mx-auto flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2.5 px-6 py-2 rounded-full bg-[#E04248] border-[3px] border-[#3A2314] text-white font-display font-bold text-lg md:text-xl mb-4 shadow-[0_4px_0_#3A2314]"
        >
          <Sparkles className="w-5 h-5 text-[#FFE169]" />
          <span>Escape Room dell&apos;Avvento — Classe 5ª</span>
          <Sparkles className="w-5 h-5 text-[#FFE169]" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 220, damping: 18, delay: 0.08 }}
          className="font-display text-4xl sm:text-5xl md:text-7xl font-bold text-[#FFE169] title-outline leading-tight tracking-wide"
        >
          Il Caso dell&apos;Orologio Fermo
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.16 }}
          className="mt-4 px-6 py-2.5 rounded-2xl bg-[#FFF9EC]/95 border-[3px] border-[#3A2314] text-[#2B190E] text-lg md:text-2xl font-extrabold shadow-[0_4px_0_rgba(58,35,20,0.45)] max-w-3xl"
        >
          Recupera i 3 Ingranaggi Maestri e risveglia il Grande Orologio della Torre!
        </motion.p>
      </div>

      {/* Pulsante gigante 3D nella fascia inferiore (ergonomia LIM) */}
      <div className="relative z-20 pb-8 md:pb-12 px-6 flex flex-col items-center gap-4">
        <motion.button
          type="button"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 240, damping: 20, delay: 0.2 }}
          onClick={() => {
            playClick();
            onStart();
          }}
          className="btn-3d btn-3d-gold min-h-20 px-12 md:px-16 rounded-[28px] font-bold text-3xl md:text-4xl flex items-center gap-4 cursor-pointer"
        >
          <Play className="w-9 h-9 fill-[#3A2314]" />
          <span>{hasProgress ? 'Riprendi Avventura' : 'Inizia Avventura'}</span>
        </motion.button>

        {hasProgress && (
          <div className="inline-flex items-center gap-2.5 px-6 py-2 rounded-full bg-[#FFF9EC] border-[3px] border-[#3A2314] text-[#2B190E] font-display font-bold text-xl shadow-[0_4px_0_rgba(58,35,20,0.4)]">
            <Star className="w-6 h-6 text-[#F5B21B] fill-[#FFD859]" />
            <span>Stazioni completate: {completedStations.length} / 13</span>
          </div>
        )}
      </div>
    </div>
  );
}
