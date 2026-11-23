import { useCallback, useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { Lightbulb, Sparkles } from 'lucide-react';
import { useGameStore } from './store/useGameStore';
import { getSolutionSummary, getStationById } from './data/stations';
import { ITEMS_BY_ID } from './data/items';
import type { StationId } from './types/game';
import { LimLayout } from './components/layout/LimLayout';
import { InventoryBar } from './components/layout/InventoryBar';
import { HintModal } from './components/layout/HintModal';
import { TeacherPanel } from './components/layout/TeacherPanel';
import { BrassDoorTransition } from './components/layout/BrassDoorTransition';
import { AmbientParticles } from './components/theater/AmbientParticles';
import { StoryTheater } from './components/theater/StoryTheater';
import { RewardOverlay } from './components/theater/RewardOverlay';
import { TitleScreen } from './components/map/TitleScreen';
import { TowerMap } from './components/map/TowerMap';
import { PuzzleHost } from './components/puzzles/PuzzleHost';
import { SafeImage } from './components/ui/SafeImage';
import {
  playClick,
  playDoorSlide,
  playError,
  playHint,
  playTowerChime,
} from './audio/soundEngine';

export default function App() {
  const currentView = useGameStore((s) => s.currentView);
  const activeStationId = useGameStore((s) => s.activeStationId);
  const stationPhase = useGameStore((s) => s.stationPhase);
  const setView = useGameStore((s) => s.setView);
  const enterStation = useGameStore((s) => s.enterStation);
  const setStationPhase = useGameStore((s) => s.setStationPhase);
  const completeStation = useGameStore((s) => s.completeStation);

  const [doorsClosed, setDoorsClosed] = useState(false);
  const [hintModalOpen, setHintModalOpen] = useState(false);
  const [teacherPanelOpen, setTeacherPanelOpen] = useState(false);
  const [mistakeFeedback, setMistakeFeedback] = useState<string | null>(null);

  const transitionWithDoors = useCallback((action: () => void) => {
    playDoorSlide();
    setDoorsClosed(true);
    window.setTimeout(() => {
      action();
      window.setTimeout(() => {
        setDoorsClosed(false);
      }, 220);
    }, 360);
  }, []);

  const handleOpenMap = useCallback(() => {
    setMistakeFeedback(null);
    transitionWithDoors(() => setView('map'));
  }, [setView, transitionWithDoors]);

  const handleSelectStation = useCallback(
    (stationId: StationId) => {
      setMistakeFeedback(null);
      transitionWithDoors(() => enterStation(stationId));
    },
    [enterStation, transitionWithDoors]
  );

  const activeStation = getStationById(activeStationId);
  const rewardItem = activeStation ? ITEMS_BY_ID[activeStation.rewardItemId] : undefined;

  const handlePuzzleSolve = useCallback(() => {
    setMistakeFeedback(null);
    setStationPhase('outro');
  }, [setStationPhase]);

  const handlePuzzleMistake = useCallback((customFeedback?: string) => {
    playError();
    setMistakeFeedback(customFeedback ?? 'Non è la combinazione giusta! Riprova.');
    window.setTimeout(() => {
      setMistakeFeedback(null);
    }, 3200);
  }, []);

  const handleCollectReward = useCallback(() => {
    if (!activeStation) return;
    completeStation(activeStation.id);
    if (activeStation.id === 13) {
      transitionWithDoors(() => setView('grand_finale'));
    } else {
      transitionWithDoors(() => setView('map'));
    }
  }, [activeStation, completeStation, setView, transitionWithDoors]);

  return (
    <>
      <BrassDoorTransition isClosed={doorsClosed} />

      {currentView === 'title' && (
        <TitleScreen onStart={() => transitionWithDoors(() => setView('map'))} />
      )}

      {currentView === 'map' && (
        <LimLayout
          title="La Torre del Grande Orologio"
          subtitle="Scegli la stazione di oggi"
          onOpenTeacherPanel={() => setTeacherPanelOpen(true)}
          stage={<TowerMap onSelectStation={handleSelectStation} />}
          bottomDock={<InventoryBar />}
        />
      )}

      {currentView === 'station' && (
        <LimLayout
          title={
            activeStation
              ? `Stazione ${activeStation.id} — ${activeStation.title}`
              : `Stazione ${activeStationId}`
          }
          subtitle={activeStation?.actName ?? 'In preparazione'}
          showMapButton
          onOpenMap={handleOpenMap}
          onOpenTeacherPanel={() => setTeacherPanelOpen(true)}
          stage={
            activeStation ? (
              <div className="relative w-full h-full overflow-hidden">
                {stationPhase === 'intro' && (
                  <StoryTheater
                    backgroundPath={activeStation.backgroundPath}
                    backgroundAlt={activeStation.actName}
                    beats={activeStation.introBeats}
                    particleVariant={activeStation.act === 4 ? 'snow' : 'gold_dust'}
                    finishButtonLabel="Apri l'Enigma"
                    onComplete={() => setStationPhase('puzzle')}
                  />
                )}

                {stationPhase === 'puzzle' && (
                  <div className="relative w-full h-full overflow-hidden">
                    <div className="absolute inset-0">
                      <SafeImage
                        src={activeStation.backgroundPath}
                        alt={activeStation.actName}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-slate-950/60" />
                    </div>

                    <PuzzleHost
                      config={activeStation.puzzle}
                      onSolve={handlePuzzleSolve}
                      onMistake={handlePuzzleMistake}
                    />

                    {mistakeFeedback && (
                      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-40 px-6 py-3 rounded-2xl bg-rose-900/95 border-2 border-rose-300 text-white font-extrabold text-xl shadow-2xl">
                        {mistakeFeedback}
                      </div>
                    )}
                  </div>
                )}

                {stationPhase === 'outro' && (
                  <StoryTheater
                    backgroundPath={activeStation.backgroundPath}
                    backgroundAlt={activeStation.actName}
                    beats={activeStation.outroBeats}
                    particleVariant={activeStation.act === 4 ? 'snow' : 'gold_dust'}
                    finishButtonLabel="Ritira Ricompensa"
                    onComplete={() => setStationPhase('reward')}
                  />
                )}

                {stationPhase === 'reward' && rewardItem && (
                  <RewardOverlay item={rewardItem} onCollect={handleCollectReward} />
                )}
              </div>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-4 p-8 text-center">
                <h2 className="text-3xl font-extrabold text-amber-300">
                  Stazione {activeStationId} in arrivo nel Task 5
                </h2>
                <button
                  type="button"
                  onClick={handleOpenMap}
                  className="min-h-16 px-8 rounded-2xl bg-amber-400 text-slate-950 font-black text-2xl cursor-pointer"
                >
                  Torna alla Mappa
                </button>
              </div>
            )
          }
          bottomDock={
            <>
              <InventoryBar />
              {activeStation && stationPhase === 'puzzle' && (
                <button
                  type="button"
                  onClick={() => {
                    playHint();
                    setHintModalOpen(true);
                  }}
                  className="min-h-16 px-6 rounded-2xl bg-sky-400 text-slate-950 font-black text-xl md:text-2xl flex items-center gap-2 shrink-0 shadow-lg active:scale-95 transition-transform cursor-pointer"
                >
                  <Lightbulb className="w-7 h-7" />
                  <span>Indizio</span>
                </button>
              )}
            </>
          }
        />
      )}

      {currentView === 'grand_finale' && (
        <GrandFinaleCelebration onBackToMap={handleOpenMap} />
      )}

      {activeStation && (
        <HintModal
          isOpen={hintModalOpen}
          onClose={() => setHintModalOpen(false)}
          stationTitle={activeStation.title}
          hints={activeStation.hints}
        />
      )}

      <TeacherPanel
        isOpen={teacherPanelOpen}
        onClose={() => setTeacherPanelOpen(false)}
        currentStationTitle={activeStation?.title}
        currentSolutionSummary={
          activeStation ? getSolutionSummary(activeStation.puzzle) : undefined
        }
        physicalBridgeNote={activeStation?.physicalBridgeNote}
        onForceUnlockCurrent={
          currentView === 'station' && activeStation ? handlePuzzleSolve : undefined
        }
      />
    </>
  );
}

function GrandFinaleCelebration({ onBackToMap }: { onBackToMap: () => void }) {
  useEffect(() => {
    playTowerChime(12);
    const colors = ['#F59E0B', '#FDE68A', '#FFFFFF', '#38BDF8'];
    confetti({ particleCount: 140, spread: 100, origin: { y: 0.5 }, colors });
    const timer = window.setTimeout(() => {
      confetti({ particleCount: 100, spread: 120, origin: { y: 0.35 }, colors });
    }, 1100);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className="relative h-screen w-screen overflow-hidden select-none bg-[#0B132B] flex flex-col items-center justify-between p-6 md:p-10 text-center">
      <div className="absolute inset-0">
        <SafeImage
          src="/assets/backgrounds/bg_finale_clockface.webp"
          alt="Il Quadrante della Torre risvegliato"
          className="w-full h-full object-cover animate-ken-burns"
        />
        <div className="absolute inset-0 bg-slate-950/75" />
      </div>

      <AmbientParticles variant="snow" count={26} />

      {/* 3 Ingranaggi Maestri rotanti insieme */}
      <div className="relative z-20 flex items-center justify-center gap-4 md:gap-8 pt-2">
        <div className="w-24 h-24 md:w-32 md:h-32">
          <SafeImage
            src="/assets/gears/gear_bronze.png"
            alt="Ingranaggio di Bronzo"
            className="w-full h-full object-contain animate-rotate-rays"
          />
        </div>
        <div className="w-32 h-32 md:w-40 md:h-40">
          <SafeImage
            src="/assets/gears/gear_gold.png"
            alt="Ingranaggio d'Oro"
            className="w-full h-full object-contain animate-rotate-rays"
          />
        </div>
        <div className="w-24 h-24 md:w-32 md:h-32">
          <SafeImage
            src="/assets/gears/gear_silver.png"
            alt="Ingranaggio d'Argento"
            className="w-full h-full object-contain animate-rotate-rays"
          />
        </div>
      </div>

      {/* Messaggio celebrativo gigante */}
      <div className="relative z-20 max-w-4xl rounded-3xl bg-slate-900/90 border-4 border-amber-400 p-6 md:p-8 shadow-2xl space-y-4">
        <div className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-amber-400/20 border-2 border-amber-400 text-amber-300 font-black text-xl">
          <Sparkles className="w-6 h-6" />
          <span>Il Grande Orologio è Ripartito!</span>
        </div>

        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-amber-300 leading-tight">
          MISSIONE COMPIUTA, MAESTRI OROLOGIAI!
        </h1>

        <p className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white">
          BUONE VACANZE DI NATALE!
        </p>
      </div>

      {/* Pulsante in fascia bassa */}
      <div className="relative z-20 pb-2">
        <button
          type="button"
          onClick={() => {
            playClick();
            onBackToMap();
          }}
          className="min-h-16 px-10 rounded-2xl bg-amber-400 text-slate-950 font-black text-2xl shadow-xl active:scale-95 transition-transform cursor-pointer"
        >
          Torna alla Mappa della Torre
        </button>
      </div>
    </div>
  );
}
