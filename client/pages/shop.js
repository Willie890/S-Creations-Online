// pages/shop.js
import { useState } from 'react';
import Link from 'next/link';
import { products } from '../utils/products';

export default function ShopPage() {
  const [filterCategory, setFilterCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const filteredProducts = products.filter(product => {
    const matchesCategory = !filterCategory || product.category === filterCategory;
    const matchesMin = !minPrice || product.price >= parseFloat(minPrice);
    const matchesMax = !maxPrice || product.price <= parseFloat(maxPrice);
    return matchesCategory && matchesMin && matchesMax;
  });

  return (
    <div style={{
      padding: '2rem',
      backgroundColor: '#E6D5F0',
      fontFamily: 'Arial, sans-serif',
    }}>
      <h1 style={{ color: '#4A6B3A', textAlign: 'center' }}>🛍️ Our Collection</h1>

      {/* Filters */}
      <div style={{
        marginBottom: '2rem',
        padding: '1rem',
        backgroundColor: 'white',
        borderRadius: '10px',
        display: 'flex',
        gap: '1rem',
        flexWrap: 'wrap',
        alignItems: 'center',
      }}>
        <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} style={{
          padding: '0.5rem',
          borderRadius: '5px',
          border: '1px solid #ccc'
        }}>
          <option value="">All Categories</option>
          <option value="Accessories">Accessories</option>
          <option value="Jewelry">Jewelry</option>
          <option value="Home">Home</option>
        </select>

        <input
          type="number"
          placeholder="Min Price"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          style={{ padding: '0.5rem', borderRadius: '5px', border: '1px solid #ccc' }}
        />
        <input
          type="number"
          placeholder="Max Price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          style={{ padding: '0.5rem', borderRadius: '5px', border: '1px solid #ccc' }}
        />
      </div>

      {/* Product Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '1.5rem',
      }}>
        {filteredProducts.map(product => (
          <div key={product.id} style={{
            backgroundColor: 'white',
            borderRadius: '10px',
            overflow: 'hidden',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            transition: 'transform 0.3s',
          }}>
            <img src={product.image} alt={product.name} style={{
              width: '100%',
              height: '200px',
              objectFit: 'cover',
            }} />
            <div style={{ padding: '1rem' }}>
              <h3 style={{ color: '#4A6B3A', margin: '0 0 0.5rem' }}>{product.name}</h3>
              <p style={{ color: '#D8B4E2', fontWeight: 'bold', margin: '0 0 1rem' }}>${product.price}</p>
              <Link href={`/product/${product.id}`} passHref>
                <button style={{
                  width: '100%',
                  padding: '0.5rem',
                  backgroundColor: '#4A6B3A',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                }}>
                  View Details
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
