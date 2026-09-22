import { describe, expect, it } from 'vitest';
import { createLumenTheme } from '@lumen/app-ui';

describe('Lumen theme appearance contract', () => {
  it('derives shape and typography from host appearance without forcing MUI switch size', () => {
    const theme = createLumenTheme('light', {
      controlSize: 'l',
      textSize: 's',
      cornerSize: 's',
      shape: 'square',
    });

    expect(theme.shape.borderRadius).toBe(0);
    expect(theme.typography.fontSize).toBe(13);
    expect(theme.components?.MuiSwitch?.defaultProps).toBeUndefined();
    expect(theme.components?.MuiButtonBase?.defaultProps?.disableRipple).toBe(true);
  });
});
