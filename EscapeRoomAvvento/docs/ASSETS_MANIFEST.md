# ASSETS_MANIFEST.md — Il Caso dell'Orologio Fermo

## 1. Regole di Produzione per Antigravity (Vincoli Rigidi)

* **Formato e cartelle:** Salva tutti i file esattamente nei path indicati sotto `public/assets/`. Usa `.webp` (qualità 85–90) per sfondi, ritratti, prop e icone inventario; usa `.png` con sfondo trasparente reale per i 3 Ingranaggi Maestri.
* **Divieto assoluto di testo nelle immagini:** Non generare mai lettere, parole, cifre o scritte dentro le immagini (tranne dove un libro o una pergamena ha segni puramente decorativi illeggibili). Tutti i testi, i numeri sui quadranti e i valori degli indizi vengono sovrapposti in React/SVG per garantire nitidezza a 5 metri di distanza sulla LIM.
* **Strategia anti-scontorno (Medaglioni):** Ritratti, prop cliccabili (Stazioni 1 e 11) e oggetti inventario devono essere generati **centrati su sfondo blu notte scuro uniforme (`#0F172A`) con margine abbondante sui bordi e SENZA cornice disegnata**. React applicherà la stessa cornice circolare in ottone via CSS (`rounded-full border-4`), evitando aloni di scontorno e cornici storte.
* **Strategia per i 3 Ingranaggi Maestri:** Sono gli unici asset che ruotano e si incastrano liberamente in React (Stazione 13). Devono essere **`.png` con canale alpha trasparente reale** (mai finte scacchiere grigie). Se il generatore produce uno sfondo pieno (bianco o nero puro), rimuovi lo sfondo in post-produzione tramite script prima di salvare il file finale.
* **Composizione LIM-safe (4:3 e 16:9):** Tutti gli sfondi vanno generati in `16:9` (`1344x768` o `1408x768`), ma il soggetto principale deve restare nella **fascia centrale sicura** (20%–80% in orizzontale) e lasciare libera la fascia inferiore (ultimo 20% in basso, occupato dall'inventario).
* **Cosa NON generare come immagine:** I simboli delle rotelle (Stazione 8), i simboli del cifrario (Stazione 7), le icone degli attrezzi/apprendisti (Stazione 6), la bussola/griglia (Stazioni 5 e 9), i tubi sonori (Stazione 10) e le lancette dell'orologio (Stazioni 12 e 13) vanno realizzati come **componenti SVG / icone Lucide** in React, non come immagini raster.

### Ordine di Generazione Consigliato (Batch per Scadenza 1° Dicembre)

* **Batch 1 (Priorità lancio — 17 file):** 5 Sfondi + 3 Ritratti Archimede + 3 Ingranaggi Maestri + 6 Prop Stazione 1 + 3 Frammenti Atto 1 (nota: 20 file con i frammenti, sufficienti per pubblicare l'intero Atto 1 e testare il finale).
* **Batch 2 (Completamento Atti 2, 3 e Finale — 15 file):** 8 Prop Stazione 11 + 6 Oggetti Inventario Atti 2–3 + 1 Medaglia Finale.

---

## 2. Sfondi Ambientazione (5 asset — `1344x768`, `16:9`)

### `bg_tower_map`

* **Path:** `public/assets/backgrounds/bg_tower_map.webp`
* **Uso:** Schermata Titolo e Mappa Verticale della Torre (13 stazioni)
* **Prompt:** `Exterior view of a grand fairytale medieval-steampunk clock tower in a snowy winter village at twilight, glowing warm golden windows, huge frozen brass clock face near the top without clock hands, gentle snow suspended in the dark midnight blue starry sky, center-safe composition with clear space on the left and bottom for UI, warm painterly European storybook illustration, Professor Layton and Studio Ghibli cozy atmosphere, rich antique brass gold and deep midnight blue palette, high contrast crisp silhouettes for classroom projector, no people, no text, no letters, no numbers, no watermark.`

### `bg_act1_pendulum`

* **Path:** `public/assets/backgrounds/bg_act1_pendulum.webp`
* **Uso:** Sfondo Atto 1 (Stazioni 1–4 — La Stanza del Pendolo)
* **Prompt:** `Interior of a grand antique clock tower pendulum chamber, tall stone arches, warm timber beams, a massive motionless ornate brass pendulum mechanism in the upper background, soft amber lantern wall sconces, faint winter frost on arched windows, uncluttered mid-lower floor space for interactive UI, warm painterly European storybook steampunk illustration, Professor Layton and Studio Ghibli atmosphere, rich brass gold and deep midnight navy palette, high contrast for classroom projector, no people, no text, no letters, no numbers, no watermark.`

### `bg_act2_workshop`

* **Path:** `public/assets/backgrounds/bg_act2_workshop.webp`
* **Uso:** Sfondo Atto 2 (Stazioni 5–8 — L'Officina degli Ingranaggi)
* **Prompt:** `Interior of a master clockmaker steampunk workshop inside a tower, wooden workbench, shelves with brass gears, copper pipes, glass jars, hanging warm amber Edison lamps, tall gothic window with snowy blue twilight outside, cozy cluttered perimeter with cleaner central workspace area for UI overlay, warm painterly European storybook illustration, Professor Layton and Studio Ghibli atmosphere, rich antique brass, warm amber and deep midnight blue palette, high contrast for classroom projector, no people, no text, no letters, no numbers, no watermark.`

### `bg_act3_archive`

* **Path:** `public/assets/backgrounds/bg_act3_archive.webp`
* **Uso:** Sfondo Atto 3 (Stazioni 9–12 — L'Archivio del Tempo)
* **Prompt:** `Interior of a magical circular library and time archive inside an ancient clock tower, soaring dark wood bookshelves packed with leather-bound journals and rolled parchment scrolls, brass astrolabes and golden wall lanterns casting warm pools of light, starry frosty skylight above, balanced uncluttered center for UI overlay, warm painterly European storybook steampunk illustration, Professor Layton and Studio Ghibli atmosphere, rich brass gold, crimson wood and midnight blue palette, high contrast for classroom projector, no people, no text, no letters, no numbers, no watermark.`

### `bg_finale_clockface`

* **Path:** `public/assets/backgrounds/bg_finale_clockface.webp`
* **Uso:** Sfondo Gran Finale (Stazione 13 — Il Quadrante della Torre)
* **Prompt:** `Interior view from behind a monumental circular stained-glass and brass clock tower dial looking out into a sparkling snowy winter night sky, intricate golden clockwork frame around the outer circular rim, frosted translucent glass center completely empty with NO clock hands and NO numbers so interactive hands can be overlaid, dramatic warm golden rim light and frosty blue glow, warm painterly European storybook steampunk illustration, Professor Layton and Studio Ghibli atmosphere, high contrast for classroom projector, no people, no text, no letters, no numbers, no watermark.`

---

## 3. Ritratti Personaggio Guida: Archimede (3 asset — `512x512`, `1:1`)

*Nota coerenza:* Genera prima `archimede_mysterious.webp` e usalo come immagine di riferimento (image-to-image / character reference) per le altre due espressioni, così il design del gufo meccanico resta identico.

### `archimede_mysterious`

* **Path:** `public/assets/portraits/archimede_mysterious.webp`
* **Uso:** Espressione `mysterious` in `StoryTheater`
* **Prompt:** `Bust portrait of a charming small mechanical steampunk owl made of polished antique brass and copper plates, expressive large glowing warm amber glass eyes, tiny round brass monocle over one eye, intriguing mysterious half-smile expression, slight head tilt, centered with generous padding for circular crop, clean dark midnight blue radial background (#0F172A), warm painterly European storybook illustration, Professor Layton and Studio Ghibli style, high contrast crisp silhouette, no border, no frame, no text, no watermark.`

### `archimede_thinking`

* **Path:** `public/assets/portraits/archimede_thinking.webp`
* **Uso:** Espressione `thinking` in `StoryTheater` e pannello Indizi
* **Prompt:** `Bust portrait of the same charming small mechanical steampunk owl made of polished antique brass and copper plates, glowing amber glass eyes looking slightly upward in deep thought, one brass mechanical wing raised thoughtfully to its beak, tiny brass monocle, centered with generous padding for circular crop, clean dark midnight blue radial background (#0F172A), warm painterly European storybook illustration, Professor Layton and Studio Ghibli style, high contrast crisp silhouette, no border, no frame, no text, no watermark.`

### `archimede_celebrating`

* **Path:** `public/assets/portraits/archimede_celebrating.webp`
* **Uso:** Espressione `celebrating` in `StoryTheater` (vittoria stazione e Gran Finale)
* **Prompt:** `Bust portrait of the same charming small mechanical steampunk owl made of polished antique brass and copper plates, joyful wide-open glowing amber eyes, happy beak open cheering, both brass mechanical wings raised happily with tiny golden sparkles around it, tiny brass monocle, centered with generous padding for circular crop, clean dark midnight blue radial background (#0F172A), warm painterly European storybook illustration, Professor Layton and Studio Ghibli style, high contrast crisp silhouette, no border, no frame, no text, no watermark.`

---

## 4. I 3 Ingranaggi Maestri (3 asset — `512x512`, `1:1`, PNG Trasparente)

*Nota contrasto LIM:* I tre metalli devono essere distinguibili a colpo d'occhio anche da 5 metri su proiettore scarico: **Bronzo** (rosso-ramato caldo), **Argento** (acciaio freddo azzurro-bianco), **Oro** (giallo oro brillante e luminoso).

### `gear_bronze`

* **Path:** `public/assets/gears/gear_bronze.png`
* **Uso:** Ricompensa Stazione 4, Inventario, Ingranaggio Sinistra in Stazione 13A
* **Prompt:** `Single front-facing ornate steampunk master cogwheel gear forged from warm reddish-copper antique bronze metal, 8 sturdy rounded teeth, stylized hollow spokes with small rivets, glowing warm bronze highlights, perfectly centered orthographic top-down view, isolated on pure solid transparent background (zero drop shadow), warm painterly storybook game asset, Professor Layton style, high contrast crisp silhouette, no text, no numbers, no watermark.`

### `gear_silver`

* **Path:** `public/assets/gears/gear_silver.png`
* **Uso:** Ricompensa Stazione 8, Inventario, Ingranaggio Destra in Stazione 13A
* **Prompt:** `Single front-facing ornate steampunk master cogwheel gear forged from gleaming icy silver-blue polished steel metal, 10 sleek geometric teeth, intricate frosted filigree inner spokes, bright cool silver-white specular highlights, perfectly centered orthographic top-down view, isolated on pure solid transparent background (zero drop shadow), warm painterly storybook game asset, Professor Layton style, high contrast crisp silhouette, no text, no numbers, no watermark.`

### `gear_gold`

* **Path:** `public/assets/gears/gear_gold.png`
* **Uso:** Ricompensa Stazione 12, Inventario, Ingranaggio Centro in Stazione 13A
* **Prompt:** `Single front-facing magnificent royal steampunk master cogwheel gear forged from radiant bright polished yellow gold, 12 ornate sunburst-style teeth, sun-ray decorative inner spokes with a glowing golden core hub, vivid radiant gold luster, perfectly centered orthographic top-down view, isolated on pure solid transparent background (zero drop shadow), warm painterly storybook game asset, Professor Layton style, high contrast crisp silhouette, no text, no numbers, no watermark.`

---

## 5. Oggetti Cliccabili — Stazione 1 (`HotspotScene`, 6 asset — `384x384`, `1:1`)

Tutti generati su sfondo scuro uniforme `#0F172A` per essere incorniciati in React come hotspot luminosi sotto il fascio della torcia.

### `s1_lanterna`

* **Path:** `public/assets/props/s1_lanterna.webp`
* **ID enigma:** `lanterna` (Ordine #1)
* **Prompt:** `Single centered vintage brass oil lantern with a bright warm glowing amber flame inside glass chimney, high contrast crisp silhouette, generous padding around edges, clean dark midnight blue radial background (#0F172A), warm painterly storybook steampunk game icon, Professor Layton style, no border, no frame, no text, no watermark.`

### `s1_pendolo`

* **Path:** `public/assets/props/s1_pendolo.webp`
* **ID enigma:** `pendolo` (Ordine #2)
* **Prompt:** `Single centered gleaming ornate antique brass clock pendulum disc with engraved sun rays attached to a short brass rod, high contrast crisp silhouette, generous padding around edges, clean dark midnight blue radial background (#0F172A), warm painterly storybook steampunk game icon, Professor Layton style, no border, no frame, no text, no watermark.`

### `s1_cassetta`

* **Path:** `public/assets/props/s1_cassetta.webp`
* **ID enigma:** `cassetta` (Ordine #3)
* **Prompt:** `Single centered sturdy vintage wooden clockmaker toolbox with brass corners slightly open showing tiny wrenches and screwdrivers inside, high contrast crisp silhouette, generous padding around edges, clean dark midnight blue radial background (#0F172A), warm painterly storybook steampunk game icon, Professor Layton style, no border, no frame, no text, no watermark.`

### `s1_clessidra`

* **Path:** `public/assets/props/s1_clessidra.webp`
* **ID enigma:** `clessidra` (Ordine #4)
* **Prompt:** `Single centered ornate antique brass and crystal hourglass filled with glowing golden sand flowing downwards, high contrast crisp silhouette, generous padding around edges, clean dark midnight blue radial background (#0F172A), warm painterly storybook steampunk game icon, Professor Layton style, no border, no frame, no text, no watermark.`

### `s1_sedia`

* **Path:** `public/assets/props/s1_sedia.webp`
* **ID enigma:** `sedia` (Distrattore)
* **Prompt:** `Single centered classic carved dark oak wooden workshop chair with warm lantern rim light, high contrast crisp silhouette, generous padding around edges, clean dark midnight blue radial background (#0F172A), warm painterly storybook steampunk game icon, Professor Layton style, no border, no frame, no text, no watermark.`

### `s1_tappeto`

* **Path:** `public/assets/props/s1_tappeto.webp`
* **ID enigma:** `tappeto` (Distrattore)
* **Prompt:** `Single centered rolled-up ornate crimson and gold woven vintage rug with golden tassels, high contrast crisp silhouette, generous padding around edges, clean dark midnight blue radial background (#0F172A), warm painterly storybook steampunk game icon, Professor Layton style, no border, no frame, no text, no watermark.`

---

## 6. Oggetti Cliccabili — Stazione 11 (`HotspotScene`, 8 asset — `384x384`, `1:1`)

*Attenzione LIM:* `s11_libro_rosso` e `s11_libro_blu` devono avere colori saturi e inconfondibili (rosso rubino acceso vs blu zaffiro brillante).

### `s11_mappamondo`

* **Path:** `public/assets/props/s11_mappamondo.webp`
* **ID enigma:** `mappamondo` (Corretto)
* **Prompt:** `Single centered antique terrestrial world globe showing golden continents and deep blue oceans mounted on a curved brass meridian stand, high contrast crisp silhouette, generous padding around edges, clean dark midnight blue radial background (#0F172A), warm painterly storybook steampunk game icon, Professor Layton style, no border, no frame, no text, no watermark.`

### `s11_telescopio`

* **Path:** `public/assets/props/s11_telescopio.webp`
* **ID enigma:** `telescopio` (Corretto)
* **Prompt:** `Single centered classic gleaming brass astronomer spyglass telescope mounted on a compact wooden tripod angled slightly upward, high contrast crisp silhouette, generous padding around edges, clean dark midnight blue radial background (#0F172A), warm painterly storybook steampunk game icon, Professor Layton style, no border, no frame, no text, no watermark.`

### `s11_libro_rosso`

* **Path:** `public/assets/props/s11_libro_rosso.webp`
* **ID enigma:** `libro_rosso` (Corretto)
* **Prompt:** `Single centered thick antique hardcover leather book in vivid bright ruby red color with ornate gold corner clasps, completely blank cover with no words, high contrast crisp silhouette, generous padding around edges, clean dark midnight blue radial background (#0F172A), warm painterly storybook steampunk game icon, Professor Layton style, no border, no frame, no text, no letters, no watermark.`

### `s11_piuma`

* **Path:** `public/assets/props/s11_piuma.webp`
* **ID enigma:** `piuma` (Corretto)
* **Prompt:** `Single centered elegant cream-white goose feather writing quill dipped inside a small round glass inkwell with a brass collar, high contrast crisp silhouette, generous padding around edges, clean dark midnight blue radial background (#0F172A), warm painterly storybook steampunk game icon, Professor Layton style, no border, no frame, no text, no watermark.`

### `s11_libro_blu`

* **Path:** `public/assets/props/s11_libro_blu.webp`
* **ID enigma:** `libro_blu` (Distrattore)
* **Prompt:** `Single centered thick antique hardcover leather book in vivid bright sapphire cyan-blue color with silver corner clasps, completely blank cover with no words, high contrast crisp silhouette, generous padding around edges, clean dark midnight blue radial background (#0F172A), warm painterly storybook steampunk game icon, Professor Layton style, no border, no frame, no text, no letters, no watermark.`

### `s11_orologio_tasca`

* **Path:** `public/assets/props/s11_orologio_tasca.webp`
* **ID enigma:** `orologio_tasca` (Distrattore)
* **Prompt:** `Single centered ornate closed antique brass pocket watch on a short gold chain with an embossed floral lid, high contrast crisp silhouette, generous padding around edges, clean dark midnight blue radial background (#0F172A), warm painterly storybook steampunk game icon, Professor Layton style, no border, no frame, no text, no numbers, no watermark.`

### `s11_candela`

* **Path:** `public/assets/props/s11_candela.webp`
* **ID enigma:** `candela` (Distrattore)
* **Prompt:** `Single centered lit cream wax pillar candle with a bright warm flame sitting in a small brass saucer candlestick holder with ring handle, high contrast crisp silhouette, generous padding around edges, clean dark midnight blue radial background (#0F172A), warm painterly storybook steampunk game icon, Professor Layton style, no border, no frame, no text, no watermark.`

### `s11_mappa_stellare`

* **Path:** `public/assets/props/s11_mappa_stellare.webp`
* **ID enigma:** `mappa_stellare` (Distrattore)
* **Prompt:** `Single centered unrolled deep indigo celestial star chart scroll decorated with glowing golden constellation lines and tiny stars, no words or labels, high contrast crisp silhouette, generous padding around edges, clean dark midnight blue radial background (#0F172A), warm painterly storybook steampunk game icon, Professor Layton style, no border, no frame, no text, no letters, no watermark.`

---

## 7. Oggetti Inventario e Medaglia Finale (10 asset — `384x384`, `1:1`)

*(Gli oggetti sbloccati alle stazioni 4, 8 e 12 riutilizzano direttamente `gear_bronze.png`, `gear_silver.png` e `gear_gold.png`.)*

### `item_frammento_1` — Frammento di Pergamena I (Stazione 1)

* **Path:** `public/assets/items/item_frammento_1.webp`
* **Prompt:** `Single centered torn piece of aged golden parchment featuring a bold glowing golden sun symbol painted in the center, no numbers or text, high contrast crisp silhouette, generous padding around edges, clean dark midnight blue radial background (#0F172A), warm painterly storybook steampunk game icon, Professor Layton style, no border, no frame, no text, no letters, no numbers, no watermark.`

### `item_frammento_2` — Frammento di Pergamena II (Stazione 2)

* **Path:** `public/assets/items/item_frammento_2.webp`
* **Prompt:** `Single centered torn piece of aged golden parchment featuring a bold glowing silver crescent moon symbol painted in the center, no numbers or text, high contrast crisp silhouette, generous padding around edges, clean dark midnight blue radial background (#0F172A), warm painterly storybook steampunk game icon, Professor Layton style, no border, no frame, no text, no letters, no numbers, no watermark.`

### `item_frammento_3` — Frammento di Pergamena III (Stazione 3)

* **Path:** `public/assets/items/item_frammento_3.webp`
* **Prompt:** `Single centered torn piece of aged golden parchment featuring a bold glowing radiant five-pointed star symbol painted in the center, no numbers or text, high contrast crisp silhouette, generous padding around edges, clean dark midnight blue radial background (#0F172A), warm painterly storybook steampunk game icon, Professor Layton style, no border, no frame, no text, no letters, no numbers, no watermark.`

### `item_chiave_officina` — Chiave dell'Officina (Stazione 5)

* **Path:** `public/assets/items/item_chiave_officina.webp`
* **Prompt:** `Single centered ornate heavy antique brass skeleton key whose bow handle is shaped like a tiny wrench emblem, gleaming warm metallic highlights, high contrast crisp silhouette, generous padding around edges, clean dark midnight blue radial background (#0F172A), warm painterly storybook steampunk game icon, Professor Layton style, no border, no frame, no text, no watermark.`

### `item_schema_apprendisti` — Schema degli Apprendisti (Stazione 6)

* **Path:** `public/assets/items/item_schema_apprendisti.webp`
* **Prompt:** `Single centered folded steampunk blueprint paper in deep cyan-blue with a crisp glowing golden lightning bolt emblem drawn in the center, no words or numbers, high contrast crisp silhouette, generous padding around edges, clean dark midnight blue radial background (#0F172A), warm painterly storybook steampunk game icon, Professor Layton style, no border, no frame, no text, no letters, no watermark.`

### `item_targhetta_officina` — Targhetta dell'Officina (Stazione 7)

* **Path:** `public/assets/items/item_targhetta_officina.webp`
* **Prompt:** `Single centered engraved oval silver-and-brass workshop nameplate featuring a bold embossed golden cogwheel gear icon in the center, no words or letters, high contrast crisp silhouette, generous padding around edges, clean dark midnight blue radial background (#0F172A), warm painterly storybook steampunk game icon, Professor Layton style, no border, no frame, no text, no letters, no watermark.`

### `item_sigillo_archivio` — Sigillo dell'Archivio (Stazione 9)

* **Path:** `public/assets/items/item_sigillo_archivio.webp`
* **Prompt:** `Single centered glowing golden diamond-shaped geometric wax-and-brass archive seal resting on a crimson velvet ribbon, symmetrical faceted crystal shine, high contrast crisp silhouette, generous padding around edges, clean dark midnight blue radial background (#0F172A), warm painterly storybook steampunk game icon, Professor Layton style, no border, no frame, no text, no watermark.`

### `item_spartito_rintocchi` — Spartito dei Rintocchi (Stazione 10)

* **Path:** `public/assets/items/item_spartito_rintocchi.webp`
* **Prompt:** `Single centered rolled vintage cream music sheet parchment tied with a golden ribbon, decorated with sparkling golden musical notes and a tiny golden bell motif, no text or numbers, high contrast crisp silhouette, generous padding around edges, clean dark midnight blue radial background (#0F172A), warm painterly storybook steampunk game icon, Professor Layton style, no border, no frame, no text, no numbers, no watermark.`

### `item_pagina_diario` — Pagina del Diario (Stazione 11)

* **Path:** `public/assets/items/item_pagina_diario.webp`
* **Prompt:** `Single centered gilded antique diary page with a delicate drawn clockwork diagram and a small red wax stamp at the corner, illegible decorative scribbles only, no real words or numbers, high contrast crisp silhouette, generous padding around edges, clean dark midnight blue radial background (#0F172A), warm painterly storybook steampunk game icon, Professor Layton style, no border, no frame, no text, no numbers, no watermark.`

### `badge_master_clockmaker` — Medaglia di Maestro Orologiaio (Stazione 13)

* **Path:** `public/assets/items/badge_master_clockmaker.webp`
* **Prompt:** `Single centered prestigious ceremonial gold and royal blue enamel medal shaped like a winged golden clockwork crest hanging from a crimson and gold ribbon, radiant celebration glow, no words or letters, high contrast crisp silhouette, generous padding around edges, clean dark midnight blue radial background (#0F172A), warm painterly storybook steampunk game icon, Professor Layton style, no border, no frame, no text, no letters, no watermark.`