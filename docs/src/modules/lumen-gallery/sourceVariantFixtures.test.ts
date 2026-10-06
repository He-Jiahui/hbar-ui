import { describe, expect, it } from 'vitest';
import { LUMEN_MIGRATED_VARIANT_IDS, LUMEN_SOURCE_VARIANTS } from '@lumen/app-ui/catalog';

describe('Lumen formal variant coverage', () => {
  it('keeps every stable ID mapped to a concrete Lumen component', () => {
    const migrated = new Set<string>(LUMEN_MIGRATED_VARIANT_IDS);
    const unimplemented = LUMEN_SOURCE_VARIANTS.filter((source) => !migrated.has(source.id));

    expect(unimplemented).toEqual([]);
  });
});
