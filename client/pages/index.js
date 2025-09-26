// client/pages/index.js
export default function Home() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#FFF9F5',
      textAlign: 'center',
      padding: '2rem',
    }}>
      <h1 style={{ fontSize: '2.8rem', marginBottom: '1rem', fontFamily: 'cursive' }}>
        🌸 Welcome to S-Creations Online
      </h1>
      <p style={{ fontSize: '1.2rem', marginBottom: '2rem', maxWidth: '600px' }}>
        Handcrafted treasures, made with love and care — just for you.
      </p>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <a href="/signup" className="btn">Create Account</a>
        <a href="/shop" className="btn" style={{ backgroundColor: '#C9A9A6', color: '#5A4A42' }}>
          Browse Collection
        </a>
      </div>
    </div>
  );
}
