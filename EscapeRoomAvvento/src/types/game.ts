export type ActId = 1 | 2 | 3 | 4;
export type StationId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13;
export type ScreenView = 'title' | 'intro_trailer' | 'map' | 'station' | 'grand_finale';
export type StationPhase = 'intro' | 'puzzle' | 'outro' | 'reward';
export type OwlExpression = 'mysterious' | 'thinking' | 'celebrating';

export interface StoryBeat {
  speaker: 'Archimede';
  expression: OwlExpression;
  text: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  description: string; // Testo grande leggibile alla LIM quando ispezionato
  imagePath: string;
  isMasterGear?: boolean;
  gearValue?: number; // 3 (Bronzo), 6 (Argento), 9 (Oro)
  stationUnlockedAt: StationId;
}

/* =========================================================
 * CONFIGURAZIONI TIPIZZATE DEI 5 MOTORI PUZZLE
 * ========================================================= */

// 1. HotspotScene (Stazioni 1 e 11)
export interface HotspotProp {
  id: string;
  label: string;
  imagePath: string;
  xPercent: number; // 10 - 90
  yPercent: number; // 15 - 82
}

export interface HotspotFlashlightConfig {
  puzzleType: 'HotspotScene';
  mode: 'flashlight_sequence';
  promptTitle: string;
  clues: string[]; // 4 punti ordinati
  props: HotspotProp[];
  solutionSequence: string[]; // Ordine esatto obbligatorio
}

export interface HotspotFindConfig {
  puzzleType: 'HotspotScene';
  mode: 'find';
  promptTitle: string;
  clues: string[]; // 4 indizi
  props: HotspotProp[];
  solutionSet: string[]; // Qualsiasi ordine
}

// 2. LogicBoard (Stazioni 2, 6 e 10)
export interface LogicBalanceConfig {
  puzzleType: 'LogicBoard';
  mode: 'balance';
  promptTitle: string;
  ruleText: string;
  targetWeight: number; // 42
  requiredCount: number; // 3
  forbidOdd: boolean; // true
  availableWeights: number[]; // [7, 10, 12, 14, 16, 19]
  solutionSet: number[]; // [12, 14, 16]
}

export interface LogicMatchingConfig {
  puzzleType: 'LogicBoard';
  mode: 'matching';
  promptTitle: string;
  clues: string[];
  leftItems: { id: string; label: string }[]; // Apprendisti
  rightItems: { id: string; label: string; iconName: string }[]; // Strumenti
  solutionMap: Record<string, string>; // { lia: 'lente', ... }
}

export interface LogicOrderConfig {
  puzzleType: 'LogicBoard';
  mode: 'order';
  promptTitle: string;
  ruleText: string;
  items: {
    id: string;
    label: string;
    timeExpression: string; // es. "1/4 d'ora"
    colorClass: string;
  }[];
  solutionOrder: string[]; // ['rosso', 'blu', 'giallo', 'verde']
}

// 3. CipherWheel (Stazioni 3 e 7)
export interface CipherCaesarConfig {
  puzzleType: 'CipherWheel';
  mode: 'caesar';
  promptTitle: string;
  ruleText: string;
  encryptedWord: string; // "RGPFQNQ"
  shift: number; // 2
  solutionWord: string; // "PENDOLO"
}

export interface CipherSymbolConfig {
  puzzleType: 'CipherWheel';
  mode: 'symbol_substitution';
  promptTitle: string;
  referenceWords: { symbols: string[]; plain: string }[];
  encryptedSymbols: string[];
  solutionWord: string; // "ARGENTO"
}

// 4. GridMap (Stazioni 5 e 9)
export interface GridPathConfig {
  puzzleType: 'GridMap';
  mode: 'path_target';
  promptTitle: string;
  rows: number; // 5
  cols: number; // 5
  colLabels: string[]; // ['A', 'B', 'C', 'D', 'E']
  rowLabels: string[]; // ['1', '2', '3', '4', '5']
  startCell: string; // 'C3'
  steps: string[];
  solutionCell: string; // 'D2'
}

export interface GridSymmetryConfig {
  puzzleType: 'GridMap';
  mode: 'symmetry';
  promptTitle: string;
  rows: number; // 5
  cols: number; // 6 (asse tra col 3 e 4)
  givenCells: [number, number][]; // [col, row] 1-based sulla metà sinistra
  solutionCells: [number, number][]; // [col, row] 1-based sulla metà destra
}

// 5. VaultLock (Stazioni 4, 8, 12 e 13)
export interface VaultKeypadConfig {
  puzzleType: 'VaultLock';
  mode: 'keypad';
  promptTitle: string;
  ruleLines: string[];
  codeLength: number; // 4
  solutionCode: string; // '9472'
}

export interface VaultDialsConfig {
  puzzleType: 'VaultLock';
  mode: 'dials';
  promptTitle: string;
  ruleText: string;
  symbols: { id: string; label: string; iconName: string }[];
  solutionDials: string[]; // ['chiave_inglese', 'fulmine', 'ingranaggio', 'gufo']
}

export interface VaultClockConfig {
  puzzleType: 'VaultLock';
  mode: 'clock';
  promptTitle: string;
  ruleText: string;
  initialHour: number; // 12
  initialMinute: number; // 0
  targetHour: number; // 11
  targetMinute: number; // 15
  showDigitalHelper: boolean;
}

export interface VaultFinaleConfig {
  puzzleType: 'VaultLock';
  mode: 'finale';
  phaseARuleLines: string[];
  gearSolutionOrder: [string, string, string]; // ['gear_bronze', 'gear_gold', 'gear_silver']
  midDialogue: StoryBeat;
  phaseBRuleLines: string[];
  targetHour: number; // 12
  targetMinute: number; // 0
}

export type PuzzleConfig =
  | HotspotFlashlightConfig
  | HotspotFindConfig
  | LogicBalanceConfig
  | LogicMatchingConfig
  | LogicOrderConfig
  | CipherCaesarConfig
  | CipherSymbolConfig
  | GridPathConfig
  | GridSymmetryConfig
  | VaultKeypadConfig
  | VaultDialsConfig
  | VaultClockConfig
  | VaultFinaleConfig;

export interface StationDefinition {
  id: StationId;
  act: ActId;
  actName: string;
  title: string;
  backgroundPath: string;
  isChapterBoss?: boolean;
  introBeats: StoryBeat[];
  puzzle: PuzzleConfig;
  hints: [string, string, string];
  outroBeats: StoryBeat[];
  rewardItemId: string;
  physicalBridgeNote?: string; // Visibile solo nel Pannello Maestra
}

export interface PuzzleEngineProps<T extends PuzzleConfig = PuzzleConfig> {
  config: T;
  onSolve: () => void;
  onMistake: (customFeedback?: string) => void;
}
