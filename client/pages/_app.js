// client/pages/_app.js
import '../styles/globals.css'; // ✅ Import CSS file
import { ThemeProvider } from 'styled-components';

// Optional: if you use styled-components global styles, create a separate file
// import GlobalStyles from '../styles/StyledGlobalStyles';

const theme = {
  primary: '#4A6B3A',
  secondary: '#D8B4E2',
};

export default function App({ Component, pageProps }) {
  return (
    <ThemeProvider theme={theme}>
      {/* {GlobalStyles && <GlobalStyles />} */}
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
