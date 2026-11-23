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
    <div className="relative z-20 w-full h-full flex flex-col justify-between p-3 md:p-4 gap-3 max-w-5xl mx-auto">
      <div className="storybook-panel rounded-2xl px-5 py-2.5 text-center">
        <h2 className="font-display text-xl md:text-2xl font-bold text-[#3A2314]">
          {config.promptTitle}
        </h2>
      </div>

      <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* Incisione sulla teca */}
        <div className="storybook-panel md:col-span-6 rounded-3xl p-5 space-y-3">
          <h3 className="font-display text-xl font-bold text-[#63422B] border-b-2 border-[#D4B27D] pb-2">
            Incisione sulla Teca:
          </h3>
          <ul className="space-y-2.5 text-xl md:text-2xl font-extrabold text-[#2B190E]">
            {config.ruleLines.map((line, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="w-7 h-7 rounded-full bg-[#FFD859] border-2 border-[#3A2314] font-display text-base font-bold text-[#3A2314] flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Display codice + tastierino 0-9 */}
        <div className="storybook-panel md:col-span-6 rounded-3xl p-4 flex flex-col items-center gap-3">
          <div className="flex items-center gap-3">
            {Array.from({ length: config.codeLength }, (_, idx) => (
              <div
                key={idx}
                className="w-14 h-16 md:w-16 md:h-17 rounded-2xl bg-white border-[3px] border-[#3A2314] text-[#2B190E] font-display font-bold text-3xl md:text-4xl flex items-center justify-center shadow-inner"
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
                className="btn-3d btn-3d-cream min-h-13 rounded-2xl font-bold text-2xl cursor-pointer"
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
              className="btn-3d btn-3d-berry min-h-13 rounded-2xl font-bold text-xl cursor-pointer"
            >
              C
            </button>
            <button
              type="button"
              onClick={() => pressDigit('0')}
              className="btn-3d btn-3d-cream min-h-13 rounded-2xl font-bold text-2xl cursor-pointer"
            >
              0
            </button>
            <button
              type="button"
              onClick={() => {
                playClick();
                setCode((prev) => prev.slice(0, -1));
              }}
              className="btn-3d btn-3d-gold min-h-13 rounded-2xl flex items-center justify-center cursor-pointer"
              aria-label="Cancella cifra"
            >
              <Delete className="w-7 h-7" />
            </button>
          </div>

          <button
            type="button"
            disabled={code.length !== config.codeLength}
            onClick={handleConfirm}
            className="btn-3d btn-3d-green w-full max-w-xs min-h-14 rounded-2xl font-bold text-2xl flex items-center justify-center gap-2 cursor-pointer"
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
    <div className="relative z-20 w-full h-full flex flex-col justify-between p-3 md:p-4 gap-3 max-w-5xl mx-auto">
      <div className="storybook-panel rounded-2xl px-5 py-2.5 text-center">
        <h2 className="font-display text-xl md:text-2xl font-bold text-[#3A2314]">
          {config.promptTitle}
        </h2>
        <p className="text-base md:text-xl font-extrabold text-[#63422B] mt-0.5">
          {config.ruleText}
        </p>
      </div>

      {/* 4 Rotelle meccaniche illustrate */}
      <div className="flex-1 min-h-0 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 items-center">
        {dialIndices.map((symIdx, dialIdx) => {
          const sym = config.symbols[symIdx];
          return (
            <div
              key={dialIdx}
              className="storybook-panel rounded-3xl p-3 flex flex-col items-center justify-between gap-2.5"
            >
              <span className="px-3.5 py-0.5 rounded-full bg-[#FFD859] border-2 border-[#3A2314] font-display text-base font-bold text-[#3A2314]">
                Rotella {dialIdx + 1}
              </span>

              <button
                type="button"
                onClick={() => rotateDial(dialIdx, -1)}
                className="btn-3d btn-3d-cream w-full min-h-13 rounded-2xl flex items-center justify-center cursor-pointer"
                aria-label={`Rotella ${dialIdx + 1} precedente`}
              >
                <ChevronUp className="w-8 h-8" />
              </button>

              <motion.div
                key={`${dialIdx}-${sym.id}`}
                initial={{ scale: 0.78, opacity: 0.45 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 320, damping: 20 }}
                className="w-full py-3 rounded-2xl bg-[#E0F2FE] border-[3px] border-[#0E6091] flex flex-col items-center gap-1.5 text-[#0A2E47] shadow-inner"
              >
                <DialSymbolIcon iconName={sym.iconName} className="w-11 h-11 text-[#0C4A6E]" />
                <span className="font-display text-lg font-bold text-[#0A2E47] text-center px-1">
                  {sym.label}
                </span>
              </motion.div>

              <button
                type="button"
                onClick={() => rotateDial(dialIdx, 1)}
                className="btn-3d btn-3d-cream w-full min-h-13 rounded-2xl flex items-center justify-center cursor-pointer"
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
          className="btn-3d btn-3d-green min-h-14 px-9 rounded-2xl font-bold text-2xl flex items-center gap-2 cursor-pointer"
        >
          <CheckCircle2 className="w-6 h-6" />
          <span>Apri Cassaforte</span>
        </button>
      </div>
    </div>
  );
}

/* =========================================================
 * QUADRANTE OROLOGIO SVG DIDATTICO (Stazioni 12 e 13B)
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
      <div className="w-52 h-52 md:w-60 md:h-60 drop-shadow-[0_8px_18px_rgba(14,24,48,0.45)]">
        <svg viewBox="0 0 240 240" className="w-full h-full">
          {/* Cornice in ottone caldo e contorno inchiostro */}
          <circle cx="120" cy="120" r="114" fill="#F5B82E" stroke="#3A2314" strokeWidth="6" />
          <circle cx="120" cy="120" r="101" fill="#FFFDF5" stroke="#3A2314" strokeWidth="3.5" />

          {/* 60 tacche minuti (ogni 5 minuti più marcate per facilitare la lettura) */}
          {Array.from({ length: 60 }, (_, i) => {
            const isFive = i % 5 === 0;
            const angle = (i * 6 - 90) * (Math.PI / 180);
            const rOuter = 96;
            const rInner = isFive ? 86 : 91;
            return (
              <line
                key={`tick-${i}`}
                x1={120 + Math.cos(angle) * rInner}
                y1={120 + Math.sin(angle) * rInner}
                x2={120 + Math.cos(angle) * rOuter}
                y2={120 + Math.sin(angle) * rOuter}
                stroke={isFive ? '#3A2314' : '#B39360'}
                strokeWidth={isFive ? '3' : '1.5'}
                strokeLinecap="round"
              />
            );
          })}

          {/* Numeri 1-12 ben leggibili */}
          {Array.from({ length: 12 }, (_, idx) => {
            const num = idx + 1;
            const angle = (num * 30 - 90) * (Math.PI / 180);
            const x = 120 + Math.cos(angle) * 72;
            const y = 120 + Math.sin(angle) * 72;
            return (
              <text
                key={num}
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="central"
                fill="#2B190E"
                fontSize="19"
                fontWeight="900"
                fontFamily="Fredoka, sans-serif"
              >
                {num}
              </text>
            );
          })}

          {/* Lancetta delle ORE (rossa/corallo, più corta e spessa) */}
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
              y2="68"
              stroke="#E04248"
              strokeWidth="9"
              strokeLinecap="round"
            />
          </g>

          {/* Lancetta dei MINUTI (blu cielo, più lunga e nitida) */}
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
              y2="44"
              stroke="#0284C7"
              strokeWidth="5.5"
              strokeLinecap="round"
            />
          </g>

          {/* Perno centrale dorato */}
          <circle cx="120" cy="120" r="10" fill="#FFD859" stroke="#3A2314" strokeWidth="3.5" />
        </svg>
      </div>

      {showDigital && (
        <div className="storybook-panel px-5 py-1 rounded-2xl font-display font-bold text-3xl tracking-widest flex items-center gap-1">
          <span className="text-[#D93036]">{String(hour).padStart(2, '0')}</span>
          <span className="text-[#3A2314]">:</span>
          <span className="text-[#0284C7]">{String(minute).padStart(2, '0')}</span>
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
      const next = (((prev - 1 + delta) % 12) + 12) % 12 + 1;
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
    <div className="relative z-20 w-full h-full flex flex-col justify-between p-3 md:p-4 gap-2.5 max-w-5xl mx-auto">
      <div className="storybook-panel rounded-2xl px-5 py-2.5 text-center">
        <h2 className="font-display text-xl md:text-2xl font-bold text-[#3A2314]">
          {config.promptTitle}
        </h2>
        <p className="text-base md:text-lg font-extrabold text-[#63422B] mt-0.5">
          {config.ruleText}
        </p>
      </div>

      <div className="flex-1 min-h-0 flex items-center justify-center">
        <InteractiveClockFace
          hour={hour}
          minute={minute}
          showDigital={config.showDigitalHelper}
        />
      </div>

      {/* Controlli lancette in fascia bassa */}
      <div className="storybook-panel shrink-0 rounded-3xl p-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => adjustHour(-1)}
            className="btn-3d btn-3d-berry min-h-14 px-5 rounded-2xl font-bold text-xl cursor-pointer"
          >
            -1 ora
          </button>
          <button
            type="button"
            onClick={() => adjustHour(1)}
            className="btn-3d btn-3d-berry min-h-14 px-5 rounded-2xl font-bold text-xl cursor-pointer"
          >
            +1 ora
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => adjustMinute(-5)}
            className="btn-3d btn-3d-sky min-h-14 px-5 rounded-2xl font-bold text-xl cursor-pointer"
          >
            -5 min
          </button>
          <button
            type="button"
            onClick={() => adjustMinute(5)}
            className="btn-3d btn-3d-sky min-h-14 px-5 rounded-2xl font-bold text-xl cursor-pointer"
          >
            +5 min
          </button>
        </div>

        <button
          type="button"
          onClick={handleConfirm}
          className="btn-3d btn-3d-green min-h-14 px-8 rounded-2xl font-bold text-xl md:text-2xl flex items-center gap-2 cursor-pointer ml-auto"
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
        <div className="w-full max-w-5xl flex flex-col md:flex-row items-center gap-5">
          <div className="w-32 h-32 md:w-40 md:h-40 shrink-0 rounded-full border-4 border-[#3A2314] ring-4 ring-[#FFD859] bg-[#1D2B4A] overflow-hidden shadow-[0_6px_0_rgba(58,35,20,0.45)]">
            <SafeImage
              src="/assets/portraits/archimede_celebrating.webp"
              alt="Archimede festeggia"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="storybook-panel speech-tail-left flex-1 rounded-[28px] p-6 md:p-7 flex flex-col md:flex-row items-center gap-5">
            <div className="flex-1 space-y-2.5 text-center md:text-left">
              <span className="inline-block px-4 py-1 rounded-full bg-[#FFD859] border-2 border-[#3A2314] text-[#3A2314] font-display font-bold text-lg shadow-[0_2px_0_#3A2314]">
                {config.midDialogue.speaker}
              </span>
              <p className="text-2xl md:text-3xl font-extrabold text-[#2B190E] leading-snug">
                {config.midDialogue.text}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                playClick();
                setPhase('13B');
              }}
              className="btn-3d btn-3d-gold min-h-16 px-8 rounded-2xl font-bold text-2xl flex items-center gap-2 shrink-0 cursor-pointer"
            >
              <span>Fase Finale</span>
              <ArrowRight className="w-7 h-7" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (phase === '13B') {
    return (
      <div className="relative z-20 w-full h-full flex flex-col justify-between p-3 md:p-4 gap-2.5 max-w-5xl mx-auto">
        <div className="storybook-panel rounded-2xl px-4 py-2 space-y-0.5 text-center">
          <h2 className="font-display text-xl md:text-2xl font-bold text-[#3A2314]">
            Fase 2 — Il Rintocco del Risveglio
          </h2>
          {config.phaseBRuleLines.map((line, idx) => (
            <p key={idx} className="text-base md:text-lg font-extrabold text-[#63422B]">
              {line}
            </p>
          ))}
        </div>

        <div className="flex-1 min-h-0 flex items-center justify-center">
          <InteractiveClockFace hour={hour} minute={minute} showDigital />
        </div>

        <div className="storybook-panel shrink-0 rounded-3xl p-3 flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => {
                playGearTurn();
                setHour((h) => ((h - 2 + 12) % 12) + 1);
              }}
              className="btn-3d btn-3d-berry min-h-14 px-4 rounded-2xl font-bold text-xl cursor-pointer"
            >
              -1 ora
            </button>
            <button
              type="button"
              onClick={() => {
                playGearTurn();
                setHour((h) => (h % 12) + 1);
              }}
              className="btn-3d btn-3d-berry min-h-14 px-4 rounded-2xl font-bold text-xl cursor-pointer"
            >
              +1 ora
            </button>
            <button
              type="button"
              onClick={() => {
                playGearTurn();
                setMinute((m) => (m - 5 + 60) % 60);
              }}
              className="btn-3d btn-3d-sky min-h-14 px-4 rounded-2xl font-bold text-xl cursor-pointer"
            >
              -5 min
            </button>
            <button
              type="button"
              onClick={() => {
                playGearTurn();
                setMinute((m) => (m + 5) % 60);
              }}
              className="btn-3d btn-3d-sky min-h-14 px-4 rounded-2xl font-bold text-xl cursor-pointer"
            >
              +5 min
            </button>
          </div>

          <button
            type="button"
            onClick={handleConfirm13B}
            className="btn-3d btn-3d-gold min-h-14 px-8 rounded-2xl font-bold text-2xl flex items-center gap-2 cursor-pointer ml-auto"
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
      <div className="storybook-panel rounded-2xl px-4 py-2 space-y-0.5 text-center">
        <h2 className="font-display text-xl md:text-2xl font-bold text-[#3A2314]">
          Fase 1 — Posiziona i 3 Ingranaggi Maestri
        </h2>
        {config.phaseARuleLines.map((line, idx) => (
          <p key={idx} className="text-base md:text-lg font-extrabold text-[#63422B]">
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
              className={`storybook-panel flex flex-col items-center gap-2 p-3.5 rounded-3xl transition-transform cursor-pointer ${
                isSpinning
                  ? 'ring-4 ring-[#4FE08A] bg-none bg-[#DCFCE7]'
                  : selectedGearId
                  ? 'ring-4 ring-[#38BDF8] scale-105'
                  : 'hover:scale-[1.02]'
              }`}
            >
              <div className="w-28 h-28 md:w-36 md:h-36 rounded-full border-4 border-dashed border-[#B47028] bg-[#2B190E] flex items-center justify-center overflow-hidden p-2 shadow-inner">
                {gear ? (
                  <SafeImage
                    src={gear.imagePath}
                    alt={gear.label}
                    className={`w-full h-full object-contain ${
                      isSpinning ? 'animate-rotate-rays' : ''
                    }`}
                  />
                ) : (
                  <span className="font-display text-lg font-bold text-[#F3D79B]">Vuoto</span>
                )}
              </div>
              <span className="font-display text-xl font-bold text-[#3A2314]">
                {SLOT_LABELS[idx]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Selezione Ingranaggi + Conferma in fascia bassa */}
      <div className="storybook-panel shrink-0 rounded-3xl p-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 flex-wrap">
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
                className={`btn-3d min-h-14 px-4 rounded-2xl flex items-center gap-2.5 font-bold text-lg md:text-xl cursor-pointer ${
                  isSelected
                    ? 'btn-3d-gold ring-4 ring-[#FFE169]'
                    : isPlaced
                    ? 'bg-[#EAD9B7] text-[#7D6140] border-[#B39360]'
                    : 'btn-3d-cream'
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
            className="btn-3d btn-3d-cream min-h-14 px-4 rounded-2xl font-bold text-lg flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Azzera</span>
          </button>
          <button
            type="button"
            disabled={isSpinning || slots.some((s) => s === null)}
            onClick={handleConfirm13A}
            className="btn-3d btn-3d-green min-h-14 px-7 rounded-2xl font-bold text-xl flex items-center gap-2 cursor-pointer"
          >
            <CheckCircle2 className="w-6 h-6" />
            <span>Incastra Ingranaggi</span>
          </button>
        </div>
      </div>
    </div>
  );
}
