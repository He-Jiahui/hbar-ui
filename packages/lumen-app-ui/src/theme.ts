import { alpha, createTheme, enhanceHighContrast, type Theme } from '@mui/material/styles';
import { DEFAULT_LUMEN_APPEARANCE, type LumenAppearance, type LumenMode } from './appearance';

export interface LumenThemeOptions extends Pick<
  LumenAppearance,
  'controlSize' | 'textSize' | 'cornerSize' | 'shape'
> {}

export default function createLumenTheme(
  mode: LumenMode,
  options: Partial<LumenThemeOptions> = {},
): Theme {
  const controlSize = options.controlSize ?? DEFAULT_LUMEN_APPEARANCE.controlSize;
  const textSize = options.textSize ?? DEFAULT_LUMEN_APPEARANCE.textSize;
  const cornerSize = options.cornerSize ?? DEFAULT_LUMEN_APPEARANCE.cornerSize;
  const shape = options.shape ?? DEFAULT_LUMEN_APPEARANCE.shape;
  const ink = mode === 'dark' ? '#eeeeee' : '#171717';
  const contrast = mode === 'dark' ? '#090909' : '#f5f5f5';
  const controlGlow = mode === 'dark' ? 'rgb(255 255 255 / 75%)' : 'rgb(0 0 0 / 48%)';
  const menuSurface = mode === 'dark' ? 'rgb(24 24 24 / 92%)' : 'rgb(250 250 250 / 94%)';
  const menuEdge = mode === 'dark' ? 'rgb(255 255 255 / 17%)' : 'rgb(0 0 0 / 14%)';
  const menuLine = mode === 'dark' ? 'rgb(255 255 255 / 10%)' : 'rgb(0 0 0 / 10%)';
  const overlayShadow =
    mode === 'dark'
      ? '0 0 0 0.0625rem rgb(255 255 255 / 26%), 0 0 1rem rgb(255 255 255 / 20%), 0 0 2.75rem rgb(255 255 255 / 10%)'
      : '0 0 0 0.0625rem rgb(0 0 0 / 24%), 0 0 1rem rgb(0 0 0 / 17%), 0 0 2.75rem rgb(0 0 0 / 8%)';
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
      success: { main: mode === 'dark' ? '#77deb0' : '#1a7c56' },
      warning: { main: mode === 'dark' ? '#efd17a' : '#996500' },
      error: { main: mode === 'dark' ? '#ff969b' : '#b73548' },
      info: { main: mode === 'dark' ? '#81b5ff' : '#285bc3' },
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
        defaultProps: { disableElevation: true, color: 'inherit' },
        styleOverrides: {
          root: {
            minWidth: 0,
            minHeight: { s: '1.875rem', m: '2.25rem', l: '2.625rem' }[controlSize],
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
              color: mode === 'dark' ? '#777' : '#999',
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
            color: mode === 'dark' ? '#aaa' : '#666',
            '&.Mui-focused': { color: ink },
          },
        },
      },
      MuiFormHelperText: {
        styleOverrides: {
          root: { color: mode === 'dark' ? '#aaa' : '#666' },
        },
      },
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
