import { describe, expect, it } from 'vitest';
import { LUMEN_MIGRATED_VARIANT_IDS, LUMEN_SOURCE_VARIANTS } from '@lumen/app-ui/catalog';
import * as available from '@lumen/app-ui/variants';

describe('Lumen hbar source inventory', () => {
  it('keeps 300 distinct source IDs across 38 families without overstating migration', () => {
    expect(LUMEN_SOURCE_VARIANTS).toHaveLength(300);
    expect(new Set(LUMEN_SOURCE_VARIANTS.map((item) => item.id)).size).to.equal(300);
    expect(new Set(LUMEN_SOURCE_VARIANTS.map((item) => item.category)).size).to.equal(38);
    expect(LUMEN_MIGRATED_VARIANT_IDS).toHaveLength(5);
    for (const id of LUMEN_MIGRATED_VARIANT_IDS) {
      expect(LUMEN_SOURCE_VARIANTS.some((item) => item.id === id)).to.equal(true);
    }
    expect(Object.keys(available).sort()).to.deep.equal(
      Array.from({ length: 5 }, (_, index) => `HbarAppUiEmptyState0${index + 1}`),
    );
  });
});
