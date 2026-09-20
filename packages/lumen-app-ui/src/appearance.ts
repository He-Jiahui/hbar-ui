export const LUMEN_SIZES = ['s', 'm', 'l'] as const;

export type LumenSize = (typeof LUMEN_SIZES)[number];
export type LumenShape = 'square' | 'rounded';

export interface LumenAppearance {
  mode: LumenMode;
  controlSize: LumenSize;
  textSize: LumenSize;
  cornerSize: LumenSize;
  shape: LumenShape;
  glow: number;
  motion: boolean;
}

export type LumenMode = 'dark' | 'light';

export const DEFAULT_LUMEN_APPEARANCE: Readonly<LumenAppearance> = Object.freeze({
  mode: 'dark',
  controlSize: 'm',
  textSize: 'm',
  cornerSize: 'm',
  shape: 'rounded',
  glow: 65,
  motion: true,
});

export function normalizeLumenGlow(value: number): number {
  if (!Number.isFinite(value)) {
    return DEFAULT_LUMEN_APPEARANCE.glow;
  }
  return Math.min(100, Math.max(0, value));
}
