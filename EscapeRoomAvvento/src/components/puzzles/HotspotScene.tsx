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

  const maskValue = `radial-gradient(circle 170px at ${spot.x}% ${spot.y}%, transparent 0%, transparent 62%, rgba(0,0,0,0.96) 100%)`;

  return (
    <div className="relative z-20 w-full h-full flex flex-col justify-between overflow-hidden">
      {/* Cartiglio consegna in alto */}
      <div className="shrink-0 px-4 pt-3 pb-1 flex items-center justify-center pointer-events-none">
        <div className="storybook-panel px-5 py-2 rounded-2xl font-display font-bold text-lg md:text-2xl text-[#2B190E] flex items-center gap-3 text-center">
          {isFlashlight && (
            <span className="w-9 h-9 rounded-xl bg-[#FFD859] border-2 border-[#3A2314] flex items-center justify-center shrink-0">
              <Flashlight className="w-5 h-5 text-[#3A2314]" />
            </span>
          )}
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
              <div className="relative w-20 h-20 md:w-24 md:h-24">
                <div
                  className={`w-full h-full rounded-full border-4 bg-[#FFF8E7] overflow-hidden shadow-[0_6px_0_rgba(43,25,14,0.45)] ${
                    isSelected
                      ? 'border-[#1F8B4C] ring-4 ring-[#4FE08A]/80 scale-105'
                      : 'border-[#3A2314] ring-3 ring-[#FFD859]'
                  }`}
                >
                  <SafeImage
                    src={prop.imagePath}
                    alt={prop.label}
                    className="w-full h-full object-cover"
                  />
                </div>
                {isSelected && (
                  <span className="absolute -top-1 -right-1 w-9 h-9 rounded-full bg-[#22A85A] text-white border-[3px] border-[#3A2314] font-display font-bold text-xl flex items-center justify-center shadow">
                    {isFlashlight ? orderIndex + 1 : <Check className="w-5 h-5 stroke-[3]" />}
                  </span>
                )}
              </div>

              <span className="px-3 py-0.5 rounded-xl bg-[#FFF9EC] border-2 border-[#3A2314] text-[#2B190E] font-extrabold text-sm md:text-base whitespace-nowrap shadow-[0_3px_0_rgba(58,35,20,0.4)]">
                {prop.label}
              </span>
            </button>
          );
        })}

        {/* Alone caldo della lanterna + maschera buio (solo modalità flashlight_sequence) */}
        {isFlashlight && (
          <>
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-15"
              style={{
                background: `radial-gradient(circle 185px at ${spot.x}% ${spot.y}%, rgba(255,224,130,0.2) 0%, rgba(255,205,86,0.08) 55%, transparent 72%)`,
              }}
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-20 bg-[#0D162C]/94"
              style={{
                WebkitMaskImage: maskValue,
                maskImage: maskValue,
              }}
            />
          </>
        )}
      </div>

      {/* Fascia controlli bassa (ergonomia LIM) */}
      <div className="shrink-0 px-4 pb-2.5 pt-2 bg-[#4A2B18]/92 border-t-[3px] border-[#F3B63A] flex flex-wrap items-center justify-between gap-3 z-30">
        <button
          type="button"
          onClick={() => {
            playClick();
            setCluesOpen(true);
          }}
          className="btn-3d btn-3d-gold min-h-14 px-5 rounded-2xl font-bold text-lg md:text-xl flex items-center gap-2.5 cursor-pointer"
        >
          <BookOpen className="w-6 h-6" />
          <span>Leggi Indizi a Schermo Intero</span>
        </button>

        <div className="flex items-center gap-3 ml-auto">
          <span className="px-4 py-2 rounded-2xl bg-[#FFF9EC] border-[3px] border-[#3A2314] text-[#2B190E] font-display font-bold text-lg md:text-xl shadow-[0_3px_0_#2B170C]">
            Scelti: {selectedIds.length} / {targetCount}
          </span>

          <button
            type="button"
            onClick={handleReset}
            disabled={selectedIds.length === 0}
            className="btn-3d btn-3d-cream min-h-14 px-5 rounded-2xl font-bold text-lg md:text-xl flex items-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Azzera</span>
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            disabled={selectedIds.length !== targetCount}
            className="btn-3d btn-3d-green min-h-14 px-7 rounded-2xl font-bold text-xl md:text-2xl flex items-center gap-2 cursor-pointer"
          >
            <CheckCircle2 className="w-6 h-6" />
            <span>Conferma</span>
          </button>
        </div>
      </div>

      {/* Modale Indizi a Schermo Intero stile pergamena */}
      <AnimatePresence>
        {cluesOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#0F1B35]/78 backdrop-blur-[2px] flex items-center justify-center p-5 md:p-8"
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
              className="storybook-panel w-full max-w-4xl max-h-[90vh] rounded-[30px] p-6 md:p-8 flex flex-col gap-5"
            >
              <div className="flex items-center justify-between gap-4 border-b-2 border-[#D4B27D] pb-3">
                <h3 className="font-display text-2xl md:text-4xl font-bold text-[#3A2314]">
                  {config.promptTitle}
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    playClick();
                    setCluesOpen(false);
                  }}
                  className="btn-3d btn-3d-gold min-h-14 px-6 rounded-2xl font-bold text-xl flex items-center gap-2 cursor-pointer shrink-0"
                >
                  <X className="w-6 h-6" />
                  <span>Chiudi</span>
                </button>
              </div>

              <ol className="flex-1 overflow-y-auto space-y-3.5 pr-1">
                {config.clues.map((clue, idx) => (
                  <li
                    key={idx}
                    className="storybook-subcard rounded-2xl p-4 md:p-5 flex items-start gap-4"
                  >
                    <span className="w-12 h-12 shrink-0 rounded-full bg-[#FFD859] border-[3px] border-[#3A2314] text-[#3A2314] font-display font-bold text-2xl flex items-center justify-center shadow-[0_3px_0_#3A2314]">
                      {idx + 1}
                    </span>
                    <p className="text-2xl md:text-3xl font-extrabold text-[#2B190E] leading-snug pt-0.5">
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
