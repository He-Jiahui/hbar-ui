import { describe, expect, it } from 'vitest';
import { LUMEN_MIGRATED_VARIANT_IDS, LUMEN_SOURCE_VARIANTS } from '@lumen/app-ui/catalog';
import * as available from '@lumen/app-ui/variants';

describe('Lumen hbar source inventory', () => {
  it('keeps 300 distinct source IDs across 38 fully migrated families', () => {
    expect(LUMEN_SOURCE_VARIANTS).toHaveLength(300);
    expect(new Set(LUMEN_SOURCE_VARIANTS.map((item) => item.id)).size).to.equal(300);
    expect(new Set(LUMEN_SOURCE_VARIANTS.map((item) => item.category)).size).to.equal(38);
    expect(LUMEN_MIGRATED_VARIANT_IDS).toHaveLength(300);
    expect(Object.keys(available)).toHaveLength(300);
    for (const id of LUMEN_MIGRATED_VARIANT_IDS) {
      expect(LUMEN_SOURCE_VARIANTS.some((item) => item.id === id)).to.equal(true);
      const match = /^hbar-app-ui-(.+)-(\d+)$/.exec(id);
      expect(match).not.to.equal(null);
      const name = `HbarAppUi${match![1]!
        .split('-')
        .map((part) => part[0]!.toUpperCase() + part.slice(1))
        .join('')}${match![2]!.padStart(2, '0')}`;
      expect(available).to.have.property(name);
    }
  });
});
