/**
 * Arrangiamento procedurale Web Audio API di "Carol of the Bells" (Shchedryk, pubblico dominio)
 * per "Il Caso dell'Orologio Fermo".
 *
 * Voci:
 * - Celesta / campane d'ottone per l'ostinato e la melodia principale
 * - Sezione archi (violini + violoncelli detuned con filtro passa-basso caldo)
 * - Eco morbido da sala (delay filtrato) per un suono avvolgente e mai secco
 *
 * Zero file esterni, 100% offline-ready, volume discreto adatto alla LIM in classe.
 */

interface BellStep {
  /** Frequenza nota celesta/campana (0 = pausa) */
  bell?: number;
  /** Eventuale seconda nota di campana/armonia */
  bell2?: number;
  /** Accordo di violini/archi (array di frequenze) che parte su questo step */
  strings?: number[];
  /** Durata dell'accordo di archi in beat (default 3 = 1 battuta in 3/4) */
  stringBeats?: number;
  /** Campanelle/sonagli natalizi ritmici ('accent' sul battere, 'soft' sul levare) */
  sleigh?: 'accent' | 'soft';
  /** Durata dello step in beat (3/4) */
  beats: number;
}

// Scala di Mi minore (E minor) — tonalità classica di Carol of the Bells
const N = {
  E2: 82.41,
  F2s: 92.5,
  G2: 98.0,
  A2: 110.0,
  B2: 123.47,
  C3: 130.81,
  D3: 146.83,
  D3s: 155.56,
  E3: 164.81,
  F3s: 185.0,
  G3: 196.0,
  A3: 220.0,
  B3: 246.94,
  C4: 261.63,
  D4: 293.66,
  D4s: 311.13,
  E4: 329.63,
  F4s: 369.99,
  G4: 392.0,
  A4: 440.0,
  B4: 493.88,
  C5: 523.25,
  D5: 587.33,
  D5s: 622.25,
  E5: 659.25,
  F5s: 739.99,
  G5: 783.99,
};

// Accordi caldi di archi (basso + violini medi/alti)
const CHORD = {
  EmSoft: [N.E3, N.B3, N.E4],
  EmFull: [N.E2, N.E3, N.G3, N.B3, N.E4],
  D: [N.D3, N.A3, N.D4, N.F4s],
  C: [N.C3, N.G3, N.C4, N.E4],
  B7: [N.B2, N.F3s, N.B3, N.D4s],
  Am: [N.A2, N.E3, N.A3, N.C4],
  G: [N.G2, N.D3, N.G3, N.B3],
};

/** Helper: 1 battuta del classico ostinato 4 note (G - F# - G - E) in 3/4 */
function ostinatoBar(strings?: number[], stringBeats = 3, bell2?: number, withSleigh = false): BellStep[] {
  return [
    { bell: N.G4, bell2, strings, stringBeats, sleigh: withSleigh ? 'accent' : undefined, beats: 1.0 },
    { bell: N.F4s, beats: 0.5 },
    { bell: N.G4, beats: 0.5 },
    { bell: N.E4, sleigh: withSleigh ? 'soft' : undefined, beats: 1.0 },
  ];
}

/** Helper: ostinato trasposto un'ottava/terza più in alto */
function highOstinatoBar(
  n1: number,
  n2: number,
  n3: number,
  n4: number,
  strings?: number[],
  stringBeats = 3,
  withSleigh = true
): BellStep[] {
  return [
    { bell: n1, strings, stringBeats, sleigh: withSleigh ? 'accent' : undefined, beats: 1.0 },
    { bell: n2, beats: 0.5 },
    { bell: n3, beats: 0.5 },
    { bell: n4, sleigh: withSleigh ? 'soft' : undefined, beats: 1.0 },
  ];
}

