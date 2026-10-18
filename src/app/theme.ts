import { createTheme } from '@mui/material/styles';

export type Appearance = 'light' | 'dark';
export const isAppearance = (value: unknown): value is Appearance => value === 'light' || value === 'dark';
export function recipeTheme(mode: Appearance) {
  const dark = mode === 'dark';
  const accentFill = dark ? '#3b5268' : '#d5e4f2';
  const accentHover = dark ? '#49627b' : '#c7dced';
  const accentText = dark ? '#e3edf7' : '#354e66';
  return createTheme({
    palette: {
      mode,
      primary: { main: dark ? '#b4cde4' : '#4c6c89', contrastText: dark ? '#253b50' : '#ffffff', light: dark ? '#32495e' : '#e3edf7' },
      secondary: { main: dark ? '#cec7e1' : '#6c6580', light: dark ? '#454157' : '#ede8f5' },
      background: { default: dark ? '#181d25' : '#f4f7fb', paper: dark ? '#222a35' : '#ffffff' },
      text: { primary: dark ? '#e3e9f1' : '#303e4d', secondary: dark ? '#becad8' : '#616e7e' },
      divider: dark ? '#3d4959' : '#dfe6ef',
    },
    typography: {
      fontFamily: 'Roboto, "Noto Sans SC", "Microsoft YaHei", sans-serif',
      h1: { fontSize: '2.65rem', lineHeight: 1.25, fontWeight: 500, letterSpacing: '-.04em' },
      h2: { fontSize: '1.65rem', lineHeight: 1.4, fontWeight: 500 },
      h3: { fontSize: '1.25rem', lineHeight: 1.5, fontWeight: 500 },
      body1: { lineHeight: 1.8 }, body2: { lineHeight: 1.7 },
      button: { textTransform: 'none', fontWeight: 500, letterSpacing: 0 },
    },
    shape: { borderRadius: 16 },
    components: {
      MuiButton: { defaultProps: { disableElevation: true }, styleOverrides: { root: { borderRadius: 100, minHeight: 44, paddingInline: 22 }, containedPrimary: { backgroundColor: accentFill, color: accentText, '&:hover': { backgroundColor: accentHover } } } },
      MuiIconButton: { styleOverrides: { root: { minWidth: 44, minHeight: 44 } } },
      MuiChip: { styleOverrides: { root: { borderRadius: 9, '&.MuiChip-filled.MuiChip-colorPrimary': { backgroundColor: accentFill, color: accentText, '& .MuiChip-icon': { color: 'inherit' }, '&:hover, &.Mui-focusVisible': { backgroundColor: accentHover } } }, label: { paddingInline: 12 } } },
      MuiOutlinedInput: { styleOverrides: { root: { borderRadius: 16 } } },
      MuiCard: { defaultProps: { elevation: 0 }, styleOverrides: { root: { borderRadius: 24 } } },
      MuiPaper: { styleOverrides: { root: { backgroundImage: 'none' } } },
      MuiCssBaseline: { styleOverrides: {
        '*': { boxSizing: 'border-box' },
        html: { scrollPaddingTop: 90 },
        'a, button, input': { WebkitTapHighlightColor: 'transparent' },
        '::selection': { background: dark ? '#4c6c89' : '#e3edf7' },
        ':focus-visible': { outline: `3px solid ${dark ? '#b4cde4' : '#4c6c89'}`, outlineOffset: 3 },
      } },
    },
  });
}
