import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Hammer,
  RotateCcw,
  Search,
  Scissors,
  Wrench,
  X,
} from 'lucide-react';
import type {
  LogicBalanceConfig,
  LogicMatchingConfig,
  LogicOrderConfig,
  PuzzleEngineProps,
} from '../../types/game';
import { playClick, playGearTurn } from '../../audio/soundEngine';

type LogicConfig = LogicBalanceConfig | LogicMatchingConfig | LogicOrderConfig;

const PAIR_COLORS = [
  'bg-amber-400 text-slate-950 border-amber-200',
  'bg-sky-400 text-slate-950 border-sky-200',
  'bg-emerald-400 text-slate-950 border-emerald-200',
  'bg-fuchsia-400 text-slate-950 border-fuchsia-200',
];

function ToolIcon({ iconName, className = 'w-6 h-6' }: { iconName: string; className?: string }) {
  switch (iconName) {
    case 'search':
    case 'lente':
      return <Search className={className} />;
    case 'hammer':
    case 'martello':
      return <Hammer className={className} />;
    case 'scissors':
    case 'pinza':
      return <Scissors className={className} />;
    default:
      return <Wrench className={className} />;
  }
}

export function LogicBoard({ config, onSolve, onMistake }: PuzzleEngineProps<LogicConfig>) {
  if (config.mode === 'balance') {
    return <BalanceBoard config={config} onSolve={onSolve} onMistake={onMistake} />;
  }
  if (config.mode === 'matching') {
    return <MatchingBoard config={config} onSolve={onSolve} onMistake={onMistake} />;
  }
  return <OrderBoard config={config} onSolve={onSolve} onMistake={onMistake} />;
}

/* =========================================================
 * 1. BALANCE (Stazione 2)
 * ========================================================= */
