import { BookOpen, Clock, Cog, Crown, Lock, Play, Star } from 'lucide-react';
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
  shortLabel: string;
  title: string;
  stations: StationId[];
  ribbonClass: string;
  numberBadgeClass: string;
}

const ACT_GROUPS: ActGroup[] = [
  {
    act: 1,
    shortLabel: 'Atto 1',
    title: 'La Stanza del Pendolo',
    stations: [1, 2, 3, 4],
    ribbonClass: 'bg-gradient-to-r from-[#C26A2B] to-[#E28A37] text-white',
    numberBadgeClass: 'bg-[#D9772B] text-white',
  },
  {
    act: 2,
    shortLabel: 'Atto 2',
    title: "L'Officina degli Ingranaggi",
    stations: [5, 6, 7, 8],
    ribbonClass: 'bg-gradient-to-r from-[#236AB9] to-[#3B91E8] text-white',
    numberBadgeClass: 'bg-[#2574C8] text-white',
  },
  {
    act: 3,
    shortLabel: 'Atto 3',
    title: "L'Archivio del Tempo",
    stations: [9, 10, 11, 12],
    ribbonClass: 'bg-gradient-to-r from-[#7B3FA0] to-[#9E5BC7] text-white',
    numberBadgeClass: 'bg-[#8645AD] text-white',
  },
];

const MASTER_GEARS = [
  { id: 'gear_bronze', label: 'Bronzo (3)', path: '/assets/gears/gear_bronze.png' },
  { id: 'gear_silver', label: 'Argento (6)', path: '/assets/gears/gear_silver.png' },
  { id: 'gear_gold', label: 'Oro (9)', path: '/assets/gears/gear_gold.png' },
];

