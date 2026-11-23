# STORY_AND_PUZZLES.md — Il Caso dell'Orologio Fermo

## 1. Panoramica Narrativa e Regole LIM

* **Target:** Classe 5ª Primaria (10 anni), sessioni collettive alla LIM da 10–15 minuti (20–25 min per la Stazione 13).
* **Premessa:** All'alba del 1° dicembre il Grande Orologio della Torre del paese si è bloccato di colpo. La neve è rimasta sospesa a mezz'aria e il calendario non avanza più: senza riavviare il meccanismo, le vacanze invernali non arriveranno mai. Qualcuno ha manomesso la torre durante la notte facendo scattare il **Protocollo di Sicurezza** di **Mastro Orazio** (l'orologiaio scomparso), che ha sigillato i **3 Ingranaggi Maestri** (Bronzo, Argento, Oro) nei tre piani della torre.
* **Personaggio guida:** **Archimede**, il gufo meccanico d'ottone costruito da Mastro Orazio. Compare nei dialoghi con 3 espressioni (`mysterious`, `thinking`, `celebrating`).
* **Regola ferrea per i dialoghi sulla LIM:** Ogni battuta (`beat`) ha massimo 2 frasi brevi e avanza **solo su tocco manuale** del pulsante "Avanti" (mai auto-avanzamento a timer).
* **Regola per gli oggetti cliccabili (`HotspotScene`):** Gli oggetti interattivi non fanno parte dello sfondo statico, ma vanno renderizzati come medaglioni/prop sovrapposti a coordinate percentuali fisse `(x%, y%)` per garantire allineamento perfetto su schermi 4:3 e 16:9.

### Mappa dei 5 Motori React (`puzzleType`)

| `puzzleType` | Varianti (`mode`) | Stazioni che lo usano |
| --- | --- | --- |
| `HotspotScene` | `flashlight_sequence`, `find` | 1, 11 |
| `LogicBoard` | `balance`, `matching`, `order` | 2, 6, 10 |
| `CipherWheel` | `caesar`, `symbol_substitution` | 3, 7 |
| `GridMap` | `path_target`, `symmetry` | 5, 9 |
| `VaultLock` | `keypad`, `dials`, `clock`, `finale` | 4, 8, 12, 13 |

---

## ATTO 1: LA STANZA DEL PENDOLO (Stazioni 1–4)

*Sfondo: `bg_act1_pendulum.webp` — Obiettivo: recuperare l'Ingranaggio Maestro di Bronzo.*

### Stazione 1 — Il Buio nella Torre

* **Motore:** `HotspotScene` (`mode: "flashlight_sequence"`)
* **Dialogo Intro (LIM):**
* *(Archimede — `mysterious`):* "Benvenuti nella Torre, ragazzi! Il Grande Orologio si è fermato e il tempo è congelato al 1° dicembre."
* *(Archimede — `thinking`):* "Mastro Orazio ha attivato il blocco di sicurezza prima di sparire. Qui è tutto buio: usate la lanterna sullo schermo per trovare e toccare 4 oggetti nell'ordine esatto del suo biglietto!"


* **Enigma:** La stanza è oscurata da una maschera radiale (`flashlight`) che segue il dito sulla LIM. Ci sono 6 oggetti interattivi sparsi nella scena (*Lanterna ad olio*, *Disco del Pendolo*, *Cassetta degli attrezzi*, *Clessidra*, *Sedia di legno*, *Tappeto*). Gli alunni leggono il biglietto di Mastro Orazio e devono toccare **4 oggetti nell'ordine esatto**:
1. *"Primo: accendi ciò che fa luce senza elettricità."*
2. *"Secondo: tocca il gigante di ottone che oscilla avanti e indietro."*
3. *"Terzo: apri lo scrigno dove riposano gli strumenti di precisione."*
4. *"Quarto: osserva il vetro che misura il tempo con la sabbia."*


* **Soluzione esatta (sequenza ordinata):** `["lanterna", "pendolo", "cassetta", "clessidra"]`
* **3 Indizi progressivi:**
1. "Spostate lentamente il fascio di luce su tutta la scena prima di cliccare, e leggete un punto alla volta del biglietto."
2. "I primi due oggetti sono la Lanterna ad olio e il grande Disco del Pendolo al centro."
3. "L'ordine completo è: 1) Lanterna ad olio, 2) Disco del Pendolo, 3) Cassetta degli attrezzi, 4) Clessidra."


* **Dialogo Vittoria:**
* *(Archimede — `celebrating`):* "Luce ristabilita! Sotto la clessidra era nascosto il primo frammento di pergamena di Mastro Orazio."


* **Oggetto sbloccato:** `item_frammento_1` — **Frammento di Pergamena I** (Testo inventario: *"Simbolo SOLE = 4"*).

---

### Stazione 2 — I Pesi del Pendolo

* **Motore:** `LogicBoard` (`mode: "balance"`)
* **Dialogo Intro (LIM):**
* *(Archimede — `thinking`):* "La barra del pendolo è bloccata perché i contrappesi sono sbilanciati."
* *(Archimede — `mysterious`):* "Leggete bene la targhetta incisa sulla bilancia: non basta raggiungere il peso giusto, dovete rispettare tutte le regole!"


* **Enigma:** Sul piatto sinistro della bilancia c'è un contrappeso fisso da **42 kg**. Sul banco in basso ci sono **6 pesi selezionabili**: `7 kg`, `10 kg`, `12 kg`, `14 kg`, `16 kg`, `19 kg`.
* **Regola incisa sulla targhetta:** *"Raggiungi esattamente **42 kg** scegliendo **3 pesi diversi**, senza usare nessun peso con numero **dispari**."*
* *(Nota tecnica: se la classe sceglie `7 + 16 + 19 = 42`, il feedback mostra "42 kg esatti, ma hai usato pesi dispari! Rileggi la targhetta.")*


* **Soluzione esatta (set non ordinato):** `[12, 14, 16]` *(Verifica: 12 + 14 + 16 = 42, tutti pari, unica combinazione valida).*
* **3 Indizi progressivi:**
1. "Prima di fare i conti, eliminate subito i pesi con numeri dispari: 7 e 19 non si possono usare."
2. "Vi restano solo quattro pesi: 10, 12, 14 e 16. Quale di questi quattro dovete lasciare fuori per arrivare a 42?"
3. "Sommate i tre pesi più pesanti tra quelli pari: 12 + 14 + 16 = 42."


* **Dialogo Vittoria:**
* *(Archimede — `celebrating`):* "Equilibrio perfetto! Il cassetto del contrappeso è scattato e ha rivelato il secondo frammento!"


* **Oggetto sbloccato:** `item_frammento_2` — **Frammento di Pergamena II** (Testo inventario: *"Simbolo LUNA = 7"*).

---

### Stazione 3 — Il Messaggio della Ruota Cifrata

* **Motore:** `CipherWheel` (`mode: "caesar"`)
* **Dialogo Intro (LIM):**
* *(Archimede — `mysterious`):* "Ho trovato un biglietto incastrato nella cassa del pendolo, ma sono solo lettere senza senso: `RGPFQNQ`."
* *(Archimede — `thinking`):* "Mastro Orazio adorava i codici segreti! Ruotate il disco cifrato seguendo il suo indizio per scoprire la parola nascosta."


* **Enigma:** Viene mostrata una ruota cifrata interattiva (alfabeto A–Z) con anello esterno (lettere in chiaro) e anello interno rotabile (lettere cifrate) + tastierino lettere in basso per inserire la parola decodificata.
* **Messaggio cifrato:** **`RGPFQNQ`**
* **Indizio inciso sul bordo:** *"Quando il pendolo batte **2 colpi in avanti**, la lettera **A** diventa **C**."*


* **Soluzione esatta:** **`PENDOLO`** *(Verifica: P→R, E→G, N→P, D→F, O→Q, L→N, O→Q; identico sia su alfabeto 21 sia 26 lettere).*
* **3 Indizi progressivi:**
1. "Ruotate l'anello interno finché sotto la lettera A dell'anello esterno compare la lettera C (spostamento di 2 posizioni)."
2. "Per decifrare, cercate ogni lettera di RGPFQNQ sull'anello cifrato e leggete la lettera corrispondente sull'altro anello: R diventa P, G diventa E..."
3. "Le prime quattro lettere sono P-E-N-D... È il grande meccanismo che dà il nome a questa stanza!"


* **Dialogo Vittoria:**
* *(Archimede — `celebrating`):* "Esatto, PENDOLO! Dietro il pannello segreto c'era il terzo e ultimo frammento di questo piano."


* **Oggetto sbloccato:** `item_frammento_3` — **Frammento di Pergamena III** (Testo inventario: *"Simbolo STELLA = 9"*).

---

### Stazione 4 (Snodo Atto 1) — La Teca del Bronzo

* **Motore:** `VaultLock` (`mode: "keypad"`)
* **Dialogo Intro (LIM):**
* *(Archimede — `mysterious`):* "Eccola! La Teca del primo Ingranaggio Maestro. Serve un codice a 4 cifre."
* *(Archimede — `thinking`):* "Aprite l'inventario qui sotto e controllate i tre frammenti che avete raccolto negli ultimi giorni!"


* **Enigma:** Tastierino numerico gigante (0–9) in fascia bassa. Incisione sulla teca:
* **1ª cifra:** valore della **STELLA**
* **2ª cifra:** valore del **SOLE**
* **3ª cifra:** valore della **LUNA**
* **4ª cifra:** **SOLE + LUNA − STELLA**


* **Soluzione esatta:** **`9472`** *(Verifica: Stella=9, Sole=4, Luna=7; 4 + 7 − 9 = 2).*
* **3 Indizi progressivi:**
1. "Attenzione all'ordine! La teca chiede prima la Stella, poi il Sole, poi la Luna (non nell'ordine in cui li avete trovati)."
2. "Le prime tre cifre dai vostri frammenti sono 9, 4 e 7. Ora fate il calcolo per l'ultima cifra."
3. "Calcolate 4 + 7 = 11, poi togliete 9: fa 2. Il codice completo è 9472."


* **Dialogo Vittoria:**
* *(Archimede — `celebrating`):* "CLACK! La teca si è aperta! Avete conquistato l'Ingranaggio Maestro di Bronzo e la porta per l'Officina è sbloccata!"


* **Oggetto sbloccato:** `gear_bronze` — **Ingranaggio Maestro di Bronzo** (Testo inventario: *"Valore inciso sul retro: 3"*).
* **Ponte fisico (opzionale per la maestra):** Consegnare alla classe l'ingranaggio di bronzo stampato su cartoncino con il numero **3** scritto sul retro.

---

## ATTO 2: L'OFFICINA DEGLI INGRANAGGI (Stazioni 5–8)

*Sfondo: `bg_act2_workshop.webp` — Obiettivo: recuperare l'Ingranaggio Maestro d'Argento.*

### Stazione 5 — La Mappa del Banco da Lavoro

* **Motore:** `GridMap` (`mode: "path_target"`)
* **Dialogo Intro (LIM):**
* *(Archimede — `mysterious`):* "Benvenuti al secondo piano: l'Officina! Qui Mastro Orazio costruiva ogni pezzo della torre."
* *(Archimede — `thinking`):* "La chiave dell'armadio è nascosta sotto una piastrella del pavimento. Seguite la bussola passo dopo passo per trovarla!"


* **Enigma:** Griglia **5×5** con colonne **A–E** (da Ovest a Est) e righe **1–5** (da Nord a Sud), con rosa dei venti (`N, S, E, O`) ben visibile.
* **Istruzioni del progetto:**
1. Parti dalla cella evidenziata **`C3`**.
2. Fai **2 passi a Nord**.
3. Fai **2 passi a Ovest**.
4. Fai **3 passi a Sud**.
5. Fai **4 passi a Est**.
6. Fai **2 passi a Nord**.
7. Fai **1 passo a Ovest**. Tocca la cella di arrivo e premi Conferma!




* **Soluzione esatta:** **`D2`** *(Verifica: C3 → C1 → A1 → A4 → E4 → E2 → D2).*
* **3 Indizi progressivi:**
1. "Ricordate: Nord è verso l'alto, Sud verso il basso, Ovest a sinistra, Est a destra. Potete segnare le tappe intermedie."
2. "Dopo i primi 3 movimenti (2 Nord, 2 Ovest, 3 Sud) vi trovate esattamente nella cella A4."
3. "Da A4 andate di 4 passi a Est fino a E4, poi 2 passi a Nord fino a E2, infine 1 passo a Ovest: siete in D2!"


* **Dialogo Vittoria:**
* *(Archimede — `celebrating`):* "Sotto la piastrella D2 c'era proprio la Chiave dell'Officina! Guardate cosa c'è inciso sull'impugnatura..."


* **Oggetto sbloccato:** `item_chiave_officina` — **Chiave dell'Officina** (Testo inventario: *"1° simbolo della Cassaforte d'Argento: CHIAVE INGLESE"*).

---

### Stazione 6 — Gli Apprendisti di Mastro Orazio

* **Motore:** `LogicBoard` (`mode: "matching"`)
* **Dialogo Intro (LIM):**
* *(Archimede — `thinking`):* "In officina lavoravano quattro apprendisti: Lia, Nora, Giacomo e Tito. Prima di scappare hanno mischiato tutti i loro attrezzi!"
* *(Archimede — `mysterious`):* "Rimettete ogni strumento al proprietario giusto leggendo i 4 indizi: si sbloccherà lo schema segreto dell'officina."


* **Enigma:** Scheda di associazione (tap su apprendista → tap su strumento) tra 4 apprendisti (**Lia, Nora, Giacomo, Tito**) e 4 strumenti (**Lente, Martello, Pinza, Cacciavite**).
* **Indizi:**
1. **Nora** non usa la **Pinza** e non usa il **Cacciavite**.
2. **Lia** usa lo strumento di vetro che ingrandisce i micro-ingranaggi.
3. **Giacomo** usa lo strumento il cui nome inizia con la stessa lettera della parola **Pendolo**.
4. **Tito** usa l'ultimo strumento rimasto sul banco.




* **Soluzione esatta:**
* `Lia` → **`Lente`**
* `Nora` → **`Martello`**
* `Giacomo` → **`Pinza`**
* `Tito` → **`Cacciavite`**


* **3 Indizi progressivi:**
1. "Partite dagli indizi più sicuri: il numero 2 (Lia) e il numero 3 (Giacomo) vi danno subito due coppie certe."
2. "Lia ha la Lente e Giacomo ha la Pinza. Ora rileggete l'indizio 1 su Nora: le resta un solo strumento possibile!"
3. "Nora non usa né Pinza né Cacciavite e la Lente è di Lia, quindi Nora ha il Martello. A Tito resta il Cacciavite."


* **Dialogo Vittoria:**
* *(Archimede — `celebrating`):* "Squadra al completo! Sul retro del registro degli apprendisti è apparso il secondo simbolo per la cassaforte!"


* **Oggetto sbloccato:** `item_schema_apprendisti` — **Schema degli Apprendisti** (Testo inventario: *"2° simbolo della Cassaforte d'Argento: FULMINE"*).

---

### Stazione 7 — Il Codice dei Simboli Meccanici

* **Motore:** `CipherWheel` (`mode: "symbol_substitution"`)
* **Dialogo Intro (LIM):**
* *(Archimede — `mysterious`):* "Sul banco c'è una targhetta scritta nell'antico alfabeto a simboli degli orologiai."
* *(Archimede — `thinking`):* "Per fortuna abbiamo tre parole già tradotte sul quaderno! Confrontate i simboli per decifrare la parola segreta."


* **Enigma:** A schermo sono visibili 3 parole di riferimento già decifrate e la parola segreta da inserire tramite il tastierino lettere in basso:
* `● ▲ ● ■ ● ◆ ★ ●` = **`O R O L O G I O`**
* `✚ ☀ ☾ ⚡ ☀ ❄ ☀` = **`C A M P A N A`**
* `🔑 ▲ 💧 ❄ ●` = **`T R E N O`**
* **Parola segreta da decifrare:** **`☀ ▲ ◆ 💧 ❄ 🔑 ●`**


* **Soluzione esatta:** **`ARGENTO`** *(Verifica: ☀=A, ▲=R, ◆=G, 💧=E, ❄=N, 🔑=T, ●=O).*
* **3 Indizi progressivi:**
1. "Partite dai simboli più facili: ☀ compare tre volte in CAMPANA (quindi è la A) e ● compare quattro volte in OROLOGIO (è la O)."
2. "Guardate TRENO per trovare ▲ (R), 💧 (E), ❄ (N) e 🔑 (T). Vi manca solo il rombo ◆ da cercare in OROLOGIO!"
3. "Il rombo ◆ è la sesta lettera di O-R-O-L-O-G-I-O, cioè la G. Mettendo tutto insieme ottenete il nome di un metallo prezioso: ARGENTO."


* **Dialogo Vittoria:**
* *(Archimede — `celebrating`):* "ARGENTO! La targhetta si è ribaltata rivelando il terzo simbolo per la cassaforte!"


* **Oggetto sbloccato:** `item_targhetta_officina` — **Targhetta dell'Officina** (Testo inventario: *"3° simbolo della Cassaforte d'Argento: INGRANAGGIO"*).

---

### Stazione 8 (Snodo Atto 2) — La Cassaforte d'Argento

* **Motore:** `VaultLock` (`mode: "dials"`)
* **Dialogo Intro (LIM):**
* *(Archimede — `mysterious`):* "Siamo davanti alla Cassaforte d'Argento! Ha quattro rotelle con simboli incisi."
* *(Archimede — `thinking`):* "Tre simboli li avete già nell'inventario. Per il quarto, leggete l'indovinello inciso sul portello!"


* **Enigma:** 4 rotelle rotanti cliccabili (ciascuna cicla tra 6 icone: `Chiave Inglese`, `Fulmine`, `Ingranaggio`, `Gufo`, `Ancora`, `Corona`).
* **Incisione sul portello:** *"Imposta i 3 simboli raccolti nell'Officina nell'ordine giusto. Sulla **4ª rotella**, scegli il custode alato di ottone che vi guida fin dal primo giorno!"*


* **Soluzione esatta:** `["chiave_inglese", "fulmine", "ingranaggio", "gufo"]`
* **3 Indizi progressivi:**
1. "Controllate nell'inventario in basso i tre oggetti dell'Atto 2: ognuno vi dice l'esatta posizione del proprio simbolo."
2. "Le prime tre rotelle sono: 1) Chiave Inglese, 2) Fulmine, 3) Ingranaggio. Chi è il custode alato di ottone?"
3. "Il custode alato è proprio Archimede: sulla quarta rotella scegliete il Gufo!"


* **Dialogo Vittoria:**
* *(Archimede — `celebrating`):* "WOOHOO! Avete recuperato l'Ingranaggio Maestro d'Argento! Ora saliamo al terzo piano: l'Archivio del Tempo!"


* **Oggetto sbloccato:** `gear_silver` — **Ingranaggio Maestro d'Argento** (Testo inventario: *"Valore inciso sul retro: 6"*).
* **Ponte fisico (opzionale per la maestra):** Consegnare alla classe l'ingranaggio d'argento stampato su cartoncino con il numero **6** scritto sul retro.

---

## ATTO 3: L'ARCHIVIO DEL TEMPO (Stazioni 9–12)

*Sfondo: `bg_act3_archive.webp` — Obiettivo: recuperare l'Ingranaggio Maestro d'Oro.*

### Stazione 9 — Il Sigillo Spezzato

* **Motore:** `GridMap` (`mode: "symmetry"`)
* **Dialogo Intro (LIM):**
* *(Archimede — `mysterious`):* "Eccoci nell'Archivio del Tempo, pieno di antichi registri e pergamene!"
* *(Archimede — `thinking`):* "Il sigillo dorato che apre gli scaffali si è cancellato a metà. Completate la parte destra esattamente a specchio!"


* **Enigma:** Griglia **6 colonne × 5 righe** divisa verticalmente a metà da un asse dorato luminoso (tra colonna 3 e colonna 4).
* **Metà sinistra illuminata (fissa):** 6 caselle accese alle coordinate `(col, row)`: `(3,1)`, `(2,2)`, `(1,3)`, `(3,3)`, `(2,4)`, `(3,5)`.
* **Obiettivo:** Toccare sulla metà destra (colonne 4–6) le **6 caselle simmetriche** rispetto all'asse centrale per ricomporre il sigillo a diamante.


* **Soluzione esatta (set di 6 celle):** `[(4,1), (5,2), (6,3), (4,3), (5,4), (4,5)]` *(Verifica: ogni `col` si specchia in `7 − col`).*
* **3 Indizi progressivi:**
1. "Osservate la distanza di ogni casella dall'asse dorato centrale: se a sinistra tocca l'asse, anche a destra deve toccare l'asse!"
2. "Nelle righe 1 e 5 accendete le caselle attaccate all'asse (colonna 4). Nella riga 3 ce ne sono due: una vicina all'asse e una sul bordo esterno!"
3. "Le 6 caselle giuste sulla destra sono: riga 1 col 4; riga 2 col 5; riga 3 col 4 e col 6; riga 4 col 5; riga 5 col 4."


* **Dialogo Vittoria:**
* *(Archimede — `celebrating`):* "Simmetria impeccabile! Il sigillo si è illuminato rivelando l'orario di partenza dell'Archivio!"


* **Oggetto sbloccato:** `item_sigillo_archivio` — **Sigillo dell'Archivio** (Testo inventario: *"Orario di partenza per la Cassaforte d'Oro: 09:00"*).

---

### Stazione 10 — I Tubi dei Rintocchi

* **Motore:** `LogicBoard` (`mode: "order"`)
* **Dialogo Intro (LIM):**
* *(Archimede — `thinking`):* "Questi quattro tubi d'ottone scandiscono i rintocchi della torre, ma qualcuno li ha scambiati di posto."
* *(Archimede — `mysterious`):* "Ordinateli dal tempo più BREVE al tempo più LUNGO! Trasformate tutto in minuti per non cadere in trappola."


* **Enigma:** 4 tubi sonori colorati da riordinare (con tap-scambia o frecce sinistra/destra in fascia bassa) dal più breve al più lungo:
* **Tubo Blu:** `25 minuti`
* **Tubo Rosso:** `1/4 d'ora`
* **Tubo Verde:** `3/4 d'ora`
* **Tubo Giallo:** `1/2 ora + 5 minuti`


* **Soluzione esatta (dal più breve al più lungo):** `["rosso", "blu", "giallo", "verde"]` *(Verifica: Rosso = 15 min, Blu = 25 min, Giallo = 30 + 5 = 35 min, Verde = 45 min).*
* **3 Indizi progressivi:**
1. "Un'ora ha 60 minuti. Quanto vale un quarto d'ora (60 diviso 4)? E quanto vale mezz'ora?"
2. "Il tubo Rosso dura 15 minuti e il tubo Blu 25 minuti. Ora calcolate il Giallo (30 + 5) e il Verde (15 × 3)."
3. "I tempi esatti sono: Rosso 15 min, Blu 25 min, Giallo 35 min, Verde 45 min. L'ordine è: Rosso, Blu, Giallo, Verde!"


* **Dialogo Vittoria:**
* *(Archimede — `celebrating`):* "Che melodia perfetta! Dallo scomparto musicale è scivolato fuori lo spartito con il secondo indizio!"


* **Oggetto sbloccato:** `item_spartito_rintocchi` — **Spartito dei Rintocchi** (Testo inventario: *"Aggiungi 2 ore e 30 minuti all'orario del Sigillo"*).

---

### Stazione 11 — Gli Oggetti del Diario

* **Motore:** `HotspotScene` (`mode: "find"`)
* **Dialogo Intro (LIM):**
* *(Archimede — `mysterious`):* "Mastro Orazio ha nascosto l'ultima pagina del suo diario dietro un meccanismo a quattro pulsanti segreti."
* *(Archimede — `thinking`):* "Leggete i 4 indizi sull'archivio e toccate solo i 4 oggetti giusti tra gli otto sugli scaffali!"


* **Enigma:** Scena illuminata con **8 oggetti interattivi** (*Mappamondo*, *Libro Rosso*, *Libro Blu*, *Orologio da Tasca*, *Telescopio*, *Piuma d'Oca*, *Candela*, *Mappa Stellare*). Bisogna trovare i **4 oggetti** descritti dalle note (in qualsiasi ordine):
1. *"Il primo pulsante è nell'oggetto che mostra tutti i continenti della Terra."*
2. *"Il secondo è nello strumento che serve per osservare le stelle lontane."*
3. *"Il terzo è nel libro del colore del rubino."*
4. *"Il quarto è nell'oggetto con cui scrivevo i miei diari usando l'inchiostro."*


* **Soluzione esatta (set non ordinato):** `["mappamondo", "telescopio", "libro_rosso", "piuma"]`
* **3 Indizi progressivi:**
1. "Leggete bene ogni frase: i primi due oggetti riguardano la geografia e l'astronomia."
2. "Il rubino è una pietra preziosa rossa, e un tempo per scrivere con l'inchiostro non si usavano penne a sfera ma piume..."
3. "I 4 oggetti da toccare sono: Mappamondo, Telescopio, Libro Rosso e Piuma d'Oca."


* **Dialogo Vittoria:**
* *(Archimede — `celebrating`):* "Clic, clic, clic, clic! Lo scomparto del diario si è aperto: ora avete tutto per la Cassaforte d'Oro!"


* **Oggetto sbloccato:** `item_pagina_diario` — **Pagina del Diario** (Testo inventario: *"Sottrai 15 minuti per ottenere l'ora esatta della Cassaforte d'Oro"*).

---

### Stazione 12 (Snodo Atto 3) — L'Orologio della Cassaforte d'Oro

* **Motore:** `VaultLock` (`mode: "clock"`)
* **Dialogo Intro (LIM):**
* *(Archimede — `mysterious`):* "Ecco la Cassaforte d'Oro! Non ha pulsanti numerici, ma due lancette d'ottone da impostare sull'ora segreta."
* *(Archimede — `thinking`):* "Mettete insieme i tre indizi raccolti nell'Archivio del Tempo, fate i conti con calma e muovete le lancette!"


* **Enigma:** Quadrante SVG interattivo con pulsanti grandi nella fascia bassa (`-1 ora`, `+1 ora`, `-5 min`, `+5 min`) + display digitale di supporto (o lettura solo analogica, opzionale da config).
* **Ricostruzione dall'inventario:**
* Stazione 9 (Sigillo): partenza alle **`09:00`**
* Stazione 10 (Spartito): **`+ 2 ore e 30 minuti`**
* Stazione 11 (Diario): **`− 15 minuti`**




* **Soluzione esatta:** **`11:15`** *(Verifica: 09:00 + 2h 30m = 11:30; 11:30 − 15m = 11:15).*
* **3 Indizi progressivi:**
1. "Partite dalle 09:00 del Sigillo e fate un calcolo alla volta: prima aggiungete le 2 ore e 30 minuti."
2. "09:00 più 2 ore fa 11:00; più 30 minuti fa 11:30. Ora togliete i 15 minuti indicati dal diario!"
3. "Da 11:30 togliete 15 minuti: l'orario esatto è 11:15 (lancetta corta sull'11, lancetta lunga sul 3)."


* **Dialogo Vittoria:**
* *(Archimede — `celebrating`):* "ECCOLO! L'Ingranaggio Maestro d'Oro è vostro! Tutti e tre gli ingranaggi sono riuniti: domani si sale in cima al Quadrante della Torre!"


* **Oggetto sbloccato:** `gear_gold` — **Ingranaggio Maestro d'Oro** (Testo inventario: *"Valore inciso sul retro: 9"*).
* **Ponte fisico (opzionale per la maestra):** Consegnare alla classe l'ingranaggio d'oro stampato su cartoncino con il numero **9** scritto sul retro.

---

## GRAN FINALE: IL QUADRANTE DELLA TORRE (Stazione 13)

*Sfondo: `bg_finale_clockface.webp` — Durata prevista: 20–25 minuti.*

### Stazione 13 — Il Risveglio del Grande Orologio

* **Motore:** `VaultLock` (`mode: "finale"`) — *strutturato in 2 fasi consecutive nella stessa schermata*.
* **Dialogo Intro (LIM):**
* *(Archimede — `mysterious`):* "Ci siamo, classe 5ª! Siamo in cima alla Torre, davanti al cuore ghiacciato del Grande Orologio!"
* *(Archimede — `thinking`):* "Avete tutti e tre gli Ingranaggi Maestri: Bronzo (3), Argento (6) e Oro (9). Posizionateli negli alloggiamenti giusti per riaccendere il motore!"



#### Fase 13A — Posizionamento dei 3 Ingranaggi Maestri

* **Enigma:** Tre alloggiamenti vuoti (**Sinistra**, **Centro**, **Destra**). La classe tocca un ingranaggio dall'inventario e poi l'alloggiamento in cui inserirlo, leggendo l'incisione di Mastro Orazio:
* *"L'ingranaggio più prezioso (**Oro**) non va né a sinistra né a destra."*
* *"A **sinistra** inserisci l'ingranaggio il cui numero è la **metà** di quello d'Argento."*
* *"A **destra** inserisci l'ultimo ingranaggio rimasto."*


* **Soluzione Fase 13A:** `[Sinistra: "gear_bronze" (3), Centro: "gear_gold" (9), Destra: "gear_silver" (6)]`
* *(Effetto visivo allo sblocco di 13A: i 3 ingranaggi si incastrano, iniziano a girare insieme, il ghiaccio sul quadrante si illumina d'oro e parte la Fase 13B!)*

#### Fase 13B — Il Rintocco del Risveglio

* **Dialogo intermedio:**
* *(Archimede — `celebrating`):* "Gli ingranaggi girano! Manca un ultimo gesto: impostate le lancette del Grande Orologio usando i numeri dei tre ingranaggi e premete RIAVVIA!"


* **Enigma:** Quadrante finale con i controlli delle lancette in fascia bassa. Regola finale:
* **Lancetta delle ORE:** *"Somma il numero dell'Ingranaggio di **Bronzo (3)** e quello dell'Ingranaggio d'**Oro (9)**."*
* **Lancetta dei MINUTI:** *"Prendi il numero dell'Ingranaggio d'**Argento (6)** e sottrai **due volte** quello di **Bronzo (3)**."*


* **Soluzione Fase 13B:** **`12:00`** *(Verifica: Ore = 3 + 9 = 12; Minuti = 6 − 3 − 3 = 00).*
* **3 Indizi progressivi (coprono 13A e 13B):**
1. "Per gli ingranaggi: l'Oro non è ai lati, quindi va al Centro. La metà di 6 (Argento) è 3 (Bronzo), che va a Sinistra!"
2. "Per l'ora finale: sommate 3 + 9 per le ore. Per i minuti fate 6 meno 3 meno 3!"
3. "Le ore sono 12 e i minuti sono 00: impostate entrambe le lancette sul 12 per il grande rintocco!"


* **Dialogo Vittoria & Finale Celebrativo:**
* *(Effetti: 12 rintocchi solenni via Web Audio API, lancette che ripartono, pioggia di scintille dorate e fiocchi di neve con `canvas-confetti`.)*
* *(Archimede — `celebrating`):* "DONG! DONG! Il Grande Orologio è ripartito! La neve ricomincia a scendere, il tempo scorre di nuovo e le vacanze sono salve!"
* *(Messaggio schermo intero finale):* **"MISSIONE COMPIUTA, MAESTRI OROLOGIAI! BUONE VACANZE DI NATALE!"**


* **Oggetto sbloccato:** `badge_master_clockmaker` — **Medaglia di Maestro Orologiaio**