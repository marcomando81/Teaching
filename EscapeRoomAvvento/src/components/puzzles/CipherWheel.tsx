import { useState } from 'react';
import { CheckCircle2, Delete, RotateCcw, RotateCw } from 'lucide-react';
import type {
  CipherCaesarConfig,
  CipherSymbolConfig,
  PuzzleEngineProps,
} from '../../types/game';
import { playClick, playGearTurn } from '../../audio/soundEngine';

type CipherConfig = CipherCaesarConfig | CipherSymbolConfig;

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const KEYBOARD_ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
];

export function CipherWheel({ config, onSolve, onMistake }: PuzzleEngineProps<CipherConfig>) {
  if (config.mode === 'caesar') {
    return <CaesarBoard config={config} onSolve={onSolve} onMistake={onMistake} />;
  }
  return <SymbolSubstitutionBoard config={config} onSolve={onSolve} onMistake={onMistake} />;
}

/* =========================================================
 * 1. CAESAR WHEEL (Stazione 3)
 * ========================================================= */
function CaesarBoard({
  config,
  onSolve,
  onMistake,
}: PuzzleEngineProps<CipherCaesarConfig>) {
  const [shift, setShift] = useState(0);
  const [answer, setAnswer] = useState('');

  const targetLen = config.solutionWord.length;
  const normalizedShift = ((shift % 26) + 26) % 26;
  const mappedA = ALPHABET[normalizedShift];

  const handleRotate = (delta: number) => {
    playGearTurn();
    setShift((prev) => (prev + delta + 26) % 26);
  };

  const handleKey = (letter: string) => {
    playClick();
    if (answer.length < targetLen) {
      setAnswer((prev) => prev + letter);
    }
  };

  const handleBackspace = () => {
    playClick();
    setAnswer((prev) => prev.slice(0, -1));
  };

  const handleConfirm = () => {
    if (answer.length !== targetLen) return;
    if (answer.toUpperCase() === config.solutionWord.toUpperCase()) {
      onSolve();
    } else {
      onMistake('La parola decifrata non è esatta! Controlla lo spostamento della ruota.');
    }
  };

  return (
    <div className="relative z-20 w-full h-full flex flex-col justify-between p-2.5 md:p-4 gap-2.5">
      {/* Intestazione + regola */}
      <div className="storybook-panel max-w-6xl mx-auto w-full rounded-2xl px-4 py-2 flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-display text-lg md:text-2xl font-bold text-[#3A2314]">
          {config.promptTitle}
        </h2>
        <p className="text-base md:text-lg font-extrabold text-[#63422B]">{config.ruleText}</p>
      </div>

      {/* Corpo centrale: Ruota SVG a sinistra + Parola/Tastiera a destra */}
      <div className="flex-1 min-h-0 max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-3 items-center">
        {/* Colonna sinistra: Ruota SVG in ottone e pergamena + pulsanti -1 / +1 */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center gap-2.5 h-full">
          <div className="w-52 h-52 sm:w-60 sm:h-60 md:w-64 md:h-64 shrink-0 drop-shadow-[0_8px_16px_rgba(14,24,48,0.45)]">
            <svg viewBox="0 0 300 300" className="w-full h-full">
              {/* Anello esterno (lettere in chiaro - pergamena calda) */}
              <circle cx="150" cy="150" r="144" fill="#F5B82E" stroke="#3A2314" strokeWidth="5" />
              <circle cx="150" cy="150" r="136" fill="#FFF9EC" stroke="#3A2314" strokeWidth="3" />

              {ALPHABET.map((letter, idx) => {
                const angleDeg = (idx * 360) / 26 - 90;
                const rad = (angleDeg * Math.PI) / 180;
                const x = 150 + Math.cos(rad) * 121;
                const y = 150 + Math.sin(rad) * 121;
                return (
                  <text
                    key={`outer-${letter}`}
                    x={x}
                    y={y}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill={idx === 0 ? '#15803D' : '#2B190E'}
                    fontSize={idx === 0 ? '16' : '13.5'}
                    fontWeight="900"
                    fontFamily="Fredoka, sans-serif"
                  >
                    {letter}
                  </text>
                );
              })}

              {/* Anello interno rotabile (lettere cifrate - azzurro cielo morbido) */}
              <g
                style={{
                  transformOrigin: '150px 150px',
                  transform: `rotate(${-(normalizedShift * 360) / 26}deg)`,
                  transition: 'transform 0.3s ease-out',
                }}
              >
                <circle cx="150" cy="150" r="103" fill="#BAE6FD" stroke="#3A2314" strokeWidth="3.5" />
                <circle cx="150" cy="150" r="65" fill="#FFD859" stroke="#3A2314" strokeWidth="3.5" />
                {ALPHABET.map((letter, idx) => {
                  const angleDeg = (idx * 360) / 26 - 90;
                  const rad = (angleDeg * Math.PI) / 180;
                  const x = 150 + Math.cos(rad) * 85;
                  const y = 150 + Math.sin(rad) * 85;
                  return (
                    <text
                      key={`inner-${letter}`}
                      x={x}
                      y={y}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill={idx === normalizedShift ? '#C81E25' : '#0A2E47'}
                      fontSize={idx === normalizedShift ? '15.5' : '13'}
                      fontWeight="900"
                      fontFamily="Fredoka, sans-serif"
                    >
                      {letter}
                    </text>
                  );
                })}
              </g>

              {/* Centro ruota dorato */}
              <text
                x="150"
                y="141"
                textAnchor="middle"
                fill="#3A2314"
                fontSize="16"
                fontWeight="900"
                fontFamily="Fredoka, sans-serif"
              >
                A → {mappedA}
              </text>
              <text
                x="150"
                y="164"
                textAnchor="middle"
                fill="#63422B"
                fontSize="14"
                fontWeight="800"
                fontFamily="Nunito, sans-serif"
              >
                +{normalizedShift}
              </text>
            </svg>
          </div>

          {/* Pulsanti rotazione anello interno */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => handleRotate(-1)}
              className="btn-3d btn-3d-gold min-h-14 px-5 rounded-2xl font-bold text-xl flex items-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-6 h-6" />
              <span>-1</span>
            </button>
            <span className="storybook-panel px-4 py-2 rounded-2xl font-display font-bold text-xl text-[#0A2E47]">
              A → {mappedA}
            </span>
            <button
              type="button"
              onClick={() => handleRotate(1)}
              className="btn-3d btn-3d-gold min-h-14 px-5 rounded-2xl font-bold text-xl flex items-center gap-2 cursor-pointer"
            >
              <span>+1</span>
              <RotateCw className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Colonna destra: Messaggio cifrato + Slot risposta + Tastiera touch */}
        <div className="lg:col-span-7 flex flex-col justify-between gap-2.5 h-full">
          {/* Parola cifrata e slot risposta */}
          <div className="storybook-panel rounded-3xl p-3 flex flex-col items-center gap-2">
            <div className="flex items-center gap-2 flex-wrap justify-center">
              {config.encryptedWord.split('').map((ch, idx) => (
                <div key={idx} className="flex flex-col items-center gap-1.5">
                  <span className="w-11 h-11 md:w-12 md:h-12 rounded-xl bg-[#BAE6FD] border-[3px] border-[#0E6091] text-[#0A2E47] font-display font-bold text-2xl flex items-center justify-center shadow-[0_3px_0_#0E6091]">
                    {ch}
                  </span>
                  <span className="w-11 h-11 md:w-12 md:h-12 rounded-xl bg-white border-[3px] border-[#3A2314] text-[#2B190E] font-display font-bold text-2xl flex items-center justify-center shadow-inner">
                    {answer[idx] ?? ''}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Tastiera alfabetica integrata */}
          <TouchKeyboard
            onKey={handleKey}
            onBackspace={handleBackspace}
            onConfirm={handleConfirm}
            canConfirm={answer.length === targetLen}
          />
        </div>
      </div>
    </div>
  );
}

/* =========================================================
 * 2. SYMBOL SUBSTITUTION (Stazione 7)
 * ========================================================= */
function SymbolSubstitutionBoard({
  config,
  onSolve,
  onMistake,
}: PuzzleEngineProps<CipherSymbolConfig>) {
  const [answer, setAnswer] = useState('');
  const targetLen = config.solutionWord.length;

  const handleKey = (letter: string) => {
    playClick();
    if (answer.length < targetLen) {
      setAnswer((prev) => prev + letter);
    }
  };

  const handleBackspace = () => {
    playClick();
    setAnswer((prev) => prev.slice(0, -1));
  };

  const handleConfirm = () => {
    if (answer.length !== targetLen) return;
    if (answer.toUpperCase() === config.solutionWord.toUpperCase()) {
      onSolve();
    } else {
      onMistake('La parola non corrisponde ai simboli! Confronta le 3 parole di riferimento.');
    }
  };

  return (
    <div className="relative z-20 w-full h-full flex flex-col justify-between p-2.5 md:p-4 gap-2.5 max-w-6xl mx-auto">
      {/* Tabella 3 parole di riferimento */}
      <div className="storybook-panel rounded-3xl p-3 space-y-2">
        <h2 className="font-display text-lg md:text-2xl font-bold text-[#3A2314] text-center">
          {config.promptTitle}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
          {config.referenceWords.map((ref, idx) => (
            <div
              key={idx}
              className="storybook-subcard rounded-2xl px-3 py-2 flex flex-col items-center gap-1"
            >
              <div className="text-xl md:text-2xl tracking-widest text-[#3A2314] font-bold">
                {ref.symbols.join(' ')}
              </div>
              <div className="font-display text-xl md:text-2xl tracking-[0.25em] text-[#0E6091] font-bold">
                {ref.plain}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Parola cifrata + slot risposta */}
      <div className="storybook-panel rounded-3xl p-3 flex items-center justify-center gap-2 md:gap-3 flex-wrap">
        {config.encryptedSymbols.map((sym, idx) => (
          <div key={idx} className="flex flex-col items-center gap-1.5">
            <span className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-[#BAE6FD] border-[3px] border-[#0E6091] text-[#0A2E47] text-2xl md:text-3xl flex items-center justify-center shadow-[0_3px_0_#0E6091]">
              {sym}
            </span>
            <span className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-white border-[3px] border-[#3A2314] text-[#2B190E] font-display font-bold text-2xl md:text-3xl flex items-center justify-center shadow-inner">
              {answer[idx] ?? ''}
            </span>
          </div>
        ))}
      </div>

      {/* Tastiera alfabetica integrata */}
      <TouchKeyboard
        onKey={handleKey}
        onBackspace={handleBackspace}
        onConfirm={handleConfirm}
        canConfirm={answer.length === targetLen}
      />
    </div>
  );
}

/* =========================================================
 * TASTIERA ALFABETICA TOUCH INTEGRATA (STILE TASTI 3D AVORIO)
 * ========================================================= */
function TouchKeyboard({
  onKey,
  onBackspace,
  onConfirm,
  canConfirm,
}: {
  onKey: (letter: string) => void;
  onBackspace: () => void;
  onConfirm: () => void;
  canConfirm: boolean;
}) {
  return (
    <div className="storybook-panel rounded-3xl p-2.5 space-y-2">
      {KEYBOARD_ROWS.map((row, rowIdx) => (
        <div key={rowIdx} className="flex items-center justify-center gap-1.5">
          {row.map((letter) => (
            <button
              key={letter}
              type="button"
              onClick={() => onKey(letter)}
              className="btn-3d btn-3d-cream min-h-12 md:min-h-13 flex-1 max-w-14 rounded-xl font-bold text-xl md:text-2xl cursor-pointer"
            >
              {letter}
            </button>
          ))}

          {rowIdx === 2 && (
            <>
              <button
                type="button"
                onClick={onBackspace}
                className="btn-3d btn-3d-berry min-h-12 md:min-h-13 px-4 rounded-xl font-bold flex items-center justify-center cursor-pointer"
                aria-label="Cancella lettera"
              >
                <Delete className="w-6 h-6" />
              </button>
              <button
                type="button"
                onClick={onConfirm}
                disabled={!canConfirm}
                className="btn-3d btn-3d-green min-h-12 md:min-h-13 px-5 rounded-xl font-bold text-lg md:text-xl flex items-center gap-2 cursor-pointer"
              >
                <CheckCircle2 className="w-6 h-6" />
                <span>OK</span>
              </button>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
