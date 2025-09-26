// client/components/Header.js
'use client';

import { useAuth } from '../context/AuthContext';
import theme from '../styles/theme';

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header style={{ backgroundColor: theme.colors.dark, padding: theme.spacing.md }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ color: theme.colors.light, fontSize: '1.5rem' }}>S-Creations</h1>
        <nav>
          {user ? (
            <button
              onClick={logout}
              style={{
                backgroundColor: theme.colors.danger,
                color: 'white',
                padding: theme.spacing.sm,
                borderRadius: theme.borderRadius.md,
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Logout
            </button>
          ) : (
            <span style={{ color: theme.colors.light }}>Guest</span>
          )}
        </nav>
      </div>
    </header>
  );
}
