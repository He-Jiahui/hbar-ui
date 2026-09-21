import { describe, expect, it } from 'vitest';
import { LUMEN_MIGRATED_VARIANT_IDS, LUMEN_SOURCE_VARIANTS } from '@lumen/app-ui/catalog';

describe('Lumen formal variant coverage', () => {
  it('leaves no source ID on the generic source-fixture path', () => {
    const migrated = new Set<string>(LUMEN_MIGRATED_VARIANT_IDS);
    const pending = LUMEN_SOURCE_VARIANTS.filter((source) => !migrated.has(source.id));

    expect(pending).toEqual([]);
  });
});
