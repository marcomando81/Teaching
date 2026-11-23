import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { Clock, Map as MapIcon, Maximize2, Minimize2, Volume2, VolumeX } from 'lucide-react';
import { useGameStore } from '../../store/useGameStore';
import { playClick } from '../../audio/soundEngine';

export interface LimLayoutProps {
  title: string;
  subtitle?: string;
  showMapButton?: boolean;
  onOpenMap?: () => void;
  onOpenTeacherPanel: () => void;
  stage: ReactNode;
  bottomDock: ReactNode;
}

const HOLD_DURATION_MS = 3000;

export function LimLayout({
  title,
  subtitle,
  showMapButton = false,
  onOpenMap,
  onOpenTeacherPanel,
  stage,
  bottomDock,
}: LimLayoutProps) {
  const soundEnabled = useGameStore((s) => s.soundEnabled);
  const toggleSound = useGameStore((s) => s.toggleSound);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);

  const holdStartRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const onFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  const toggleFullscreen = useCallback(() => {
    playClick();
    if (!document.fullscreenElement) {
      void document.documentElement.requestFullscreen?.();
    } else {
      void document.exitFullscreen?.();
    }
  }, []);

  const cancelHold = useCallback(() => {
    holdStartRef.current = null;
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    setHoldProgress(0);
  }, []);

  const startHold = useCallback(() => {
    cancelHold();
    holdStartRef.current = performance.now();

    const tick = (now: number) => {
      if (holdStartRef.current === null) return;
      const elapsed = now - holdStartRef.current;
      const ratio = Math.min(1, elapsed / HOLD_DURATION_MS);
      setHoldProgress(ratio);

      if (ratio >= 1) {
        cancelHold();
        playClick();
        onOpenTeacherPanel();
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
  }, [cancelHold, onOpenTeacherPanel]);

  useEffect(() => cancelHold, [cancelHold]);

  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - holdProgress);

  return (
    <div className="h-screen w-screen overflow-hidden select-none bg-[#0B132B] text-amber-50 flex flex-col">
      {/* TOP BAR — 10% */}
      <header className="h-[10%] min-h-[64px] shrink-0 px-4 md:px-6 bg-slate-950/95 border-b-2 border-amber-400/70 flex items-center justify-between gap-4 z-30">
        <div className="flex items-center gap-3 min-w-0">
          {showMapButton && onOpenMap && (
            <button
              type="button"
              onClick={() => {
                playClick();
                onOpenMap();
              }}
              className="min-h-12 min-w-12 px-4 rounded-xl bg-slate-900 border-2 border-amber-400/80 text-amber-100 font-bold text-lg flex items-center gap-2 active:scale-95 transition-transform shrink-0 cursor-pointer"
              aria-label="Torna alla Mappa della Torre"
            >
              <MapIcon className="w-6 h-6 text-amber-300" />
              <span className="hidden sm:inline">Mappa</span>
            </button>
          )}

          <div className="min-w-0">
            <h1 className="text-xl md:text-2xl font-extrabold text-amber-300 truncate leading-tight">
              {title}
            </h1>
            {subtitle && (
              <p className="text-sm md:text-base font-semibold text-amber-100 truncate leading-tight">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Controlli di servizio in alto a destra */}
        <div className="flex items-center gap-2 md:gap-3 shrink-0">
          <button
            type="button"
            onClick={() => {
              toggleSound();
              playClick();
            }}
            className="min-h-12 min-w-12 rounded-xl bg-slate-900 border-2 border-amber-400/70 text-amber-200 flex items-center justify-center active:scale-95 transition-transform cursor-pointer"
            aria-label={soundEnabled ? 'Disattiva audio' : 'Attiva audio'}
          >
            {soundEnabled ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6 text-rose-300" />}
          </button>

          <button
            type="button"
            onClick={toggleFullscreen}
            className="min-h-12 min-w-12 rounded-xl bg-slate-900 border-2 border-amber-400/70 text-amber-200 flex items-center justify-center active:scale-95 transition-transform cursor-pointer"
            aria-label={isFullscreen ? 'Esci da schermo intero' : 'Schermo intero'}
          >
            {isFullscreen ? <Minimize2 className="w-6 h-6" /> : <Maximize2 className="w-6 h-6" />}
          </button>

          {/* Icona Orologio: pressione continua 3s per Pannello Maestra */}
          <button
            type="button"
            onPointerDown={startHold}
            onPointerUp={cancelHold}
            onPointerLeave={cancelHold}
            onPointerCancel={cancelHold}
            onContextMenu={(e) => e.preventDefault()}
            className="relative min-h-12 min-w-12 w-12 h-12 rounded-full bg-slate-900 border-2 border-amber-400/70 text-amber-300 flex items-center justify-center active:scale-95 transition-transform cursor-pointer"
            aria-label="Tieni premuto 3 secondi per aprire il Pannello Maestra"
          >
            <svg
              className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none"
              viewBox="0 0 52 52"
            >
              <circle
                cx="26"
                cy="26"
                r={radius}
                fill="none"
                stroke="#F59E0B"
                strokeWidth="4"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              />
            </svg>
            <Clock className="w-6 h-6 relative z-10" />
          </button>
        </div>
      </header>

      {/* STAGE CENTRALE — 70% */}
      <main className="relative h-[70%] w-full overflow-hidden flex flex-col">
        {stage}
      </main>

      {/* BOTTOM DOCK — 20% (fascia ergonomica bassa per bambini) */}
      <footer className="h-[20%] min-h-[112px] shrink-0 bg-slate-950/95 border-t-2 border-amber-400/80 px-4 md:px-6 py-2 flex items-center justify-between gap-4 z-30">
        {bottomDock}
      </footer>
    </div>
  );
}