// 24 battute in 3/4 (~31 secondi per ciclo, loop continuo)
const CAROL_SEQUENCE: BellStep[] = [
  // --- SEZIONE A: Intro misteriosa da torre dell'orologio (4 battute) ---
  ...ostinatoBar(CHORD.EmSoft, 6),
  ...ostinatoBar(),
  ...ostinatoBar(CHORD.EmFull, 6, undefined, true),
  ...ostinatoBar(undefined, 3, undefined, true),

  // --- SEZIONE B: Discesa armonica classica Em -> D -> C -> B7 (4 battute) ---
  ...ostinatoBar(CHORD.EmFull, 3, N.B4, true),
  ...ostinatoBar(CHORD.D, 3, N.A4, true),
  ...ostinatoBar(CHORD.C, 3, N.G4, true),
  ...ostinatoBar(CHORD.B7, 3, N.F4s, true),

  // --- SEZIONE C: Salita brillante delle campane con archi pieni (4 battute) ---
  ...highOstinatoBar(N.B4, N.A4, N.B4, N.G4, CHORD.EmFull, 3, true),
  ...highOstinatoBar(N.B4, N.A4, N.B4, N.G4, CHORD.G, 3, true),
  ...highOstinatoBar(N.E5, N.D5, N.C5, N.B4, CHORD.C, 3, true),
  ...highOstinatoBar(N.D5, N.C5, N.B4, N.A4, CHORD.B7, 3, true),

  // --- SEZIONE D: Climax natalizio "Ding dong, ding dong" (4 battute) ---
  { bell: N.B4, bell2: N.G4, strings: CHORD.EmFull, stringBeats: 3, sleigh: 'accent', beats: 1.0 },
  { bell: N.E5, sleigh: 'soft', beats: 1.0 },
  { bell: N.D5s, sleigh: 'soft', beats: 1.0 },
  { bell: N.E5, bell2: N.B4, strings: CHORD.C, stringBeats: 3, sleigh: 'accent', beats: 1.0 },
  { bell: N.F5s, beats: 0.5 },
  { bell: N.E5, beats: 0.5 },
  { bell: N.D5, sleigh: 'soft', beats: 1.0 },
  { bell: N.C5, bell2: N.A4, strings: CHORD.Am, stringBeats: 3, sleigh: 'accent', beats: 1.0 },
  { bell: N.B4, sleigh: 'soft', beats: 1.0 },
  { bell: N.A4, sleigh: 'soft', beats: 1.0 },
  { bell: N.B4, bell2: N.F4s, strings: CHORD.B7, stringBeats: 3, sleigh: 'accent', beats: 1.5 },
  { bell: N.A4, beats: 0.5 },
  { bell: N.F4s, sleigh: 'soft', beats: 1.0 },

  // --- SEZIONE E: Ritorno dolce al tema principale con discesa (4 battute) ---
  ...ostinatoBar(CHORD.EmFull, 3, N.E5, true),
  ...ostinatoBar(CHORD.D, 3, N.D5, true),
  ...ostinatoBar(CHORD.C, 3, N.C5, true),
  ...ostinatoBar(CHORD.B7, 3, N.B4, true),

  // --- SEZIONE F: Chiusura morbida e respiro prima del loop (4 battute) ---
  ...ostinatoBar(CHORD.EmSoft, 6),
  ...ostinatoBar(),
  { bell: N.G4, bell2: N.E4, strings: CHORD.EmSoft, stringBeats: 6, sleigh: 'soft', beats: 3.0 },
  { bell: 0, beats: 3.0 },
];

const BPM = 136;
const SECONDS_PER_BEAT = 60 / BPM;
const MASTER_VOLUME = 0.13;

let musicCtx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let bellBus: GainNode | null = null;
let stringBus: GainNode | null = null;
let sleighNoiseBuffer: AudioBuffer | null = null;
let musicEnabled = true;
let isPlaying = false;
let stepIndex = 0;
let nextNoteTime = 0;
let schedulerTimer: number | null = null;
let visibilityBound = false;

function ensureContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;

  if (!musicCtx) {
    const AudioContextCtor =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextCtor) return null;

    musicCtx = new AudioContextCtor();

    masterGain = musicCtx.createGain();
    masterGain.gain.setValueAtTime(0.0001, musicCtx.currentTime);
    masterGain.connect(musicCtx.destination);

    // Eco morbido da sala (delay filtrato leggero) per dare respiro a campane e archi
    const delay = musicCtx.createDelay(0.5);
    delay.delayTime.setValueAtTime(0.24, musicCtx.currentTime);

    const delayFilter = musicCtx.createBiquadFilter();
    delayFilter.type = 'lowpass';
    delayFilter.frequency.setValueAtTime(2200, musicCtx.currentTime);

    const delayFeedback = musicCtx.createGain();
    delayFeedback.gain.setValueAtTime(0.24, musicCtx.currentTime);

    const delayWet = musicCtx.createGain();
    delayWet.gain.setValueAtTime(0.28, musicCtx.currentTime);

    delay.connect(delayFilter);
    delayFilter.connect(delayFeedback);
    delayFeedback.connect(delay);
    delayFilter.connect(delayWet);
    delayWet.connect(masterGain);

    // Bus Campane/Celesta (dry + wet)
    bellBus = musicCtx.createGain();
    bellBus.gain.setValueAtTime(0.75, musicCtx.currentTime);
    bellBus.connect(masterGain);
    bellBus.connect(delay);

    // Bus Archi/Violini (caldo, leggermente più morbido nel mix)
    stringBus = musicCtx.createGain();
    stringBus.gain.setValueAtTime(0.62, musicCtx.currentTime);
    stringBus.connect(masterGain);
    stringBus.connect(delay);

    // Buffer di rumore bianco pre-calcolato per le campanelle/sonagli natalizi
    const noiseLen = Math.floor(musicCtx.sampleRate * 0.14);
    sleighNoiseBuffer = musicCtx.createBuffer(1, noiseLen, musicCtx.sampleRate);
    const data = sleighNoiseBuffer.getChannelData(0);
    for (let i = 0; i < noiseLen; i += 1) {
      data[i] = Math.random() * 2 - 1;
    }
  }

  if (!visibilityBound && typeof document !== 'undefined') {
    visibilityBound = true;
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        stopScheduler();
      } else if (musicEnabled && musicCtx && musicCtx.state === 'running') {
        startScheduler();
      }
    });
  }

  return musicCtx;
}

