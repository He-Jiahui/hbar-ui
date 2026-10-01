import { alpha, createTheme, enhanceHighContrast } from '@mui/material/styles';
import { DEFAULT_LUMEN_APPEARANCE, type LumenAppearance, type LumenMode } from './appearance';

export interface LumenThemeOptions extends Pick<
  LumenAppearance,
  'controlSize' | 'textSize' | 'cornerSize' | 'shape'
> {}

export default function createLumenTheme(
  mode: LumenMode,
  options: Partial<LumenThemeOptions> = {},
) {
  const controlSize = options.controlSize ?? DEFAULT_LUMEN_APPEARANCE.controlSize;
  const textSize = options.textSize ?? DEFAULT_LUMEN_APPEARANCE.textSize;
  const cornerSize = options.cornerSize ?? DEFAULT_LUMEN_APPEARANCE.cornerSize;
  const shape = options.shape ?? DEFAULT_LUMEN_APPEARANCE.shape;
  const ink = mode === 'dark' ? '#eeeeee' : '#171717';
  const contrast = mode === 'dark' ? '#090909' : '#f5f5f5';
  const controlGlow = mode === 'dark' ? 'rgb(255 255 255 / 75%)' : 'rgb(0 0 0 / 48%)';
  const thumbGlow = `0 0 calc(var(--lumen-range-progress, 0) * ${mode === 'dark' ? '0.8rem' : '0.45rem'}) calc(var(--lumen-range-progress, 0) * 0.125rem) ${controlGlow}`;
  const trackGlow = `0 0 calc(var(--lumen-range-progress, 0) * ${mode === 'dark' ? '0.7rem' : '0.35rem'}) calc(var(--lumen-range-progress, 0) * 0.0625rem) ${controlGlow}`;
  const fontSize = { s: 13, m: 14, l: 16 }[textSize];
  const borderRadius = shape === 'square' ? 0 : { s: 4, m: 6, l: 8 }[cornerSize];
  const theme = createTheme({
    cssVariables: { cssVarPrefix: 'lumen-mui' },
    palette: {
      mode,
      primary: { main: ink, contrastText: contrast },
      secondary: { main: contrast, contrastText: ink },
      success: { main: mode === 'dark' ? '#77deb0' : '#1a7c56', contrastText: contrast },
      warning: { main: mode === 'dark' ? '#efd17a' : '#996500', contrastText: contrast },
      error: { main: mode === 'dark' ? '#ff969b' : '#b73548', contrastText: contrast },
      info: { main: mode === 'dark' ? '#81b5ff' : '#285bc3', contrastText: contrast },
      background: {
        default: mode === 'dark' ? '#090909' : '#f5f5f5',
        paper: mode === 'dark' ? '#181818' : '#fafafa',
      },
      text: { primary: ink, secondary: mode === 'dark' ? '#aaaaaa' : '#626262' },
    },
    typography: {
      fontFamily: '"Segoe UI", "Microsoft YaHei", sans-serif',
      fontSize,
      button: { textTransform: 'none', fontWeight: 500 },
    },
    shape: { borderRadius },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: 'transparent',
            color: ink,
          },
        },
      },
      MuiButtonBase: { defaultProps: { disableRipple: true } },
      MuiButton: {
        defaultProps: { disableElevation: true, color: 'primary', loadingPosition: 'start' },
        styleOverrides: {
          root: {
            minWidth: 0,
            minHeight: { s: '1.875rem', m: '2.25rem', l: '2.625rem' }[controlSize],
            borderRadius: 'var(--lumen-radius-control, 0.375rem)',
            boxShadow: 'var(--lumen-effect-shadow)',
            backgroundImage: 'var(--lumen-press-layer)',
            transition: 'var(--lumen-state-transition)',
            '&:hover, &:active, &.Mui-focusVisible': { boxShadow: 'var(--lumen-effect-shadow)' },
            '&.MuiButton-text, &.MuiButton-text:hover, &.MuiButton-text:active, &.MuiButton-text.Mui-focusVisible':
              { boxShadow: 'none' },
            '&.Mui-focusVisible': {
              outline: '0.125rem solid var(--lumen-effect-color)',
              outlineOffset: '0.125rem',
            },
            '&.Mui-disabled:not(.Mui-loading)': { boxShadow: 'none', textShadow: 'none' },
            variants: [
              ...(['primary', 'success', 'warning', 'error', 'info'] as const).map((color) => ({
                props: { color },
                style: { '--lumen-effect-color': `var(--lumen-mui-palette-${color}-main)` },
              })),
              {
                props: { variant: 'contained' },
                style: { '--lumen-press-ink': 'var(--variant-containedColor)' },
              },
              {
                props: { variant: 'contained', loading: true },
                style: {
                  '&.Mui-disabled': {
                    backgroundColor: 'var(--variant-containedBg)',
                    color: 'var(--variant-containedColor)',
                  },
                },
              },
              {
                props: { variant: 'outlined', loading: true },
                style: {
                  '&.Mui-disabled': {
                    color: 'var(--variant-outlinedColor)',
                    borderColor: 'var(--variant-outlinedBorder)',
                  },
                },
              },
              {
                props: { variant: 'text', loading: true },
                style: { '&.Mui-disabled': { color: 'var(--variant-textColor)' } },
              },
            ],
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            borderRadius: 'var(--lumen-radius-control, 0.375rem)',
            transition: 'var(--lumen-state-transition)',
            '&:hover': { backgroundColor: alpha(ink, 0.08) },
            '&:active': { backgroundColor: alpha(ink, 0.16) },
            '&.Mui-focusVisible': {
              outline: '0.125rem solid var(--lumen-effect-color)',
              outlineOffset: '0.125rem',
            },
          },
        },
      },
      MuiPaper: { styleOverrides: { root: { backgroundImage: 'none' } } },
      MuiSlider: {
        styleOverrides: {
          thumb: {
            width: '0.625rem',
            height: '0.625rem',
            borderRadius: '0.125rem',
            boxShadow: thumbGlow,
            '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
            '&:hover, &.Mui-active': {
              boxShadow: thumbGlow,
            },
            '&.Mui-focusVisible': {
              boxShadow: thumbGlow,
              outline: '0.0625rem solid currentColor',
              outlineOffset: '0.25rem',
            },
          },
          rail: { height: '0.0625rem', opacity: 0.3 },
          track: { height: '0.125rem', border: 0, boxShadow: trackGlow },
        },
      },
      MuiSwitch: {
        defaultProps: { size: 'small' },
        styleOverrides: {
          root: { overflow: 'visible' },
          switchBase: {
            color: 'transparent',
            '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
            '&.Mui-checked': {
              color: 'transparent',
              '& .MuiSwitch-thumb': {
                backgroundColor: ink,
                borderColor: ink,
                boxShadow: `0 0 ${mode === 'dark' ? '0.5rem' : '0.3rem'} ${controlGlow}, 0 0 ${mode === 'dark' ? '1rem' : '0.55rem'} ${controlGlow}`,
              },
              '& + .MuiSwitch-track': {
                backgroundColor: mode === 'dark' ? 'rgb(255 255 255 / 28%)' : 'rgb(0 0 0 / 28%)',
                opacity: 1,
              },
            },
            '&.Mui-focusVisible .MuiSwitch-thumb': {
              outline: `0.0625rem solid ${ink}`,
              outlineOffset: '0.2rem',
            },
          },
          thumb: {
            boxSizing: 'border-box',
            width: '1rem',
            height: '1rem',
            border: `0.125rem solid ${ink}`,
            backgroundColor: mode === 'dark' ? '#171717' : '#f5f5f5',
            boxShadow: 'none',
            transition:
              'background-color 180ms ease, box-shadow 180ms ease, border-color 180ms ease',
            '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
          },
          track: {
            alignSelf: 'center',
            height: '0.125rem',
            borderRadius: 0,
            backgroundColor: mode === 'dark' ? 'rgb(255 255 255 / 28%)' : 'rgb(0 0 0 / 28%)',
            opacity: 1,
          },
        },
      },
    },
  });
  return enhanceHighContrast(theme);
}

export type { LumenMode } from './appearance';
