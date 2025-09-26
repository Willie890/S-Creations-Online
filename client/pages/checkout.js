// client/pages/checkout.js
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Checkout() {
  const [delivery, setDelivery] = useState('');
  const [payment, setPayment] = useState('');
  const router = useRouter();

  const placeOrder = async () => {
    const token = localStorage.getItem('token');
    if (!token || !delivery || !payment) return alert('Complete all fields.');

    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ delivery, payment }),
    });

    if (res.ok) {
      router.push('/order-confirmation');
    } else {
      alert('Order failed');
    }
  };

  return (
    <div className="container" style={{ padding: '3rem 0' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>Checkout</h1>

      <div style={{ marginBottom: '2rem', padding: '1.5rem', backgroundColor: 'white', borderRadius: '8px' }}>
        <h3>📦 Delivery</h3>
        {['Standard (3-5 days)', 'Express (1-2 days)'].map(opt => (
          <label key={opt} style={{ display: 'block', margin: '0.5rem 0' }}>
            <input
              type="radio"
              name="delivery"
              checked={delivery === opt}
              onChange={() => setDelivery(opt)}
            /> {opt}
          </label>
        ))}
      </div>

      <div style={{ marginBottom: '2rem', padding: '1.5rem', backgroundColor: 'white', borderRadius: '8px' }}>
        <h3>💳 Payment</h3>
        {['Credit Card', 'PayPal'].map(opt => (
          <label key={opt} style={{ display: 'block', margin: '0.5rem 0' }}>
            <input
              type="radio"
              name="payment"
              checked={payment === opt}
              onChange={() => setPayment(opt)}
            /> {opt}
          </label>
        ))}
      </div>

      <button onClick={placeOrder} className="btn" style={{ width: '100%' }}>
        Place Order
      </button>
    </div>
  );
}
