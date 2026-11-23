import type { PuzzleConfig, StationDefinition, StationId } from '../types/game';

export const STATIONS: StationDefinition[] = [
  {
    id: 1,
    act: 1,
    actName: 'Atto 1 — La Stanza del Pendolo',
    title: 'Il Buio nella Torre',
    backgroundPath: '/assets/backgrounds/bg_act1_pendulum.webp',
    introBeats: [
      {
        speaker: 'Archimede',
        expression: 'mysterious',
        text: 'Benvenuti nella Torre, ragazzi! Il Grande Orologio si è fermato e il tempo è congelato al 1° dicembre.',
      },
      {
        speaker: 'Archimede',
        expression: 'thinking',
        text: 'Mastro Orazio ha attivato il blocco di sicurezza prima di sparire. Qui è tutto buio: usate la lanterna sullo schermo per trovare e toccare 4 oggetti nell’ordine esatto del suo biglietto!',
      },
    ],
    puzzle: {
      puzzleType: 'HotspotScene',
      mode: 'flashlight_sequence',
      promptTitle: 'Tocca i 4 oggetti del biglietto nell’ordine esatto',
      clues: [
        'Primo: accendi ciò che fa luce senza elettricità.',
        'Secondo: tocca il gigante di ottone che oscilla avanti e indietro.',
        'Terzo: apri lo scrigno dove riposano gli strumenti di precisione.',
        'Quarto: osserva il vetro che misura il tempo con la sabbia.',
      ],
      props: [
        {
          id: 'lanterna',
          label: 'Lanterna ad olio',
          imagePath: '/assets/props/s1_lanterna.webp',
          xPercent: 18,
          yPercent: 32,
        },
        {
          id: 'pendolo',
          label: 'Disco del Pendolo',
          imagePath: '/assets/props/s1_pendolo.webp',
          xPercent: 50,
          yPercent: 28,
        },
        {
          id: 'cassetta',
          label: 'Cassetta degli attrezzi',
          imagePath: '/assets/props/s1_cassetta.webp',
          xPercent: 78,
          yPercent: 62,
        },
        {
          id: 'clessidra',
          label: 'Clessidra',
          imagePath: '/assets/props/s1_clessidra.webp',
          xPercent: 80,
          yPercent: 26,
        },
        {
          id: 'sedia',
          label: 'Sedia di legno',
          imagePath: '/assets/props/s1_sedia.webp',
          xPercent: 26,
          yPercent: 68,
        },
        {
          id: 'tappeto',
          label: 'Tappeto',
          imagePath: '/assets/props/s1_tappeto.webp',
          xPercent: 52,
          yPercent: 72,
        },
      ],
      solutionSequence: ['lanterna', 'pendolo', 'cassetta', 'clessidra'],
    },
    hints: [
      'Spostate lentamente il fascio di luce su tutta la scena prima di cliccare, e leggete un punto alla volta del biglietto.',
      'I primi due oggetti sono la Lanterna ad olio e il grande Disco del Pendolo al centro.',
      'L’ordine completo è: 1) Lanterna ad olio, 2) Disco del Pendolo, 3) Cassetta degli attrezzi, 4) Clessidra.',
    ],
    outroBeats: [
      {
        speaker: 'Archimede',
        expression: 'celebrating',
        text: 'Luce ristabilita! Sotto la clessidra era nascosto il primo frammento di pergamena di Mastro Orazio.',
      },
    ],
    rewardItemId: 'item_frammento_1',
  },
  {
    id: 2,
    act: 1,
    actName: 'Atto 1 — La Stanza del Pendolo',
    title: 'I Pesi del Pendolo',
    backgroundPath: '/assets/backgrounds/bg_act1_pendulum.webp',
    introBeats: [
      {
        speaker: 'Archimede',
        expression: 'thinking',
        text: 'La barra del pendolo è bloccata perché i contrappesi sono sbilanciati.',
      },
      {
        speaker: 'Archimede',
        expression: 'mysterious',
        text: 'Leggete bene la targhetta incisa sulla bilancia: non basta raggiungere il peso giusto, dovete rispettare tutte le regole!',
      },
    ],
    puzzle: {
      puzzleType: 'LogicBoard',
      mode: 'balance',
      promptTitle: 'Bilancia il contrappeso da 42 kg',
      ruleText:
        'Raggiungi esattamente 42 kg scegliendo 3 pesi diversi, senza usare nessun peso con numero dispari.',
      targetWeight: 42,
      requiredCount: 3,
      forbidOdd: true,
      availableWeights: [7, 10, 12, 14, 16, 19],
      solutionSet: [12, 14, 16],
    },
    hints: [
      'Prima di fare i conti, eliminate subito i pesi con numeri dispari: 7 e 19 non si possono usare.',
      'Vi restano solo quattro pesi: 10, 12, 14 e 16. Quale di questi quattro dovete lasciare fuori per arrivare a 42?',
      'Sommate i tre pesi più pesanti tra quelli pari: 12 + 14 + 16 = 42.',
    ],
    outroBeats: [
      {
        speaker: 'Archimede',
        expression: 'celebrating',
        text: 'Equilibrio perfetto! Il cassetto del contrappeso è scattato e ha rivelato il secondo frammento!',
      },
    ],
    rewardItemId: 'item_frammento_2',
  },
  {
    id: 3,
    act: 1,
    actName: 'Atto 1 — La Stanza del Pendolo',
    title: 'Il Messaggio della Ruota Cifrata',
    backgroundPath: '/assets/backgrounds/bg_act1_pendulum.webp',
    introBeats: [
      {
        speaker: 'Archimede',
        expression: 'mysterious',
        text: 'Ho trovato un biglietto incastrato nella cassa del pendolo, ma sono solo lettere senza senso: RGPFQNQ.',
      },
      {
        speaker: 'Archimede',
        expression: 'thinking',
        text: 'Mastro Orazio adorava i codici segreti! Ruotate il disco cifrato seguendo il suo indizio per scoprire la parola nascosta.',
      },
    ],
    puzzle: {
      puzzleType: 'CipherWheel',
      mode: 'caesar',
      promptTitle: 'Decifra il messaggio segreto: RGPFQNQ',
      ruleText: 'Quando il pendolo batte 2 colpi in avanti, la lettera A diventa C.',
      encryptedWord: 'RGPFQNQ',
      shift: 2,
      solutionWord: 'PENDOLO',
    },
    hints: [
      'Ruotate l’anello interno finché sotto la lettera A dell’anello esterno compare la lettera C (spostamento di 2 posizioni).',
      'Per decifrare, cercate ogni lettera di RGPFQNQ sull’anello cifrato e leggete la lettera corrispondente sull’altro anello: R diventa P, G diventa E...',
      'Le prime quattro lettere sono P-E-N-D... È il grande meccanismo che dà il nome a questa stanza!',
    ],
    outroBeats: [
      {
        speaker: 'Archimede',
        expression: 'celebrating',
        text: 'Esatto, PENDOLO! Dietro il pannello segreto c’era il terzo e ultimo frammento di questo piano.',
      },
    ],
    rewardItemId: 'item_frammento_3',
  },
  {
    id: 4,
    act: 1,
    actName: 'Atto 1 — La Stanza del Pendolo',
    title: 'La Teca del Bronzo',
    backgroundPath: '/assets/backgrounds/bg_act1_pendulum.webp',
    isChapterBoss: true,
    introBeats: [
      {
        speaker: 'Archimede',
        expression: 'mysterious',
        text: 'Eccola! La Teca del primo Ingranaggio Maestro. Serve un codice a 4 cifre.',
      },
      {
        speaker: 'Archimede',
        expression: 'thinking',
        text: 'Aprite l’inventario qui sotto e controllate i tre frammenti che avete raccolto negli ultimi giorni!',
      },
    ],
    puzzle: {
      puzzleType: 'VaultLock',
      mode: 'keypad',
      promptTitle: 'Apri la Teca del Bronzo',
      ruleLines: [
        '1ª cifra: valore della STELLA',
        '2ª cifra: valore del SOLE',
        '3ª cifra: valore della LUNA',
        '4ª cifra: SOLE + LUNA − STELLA',
      ],
      codeLength: 4,
      solutionCode: '9472',
    },
    hints: [
      'Attenzione all’ordine! La teca chiede prima la Stella, poi il Sole, poi la Luna (non nell’ordine in cui li avete trovati).',
      'Le prime tre cifre dai vostri frammenti sono 9, 4 e 7. Ora fate il calcolo per l’ultima cifra.',
      'Calcolate 4 + 7 = 11, poi togliete 9: fa 2. Il codice completo è 9472.',
    ],
    outroBeats: [
      {
        speaker: 'Archimede',
        expression: 'celebrating',
        text: 'CLACK! La teca si è aperta! Avete conquistato l’Ingranaggio Maestro di Bronzo e la porta per l’Officina è sbloccata!',
      },
    ],
    rewardItemId: 'gear_bronze',
    physicalBridgeNote:
      'Consegnare alla classe l’ingranaggio di bronzo stampato su cartoncino con il numero 3 scritto sul retro.',
  },
  {
    id: 5,
    act: 2,
    actName: "Atto 2 — L'Officina degli Ingranaggi",
    title: 'La Mappa del Banco da Lavoro',
    backgroundPath: '/assets/backgrounds/bg_act2_workshop.webp',
    introBeats: [
      {
        speaker: 'Archimede',
        expression: 'mysterious',
        text: 'Benvenuti al secondo piano: l’Officina! Qui Mastro Orazio costruiva ogni pezzo della torre.',
      },
      {
        speaker: 'Archimede',
        expression: 'thinking',
        text: 'La chiave dell’armadio è nascosta sotto una piastrella del pavimento. Seguite la bussola passo dopo passo per trovarla!',
      },
    ],
    puzzle: {
      puzzleType: 'GridMap',
      mode: 'path_target',
      promptTitle: 'Segui la bussola dalla cella C3 e trova la piastrella giusta',
      rows: 5,
      cols: 5,
      colLabels: ['A', 'B', 'C', 'D', 'E'],
      rowLabels: ['1', '2', '3', '4', '5'],
      startCell: 'C3',
      steps: [
        'Parti dalla cella evidenziata C3.',
        'Fai 2 passi a Nord.',
        'Fai 2 passi a Ovest.',
        'Fai 3 passi a Sud.',
        'Fai 4 passi a Est.',
        'Fai 2 passi a Nord.',
        'Fai 1 passo a Ovest. Tocca la cella di arrivo e premi Conferma!',
      ],
      solutionCell: 'D2',
    },
    hints: [
      'Ricordate: Nord è verso l’alto, Sud verso il basso, Ovest a sinistra, Est a destra. Potete segnare le tappe intermedie.',
      'Dopo i primi 3 movimenti (2 Nord, 2 Ovest, 3 Sud) vi trovate esattamente nella cella A4.',
      'Da A4 andate di 4 passi a Est fino a E4, poi 2 passi a Nord fino a E2, infine 1 passo a Ovest: siete in D2!',
    ],
    outroBeats: [
      {
        speaker: 'Archimede',
        expression: 'celebrating',
        text: 'Sotto la piastrella D2 c’era proprio la Chiave dell’Officina! Guardate cosa c’è inciso sull’impugnatura...',
      },
    ],
    rewardItemId: 'item_chiave_officina',
  },
  {
    id: 6,
    act: 2,
    actName: "Atto 2 — L'Officina degli Ingranaggi",
    title: 'Gli Apprendisti di Mastro Orazio',
    backgroundPath: '/assets/backgrounds/bg_act2_workshop.webp',
    introBeats: [
      {
        speaker: 'Archimede',
        expression: 'thinking',
        text: 'In officina lavoravano quattro apprendisti: Lia, Nora, Giacomo e Tito. Prima di scappare hanno mischiato tutti i loro attrezzi!',
      },
      {
        speaker: 'Archimede',
        expression: 'mysterious',
        text: 'Rimettete ogni strumento al proprietario giusto leggendo i 4 indizi: si sbloccherà lo schema segreto dell’officina.',
      },
    ],
    puzzle: {
      puzzleType: 'LogicBoard',
      mode: 'matching',
      promptTitle: 'Abbina ogni apprendista al suo strumento',
      clues: [
        'Nora non usa la Pinza e non usa il Cacciavite.',
        'Lia usa lo strumento di vetro che ingrandisce i micro-ingranaggi.',
        'Giacomo usa lo strumento il cui nome inizia con la stessa lettera della parola Pendolo.',
        'Tito usa l’ultimo strumento rimasto sul banco.',
      ],
      leftItems: [
        { id: 'lia', label: 'Lia' },
        { id: 'nora', label: 'Nora' },
        { id: 'giacomo', label: 'Giacomo' },
        { id: 'tito', label: 'Tito' },
      ],
      rightItems: [
        { id: 'lente', label: 'Lente', iconName: 'search' },
        { id: 'martello', label: 'Martello', iconName: 'hammer' },
        { id: 'pinza', label: 'Pinza', iconName: 'scissors' },
        { id: 'cacciavite', label: 'Cacciavite', iconName: 'wrench' },
      ],
      solutionMap: {
        lia: 'lente',
        nora: 'martello',
        giacomo: 'pinza',
        tito: 'cacciavite',
      },
    },
    hints: [
      'Partite dagli indizi più sicuri: il numero 2 (Lia) e il numero 3 (Giacomo) vi danno subito due coppie certe.',
      'Lia ha la Lente e Giacomo ha la Pinza. Ora rileggete l’indizio 1 su Nora: le resta un solo strumento possibile!',
      'Nora non usa né Pinza né Cacciavite e la Lente è di Lia, quindi Nora ha il Martello. A Tito resta il Cacciavite.',
    ],
    outroBeats: [
      {
        speaker: 'Archimede',
        expression: 'celebrating',
        text: 'Squadra al completo! Sul retro del registro degli apprendisti è apparso il secondo simbolo per la cassaforte!',
      },
    ],
    rewardItemId: 'item_schema_apprendisti',
  },
  {
    id: 7,
    act: 2,
    actName: "Atto 2 — L'Officina degli Ingranaggi",
    title: 'Il Codice dei Simboli Meccanici',
    backgroundPath: '/assets/backgrounds/bg_act2_workshop.webp',
    introBeats: [
      {
        speaker: 'Archimede',
        expression: 'mysterious',
        text: 'Sul banco c’è una targhetta scritta nell’antico alfabeto a simboli degli orologiai.',
      },
      {
        speaker: 'Archimede',
        expression: 'thinking',
        text: 'Per fortuna abbiamo tre parole già tradotte sul quaderno! Confrontate i simboli per decifrare la parola segreta.',
      },
    ],
    puzzle: {
      puzzleType: 'CipherWheel',
      mode: 'symbol_substitution',
      promptTitle: 'Confronta i simboli e decifra la parola segreta',
      referenceWords: [
        { symbols: ['●', '▲', '●', '■', '●', '◆', '★', '●'], plain: 'OROLOGIO' },
        { symbols: ['✚', '☀', '☾', '⚡', '☀', '❄', '☀'], plain: 'CAMPANA' },
        { symbols: ['🔑', '▲', '💧', '❄', '●'], plain: 'TRENO' },
      ],
      encryptedSymbols: ['☀', '▲', '◆', '💧', '❄', '🔑', '●'],
      solutionWord: 'ARGENTO',
    },
    hints: [
      'Partite dai simboli più facili: ☀ compare tre volte in CAMPANA (quindi è la A) e ● compare quattro volte in OROLOGIO (è la O).',
      'Guardate TRENO per trovare ▲ (R), 💧 (E), ❄ (N) e 🔑 (T). Vi manca solo il rombo ◆ da cercare in OROLOGIO!',
      'Il rombo ◆ è la sesta lettera di O-R-O-L-O-G-I-O, cioè la G. Mettendo tutto insieme ottenete il nome di un metallo prezioso: ARGENTO.',
    ],
    outroBeats: [
      {
        speaker: 'Archimede',
        expression: 'celebrating',
        text: 'ARGENTO! La targhetta si è ribaltata rivelando il terzo simbolo per la cassaforte!',
      },
    ],
    rewardItemId: 'item_targhetta_officina',
  },
  {
    id: 8,
    act: 2,
    actName: "Atto 2 — L'Officina degli Ingranaggi",
    title: "La Cassaforte d'Argento",
    backgroundPath: '/assets/backgrounds/bg_act2_workshop.webp',
    isChapterBoss: true,
    introBeats: [
      {
        speaker: 'Archimede',
        expression: 'mysterious',
        text: 'Siamo davanti alla Cassaforte d’Argento! Ha quattro rotelle con simboli incisi.',
      },
      {
        speaker: 'Archimede',
        expression: 'thinking',
        text: 'Tre simboli li avete già nell’inventario. Per il quarto, leggete l’indovinello inciso sul portello!',
      },
    ],
    puzzle: {
      puzzleType: 'VaultLock',
      mode: 'dials',
      promptTitle: "Imposta le 4 rotelle della Cassaforte d'Argento",
      ruleText:
        "Imposta i 3 simboli raccolti nell'Officina nell'ordine giusto. Sulla 4ª rotella, scegli il custode alato di ottone che vi guida fin dal primo giorno!",
      symbols: [
        { id: 'chiave_inglese', label: 'Chiave Inglese', iconName: 'wrench' },
        { id: 'fulmine', label: 'Fulmine', iconName: 'zap' },
        { id: 'ingranaggio', label: 'Ingranaggio', iconName: 'cog' },
        { id: 'gufo', label: 'Gufo', iconName: 'bird' },
        { id: 'ancora', label: 'Ancora', iconName: 'anchor' },
        { id: 'corona', label: 'Corona', iconName: 'crown' },
      ],
      solutionDials: ['chiave_inglese', 'fulmine', 'ingranaggio', 'gufo'],
    },
    hints: [
      'Controllate nell’inventario in basso i tre oggetti dell’Atto 2: ognuno vi dice l’esatta posizione del proprio simbolo.',
      'Le prime tre rotelle sono: 1) Chiave Inglese, 2) Fulmine, 3) Ingranaggio. Chi è il custode alato di ottone?',
      'Il custode alato è proprio Archimede: sulla quarta rotella scegliete il Gufo!',
    ],
    outroBeats: [
      {
        speaker: 'Archimede',
        expression: 'celebrating',
        text: 'WOOHOO! Avete recuperato l’Ingranaggio Maestro d’Argento! Ora saliamo al terzo piano: l’Archivio del Tempo!',
      },
    ],
    rewardItemId: 'gear_silver',
    physicalBridgeNote:
      "Consegnare alla classe l'ingranaggio d'argento stampato su cartoncino con il numero 6 scritto sul retro.",
  },
  {
    id: 9,
    act: 3,
    actName: "Atto 3 — L'Archivio del Tempo",
    title: 'Il Sigillo Spezzato',
    backgroundPath: '/assets/backgrounds/bg_act3_archive.webp',
    introBeats: [
      {
        speaker: 'Archimede',
        expression: 'mysterious',
        text: 'Eccoci nell’Archivio del Tempo, pieno di antichi registri e pergamene!',
      },
      {
        speaker: 'Archimede',
        expression: 'thinking',
        text: 'Il sigillo dorato che apre gli scaffali si è cancellato a metà. Completate la parte destra esattamente a specchio!',
      },
    ],
    puzzle: {
      puzzleType: 'GridMap',
      mode: 'symmetry',
      promptTitle: 'Completa il Sigillo a Diamante a specchio',
      rows: 5,
      cols: 6,
      givenCells: [
        [3, 1],
        [2, 2],
        [1, 3],
        [3, 3],
        [2, 4],
        [3, 5],
      ],
      solutionCells: [
        [4, 1],
        [5, 2],
        [6, 3],
        [4, 3],
        [5, 4],
        [4, 5],
      ],
    },
    hints: [
      'Osservate la distanza di ogni casella dall’asse dorato centrale: se a sinistra tocca l’asse, anche a destra deve toccare l’asse!',
      'Nelle righe 1 e 5 accendete le caselle attaccate all’asse (colonna 4). Nella riga 3 ce ne sono due: una vicina all’asse e una sul bordo esterno!',
      'Le 6 caselle giuste sulla destra sono: riga 1 col 4; riga 2 col 5; riga 3 col 4 e col 6; riga 4 col 5; riga 5 col 4.',
    ],
    outroBeats: [
      {
        speaker: 'Archimede',
        expression: 'celebrating',
        text: 'Simmetria impeccabile! Il sigillo si è illuminato rivelando l’orario di partenza dell’Archivio!',
      },
    ],
    rewardItemId: 'item_sigillo_archivio',
  },
  {
    id: 10,
    act: 3,
    actName: "Atto 3 — L'Archivio del Tempo",
    title: 'I Tubi dei Rintocchi',
    backgroundPath: '/assets/backgrounds/bg_act3_archive.webp',
    introBeats: [
      {
        speaker: 'Archimede',
        expression: 'thinking',
        text: 'Questi quattro tubi d’ottone scandiscono i rintocchi della torre, ma qualcuno li ha scambiati di posto.',
      },
      {
        speaker: 'Archimede',
        expression: 'mysterious',
        text: 'Ordinateli dal tempo più BREVE al tempo più LUNGO! Trasformate tutto in minuti per non cadere in trappola.',
      },
    ],
    puzzle: {
      puzzleType: 'LogicBoard',
      mode: 'order',
      promptTitle: 'Ordina i 4 tubi dal tempo più BREVE al più LUNGO',
      ruleText: 'Trasforma ogni durata in minuti e disponi i tubi da sinistra (più breve) a destra (più lungo).',
      items: [
        {
          id: 'blu',
          label: 'Tubo Blu',
          timeExpression: '25 minuti',
          colorClass: 'bg-sky-800/92',
        },
        {
          id: 'rosso',
          label: 'Tubo Rosso',
          timeExpression: "1/4 d'ora",
          colorClass: 'bg-rose-800/92',
        },
        {
          id: 'verde',
          label: 'Tubo Verde',
          timeExpression: "3/4 d'ora",
          colorClass: 'bg-emerald-800/92',
        },
        {
          id: 'giallo',
          label: 'Tubo Giallo',
          timeExpression: '1/2 ora + 5 min',
          colorClass: 'bg-amber-700/92',
        },
      ],
      solutionOrder: ['rosso', 'blu', 'giallo', 'verde'],
    },
    hints: [
      'Un’ora ha 60 minuti. Quanto vale un quarto d’ora (60 diviso 4)? E quanto vale mezz’ora?',
      'Il tubo Rosso dura 15 minuti e il tubo Blu 25 minuti. Ora calcolate il Giallo (30 + 5) e il Verde (15 × 3).',
      'I tempi esatti sono: Rosso 15 min, Blu 25 min, Giallo 35 min, Verde 45 min. L’ordine è: Rosso, Blu, Giallo, Verde!',
    ],
    outroBeats: [
      {
        speaker: 'Archimede',
        expression: 'celebrating',
        text: 'Che melodia perfetta! Dallo scomparto musicale è scivolato fuori lo spartito con il secondo indizio!',
      },
    ],
    rewardItemId: 'item_spartito_rintocchi',
  },
  {
    id: 11,
    act: 3,
    actName: "Atto 3 — L'Archivio del Tempo",
    title: 'Gli Oggetti del Diario',
    backgroundPath: '/assets/backgrounds/bg_act3_archive.webp',
    introBeats: [
      {
        speaker: 'Archimede',
        expression: 'mysterious',
        text: 'Mastro Orazio ha nascosto l’ultima pagina del suo diario dietro un meccanismo a quattro pulsanti segreti.',
      },
      {
        speaker: 'Archimede',
        expression: 'thinking',
        text: 'Leggete i 4 indizi sull’archivio e toccate solo i 4 oggetti giusti tra gli otto sugli scaffali!',
      },
    ],
    puzzle: {
      puzzleType: 'HotspotScene',
      mode: 'find',
      promptTitle: 'Trova i 4 oggetti descritti nel diario (in qualsiasi ordine)',
      clues: [
        'Il primo pulsante è nell’oggetto che mostra tutti i continenti della Terra.',
        'Il secondo è nello strumento che serve per osservare le stelle lontane.',
        'Il terzo è nel libro del colore del rubino.',
        'Il quarto è nell’oggetto con cui scrivevo i miei diari usando l’inchiostro.',
      ],
      props: [
        {
          id: 'mappamondo',
          label: 'Mappamondo',
          imagePath: '/assets/props/s11_mappamondo.webp',
          xPercent: 16,
          yPercent: 28,
        },
        {
          id: 'libro_rosso',
          label: 'Libro Rosso',
          imagePath: '/assets/props/s11_libro_rosso.webp',
          xPercent: 38,
          yPercent: 24,
        },
        {
          id: 'libro_blu',
          label: 'Libro Blu',
          imagePath: '/assets/props/s11_libro_blu.webp',
          xPercent: 62,
          yPercent: 24,
        },
        {
          id: 'telescopio',
          label: 'Telescopio',
          imagePath: '/assets/props/s11_telescopio.webp',
          xPercent: 84,
          yPercent: 30,
        },
        {
          id: 'orologio_tasca',
          label: 'Orologio da Tasca',
          imagePath: '/assets/props/s11_orologio_tasca.webp',
          xPercent: 18,
          yPercent: 70,
        },
        {
          id: 'piuma',
          label: "Piuma d'Oca",
          imagePath: '/assets/props/s11_piuma.webp',
          xPercent: 40,
          yPercent: 72,
        },
        {
          id: 'candela',
          label: 'Candela',
          imagePath: '/assets/props/s11_candela.webp',
          xPercent: 62,
          yPercent: 72,
        },
        {
          id: 'mappa_stellare',
          label: 'Mappa Stellare',
          imagePath: '/assets/props/s11_mappa_stellare.webp',
          xPercent: 84,
          yPercent: 70,
        },
      ],
      solutionSet: ['mappamondo', 'telescopio', 'libro_rosso', 'piuma'],
    },
    hints: [
      'Leggete bene ogni frase: i primi due oggetti riguardano la geografia e l’astronomia.',
      'Il rubino è una pietra preziosa rossa, e un tempo per scrivere con l’inchiostro non si usavano penne a sfera ma piume...',
      'I 4 oggetti da toccare sono: Mappamondo, Telescopio, Libro Rosso e Piuma d’Oca.',
    ],
    outroBeats: [
      {
        speaker: 'Archimede',
        expression: 'celebrating',
        text: 'Clic, clic, clic, clic! Lo scomparto del diario si è aperto: ora avete tutto per la Cassaforte d’Oro!',
      },
    ],
    rewardItemId: 'item_pagina_diario',
  },
  {
    id: 12,
    act: 3,
    actName: "Atto 3 — L'Archivio del Tempo",
    title: "L'Orologio della Cassaforte d'Oro",
    backgroundPath: '/assets/backgrounds/bg_act3_archive.webp',
    isChapterBoss: true,
    introBeats: [
      {
        speaker: 'Archimede',
        expression: 'mysterious',
        text: 'Ecco la Cassaforte d’Oro! Non ha pulsanti numerici, ma due lancette d’ottone da impostare sull’ora segreta.',
      },
      {
        speaker: 'Archimede',
        expression: 'thinking',
        text: 'Mettete insieme i tre indizi raccolti nell’Archivio del Tempo, fate i conti con calma e muovete le lancette!',
      },
    ],
    puzzle: {
      puzzleType: 'VaultLock',
      mode: 'clock',
      promptTitle: "Imposta l'ora segreta della Cassaforte d'Oro",
      ruleText:
        "Controlla nello zaino il Sigillo (partenza), lo Spartito (+2h 30m) e il Diario (−15m).",
      initialHour: 12,
      initialMinute: 0,
      targetHour: 11,
      targetMinute: 15,
      showDigitalHelper: true,
    },
    hints: [
      'Partite dalle 09:00 del Sigillo e fate un calcolo alla volta: prima aggiungete le 2 ore e 30 minuti.',
      '09:00 più 2 ore fa 11:00; più 30 minuti fa 11:30. Ora togliete i 15 minuti indicati dal diario!',
      'Da 11:30 togliete 15 minuti: l’orario esatto è 11:15 (lancetta corta sull’11, lancetta lunga sul 3).',
    ],
    outroBeats: [
      {
        speaker: 'Archimede',
        expression: 'celebrating',
        text: 'ECCOLO! L’Ingranaggio Maestro d’Oro è vostro! Tutti e tre gli ingranaggi sono riuniti: domani si sale in cima al Quadrante della Torre!',
      },
    ],
    rewardItemId: 'gear_gold',
    physicalBridgeNote:
      "Consegnare alla classe l'ingranaggio d'oro stampato su cartoncino con il numero 9 scritto sul retro.",
  },
  {
    id: 13,
    act: 4,
    actName: 'Gran Finale — Il Quadrante della Torre',
    title: 'Il Risveglio del Grande Orologio',
    backgroundPath: '/assets/backgrounds/bg_finale_clockface.webp',
    isChapterBoss: true,
    introBeats: [
      {
        speaker: 'Archimede',
        expression: 'mysterious',
        text: 'Ci siamo, classe 5ª! Siamo in cima alla Torre, davanti al cuore ghiacciato del Grande Orologio!',
      },
      {
        speaker: 'Archimede',
        expression: 'thinking',
        text: 'Avete tutti e tre gli Ingranaggi Maestri: Bronzo (3), Argento (6) e Oro (9). Posizionateli negli alloggiamenti giusti per riaccendere il motore!',
      },
    ],
    puzzle: {
      puzzleType: 'VaultLock',
      mode: 'finale',
      phaseARuleLines: [
        'L’ingranaggio più prezioso (Oro) non va né a sinistra né a destra.',
        'A sinistra inserisci l’ingranaggio il cui numero è la metà di quello d’Argento.',
        'A destra inserisci l’ultimo ingranaggio rimasto.',
      ],
      gearSolutionOrder: ['gear_bronze', 'gear_gold', 'gear_silver'],
      midDialogue: {
        speaker: 'Archimede',
        expression: 'celebrating',
        text: 'Gli ingranaggi girano! Manca un ultimo gesto: impostate le lancette del Grande Orologio usando i numeri dei tre ingranaggi e premete RIAVVIA!',
      },
      phaseBRuleLines: [
        'Lancetta delle ORE: somma il numero dell’Ingranaggio di Bronzo (3) e quello d’Oro (9).',
        'Lancetta dei MINUTI: prendi il numero dell’Ingranaggio d’Argento (6) e sottrai due volte quello di Bronzo (3).',
      ],
      targetHour: 12,
      targetMinute: 0,
    },
    hints: [
      'Per gli ingranaggi: l’Oro non è ai lati, quindi va al Centro. La metà di 6 (Argento) è 3 (Bronzo), che va a Sinistra!',
      'Per l’ora finale: sommate 3 + 9 per le ore. Per i minuti fate 6 meno 3 meno 3!',
      'Le ore sono 12 e i minuti sono 00: impostate entrambe le lancette sul 12 per il grande rintocco!',
    ],
    outroBeats: [
      {
        speaker: 'Archimede',
        expression: 'celebrating',
        text: 'DONG! DONG! Il Grande Orologio è ripartito! La neve ricomincia a scendere, il tempo scorre di nuovo e le vacanze sono salve!',
      },
    ],
    rewardItemId: 'badge_master_clockmaker',
  },
];

