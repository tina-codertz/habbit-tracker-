function parseHex(hex: string): [number, number, number] {
  const h = hex.replace('#', '').slice(0, 6);
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)) as [number, number, number];
}

/** Linear blend between two 6-digit hex colors. `t = 0` → `from`, `t = 1` → `to`. */
export function mixColors(from: string, to: string, t: number): string {
  const a = parseHex(from);
  const b = parseHex(to);
  const clamped = Math.min(1, Math.max(0, t));
  const out = a.map((v, i) => Math.round(v + (b[i] - v) * clamped));
  return `#${out.map((v) => v.toString(16).padStart(2, '0')).join('')}`;
}

/** Appends an alpha channel to a 6-digit hex color. */
export function withAlpha(hex: string, alpha: number): string {
  const a = Math.round(Math.min(1, Math.max(0, alpha)) * 255);
  return `${hex.slice(0, 7)}${a.toString(16).padStart(2, '0')}`;
}

/** Heatmap intensity steps, from empty to fully complete. */
export const HEATMAP_LEVELS = [0, 0.3, 0.55, 0.8, 1] as const;

export function heatmapLevel(ratio: number): number {
  if (ratio <= 0) return 0;
  if (ratio >= 1) return 4;
  if (ratio < 0.34) return 1;
  if (ratio < 0.67) return 2;
  return 3;
}

export function heatmapShades(empty: string, color: string): string[] {
  return HEATMAP_LEVELS.map((t) => mixColors(empty, color, t));
}
