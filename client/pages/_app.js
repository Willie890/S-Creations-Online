// client/pages/_app.js
import { AuthProvider } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';
import GlobalStyles from '../styles/globals.css';
import '../styles/globals.css';

export default function App({ Component, pageProps }) {
  return (
    <>
      <GlobalStyles />
      <AuthProvider>
        <CartProvider>
          <Component {...pageProps} />
        </CartProvider>
      </AuthProvider>
    </>
  );
}
