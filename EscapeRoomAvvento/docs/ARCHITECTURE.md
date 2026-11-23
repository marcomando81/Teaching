# ARCHITECTURE.md — Il Caso dell'Orologio Fermo

## 1. Stack Tecnologico e Dipendenze

Web App statica **100% frontend e offline-ready** (zero backend, zero database remoto).

* **Core:** Vite + React 19 + TypeScript (strict mode)
* **Styling:** Tailwind CSS v4 (o v3 con config standard)
* **Animazioni:** `motion` (`motion/react`, ex Framer Motion)
* **Stato e Persistenza:** `zustand` con middleware `persist` su `localStorage`
* **Icone UI e Puzzle:** `lucide-react` (usata per UI, bussola, simboli rotelle e attrezzi)
* **Effetti Celebrazione:** `canvas-confetti` (+ `@types/canvas-confetti`)
* **Audio:** Web Audio API nativa (`src/audio/soundEngine.ts`, zero file MP3 esterni)
* **Build offline di emergenza (opzionale):** `vite-plugin-singlefile` oppure build statica con `base: './'` apribile in locale.

### Comandi di setup iniziale

```bash
npm create vite@latest orologio-fermo -- --template react-ts
cd orologio-fermo
npm install zustand motion lucide-react canvas-confetti
npm install -D @types/canvas-confetti tailwindcss @tailwindcss/vite

```

---

## 2. Vincoli Non Negoziabili per la LIM (Regole per l'AI)

Ogni componente React generato DEVE rispettare tutte le regole seguenti:

1. **Zero scroll di pagina:** Il container radice usa sempre `h-screen w-screen overflow-hidden select-none`. Tutto il gioco deve entrare perfettamente sia su proiettori **4:3 (`1024x768`)** sia su **16:9 (`1280x720` / `1920x1080`)**.
2. **Ergonomia fascia bassa (altezza bambini 10 anni):** Tutti i pulsanti d'azione, i tastierini, i selettori, il pulsante "Avanti", "Indizio", "Conferma" e la barra inventario DEVONO stare nella **metà inferiore dello schermo** (fascia `bottom`). In alto restano solo titolo stazione, indicatore Atto e pulsanti di servizio (Audio, Fullscreen, Mappa, accesso Maestra).
3. **Zero hover e zero tastiera di sistema:** Mai nascondere informazioni o controlli dietro `:hover`. Mai usare `<input type="text">` nativi che aprono la tastiera di Windows sulla LIM: usare sempre tastierini numerici/alfabetici o selettori touch grandi integrati nel componente (target minimo `min-h-14 min-w-14`, idealmente `56px–72px`).
4. **Contrasto da proiettore d'aula:**
* Sfondo UI base: blu notte profondo `#0B132B` / `slate-950` con pannelli scuri semitrasparenti `bg-slate-900/90` e bordi netti in ottone `border-2 border-amber-400/80`.
* Testo principale: `#FEF3C7` (`amber-50`) o `#FFFFFF`, dimensione minima `text-xl` (20px) per testo secondario e `text-2xl` / `text-3xl` (24–30px) per indizi e dialoghi leggibili a 5 metri.
* Vietati testi grigio chiaro su sfondo scuro (`text-slate-400` vietato per qualsiasi testo leggibile).


5. **Performance su PC scolastici:** Animare SOLO `transform` e `opacity`. Evitare `backdrop-blur-xl` su aree full-screen e filtri CSS pesanti in animazione continua.
6. **Immagini esterne, mai SVG complessi a mano:** Usare esattamente i path di `docs/ASSETS_MANIFEST.md`. I ritratti, i prop e gli oggetti inventario vanno sempre dentro una cornice circolare/medaglione CSS (`rounded-full border-4 border-amber-400 bg-slate-950 overflow-hidden shadow-lg`).
7. **Dialoghi a controllo manuale:** In `StoryTheater` è VIETATO far avanzare le battute con `setTimeout`. Si avanza solo toccando il pulsante gigante **"Avanti"**.

---

## 3. Struttura delle Cartelle

