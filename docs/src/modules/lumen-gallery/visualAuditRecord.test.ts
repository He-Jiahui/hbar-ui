import { describe, expect, it } from 'vitest';
import { LUMEN_SOURCE_VARIANTS } from '@lumen/app-ui/catalog';
import record from './lumen-visual-audit-record.json';

describe('Lumen visual audit record', () => {
  it('covers every stable ID across both modes and all three required viewports', () => {
    expect(record.summary).toEqual({
      variants: 300,
      combinations: 1800,
      passed: 1800,
      failed: 0,
    });
    expect(record.variants).toHaveLength(LUMEN_SOURCE_VARIANTS.length);
    expect(record.variants.map((entry) => entry.id)).toEqual(
      LUMEN_SOURCE_VARIANTS.map((entry) => entry.id),
    );

    const combinations = [
      'dark/desktop',
      'dark/tablet',
      'dark/narrow',
      'light/desktop',
      'light/tablet',
      'light/narrow',
    ];
    for (const entry of record.variants) {
      expect(entry.issues).toEqual([]);
      expect(Object.keys(entry.combinations)).toEqual(combinations);
      expect(Object.values(entry.combinations)).toEqual([
        'passed',
        'passed',
        'passed',
        'passed',
        'passed',
        'passed',
      ]);
    }
  });
});
