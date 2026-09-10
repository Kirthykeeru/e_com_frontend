import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: { main: '#1a5fb4' },
    secondary: { main: '#e08a00' },
    background: { default: '#f4f6f8' },
  },
  shape: { borderRadius: 8 },
  typography: {
    fontFamily: ['"Inter"', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'].join(','),
  },
});

export default theme;
