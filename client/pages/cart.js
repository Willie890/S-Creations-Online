// pages/cart.js
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CartPage() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(savedCart);
  }, []);

  const removeFromCart = (index) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const updateQuantity = (index, newQty) => {
    const newCart = [...cart];
    newCart[index].quantity = newQty;
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div style={{
      padding: '2rem',
      backgroundColor: '#E6D5F0',
      fontFamily: 'Arial, sans-serif',
    }}>
      <h1 style={{ color: '#4A6B3A', textAlign: 'center' }}>🛒 Your Cart</h1>

      {cart.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#4A6B3A' }}>Your cart is empty.</p>
      ) : (
        <>
          <div style={{
            display: 'grid',
            gap: '1rem',
            marginBottom: '2rem',
          }}>
            {cart.map((item, index) => (
              <div key={index} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '1rem',
                backgroundColor: 'white',
                borderRadius: '10px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              }}>
                <img src={item.image} alt={item.name} style={{
                  width: '80px',
                  height: '80px',
                  objectFit: 'cover',
                  borderRadius: '5px',
                }} />
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: '0', color: '#4A6B3A' }}>{item.name}</h3>
                  <p style={{ margin: '0.25rem 0', color: '#D8B4E2' }}>Size: {item.size}</p>
                  <p style={{ margin: '0.25rem 0', color: '#4A6B3A' }}>${item.price} x {item.quantity}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateQuantity(index, parseInt(e.target.value))}
                    style={{
                      width: '60px',
                      padding: '0.25rem',
                      borderRadius: '5px',
                      border: '1px solid #ccc',
                    }}
                  />
                  <button
                    onClick={() => removeFromCart(index)}
                    style={{
                      padding: '0.25rem 0.5rem',
                      backgroundColor: '#D8B4E2',
                      color: '#4A6B3A',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer',
                    }}
                  >
                    ✖
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1rem',
            backgroundColor: 'white',
            borderRadius: '10px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}>
            <strong>Total: ${total.toFixed(2)}</strong>
            <Link href="/checkout" passHref>
              <button style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#4A6B3A',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
              }}>
                Proceed to Checkout
              </button>
            </Link>
          </div>
        </>
      )}

      <Link href="/shop" style={{ display: 'block', textAlign: 'center', marginTop: '1rem', color: '#4A6B3A', textDecoration: 'underline' }}>
        Continue Shopping
      </Link>
    </div>
  );
}
