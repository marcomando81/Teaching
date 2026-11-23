import { useState } from 'react';
import { motion } from 'motion/react';
import {
  Anchor,
  ArrowRight,
  Bird,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Cog,
  Crown,
  Delete,
  RotateCcw,
  Wrench,
  Zap,
} from 'lucide-react';
import type {
  PuzzleEngineProps,
  VaultClockConfig,
  VaultDialsConfig,
  VaultFinaleConfig,
  VaultKeypadConfig,
} from '../../types/game';
import { SafeImage } from '../ui/SafeImage';
import { playClick, playGearTurn, playSuccess, playTowerChime } from '../../audio/soundEngine';

type VaultConfig =
  | VaultKeypadConfig
  | VaultDialsConfig
  | VaultClockConfig
  | VaultFinaleConfig;

function DialSymbolIcon({ iconName, className = 'w-10 h-10' }: { iconName: string; className?: string }) {
  switch (iconName) {
    case 'wrench':
    case 'chiave_inglese':
      return <Wrench className={className} />;
    case 'zap':
    case 'fulmine':
      return <Zap className={className} />;
    case 'cog':
    case 'ingranaggio':
      return <Cog className={className} />;
    case 'bird':
    case 'gufo':
      return <Bird className={className} />;
    case 'anchor':
    case 'ancora':
      return <Anchor className={className} />;
    default:
      return <Crown className={className} />;
  }
}

export function VaultLock({ config, onSolve, onMistake }: PuzzleEngineProps<VaultConfig>) {
  if (config.mode === 'keypad') {
    return <KeypadVault config={config} onSolve={onSolve} onMistake={onMistake} />;
  }
  if (config.mode === 'dials') {
    return <DialsVault config={config} onSolve={onSolve} onMistake={onMistake} />;
  }
  if (config.mode === 'clock') {
    return <ClockVault config={config} onSolve={onSolve} onMistake={onMistake} />;
  }
  return <FinaleVault config={config} onSolve={onSolve} onMistake={onMistake} />;
}

/* =========================================================
 * 1. KEYPAD (Stazione 4)
 * ========================================================= */
