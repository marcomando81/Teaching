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
  'bg-[#FFE47A] text-[#2B190E] border-[#3A2314] shadow-[0_4px_0_#9A5B0A]',
  'bg-[#93E2FF] text-[#0A2E47] border-[#3A2314] shadow-[0_4px_0_#0E6091]',
  'bg-[#8EF0B3] text-[#0D351C] border-[#3A2314] shadow-[0_4px_0_#146334]',
  'bg-[#F9B8E8] text-[#4A123E] border-[#3A2314] shadow-[0_4px_0_#86196A]',
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

  const isBalanced = currentSum === config.targetWeight;

  return (
    <div className="relative z-20 w-full h-full flex flex-col justify-between p-3 md:p-4 gap-2.5">
      {/* Targhetta regola su pergamena */}
      <div className="storybook-panel max-w-4xl mx-auto w-full rounded-2xl px-5 py-2.5 text-center">
        <h2 className="font-display text-xl md:text-2xl font-bold text-[#3A2314]">
          {config.promptTitle}
        </h2>
        <p className="text-base md:text-xl font-extrabold text-[#63422B] mt-0.5">
          {config.ruleText}
        </p>
      </div>

      {/* Bilancia SVG illustrata al centro */}
      <div className="flex-1 min-h-0 flex items-center justify-center">
        <div className="storybook-panel rounded-3xl px-6 py-2 w-full max-w-2xl h-full max-h-[245px] flex items-center justify-center">
          <svg viewBox="0 0 520 220" className="w-full h-full overflow-visible">
            {/* Base e pilastro in legno caldo e ottone */}
            <rect
              x="196"
              y="186"
              width="128"
              height="24"
              rx="10"
              fill="#7D4C2D"
              stroke="#3A2314"
              strokeWidth="4"
            />
            <rect
              x="248"
              y="52"
              width="24"
              height="138"
              rx="8"
              fill="#E59E28"
              stroke="#3A2314"
              strokeWidth="4"
            />

            {/* Braccio oscillante */}
            <g
              style={{
                transformOrigin: '260px 62px',
                transform: `rotate(${tiltDeg}deg)`,
                transition: 'transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1)',
              }}
            >
              <rect
                x="66"
                y="53"
                width="388"
                height="18"
                rx="9"
                fill="#FFD859"
                stroke="#3A2314"
                strokeWidth="4"
              />

              {/* Piatto sinistro (fisso 42 kg) */}
              <line x1="100" y1="71" x2="76" y2="128" stroke="#3A2314" strokeWidth="3.5" />
              <line x1="100" y1="71" x2="124" y2="128" stroke="#3A2314" strokeWidth="3.5" />
              <rect
                x="48"
                y="128"
                width="104"
                height="18"
                rx="9"
                fill="#D9772B"
                stroke="#3A2314"
                strokeWidth="3.5"
              />
              <rect
                x="60"
                y="84"
                width="80"
                height="44"
                rx="12"
                fill="#FFF4CC"
                stroke="#3A2314"
                strokeWidth="3.5"
              />
              <text
                x="100"
                y="113"
                textAnchor="middle"
                fill="#2B190E"
                fontSize="23"
                fontWeight="900"
                fontFamily="Fredoka, sans-serif"
              >
                {config.targetWeight} kg
              </text>

              {/* Piatto destro (pesi scelti) */}
              <line x1="420" y1="71" x2="396" y2="128" stroke="#3A2314" strokeWidth="3.5" />
              <line x1="420" y1="71" x2="444" y2="128" stroke="#3A2314" strokeWidth="3.5" />
              <rect
                x="368"
                y="128"
                width="104"
                height="18"
                rx="9"
                fill="#D9772B"
                stroke="#3A2314"
                strokeWidth="3.5"
              />
              <rect
                x="372"
                y="84"
                width="96"
                height="44"
                rx="12"
                fill={isBalanced ? '#8EF0B3' : '#BAE6FD'}
                stroke={isBalanced ? '#14532D' : '#3A2314'}
                strokeWidth="3.5"
              />
              <text
                x="420"
                y="113"
                textAnchor="middle"
                fill={isBalanced ? '#0D351C' : '#0A2E47'}
                fontSize="23"
                fontWeight="900"
                fontFamily="Fredoka, sans-serif"
              >
                {currentSum} kg
              </text>
            </g>

            {/* Perno centrale */}
            <circle cx="260" cy="62" r="15" fill="#FFF9EC" stroke="#3A2314" strokeWidth="4" />
            <circle cx="260" cy="62" r="6" fill="#E04248" />
          </svg>
        </div>
      </div>

      {/* Fascia bassa: 6 pesi + Azzera + Conferma */}
      <div className="storybook-panel shrink-0 max-w-5xl mx-auto w-full rounded-3xl p-3 md:p-4 flex flex-col gap-3">
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
          {config.availableWeights.map((w) => {
            const isSelected = selectedWeights.includes(w);
            return (
              <button
                key={w}
                type="button"
                onClick={() => toggleWeight(w)}
                className={`btn-3d min-h-14 md:min-h-16 rounded-2xl font-bold text-2xl cursor-pointer ${
                  isSelected ? 'btn-3d-gold ring-3 ring-[#F5B21B]/60' : 'btn-3d-cream'
                }`}
              >
                {w} kg
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="storybook-subcard px-4 py-2 rounded-xl text-base md:text-xl font-extrabold text-[#2B190E]">
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
              className="btn-3d btn-3d-cream min-h-14 px-5 rounded-2xl font-bold text-xl flex items-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-5 h-5" />
              <span>Azzera</span>
            </button>

            <button
              type="button"
              onClick={handleConfirm}
              disabled={selectedWeights.length !== config.requiredCount}
              className="btn-3d btn-3d-green min-h-14 px-8 rounded-2xl font-bold text-xl md:text-2xl flex items-center gap-2 cursor-pointer"
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
      <div className="storybook-panel max-w-5xl mx-auto w-full rounded-2xl px-5 py-2.5 flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-xl md:text-2xl font-bold text-[#3A2314]">
          {config.promptTitle}
        </h2>
        <button
          type="button"
          onClick={() => {
            playClick();
            setCluesOpen(true);
          }}
          className="btn-3d btn-3d-gold min-h-12 px-5 rounded-2xl font-bold text-lg flex items-center gap-2 cursor-pointer"
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
                className={`w-full min-h-14 md:min-h-16 px-4 rounded-2xl border-[3px] font-display font-bold text-xl md:text-2xl flex items-center justify-between gap-2 transition-transform active:translate-y-0.5 cursor-pointer ${
                  isSelected
                    ? 'bg-[#FFD859] text-[#3A2314] border-[#3A2314] ring-4 ring-[#FFF3B0] shadow-[0_5px_0_#9A5B0A]'
                    : pairedRightId
                    ? colorClass
                    : 'btn-3d btn-3d-cream'
                }`}
              >
                <span>{left.label}</span>
                {pairedRightId && (
                  <span className="px-3 py-0.5 rounded-full bg-[#3A2314] text-[#FFE169] text-sm font-bold">
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
                className={`w-full min-h-14 md:min-h-16 px-4 rounded-2xl border-[3px] font-display font-bold text-xl md:text-2xl flex items-center justify-between gap-2 transition-transform active:translate-y-0.5 cursor-pointer ${
                  ownerIdx >= 0
                    ? colorClass
                    : activeLeftId
                    ? 'bg-[#E0F2FE] text-[#0A2E47] border-[#0E6091] shadow-[0_4px_0_#0E6091]'
                    : 'btn-3d btn-3d-cream'
                }`}
              >
                <span className="flex items-center gap-3">
                  <ToolIcon iconName={right.iconName} className="w-7 h-7 shrink-0" />
                  <span>{right.label}</span>
                </span>
                {ownerIdx >= 0 && (
                  <span className="px-3 py-0.5 rounded-full bg-[#3A2314] text-[#FFE169] text-sm font-bold">
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
        <p className="storybook-panel rounded-2xl px-4 py-2 text-base md:text-xl font-extrabold text-[#2B190E]">
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
            className="btn-3d btn-3d-cream min-h-14 px-5 rounded-2xl font-bold text-xl flex items-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Azzera</span>
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            disabled={pairedCount !== totalCount}
            className="btn-3d btn-3d-green min-h-14 px-8 rounded-2xl font-bold text-xl md:text-2xl flex items-center gap-2 cursor-pointer"
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
            className="fixed inset-0 z-50 bg-[#0F1B35]/78 backdrop-blur-[2px] flex items-center justify-center p-5"
            onClick={() => setCluesOpen(false)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="storybook-panel w-full max-w-4xl rounded-[30px] p-6 md:p-8 space-y-5"
            >
              <div className="flex items-center justify-between border-b-2 border-[#D4B27D] pb-3">
                <h3 className="font-display text-2xl md:text-3xl font-bold text-[#3A2314]">
                  Indizi degli Apprendisti
                </h3>
                <button
                  type="button"
                  onClick={() => setCluesOpen(false)}
                  className="btn-3d btn-3d-gold min-h-14 px-6 rounded-2xl font-bold text-xl flex items-center gap-2 cursor-pointer"
                >
                  <X className="w-6 h-6" />
                  <span>Chiudi</span>
                </button>
              </div>
              <ol className="space-y-3">
                {config.clues.map((c, idx) => (
                  <li
                    key={idx}
                    className="storybook-subcard rounded-2xl p-4 text-xl md:text-2xl font-extrabold text-[#2B190E] flex items-start gap-4"
                  >
                    <span className="w-10 h-10 shrink-0 rounded-full bg-[#FFD859] border-[3px] border-[#3A2314] text-[#3A2314] font-display font-bold flex items-center justify-center shadow-[0_2px_0_#3A2314]">
                      {idx + 1}
                    </span>
                    <span className="pt-0.5">{c}</span>
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
    <div className="relative z-20 w-full h-full flex flex-col justify-between p-3 md:p-4 gap-3">
      <div className="storybook-panel max-w-4xl mx-auto w-full rounded-2xl px-5 py-2.5 text-center">
        <h2 className="font-display text-xl md:text-2xl font-bold text-[#3A2314]">
          {config.promptTitle}
        </h2>
        <p className="text-base md:text-xl font-extrabold text-[#63422B] mt-0.5">
          {config.ruleText}
        </p>
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
              className={`rounded-3xl border-[4px] border-[#3A2314] p-3 md:p-4 flex flex-col justify-between items-center text-center shadow-[0_6px_0_rgba(58,35,20,0.45)] transition-transform ${
                isSwapSelected ? 'ring-4 ring-[#FFE169] scale-[1.03]' : ''
              } ${item.colorClass}`}
            >
              <span className="w-11 h-11 rounded-full bg-[#FFF9EC] text-[#3A2314] font-display font-bold text-xl flex items-center justify-center border-[3px] border-[#3A2314] shadow-[0_3px_0_#3A2314]">
                {idx + 1}°
              </span>

              <button
                type="button"
                onClick={() => handleCardTap(idx)}
                className="flex-1 w-full flex flex-col items-center justify-center gap-2.5 py-2 cursor-pointer"
              >
                <span className="font-display text-2xl font-bold text-white drop-shadow-[0_2px_0_#3A2314]">
                  {item.label}
                </span>
                <span className="px-3.5 py-2 rounded-2xl bg-[#FFF9EC] border-[3px] border-[#3A2314] text-[#2B190E] font-extrabold text-xl md:text-2xl shadow-[0_3px_0_rgba(58,35,20,0.3)]">
                  {item.timeExpression}
                </span>
              </button>

              <div className="flex items-center gap-2 w-full justify-center">
                <button
                  type="button"
                  disabled={idx === 0}
                  onClick={() => moveItem(idx, idx - 1)}
                  className="btn-3d btn-3d-cream min-h-13 min-w-12 flex-1 rounded-xl flex items-center justify-center cursor-pointer"
                  aria-label={`Sposta ${item.label} a sinistra`}
                >
                  <ArrowLeft className="w-6 h-6" />
                </button>
                <button
                  type="button"
                  disabled={idx === orderIds.length - 1}
                  onClick={() => moveItem(idx, idx + 1)}
                  className="btn-3d btn-3d-cream min-h-13 min-w-12 flex-1 rounded-xl flex items-center justify-center cursor-pointer"
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
      <div className="shrink-0 max-w-5xl mx-auto w-full flex flex-wrap items-center justify-between gap-3">
        <span className="storybook-panel rounded-2xl px-4 py-2 text-base md:text-xl font-extrabold text-[#2B190E]">
          Più BREVE a sinistra → Più LUNGO a destra
        </span>

        <button
          type="button"
          onClick={handleConfirm}
          className="btn-3d btn-3d-green min-h-14 px-9 rounded-2xl font-bold text-xl md:text-2xl flex items-center gap-2 cursor-pointer ml-auto"
        >
          <CheckCircle2 className="w-6 h-6" />
          <span>Conferma Ordine</span>
        </button>
      </div>
    </div>
  );
}
