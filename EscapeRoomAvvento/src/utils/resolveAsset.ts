/**
 * Risolve un path asset (es. "/assets/backgrounds/bg_tower_map.webp")
 * in modo compatibile sia con deploy su root sia in sottocartella (base: './').
 */
export function resolveAsset(assetPath: string): string {
  if (!assetPath) return '';
  if (/^(https?:|data:|blob:)/.test(assetPath)) return assetPath;

  const base = import.meta.env.BASE_URL || './';
  const normalizedBase = base.endsWith('/') ? base : `${base}/`;
  const normalizedPath = assetPath.startsWith('/') ? assetPath.slice(1) : assetPath;
  return `${normalizedBase}${normalizedPath}`;
}
