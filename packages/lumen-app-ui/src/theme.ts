import { createTheme } from '@mui/material/styles';

export type LumenMode = 'dark' | 'light';

export default function createLumenTheme(mode: LumenMode) {
  const ink = mode === 'dark' ? '#eeeeee' : '#171717';
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
            '&:hover, &.Mui-focusVisible, &.Mui-active': {
              boxShadow: '0 0 0 0.25rem currentColor',
            },
          },
          rail: { height: '0.0625rem' },
          track: { height: '0.125rem', border: 0 },
        },
      },
    },
  });
}
