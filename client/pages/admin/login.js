// pages/admin/login.js
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = () => {
    if (password === 'admin123') { // Hardcoded password for demo
      localStorage.setItem('isAdmin', 'true');
      router.push('/admin/dashboard');
    } else {
      alert('Invalid password');
    }
  };

  return (
    <div style={{
      padding: '2rem',
      backgroundColor: '#E6D5F0',
      fontFamily: 'Arial, sans-serif',
      textAlign: 'center',
    }}>
      <h1 style={{ color: '#4A6B3A' }}>🔐 Admin Login</h1>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter admin password"
        style={{
          padding: '0.5rem',
          borderRadius: '5px',
          border: '1px solid #ccc',
          marginBottom: '1rem',
          width: '100%',
          maxWidth: '300px',
        }}
      />
      <button
        onClick={handleLogin}
        style={{
          padding: '0.75rem 1.5rem',
          backgroundColor: '#4A6B3A',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
        }}
      >
        Login
      </button>
    </div>
  );
}
