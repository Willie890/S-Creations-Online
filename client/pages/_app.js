import { AuthProvider } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';
import { ThemeProvider } from 'styled-components';
import { theme } from '../styles/theme';
import GlobalStyles from '../styles/GlobalStyles';

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <AuthProvider>
        <CartProvider>
          <Component {...pageProps} />
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default MyApp;
