import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { Clock, Map as MapIcon, Maximize2, Minimize2, Music, Volume2, VolumeX } from 'lucide-react';
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
  const musicEnabled = useGameStore((s) => s.musicEnabled);
  const toggleMusic = useGameStore((s) => s.toggleMusic);

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
    <div className="h-screen w-screen overflow-hidden select-none bg-[#162646] text-[#2B190E] flex flex-col">
      {/* TOP BAR — 10% (Cornice in legno caldo e ottone) */}
      <header className="h-[10%] min-h-[68px] shrink-0 px-4 md:px-6 wood-frame-top flex items-center justify-between gap-4 z-30">
        <div className="flex items-center gap-3 min-w-0">
          {showMapButton && onOpenMap && (
            <button
              type="button"
              onClick={() => {
                playClick();
                onOpenMap();
              }}
              className="btn-3d btn-3d-gold min-h-12 min-w-12 px-4 rounded-2xl font-bold text-lg flex items-center gap-2 shrink-0 cursor-pointer"
              aria-label="Torna alla Mappa della Torre"
            >
              <MapIcon className="w-6 h-6" />
              <span className="hidden sm:inline">Mappa</span>
            </button>
          )}

          <div className="min-w-0">
            <h1 className="font-display text-xl md:text-2xl font-bold text-[#FFE38E] drop-shadow-[0_2px_0_#2B170C] truncate leading-tight">
              {title}
            </h1>
            {subtitle && (
              <p className="text-sm md:text-base font-extrabold text-[#FFF3D6] truncate leading-tight">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Controlli di servizio in alto a destra */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => {
              playClick();
              toggleMusic();
            }}
            className="btn-3d btn-3d-wood relative min-h-12 min-w-12 rounded-2xl flex items-center justify-center cursor-pointer"
            aria-label={musicEnabled ? 'Disattiva musica natalizia' : 'Attiva musica natalizia'}
            title={musicEnabled ? 'Disattiva musica natalizia' : 'Attiva musica natalizia'}
          >
            <Music
              className={`w-6 h-6 ${musicEnabled ? 'text-[#FFE38E]' : 'text-[#FF8C8E] opacity-75'}`}
            />
            {!musicEnabled && (
              <span
                aria-hidden="true"
                className="pointer-events-none absolute w-7 h-0.5 bg-[#FF8C8E] -rotate-45 rounded-full"
              />
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              toggleSound();
              playClick();
            }}
            className="btn-3d btn-3d-wood min-h-12 min-w-12 rounded-2xl flex items-center justify-center cursor-pointer"
            aria-label={soundEnabled ? 'Disattiva effetti sonori' : 'Attiva effetti sonori'}
            title={soundEnabled ? 'Disattiva effetti sonori' : 'Attiva effetti sonori'}
          >
            {soundEnabled ? (
              <Volume2 className="w-6 h-6 text-[#FFE38E]" />
            ) : (
              <VolumeX className="w-6 h-6 text-[#FF8C8E]" />
            )}
          </button>

          <button
            type="button"
            onClick={toggleFullscreen}
            className="btn-3d btn-3d-wood min-h-12 min-w-12 rounded-2xl flex items-center justify-center cursor-pointer"
            aria-label={isFullscreen ? 'Esci da schermo intero' : 'Schermo intero'}
          >
            {isFullscreen ? (
              <Minimize2 className="w-6 h-6 text-[#FFE38E]" />
            ) : (
              <Maximize2 className="w-6 h-6 text-[#FFE38E]" />
            )}
          </button>

          {/* Icona Orologio: pressione continua 3s per Pannello Maestra */}
          <button
            type="button"
            onPointerDown={startHold}
            onPointerUp={cancelHold}
            onPointerLeave={cancelHold}
            onPointerCancel={cancelHold}
            onContextMenu={(e) => e.preventDefault()}
            className="btn-3d btn-3d-wood relative min-h-12 min-w-12 w-12 h-12 rounded-full flex items-center justify-center cursor-pointer"
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
                stroke="#FFD859"
                strokeWidth="4.5"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              />
            </svg>
            <Clock className="w-6 h-6 text-[#FFE38E] relative z-10" />
          </button>
        </div>
      </header>

      {/* STAGE CENTRALE — 70% */}
      <main className="relative h-[70%] w-full overflow-hidden flex flex-col">
        {stage}
      </main>

      {/* BOTTOM DOCK — 20% (fascia ergonomica bassa per bambini) */}
      <footer className="h-[20%] min-h-[114px] shrink-0 wood-frame-bottom px-4 md:px-6 py-2 flex items-center justify-between gap-4 z-30">
        {bottomDock}
      </footer>
    </div>
  );
}
