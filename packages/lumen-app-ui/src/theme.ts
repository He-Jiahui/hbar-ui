import { alpha, createTheme, enhanceHighContrast, type Theme } from '@mui/material/styles';
import {
  DEFAULT_LUMEN_APPEARANCE,
  resolveLumenColors,
  type LumenAppearance,
  type LumenMode,
} from './appearance';

export interface LumenThemeOptions extends Pick<
  LumenAppearance,
  'controlSize' | 'textSize' | 'cornerSize' | 'shape' | 'colors'
> {}

export default function createLumenTheme(
  mode: LumenMode,
  options: Partial<LumenThemeOptions> = {},
): Theme {
  const controlSize = options.controlSize ?? DEFAULT_LUMEN_APPEARANCE.controlSize;
  const textSize = options.textSize ?? DEFAULT_LUMEN_APPEARANCE.textSize;
  const cornerSize = options.cornerSize ?? DEFAULT_LUMEN_APPEARANCE.cornerSize;
  const shape = options.shape ?? DEFAULT_LUMEN_APPEARANCE.shape;
  const colors = resolveLumenColors(mode, options.colors);
  const ink = colors.foreground;
  const contrast = colors.contrast;
  const customized =
    options.colors?.foreground !== undefined || options.colors?.background !== undefined;
  let controlGlow = mode === 'dark' ? 'rgb(255 255 255 / 75%)' : 'rgb(0 0 0 / 48%)';
  let menuSurface = mode === 'dark' ? 'rgb(24 24 24 / 92%)' : 'rgb(250 250 250 / 94%)';
  let menuEdge = mode === 'dark' ? 'rgb(255 255 255 / 17%)' : 'rgb(0 0 0 / 14%)';
  let menuLine = mode === 'dark' ? 'rgb(255 255 255 / 10%)' : 'rgb(0 0 0 / 10%)';
  let secondaryText = mode === 'dark' ? '#aaaaaa' : '#626262';
  let disabledText = mode === 'dark' ? '#777' : '#999';
  let switchTrack = mode === 'dark' ? 'rgb(255 255 255 / 28%)' : 'rgb(0 0 0 / 28%)';
  let switchFill = mode === 'dark' ? '#171717' : '#f5f5f5';
  let paper = mode === 'dark' ? '#181818' : '#fafafa';
  let overlayShadow =
    mode === 'dark'
      ? '0 0 0 0.0625rem rgb(255 255 255 / 26%), 0 0 1rem rgb(255 255 255 / 20%), 0 0 2.75rem rgb(255 255 255 / 10%)'
      : '0 0 0 0.0625rem rgb(0 0 0 / 24%), 0 0 1rem rgb(0 0 0 / 17%), 0 0 2.75rem rgb(0 0 0 / 8%)';
  if (customized) {
    controlGlow = `color-mix(in srgb, ${ink} calc(var(--lumen-glow, 0.65) * 100%), transparent)`;
    menuSurface = alpha(colors.background, 0.94);
    menuEdge = alpha(ink, 0.24);
    menuLine = alpha(ink, 0.1);
    secondaryText = alpha(ink, 0.72);
    disabledText = colors.subtle;
    switchTrack = alpha(ink, 0.28);
    switchFill = colors.background;
    paper = colors.background;
    overlayShadow = `0 0 0 0.0625rem ${menuEdge}, 0 0 1rem ${alpha(ink, 0.18)}, 0 0 2.75rem ${alpha(ink, 0.08)}`;
  }
  const thumbGlow = `0 0 calc(var(--lumen-range-progress, 0) * ${mode === 'dark' ? '0.8rem' : '0.45rem'}) calc(var(--lumen-range-progress, 0) * 0.125rem) ${controlGlow}`;
  const trackGlow = `0 0 calc(var(--lumen-range-progress, 0) * ${mode === 'dark' ? '0.7rem' : '0.35rem'}) calc(var(--lumen-range-progress, 0) * 0.0625rem) ${controlGlow}`;
  const sliderTransition =
    'width 120ms linear, height 120ms linear, left 120ms linear, right 120ms linear, bottom 120ms linear, box-shadow 180ms ease';
  const noMotion = {
    '[data-lumen-motion="off"] &': { transition: 'none' },
    '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
  };
  const fontSize = { s: 13, m: 14, l: 16 }[textSize];
  const borderRadius = shape === 'square' ? 0 : { s: 4, m: 6, l: 8 }[cornerSize];
  const theme = createTheme({
    cssVariables: { cssVarPrefix: 'lumen-mui' },
    palette: {
      mode,
      primary: { main: ink, contrastText: contrast },
      secondary: { main: contrast, contrastText: ink },
      success: { main: colors.success },
      warning: { main: colors.warning },
      error: { main: colors.danger },
      info: { main: colors.info },
      background: {
        default: colors.background,
        paper,
      },
      text: { primary: ink, secondary: options.colors?.muted ?? secondaryText },
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
        defaultProps: { disableElevation: true, color: 'inherit' },
        styleOverrides: {
          root: {
            minWidth: 0,
            minHeight: { s: '1.875rem', m: '2.25rem', l: '2.625rem' }[controlSize],
            '[data-lumen-motion="off"] &': {
              transition: 'none',
              '&::after': { transition: 'none' },
            },
            borderRadius: 'var(--lumen-radius-control, 0.375rem)',
            '&:hover': { backgroundColor: alpha(ink, 0.08) },
            '&:active': { backgroundColor: alpha(ink, 0.16) },
            '&:not(:has(> [data-edge]))::after': {
              content: '""',
              position: 'absolute',
              bottom: '0.125rem',
              left: '50%',
              width: '34%',
              height: '0.125rem',
              pointerEvents: 'none',
              transform: 'translateX(-50%)',
              borderRadius: '1rem',
              backgroundColor: ink,
              opacity: 0.5,
              transition: 'width 180ms ease, opacity 180ms ease, box-shadow 180ms ease',
            },
            '&:not(:has(> [data-edge])):is(:hover, .Mui-focusVisible)::after': {
              width: '70%',
              opacity: 1,
              boxShadow: `0 0 0.5rem ${controlGlow}`,
            },
            '&:disabled::after': { opacity: 0.12, boxShadow: 'none' },
            '@media (prefers-reduced-motion: reduce)': {
              '&::after': { transition: 'none' },
            },
            '@media (forced-colors: active)': {
              '&::after': { backgroundColor: 'CanvasText', opacity: 1 },
            },
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            borderRadius: 'var(--lumen-radius-control, 0.375rem)',
            '&:hover': { backgroundColor: alpha(ink, 0.08) },
            '&:active': { backgroundColor: alpha(ink, 0.16) },
          },
        },
      },
      MuiPaper: { styleOverrides: { root: { backgroundImage: 'none' } } },
      MuiMenu: {
        defaultProps: { disableAutoFocusItem: false },
        styleOverrides: {
          paper: {
            backgroundColor: menuSurface,
            backgroundImage: 'none',
            backdropFilter: 'blur(0.75rem)',
            border: `0.0625rem solid ${menuEdge}`,
            borderRadius: '0.375rem',
            boxShadow: overlayShadow,
          },
          list: {
            padding: '0.375rem',
          },
        },
      },
      MuiPopover: {
        styleOverrides: {
          paper: {
            boxShadow: overlayShadow,
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            boxShadow: overlayShadow,
          },
        },
      },
      MuiMenuItem: {
        defaultProps: { disableRipple: true },
        styleOverrides: {
          root: {
            position: 'relative',
            minHeight: '2.25rem',
            padding: '0.5rem 0.75rem',
            borderRadius: '0.25rem',
            color: ink,
            backgroundColor: 'transparent',
            transition: 'color 180ms ease, background-color 180ms ease',
            '[data-lumen-motion="off"] &': {
              transition: 'none',
              '&::after': { transition: 'none' },
            },
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: '0.25rem',
              left: '50%',
              width: '12%',
              height: '0.125rem',
              pointerEvents: 'none',
              transform: 'translateX(-50%)',
              borderRadius: '1rem',
              backgroundColor: ink,
              opacity: 0.35,
              boxShadow: `0 0 0.375rem ${menuLine}`,
              transition: 'width 180ms ease, opacity 180ms ease, box-shadow 180ms ease',
            },
            '&:hover': {
              backgroundColor: 'transparent',
            },
            '&:hover::after, &.Mui-focusVisible::after': {
              width: '48%',
              opacity: 0.8,
              boxShadow: `0 0 0.5rem ${controlGlow}`,
            },
            '&.Mui-selected::after': {
              width: '80%',
              opacity: 1,
              boxShadow: `0 0 0.75rem ${controlGlow}`,
            },
            '&.Mui-disabled': {
              color: options.colors?.subtle ?? disabledText,
              '&::after': { opacity: 0.12, boxShadow: 'none' },
            },
            '@media (prefers-reduced-motion: reduce)': {
              transition: 'none',
              '&::after': { transition: 'none' },
            },
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: 6,
            backgroundColor: 'transparent',
            '& .MuiOutlinedInput-notchedOutline': { borderColor: 'transparent' },
            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'transparent' },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'transparent' },
          },
          notchedOutline: { borderColor: 'transparent' },
        },
      },
      MuiInputLabel: {
        styleOverrides: {
          root: {
            color: colors.muted,
            '&.Mui-focused': { color: ink },
          },
        },
      },
      MuiFormHelperText: {
        styleOverrides: {
          root: { color: colors.muted },
        },
      },
      MuiSlider: {
        styleOverrides: {
          root: {
            '&.MuiSlider-dragging .MuiSlider-track, &.MuiSlider-dragging .MuiSlider-thumb': {
              transition: sliderTransition,
              ...noMotion,
            },
          },
          thumb: {
            width: '0.625rem',
            height: '0.625rem',
            borderRadius: '0.125rem',
            boxShadow: thumbGlow,
            transition: sliderTransition,
            ...noMotion,
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
          track: {
            height: '0.125rem',
            border: 0,
            boxShadow: trackGlow,
            transition: sliderTransition,
            ...noMotion,
          },
        },
      },
      MuiSwitch: {
        styleOverrides: {
          root: { overflow: 'visible' },
          switchBase: {
            color: 'transparent',
            ...noMotion,
            '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
            '&.Mui-checked': {
              color: 'transparent',
              '& .MuiSwitch-thumb': {
                backgroundColor: ink,
                borderColor: ink,
                boxShadow: `0 0 ${mode === 'dark' ? '0.5rem' : '0.3rem'} ${controlGlow}, 0 0 ${mode === 'dark' ? '1rem' : '0.55rem'} ${controlGlow}`,
              },
              '& + .MuiSwitch-track': {
                backgroundColor: switchTrack,
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
            backgroundColor: switchFill,
            boxShadow: 'none',
            transition:
              'background-color 180ms ease, box-shadow 180ms ease, border-color 180ms ease',
            ...noMotion,
            '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
          },
          track: {
            alignSelf: 'center',
            height: '0.125rem',
            borderRadius: 0,
            backgroundColor: switchTrack,
            opacity: 1,
          },
        },
      },
    },
  });
  return enhanceHighContrast(theme);
}

export type { LumenMode } from './appearance';