function BalanceBoard({
  config,
  onSolve,
  onMistake,
}: PuzzleEngineProps<LogicBalanceConfig>) {
  const [selectedWeights, setSelectedWeights] = useState<number[]>([]);

  const currentSum = selectedWeights.reduce((acc, w) => acc + w, 0);
  const diff = currentSum - config.targetWeight;
  // Negativo = destra più leggera (bilancia inclinata a sinistra), positivo = destra più pesante
  const tiltDeg = Math.max(-16, Math.min(16, diff * 0.65));

  const toggleWeight = (w: number) => {
    playGearTurn();
    setSelectedWeights((prev) => {
      if (prev.includes(w)) {
        return prev.filter((item) => item !== w);
      }
      if (prev.length >= config.requiredCount) {
        return prev;
      }
      return [...prev, w];
    });
  };

  const handleConfirm = () => {
    if (selectedWeights.length !== config.requiredCount) {
      onMistake(`Devi scegliere esattamente ${config.requiredCount} pesi!`);
      return;
    }

    const hasOdd = selectedWeights.some((w) => w % 2 !== 0);
    if (currentSum === config.targetWeight && config.forbidOdd && hasOdd) {
      onMistake('42 kg esatti, ma hai usato pesi dispari! Rileggi la targhetta.');
      return;
    }

    if (currentSum !== config.targetWeight) {
      onMistake(
        `La somma attuale è ${currentSum} kg, ma servono esattamente ${config.targetWeight} kg!`
      );
      return;
    }

    const sortedSelected = [...selectedWeights].sort((a, b) => a - b);
    const sortedSolution = [...config.solutionSet].sort((a, b) => a - b);
    const isExact =
      sortedSelected.length === sortedSolution.length &&
      sortedSelected.every((v, idx) => v === sortedSolution[idx]);

    if (isExact) {
      onSolve();
    } else {
      onMistake('Controlla bene tutte le regole sulla targhetta!');
    }
  };

  return (
    <div className="relative z-20 w-full h-full flex flex-col justify-between p-3 md:p-5 gap-3">
      {/* Targhetta regola */}
      <div className="max-w-4xl mx-auto w-full rounded-2xl bg-slate-900/92 border-2 border-amber-400/90 px-5 py-3 text-center shadow-lg">
        <h2 className="text-xl md:text-2xl font-black text-amber-300">{config.promptTitle}</h2>
        <p className="text-lg md:text-xl font-bold text-amber-50 mt-1">{config.ruleText}</p>
      </div>

      {/* Bilancia SVG al centro */}
      <div className="flex-1 min-h-0 flex items-center justify-center">
        <div className="w-full max-w-2xl h-full max-h-[260px] flex items-center justify-center">
          <svg viewBox="0 0 520 220" className="w-full h-full overflow-visible">
            {/* Base e pilastro */}
            <rect x="210" y="190" width="100" height="20" rx="8" fill="#B45309" stroke="#FCD34D" strokeWidth="3" />
            <rect x="250" y="52" width="20" height="140" rx="6" fill="#D97706" stroke="#FCD34D" strokeWidth="3" />

            {/* Braccio oscillante */}
            <g
              style={{
                transformOrigin: '260px 62px',
                transform: `rotate(${tiltDeg}deg)`,
                transition: 'transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1)',
              }}
            >
              <rect x="70" y="54" width="380" height="16" rx="8" fill="#F59E0B" stroke="#FEF3C7" strokeWidth="3" />

              {/* Piatto sinistro (fisso 42 kg) */}
              <line x1="100" y1="70" x2="78" y2="128" stroke="#FCD34D" strokeWidth="3" />
              <line x1="100" y1="70" x2="122" y2="128" stroke="#FCD34D" strokeWidth="3" />
              <rect x="52" y="128" width="96" height="16" rx="8" fill="#D97706" stroke="#FEF3C7" strokeWidth="2" />
              <rect x="64" y="88" width="72" height="40" rx="8" fill="#1E293B" stroke="#F59E0B" strokeWidth="3" />
              <text x="100" y="115" textAnchor="middle" fill="#FEF3C7" fontSize="22" fontWeight="900">
                {config.targetWeight} kg
              </text>

              {/* Piatto destro (pesi scelti) */}
              <line x1="420" y1="70" x2="398" y2="128" stroke="#FCD34D" strokeWidth="3" />
              <line x1="420" y1="70" x2="442" y2="128" stroke="#FCD34D" strokeWidth="3" />
              <rect x="372" y="128" width="96" height="16" rx="8" fill="#D97706" stroke="#FEF3C7" strokeWidth="2" />
              <rect
                x="376"
                y="88"
                width="88"
                height="40"
                rx="8"
                fill={currentSum === config.targetWeight ? '#065F46' : '#0F172A'}
                stroke={currentSum === config.targetWeight ? '#34D399' : '#38BDF8'}
                strokeWidth="3"
              />
              <text x="420" y="115" textAnchor="middle" fill="#FFFFFF" fontSize="22" fontWeight="900">
                {currentSum} kg
              </text>
            </g>

            {/* Perno centrale */}
            <circle cx="260" cy="62" r="14" fill="#FEF3C7" stroke="#92400E" strokeWidth="4" />
          </svg>
        </div>
      </div>

      {/* Fascia bassa: 6 pesi + Azzera + Conferma */}
      <div className="shrink-0 max-w-5xl mx-auto w-full rounded-2xl bg-slate-900/92 border-2 border-amber-400/80 p-3 md:p-4 flex flex-col gap-3">
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
          {config.availableWeights.map((w) => {
            const isSelected = selectedWeights.includes(w);
            return (
              <button
                key={w}
                type="button"
                onClick={() => toggleWeight(w)}
                className={`min-h-16 rounded-2xl border-3 font-black text-2xl transition-transform active:scale-95 cursor-pointer ${
                  isSelected
                    ? 'bg-amber-400 text-slate-950 border-white shadow-lg'
                    : 'bg-slate-800 text-amber-50 border-amber-400/70'
                }`}
              >
                {w} kg
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="text-lg md:text-xl font-bold text-amber-100">
            Pesi scelti: {selectedWeights.length} / {config.requiredCount} (
            {selectedWeights.length > 0 ? selectedWeights.join(' + ') : 'nessuno'})
          </span>

          <div className="flex items-center gap-3 ml-auto">
            <button
              type="button"
              onClick={() => {
                playClick();
                setSelectedWeights([]);
              }}
              disabled={selectedWeights.length === 0}
              className="min-h-14 px-5 rounded-2xl bg-slate-800 border-2 border-amber-400/70 text-amber-100 font-bold text-xl flex items-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              <RotateCcw className="w-5 h-5" />
              <span>Azzera</span>
            </button>

            <button
              type="button"
              onClick={handleConfirm}
              disabled={selectedWeights.length !== config.requiredCount}
              className="min-h-14 px-8 rounded-2xl bg-emerald-400 text-slate-950 font-black text-xl md:text-2xl flex items-center gap-2 shadow-lg disabled:opacity-45 cursor-pointer"
            >
              <CheckCircle2 className="w-6 h-6" />
              <span>Conferma</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
 * 2. MATCHING (Stazione 6)
 * ========================================================= */
function MatchingBoard({
  config,
  onSolve,
  onMistake,
}: PuzzleEngineProps<LogicMatchingConfig>) {
  const [activeLeftId, setActiveLeftId] = useState<string | null>(null);
  const [pairs, setPairs] = useState<Record<string, string>>({});
  const [cluesOpen, setCluesOpen] = useState(false);

  const handleRightTap = (rightId: string) => {
    playClick();
    if (!activeLeftId) return;

    setPairs((prev) => {
      const next = { ...prev };
      // Rimuovi eventuale precedente associazione allo stesso strumento
      for (const [k, v] of Object.entries(next)) {
        if (v === rightId) delete next[k];
      }
      next[activeLeftId] = rightId;
      return next;
    });
    setActiveLeftId(null);
  };

  const pairedCount = Object.keys(pairs).length;
  const totalCount = config.leftItems.length;

  const handleConfirm = () => {
    if (pairedCount !== totalCount) return;
    const isAllCorrect = Object.entries(config.solutionMap).every(
      ([leftId, expectedRight]) => pairs[leftId] === expectedRight
    );
    if (isAllCorrect) {
      onSolve();
    } else {
      onMistake('Qualche apprendista ha lo strumento sbagliato! Rileggi i 4 indizi.');
    }
  };

  return (
    <div className="relative z-20 w-full h-full flex flex-col justify-between p-3 md:p-4 gap-3">
      <div className="max-w-5xl mx-auto w-full rounded-2xl bg-slate-900/92 border-2 border-amber-400/90 px-5 py-2.5 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl md:text-2xl font-black text-amber-300">{config.promptTitle}</h2>
        <button
          type="button"
          onClick={() => {
            playClick();
            setCluesOpen(true);
          }}
          className="min-h-12 px-4 rounded-xl bg-amber-400 text-slate-950 font-black text-lg flex items-center gap-2 cursor-pointer"
        >
          <BookOpen className="w-5 h-5" />
          <span>Leggi Indizi</span>
        </button>
      </div>

      {/* Griglia Apprendisti <-> Strumenti */}
      <div className="flex-1 min-h-0 max-w-5xl mx-auto w-full grid grid-cols-2 gap-4 md:gap-8 items-center">
        {/* Colonna sinistra: Apprendisti */}
        <div className="space-y-2.5">
          {config.leftItems.map((left, idx) => {
            const isSelected = activeLeftId === left.id;
            const pairedRightId = pairs[left.id];
            const colorClass = PAIR_COLORS[idx % PAIR_COLORS.length];

            return (
              <button
                key={left.id}
                type="button"
                onClick={() => {
                  playClick();
                  setActiveLeftId(isSelected ? null : left.id);
                }}
                className={`w-full min-h-14 md:min-h-16 px-4 rounded-2xl border-3 font-black text-xl md:text-2xl flex items-center justify-between gap-2 transition-transform active:scale-95 cursor-pointer ${
                  isSelected
                    ? 'bg-amber-400 text-slate-950 border-white ring-4 ring-amber-300/60'
                    : pairedRightId
                    ? colorClass
                    : 'bg-slate-900/92 text-amber-50 border-amber-400/70'
                }`}
              >
                <span>{left.label}</span>
                {pairedRightId && (
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-950/85 text-white text-sm font-bold">
                    #{idx + 1}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Colonna destra: Strumenti */}
        <div className="space-y-2.5">
          {config.rightItems.map((right) => {
            const ownerEntry = Object.entries(pairs).find(([, rId]) => rId === right.id);
            const ownerIdx = ownerEntry
              ? config.leftItems.findIndex((l) => l.id === ownerEntry[0])
              : -1;
            const colorClass = ownerIdx >= 0 ? PAIR_COLORS[ownerIdx % PAIR_COLORS.length] : '';

            return (
              <button
                key={right.id}
                type="button"
                onClick={() => handleRightTap(right.id)}
                className={`w-full min-h-14 md:min-h-16 px-4 rounded-2xl border-3 font-black text-xl md:text-2xl flex items-center justify-between gap-2 transition-transform active:scale-95 cursor-pointer ${
                  ownerIdx >= 0
                    ? colorClass
                    : activeLeftId
                    ? 'bg-slate-800 text-white border-sky-400'
                    : 'bg-slate-900/92 text-amber-50 border-amber-400/70'
                }`}
              >
                <span className="flex items-center gap-3">
                  <ToolIcon iconName={right.iconName} className="w-7 h-7 shrink-0" />
                  <span>{right.label}</span>
                </span>
                {ownerIdx >= 0 && (
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-950/85 text-white text-sm font-bold">
                    {config.leftItems[ownerIdx].label}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Controlli in fascia bassa */}
      <div className="shrink-0 max-w-5xl mx-auto w-full flex flex-wrap items-center justify-between gap-3">
        <p className="text-lg md:text-xl font-bold text-amber-100 bg-slate-900/90 border border-amber-400/60 rounded-xl px-4 py-2">
          {activeLeftId
            ? 'Ora tocca lo strumento da assegnare!'
            : `Tocca un apprendista, poi il suo strumento (${pairedCount}/${totalCount})`}
        </p>

        <div className="flex items-center gap-3 ml-auto">
          <button
            type="button"
            onClick={() => {
              playClick();
              setPairs({});
              setActiveLeftId(null);
            }}
            disabled={pairedCount === 0}
            className="min-h-14 px-5 rounded-2xl bg-slate-800 border-2 border-amber-400/70 text-amber-100 font-bold text-xl flex items-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Azzera</span>
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            disabled={pairedCount !== totalCount}
            className="min-h-14 px-8 rounded-2xl bg-emerald-400 text-slate-950 font-black text-xl md:text-2xl flex items-center gap-2 shadow-lg disabled:opacity-45 cursor-pointer"
          >
            <CheckCircle2 className="w-6 h-6" />
            <span>Conferma</span>
          </button>
        </div>
      </div>

      {/* Modale Indizi */}
      <AnimatePresence>
        {cluesOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/92 flex items-center justify-center p-5"
            onClick={() => setCluesOpen(false)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-4xl rounded-3xl bg-slate-900 border-4 border-amber-400 p-6 md:p-8 space-y-5"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-2xl md:text-3xl font-black text-amber-300">
                  Indizi degli Apprendisti
                </h3>
                <button
                  type="button"
                  onClick={() => setCluesOpen(false)}
                  className="min-h-14 px-6 rounded-2xl bg-amber-400 text-slate-950 font-black text-xl flex items-center gap-2 cursor-pointer"
                >
                  <X className="w-6 h-6" />
                  <span>Chiudi</span>
                </button>
              </div>
              <ol className="space-y-3">
                {config.clues.map((c, idx) => (
                  <li
                    key={idx}
                    className="rounded-2xl bg-slate-950 border-2 border-amber-400/70 p-4 text-xl md:text-2xl font-bold text-amber-50 flex items-start gap-4"
                  >
                    <span className="w-10 h-10 shrink-0 rounded-full bg-amber-400 text-slate-950 font-black flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span>{c}</span>
                  </li>
                ))}
              </ol>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* =========================================================
 * 3. ORDER (Stazione 10)
 * ========================================================= */
function OrderBoard({ config, onSolve, onMistake }: PuzzleEngineProps<LogicOrderConfig>) {
  const [orderIds, setOrderIds] = useState<string[]>(() => config.items.map((i) => i.id));
  const [swapSourceIdx, setSwapSourceIdx] = useState<number | null>(null);

  const moveItem = (fromIdx: number, toIdx: number) => {
    if (toIdx < 0 || toIdx >= orderIds.length) return;
    playGearTurn();
    setOrderIds((prev) => {
      const next = [...prev];
      const temp = next[fromIdx];
      next[fromIdx] = next[toIdx];
      next[toIdx] = temp;
      return next;
    });
    setSwapSourceIdx(null);
  };

  const handleCardTap = (idx: number) => {
    playClick();
    if (swapSourceIdx === null) {
      setSwapSourceIdx(idx);
    } else if (swapSourceIdx === idx) {
      setSwapSourceIdx(null);
    } else {
      moveItem(swapSourceIdx, idx);
    }
  };

  const handleConfirm = () => {
    const isExact = config.solutionOrder.every((id, idx) => orderIds[idx] === id);
    if (isExact) {
      onSolve();
    } else {
      onMistake('L’ordine dei tubi non è ancora dal tempo più breve al più lungo! Riprova.');
    }
  };

  return (
    <div className="relative z-20 w-full h-full flex flex-col justify-between p-3 md:p-5 gap-3">
      <div className="max-w-4xl mx-auto w-full rounded-2xl bg-slate-900/92 border-2 border-amber-400/90 px-5 py-3 text-center">
        <h2 className="text-xl md:text-2xl font-black text-amber-300">{config.promptTitle}</h2>
        <p className="text-lg md:text-xl font-bold text-amber-50 mt-1">{config.ruleText}</p>
      </div>

      {/* 4 Tubi Sonori */}
      <div className="flex-1 min-h-0 max-w-5xl mx-auto w-full grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 items-stretch">
        {orderIds.map((id, idx) => {
          const item = config.items.find((i) => i.id === id);
          if (!item) return null;
          const isSwapSelected = swapSourceIdx === idx;

          return (
            <div
              key={item.id}
              className={`rounded-3xl border-4 p-3 md:p-4 flex flex-col justify-between items-center text-center shadow-xl transition-transform ${
                isSwapSelected
                  ? 'border-white ring-4 ring-amber-300 scale-[1.02]'
                  : 'border-amber-400/80'
              } ${item.colorClass}`}
            >
              <span className="w-10 h-10 rounded-full bg-slate-950/90 text-amber-300 font-black text-xl flex items-center justify-center border-2 border-amber-300">
                {idx + 1}°
              </span>

              <button
                type="button"
                onClick={() => handleCardTap(idx)}
                className="flex-1 w-full flex flex-col items-center justify-center gap-2 py-2 cursor-pointer"
              >
                <span className="text-2xl font-black text-white drop-shadow">{item.label}</span>
                <span className="px-3 py-1.5 rounded-xl bg-slate-950/85 text-amber-100 font-extrabold text-xl md:text-2xl">
                  {item.timeExpression}
                </span>
              </button>

              <div className="flex items-center gap-2 w-full justify-center">
                <button
                  type="button"
                  disabled={idx === 0}
                  onClick={() => moveItem(idx, idx - 1)}
                  className="min-h-14 min-w-14 flex-1 rounded-xl bg-slate-950/90 border-2 border-amber-300/80 text-white flex items-center justify-center disabled:opacity-35 active:scale-95 cursor-pointer"
                  aria-label={`Sposta ${item.label} a sinistra`}
                >
                  <ArrowLeft className="w-6 h-6" />
                </button>
                <button
                  type="button"
                  disabled={idx === orderIds.length - 1}
                  onClick={() => moveItem(idx, idx + 1)}
                  className="min-h-14 min-w-14 flex-1 rounded-xl bg-slate-950/90 border-2 border-amber-300/80 text-white flex items-center justify-center disabled:opacity-35 active:scale-95 cursor-pointer"
                  aria-label={`Sposta ${item.label} a destra`}
                >
                  <ArrowRight className="w-6 h-6" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Conferma in basso */}
      <div className="shrink-0 max-w-5xl mx-auto w-full flex items-center justify-between gap-3">
        <span className="text-lg md:text-xl font-bold text-amber-100 bg-slate-900/90 border border-amber-400/60 rounded-xl px-4 py-2">
          Più BREVE a sinistra → Più LUNGO a destra
        </span>

        <button
          type="button"
          onClick={handleConfirm}
          className="min-h-14 px-9 rounded-2xl bg-emerald-400 text-slate-950 font-black text-xl md:text-2xl flex items-center gap-2 shadow-lg active:scale-95 cursor-pointer"
        >
          <CheckCircle2 className="w-6 h-6" />
          <span>Conferma Ordine</span>
        </button>
      </div>
    </div>
  );
}
