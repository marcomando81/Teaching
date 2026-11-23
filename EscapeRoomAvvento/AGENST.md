# AGENTS.md — Il Caso dell'Orologio Fermo

Web app statica 100% frontend (Vite + React + TypeScript strict + Tailwind + Zustand + `motion` + `lucide-react` + `canvas-confetti` + Web Audio API) per una escape room didattica di 13 stazioni su LIM in classe 5ª primaria. Zero backend.

## 1. Fonte di Verità (Leggi prima di agire)
Non inventare specifiche, testi, tipi o path di immagini. Consulta sempre i file in `docs/`:
- `docs/ROADMAP.md` — Stato avanzamento e definizione puntuale di ogni Task.
- `docs/ARCHITECTURE.md` — Stack, vincoli LIM, struttura cartelle, contratti TypeScript (`src/types/game.ts`), store e audio.
- `docs/STORY_AND_PUZZLES.md` — Trama, dialoghi, 13 enigmi, soluzioni esatte e 3 indizi per stazione.
- `docs/ASSETS_MANIFEST.md` — Path esatti in `public/assets/`, dimensioni e prompt bloccati.

## 2. Protocollo di Esecuzione (Regole Ferree)
1. **Un solo Task per turno:** Esegui ESCLUSIVAMENTE il singolo Task di `docs/ROADMAP.md` richiesto dall'utente. Non iniziare mai task successivi e non fare refactoring fuori perimetro.
2. **Tipi prima del codice:** Rispetta fedelmente le interfacce in `src/types/game.ts` senza alterarli arbitrariamente durante lo sviluppo dei componenti.
3. **Niente scorciatoie:** Vietato lasciare `// TODO`, placeholder non richiesti o enigmi semplificati rispetto a `docs/STORY_AND_PUZZLES.md`.
4. **Verifica obbligatoria:** Al termine di ogni Task di codice, esegui `npm run build` e risolvi ogni errore TypeScript/Vite prima di concludere.
5. **Aggiorna la Roadmap:** A verifica superata, spunta `[x]` solo per il Task completato in `docs/ROADMAP.md` e fermati.

## 3. Vincoli Non Negoziabili per la LIM
Ogni schermata e componente React DEVE rispettare tutte queste regole:
- **Zero scroll:** Container radice sempre `h-screen w-screen overflow-hidden select-none`. Deve entrare senza tagli sia in **4:3 (`1024x768`)** che in **16:9**.
- **Controlli in fascia bassa:** Tutti i pulsanti interattivi (Avanti, Conferma, Indizio, tastierini, selettori, inventario) devono stare nella metà inferiore dello schermo (raggiungibili da bambini di 10 anni).
- **Zero hover e zero tastiera di sistema:** Nessuna informazione nascosta dietro `:hover`. Vietati `<input type="text">` nativi; usa sempre tastierini/selettori touch grandi integrati (`min-h-14 min-w-14`).
- **Contrasto da proiettore:** Pannelli scuri (`bg-slate-900/90`), bordi ottone netti (`border-amber-400/80`), testo chiaro ad alto contrasto (`#FEF3C7` / `#FFFFFF`), font grandi leggibili a 5 metri (`text-xl` minimo, `text-2xl`/`text-3xl` per dialoghi e indizi). Vietato `text-slate-400` per testi leggibili.
- **Dialoghi manuali:** In `StoryTheater` è vietato l'auto-avanzamento a timer; si avanza solo su tocco.
- **Performance PC datati:** Anima solo `transform` e `opacity`. Evita `backdrop-blur-xl` full-screen.

## 4. Regole Asset Grafici e Quota
- **Usa sempre `SafeImage`:** Non usare `<img>` nudi; passa sempre da `src/components/ui/SafeImage.tsx` per gestire in modo pulito gli asset non ancora generati.
- **Mai disegnare illustrazioni complesse in SVG:** Usa gli asset esterni di `public/assets/` incorniciati via CSS (`rounded-full border-4 border-amber-400`) per ritratti, prop e inventario. Usa SVG/Lucide solo per elementi meccanici puliti (bilancia, ruota cifrata, griglia, lancette, icone rotelle).
- **Protezione quota immagini:** Non sovrascrivere né rigenerare mai file già presenti in `public/assets/`. Genera solo i file esplicitamente elencati nel sub-batch richiesto (max 9 immagini per turno).