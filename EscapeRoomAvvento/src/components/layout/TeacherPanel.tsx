import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  CheckCircle2,
  Delete,
  KeyRound,
  RotateCcw,
  ShieldAlert,
  Unlock,
  WifiOff,
  X,
} from 'lucide-react';
import { useGameStore } from '../../store/useGameStore';
import type { StationId } from '../../types/game';
import { playClick, playError, playSuccess } from '../../audio/soundEngine';

const TEACHER_PIN = '1225';
const ALL_STATIONS: StationId[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];

export interface TeacherPanelProps {
  isOpen: boolean;
  onClose: () => void;
  currentStationTitle?: string;
  currentSolutionSummary?: string;
  physicalBridgeNote?: string;
  onForceUnlockCurrent?: () => void;
}

export function TeacherPanel({
  isOpen,
  onClose,
  currentStationTitle,
  currentSolutionSummary,
  physicalBridgeNote,
  onForceUnlockCurrent,
}: TeacherPanelProps) {
  const highestUnlockedStation = useGameStore((s) => s.highestUnlockedStation);
  const teacherUnlockedAll = useGameStore((s) => s.teacherUnlockedAll);
  const setTeacherUnlockedAll = useGameStore((s) => s.setTeacherUnlockedAll);
  const jumpToStation = useGameStore((s) => s.jumpToStation);
  const exportSaveCode = useGameStore((s) => s.exportSaveCode);
  const importSaveCode = useGameStore((s) => s.importSaveCode);
  const resetGame = useGameStore((s) => s.resetGame);

  const [isUnlocked, setIsUnlocked] = useState(false);
  const [pinBuffer, setPinBuffer] = useState('');
  const [pinError, setPinError] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const [importStationNum, setImportStationNum] = useState<StationId>(highestUnlockedStation);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [offlineReady, setOfflineReady] = useState(false);

  useEffect(() => {
    if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
      void navigator.serviceWorker.getRegistration().then((reg) => {
        setOfflineReady(Boolean(reg?.active));
      });
    }
  }, [isOpen]);

  const handleClose = () => {
    playClick();
    setPinBuffer('');
    setPinError(false);
    setConfirmReset(false);
    setStatusMessage(null);
    setIsUnlocked(false);
    onClose();
  };

  const handlePinDigit = (digit: string) => {
    playClick();
    setPinError(false);
    const next = (pinBuffer + digit).slice(0, 4);
    setPinBuffer(next);

    if (next.length === 4) {
      if (next === TEACHER_PIN) {
        playSuccess();
        setIsUnlocked(true);
        setPinBuffer('');
      } else {
        playError();
        setPinError(true);
        setPinBuffer('');
      }
    }
  };

  const saveCode = exportSaveCode();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-slate-950/90 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.92, opacity: 0 }}
            className="w-full max-w-4xl max-h-[92vh] rounded-3xl bg-slate-900 border-4 border-amber-400 shadow-2xl p-6 flex flex-col gap-5 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between gap-4 border-b-2 border-amber-400/40 pb-3">
              <div className="flex items-center gap-3 flex-wrap">
                <KeyRound className="w-8 h-8 text-amber-300" />
                <h2 className="text-2xl md:text-3xl font-extrabold text-amber-300">
                  Pannello Maestra
                </h2>
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold border ${
                    offlineReady
                      ? 'bg-emerald-950/90 border-emerald-400 text-emerald-200'
                      : 'bg-slate-800 border-amber-400/50 text-amber-100'
                  }`}
                >
                  <WifiOff className="w-4 h-4" />
                  <span>{offlineReady ? 'Pronto Offline' : 'Offline PWA attivo in build'}</span>
                </span>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="min-h-14 min-w-14 px-5 rounded-2xl bg-slate-800 border-2 border-amber-400/80 text-white font-bold text-xl flex items-center gap-2 active:scale-95 cursor-pointer"
              >
                <X className="w-6 h-6" />
                Chiudi
              </button>
            </div>

            {!isUnlocked ? (
              /* Tastierino PIN touch (zero <input> nativi) */
              <div className="flex-1 flex flex-col items-center justify-center gap-5 py-2">
                <p className="text-2xl font-bold text-amber-50">
                  Inserisci il PIN Maestra (4 cifre)
                </p>

                <div className="flex items-center gap-4">
                  {[0, 1, 2, 3].map((idx) => (
                    <div
                      key={idx}
                      className={`w-16 h-16 rounded-2xl border-4 flex items-center justify-center text-3xl font-black ${
                        pinError
                          ? 'border-rose-400 bg-rose-950/60 text-rose-200'
                          : 'border-amber-400 bg-slate-950 text-amber-300'
                      }`}
                    >
                      {pinBuffer[idx] ? '●' : ''}
                    </div>
                  ))}
                </div>

                {pinError && (
                  <p className="text-xl font-bold text-rose-300">
                    PIN errato. Riprova!
                  </p>
                )}

                <div className="grid grid-cols-3 gap-3 w-full max-w-xs">
                  {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => handlePinDigit(d)}
                      className="min-h-14 rounded-2xl bg-slate-800 border-2 border-amber-400/70 text-white font-black text-2xl active:scale-95 cursor-pointer"
                    >
                      {d}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      playClick();
                      setPinBuffer('');
                      setPinError(false);
                    }}
                    className="min-h-14 rounded-2xl bg-slate-800 border-2 border-rose-400/70 text-rose-200 font-bold text-lg active:scale-95 cursor-pointer"
                  >
                    C
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePinDigit('0')}
                    className="min-h-14 rounded-2xl bg-slate-800 border-2 border-amber-400/70 text-white font-black text-2xl active:scale-95 cursor-pointer"
                  >
                    0
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      playClick();
                      setPinBuffer((prev) => prev.slice(0, -1));
                    }}
                    className="min-h-14 rounded-2xl bg-slate-800 border-2 border-amber-400/70 text-amber-200 flex items-center justify-center active:scale-95 cursor-pointer"
                    aria-label="Cancella cifra"
                  >
                    <Delete className="w-7 h-7" />
                  </button>
                </div>
              </div>
            ) : (
              /* Controlli Maestra sbloccati */
              <div className="flex-1 overflow-y-auto space-y-5 pr-1">
                {statusMessage && (
                  <div className="rounded-2xl bg-emerald-950/90 border-2 border-emerald-400 px-5 py-3 text-xl font-bold text-emerald-200 flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6 shrink-0" />
                    <span>{statusMessage}</span>
                  </div>
                )}

                {/* Soluzione stazione corrente + Ponte Fisico */}
                {(currentStationTitle || currentSolutionSummary || physicalBridgeNote) && (
                  <div className="rounded-2xl bg-slate-950 border-2 border-amber-400/70 p-4 space-y-2">
                    <h3 className="text-xl font-extrabold text-amber-300">
                      Stazione Corrente: {currentStationTitle ?? '—'}
                    </h3>
                    {currentSolutionSummary && (
                      <p className="text-xl font-bold text-white">
                        Soluzione: <span className="text-emerald-300">{currentSolutionSummary}</span>
                      </p>
                    )}
                    {physicalBridgeNote && (
                      <p className="text-lg font-semibold text-amber-100 bg-amber-950/60 border border-amber-400/60 rounded-xl px-4 py-2">
                        Ponte fisico: {physicalBridgeNote}
                      </p>
                    )}
                    {onForceUnlockCurrent && (
                      <button
                        type="button"
                        onClick={() => {
                          playSuccess();
                          onForceUnlockCurrent();
                          handleClose();
                        }}
                        className="mt-2 min-h-14 px-6 rounded-xl bg-emerald-500 text-slate-950 font-black text-xl flex items-center gap-2 active:scale-95 cursor-pointer"
                      >
                        <Unlock className="w-6 h-6" />
                        Sblocca Stazione Corrente
                      </button>
                    )}
                  </div>
                )}

                {/* Salto diretto a stazione (ricostruisce inventario) */}
                <div className="rounded-2xl bg-slate-950 border-2 border-amber-400/70 p-4 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-xl font-extrabold text-amber-300">
                      Salta alla Stazione (ricostruisce automaticamente lo zaino)
                    </h3>
                    <button
                      type="button"
                      onClick={() => {
                        playClick();
                        setTeacherUnlockedAll(!teacherUnlockedAll);
                      }}
                      className={`min-h-12 px-4 rounded-xl border-2 font-bold text-lg cursor-pointer ${
                        teacherUnlockedAll
                          ? 'bg-amber-400 text-slate-950 border-amber-300'
                          : 'bg-slate-800 text-amber-100 border-amber-400/60'
                      }`}
                    >
                      Anteprima libera: {teacherUnlockedAll ? 'ATTIVA' : 'OFF'}
                    </button>
                  </div>

                  <div className="grid grid-cols-5 sm:grid-cols-7 gap-2">
                    {ALL_STATIONS.map((id) => (
                      <button
                        key={id}
                        type="button"
                        onClick={() => {
                          playClick();
                          jumpToStation(id);
                          setImportStationNum(id);
                          setStatusMessage(
                            `Classe impostata alla Stazione ${id} con inventario ricostruito.`
                          );
                        }}
                        className={`min-h-14 rounded-xl border-2 font-black text-xl active:scale-95 cursor-pointer ${
                          highestUnlockedStation === id
                            ? 'bg-amber-400 text-slate-950 border-white'
                            : 'bg-slate-800 text-amber-100 border-amber-400/60'
                        }`}
                      >
                        S{id}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Codice di ripresa compatto */}
                <div className="rounded-2xl bg-slate-950 border-2 border-amber-400/70 p-4 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-extrabold text-amber-300">
                      Codice di Ripresa sul Registro
                    </h3>
                    <p className="text-2xl font-black tracking-widest text-white mt-1">
                      {saveCode}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        playClick();
                        setImportStationNum((prev) => (prev > 1 ? ((prev - 1) as StationId) : 13));
                      }}
                      className="min-h-14 min-w-14 rounded-xl bg-slate-800 border-2 border-amber-400/70 text-white font-black text-2xl cursor-pointer"
                    >
                      -
                    </button>
                    <span className="px-3 text-xl font-black text-amber-200">
                      CL5-S{String(importStationNum).padStart(2, '0')}-OK
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        playClick();
                        setImportStationNum((prev) => (prev < 13 ? ((prev + 1) as StationId) : 1));
                      }}
                      className="min-h-14 min-w-14 rounded-xl bg-slate-800 border-2 border-amber-400/70 text-white font-black text-2xl cursor-pointer"
                    >
                      +
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const code = `CL5-S${String(importStationNum).padStart(2, '0')}-OK`;
                        if (importSaveCode(code)) {
                          playSuccess();
                          setStatusMessage(`Ripristinato codice ${code}.`);
                        }
                      }}
                      className="min-h-14 px-5 rounded-xl bg-sky-500 text-slate-950 font-black text-lg cursor-pointer"
                    >
                      Applica
                    </button>
                  </div>
                </div>

                {/* Reset completo con doppia conferma */}
                <div className="rounded-2xl bg-rose-950/50 border-2 border-rose-400/80 p-4 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3 text-rose-100">
                    <ShieldAlert className="w-7 h-7 text-rose-300 shrink-0" />
                    <span className="text-xl font-bold">
                      {confirmReset
                        ? 'Sei sicura? Cancella tutti i progressi della classe!'
                        : 'Reset completo della partita'}
                    </span>
                  </div>

                  {!confirmReset ? (
                    <button
                      type="button"
                      onClick={() => {
                        playClick();
                        setConfirmReset(true);
                      }}
                      className="min-h-14 px-6 rounded-xl bg-rose-600 text-white font-black text-xl flex items-center gap-2 cursor-pointer"
                    >
                      <RotateCcw className="w-6 h-6" />
                      Reset Partita
                    </button>
                  ) : (
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          playClick();
                          setConfirmReset(false);
                        }}
                        className="min-h-14 px-5 rounded-xl bg-slate-800 text-white font-bold text-xl cursor-pointer"
                      >
                        Annulla
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          playError();
                          resetGame();
                          handleClose();
                        }}
                        className="min-h-14 px-6 rounded-xl bg-rose-500 text-white font-black text-xl cursor-pointer"
                      >
                        Conferma Reset
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
