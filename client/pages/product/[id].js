// client/pages/product/[id].js
import { useState } from 'react';
import { useRouter } from 'next/router';
import { products } from '../../utils/products';

export default function ProductPage() {
  const router = useRouter();
  const { id } = router.query;
  const product = products.find(p => p.id === parseInt(id));

  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: '#4A6B3A' }}>
        Product not found.
      </div>
    );
  }

  const addToCart = () => {
    if (!selectedSize) {
      alert('Please select a size.');
      return;
    }

    // For static site: cart lives in localStorage (client-only)
    if (typeof window !== 'undefined') {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const existing = cart.find(item => item.id === product.id && item.size === selectedSize);
      
      if (existing) {
        existing.quantity += quantity;
      } else {
        cart.push({ ...product, size: selectedSize, quantity });
      }
      
      localStorage.setItem('cart', JSON.stringify(cart));
      alert(`Added to cart!`);
    }
  };

  return (
    <div style={{ padding: '2rem', backgroundColor: '#E6D5F0', fontFamily: 'Arial' }}>
      <a href="/shop" style={{ color: '#4A6B3A', marginBottom: '1.5rem', display: 'inline-block' }}>
        ← Back to Shop
      </a>
      
      <div style={{ display: 'flex', gap: '2.5rem', flexWrap: 'wrap' }}>
        <img
          src={product.image}
          alt={product.name}
          style={{ width: '320px', height: '320px', objectFit: 'cover', borderRadius: '10px' }}
        />
        
        <div style={{ flex: 1, minWidth: '280px' }}>
          <h1 style={{ color: '#4A6B3A', fontSize: '2rem', margin: '0 0 1rem' }}>
            {product.name}
          </h1>
          <p style={{ fontSize: '1.4rem', color: '#D8B4E2', fontWeight: 'bold', margin: '0 0 1.2rem' }}>
            ${product.price}
          </p>
          <p style={{ marginBottom: '1.5rem' }}>{product.description}</p>

          <div style={{ marginBottom: '1.2rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Size:
            </label>
            <select
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
              style={{
                width: '100%',
                padding: '0.6rem',
                borderRadius: '6px',
                border: '1px solid #ccc',
              }}
            >
              <option value="">Select size</option>
              {product.sizes.map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Quantity:
            </label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              style={{
                width: '80px',
                padding: '0.6rem',
                borderRadius: '6px',
                border: '1px solid #ccc',
              }}
            />
          </div>

          <button
            onClick={addToCart}
            disabled={!selectedSize}
            style={{
              padding: '0.8rem 1.8rem',
              backgroundColor: selectedSize ? '#4A6B3A' : '#ccc',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1.1rem',
              cursor: selectedSize ? 'pointer' : 'not-allowed',
            }}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
