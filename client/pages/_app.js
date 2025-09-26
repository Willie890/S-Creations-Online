// client/pages/_app.js
import '../styles/globals.css';
import { useEffect, useState } from 'react';

export default function App({ Component, pageProps }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // In real app: verify token with /api/auth/me
      const admin = localStorage.getItem('isAdmin') === 'true';
      setUser({ isAdmin: admin });
    }
  }, []);

  return <Component {...pageProps} user={user} />;
}
