import { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { BookOpen, Check, CheckCircle2, Flashlight, RotateCcw, X } from 'lucide-react';
import type {
  HotspotFindConfig,
  HotspotFlashlightConfig,
  PuzzleEngineProps,
} from '../../types/game';
import { SafeImage } from '../ui/SafeImage';
import { playClick } from '../../audio/soundEngine';

type HotspotConfig = HotspotFlashlightConfig | HotspotFindConfig;

export function HotspotScene({
  config,
  onSolve,
  onMistake,
}: PuzzleEngineProps<HotspotConfig>) {
  const isFlashlight = config.mode === 'flashlight_sequence';
  const targetCount = isFlashlight
    ? config.solutionSequence.length
    : config.solutionSet.length;

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [cluesOpen, setCluesOpen] = useState(false);
  const [spot, setSpot] = useState<{ x: number; y: number }>({ x: 50, y: 45 });
  const stageRef = useRef<HTMLDivElement | null>(null);

  const updateSpotFromPointer = (clientX: number, clientY: number) => {
    const el = stageRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;
    const x = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((clientY - rect.top) / rect.height) * 100));
    setSpot({ x, y });
  };

  const handlePropTap = (propId: string) => {
    playClick();
    setSelectedIds((prev) => {
      if (prev.includes(propId)) {
        return prev.filter((id) => id !== propId);
      }
      if (prev.length >= targetCount) {
        return prev;
      }
      return [...prev, propId];
    });
  };

  const handleReset = () => {
    playClick();
    setSelectedIds([]);
  };

  const handleConfirm = () => {
    if (selectedIds.length !== targetCount) return;

    if (config.mode === 'flashlight_sequence') {
      const isExact = config.solutionSequence.every((id, idx) => selectedIds[idx] === id);
      if (isExact) {
        onSolve();
      } else {
        const sameItems =
          selectedIds.length === config.solutionSequence.length &&
          config.solutionSequence.every((id) => selectedIds.includes(id));
        onMistake(
          sameItems
            ? 'Gli oggetti sono giusti, ma l’ordine non è quello del biglietto! Riprova.'
            : 'Qualche oggetto o l’ordine non corrisponde al biglietto di Mastro Orazio!'
        );
      }
    } else {
      const isMatch =
        selectedIds.length === config.solutionSet.length &&
        config.solutionSet.every((id) => selectedIds.includes(id));
      if (isMatch) {
        onSolve();
      } else {
        onMistake('Non sono tutti i 4 oggetti descritti nel diario! Rileggi gli indizi.');
      }
    }
  };

  const maskValue = `radial-gradient(circle 165px at ${spot.x}% ${spot.y}%, transparent 0%, transparent 62%, rgba(0,0,0,0.96) 100%)`;

  return (
    <div className="relative z-20 w-full h-full flex flex-col justify-between overflow-hidden">
      {/* Banner consegna in alto */}
      <div className="shrink-0 px-4 pt-3 pb-1 flex items-center justify-center pointer-events-none">
        <div className="px-5 py-2 rounded-2xl bg-slate-900/92 border-2 border-amber-400/80 text-amber-100 font-extrabold text-xl md:text-2xl shadow-lg flex items-center gap-3 text-center">
          {isFlashlight && <Flashlight className="w-6 h-6 text-amber-300 shrink-0" />}
          <span>{config.promptTitle}</span>
        </div>
      </div>

      {/* Area scena interattiva con prop posizionati in percentuale */}
      <div
        ref={stageRef}
        style={{ touchAction: 'none' }}
        onPointerMove={(e) => {
          if (isFlashlight) updateSpotFromPointer(e.clientX, e.clientY);
        }}
        onPointerDown={(e) => {
          if (isFlashlight) updateSpotFromPointer(e.clientX, e.clientY);
        }}
        className="relative flex-1 w-full overflow-hidden"
      >
        {/* Prop interattivi */}
        {config.props.map((prop) => {
          const orderIndex = selectedIds.indexOf(prop.id);
          const isSelected = orderIndex !== -1;

          return (
            <button
              key={prop.id}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handlePropTap(prop.id);
              }}
              style={{
                left: `${prop.xPercent}%`,
                top: `${prop.yPercent}%`,
              }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 group flex flex-col items-center gap-1.5 cursor-pointer active:scale-95 transition-transform ${
                isSelected ? 'z-30' : 'z-10'
              }`}
              aria-label={prop.label}
            >
              <div
                className={`relative w-20 h-20 md:w-24 md:h-24 rounded-full border-4 bg-slate-950 overflow-hidden shadow-2xl ${
                  isSelected
                    ? 'border-emerald-400 ring-4 ring-emerald-400/50'
                    : 'border-amber-400'
                }`}
              >
                <SafeImage
                  src={prop.imagePath}
                  alt={prop.label}
                  className="w-full h-full object-cover"
                />
                {isSelected && (
                  <span className="absolute -top-1 -right-1 w-9 h-9 rounded-full bg-emerald-400 text-slate-950 border-2 border-slate-950 font-black text-xl flex items-center justify-center shadow">
                    {isFlashlight ? orderIndex + 1 : <Check className="w-5 h-5" />}
                  </span>
                )}
              </div>

              <span className="px-2.5 py-0.5 rounded-lg bg-slate-950/90 border border-amber-400/70 text-amber-50 font-bold text-sm md:text-base whitespace-nowrap shadow">
                {prop.label}
              </span>
            </button>
          );
        })}

        {/* Maschera torcia radiale (solo modalità flashlight_sequence) */}
        {isFlashlight && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-20 bg-slate-950/95"
            style={{
              WebkitMaskImage: maskValue,
              maskImage: maskValue,
            }}
          />
        )}
      </div>

      {/* Fascia controlli bassa (ergonomia LIM) */}
      <div className="shrink-0 px-4 pb-3 pt-2 bg-slate-950/85 border-t-2 border-amber-400/50 flex flex-wrap items-center justify-between gap-3 z-30">
        <button
          type="button"
          onClick={() => {
            playClick();
            setCluesOpen(true);
          }}
          className="min-h-14 px-5 rounded-2xl bg-slate-900 border-2 border-amber-400 text-amber-200 font-extrabold text-lg md:text-xl flex items-center gap-2.5 active:scale-95 cursor-pointer"
        >
          <BookOpen className="w-6 h-6 text-amber-300" />
          <span>Leggi Indizi a Schermo Intero</span>
        </button>

        <div className="flex items-center gap-3 ml-auto">
          <span className="px-4 py-2 rounded-xl bg-slate-900 border-2 border-amber-400/60 text-amber-100 font-black text-lg md:text-xl">
            Selezionati: {selectedIds.length} / {targetCount}
          </span>

          <button
            type="button"
            onClick={handleReset}
            disabled={selectedIds.length === 0}
            className="min-h-14 px-5 rounded-2xl bg-slate-800 border-2 border-amber-400/70 text-amber-100 font-bold text-lg md:text-xl flex items-center gap-2 disabled:opacity-50 active:scale-95 cursor-pointer"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Azzera</span>
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            disabled={selectedIds.length !== targetCount}
            className="min-h-14 px-7 rounded-2xl bg-emerald-400 text-slate-950 font-black text-xl md:text-2xl flex items-center gap-2 shadow-lg disabled:opacity-45 disabled:cursor-not-allowed active:scale-95 cursor-pointer"
          >
            <CheckCircle2 className="w-6 h-6" />
            <span>Conferma</span>
          </button>
        </div>
      </div>

      {/* Modale Indizi a Schermo Intero con font gigante per la classe */}
      <AnimatePresence>
        {cluesOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/92 flex items-center justify-center p-5 md:p-8"
            onClick={() => {
              playClick();
              setCluesOpen(false);
            }}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-4xl max-h-[90vh] rounded-3xl bg-slate-900 border-4 border-amber-400 shadow-2xl p-6 md:p-8 flex flex-col gap-5"
            >
              <div className="flex items-center justify-between gap-4 border-b-2 border-amber-400/40 pb-3">
                <h3 className="text-2xl md:text-4xl font-black text-amber-300">
                  {config.promptTitle}
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    playClick();
                    setCluesOpen(false);
                  }}
                  className="min-h-14 px-6 rounded-2xl bg-amber-400 text-slate-950 font-black text-xl flex items-center gap-2 cursor-pointer"
                >
                  <X className="w-6 h-6" />
                  <span>Chiudi</span>
                </button>
              </div>

              <ol className="flex-1 overflow-y-auto space-y-4 pr-1">
                {config.clues.map((clue, idx) => (
                  <li
                    key={idx}
                    className="rounded-2xl bg-slate-950 border-2 border-amber-400/70 p-4 md:p-5 flex items-start gap-4"
                  >
                    <span className="w-12 h-12 shrink-0 rounded-full bg-amber-400 text-slate-950 font-black text-2xl flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <p className="text-2xl md:text-3xl font-bold text-amber-50 leading-snug">
                      {clue}
                    </p>
                  </li>
                ))}
              </ol>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
