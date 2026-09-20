import type { LumenPreferences } from './types';

export const preferenceKey = 'lumen-workbench:appearance:v1';
export const defaultPreferences: LumenPreferences = {
  mode: 'dark',
  glow: 80,
  glass: 70,
  motion: true,
};

export function parsePreferences(value: string | null): LumenPreferences {
  try {
    const parsed: unknown = value ? JSON.parse(value) : null;
    if (typeof parsed !== 'object' || !parsed) {
      return { ...defaultPreferences };
    }
    const bounded = (input: unknown, fallback: number) =>
      typeof input === 'number' && Number.isFinite(input)
        ? Math.max(0, Math.min(100, input))
        : fallback;
    return {
      mode: 'mode' in parsed && parsed.mode === 'light' ? 'light' : 'dark',
      glow: bounded('glow' in parsed ? parsed.glow : undefined, defaultPreferences.glow),
      glass: bounded('glass' in parsed ? parsed.glass : undefined, defaultPreferences.glass),
      motion: 'motion' in parsed && typeof parsed.motion === 'boolean' ? parsed.motion : true,
    };
  } catch {
    return { ...defaultPreferences };
  }
}
