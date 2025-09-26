// client/pages/shop.js
import { products } from '../utils/products';

export default function Shop() {
  return (
    <div className="container" style={{ padding: '3rem 0' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '2rem', color: '#5A4A42' }}>
        Our Collection
      </h1>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
        gap: '2rem',
      }}>
        {products.map(p => (
          <div key={p.id} style={{
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
              <h3 style={{ margin: '0 0 0.5rem', color: '#5A4A42' }}>{p.name}</h3>
              <p style={{ color: '#C9A9A6', fontWeight: 'bold', margin: '0 0 1rem' }}>${p.price}</p>
              <a href={`/product/${p.id}`} className="btn">View Details</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
