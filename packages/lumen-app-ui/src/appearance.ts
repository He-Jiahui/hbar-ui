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

export interface LumenAppearanceRoot {
  readonly dataset: {
    lumenMode?: string | undefined;
    lumenControlSize?: string | undefined;
    lumenTextSize?: string | undefined;
    lumenCornerSize?: string | undefined;
    lumenShape?: string | undefined;
    lumenMotion?: string | undefined;
  };
  readonly style: {
    colorScheme: string;
    setProperty(name: string, value: string): void;
  };
}

export function normalizeLumenGlow(value: number): number {
  if (!Number.isFinite(value)) {
    return DEFAULT_LUMEN_APPEARANCE.glow;
  }
  return Math.min(100, Math.max(0, value));
}

export function applyLumenAppearance(
  root: LumenAppearanceRoot,
  appearance: Readonly<LumenAppearance>,
): void {
  root.dataset.lumenMode = appearance.mode;
  root.dataset.lumenControlSize = appearance.controlSize;
  root.dataset.lumenTextSize = appearance.textSize;
  root.dataset.lumenCornerSize = appearance.cornerSize;
  root.dataset.lumenShape = appearance.shape;
  root.dataset.lumenMotion = appearance.motion ? 'on' : 'off';
  root.style.colorScheme = appearance.mode;
  root.style.setProperty('--lumen-glow', String(normalizeLumenGlow(appearance.glow) / 100));
}
