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
    setMistakeFeedback(customFeedback ?? 'Quasi! Non è la combinazione giusta, riprova!');
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
                      <div className="absolute inset-0 bg-[#10203E]/38" />
                    </div>

                    <PuzzleHost
                      config={activeStation.puzzle}
                      onSolve={handlePuzzleSolve}
                      onMistake={handlePuzzleMistake}
                    />

                    {/* Fumetto feedback incoraggiante per errore */}
                    {mistakeFeedback && (
                      <div className="animate-soft-wiggle absolute top-3 left-1/2 -translate-x-1/2 z-40 max-w-2xl px-6 py-3 rounded-2xl bg-[#FFF3F0] border-[3px] border-[#D94246] text-[#7A1B1E] font-extrabold text-lg md:text-xl shadow-[0_6px_0_rgba(160,34,38,0.4)] flex items-center gap-3">
                        <span className="w-9 h-9 rounded-full bg-[#E04248] text-white border-2 border-[#3A2314] flex items-center justify-center shrink-0">
                          <Lightbulb className="w-5 h-5" />
                        </span>
                        <span>{mistakeFeedback}</span>
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
                <div className="storybook-panel rounded-3xl p-8 space-y-5 max-w-xl">
                  <h2 className="font-display text-3xl font-bold text-[#3A2314]">
                    Stazione {activeStationId} in preparazione
                  </h2>
                  <button
                    type="button"
                    onClick={handleOpenMap}
                    className="btn-3d btn-3d-gold min-h-16 px-8 rounded-2xl font-bold text-2xl cursor-pointer"
                  >
                    Torna alla Mappa
                  </button>
                </div>
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
                  className="btn-3d btn-3d-sky min-h-16 px-6 rounded-2xl font-bold text-xl md:text-2xl flex items-center gap-2.5 shrink-0 cursor-pointer"
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
    const colors = ['#FFD859', '#E04248', '#22A85A', '#38BDF8', '#FFFFFF'];
    confetti({ particleCount: 140, spread: 100, origin: { y: 0.5 }, colors });
    const timer = window.setTimeout(() => {
      confetti({ particleCount: 100, spread: 120, origin: { y: 0.35 }, colors });
    }, 1100);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className="relative h-screen w-screen overflow-hidden select-none bg-[#162646] flex flex-col items-center justify-between p-6 md:p-10 text-center">
      <div className="absolute inset-0">
        <SafeImage
          src="/assets/backgrounds/bg_finale_clockface.webp"
          alt="Il Quadrante della Torre risvegliato"
          className="w-full h-full object-cover animate-ken-burns"
        />
        <div className="absolute inset-0 bg-[#10203E]/52" />
      </div>

      <AmbientParticles variant="snow" count={26} />

      {/* 3 Ingranaggi Maestri rotanti insieme */}
      <div className="relative z-20 flex items-center justify-center gap-4 md:gap-8 pt-2">
        <div className="w-24 h-24 md:w-32 md:h-32 drop-shadow-[0_6px_12px_rgba(0,0,0,0.45)]">
          <SafeImage
            src="/assets/gears/gear_bronze.png"
            alt="Ingranaggio di Bronzo"
            className="w-full h-full object-contain animate-rotate-rays"
          />
        </div>
        <div className="w-32 h-32 md:w-40 md:h-40 drop-shadow-[0_8px_16px_rgba(0,0,0,0.5)]">
          <SafeImage
            src="/assets/gears/gear_gold.png"
            alt="Ingranaggio d'Oro"
            className="w-full h-full object-contain animate-rotate-rays"
          />
        </div>
        <div className="w-24 h-24 md:w-32 md:h-32 drop-shadow-[0_6px_12px_rgba(0,0,0,0.45)]">
          <SafeImage
            src="/assets/gears/gear_silver.png"
            alt="Ingranaggio d'Argento"
            className="w-full h-full object-contain animate-rotate-rays"
          />
        </div>
      </div>

      {/* Cartello celebrativo gigante in pergamena e oro */}
      <div className="storybook-panel relative z-20 max-w-4xl rounded-[34px] p-6 md:p-8 space-y-4">
        <div className="inline-flex items-center gap-2 px-6 py-1.5 rounded-full bg-[#E04248] border-[3px] border-[#3A2314] text-white font-display font-bold text-xl shadow-[0_3px_0_#3A2314]">
          <Sparkles className="w-6 h-6 text-[#FFE169]" />
          <span>Il Grande Orologio è Ripartito!</span>
          <Sparkles className="w-6 h-6 text-[#FFE169]" />
        </div>

        <h1 className="font-display text-3xl sm:text-5xl md:text-6xl font-bold text-[#3A2314] leading-tight">
          MISSIONE COMPIUTA, MAESTRI OROLOGIAI!
        </h1>

        <p className="inline-block px-6 py-2 rounded-2xl bg-[#DCFCE7] border-[3px] border-[#1F8B4C] font-display text-2xl sm:text-3xl md:text-4xl font-bold text-[#14532D]">
          BUONE VACANZE DI NATALE!
        </p>
      </div>

      {/* Pulsante 3D in fascia bassa */}
      <div className="relative z-20 pb-2">
        <button
          type="button"
          onClick={() => {
            playClick();
            onBackToMap();
          }}
          className="btn-3d btn-3d-gold min-h-16 px-10 rounded-2xl font-bold text-2xl cursor-pointer"
        >
          Torna alla Mappa della Torre
        </button>
      </div>
    </div>
  );
}
