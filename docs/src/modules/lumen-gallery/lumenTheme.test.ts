import { describe, expect, it } from 'vitest';
import { createLumenTheme } from '@lumen/app-ui';

describe('Lumen theme appearance contract', () => {
  it('uses custom foreground, background, contrast, and semantic colors in the MUI adapter', () => {
    const theme = createLumenTheme('dark', {
      colors: {
        foreground: '#b8ead3',
        background: '#101b20',
        contrast: '#101b20',
        danger: '#ffc1ba',
      },
    });
    expect(theme.palette.primary.main).toBe('#b8ead3');
    expect(theme.palette.primary.contrastText).toBe('#101b20');
    expect(theme.palette.background.default).toBe('#101b20');
    expect(theme.palette.error.main).toBe('#ffc1ba');
    expect(theme.palette.text.primary).toBe('#b8ead3');
  });
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
