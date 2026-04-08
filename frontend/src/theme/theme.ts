import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#f55d4e', // Signature Coral Red
      light: '#ff8a7d',
      dark: '#bd2424',
    },
    secondary: {
      main: '#2c3e50', // Deep Slate
    },
    background: {
      default: '#f8f9fa',
      paper: '#ffffff',
    },
    text: {
      primary: '#2c3e50',
      secondary: '#64748b',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontFamily: 'Outfit', fontWeight: 900 },
    h2: { fontFamily: 'Outfit', fontWeight: 800 },
    h3: { fontFamily: 'Outfit', fontWeight: 800 },
    h4: { fontFamily: 'Outfit', fontWeight: 700 },
    h5: { fontFamily: 'Outfit', fontWeight: 700 },
    h6: { fontFamily: 'Outfit', fontWeight: 700 },
    subtitle1: { fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 800 },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 30, // Pill shaped buttons for modern look
          padding: '10px 24px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 8px 16px rgba(245, 93, 78, 0.15)',
          },
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #f55d4e 0%, #e54d3e 100%)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          border: '1px solid #f1f3f5',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
        },
      },
    },
  },
});

export default theme;
