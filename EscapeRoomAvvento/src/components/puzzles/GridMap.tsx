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
      <div className="storybook-panel rounded-2xl px-4 py-2 flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-display text-lg md:text-2xl font-bold text-[#3A2314]">
          {config.promptTitle}
        </h2>
        <button
          type="button"
          onClick={() => {
            playClick();
            setStepsModalOpen(true);
          }}
          className="btn-3d btn-3d-gold min-h-12 px-4 rounded-xl font-bold text-lg flex items-center gap-2 cursor-pointer"
        >
          <BookOpen className="w-5 h-5" />
          <span>Ingrandisci Passi</span>
        </button>
      </div>

      {/* Griglia 5x5 su pergamena + Bussola e passi */}
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-3 items-center">
        {/* Griglia */}
        <div
          style={{ touchAction: 'none' }}
          className="lg:col-span-7 flex items-center justify-center h-full"
        >
          <div className="storybook-panel rounded-3xl p-3">
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
                  className="text-center font-display font-bold text-xl text-[#63422B]"
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
                  <div className="text-center font-display font-bold text-xl text-[#63422B]">
                    {row}
                  </div>
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
                        className={`h-12 md:h-13 rounded-xl border-[3px] font-display font-bold text-lg flex flex-col items-center justify-center relative active:scale-95 transition-transform cursor-pointer ${
                          isSelected
                            ? 'bg-[#4FE08A] text-[#0D351C] border-[#14532D] ring-2 ring-[#8EF0B3] shadow-[0_3px_0_#14532D]'
                            : isStart
                            ? 'bg-[#FFD859] text-[#3A2314] border-[#3A2314] shadow-[0_3px_0_#9A5B0A]'
                            : isMarked
                            ? 'bg-[#74D4FF] text-[#0A2E47] border-[#0E6091] shadow-[0_3px_0_#0E6091]'
                            : 'bg-[#FFFDF7] text-[#63422B] border-[#D4B27D] hover:bg-[#FFF5D9]'
                        }`}
                        aria-label={`Cella ${cellId}`}
                      >
                        {isSelected ? (
                          <MapPin className="w-6 h-6" />
                        ) : isStart ? (
                          <Flag className="w-5 h-5" />
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

        {/* Bussola illustrata + Elenco passi su taccuino */}
        <div className="lg:col-span-5 h-full flex flex-col justify-between gap-2.5 min-h-0">
          {/* Rosa dei venti N/S/E/O */}
          <div className="storybook-panel rounded-3xl p-3 flex items-center justify-around">
            <div className="relative w-24 h-24 rounded-full bg-[#FFFDF7] border-[3px] border-[#3A2314] ring-3 ring-[#FFD859] flex items-center justify-center shadow-inner">
              <Compass className="w-8 h-8 text-[#B47028]" />
              <span className="absolute top-0.5 left-1/2 -translate-x-1/2 font-display text-base font-bold text-[#E04248]">
                N
              </span>
              <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 font-display text-base font-bold text-[#3A2314]">
                S
              </span>
              <span className="absolute left-2 top-1/2 -translate-y-1/2 font-display text-base font-bold text-[#3A2314]">
                O
              </span>
              <span className="absolute right-2 top-1/2 -translate-y-1/2 font-display text-base font-bold text-[#3A2314]">
                E
              </span>
            </div>
            <div className="text-left space-y-1.5">
              <p className="text-lg font-extrabold text-[#63422B]">
                Partenza:{' '}
                <span className="px-2.5 py-0.5 rounded-lg bg-[#FFD859] border-2 border-[#3A2314] font-display text-[#3A2314]">
                  {config.startCell}
                </span>
              </p>
              <p className="text-lg font-extrabold text-[#63422B]">
                Arrivo:{' '}
                <span className="px-2.5 py-0.5 rounded-lg bg-[#DCFCE7] border-2 border-[#1F8B4C] font-display text-[#14532D]">
                  {selectedCell ?? '—'}
                </span>
              </p>
            </div>
          </div>

          {/* Lista compatta passi */}
          <ol className="storybook-panel flex-1 min-h-0 overflow-y-auto rounded-3xl p-3 space-y-1.5 text-base md:text-lg font-extrabold text-[#2B190E]">
            {config.steps.map((step, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="w-6 h-6 rounded-full bg-[#FFD859] border-2 border-[#3A2314] font-display text-sm font-bold text-[#3A2314] flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
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
          className={`btn-3d min-h-14 px-5 rounded-2xl font-bold text-lg cursor-pointer ${
            markerMode ? 'btn-3d-sky' : 'btn-3d-cream'
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
            className="btn-3d btn-3d-cream min-h-14 px-5 rounded-2xl font-bold text-xl flex items-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Azzera</span>
          </button>

          <button
            type="button"
            disabled={!selectedCell}
            onClick={handleConfirm}
            className="btn-3d btn-3d-green min-h-14 px-8 rounded-2xl font-bold text-xl md:text-2xl flex items-center gap-2 cursor-pointer"
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
            className="fixed inset-0 z-50 bg-[#0F1B35]/78 backdrop-blur-[2px] flex items-center justify-center p-5"
            onClick={() => setStepsModalOpen(false)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="storybook-panel w-full max-w-4xl max-h-[90vh] rounded-[30px] p-6 md:p-8 flex flex-col gap-4"
            >
              <div className="flex items-center justify-between border-b-2 border-[#D4B27D] pb-3">
                <h3 className="font-display text-2xl md:text-3xl font-bold text-[#3A2314]">
                  Istruzioni del Percorso
                </h3>
                <button
                  type="button"
                  onClick={() => setStepsModalOpen(false)}
                  className="btn-3d btn-3d-gold min-h-14 px-6 rounded-2xl font-bold text-xl flex items-center gap-2 cursor-pointer"
                >
                  <X className="w-6 h-6" />
                  <span>Chiudi</span>
                </button>
              </div>
              <ol className="flex-1 overflow-y-auto space-y-3">
                {config.steps.map((step, idx) => (
                  <li
                    key={idx}
                    className="storybook-subcard rounded-2xl p-3.5 text-2xl font-extrabold text-[#2B190E] flex items-center gap-4"
                  >
                    <span className="w-11 h-11 shrink-0 rounded-full bg-[#FFD859] border-[3px] border-[#3A2314] text-[#3A2314] font-display font-bold flex items-center justify-center shadow-[0_2px_0_#3A2314]">
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
    <div className="relative z-20 w-full h-full flex flex-col justify-between p-3 md:p-4 gap-3 max-w-5xl mx-auto">
      <div className="storybook-panel rounded-2xl px-5 py-2.5 text-center">
        <h2 className="font-display text-xl md:text-2xl font-bold text-[#3A2314]">
          {config.promptTitle}
        </h2>
        <p className="text-base md:text-lg font-extrabold text-[#63422B]">
          Tocca le caselle sulla metà destra per completare il sigillo a specchio!
        </p>
      </div>

      {/* Griglia 6x5 con asse dorato verticale tra col 3 e 4 */}
      <div
        style={{ touchAction: 'none' }}
        className="flex-1 min-h-0 flex items-center justify-center"
      >
        <div className="storybook-panel rounded-3xl p-4 flex items-center gap-3.5">
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
                        className={`w-12 h-12 md:w-15 md:h-15 rounded-xl border-[3px] flex items-center justify-center ${
                          isLit
                            ? 'bg-[#FFD859] border-[#3A2314] shadow-[0_4px_0_#9A5B0A]'
                            : 'bg-[#F3E5C8] border-[#D4B27D]'
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
            className="w-3 self-stretch rounded-full bg-gradient-to-b from-[#FFE680] via-[#F5B21B] to-[#FFE680] border-2 border-[#3A2314] shadow-[0_0_16px_rgba(245,178,27,0.75)]"
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
                        className={`w-12 h-12 md:w-15 md:h-15 rounded-xl border-[3px] transition-transform active:scale-95 cursor-pointer ${
                          isLit
                            ? 'bg-[#38BDF8] border-[#0C4A6E] shadow-[0_4px_0_#0E6091]'
                            : 'bg-[#FFFDF7] border-[#C9A66B] hover:bg-[#E0F2FE]'
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
        <span className="storybook-panel px-4 py-2 rounded-2xl font-display font-bold text-xl text-[#2B190E]">
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
            className="btn-3d btn-3d-cream min-h-14 px-5 rounded-2xl font-bold text-xl flex items-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Azzera</span>
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            disabled={selectedKeys.length === 0}
            className="btn-3d btn-3d-green min-h-14 px-8 rounded-2xl font-bold text-xl md:text-2xl flex items-center gap-2 cursor-pointer"
          >
            <CheckCircle2 className="w-6 h-6" />
            <span>Conferma Sigillo</span>
          </button>
        </div>
      </div>
    </div>
  );
}
