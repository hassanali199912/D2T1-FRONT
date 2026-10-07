import { createTheme } from '@mui/material/styles';
import '@fontsource/cairo/400.css';
import '@fontsource/cairo/500.css';
import '@fontsource/cairo/600.css';
import '@fontsource/cairo/700.css';

export type AppDirection = 'rtl' | 'ltr';

export const makeTheme = (direction: AppDirection = 'rtl') =>
  createTheme({
    direction,

    palette: {
      mode: 'light',

      primary: {
        light: '#3B5B85',
        main: '#1E3A5F',
        dark: '#122640',
        contrastText: '#FFFFFF',
      },

      secondary: {
        light: '#5EEAD4',
        main: '#0EA5A4',
        dark: '#0B7F7E',
        contrastText: '#FFFFFF',
      },

      // Gold accent: use for highlights, citations, "source" badges
      info: {
        main: '#B8893B',
        light: '#F6EBD3',
        dark: '#8A6422',
        contrastText: '#FFFFFF',
      },

      success: { main: '#16A34A', light: '#DCFCE7' }, // approved / covered
      warning: { main: '#D97706', light: '#FEF3C7' }, // under review / needs info
      error: { main: '#DC2626', light: '#FEE2E2' },   // rejected / excluded

      background: {
        default: '#F4F7FB',
        paper: '#FFFFFF',
      },

      text: {
        primary: '#17202A',
        secondary: '#5B6B7F',
      },

      divider: '#E2E8F0',
    },

    typography: {
      fontFamily: ['Cairo', 'Inter', 'Arial', 'sans-serif'].join(','),

      // Arabic needs a bit more line height to stay readable
      h1: { fontSize: '2rem', fontWeight: 700, lineHeight: 1.5 },
      h2: { fontSize: '1.75rem', fontWeight: 700, lineHeight: 1.5 },
      h3: { fontSize: '1.5rem', fontWeight: 700, lineHeight: 1.5 },
      h4: { fontSize: '1.25rem', fontWeight: 600, lineHeight: 1.6 },
      h5: { fontSize: '1.1rem', fontWeight: 600, lineHeight: 1.6 },
      h6: { fontSize: '1rem', fontWeight: 600, lineHeight: 1.6 },
      body1: { fontSize: '0.95rem', lineHeight: 1.8 },
      body2: { fontSize: '0.875rem', lineHeight: 1.75 },
      button: { fontWeight: 600, textTransform: 'none' },
    },

    shape: { borderRadius: 10 },

    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            fontFamily: 'Cairo, Inter, Arial, sans-serif',
            WebkitFontSmoothing: 'antialiased',
          },
        },
      },

      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: {
          root: { borderRadius: 8, fontWeight: 600 },
        },
      },

      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            border: '1px solid #E2E8F0',
            boxShadow: '0 2px 10px rgba(30,58,95,0.05)',
          },
        },
      },

      MuiChip: {
        styleOverrides: {
          root: { fontWeight: 600 },
        },
      },

      MuiTextField: { defaultProps: { size: 'small' } },

      MuiOutlinedInput: {
        styleOverrides: {
          root: { borderRadius: 8 },
        },
      },
    },
  });

export const theme = makeTheme();