import { describe, expect, it } from 'vitest';
import {
  LUMEN_DESIGN_COVERAGE_CATEGORIES,
  LUMEN_MIGRATED_VARIANT_IDS,
  LUMEN_SOURCE_VARIANTS,
} from '@lumen/app-ui/catalog';
import * as variants from '@lumen/app-ui/variants';

describe('Lumen source catalog', () => {
  it('retains 38 source families and 300 stable unique IDs while exporting only validated ports', () => {
    const ids = LUMEN_SOURCE_VARIANTS.map((variant) => variant.id);
    expect(ids).toHaveLength(300);
    expect(new Set(ids).size).toBe(300);
    expect(new Set(LUMEN_SOURCE_VARIANTS.map((variant) => variant.category)).size).toBe(38);
    expect(new Set(LUMEN_MIGRATED_VARIANT_IDS).size).toBe(LUMEN_MIGRATED_VARIANT_IDS.length);
    expect(LUMEN_MIGRATED_VARIANT_IDS).toHaveLength(22);
    for (const category of LUMEN_DESIGN_COVERAGE_CATEGORIES) {
      expect(ids.some((id) => id.startsWith(`hbar-app-ui-${category}-`))).toBe(true);
      expect(
        LUMEN_MIGRATED_VARIANT_IDS.some((id) => id.startsWith(`hbar-app-ui-${category}-`)),
      ).toBe(false);
    }

    for (const id of LUMEN_MIGRATED_VARIANT_IDS) {
      expect(ids).toContain(id);
      const match = /^hbar-app-ui-(.+)-(\d+)$/.exec(id);
      expect(match).not.toBeNull();
      const name = `HbarAppUi${match![1]!
        .split('-')
        .map((part) => part[0]!.toUpperCase() + part.slice(1))
        .join('')}${match![2]!.padStart(2, '0')}`;
      expect(variants).toHaveProperty(name);
    }
  });
});