/** Suona una nota brillante ma morbida stile celesta/campanello natalizio. */
function scheduleBellNote(ctx: AudioContext, freq: number, time: number, durationSec: number, gainScale = 1): void {
  if (!bellBus || freq <= 0) return;

  // Fondamentale morbida (sine)
  const osc1 = ctx.createOscillator();
  const g1 = ctx.createGain();
  osc1.type = 'sine';
  osc1.frequency.setValueAtTime(freq, time);

  const release = Math.min(Math.max(durationSec * 1.4, 0.45), 1.6);
  g1.gain.setValueAtTime(0.0001, time);
  g1.gain.linearRampToValueAtTime(0.45 * gainScale, time + 0.015);
  g1.gain.exponentialRampToValueAtTime(0.0001, time + release);

  osc1.connect(g1);
  g1.connect(bellBus);
  osc1.start(time);
  osc1.stop(time + release + 0.04);

  // Armonica cristallina all'ottava superiore (celesta)
  const osc2 = ctx.createOscillator();
  const g2 = ctx.createGain();
  osc2.type = 'triangle';
  osc2.frequency.setValueAtTime(freq * 2, time);

  const shimmerRelease = Math.min(release * 0.55, 0.7);
  g2.gain.setValueAtTime(0.0001, time);
  g2.gain.linearRampToValueAtTime(0.12 * gainScale, time + 0.01);
  g2.gain.exponentialRampToValueAtTime(0.0001, time + shimmerRelease);

  osc2.connect(g2);
  g2.connect(bellBus);
  osc2.start(time);
  osc2.stop(time + shimmerRelease + 0.04);
}

/** Suona un accordo caldo di violini/archi (doppio oscillatore detuned + filtro passa-basso). */
function scheduleStringChord(ctx: AudioContext, freqs: number[], time: number, durationSec: number): void {
  if (!stringBus || freqs.length === 0) return;

  const perVoiceGain = 0.24 / Math.sqrt(freqs.length);
  const attack = Math.min(0.28, durationSec * 0.25);
  const release = 0.45;
  const endTime = time + durationSec + release;

  freqs.forEach((freq) => {
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(freq < 200 ? 520 : 1250, time);
    filter.Q.setValueAtTime(0.7, time);

    const env = ctx.createGain();
    env.gain.setValueAtTime(0.0001, time);
    env.gain.linearRampToValueAtTime(perVoiceGain, time + attack);
    env.gain.setValueAtTime(perVoiceGain * 0.9, time + durationSec);
    env.gain.exponentialRampToValueAtTime(0.0001, endTime);

    // Due oscillatori leggermente scordati (-5 / +5 cents) per effetto ensemble d'archi
    const detunes = [-5, 5];
    detunes.forEach((detune) => {
      const osc = ctx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, time);
      osc.detune.setValueAtTime(detune, time);
      osc.connect(filter);
      osc.start(time);
      osc.stop(endTime + 0.05);
    });

    filter.connect(env);
    env.connect(stringBus!);
  });
}

