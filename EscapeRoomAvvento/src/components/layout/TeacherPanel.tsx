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
          className="fixed inset-0 z-50 bg-[#0F1B35]/80 backdrop-blur-[2px] flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.92, opacity: 0 }}
            className="storybook-panel w-full max-w-4xl max-h-[92vh] rounded-[30px] p-6 flex flex-col gap-5 overflow-hidden"
          >
            {/* Header Registro della Maestra */}
            <div className="flex items-center justify-between gap-4 border-b-2 border-[#D4B27D] pb-3">
              <div className="flex items-center gap-3 flex-wrap">
                <div className="w-11 h-11 rounded-2xl bg-[#FFD859] border-[3px] border-[#3A2314] flex items-center justify-center shadow-[0_3px_0_#3A2314]">
                  <KeyRound className="w-6 h-6 text-[#3A2314]" />
                </div>
                <h2 className="font-display text-2xl md:text-3xl font-bold text-[#2B190E]">
                  Registro della Maestra
                </h2>
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-extrabold border-2 ${
                    offlineReady
                      ? 'bg-[#DCFCE7] border-[#22A85A] text-[#14532D]'
                      : 'bg-[#F8ECCF] border-[#C9A66B] text-[#63422B]'
                  }`}
                >
                  <WifiOff className="w-4 h-4" />
                  <span>{offlineReady ? 'Pronto Offline' : 'Offline PWA attivo in build'}</span>
                </span>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="btn-3d btn-3d-cream min-h-14 min-w-14 px-5 rounded-2xl font-bold text-xl flex items-center gap-2 cursor-pointer"
              >
                <X className="w-6 h-6" />
                Chiudi
              </button>
            </div>

            {!isUnlocked ? (
              /* Tastierino PIN touch (zero <input> nativi) */
              <div className="flex-1 flex flex-col items-center justify-center gap-5 py-2">
                <p className="text-2xl font-extrabold text-[#2B190E]">
                  Inserisci il PIN Maestra (4 cifre)
                </p>

                <div className="flex items-center gap-4">
                  {[0, 1, 2, 3].map((idx) => (
                    <div
                      key={idx}
                      className={`w-16 h-16 rounded-2xl border-[3px] flex items-center justify-center text-3xl font-black shadow-inner ${
                        pinError
                          ? 'border-[#E04248] bg-[#FFE4E6] text-[#9F1239]'
                          : 'border-[#3A2314] bg-white text-[#3A2314]'
                      }`}
                    >
                      {pinBuffer[idx] ? '●' : ''}
                    </div>
                  ))}
                </div>

                {pinError && (
                  <p className="text-xl font-extrabold text-[#B91C1C]">
                    PIN errato. Riprova!
                  </p>
                )}

                <div className="grid grid-cols-3 gap-3 w-full max-w-xs">
                  {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => handlePinDigit(d)}
                      className="btn-3d btn-3d-cream min-h-14 rounded-2xl font-bold text-2xl cursor-pointer"
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
                    className="btn-3d btn-3d-berry min-h-14 rounded-2xl font-bold text-xl cursor-pointer"
                  >
                    C
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePinDigit('0')}
                    className="btn-3d btn-3d-cream min-h-14 rounded-2xl font-bold text-2xl cursor-pointer"
                  >
                    0
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      playClick();
                      setPinBuffer((prev) => prev.slice(0, -1));
                    }}
                    className="btn-3d btn-3d-gold min-h-14 rounded-2xl flex items-center justify-center cursor-pointer"
                    aria-label="Cancella cifra"
                  >
                    <Delete className="w-7 h-7" />
                  </button>
                </div>
              </div>
            ) : (
              /* Controlli Maestra sbloccati */
              <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                {statusMessage && (
                  <div className="rounded-2xl bg-[#DCFCE7] border-2 border-[#22A85A] px-5 py-3 text-xl font-extrabold text-[#14532D] flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6 shrink-0" />
                    <span>{statusMessage}</span>
                  </div>
                )}

                {/* Soluzione stazione corrente + Ponte Fisico */}
                {(currentStationTitle || currentSolutionSummary || physicalBridgeNote) && (
                  <div className="storybook-subcard rounded-2xl p-4 space-y-2.5">
                    <h3 className="font-display text-xl font-bold text-[#63422B]">
                      Stazione Corrente: <span className="text-[#2B190E]">{currentStationTitle ?? '—'}</span>
                    </h3>
                    {currentSolutionSummary && (
                      <p className="text-xl font-extrabold text-[#2B190E]">
                        Soluzione:{' '}
                        <span className="px-2.5 py-0.5 rounded-lg bg-[#DCFCE7] text-[#14532D] border border-[#22A85A]">
                          {currentSolutionSummary}
                        </span>
                      </p>
                    )}
                    {physicalBridgeNote && (
                      <p className="text-lg font-bold text-[#4A2E1B] bg-[#FFFDF7] border-2 border-[#D4B27D] rounded-xl px-4 py-2">
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
                        className="btn-3d btn-3d-green mt-1 min-h-14 px-6 rounded-2xl font-bold text-xl flex items-center gap-2 cursor-pointer"
                      >
                        <Unlock className="w-6 h-6" />
                        Sblocca Stazione Corrente
                      </button>
                    )}
                  </div>
                )}

                {/* Salto diretto a stazione (ricostruisce inventario) */}
                <div className="storybook-subcard rounded-2xl p-4 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="font-display text-xl font-bold text-[#2B190E]">
                      Salta alla Stazione (ricostruisce automaticamente lo zaino)
                    </h3>
                    <button
                      type="button"
                      onClick={() => {
                        playClick();
                        setTeacherUnlockedAll(!teacherUnlockedAll);
                      }}
                      className={`btn-3d min-h-12 px-4 rounded-xl font-bold text-lg cursor-pointer ${
                        teacherUnlockedAll ? 'btn-3d-gold' : 'btn-3d-cream'
                      }`}
                    >
                      Anteprima libera: {teacherUnlockedAll ? 'ATTIVA' : 'OFF'}
                    </button>
                  </div>

                  <div className="grid grid-cols-5 sm:grid-cols-7 gap-2.5">
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
                        className={`btn-3d min-h-14 rounded-xl font-bold text-xl cursor-pointer ${
                          highestUnlockedStation === id ? 'btn-3d-gold' : 'btn-3d-cream'
                        }`}
                      >
                        S{id}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Codice di ripresa compatto */}
                <div className="storybook-subcard rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h3 className="font-display text-xl font-bold text-[#63422B]">
                      Codice di Ripresa sul Registro
                    </h3>
                    <p className="font-display text-2xl font-bold tracking-widest text-[#2B190E] mt-1">
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
                      className="btn-3d btn-3d-cream min-h-14 min-w-14 rounded-xl font-bold text-2xl cursor-pointer"
                    >
                      -
                    </button>
                    <span className="px-3 py-2 rounded-xl bg-white border-2 border-[#C9A66B] font-display text-xl font-bold text-[#2B190E]">
                      CL5-S{String(importStationNum).padStart(2, '0')}-OK
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        playClick();
                        setImportStationNum((prev) => (prev < 13 ? ((prev + 1) as StationId) : 1));
                      }}
                      className="btn-3d btn-3d-cream min-h-14 min-w-14 rounded-xl font-bold text-2xl cursor-pointer"
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
                      className="btn-3d btn-3d-sky min-h-14 px-5 rounded-xl font-bold text-lg cursor-pointer"
                    >
                      Applica
                    </button>
                  </div>
                </div>

                {/* Reset completo con doppia conferma */}
                <div className="rounded-2xl bg-[#FFF1F2] border-2 border-[#E04248] p-4 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3 text-[#881337]">
                    <ShieldAlert className="w-7 h-7 text-[#E04248] shrink-0" />
                    <span className="text-xl font-extrabold">
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
                      className="btn-3d btn-3d-berry min-h-14 px-6 rounded-xl font-bold text-xl flex items-center gap-2 cursor-pointer"
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
                        className="btn-3d btn-3d-cream min-h-14 px-5 rounded-xl font-bold text-xl cursor-pointer"
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
                        className="btn-3d btn-3d-berry min-h-14 px-6 rounded-xl font-bold text-xl cursor-pointer"
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
