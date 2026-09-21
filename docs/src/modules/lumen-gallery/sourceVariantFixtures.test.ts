import { describe, expect, it } from 'vitest';
import {
  LUMEN_DESIGN_COVERAGE_CATEGORIES,
  LUMEN_MIGRATED_VARIANT_IDS,
  LUMEN_SOURCE_VARIANTS,
} from '@lumen/app-ui/catalog';
import { getSourceVariantFixture, sourceSurfaceLayouts } from './sourceVariantFixtures';

describe('Lumen source page fixtures', () => {
  it('builds a distinct, complete page fixture for every pending source ID', () => {
    const migrated = new Set<string>(LUMEN_MIGRATED_VARIANT_IDS);
    const designed = new Set<string>(LUMEN_DESIGN_COVERAGE_CATEGORIES);
    const pending = LUMEN_SOURCE_VARIANTS.filter((source) => !migrated.has(source.id));

    expect(pending).toHaveLength(278);
    expect(new Set(pending.map((source) => source.id)).size).toBe(278);

    for (const source of pending) {
      expect(designed.has(source.category)).toBe(true);
      const fixture = getSourceVariantFixture('zh', source, source.category);
      expect(fixture.layout).toBe(
        sourceSurfaceLayouts[source.profile.surface as keyof typeof sourceSurfaceLayouts],
      );
      expect(fixture.content.profile?.id).toBe(source.id);
      expect(fixture.content.profile?.scenario).toBe(source.profile.scenario);
      expect(fixture.content.items).toHaveLength(source.profile.itemCount);
      expect(fixture.content.controls).toHaveLength(source.profile.controls.length);
      expect(Object.keys(fixture.initialValues)).toHaveLength(source.profile.itemCount);
      expect(fixture.copy.title).toContain(String(source.variant).padStart(2, '0'));
    }
  });

  it('covers every surface structure declared by the source catalog', () => {
    const sourceSurfaces = new Set(LUMEN_SOURCE_VARIANTS.map((source) => source.profile.surface));
    expect(sourceSurfaces).toEqual(new Set(Object.keys(sourceSurfaceLayouts)));
  });
});
