import { CheckCircle2, Crown, Lock, Play } from 'lucide-react';
import { useGameStore } from '../../store/useGameStore';
import type { ActId, StationId } from '../../types/game';
import { getStationById } from '../../data/stations';
import { SafeImage } from '../ui/SafeImage';
import { AmbientParticles } from '../theater/AmbientParticles';
import { playClick } from '../../audio/soundEngine';

export interface TowerMapProps {
  onSelectStation: (stationId: StationId) => void;
}

interface ActGroup {
  act: ActId;
  title: string;
  stations: StationId[];
  gearId?: string;
  gearLabel?: string;
}

const ACT_GROUPS: ActGroup[] = [
  {
    act: 1,
    title: 'Atto 1 — La Stanza del Pendolo',
    stations: [1, 2, 3, 4],
    gearId: 'gear_bronze',
    gearLabel: 'Bronzo',
  },
  {
    act: 2,
    title: "Atto 2 — L'Officina degli Ingranaggi",
    stations: [5, 6, 7, 8],
    gearId: 'gear_silver',
    gearLabel: 'Argento',
  },
  {
    act: 3,
    title: "Atto 3 — L'Archivio del Tempo",
    stations: [9, 10, 11, 12],
    gearId: 'gear_gold',
    gearLabel: 'Oro',
  },
];

const MASTER_GEARS = [
  { id: 'gear_bronze', label: 'Bronzo (3)', path: '/assets/gears/gear_bronze.png' },
  { id: 'gear_silver', label: 'Argento (6)', path: '/assets/gears/gear_silver.png' },
  { id: 'gear_gold', label: 'Oro (9)', path: '/assets/gears/gear_gold.png' },
];

export function TowerMap({ onSelectStation }: TowerMapProps) {
  const highestUnlockedStation = useGameStore((s) => s.highestUnlockedStation);
  const completedStations = useGameStore((s) => s.completedStations);
  const inventoryIds = useGameStore((s) => s.inventoryIds);
  const teacherUnlockedAll = useGameStore((s) => s.teacherUnlockedAll);

  const isUnlocked = (id: StationId) => teacherUnlockedAll || id <= highestUnlockedStation;
  const isCompleted = (id: StationId) => completedStations.includes(id);

  const finaleUnlocked = isUnlocked(13);
  const finaleCompleted = isCompleted(13);

  return (
    <div className="relative w-full h-full overflow-hidden flex flex-col justify-between p-3 md:p-5">
      {/* Sfondo Torre */}
      <div className="absolute inset-0">
        <SafeImage
          src="/assets/backgrounds/bg_tower_map.webp"
          alt="Mappa della Torre"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-slate-950/75" />
      </div>

      <AmbientParticles variant="snow" count={16} />

      {/* Contenuto Mappa centrato senza scroll */}
      <div className="relative z-20 flex-1 flex flex-col justify-between gap-3 max-w-6xl w-full mx-auto">
        {/* Barra Ingranaggi Maestri raccolti + Gran Finale */}
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-slate-900/90 border-2 border-amber-400/80 px-4 py-2.5">
          <div className="flex items-center gap-4">
            <span className="text-lg md:text-xl font-extrabold text-amber-300">
              Ingranaggi Maestri:
            </span>
            <div className="flex items-center gap-3">
              {MASTER_GEARS.map((g) => {
                const owned = inventoryIds.includes(g.id);
                return (
                  <div
                    key={g.id}
                    className={`flex items-center gap-2 px-3 py-1 rounded-full border-2 ${
                      owned
                        ? 'bg-amber-400/20 border-amber-300 text-amber-100'
                        : 'bg-slate-950/80 border-slate-700 text-amber-100/60 opacity-60'
                    }`}
                  >
                    <div className="w-9 h-9 rounded-full bg-slate-950 border border-amber-400/70 overflow-hidden p-0.5">
                      <SafeImage
                        src={g.path}
                        alt={g.label}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <span className="text-base md:text-lg font-bold hidden sm:inline">
                      {g.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pulsante Gran Finale Stazione 13 */}
          <button
            type="button"
            disabled={!finaleUnlocked}
            onClick={() => {
              if (!finaleUnlocked) return;
              playClick();
              onSelectStation(13);
            }}
            className={`min-h-14 px-6 rounded-2xl border-2 font-black text-xl flex items-center gap-2 transition-transform ${
              finaleCompleted
                ? 'bg-emerald-500 text-slate-950 border-emerald-200 cursor-pointer active:scale-95'
                : finaleUnlocked
                ? 'bg-amber-400 text-slate-950 border-white cursor-pointer active:scale-95 shadow-lg'
                : 'bg-slate-950/90 text-amber-100/60 border-slate-700 cursor-not-allowed'
            }`}
          >
            {finaleCompleted ? (
              <CheckCircle2 className="w-6 h-6" />
            ) : finaleUnlocked ? (
              <Crown className="w-6 h-6" />
            ) : (
              <Lock className="w-6 h-6" />
            )}
            <span>Stazione 13 — Gran Finale</span>
          </button>
        </div>

        {/* Griglia dei 3 Atti (12 stazioni) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 flex-1 min-h-0">
          {ACT_GROUPS.map((group) => (
            <section
              key={group.act}
              className="rounded-2xl bg-slate-900/90 border-2 border-amber-400/80 p-3 md:p-4 flex flex-col justify-between gap-2.5"
            >
              <h2 className="text-lg md:text-xl font-extrabold text-amber-300 border-b border-amber-400/40 pb-1.5 truncate">
                {group.title}
              </h2>

              <div className="grid grid-cols-2 gap-2.5 flex-1">
                {group.stations.map((stationId) => {
                  const unlocked = isUnlocked(stationId);
                  const completed = isCompleted(stationId);
                  const isCurrent = stationId === highestUnlockedStation && !completed;
                  const stationDef = getStationById(stationId);

                  return (
                    <button
                      key={stationId}
                      type="button"
                      disabled={!unlocked}
                      onClick={() => {
                        if (!unlocked) return;
                        playClick();
                        onSelectStation(stationId);
                      }}
                      className={`min-h-16 rounded-2xl border-2 p-2.5 flex flex-col items-center justify-center text-center gap-1 transition-transform ${
                        completed
                          ? 'bg-emerald-950/90 border-emerald-400 text-emerald-100 cursor-pointer active:scale-95'
                          : isCurrent
                          ? 'bg-amber-400 text-slate-950 border-white shadow-lg cursor-pointer active:scale-95'
                          : unlocked
                          ? 'bg-slate-800 border-amber-400/80 text-amber-50 cursor-pointer active:scale-95'
                          : 'bg-slate-950/90 border-slate-700 text-amber-100/50 cursor-not-allowed'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 font-black text-xl">
                        {completed ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0" />
                        ) : unlocked ? (
                          <Play className="w-5 h-5 shrink-0" />
                        ) : (
                          <Lock className="w-5 h-5 shrink-0" />
                        )}
                        <span>Stazione {stationId}</span>
                      </div>
                      <span className="text-sm font-bold leading-tight line-clamp-2">
                        {stationDef ? stationDef.title : `Enigma ${stationId}`}
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