function KeypadVault({
  config,
  onSolve,
  onMistake,
}: PuzzleEngineProps<VaultKeypadConfig>) {
  const [code, setCode] = useState('');

  const pressDigit = (d: string) => {
    playClick();
    if (code.length < config.codeLength) {
      setCode((prev) => prev + d);
    }
  };

  const handleConfirm = () => {
    if (code.length !== config.codeLength) return;
    if (code === config.solutionCode) {
      onSolve();
    } else {
      onMistake('Codice errato! Controlla i frammenti nello zaino e l’ordine sulla teca.');
      setCode('');
    }
  };

  return (
    <div className="relative z-20 w-full h-full flex flex-col justify-between p-3 md:p-5 gap-3 max-w-5xl mx-auto">
      <div className="rounded-2xl bg-slate-900/92 border-2 border-amber-400/90 px-5 py-3 text-center">
        <h2 className="text-xl md:text-2xl font-black text-amber-300">{config.promptTitle}</h2>
      </div>

      <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* Incisione sulla teca */}
        <div className="md:col-span-6 rounded-3xl bg-slate-900/92 border-2 border-amber-400/80 p-5 space-y-3">
          <h3 className="text-xl font-extrabold text-amber-300 border-b border-amber-400/40 pb-2">
            Incisione sulla Teca:
          </h3>
          <ul className="space-y-2.5 text-xl md:text-2xl font-bold text-amber-50">
            {config.ruleLines.map((line, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-amber-300 font-black">•</span>
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Display codice + tastierino 0-9 */}
        <div className="md:col-span-6 rounded-3xl bg-slate-900/92 border-2 border-amber-400/80 p-4 flex flex-col items-center gap-3">
          <div className="flex items-center gap-3">
            {Array.from({ length: config.codeLength }, (_, idx) => (
              <div
                key={idx}
                className="w-14 h-16 md:w-16 md:h-18 rounded-2xl bg-slate-950 border-3 border-amber-400 text-amber-300 font-black text-3xl md:text-4xl flex items-center justify-center shadow-inner"
              >
                {code[idx] ?? '–'}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-2 w-full max-w-xs">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => pressDigit(d)}
                className="min-h-14 rounded-2xl bg-slate-800 border-2 border-amber-400/70 text-white font-black text-2xl active:scale-95 cursor-pointer"
              >
                {d}
              </button>
            ))}
            <button
              type="button"
              onClick={() => {
                playClick();
                setCode('');
              }}
              className="min-h-14 rounded-2xl bg-slate-800 border-2 border-rose-400/70 text-rose-200 font-black text-xl active:scale-95 cursor-pointer"
            >
              C
            </button>
            <button
              type="button"
              onClick={() => pressDigit('0')}
              className="min-h-14 rounded-2xl bg-slate-800 border-2 border-amber-400/70 text-white font-black text-2xl active:scale-95 cursor-pointer"
            >
              0
            </button>
            <button
              type="button"
              onClick={() => {
                playClick();
                setCode((prev) => prev.slice(0, -1));
              }}
              className="min-h-14 rounded-2xl bg-slate-800 border-2 border-amber-400/70 text-amber-200 flex items-center justify-center active:scale-95 cursor-pointer"
              aria-label="Cancella cifra"
            >
              <Delete className="w-7 h-7" />
            </button>
          </div>

          <button
            type="button"
            disabled={code.length !== config.codeLength}
            onClick={handleConfirm}
            className="w-full max-w-xs min-h-14 rounded-2xl bg-emerald-400 text-slate-950 font-black text-2xl flex items-center justify-center gap-2 shadow-lg disabled:opacity-45 active:scale-95 cursor-pointer"
          >
            <CheckCircle2 className="w-6 h-6" />
            <span>Apri Teca</span>
          </button>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
 * 2. DIALS (Stazione 8)
 * ========================================================= */
function DialsVault({
  config,
  onSolve,
  onMistake,
}: PuzzleEngineProps<VaultDialsConfig>) {
  const [dialIndices, setDialIndices] = useState<number[]>(() =>
    config.solutionDials.map(() => 0)
  );

  const rotateDial = (dialIdx: number, delta: number) => {
    playGearTurn();
    setDialIndices((prev) => {
      const next = [...prev];
      const len = config.symbols.length;
      next[dialIdx] = (next[dialIdx] + delta + len) % len;
      return next;
    });
  };

  const handleConfirm = () => {
    const selectedIds = dialIndices.map((idx) => config.symbols[idx].id);
    const isExact = config.solutionDials.every((id, idx) => selectedIds[idx] === id);
    if (isExact) {
      onSolve();
    } else {
      onMistake('I simboli sulle rotelle non aprono la cassaforte! Controlla lo zaino.');
    }
  };

  return (
    <div className="relative z-20 w-full h-full flex flex-col justify-between p-3 md:p-5 gap-3 max-w-5xl mx-auto">
      <div className="rounded-2xl bg-slate-900/92 border-2 border-amber-400/90 px-5 py-3 text-center">
        <h2 className="text-xl md:text-2xl font-black text-amber-300">{config.promptTitle}</h2>
        <p className="text-lg md:text-xl font-bold text-amber-50 mt-1">{config.ruleText}</p>
      </div>

      {/* 4 Rotelle */}
      <div className="flex-1 min-h-0 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 items-center">
        {dialIndices.map((symIdx, dialIdx) => {
          const sym = config.symbols[symIdx];
          return (
            <div
              key={dialIdx}
              className="rounded-3xl bg-slate-900/92 border-3 border-amber-400/85 p-3 flex flex-col items-center justify-between gap-2.5 shadow-xl"
            >
              <span className="text-lg font-black text-amber-300">Rotella {dialIdx + 1}</span>

              <button
                type="button"
                onClick={() => rotateDial(dialIdx, -1)}
                className="w-full min-h-14 rounded-2xl bg-slate-800 border-2 border-amber-400/70 text-amber-200 flex items-center justify-center active:scale-95 cursor-pointer"
                aria-label={`Rotella ${dialIdx + 1} precedente`}
              >
                <ChevronUp className="w-8 h-8" />
              </button>

              <motion.div
                key={`${dialIdx}-${sym.id}`}
                initial={{ scale: 0.75, opacity: 0.4 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 320, damping: 20 }}
                className="w-full py-3 rounded-2xl bg-slate-950 border-2 border-sky-400/70 flex flex-col items-center gap-1.5 text-amber-200"
              >
                <DialSymbolIcon iconName={sym.iconName} className="w-11 h-11 text-amber-300" />
                <span className="text-lg font-extrabold text-white text-center px-1">
                  {sym.label}
                </span>
              </motion.div>

              <button
                type="button"
                onClick={() => rotateDial(dialIdx, 1)}
                className="w-full min-h-14 rounded-2xl bg-slate-800 border-2 border-amber-400/70 text-amber-200 flex items-center justify-center active:scale-95 cursor-pointer"
                aria-label={`Rotella ${dialIdx + 1} successivo`}
              >
                <ChevronDown className="w-8 h-8" />
              </button>
            </div>
          );
        })}
      </div>

      <div className="shrink-0 flex justify-end">
        <button
          type="button"
          onClick={handleConfirm}
          className="min-h-14 px-9 rounded-2xl bg-emerald-400 text-slate-950 font-black text-2xl flex items-center gap-2 shadow-lg active:scale-95 cursor-pointer"
        >
          <CheckCircle2 className="w-6 h-6" />
          <span>Apri Cassaforte</span>
        </button>
      </div>
    </div>
  );
}

/* =========================================================
 * QUADRANTE OROLOGIO SVG RIUSABILE (Stazioni 12 e 13B)
 * ========================================================= */
function InteractiveClockFace({
  hour,
  minute,
  showDigital,
}: {
  hour: number;
  minute: number;
  showDigital: boolean;
}) {
  const hourAngle = ((hour % 12) + minute / 60) * 30;
  const minuteAngle = minute * 6;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="w-52 h-52 md:w-60 md:h-60">
        <svg viewBox="0 0 240 240" className="w-full h-full drop-shadow-2xl">
          <circle cx="120" cy="120" r="114" fill="#0F172A" stroke="#F59E0B" strokeWidth="8" />
          <circle cx="120" cy="120" r="102" fill="#1E293B" stroke="#FDE68A" strokeWidth="2" />

          {Array.from({ length: 12 }, (_, idx) => {
            const num = idx + 1;
            const angle = (num * 30 - 90) * (Math.PI / 180);
            const x = 120 + Math.cos(angle) * 82;
            const y = 120 + Math.sin(angle) * 82;
            return (
              <text
                key={num}
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="central"
                fill="#FEF3C7"
                fontSize="18"
                fontWeight="900"
              >
                {num}
              </text>
            );
          })}

          {/* Lancetta delle ore */}
          <g
            style={{
              transformOrigin: '120px 120px',
              transform: `rotate(${hourAngle}deg)`,
              transition: 'transform 0.25s ease-out',
            }}
          >
            <line
              x1="120"
              y1="120"
              x2="120"
              y2="64"
              stroke="#F59E0B"
              strokeWidth="8"
              strokeLinecap="round"
            />
          </g>

          {/* Lancetta dei minuti */}
          <g
            style={{
              transformOrigin: '120px 120px',
              transform: `rotate(${minuteAngle}deg)`,
              transition: 'transform 0.25s ease-out',
            }}
          >
            <line
              x1="120"
              y1="120"
              x2="120"
              y2="42"
              stroke="#38BDF8"
              strokeWidth="5"
              strokeLinecap="round"
            />
          </g>

          <circle cx="120" cy="120" r="9" fill="#FEF3C7" stroke="#92400E" strokeWidth="3" />
        </svg>
      </div>

      {showDigital && (
        <div className="px-5 py-1.5 rounded-xl bg-slate-950 border-2 border-amber-400 text-amber-300 font-black text-3xl tracking-widest">
          {String(hour).padStart(2, '0')}:{String(minute).padStart(2, '0')}
        </div>
      )}
    </div>
  );
}

/* =========================================================
 * 3. CLOCK (Stazione 12)
 * ========================================================= */
function ClockVault({
  config,
  onSolve,
  onMistake,
}: PuzzleEngineProps<VaultClockConfig>) {
  const [hour, setHour] = useState(config.initialHour);
  const [minute, setMinute] = useState(config.initialMinute);

  const adjustHour = (delta: number) => {
    playGearTurn();
    setHour((prev) => {
      const next = ((prev - 1 + delta) % 12 + 12) % 12 + 1;
      return next;
    });
  };

  const adjustMinute = (delta: number) => {
    playGearTurn();
    setMinute((prev) => ((prev + delta) % 60 + 60) % 60);
  };

  const handleConfirm = () => {
    if (hour === config.targetHour && minute === config.targetMinute) {
      onSolve();
    } else {
      onMistake('L’orario impostato non apre la Cassaforte d’Oro! Ricontrolla i calcoli.');
    }
  };

  return (
    <div className="relative z-20 w-full h-full flex flex-col justify-between p-3 md:p-5 gap-3 max-w-5xl mx-auto">
      <div className="rounded-2xl bg-slate-900/92 border-2 border-amber-400/90 px-5 py-2.5 text-center">
        <h2 className="text-xl md:text-2xl font-black text-amber-300">{config.promptTitle}</h2>
        <p className="text-lg font-bold text-amber-50 mt-0.5">{config.ruleText}</p>
      </div>

      <div className="flex-1 min-h-0 flex items-center justify-center">
        <InteractiveClockFace
          hour={hour}
          minute={minute}
          showDigital={config.showDigitalHelper}
        />
      </div>

      {/* Controlli lancette in fascia bassa */}
      <div className="shrink-0 rounded-2xl bg-slate-900/92 border-2 border-amber-400/80 p-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => adjustHour(-1)}
            className="min-h-14 px-5 rounded-xl bg-slate-800 border-2 border-amber-400 text-amber-200 font-black text-xl active:scale-95 cursor-pointer"
          >
            -1 ora
          </button>
          <button
            type="button"
            onClick={() => adjustHour(1)}
            className="min-h-14 px-5 rounded-xl bg-slate-800 border-2 border-amber-400 text-amber-200 font-black text-xl active:scale-95 cursor-pointer"
          >
            +1 ora
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => adjustMinute(-5)}
            className="min-h-14 px-5 rounded-xl bg-slate-800 border-2 border-sky-400 text-sky-200 font-black text-xl active:scale-95 cursor-pointer"
          >
            -5 min
          </button>
          <button
            type="button"
            onClick={() => adjustMinute(5)}
            className="min-h-14 px-5 rounded-xl bg-slate-800 border-2 border-sky-400 text-sky-200 font-black text-xl active:scale-95 cursor-pointer"
          >
            +5 min
          </button>
        </div>

        <button
          type="button"
          onClick={handleConfirm}
          className="min-h-14 px-8 rounded-2xl bg-emerald-400 text-slate-950 font-black text-xl md:text-2xl flex items-center gap-2 shadow-lg active:scale-95 cursor-pointer ml-auto"
        >
          <CheckCircle2 className="w-6 h-6" />
          <span>Conferma Ora</span>
        </button>
      </div>
    </div>
  );
}

/* =========================================================
 * 4. FINALE (Stazione 13 — Fase 13A + Dialogo + Fase 13B)
 * ========================================================= */
const MASTER_GEARS_META = [
  { id: 'gear_bronze', label: 'Bronzo (3)', imagePath: '/assets/gears/gear_bronze.png' },
  { id: 'gear_silver', label: 'Argento (6)', imagePath: '/assets/gears/gear_silver.png' },
  { id: 'gear_gold', label: 'Oro (9)', imagePath: '/assets/gears/gear_gold.png' },
];

const SLOT_LABELS = ['Sinistra', 'Centro', 'Destra'];

function FinaleVault({
  config,
  onSolve,
  onMistake,
}: PuzzleEngineProps<VaultFinaleConfig>) {
  const [phase, setPhase] = useState<'13A' | '13A_spin' | 'mid_dialogue' | '13B'>('13A');
  const [slots, setSlots] = useState<[string | null, string | null, string | null]>([
    null,
    null,
    null,
  ]);
  const [selectedGearId, setSelectedGearId] = useState<string | null>(null);

  // Fase 13B: partiamo da 03:30 così devono impostare 12:00
  const [hour, setHour] = useState(3);
  const [minute, setMinute] = useState(30);

  const handleSlotTap = (slotIdx: number) => {
    playGearTurn();
    if (selectedGearId) {
      setSlots((prev) => {
        const next: [string | null, string | null, string | null] = [...prev] as [
          string | null,
          string | null,
          string | null,
        ];
        // Rimuovi lo stesso ingranaggio se già in un altro slot
        for (let i = 0; i < 3; i++) {
          if (next[i] === selectedGearId) next[i] = null;
        }
        next[slotIdx] = selectedGearId;
        return next;
      });
      setSelectedGearId(null);
    } else if (slots[slotIdx]) {
      setSlots((prev) => {
        const next = [...prev] as [string | null, string | null, string | null];
        next[slotIdx] = null;
        return next;
      });
    }
  };

  const handleConfirm13A = () => {
    if (slots.some((s) => s === null)) return;
    const isExact = config.gearSolutionOrder.every((id, idx) => slots[idx] === id);
    if (isExact) {
      playSuccess();
      setPhase('13A_spin');
      window.setTimeout(() => {
        setPhase('mid_dialogue');
      }, 1700);
    } else {
      onMistake('Gli Ingranaggi Maestri non si incastrano! Rileggi l’incisione di Mastro Orazio.');
    }
  };

  const handleConfirm13B = () => {
    if (hour === config.targetHour && minute === config.targetMinute) {
      playTowerChime(12);
      onSolve();
    } else {
      onMistake('Le lancette non sono sull’ora del risveglio! Ricontrolla i calcoli con 3, 6 e 9.');
    }
  };

  if (phase === 'mid_dialogue') {
    return (
      <div className="relative z-20 w-full h-full flex items-center justify-center p-6">
        <div className="w-full max-w-4xl rounded-3xl bg-slate-900/95 border-4 border-amber-400 shadow-2xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6">
          <div className="w-32 h-32 md:w-40 md:h-40 shrink-0 rounded-full border-4 border-amber-400 bg-slate-950 overflow-hidden">
            <SafeImage
              src="/assets/portraits/archimede_celebrating.webp"
              alt="Archimede festeggia"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 space-y-3 text-center md:text-left">
            <span className="inline-block px-4 py-1 rounded-full bg-amber-400 text-slate-950 font-black text-lg">
              {config.midDialogue.speaker}
            </span>
            <p className="text-2xl md:text-3xl font-bold text-amber-50 leading-snug">
              {config.midDialogue.text}
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              playClick();
              setPhase('13B');
            }}
            className="min-h-16 px-8 rounded-2xl bg-amber-400 text-slate-950 font-black text-2xl flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <span>Fase Finale</span>
            <ArrowRight className="w-7 h-7" />
          </button>
        </div>
      </div>
    );
  }

  if (phase === '13B') {
    return (
      <div className="relative z-20 w-full h-full flex flex-col justify-between p-3 md:p-4 gap-2.5 max-w-5xl mx-auto">
        <div className="rounded-2xl bg-slate-900/92 border-2 border-amber-400/90 px-4 py-2.5 space-y-1 text-center">
          <h2 className="text-xl md:text-2xl font-black text-amber-300">
            Fase 2 — Il Rintocco del Risveglio
          </h2>
          {config.phaseBRuleLines.map((line, idx) => (
            <p key={idx} className="text-base md:text-lg font-bold text-amber-50">
              {line}
            </p>
          ))}
        </div>

        <div className="flex-1 min-h-0 flex items-center justify-center">
          <InteractiveClockFace hour={hour} minute={minute} showDigital />
        </div>

        <div className="shrink-0 rounded-2xl bg-slate-900/92 border-2 border-amber-400/80 p-3 flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                playGearTurn();
                setHour((h) => ((h - 2 + 12) % 12) + 1);
              }}
              className="min-h-14 px-4 rounded-xl bg-slate-800 border-2 border-amber-400 text-amber-200 font-black text-xl cursor-pointer"
            >
              -1 ora
            </button>
            <button
              type="button"
              onClick={() => {
                playGearTurn();
                setHour((h) => (h % 12) + 1);
              }}
              className="min-h-14 px-4 rounded-xl bg-slate-800 border-2 border-amber-400 text-amber-200 font-black text-xl cursor-pointer"
            >
              +1 ora
            </button>
            <button
              type="button"
              onClick={() => {
                playGearTurn();
                setMinute((m) => (m - 5 + 60) % 60);
              }}
              className="min-h-14 px-4 rounded-xl bg-slate-800 border-2 border-sky-400 text-sky-200 font-black text-xl cursor-pointer"
            >
              -5 min
            </button>
            <button
              type="button"
              onClick={() => {
                playGearTurn();
                setMinute((m) => (m + 5) % 60);
              }}
              className="min-h-14 px-4 rounded-xl bg-slate-800 border-2 border-sky-400 text-sky-200 font-black text-xl cursor-pointer"
            >
              +5 min
            </button>
          </div>

          <button
            type="button"
            onClick={handleConfirm13B}
            className="min-h-14 px-8 rounded-2xl bg-amber-400 text-slate-950 font-black text-2xl flex items-center gap-2 shadow-xl active:scale-95 cursor-pointer ml-auto"
          >
            <CheckCircle2 className="w-7 h-7" />
            <span>RIAVVIA!</span>
          </button>
        </div>
      </div>
    );
  }

  // Fase 13A (e animazione 13A_spin)
  const isSpinning = phase === '13A_spin';

  return (
    <div className="relative z-20 w-full h-full flex flex-col justify-between p-3 md:p-4 gap-2.5 max-w-5xl mx-auto">
      <div className="rounded-2xl bg-slate-900/92 border-2 border-amber-400/90 px-4 py-2.5 space-y-1 text-center">
        <h2 className="text-xl md:text-2xl font-black text-amber-300">
          Fase 1 — Posiziona i 3 Ingranaggi Maestri
        </h2>
        {config.phaseARuleLines.map((line, idx) => (
          <p key={idx} className="text-base md:text-lg font-bold text-amber-50">
            {line}
          </p>
        ))}
      </div>

      {/* 3 Alloggiamenti (Sinistra / Centro / Destra) */}
      <div className="flex-1 min-h-0 flex items-center justify-center gap-4 md:gap-8">
        {slots.map((gearId, idx) => {
          const gear = MASTER_GEARS_META.find((g) => g.id === gearId);
          return (
            <button
              key={idx}
              type="button"
              disabled={isSpinning}
              onClick={() => handleSlotTap(idx)}
              className={`flex flex-col items-center gap-2 p-3 rounded-3xl border-4 transition-transform cursor-pointer ${
                isSpinning
                  ? 'border-emerald-400 bg-emerald-950/50'
                  : selectedGearId
                  ? 'border-sky-400 bg-slate-900/90 scale-105'
                  : 'border-amber-400/80 bg-slate-900/90'
              }`}
            >
              <div className="w-28 h-28 md:w-36 md:h-36 rounded-full border-4 border-dashed border-amber-300/70 bg-slate-950/90 flex items-center justify-center overflow-hidden p-2">
                {gear ? (
                  <SafeImage
                    src={gear.imagePath}
                    alt={gear.label}
                    className={`w-full h-full object-contain ${
                      isSpinning ? 'animate-rotate-rays' : ''
                    }`}
                  />
                ) : (
                  <span className="text-lg font-bold text-amber-200/70">Vuoto</span>
                )}
              </div>
              <span className="text-xl font-black text-amber-300">{SLOT_LABELS[idx]}</span>
            </button>
          );
        })}
      </div>

      {/* Selezione Ingranaggi + Conferma in fascia bassa */}
      <div className="shrink-0 rounded-2xl bg-slate-900/92 border-2 border-amber-400/80 p-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {MASTER_GEARS_META.map((gear) => {
            const isSelected = selectedGearId === gear.id;
            const isPlaced = slots.includes(gear.id);
            return (
              <button
                key={gear.id}
                type="button"
                disabled={isSpinning}
                onClick={() => {
                  playClick();
                  setSelectedGearId(isSelected ? null : gear.id);
                }}
                className={`min-h-14 px-4 rounded-2xl border-3 flex items-center gap-2.5 font-black text-lg md:text-xl cursor-pointer ${
                  isSelected
                    ? 'bg-amber-400 text-slate-950 border-white ring-4 ring-amber-300/60'
                    : isPlaced
                    ? 'bg-slate-950 text-amber-200/70 border-slate-700'
                    : 'bg-slate-800 text-white border-amber-400/80'
                }`}
              >
                <SafeImage
                  src={gear.imagePath}
                  alt={gear.label}
                  className="w-10 h-10 object-contain"
                />
                <span>{gear.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2.5 ml-auto">
          <button
            type="button"
            disabled={isSpinning}
            onClick={() => {
              playClick();
              setSlots([null, null, null]);
              setSelectedGearId(null);
            }}
            className="min-h-14 px-4 rounded-2xl bg-slate-800 border-2 border-amber-400/70 text-amber-100 font-bold text-lg flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Azzera</span>
          </button>
          <button
            type="button"
            disabled={isSpinning || slots.some((s) => s === null)}
            onClick={handleConfirm13A}
            className="min-h-14 px-7 rounded-2xl bg-emerald-400 text-slate-950 font-black text-xl flex items-center gap-2 shadow-lg disabled:opacity-45 cursor-pointer"
          >
            <CheckCircle2 className="w-6 h-6" />
            <span>Incastra Ingranaggi</span>
          </button>
        </div>
      </div>
    </div>
  );
}
