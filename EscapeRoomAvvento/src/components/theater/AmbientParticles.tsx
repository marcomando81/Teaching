import { useMemo } from 'react';

export interface AmbientParticlesProps {
  variant: 'snow' | 'gold_dust';
  count?: number;
}

interface ParticleSpec {
  id: number;
  leftPercent: number;
  topPercent: number;
  sizePx: number;
  durationSec: number;
  delaySec: number;
}

export function AmbientParticles({
  variant,
  count = 20,
}: AmbientParticlesProps) {
  const particles = useMemo<ParticleSpec[]>(() => {
    const safeCount = Math.max(8, Math.min(28, count));
    return Array.from({ length: safeCount }, (_, i) => {
      // Distribuzione deterministica per evitare salto di layout tra render
      const seed = (i * 37 + 13) % 100;
      const seed2 = (i * 53 + 29) % 100;
      return {
        id: i,
        leftPercent: (i * (100 / safeCount) + (seed % 7)) % 98,
        topPercent: variant === 'snow' ? -8 : 20 + (seed2 % 75),
        sizePx: variant === 'snow' ? 6 + (i % 5) * 2 : 5 + (i % 4) * 2,
        durationSec: variant === 'snow' ? 8 + (i % 6) * 2 : 5 + (i % 5) * 1.4,
        delaySec: -(i * 0.7),
      };
    });
  }, [variant, count]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden z-10"
    >
      {particles.map((p) => (
        <span
          key={p.id}
          className={
            variant === 'snow'
              ? 'absolute rounded-full bg-white/85 animate-snow-fall'
              : 'absolute rounded-full bg-amber-300/80 animate-gold-dust'
          }
          style={{
            left: `${p.leftPercent}%`,
            top: `${p.topPercent}%`,
            width: `${p.sizePx}px`,
            height: `${p.sizePx}px`,
            animationDuration: `${p.durationSec}s`,
            animationDelay: `${p.delaySec}s`,
          }}
        />
      ))}
    </div>
  );
}