```text
orologio-fermo/
├── docs/
│   ├── STORY_AND_PUZZLES.md
│   ├── ASSETS_MANIFEST.md
│   └── ARCHITECTURE.md
├── public/
│   └── assets/
│       ├── backgrounds/          # 5 sfondi .webp
│       ├── portraits/            # 3 espressioni Archimede .webp
│       ├── gears/                # 3 Ingranaggi Maestri .png trasparenti
│       ├── props/                # 6 prop Stazione 1 + 8 prop Stazione 11 .webp
│       └── items/                # 10 oggetti inventario + medaglia .webp
└── src/
    ├── main.tsx
    ├── App.tsx                   # Router di stato (title | map | station | victory_finale)
    ├── index.css                 # Tailwind + animazioni CSS (Ken Burns, particelle, bagliori)
    ├── types/
    │   └── game.ts               # TUTTI i tipi TypeScript condivisi (fonte di verità)
    ├── store/
    │   └── useGameStore.ts       # Zustand + localStorage + ricostruzione inventario + codici ripresa
    ├── audio/
    │   └── soundEngine.ts        # Sintetizzatore procedurale Web Audio API
    ├── data/
    │   ├── items.ts              # Catalogo completo InventoryItem (13 oggetti)
    │   └── stations.ts           # Array tipizzato delle 13 stazioni (da STORY_AND_PUZZLES.md)
    └── components/
        ├── layout/
        │   ├── LimLayout.tsx         # Griglia 10% Top / 70% Stage / 20% Bottom Dock
        │   ├── InventoryBar.tsx      # Barra bassa cliccabile + Modale ispezione oggetto grande
        │   ├── HintModal.tsx         # Modale 3 indizi progressivi + Zoom testo enigma LIM
        │   ├── BrassDoorTransition.tsx # Transizione scenica a due ante d'ottone
        │   └── TeacherPanel.tsx      # Pannello Maestra (pressione 3s + PIN 1225)
        ├── theater/
        │   ├── AmbientParticles.tsx  # Pulviscolo dorato / neve in CSS puro
        │   ├── StoryTheater.tsx      # Intro/Outro con Ken Burns, Archimede e testo a battute
        │   └── RewardOverlay.tsx     # Climax sblocco oggetto/ingranaggio + confetti
        ├── map/
        │   ├── TitleScreen.tsx       # Copertina animata con pulsante "Inizia / Riprendi"
        │   └── TowerMap.tsx          # Mappa della Torre con le 13 stazioni su 3 Atti + Finale
        └── puzzles/
            ├── PuzzleHost.tsx        # Switcher tipizzato verso i 5 motori
            ├── HotspotScene.tsx      # Stazioni 1 (flashlight_sequence) e 11 (find)
            ├── LogicBoard.tsx        # Stazioni 2 (balance), 6 (matching) e 10 (order)
            ├── CipherWheel.tsx       # Stazioni 3 (caesar) e 7 (symbol_substitution)
            ├── GridMap.tsx           # Stazioni 5 (path_target) e 9 (symmetry)
            └── VaultLock.tsx         # Stazioni 4 (keypad), 8 (dials), 12 (clock) e 13 (finale)

```

---

## 4. Contratti TypeScript (`src/types/game.ts`)

Questo file va creato **prima di qualsiasi componente** e non va modificato arbitrariamente durante lo sviluppo dei singoli puzzle.

```ts
export type ActId = 1 | 2 | 3 | 4;
export type StationId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13;
export type ScreenView = 'title' | 'map' | 'station' | 'grand_finale';
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

```

---

## 5. Stato Persistente e Pannello Maestra (`useGameStore.ts` & `TeacherPanel.tsx`)

### Architettura Store Zustand (`localStorage` key: `orologio-fermo-v1`)

* **Campi persistiti:**
* `highestUnlockedStation: StationId` (parte da `1`)
* `completedStations: StationId[]`
* `inventoryIds: string[]`
* `soundEnabled: boolean` (default `true`)
* `teacherUnlockedAll: boolean` (modalità test/anteprima)


* **Campi effimeri (non persistiti):**
* `currentView: ScreenView`
* `activeStationId: StationId`
* `stationPhase: StationPhase`
* `hintsRevealedCount: number` (reset a `0` al cambio stazione)



