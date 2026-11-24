import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ScreenView, StationId, StationPhase } from '../types/game';
import { INVENTORY_ITEMS, getRewardItemForStation } from '../data/items';
import { setSoundEnabled as syncAudioEngine } from '../audio/soundEngine';
import { setMusicEnabled as syncMusicEngine } from '../audio/christmasMusic';

const ALL_STATIONS: StationId[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];

function isValidStationId(n: number): n is StationId {
  return Number.isInteger(n) && n >= 1 && n <= 13;
}

export interface GameState {
  // Campi persistiti
  highestUnlockedStation: StationId;
  completedStations: StationId[];
  inventoryIds: string[];
  soundEnabled: boolean;
  musicEnabled: boolean;
  teacherUnlockedAll: boolean;

  // Campi effimeri (non persistiti)
  currentView: ScreenView;
  activeStationId: StationId;
  stationPhase: StationPhase;
  hintsRevealedCount: number;

  // Azioni di navigazione e flusso
  setView: (view: ScreenView) => void;
  enterStation: (stationId: StationId) => void;
  setStationPhase: (phase: StationPhase) => void;
  revealNextHint: () => void;
  completeStation: (stationId: StationId) => void;

  // Audio e opzioni
  toggleSound: () => void;
  toggleMusic: () => void;
  setTeacherUnlockedAll: (enabled: boolean) => void;

  // Paracadute anti-reset PC scolastico
  jumpToStation: (targetId: StationId) => void;
  exportSaveCode: () => string;
  importSaveCode: (rawCode: string) => boolean;
  resetGame: () => void;
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      // Stato iniziale persistito
      highestUnlockedStation: 1,
      completedStations: [],
      inventoryIds: [],
      soundEnabled: true,
      musicEnabled: true,
      teacherUnlockedAll: false,

      // Stato iniziale effimero
      currentView: 'title',
      activeStationId: 1,
      stationPhase: 'intro',
      hintsRevealedCount: 0,

      setView: (view) => set({ currentView: view }),

      enterStation: (stationId) =>
        set({
          currentView: 'station',
          activeStationId: stationId,
          stationPhase: 'intro',
          hintsRevealedCount: 0,
        }),

      setStationPhase: (phase) => set({ stationPhase: phase }),

      revealNextHint: () =>
        set((state) => ({
          hintsRevealedCount: Math.min(3, state.hintsRevealedCount + 1),
        })),

      completeStation: (stationId) =>
        set((state) => {
          const completedSet = new Set<StationId>(state.completedStations);
          completedSet.add(stationId);

          const reward = getRewardItemForStation(stationId);
          const inventorySet = new Set<string>(state.inventoryIds);
          if (reward) {
            inventorySet.add(reward.id);
          }

          const nextStation = Math.min(13, stationId + 1) as StationId;
          const highestUnlockedStation = Math.max(
            state.highestUnlockedStation,
            nextStation
          ) as StationId;

          return {
            completedStations: Array.from(completedSet).sort((a, b) => a - b),
            inventoryIds: Array.from(inventorySet),
            highestUnlockedStation,
          };
        }),

      toggleSound: () =>
        set((state) => {
          const next = !state.soundEnabled;
          syncAudioEngine(next);
          return { soundEnabled: next };
        }),

      toggleMusic: () =>
        set((state) => {
          const next = !state.musicEnabled;
          syncMusicEngine(next);
          return { musicEnabled: next };
        }),

      setTeacherUnlockedAll: (enabled) => set({ teacherUnlockedAll: enabled }),

      jumpToStation: (targetId) => {
        const completedStations = ALL_STATIONS.filter((id) => id < targetId);
        const inventoryIds = INVENTORY_ITEMS.filter(
          (item) => item.stationUnlockedAt < targetId
        ).map((item) => item.id);

        set({
          highestUnlockedStation: targetId,
          completedStations,
          inventoryIds,
          activeStationId: targetId,
          stationPhase: 'intro',
          hintsRevealedCount: 0,
        });
      },

      exportSaveCode: () => {
        const { highestUnlockedStation, completedStations } = get();
        const isAllDone = completedStations.includes(13);
        const stationStr = String(highestUnlockedStation).padStart(2, '0');
        const suffix = isAllDone ? 'FIN' : 'OK';
        return `CL5-S${stationStr}-${suffix}`;
      },

      importSaveCode: (rawCode) => {
        const cleaned = rawCode.trim().toUpperCase();
        const match = /^CL5-S(\d{2})-(OK|FIN)$/.exec(cleaned);
        if (!match) return false;

        const parsedStation = Number.parseInt(match[1], 10);
        const isFin = match[2] === 'FIN';
        if (!isValidStationId(parsedStation)) return false;

        if (isFin && parsedStation === 13) {
          set({
            highestUnlockedStation: 13,
            completedStations: [...ALL_STATIONS],
            inventoryIds: INVENTORY_ITEMS.map((item) => item.id),
            activeStationId: 13,
            stationPhase: 'intro',
            hintsRevealedCount: 0,
          });
          return true;
        }

        get().jumpToStation(parsedStation);
        return true;
      },

      resetGame: () =>
        set({
          highestUnlockedStation: 1,
          completedStations: [],
          inventoryIds: [],
          teacherUnlockedAll: false,
          currentView: 'title',
          activeStationId: 1,
          stationPhase: 'intro',
          hintsRevealedCount: 0,
        }),
    }),
    {
      name: 'orologio-fermo-v1',
      partialize: (state) => ({
        highestUnlockedStation: state.highestUnlockedStation,
        completedStations: state.completedStations,
        inventoryIds: state.inventoryIds,
        soundEnabled: state.soundEnabled,
        musicEnabled: state.musicEnabled,
        teacherUnlockedAll: state.teacherUnlockedAll,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          syncAudioEngine(state.soundEnabled);
          syncMusicEngine(state.musicEnabled ?? true);
        }
      },
    }
  )
);
