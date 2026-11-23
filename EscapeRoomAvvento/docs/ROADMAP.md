# ROADMAP.md — Il Caso dell'Orologio Fermo

## REGOLE FERREE PER L'AGENTE (LEGGI SEMPRE PRIMA DI INIZIARE)
1. Esegui **ESCLUSIVAMENTE** il singolo Task indicato dall'utente. **NON** anticipare mai il task successivo.
2. Consulta sempre i file di specifica prima di scrivere codice o generare asset:
   - `docs/ARCHITECTURE.md` (vincoli LIM, tipi TypeScript, store, audio, struttura)
   - `docs/STORY_AND_PUZZLES.md` (trama, dialoghi, 13 enigmi, soluzioni, 3 indizi)
   - `docs/ASSETS_MANIFEST.md` (path esatti, prompt e dimensioni immagini)
3. Rispetta tutti i vincoli LIM: zero scroll (`h-screen w-screen overflow-hidden`), controlli nella fascia bassa, zero hover obbligatori, zero `<input>` nativi di sistema, contrasto alto leggibile a 5 metri, testato in 4:3 e 16:9.
4. Alla fine di ogni Task di codice: esegui `npm run build` e correggi eventuali errori TypeScript prima di fermarti.
5. Quando il Task è completato e verificato, aggiorna questo file cambiando `[ ]` in `[x]` solo per quel Task e fermati.

---

## TRACCIA A — SVILUPPO CODICE (Indipendente dalla quota immagini)

- [x] **Task 1 — Fondamenta, Tipi, Store e Motore Audio**
  - Inizializza/verifica Vite + React + TypeScript + Tailwind + `zustand`, `motion`, `lucide-react`, `canvas-confetti` (+ `@types/canvas-confetti`).
  - Crea `src/types/game.ts` seguendo esattamente la Sezione 4 di `docs/ARCHITECTURE.md`.
  - Crea `src/audio/soundEngine.ts` (Web Audio API procedurale con le 7 funzioni: `playClick`, `playGearTurn`, `playDoorSlide`, `playError`, `playHint`, `playSuccess`, `playTowerChime`).
  - Crea `src/data/items.ts` con tutti i 13 `InventoryItem` allineati a `STORY_AND_PUZZLES.md` e `ASSETS_MANIFEST.md`.
  - Crea `src/store/useGameStore.ts` con Zustand `persist` (`orologio-fermo-v1`), `jumpToStation` (ricostruzione automatica inventario), `exportSaveCode` e `importSaveCode`.

