// client/pages/index.js
export default function HomePage() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#E6D5F0',
      color: '#4A6B3A',
      fontFamily: 'Arial, sans-serif',
      textAlign: 'center',
      padding: '2rem',
      boxSizing: 'border-box',
    }}>
      <h1 style={{ fontSize: '2.8rem', marginBottom: '1.2rem', fontWeight: 'normal' }}>
        🌸 Welcome to S-Creations Online
      </h1>
      <p style={{ fontSize: '1.3rem', marginBottom: '2.5rem', maxWidth: '600px', lineHeight: 1.5 }}>
        Handcrafted treasures made with love, just for you.
      </p>
      <a
        href="/shop"
        style={{
          padding: '0.85rem 2rem',
          backgroundColor: '#4A6B3A',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '10px',
          fontSize: '1.2rem',
          fontWeight: 'bold',
          boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
          transition: 'transform 0.2s',
        }}
        onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
        onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
      >
        Start Shopping →
      </a>
    </div>
  );
}
