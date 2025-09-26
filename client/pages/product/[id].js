// client/pages/product/[id].js
import { useState } from 'react';
import { useRouter } from 'next/router';
import { products } from '../../utils/products';

export default function Product() {
  const router = useRouter();
  const { id } = router.query;
  const product = products.find(p => p.id === parseInt(id));
  const [size, setSize] = useState('');
  const [qty, setQty] = useState(1);

  if (!product) return <p style={{ textAlign: 'center', padding: '3rem' }}>Product not found.</p>;

  const addToCart = async () => {
    if (!size) return alert('Please select a size.');
    
    const item = { ...product, size, qty };
    
    // In real app: send to /api/cart
    localStorage.setItem('tempCart', JSON.stringify([item]));
    alert('Added to cart! (Demo mode)');
    router.push('/cart');
  };

  return (
    <div className="container" style={{ padding: '3rem 0' }}>
      <a href="/shop" style={{ display: 'inline-block', marginBottom: '1.5rem', color: '#C9A9A6' }}>
        ← Back to Shop
      </a>
      <div style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap' }}>
        <img src={product.image} alt={product.name} style={{
          width: '350px',
          height: '350px',
          objectFit: 'cover',
          borderRadius: '8px',
        }} />
        <div style={{ flex: 1, minWidth: '300px' }}>
          <h1 style={{ color: '#5A4A42', fontSize: '2rem' }}>{product.name}</h1>
          <p style={{ fontSize: '1.4rem', color: '#C9A9A6', margin: '0.5rem 0' }}>${product.price}</p>
          <p>{product.description}</p>

          <div style={{ marginTop: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Size:</label>
            <select value={size} onChange={e => setSize(e.target.value)} style={{
              width: '100%',
              padding: '0.6rem',
              borderRadius: '4px',
              border: '1px solid #ddd',
            }}>
              <option value="">Select</option>
              {product.sizes.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div style={{ marginTop: '1rem' }}>
            <label>Quantity:</label>
            <input
              type="number"
              min="1"
              value={qty}
              onChange={e => setQty(Math.max(1, parseInt(e.target.value) || 1))}
              style={{ width: '80px', padding: '0.4rem', marginLeft: '0.5rem' }}
            />
          </div>

          <button onClick={addToCart} style={{ marginTop: '1.5rem' }} className="btn">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