/** Suona un tintinnio leggero di campanelle/sonagli natalizi (sleigh bells). */
function scheduleSleighBell(ctx: AudioContext, time: number, accent: boolean): void {
  if (!bellBus || !sleighNoiseBuffer) return;

  const intensity = accent ? 1.0 : 0.55;

  // 1. Scossa metallica ad alta frequenza (rumore filtrato bandpass)
  const noise = ctx.createBufferSource();
  noise.buffer = sleighNoiseBuffer;

  const hp = ctx.createBiquadFilter();
  hp.type = 'highpass';
  hp.frequency.setValueAtTime(6200, time);

  const bp = ctx.createBiquadFilter();
  bp.type = 'bandpass';
  bp.frequency.setValueAtTime(8400, time);
  bp.Q.setValueAtTime(2.2, time);

  const nGain = ctx.createGain();
  nGain.gain.setValueAtTime(0.0001, time);
  nGain.gain.linearRampToValueAtTime(0.14 * intensity, time + 0.012);
  nGain.gain.exponentialRampToValueAtTime(0.0001, time + 0.11);

  noise.connect(hp);
  hp.connect(bp);
  bp.connect(nGain);
  nGain.connect(bellBus);
  noise.start(time);
  noise.stop(time + 0.13);

  // 2. Piccoli rintocchi inarmonici da sonaglio d'ottone
  const partials = [2960, 4180, 5620];
  partials.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, time + i * 0.006);

    g.gain.setValueAtTime(0.0001, time + i * 0.006);
    g.gain.linearRampToValueAtTime(0.032 * intensity, time + i * 0.006 + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, time + i * 0.006 + 0.14);

    osc.connect(g);
    g.connect(bellBus!);
    osc.start(time + i * 0.006);
    osc.stop(time + i * 0.006 + 0.16);
  });
}

function runScheduler(): void {
  if (!musicCtx || !isPlaying || !musicEnabled) return;

  const lookAheadSec = 0.25;
  while (nextNoteTime < musicCtx.currentTime + lookAheadSec) {
    const event = CAROL_SEQUENCE[stepIndex];
    const durationSec = event.beats * SECONDS_PER_BEAT;

    if (event.bell && event.bell > 0) {
      scheduleBellNote(musicCtx, event.bell, nextNoteTime, durationSec, 1);
    }
    if (event.bell2 && event.bell2 > 0) {
      scheduleBellNote(musicCtx, event.bell2, nextNoteTime, durationSec * 1.4, 0.65);
    }
    if (event.strings && event.strings.length > 0) {
      const strDur = (event.stringBeats ?? 3) * SECONDS_PER_BEAT;
      scheduleStringChord(musicCtx, event.strings, nextNoteTime, strDur);
    }
    if (event.sleigh) {
      scheduleSleighBell(musicCtx, nextNoteTime, event.sleigh === 'accent');
    }

    nextNoteTime += durationSec;
    stepIndex = (stepIndex + 1) % CAROL_SEQUENCE.length;
  }
}

function startScheduler(): void {
  if (!musicCtx || !masterGain || isPlaying) return;
  isPlaying = true;
  nextNoteTime = musicCtx.currentTime + 0.08;

  const now = musicCtx.currentTime;
  masterGain.gain.cancelScheduledValues(now);
  masterGain.gain.setValueAtTime(Math.max(masterGain.gain.value, 0.0001), now);
  masterGain.gain.linearRampToValueAtTime(MASTER_VOLUME, now + 0.65);

  runScheduler();
  schedulerTimer = window.setInterval(runScheduler, 90);
}

function stopScheduler(): void {
  if (schedulerTimer !== null) {
    window.clearInterval(schedulerTimer);
    schedulerTimer = null;
  }
  isPlaying = false;

  if (musicCtx && masterGain) {
    const now = musicCtx.currentTime;
    masterGain.gain.cancelScheduledValues(now);
    masterGain.gain.setValueAtTime(Math.max(masterGain.gain.value, 0.0001), now);
    masterGain.gain.linearRampToValueAtTime(0.0001, now + 0.3);
  }
}

/**
 * Aggiorna lo stato desiderato della musica di sottofondo.
 * Se abilitata e l'AudioContext è sbloccato, avvia il loop; se disabilitata, sfuma a silenzio.
 */
export function setMusicEnabled(enabled: boolean): void {
  musicEnabled = enabled;

  if (!enabled) {
    stopScheduler();
    return;
  }

  const ctx = ensureContext();
  if (!ctx) return;

  if (ctx.state === 'suspended') {
    void ctx
      .resume()
      .then(() => {
        if (musicEnabled) startScheduler();
      })
      .catch(() => {
        // Il browser attende una user gesture: verrà sbloccato da unlockAndStartMusic()
      });
  } else {
    startScheduler();
  }
}

export function getMusicEnabled(): boolean {
  return musicEnabled;
}

/**
 * Da chiamare alla prima interazione utente (pointerdown / keydown)
 * per sbloccare l'AudioContext e avviare la musica se abilitata.
 */
export function unlockAndStartMusic(): void {
  if (!musicEnabled) return;
  const ctx = ensureContext();
  if (!ctx) return;

  if (ctx.state === 'suspended') {
    void ctx
      .resume()
      .then(() => {
        if (musicEnabled) startScheduler();
      })
      .catch(() => {});
  } else if (!isPlaying) {
    startScheduler();
  }
}
