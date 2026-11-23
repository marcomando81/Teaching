/**
 * Sintetizzatore procedurale Web Audio API per "Il Caso dell'Orologio Fermo".
 * Zero file MP3 esterni, 100% offline-ready, risveglio automatico AudioContext.
 */

let audioCtx: AudioContext | null = null;
let isSoundEnabled = true;

export function setSoundEnabled(enabled: boolean): void {
  isSoundEnabled = enabled;
}

export function getSoundEnabled(): boolean {
  return isSoundEnabled;
}

function getContext(): AudioContext | null {
  if (!isSoundEnabled) return null;
  if (typeof window === 'undefined') return null;

  if (!audioCtx) {
    const AudioContextCtor =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextCtor) return null;
    audioCtx = new AudioContextCtor();
  }

  if (audioCtx.state === 'suspended') {
    void audioCtx.resume();
  }

  return audioCtx;
}

/** Breve impulso filtrato (tocco pulsanti / tessere). */
export function playClick(): void {
  const ctx = getContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();

  osc.type = 'triangle';
  osc.frequency.setValueAtTime(620, now);
  osc.frequency.exponentialRampToValueAtTime(220, now + 0.045);

  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(1800, now);

  gain.gain.setValueAtTime(0.18, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.055);
}

/** Doppio clack meccanico secco (rotelle, lancette, cifrario). */
export function playGearTurn(): void {
  const ctx = getContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const offsets = [0, 0.055];

  offsets.forEach((offset, idx) => {
    const t = now + offset;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(idx === 0 ? 480 : 640, t);
    osc.frequency.exponentialRampToValueAtTime(140, t + 0.035);

    gain.gain.setValueAtTime(0.12, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(t);
    osc.stop(t + 0.045);
  });
}

/** Rumore bianco filtrato passa-basso in sweep (apertura porte d'ottone). */
export function playDoorSlide(): void {
  const ctx = getContext();
  if (!ctx) return;

  const duration = 0.42;
  const now = ctx.currentTime;
  const bufferSize = Math.floor(ctx.sampleRate * duration);
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }

  const noise = ctx.createBufferSource();
  noise.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(220, now);
  filter.frequency.exponentialRampToValueAtTime(900, now + duration * 0.5);
  filter.frequency.exponentialRampToValueAtTime(180, now + duration);
  filter.Q.setValueAtTime(2.5, now);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.001, now);
  gain.gain.linearRampToValueAtTime(0.22, now + 0.08);
  gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

  noise.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  noise.start(now);
  noise.stop(now + duration + 0.02);
}

/** Breve doppio tono grave dissonante (risposta errata + shake). */
export function playError(): void {
  const ctx = getContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const notes = [
    { freq: 195, start: 0, dur: 0.14 },
    { freq: 155, start: 0.15, dur: 0.2 },
  ];

  notes.forEach(({ freq, start, dur }) => {
    const t = now + start;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, t);
    osc.frequency.linearRampToValueAtTime(freq * 0.92, t + dur);

    gain.gain.setValueAtTime(0.14, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(t);
    osc.stop(t + dur + 0.02);
  });
}

/** Tintinnio morbido cristallino (apertura indizio). */
export function playHint(): void {
  const ctx = getContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const freqs = [880, 1318.51]; // A5 -> E6

  freqs.forEach((freq, idx) => {
    const t = now + idx * 0.09;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, t);

    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(0.14, t + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.42);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(t);
    osc.stop(t + 0.45);
  });
}

/** Arpeggio maggiore brillante a 4 note (risoluzione stazione). */
export function playSuccess(): void {
  const ctx = getContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6

  notes.forEach((freq, idx) => {
    const t = now + idx * 0.095;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, t);

    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(0.18, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.55);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(t);
    osc.stop(t + 0.58);
  });
}

/** Rintocco di campana metallica FM (sintesi inarmonica) per il Gran Finale. */
export function playTowerChime(count = 1): void {
  const ctx = getContext();
  if (!ctx) return;

  const strikes = Math.max(1, Math.min(12, Math.floor(count)));
  const now = ctx.currentTime;
  const interval = 0.72;

  for (let i = 0; i < strikes; i++) {
    const t = now + i * interval;
    const carrier = ctx.createOscillator();
    const modulator = ctx.createOscillator();
    const modGain = ctx.createGain();
    const masterGain = ctx.createGain();

    // Frequenza fondamentale campana + rapporto inarmonico FM (1 : 2.41)
    const baseFreq = 261.63; // C4 solenne
    carrier.type = 'sine';
    carrier.frequency.setValueAtTime(baseFreq, t);

    modulator.type = 'sine';
    modulator.frequency.setValueAtTime(baseFreq * 2.41, t);

    modGain.gain.setValueAtTime(320, t);
    modGain.gain.exponentialRampToValueAtTime(18, t + 1.2);

    masterGain.gain.setValueAtTime(0.001, t);
    masterGain.gain.linearRampToValueAtTime(0.24, t + 0.015);
    masterGain.gain.exponentialRampToValueAtTime(0.0008, t + 1.6);

    modulator.connect(modGain);
    modGain.connect(carrier.frequency);
    carrier.connect(masterGain);
    masterGain.connect(ctx.destination);

    modulator.start(t);
    carrier.start(t);
    modulator.stop(t + 1.65);
    carrier.stop(t + 1.65);
  }
}
