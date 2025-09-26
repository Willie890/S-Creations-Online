// client/pages/_app.js
import '../styles/globals.css';
import { useEffect, useState } from 'react';

export default function App({ Component, pageProps }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const isAdmin = localStorage.getItem('isAdmin') === 'true';
      setUser({ isAdmin });
    }
  }, []);

  return <Component {...pageProps} user={user} />;
}
