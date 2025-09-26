// pages/order-confirmation.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function OrderConfirmationPage() {
  const router = useRouter();
  const { orderId } = router.query;
  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (orderId) {
      const savedOrder = JSON.parse(localStorage.getItem('lastOrder'));
      if (savedOrder?.id === parseInt(orderId)) {
        setOrder(savedOrder);
      }
    }
  }, [orderId]);

  if (!order) return <p>Loading...</p>;

  const trackingLink = `https://example.com/track/${order.id}`;

  return (
    <div style={{
      padding: '2rem',
      backgroundColor: '#E6D5F0',
      fontFamily: 'Arial, sans-serif',
      textAlign: 'center',
    }}>
      <h1 style={{ color: '#4A6B3A' }}>🎉 Thank You for Your Order!</h1>
      <p>Your order #{order.id} has been successfully placed.</p>
      <p>Status: <strong>{order.status}</strong></p>
      <p>Delivery: {order.delivery}</p>
      <p>Payment: {order.payment}</p>

      <div style={{
        marginTop: '2rem',
        padding: '1rem',
        backgroundColor: 'white',
        borderRadius: '10px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      }}>
        <h2 style={{ color: '#4A6B3A' }}>📦 Track Your Order</h2>
        <p>You can track your order using the link below:</p>
        <a
          href={trackingLink}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-block',
            padding: '0.5rem 1rem',
            backgroundColor: '#4A6B3A',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '8px',
            marginTop: '0.5rem',
          }}
        >
          Track Order →
        </a>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <a
          href="/shop"
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#D8B4E2',
            color: '#4A6B3A',
            textDecoration: 'none',
            borderRadius: '8px',
            display: 'inline-block',
            marginRight: '1rem',
          }}
        >
          Continue Shopping
        </a>
        <a
          href="/cart"
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#4A6B3A',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '8px',
            display: 'inline-block',
          }}
        >
          View Cart
        </a>
      </div>
    </div>
  );
}
