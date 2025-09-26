// client/pages/order-confirmation.js
import { useEffect, useState } from 'react';

export default function Confirmation() {
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const o = localStorage.getItem('lastOrder');
    if (o) setOrder(JSON.parse(o));
  }, []);

  if (!order) return <p>Loading...</p>;

  return (
    <div className="container" style={{ padding: '3rem 0', textAlign: 'center' }}>
      <h1>Thank You!</h1>
      <p>Your order has been placed.</p>
      <p>Order ID: <strong>SC-{Date.now().toString().slice(-6)}</strong></p>
      <p>Status: <span style={{ color: '#A8B69D' }}>{order.status}</span></p>
      
      <div style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: 'white', borderRadius: '8px', display: 'inline-block' }}>
        <h3>📦 Track Your Order</h3>
        <p>Once shipped, you’ll receive a tracking link via email.</p>
        <a href="/shop" className="btn" style={{ marginTop: '1rem' }}>Continue Shopping</a>
      </div>
    </div>
  );
}
