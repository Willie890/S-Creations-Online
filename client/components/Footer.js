// client/components/Footer.js
import theme from '../styles/theme';

export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: theme.colors.dark,
        color: theme.colors.light,
        padding: theme.spacing.md,
        textAlign: 'center',
        marginTop: theme.spacing.xl,
      }}
    >
      <p>&copy; {new Date().getFullYear()} S-Creations Online. All rights reserved.</p>
    </footer>
  );
}
