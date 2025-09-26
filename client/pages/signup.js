// client/pages/signup.js
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (res.ok) {
      alert('Account created! Please log in.');
      router.push('/login');
    } else {
      alert('Signup failed');
    }
  };

  return (
    <div className="container" style={{ padding: '3rem 0', maxWidth: '500px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Create Account</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ width: '100%', padding: '0.6rem', marginBottom: '1rem', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ width: '100%', padding: '0.6rem', marginBottom: '1.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <button type="submit" className="btn" style={{ width: '100%' }}>Sign Up</button>
      </form>
      <p style={{ textAlign: 'center', marginTop: '1rem' }}>
        Already have an account? <a href="/login">Log In</a>
      </p>
    </div>
  );
}