- [x] **Task 2 — Shell LIM, SafeImage, StoryTheater e Pannello Maestra**
  - Aggiungi animazioni CSS leggere in `src/index.css` (`kenBurns`, `goldDust`, `snowFall`, `rotateRays`).
  - Crea `src/components/ui/SafeImage.tsx` e usalo ovunque al posto di `<img>`: se un asset non esiste ancora (`onError`), mostra un segnaposto pulito blu notte con bordo ottone tratteggiato e il testo `alt` ben leggibile.
  - Crea `LimLayout.tsx` (Top 10%, Stage 70%, Bottom Dock 20%, Fullscreen API, toggle audio, pressione 3 secondi sull'orologio per Pannello Maestra).
  - Crea `InventoryBar.tsx` (medaglioni circolari + modale ispezione grande), `HintModal.tsx` (3 indizi progressivi con Archimede `thinking`) e `TeacherPanel.tsx` (PIN `1225`, salto stazione, soluzione corrente, nota ponte fisico, codice ripresa, reset).
  - Crea `BrassDoorTransition.tsx`, `AmbientParticles.tsx`, `StoryTheater.tsx` (avanzamento SOLO manuale su tocco) e `RewardOverlay.tsx` (con `canvas-confetti`).

- [x] **Task 3 — Titolo, Mappa della Torre, App e Stazioni Atto 1**
  - Crea `src/components/map/TitleScreen.tsx` su `bg_tower_map.webp` con neve e pulsante gigante "Inizia / Riprendi".
  - Crea `src/components/map/TowerMap.tsx` con le 13 stazioni raggruppate nei 3 Atti + Finale, stato bloccato/sbloccato/completato, Ingranaggi Maestri raccolti e transizione `BrassDoorTransition`.
  - Crea un placeholder temporaneo `src/components/puzzles/PuzzleHost.tsx` con tasto "Simula Vittoria" e collega il flusso completo in `src/App.tsx`.
  - Popola le Stazioni 1–4 (Atto 1) in `src/data/stations.ts` da `docs/STORY_AND_PUZZLES.md`.

- [x] **Task 4A — Motore `HotspotScene.tsx` (Stazioni 1 e 11)**
  - Implementa modalità `flashlight_sequence` (maschera radiale `mask-image` al tocco/pointer, prop in percentuale, selezione ordinata 1–4, Conferma/Azzera in basso) e modalità `find` (8 prop, selezione libera di 4).
  - Aggiungi pulsante in basso "Leggi Indizi a Schermo Intero" con font gigante per la classe.

- [x] **Task 4B — Motore `LogicBoard.tsx` (Stazioni 2, 6 e 10)**
  - Implementa modalità `balance` (bilancia SVG che si inclina, 6 pesi grandi, feedback specifico se somma 42 ma usa numeri dispari), `matching` (tap apprendista poi tap strumento con badge colorati e icone Lucide) e `order` (4 tubi colorati con frecce o tap-scambia in fascia bassa).

- [x] **Task 4C — Motore `CipherWheel.tsx` (Stazioni 3 e 7)**
  - Implementa modalità `caesar` (ruota SVG con anello interno rotabile via pulsanti `-1`/`+1` in basso + tastiera alfabetica integrata a schermo) e `symbol_substitution` (tabella 3 parole riferimento + parola cifrata + tastiera alfabetica touch integrata).

- [x] **Task 4D — Motore `GridMap.tsx` (Stazioni 5 e 9)**
  - Implementa modalità `path_target` (griglia 5x5 A-E/1-5, bussola N/S/E/O, cella `C3` iniziale, segnaposto cliccabili, elenco passi ingrandibile) e `symmetry` (griglia 6x5 con asse dorato verticale tra col 3 e 4, sinistra fissa, destra cliccabile).

- [x] **Task 4E — Motore `VaultLock.tsx` (Stazioni 4, 8, 12 e 13) + Collegamento `PuzzleHost`**
  - Implementa `keypad` (tastierino 0–9 grande), `dials` (4 rotelle con icone Lucide e `spring`), `clock` (quadrante SVG con pulsanti `-1h`, `+1h`, `-5m`, `+5m` in basso) e `finale` (Fase 13A: 3 slot Sinistra/Centro/Destra con `gear_bronze.png`, `gear_gold.png`, `gear_silver.png` che ruotano insieme allo sblocco; Fase 13B: dialogo intermedio Archimede + lancette su `12:00` + 12 rintocchi).
  - Sostituisci il placeholder in `src/components/puzzles/PuzzleHost.tsx` collegando tutti i 5 motori.

- [x] **Task 5 — Stazioni 5–13, Gran Finale e Verifica Finale**
  - Completa `src/data/stations.ts` con tutte le Stazioni dalla 5 alla 13 da `docs/STORY_AND_PUZZLES.md`.
  - Implementa la schermata celebrativa `grand_finale` in `src/App.tsx` (3 Ingranaggi Maestri rotanti, neve animata, 12 rintocchi, messaggio finale "MISSIONE COMPIUTA, MAESTRI OROLOGIAI! BUONE VACANZE DI NATALE!").
  - Verifica che ogni path in `stations.ts` e `items.ts` coincida al 100% con `docs/ASSETS_MANIFEST.md` e che `npm run build` passi pulito.

- [x] **Task 6 — QA LIM (4:3), Touch Fix, Subpath-Safe e PWA Offline-First**
  - **Compatibilità sottocartelle (`base: './'`):** Configura `base: './'` in `vite.config.ts` e aggiungi un helper `resolveAsset(path)` basato su `import.meta.env.BASE_URL` usato da `SafeImage.tsx` e dagli sfondi, così l'app funziona sia su dominio root sia in sottocartella.
  - **Fix Touch LIM:** Aggiungi `touch-action: none` sui contenitori interattivi di `HotspotScene.tsx` (modalità `flashlight_sequence`) e `GridMap.tsx` per impedire che il trascinamento del dito sulla LIM attivi lo scroll o i gesti del browser Windows. Verifica che tutti i bottoni interattivi abbiano area touch almeno `56x56px`.
  - **Audit Layout 4:3 (`1024x768`):** Verifica e sistema eventuali tagli o sovrapposizioni in `LogicBoard` (Stazione 6), `CipherWheel` (Stazioni 3 e 7), `VaultLock` (Stazione 13) e `InventoryBar` (con 12 oggetti raccolti, deve scorrere orizzontalmente in modo pulito con pulsanti freccia o swipe senza rompere il `h-screen`).
  - **PWA Offline-First (`vite-plugin-pwa`):** Installa `vite-plugin-pwa` (`registerType: 'autoUpdate'`), configura `workbox.globPatterns` per mettere in precache `**/*.{js,css,html,webp,png,svg}` (con `maximumFileSizeToCacheInBytes: 5 * 1024 * 1024`) e aggiungi un piccolo indicatore discreto di stato "Pronto Offline" nel Pannello Maestra.
  - **Verifica Asset Completi:** Controlla via script o check manuale che tutti i 35 file di `docs/ASSETS_MANIFEST.md` esistano in `public/assets/`, che nessun path sia rotto e che `npm run build` generi correttamente `dist/` + service worker.
---

## TRACCIA B — ASSET IMMAGINI (Max 9 file per finestra quota)

- [x] **Asset-1A** — Primi 11 file del Batch 1 già generati su disco.

- [x] **Asset-1B (9 file — Batch 1 rimanente)**
  - Genera SOLO questi 9 file da `docs/ASSETS_MANIFEST.md` senza toccare quelli esistenti:
    `bg_act3_archive.webp`, `bg_finale_clockface.webp`, `archimede_thinking.webp` (rif. `archimede_mysterious.webp`), `archimede_celebrating.webp` (rif. `archimede_mysterious.webp`), `gear_silver.png` (trasparenza reale), `gear_gold.png` (trasparenza reale), `s1_pendolo.webp`, `s1_cassetta.webp`, `s1_clessidra.webp`.

- [x] **Asset-2A (8 file — Prop Stazione 11)**
  - Genera SOLO gli 8 prop della Sezione 6 di `docs/ASSETS_MANIFEST.md`:
    `s11_mappamondo.webp`, `s11_telescopio.webp`, `s11_libro_rosso.webp`, `s11_piuma.webp`, `s11_libro_blu.webp`, `s11_orologio_tasca.webp`, `s11_candela.webp`, `s11_mappa_stellare.webp`.

- [x] **Asset-2B (7 file — Inventario Atti 2–3 e Medaglia Finale)**
  - Genera SOLO questi 7 file della Sezione 7 di `docs/ASSETS_MANIFEST.md`:
    `item_chiave_officina.webp`, `item_schema_apprendisti.webp`, `item_targhetta_officina.webp`, `item_sigillo_archivio.webp`, `item_spartito_rintocchi.webp`, `item_pagina_diario.webp`, `badge_master_clockmaker.webp`.