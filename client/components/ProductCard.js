// client/components/ProductCard.js
'use client';

import { useCart } from '../context/CartContext';
import theme from '../styles/theme';

export default function ProductCard({ product }) {
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
    });
  };

  return (
    <div
      style={{
        border: `1px solid ${theme.colors.secondary}`,
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.md,
        backgroundColor: theme.colors.light,
        boxShadow: theme.shadows.sm,
      }}
    >
      <img
        src={product.image || '/placeholder.jpg'}
        alt={product.name}
        style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: theme.borderRadius.sm }}
      />
      <h3 style={{ marginTop: theme.spacing.sm, fontSize: '1.2rem' }}>{product.name}</h3>
      <p style={{ color: theme.colors.primary, fontWeight: 'bold' }}>${product.price.toFixed(2)}</p>
      <button
        onClick={handleAddToCart}
        style={{
          backgroundColor: theme.colors.primary,
          color: 'white',
          border: 'none',
          padding: theme.spacing.sm,
          borderRadius: theme.borderRadius.sm,
          cursor: 'pointer',
          marginTop: theme.spacing.sm,
          width: '100%',
        }}
      >
        Add to Cart
      </button>
    </div>
  );
}
