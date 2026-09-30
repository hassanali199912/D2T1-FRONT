import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'light',

    primary: {
      main: '#1E3A5F',
    },

    secondary: {
      main: '#0EA5A4',
    },

    background: {
      default: '#F5F7FA',
      paper: '#FFFFFF',
    },

    text: {
      primary: '#17202A',
      secondary: '#64748B',
    },

    success: {
      main: '#16A34A',
    },

    warning: {
      main: '#D97706',
    },

    error: {
      main: '#DC2626',
    },
  },

  typography: {
    fontFamily: [
      'Inter',
      'Arial',
      'sans-serif',
    ].join(','),

    h1: {
      fontSize: '2rem',
      fontWeight: 700,
    },

    h2: {
      fontSize: '1.75rem',
      fontWeight: 700,
    },

    h3: {
      fontSize: '1.5rem',
      fontWeight: 700,
    },

    body1: {
      fontSize: '0.95rem',
    },

    body2: {
      fontSize: '0.875rem',
    },
  },

  shape: {
    borderRadius: 10,
  },

  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },

      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
        },
      },
    },

    MuiTextField: {
      defaultProps: {
        size: 'small',
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
});