// client/pages/cart.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function Cart() {
  const [cart, setCart] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const temp = localStorage.getItem('tempCart');
    if (temp) setCart(JSON.parse(temp));
  }, []);

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const checkout = () => {
    if (cart.length === 0) return;
    // In real app: POST to /api/checkout
    localStorage.setItem('checkoutCart', JSON.stringify(cart));
    router.push('/checkout');
  };

  return (
    <div className="container" style={{ padding: '3rem 0' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>Your Cart</h1>
      {cart.length === 0 ? (
        <p style={{ textAlign: 'center' }}>Your cart is empty.</p>
      ) : (
        <>
          {cart.map((item, i) => (
            <div key={i} style={{
              display: 'flex',
              gap: '1.5rem',
              padding: '1.5rem',
              borderBottom: '1px solid #eee',
            }}>
              <img src={item.image} alt={item.name} style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
              <div style={{ flex: 1 }}>
                <h3>{item.name}</h3>
                <p>Size: {item.size} | Qty: {item.qty}</p>
                <p style={{ color: '#C9A9A6' }}>${(item.price * item.qty).toFixed(2)}</p>
              </div>
            </div>
          ))}
          <div style={{ textAlign: 'right', marginTop: '2rem' }}>
            <h3>Total: ${total.toFixed(2)}</h3>
            <button onClick={checkout} className="btn">Proceed to Checkout</button>
          </div>
        </>
      )}
    </div>
  );
}
