import { createTheme } from '@mui/material/styles';

export type LumenMode = 'dark' | 'light';

export default function createLumenTheme(mode: LumenMode) {
  const ink = mode === 'dark' ? '#eeeeee' : '#171717';
  const controlGlow = mode === 'dark' ? 'rgb(255 255 255 / 75%)' : 'rgb(0 0 0 / 48%)';
  const thumbGlow = `0 0 calc(var(--lumen-range-progress, 0) * ${mode === 'dark' ? '0.8rem' : '0.45rem'}) calc(var(--lumen-range-progress, 0) * 0.125rem) ${controlGlow}`;
  const trackGlow = `0 0 calc(var(--lumen-range-progress, 0) * ${mode === 'dark' ? '0.7rem' : '0.35rem'}) calc(var(--lumen-range-progress, 0) * 0.0625rem) ${controlGlow}`;
  return createTheme({
    cssVariables: { cssVarPrefix: 'lumen-mui' },
    palette: {
      mode,
      primary: { main: ink },
      background: {
        default: mode === 'dark' ? '#090909' : '#f5f5f5',
        paper: mode === 'dark' ? '#181818' : '#fafafa',
      },
      text: { primary: ink, secondary: mode === 'dark' ? '#aaaaaa' : '#626262' },
    },
    typography: {
      fontFamily: '"Segoe UI", "Microsoft YaHei", sans-serif',
      fontSize: 14,
      button: { textTransform: 'none', fontWeight: 500 },
    },
    shape: { borderRadius: 6 },
    components: {
      MuiButtonBase: { defaultProps: { disableRipple: true } },
      MuiButton: {
        defaultProps: { disableElevation: true, color: 'inherit' },
        styleOverrides: { root: { minWidth: 0, '&:hover': { backgroundColor: 'transparent' } } },
      },
      MuiIconButton: {
        styleOverrides: { root: { '&:hover': { backgroundColor: 'transparent' } } },
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
}
