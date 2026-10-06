import { describe, expect, it } from 'vitest';
import {
  LUMEN_DESIGN_COVERAGE_CATEGORIES,
  LUMEN_MIGRATED_VARIANT_IDS,
  LUMEN_SOURCE_VARIANTS,
  LUMEN_VARIANT_REGISTRY,
} from '@lumen/app-ui/catalog';
import * as variants from '@lumen/app-ui/variants';
import { createLumenPreviewHref } from './lumenPreviewRoute';

describe('Lumen source catalog', () => {
  it('retains 38 source families and exposes all 300 stable IDs as formal component variants', () => {
    const ids = LUMEN_SOURCE_VARIANTS.map((variant) => variant.id);
    expect(ids).toHaveLength(300);
    expect(new Set(ids).size).toBe(300);
    expect(new Set(LUMEN_SOURCE_VARIANTS.map((variant) => variant.category)).size).toBe(38);
    expect(new Set(LUMEN_MIGRATED_VARIANT_IDS).size).toBe(LUMEN_MIGRATED_VARIANT_IDS.length);
    expect(LUMEN_MIGRATED_VARIANT_IDS).toHaveLength(300);
    expect(LUMEN_DESIGN_COVERAGE_CATEGORIES).toHaveLength(0);
    expect(LUMEN_VARIANT_REGISTRY).toHaveLength(300);
    expect(LUMEN_VARIANT_REGISTRY.every((entry) => entry.status === 'migrated')).toBe(true);
    expect(LUMEN_VARIANT_REGISTRY.every((entry) => entry.component !== undefined)).toBe(true);

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

  it('assigns every stable component ID a canonical preview URL', () => {
    const hrefs = LUMEN_VARIANT_REGISTRY.map((entry) =>
      createLumenPreviewHref(entry.id, { embedded: true, locale: 'en', mode: 'light' }),
    );

    expect(new Set(hrefs).size).toBe(300);
    expect(hrefs[0]).toContain('id=hbar-app-ui-ai-chat-1');
    expect(hrefs[0]).toContain('embed=1');
    expect(hrefs[0]).toContain('locale=en');
    expect(hrefs[0]).toContain('mode=light');
  });
});
