// pages/welcome.js
import { useState } from 'react';
import Link from 'next/link';

export default function WelcomePage() {
  const [showWelcome, setShowWelcome] = useState(true);

  return (
    <div style={{
      backgroundColor: '#E6D5F0', // Lavender background
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '2rem',
      fontFamily: 'cursive',
      color: '#4A6B3A', // Olive green text
    }}>
      {showWelcome && (
        <div style={{
          textAlign: 'center',
          maxWidth: '600px',
          padding: '2rem',
          borderRadius: '15px',
          backgroundColor: 'white',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        }}>
          <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌸 Welcome to S-Creations Online 🌸</h1>
          <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>
            Discover handmade treasures crafted with love.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link href="/signup" passHref>
              <button style={{
                padding: '0.75rem 1.5rem',
                fontSize: '1rem',
                backgroundColor: '#4A6B3A',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'background-color 0.3s',
              }}>
                Create Account
              </button>
            </Link>
            <Link href="/shop" passHref>
              <button style={{
                padding: '0.75rem 1.5rem',
                fontSize: '1rem',
                backgroundColor: '#D8B4E2',
                color: '#4A6B3A',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'background-color 0.3s',
              }}>
                Continue Browsing
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