function ActIcon({ act }: { act: ActId }) {
  if (act === 1) return <Clock className="w-5 h-5 shrink-0" />;
  if (act === 2) return <Cog className="w-5 h-5 shrink-0" />;
  return <BookOpen className="w-5 h-5 shrink-0" />;
}

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
    <div className="relative w-full h-full overflow-hidden flex flex-col justify-between p-2.5 md:p-4">
      {/* Sfondo Torre molto più visibile */}
      <div className="absolute inset-0">
        <SafeImage
          src="/assets/backgrounds/bg_tower_map.webp"
          alt="Mappa della Torre"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#10203E]/42" />
      </div>

      <AmbientParticles variant="snow" count={16} />

      {/* Contenuto Album/Calendario centrato senza scroll */}
      <div className="relative z-20 flex-1 min-h-0 flex flex-col justify-between gap-2.5 md:gap-3 max-w-6xl w-full mx-auto">
        {/* Bacheca Ingranaggi Maestri + Gran Finale */}
        <div className="storybook-panel shrink-0 rounded-2xl px-3.5 md:px-5 py-2 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3 md:gap-4 flex-wrap">
            <span className="font-display text-lg md:text-xl font-bold text-[#3A2314]">
              Ingranaggi Maestri:
            </span>
            <div className="flex items-center gap-2.5">
              {MASTER_GEARS.map((g) => {
                const owned = inventoryIds.includes(g.id);
                return (
                  <div
                    key={g.id}
                    className={`flex items-center gap-2 px-3 py-1 rounded-full border-2 transition-all ${
                      owned
                        ? 'bg-[#FFF3B0] border-[#3A2314] text-[#2B190E] shadow-[0_2px_0_#3A2314]'
                        : 'bg-[#EFE0BE]/80 border-dashed border-[#B39360] text-[#7D6140]'
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-full overflow-hidden p-0.5 flex items-center justify-center ${
                        owned
                          ? 'bg-[#2B190E] border-2 border-[#F5B82E]'
                          : 'bg-[#E3D0A8] border border-[#B39360] opacity-45 grayscale'
                      }`}
                    >
                      <SafeImage
                        src={g.path}
                        alt={g.label}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <span className="font-display text-sm md:text-base font-bold hidden sm:inline">
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
            className={`btn-3d min-h-12 md:min-h-14 px-5 md:px-6 rounded-2xl font-bold text-lg md:text-xl flex items-center gap-2 ${
              finaleCompleted
                ? 'btn-3d-green cursor-pointer'
                : finaleUnlocked
                ? 'btn-3d-gold cursor-pointer'
                : 'bg-[#EAD9B7] text-[#846948] border-[#B39360] cursor-not-allowed'
            }`}
          >
            {finaleCompleted ? (
              <Star className="w-6 h-6 fill-[#FFE169] text-[#14532D]" />
            ) : finaleUnlocked ? (
              <Crown className="w-6 h-6" />
            ) : (
              <Lock className="w-5 h-5" />
            )}
            <span>Stazione 13 — Gran Finale</span>
          </button>
        </div>

        {/* Album dei 3 Capitoli (12 caselle stile Calendario dell'Avvento) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 flex-1 min-h-0">
          {ACT_GROUPS.map((group) => (
            <section
              key={group.act}
              className="storybook-panel rounded-3xl overflow-hidden flex flex-col min-h-0"
            >
              {/* Testata a nastro del Capitolo */}
              <div
                className={`${group.ribbonClass} px-3.5 py-2 border-b-[3px] border-[#3A2314] flex items-center gap-2 shrink-0`}
              >
                <span className="w-8 h-8 rounded-xl bg-black/20 border-2 border-white/40 flex items-center justify-center shrink-0">
                  <ActIcon act={group.act} />
                </span>
                <div className="min-w-0 leading-tight">
                  <span className="block text-xs font-extrabold uppercase tracking-wider text-white/90">
                    {group.shortLabel}
                  </span>
                  <h2 className="font-display text-base md:text-lg font-bold truncate drop-shadow-[0_1px_0_rgba(0,0,0,0.35)]">
                    {group.title}
                  </h2>
                </div>
              </div>

              {/* 4 Caselle Stazione */}
              <div className="grid grid-cols-2 gap-2.5 p-2.5 md:p-3 flex-1 min-h-0 bg-[#FFF8E8]">
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
                      className={`relative rounded-2xl p-2 flex flex-col items-center justify-center text-center gap-1.5 transition-all ${
                        completed
                          ? 'bg-[#DCFCE7] border-[3px] border-[#1F8B4C] text-[#144729] shadow-[0_4px_0_#1F8B4C] active:translate-y-0.5 cursor-pointer'
                          : isCurrent
                          ? 'bg-gradient-to-b from-[#FFF394] to-[#FFD23F] border-[3px] border-[#3A2314] text-[#2B190E] shadow-[0_5px_0_#9A5B0A] active:translate-y-0.5 cursor-pointer'
                          : unlocked
                          ? 'bg-[#FFFDF7] border-[3px] border-[#3A2314] text-[#2B190E] shadow-[0_4px_0_#B38E58] active:translate-y-0.5 cursor-pointer'
                          : 'bg-[#F2E5C9]/80 border-2 border-dashed border-[#C0A272] text-[#846948] cursor-not-allowed'
                      }`}
                    >
                      {/* Badge "Oggi!" pulsante per la tappa attiva */}
                      {isCurrent && (
                        <span className="animate-gentle-bob absolute -top-2.5 -right-2 px-2.5 py-0.5 rounded-full bg-[#E04248] text-white border-2 border-[#3A2314] font-display font-bold text-xs uppercase tracking-wide shadow-[0_2px_0_#3A2314]">
                          Oggi!
                        </span>
                      )}

                      {/* Timbro Stella per stazione completata */}
                      {completed && (
                        <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-[#FFD859] border-2 border-[#1F8B4C] flex items-center justify-center shadow">
                          <Star className="w-5 h-5 text-[#1F8B4C] fill-[#1F8B4C]" />
                        </span>
                      )}

                      {/* Numero grande stile casella calendario */}
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`w-9 h-9 md:w-10 md:h-10 rounded-xl border-2 font-display font-bold text-xl md:text-2xl flex items-center justify-center shrink-0 ${
                            completed
                              ? 'bg-[#22A85A] border-[#14532D] text-white'
                              : isCurrent
                              ? 'bg-[#3A2314] border-[#3A2314] text-[#FFE169]'
                              : unlocked
                              ? `${group.numberBadgeClass} border-[#3A2314]`
                              : 'bg-[#E5D3AF] border-[#B39360] text-[#7D6140]'
                          }`}
                        >
                          {stationId}
                        </span>
                        {isCurrent && <Play className="w-5 h-5 fill-[#3A2314] text-[#3A2314] shrink-0" />}
                        {!unlocked && <Lock className="w-5 h-5 text-[#8D704B] shrink-0" />}
                      </div>

                      <span className="text-xs sm:text-sm font-extrabold leading-tight line-clamp-2 px-0.5">
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
