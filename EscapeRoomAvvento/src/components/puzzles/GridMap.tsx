import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  BookOpen,
  CheckCircle2,
  Compass,
  Flag,
  MapPin,
  RotateCcw,
  X,
} from 'lucide-react';
import type {
  GridPathConfig,
  GridSymmetryConfig,
  PuzzleEngineProps,
} from '../../types/game';
import { playClick } from '../../audio/soundEngine';

type GridConfig = GridPathConfig | GridSymmetryConfig;

export function GridMap({ config, onSolve, onMistake }: PuzzleEngineProps<GridConfig>) {
  if (config.mode === 'path_target') {
    return <PathTargetBoard config={config} onSolve={onSolve} onMistake={onMistake} />;
  }
  return <SymmetryBoard config={config} onSolve={onSolve} onMistake={onMistake} />;
}

/* =========================================================
 * 1. PATH TARGET (Stazione 5)
 * ========================================================= */
function PathTargetBoard({
  config,
  onSolve,
  onMistake,
}: PuzzleEngineProps<GridPathConfig>) {
  const [selectedCell, setSelectedCell] = useState<string | null>(null);
  const [markers, setMarkers] = useState<string[]>([]);
  const [markerMode, setMarkerMode] = useState(false);
  const [stepsModalOpen, setStepsModalOpen] = useState(false);

  const handleCellTap = (cellId: string) => {
    playClick();
    if (markerMode) {
      setMarkers((prev) =>
        prev.includes(cellId) ? prev.filter((c) => c !== cellId) : [...prev, cellId]
      );
    } else {
      setSelectedCell(cellId);
    }
  };

  const handleConfirm = () => {
    if (!selectedCell) return;
    if (selectedCell.toUpperCase() === config.solutionCell.toUpperCase()) {
      onSolve();
    } else {
      onMistake(
        `La cella ${selectedCell} non è quella giusta! Riconta bene i passi dalla cella ${config.startCell}.`
      );
    }
  };

  return (
    <div className="relative z-20 w-full h-full flex flex-col justify-between p-2.5 md:p-4 gap-2.5 max-w-6xl mx-auto">
      {/* Intestazione */}
      <div className="rounded-2xl bg-slate-900/92 border-2 border-amber-400/90 px-4 py-2 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg md:text-2xl font-black text-amber-300">{config.promptTitle}</h2>
        <button
          type="button"
          onClick={() => {
            playClick();
            setStepsModalOpen(true);
          }}
          className="min-h-12 px-4 rounded-xl bg-amber-400 text-slate-950 font-black text-lg flex items-center gap-2 cursor-pointer"
        >
          <BookOpen className="w-5 h-5" />
          <span>Ingrandisci Passi</span>
        </button>
      </div>

      {/* Griglia 5x5 + Bussola e passi */}
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-3 items-center">
        {/* Griglia */}
        <div
          style={{ touchAction: 'none' }}
          className="lg:col-span-7 flex items-center justify-center h-full"
        >
          <div className="rounded-2xl bg-slate-900/92 border-2 border-amber-400/80 p-3">
            {/* Intestazioni colonne */}
            <div
              className="grid gap-1.5 mb-1.5"
              style={{
                gridTemplateColumns: `36px repeat(${config.cols}, minmax(48px, 64px))`,
              }}
            >
              <div />
              {config.colLabels.map((col) => (
                <div
                  key={col}
                  className="text-center font-black text-xl text-amber-300"
                >
                  {col}
                </div>
              ))}
            </div>

            {/* Righe */}
            <div className="space-y-1.5">
              {config.rowLabels.map((row) => (
                <div
                  key={row}
                  className="grid gap-1.5 items-center"
                  style={{
                    gridTemplateColumns: `36px repeat(${config.cols}, minmax(48px, 64px))`,
                  }}
                >
                  <div className="text-center font-black text-xl text-amber-300">{row}</div>
                  {config.colLabels.map((col) => {
                    const cellId = `${col}${row}`;
                    const isStart = cellId === config.startCell;
                    const isSelected = cellId === selectedCell;
                    const isMarked = markers.includes(cellId);

                    return (
                      <button
                        key={cellId}
                        type="button"
                        onClick={() => handleCellTap(cellId)}
                        className={`h-12 md:h-14 rounded-xl border-2 font-black text-lg flex flex-col items-center justify-center relative active:scale-95 transition-transform cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-400 text-slate-950 border-white ring-2 ring-emerald-200'
                            : isStart
                            ? 'bg-amber-400/25 text-amber-200 border-amber-400'
                            : isMarked
                            ? 'bg-sky-500/35 text-sky-100 border-sky-400'
                            : 'bg-slate-950/90 text-amber-100/80 border-slate-700'
                        }`}
                        aria-label={`Cella ${cellId}`}
                      >
                        {isSelected ? (
                          <MapPin className="w-6 h-6" />
                        ) : isStart ? (
                          <Flag className="w-5 h-5 text-amber-300" />
                        ) : (
                          <span>{cellId}</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bussola + Elenco passi */}
        <div className="lg:col-span-5 h-full flex flex-col justify-between gap-2.5">
          {/* Rosa dei venti N/S/E/O */}
          <div className="rounded-2xl bg-slate-900/92 border-2 border-amber-400/80 p-3 flex items-center justify-around">
            <div className="relative w-24 h-24 rounded-full bg-slate-950 border-2 border-amber-400 flex items-center justify-center">
              <Compass className="w-8 h-8 text-amber-300" />
              <span className="absolute top-1 left-1/2 -translate-x-1/2 text-base font-black text-emerald-300">
                N
              </span>
              <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-base font-black text-amber-200">
                S
              </span>
              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-base font-black text-amber-200">
                O
              </span>
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-base font-black text-amber-200">
                E
              </span>
            </div>
            <div className="text-left space-y-1">
              <p className="text-lg font-extrabold text-amber-300">
                Partenza: <span className="text-white">{config.startCell}</span>
              </p>
              <p className="text-lg font-extrabold text-emerald-300">
                Arrivo scelto: <span className="text-white">{selectedCell ?? '—'}</span>
              </p>
            </div>
          </div>

          {/* Lista compatta passi */}
          <ol className="flex-1 overflow-y-auto rounded-2xl bg-slate-900/92 border-2 border-amber-400/70 p-3 space-y-1.5 text-base md:text-lg font-bold text-amber-50">
            {config.steps.map((step, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-amber-300 font-black">{idx + 1}.</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Fascia controlli bassa */}
      <div className="shrink-0 flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => {
            playClick();
            setMarkerMode((prev) => !prev);
          }}
          className={`min-h-14 px-5 rounded-2xl border-2 font-black text-lg cursor-pointer ${
            markerMode
              ? 'bg-sky-400 text-slate-950 border-white'
              : 'bg-slate-900 text-amber-100 border-amber-400/70'
          }`}
        >
          {markerMode ? 'Segnaposto Tappe: ATTIVO' : 'Segna Tappe Intermedie'}
        </button>

        <div className="flex items-center gap-3 ml-auto">
          <button
            type="button"
            onClick={() => {
              playClick();
              setSelectedCell(null);
              setMarkers([]);
            }}
            className="min-h-14 px-5 rounded-2xl bg-slate-800 border-2 border-amber-400/70 text-amber-100 font-bold text-xl flex items-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Azzera</span>
          </button>

          <button
            type="button"
            disabled={!selectedCell}
            onClick={handleConfirm}
            className="min-h-14 px-8 rounded-2xl bg-emerald-400 text-slate-950 font-black text-xl md:text-2xl flex items-center gap-2 shadow-lg disabled:opacity-45 cursor-pointer"
          >
            <CheckCircle2 className="w-6 h-6" />
            <span>Conferma</span>
          </button>
        </div>
      </div>

      {/* Modale Passi Ingranditi */}
      <AnimatePresence>
        {stepsModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/92 flex items-center justify-center p-5"
            onClick={() => setStepsModalOpen(false)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-4xl max-h-[90vh] rounded-3xl bg-slate-900 border-4 border-amber-400 p-6 md:p-8 flex flex-col gap-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-2xl md:text-3xl font-black text-amber-300">
                  Istruzioni del Percorso
                </h3>
                <button
                  type="button"
                  onClick={() => setStepsModalOpen(false)}
                  className="min-h-14 px-6 rounded-2xl bg-amber-400 text-slate-950 font-black text-xl flex items-center gap-2 cursor-pointer"
                >
                  <X className="w-6 h-6" />
                  <span>Chiudi</span>
                </button>
              </div>
              <ol className="flex-1 overflow-y-auto space-y-3">
                {config.steps.map((step, idx) => (
                  <li
                    key={idx}
                    className="rounded-2xl bg-slate-950 border-2 border-amber-400/70 p-3.5 text-2xl font-bold text-amber-50 flex items-center gap-4"
                  >
                    <span className="w-10 h-10 shrink-0 rounded-full bg-amber-400 text-slate-950 font-black flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span>{step}</span>
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
 * 2. SYMMETRY (Stazione 9)
 * ========================================================= */
function SymmetryBoard({
  config,
  onSolve,
  onMistake,
}: PuzzleEngineProps<GridSymmetryConfig>) {
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const halfCols = Math.floor(config.cols / 2);

  const givenSet = new Set(config.givenCells.map(([c, r]) => `${c},${r}`));
  const solutionSet = new Set(config.solutionCells.map(([c, r]) => `${c},${r}`));

  const toggleRightCell = (col: number, row: number) => {
    playClick();
    const key = `${col},${row}`;
    setSelectedKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const handleConfirm = () => {
    const isExact =
      selectedKeys.length === solutionSet.size &&
      selectedKeys.every((k) => solutionSet.has(k));

    if (isExact) {
      onSolve();
    } else {
      onMistake(
        'La metà destra non è ancora perfettamente a specchio rispetto all’asse dorato!'
      );
    }
  };

  return (
    <div className="relative z-20 w-full h-full flex flex-col justify-between p-3 md:p-5 gap-3 max-w-5xl mx-auto">
      <div className="rounded-2xl bg-slate-900/92 border-2 border-amber-400/90 px-5 py-2.5 text-center">
        <h2 className="text-xl md:text-2xl font-black text-amber-300">{config.promptTitle}</h2>
        <p className="text-lg font-bold text-amber-50">
          Tocca le caselle sulla metà destra per completare il sigillo a specchio!
        </p>
      </div>

      {/* Griglia 6x5 con asse dorato verticale tra col 3 e 4 */}
      <div
        style={{ touchAction: 'none' }}
        className="flex-1 min-h-0 flex items-center justify-center"
      >
        <div className="rounded-3xl bg-slate-900/92 border-2 border-amber-400/80 p-4 flex items-center gap-3">
          {/* Metà sinistra (fissa) */}
          <div className="space-y-2">
            {Array.from({ length: config.rows }, (_, rIdx) => {
              const row = rIdx + 1;
              return (
                <div key={`left-${row}`} className="flex gap-2">
                  {Array.from({ length: halfCols }, (_, cIdx) => {
                    const col = cIdx + 1;
                    const isLit = givenSet.has(`${col},${row}`);
                    return (
                      <div
                        key={`${col},${row}`}
                        className={`w-13 h-13 md:w-16 md:h-16 rounded-xl border-2 flex items-center justify-center ${
                          isLit
                            ? 'bg-amber-400 border-amber-100 shadow-[0_0_16px_rgba(251,191,36,0.7)]'
                            : 'bg-slate-950/90 border-slate-700'
                        }`}
                      />
                    );
                  })}
                </div>
              );
            })}
          </div>

          {/* Asse di simmetria dorato verticale */}
          <div
            aria-hidden="true"
            className="w-2 self-stretch rounded-full bg-gradient-to-b from-amber-200 via-amber-400 to-amber-200 shadow-[0_0_18px_rgba(251,191,36,0.9)]"
          />

          {/* Metà destra (cliccabile) */}
          <div className="space-y-2">
            {Array.from({ length: config.rows }, (_, rIdx) => {
              const row = rIdx + 1;
              return (
                <div key={`right-${row}`} className="flex gap-2">
                  {Array.from({ length: config.cols - halfCols }, (_, cIdx) => {
                    const col = halfCols + cIdx + 1;
                    const key = `${col},${row}`;
                    const isLit = selectedKeys.includes(key);
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => toggleRightCell(col, row)}
                        className={`w-13 h-13 md:w-16 md:h-16 rounded-xl border-2 transition-transform active:scale-95 cursor-pointer ${
                          isLit
                            ? 'bg-sky-400 border-white shadow-[0_0_16px_rgba(56,189,248,0.8)]'
                            : 'bg-slate-950/90 border-amber-400/40'
                        }`}
                        aria-label={`Colonna ${col}, Riga ${row}`}
                      />
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Controlli in fascia bassa */}
      <div className="shrink-0 flex flex-wrap items-center justify-between gap-3">
        <span className="px-4 py-2 rounded-xl bg-slate-900 border-2 border-amber-400/70 text-amber-100 font-black text-xl">
          Caselle accese: {selectedKeys.length} / {config.solutionCells.length}
        </span>

        <div className="flex items-center gap-3 ml-auto">
          <button
            type="button"
            onClick={() => {
              playClick();
              setSelectedKeys([]);
            }}
            disabled={selectedKeys.length === 0}
            className="min-h-14 px-5 rounded-2xl bg-slate-800 border-2 border-amber-400/70 text-amber-100 font-bold text-xl flex items-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Azzera</span>
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            disabled={selectedKeys.length === 0}
            className="min-h-14 px-8 rounded-2xl bg-emerald-400 text-slate-950 font-black text-xl md:text-2xl flex items-center gap-2 shadow-lg disabled:opacity-45 cursor-pointer"
          >
            <CheckCircle2 className="w-6 h-6" />
            <span>Conferma Sigillo</span>
          </button>
        </div>
      </div>
    </div>
  );
}
