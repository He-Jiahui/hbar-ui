import { describe, it, expect } from 'vitest';
import { defaultPreferences, parsePreferences } from './preferences';

describe('Lumen stored appearance preferences', () => {
  it.each([null, '', '{"mode":', 'null', 'true', '42', '"dark"', '[]'])(
    'uses the defaults when storage contains %s',
    (stored) => {
      expect(parsePreferences(stored)).to.deep.equal(defaultPreferences);
    },
  );

  it('restores valid stored values including zero intensity and disabled animation', () => {
    expect(parsePreferences('{"mode":"light","glow":0,"glass":37.5,"motion":false}')).to.deep.equal(
      { mode: 'light', glow: 0, glass: 37.5, motion: false },
    );
  });

  it('fills omitted fields while retaining valid preferences from an older stored object', () => {
    expect(parsePreferences('{"motion":false}')).to.deep.equal({
      ...defaultPreferences,
      motion: false,
    });
    expect(parsePreferences('{"mode":"light","glass":20}')).to.deep.equal({
      ...defaultPreferences,
      mode: 'light',
      glass: 20,
    });
  });

  it('uses field defaults for invalid types without discarding other valid fields', () => {
    expect(
      parsePreferences('{"mode":"sepia","glow":"90","glass":null,"motion":"false"}'),
    ).to.deep.equal(defaultPreferences);
    expect(
      parsePreferences('{"mode":"light","glow":{},"glass":[50],"motion":false}'),
    ).to.deep.equal({ ...defaultPreferences, mode: 'light', motion: false });
  });

  it('bounds stored intensities to the supported slider range', () => {
    expect(parsePreferences('{"glow":-20,"glass":250}')).to.deep.equal({
      ...defaultPreferences,
      glow: 0,
      glass: 100,
    });
    expect(parsePreferences('{"glow":100,"glass":0}')).to.deep.equal({
      ...defaultPreferences,
      glow: 100,
      glass: 0,
    });
  });

  it('falls back for numbers that overflow while parsing stored JSON', () => {
    expect(parsePreferences('{"glow":1e400,"glass":-1e400}')).to.deep.equal(defaultPreferences);
  });

  it('ignores unrelated stored fields and prototype-like keys', () => {
    expect(
      parsePreferences('{"mode":"light","obsolete":true,"__proto__":{"glow":0}}'),
    ).to.deep.equal({ ...defaultPreferences, mode: 'light' });
  });
});
