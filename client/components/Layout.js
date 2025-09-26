// client/components/Layout.js
import Header from './Header';
import Footer from './Footer';
import theme from '../styles/theme';

export default function Layout({ children }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <main style={{ flex: 1, padding: theme.spacing.md }}>{children}</main>
      <Footer />
    </div>
  );
}
