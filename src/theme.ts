import { createTheme } from '@mui/material/styles';

const fetchThemeSimplified = createTheme({
  palette: {
    primary: {
      // Fetch Purple
      main: '#6A0DAD',
      contrastText: '#ffffff',
    },
    secondary: {
      // Neutral grey
      main: '#f5f5f5',
      contrastText: '#333333',
    },
    background: {
      default: '#f9f9f9',
      paper: '#ffffff',
    },
    text: {
      primary: '#333333',
      secondary: '#666666',
    },
  },
  typography: {
    fontFamily: '"Poppins", Arial, sans-serif',
     button: {
         textTransform: 'none',
         fontWeight: 500,
     }
  },
  shape: {
    borderRadius: 8,
  },
  components: {},
});

export default fetchThemeSimplified; 
