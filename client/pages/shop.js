// client/pages/shop.js
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Shop() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(setProducts);
  }, []);

  return (
    <div className="container" style={{ padding: '3rem 0' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>Our Collection</h1>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
        gap: '2rem',
      }}>
        {products.map(p => (
          <div key={p._id} style={{
            backgroundColor: 'white',
            borderRadius: '10px',
            overflow: 'hidden',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          }}>
            <img src={p.image} alt={p.name} style={{
              width: '100%',
              height: '240px',
              objectFit: 'cover',
            }} />
            <div style={{ padding: '1.2rem' }}>
              <h3 style={{ margin: '0 0 0.5rem' }}>{p.name}</h3>
              <p style={{ color: '#C9A9A6', fontWeight: 'bold', margin: '0 0 1rem' }}>${p.price}</p>
              <Link href={`/product/${p._id}`} className="btn">View Details</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