export function getStationById(id: StationId): StationDefinition | undefined {
  return STATIONS.find((s) => s.id === id);
}

export function getSolutionSummary(puzzle: PuzzleConfig): string {
  switch (puzzle.puzzleType) {
    case 'HotspotScene':
      return puzzle.mode === 'flashlight_sequence'
        ? puzzle.solutionSequence.join(' → ')
        : puzzle.solutionSet.join(', ');
    case 'LogicBoard':
      if (puzzle.mode === 'balance') return puzzle.solutionSet.join(' + ');
      if (puzzle.mode === 'matching') {
        return Object.entries(puzzle.solutionMap)
          .map(([k, v]) => `${k} → ${v}`)
          .join(', ');
      }
      return puzzle.solutionOrder.join(' → ');
    case 'CipherWheel':
      return puzzle.solutionWord;
    case 'GridMap':
      return puzzle.mode === 'path_target'
        ? puzzle.solutionCell
        : puzzle.solutionCells.map(([c, r]) => `(${c},${r})`).join(' ');
    case 'VaultLock':
      if (puzzle.mode === 'keypad') return puzzle.solutionCode;
      if (puzzle.mode === 'dials') return puzzle.solutionDials.join(' - ');
      if (puzzle.mode === 'clock') {
        return `${String(puzzle.targetHour).padStart(2, '0')}:${String(
          puzzle.targetMinute
        ).padStart(2, '0')}`;
      }
      return `13A: ${puzzle.gearSolutionOrder.join(' / ')} | 13B: ${String(
        puzzle.targetHour
      ).padStart(2, '0')}:${String(puzzle.targetMinute).padStart(2, '0')}`;
  }
}
