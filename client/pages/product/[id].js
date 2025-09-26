// client/pages/product/[id].js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { API_BASE } from '../../utils/api';

export default function ProductPage() {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState(null);
  const [size, setSize] = useState('');
  const [qty, setQty] = useState(1);

  useEffect(() => {
    if (!id) return;
    fetch(`${API_BASE}/api/products/${id}`)
      .then(res => res.json())
      .then(setProduct)
      .catch(() => alert('Product not found'));
  }, [id]);

  const addToCart = async () => {
    const token = localStorage.getItem('token');
    if (!token) return alert('Please log in to add to cart.');

    try {
      const res = await fetch(`${API_BASE}/api/cart`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ productId: id, size, qty }),
      });
      if (res.ok) {
        alert('Added to cart!');
        router.push('/cart');
      } else {
        const err = await res.json();
        alert(err.message || 'Failed to add to cart');
      }
    } catch (err) {
      alert('Network error');
    }
  };

  if (!product) return <p style={{ textAlign: 'center', padding: '3rem' }}>Loading...</p>;

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
