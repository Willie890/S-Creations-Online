// client/components/OrderSummary.js
'use client';

import { useCart } from '../context/CartContext';
import theme from '../styles/theme';

export default function OrderSummary() {
  const { items, totalAmount } = useCart();

  return (
    <div
      style={{
        backgroundColor: theme.colors.light,
        padding: theme.spacing.md,
        borderRadius: theme.borderRadius.md,
        boxShadow: theme.shadows.sm,
      }}
    >
      <h3 style={{ marginBottom: theme.spacing.md }}>Order Summary</h3>
      <div style={{ marginBottom: theme.spacing.md }}>
        {items.map((item) => (
          <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: theme.spacing.sm }}>
            <span>{item.name} × {item.quantity}</span>
            <span>${(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
      </div>
      <div style={{ borderTop: `1px solid ${theme.colors.secondary}`, paddingTop: theme.spacing.sm }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <strong>Total:</strong>
          <strong>${totalAmount.toFixed(2)}</strong>
        </div>
      </div>
    </div>
  );
}
