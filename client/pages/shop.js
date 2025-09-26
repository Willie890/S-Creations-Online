// client/pages/shop.js
import { products } from '../utils/products';

export default function ShopPage() {
  return (
    <div style={{
      padding: '2rem',
      backgroundColor: '#E6D5F0',
      fontFamily: 'Arial, sans-serif',
    }}>
      <h1 style={{ color: '#4A6B3A', textAlign: 'center', marginBottom: '2rem' }}>
        🛍️ Our Collection
      </h1>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '2rem',
      }}>
        {products.map(product => (
          <div key={product.id} style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          }}>
            <img
              src={product.image}
              alt={product.name}
              style={{
                width: '100%',
                height: '220px',
                objectFit: 'cover',
              }}
            />
            <div style={{ padding: '1.2rem' }}>
              <h3 style={{ color: '#4A6B3A', margin: '0 0 0.5rem', fontSize: '1.3rem' }}>
                {product.name}
              </h3>
              <p style={{ color: '#D8B4E2', fontWeight: 'bold', margin: '0 0 1rem', fontSize: '1.1rem' }}>
                ${product.price}
              </p>
              <a
                href={`/product/${product.id}`}
                style={{
                  display: 'inline-block',
                  padding: '0.6rem 1.2rem',
                  backgroundColor: '#4A6B3A',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '8px',
                }}
              >
                View Details
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
