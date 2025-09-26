// pages/product/[id].js
import { useState } from 'react';
import { useRouter } from 'next/router';
import { products } from '../../utils/products';

export default function ProductPage() {
  const router = useRouter();
  const { id } = router.query;
  const product = products.find(p => p.id === parseInt(id));

  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);

  if (!product) return <p>Loading...</p>;

  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find(item => item.id === product.id && item.size === selectedSize);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({ ...product, size: selectedSize, quantity });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`Added ${quantity}x ${product.name} (${selectedSize}) to cart!`);
  };

  return (
    <div style={{
      padding: '2rem',
      backgroundColor: '#E6D5F0',
      fontFamily: 'Arial, sans-serif',
    }}>
      <Link href="/shop" style={{ color: '#4A6B3A', textDecoration: 'underline' }}>← Back to Shop</Link>
      <div style={{
        display: 'flex',
        gap: '2rem',
        marginTop: '1rem',
        flexWrap: 'wrap',
      }}>
        <img src={product.image} alt={product.name} style={{
          width: '300px',
          height: '300px',
          objectFit: 'cover',
          borderRadius: '10px',
        }} />
        <div style={{
          flex: 1,
          minWidth: '300px',
        }}>
          <h1 style={{ color: '#4A6B3A' }}>{product.name}</h1>
          <p style={{ color: '#D8B4E2', fontWeight: 'bold', fontSize: '1.2rem' }}>${product.price}</p>
          <p>{product.description}</p>

          <div style={{ marginTop: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Select Size:</label>
            <select value={selectedSize} onChange={(e) => setSelectedSize(e.target.value)} style={{
              padding: '0.5rem',
              borderRadius: '5px',
              border: '1px solid #ccc',
              width: '100%',
            }}>
              <option value="">Choose a size</option>
              {product.sizes.map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </div>

          <div style={{ marginTop: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Quantity:</label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              style={{
                width: '100px',
                padding: '0.5rem',
                borderRadius: '5px',
                border: '1px solid #ccc',
              }}
            />
          </div>

          <button
            onClick={addToCart}
            disabled={!selectedSize}
            style={{
              marginTop: '1rem',
              padding: '0.75rem 1.5rem',
              backgroundColor: '#4A6B3A',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              opacity: selectedSize ? 1 : 0.5,
            }}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