### Paracadute anti-reset PC scolastico (obbligatorio)

1. **Accesso protetto da PIN:** Pressione continua per **3 secondi** sull'icona dell'orologio in alto a destra nella `LimLayout` (con anello di progresso visivo discreto), che apre un tastierino numerico **PIN a 4 cifre** (default: **`1225`**).
2. **Salto diretto con ricostruzione inventario (`jumpToStation(targetId)`):** Se il PC d'aula viene resettato o la maestra cambia classe al Giorno 7, selezionando "Imposta classe alla Stazione 7" dal Pannello Maestra lo store:
* Marca come completate tutte le stazioni da `1` a `targetId - 1`.
* Ricostruisce automaticamente `inventoryIds` inserendo tutti i `rewardItemId` delle stazioni `1 .. targetId - 1`.
* Imposta `highestUnlockedStation = targetId`.


3. **Codice di ripresa compatto (`exportSaveCode` / `importSaveCode`):** Genera una stringa corta leggibile (es. `CL5-S07-OK` codificata in Base64/formato breve) che la maestra può annotare sul registro e reinserire su un altro PC.
4. **Controlli rapidi nel Pannello Maestra:**
* Anteprima soluzione della stazione corrente + nota `physicalBridgeNote` (per ricordare di consegnare gli ingranaggi di cartoncino alle Stazioni 4, 8 e 12).
* Tasto "Sblocca stazione corrente" (per emergenze d'aula o test rapido).
* Tasto "Reset completo partita" (con doppia conferma).



---

## 6. Regia Visiva e Motore Audio

### `StoryTheater.tsx` & `AmbientParticles.tsx`

* **Ken Burns CSS:** Lo sfondo della stazione applica una lenta animazione `@keyframes kenBurns` (`scale(1.0) translate(0, 0)` verso `scale(1.08) translate(-1.5%, -1%)` in `16s ease-in-out infinite alternate`).
* **Particelle CSS pure (`AmbientParticles`):** 18–24 span leggeri animati solo su `transform` e `opacity`:
* Sulla mappa e nel finale: fiocchi di neve lenti (`variant="snow"`).
* Nelle stanze interne (Atti 1–3): pulviscolo dorato fluttuante (`variant="gold_dust"`).


* **Transizione `BrassDoorTransition.tsx`:** Due pannelli verticali (`left` e `right`) in gradiente bronzo/ottone con rivetti CSS e mezzo ingranaggio al centro che si chiudono in `350ms` con `motion`, cambiano la vista, e si riaprono con fisica `spring`.
* **Climax `RewardOverlay.tsx`:** Quando un puzzle chiama `onSolve()`:
1. Suona la fanfara (`playUnlock()` o `playMasterGear()`).
2. Lancia `canvas-confetti` con palette `['#F59E0B', '#FDE68A', '#FFFFFF', '#38BDF8']`.
3. Mostra un fascio di luce radiale rotante in CSS dietro all'oggetto/Ingranaggio Maestro che entra con `scale: 0.2 -> 1` (`spring`), nome grande, testo indizio ben leggibile e pulsante **"Metti nello Zaino"** in basso.



### `soundEngine.ts` (Web Audio API procedurale)

Nessun file audio da scaricare. Gestisce il risveglio automatico di `AudioContext` al primo tocco sulla LIM ed espone 7 funzioni pulite:

* `playClick()`: breve impulso filtrato (tocco pulsanti / tessere).
* `playGearTurn()`: doppio *clack* meccanico secco (rotelle, lancette, cifrario).
* `playDoorSlide()`: rumore bianco filtrato passa-basso in sweep (apertura porte d'ottone).
* `playError()`: breve doppio tono grave dissonante (risposta errata + shake animazione).
* `playHint()`: tintinnio morbido cristallino (apertura indizio).
* `playSuccess()`: arpeggio maggiore brillante a 4 note (risoluzione stazione).
* `playTowerChime(count)`: rintocco di campana metallica FM (sintesi inarmonica) ripetuto per il Gran Finale della Stazione 13.
