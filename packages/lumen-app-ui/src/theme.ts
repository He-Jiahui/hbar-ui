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
  const fieldLight = {
    transition: 'var(--lumen-state-transition)',
    '&:hover': { '--lumen-effect-level': 'var(--lumen-glow-hover)' },
    '&.Mui-error': {
      '--lumen-effect-color': 'var(--lumen-danger)',
      '--lumen-effect-level': 'var(--lumen-glow-selected)',
    },
    '&.Mui-focused': { '--lumen-effect-level': 'var(--lumen-glow-focus)' },
    '&.Mui-disabled': { '--lumen-effect-level': 0 },
  };
  const choiceLight = {
    '--lumen-effect-color': 'currentColor',
    transition: 'var(--lumen-state-transition)',
    '&.Mui-checked': { '--lumen-effect-level': 'var(--lumen-glow-selected)' },
    '&:hover': { '--lumen-effect-level': 'var(--lumen-glow-hover)' },
    '&.Mui-focusVisible, &:has(input:focus-visible)': {
      '--lumen-effect-level': 'var(--lumen-glow-focus)',
      outline: '0.125rem solid currentColor',
      outlineOffset: '0.125rem',
    },
    '&.Mui-disabled': { '--lumen-effect-level': 0 },
    '& .MuiSvgIcon-root': {
      filter: 'drop-shadow(0 0 var(--lumen-glow-near) var(--lumen-effect-light))',
    },
  };
  const fontSize = { s: 13, m: 14, l: 16 }[textSize];
  const borderRadius = shape === 'square' ? 0 : { s: 4, m: 6, l: 8 }[cornerSize];
  const theme = createTheme({
    cssVariables: { cssVarPrefix: 'lumen-mui' },
    palette: {
      mode,
      primary: { main: ink, contrastText: contrast },
      secondary: { main: mode === 'dark' ? '#cccccc' : '#333333', contrastText: contrast },
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
              ...(['primary', 'secondary', 'success', 'warning', 'error', 'info'] as const).map(
                (color) => ({
                  props: { color },
                  style: { '--lumen-effect-color': `var(--lumen-mui-palette-${color}-main)` },
                }),
              ),
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
      MuiOutlinedInput: {
        styleOverrides: { root: { ...fieldLight, boxShadow: 'var(--lumen-effect-shadow)' } },
      },
      MuiFilledInput: {
        styleOverrides: {
          root: fieldLight,
          underline: {
            '&:after': {
              boxShadow: 'var(--lumen-effect-shadow)',
              transition:
                'transform var(--lumen-state-duration) var(--lumen-state-easing), var(--lumen-state-transition)',
            },
          },
        },
      },
      MuiInput: {
        styleOverrides: {
          root: fieldLight,
          underline: {
            '&:after': {
              boxShadow: 'var(--lumen-effect-shadow)',
              transition:
                'transform var(--lumen-state-duration) var(--lumen-state-easing), var(--lumen-state-transition)',
            },
          },
        },
      },
      MuiCheckbox: { styleOverrides: { root: choiceLight } },
      MuiRadio: { styleOverrides: { root: choiceLight } },
      MuiTabs: {
        styleOverrides: {
          indicator: {
            boxShadow:
              '0 0 var(--lumen-glow-near) color-mix(in srgb, currentColor calc(var(--lumen-glow, 0.65) * var(--lumen-glow-mode-scale, 1) * 22%), transparent)',
          },
        },
      },
      MuiSlider: {
        styleOverrides: {
          root: {
            '--lumen-effect-color': 'currentColor',
            '--lumen-effect-level': 'var(--lumen-glow-selected)',
            transition: 'var(--lumen-state-transition)',
            '&:hover': { '--lumen-effect-level': 'var(--lumen-glow-hover)' },
            '&.Mui-disabled': { '--lumen-effect-level': 0 },
          },
          thumb: {
            '--lumen-effect-color': 'currentColor',
            boxShadow: 'var(--lumen-effect-shadow)',
            transition: 'var(--lumen-state-transition)',
            '&:hover, &.Mui-active': {
              '--lumen-effect-level': 'var(--lumen-glow-hover)',
              boxShadow: 'var(--lumen-effect-shadow)',
            },
            '&.Mui-focusVisible': {
              '--lumen-effect-level': 'var(--lumen-glow-focus)',
              boxShadow: 'var(--lumen-effect-shadow)',
              outline: '0.125rem solid currentColor',
              outlineOffset: '0.125rem',
            },
          },
          track: { border: 0, boxShadow: 'var(--lumen-effect-shadow)' },
        },
      },
      MuiSwitch: {
        defaultProps: { size: 'small' },
        styleOverrides: {
          switchBase: {
            '--lumen-effect-color': 'currentColor',
            transition:
              'transform var(--lumen-state-duration) var(--lumen-state-easing), var(--lumen-state-transition)',
            '&.Mui-checked': { '--lumen-effect-level': 'var(--lumen-glow-selected)' },
            '&:hover': { '--lumen-effect-level': 'var(--lumen-glow-hover)' },
            '&.Mui-focusVisible, &:has(input:focus-visible)': {
              '--lumen-effect-level': 'var(--lumen-glow-focus)',
              '& .MuiSwitch-thumb': {
                outline: '0.125rem solid currentColor',
                outlineOffset: '0.125rem',
              },
            },
            '&.Mui-disabled': { '--lumen-effect-level': 0 },
          },
          thumb: {
            boxShadow: 'var(--lumen-effect-shadow)',
          },
          track: {
            transition: 'var(--lumen-state-transition)',
          },
        },
      },
    },
  });
  return enhanceHighContrast(theme);
}

export type { LumenMode } from './appearance';
