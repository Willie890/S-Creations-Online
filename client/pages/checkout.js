// pages/checkout.js
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function CheckoutPage() {
  const [deliveryOption, setDeliveryOption] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const router = useRouter();

  const handlePlaceOrder = () => {
    if (!deliveryOption || !paymentMethod) {
      alert("Please select delivery and payment options.");
      return;
    }

    // Simulate order creation
    const orderId = Math.floor(Math.random() * 10000);
    localStorage.setItem('lastOrder', JSON.stringify({
      id: orderId,
      date: new Date().toLocaleDateString(),
      delivery: deliveryOption,
      payment: paymentMethod,
      status: 'Processing',
    }));

    router.push(`/order-confirmation?orderId=${orderId}`);
  };

  return (
    <div style={{
      padding: '2rem',
      backgroundColor: '#E6D5F0',
      fontFamily: 'Arial, sans-serif',
    }}>
      <h1 style={{ color: '#4A6B3A', textAlign: 'center' }}>💳 Checkout</h1>

      {/* Delivery Options */}
      <div style={{
        marginBottom: '2rem',
        padding: '1rem',
        backgroundColor: 'white',
        borderRadius: '10px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      }}>
        <h2 style={{ color: '#4A6B3A' }}>📦 Delivery Options</h2>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {[
            { value: 'standard', label: 'Standard (3-5 days)', price: '$0.00' },
            { value: 'express', label: 'Express (1-2 days)', price: '$9.99' },
            { value: 'overnight', label: 'Overnight', price: '$19.99' },
          ].map(option => (
            <label key={option.value} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1rem',
              border: deliveryOption === option.value ? '2px solid #4A6B3A' : '1px solid #ccc',
              borderRadius: '8px',
              cursor: 'pointer',
              backgroundColor: deliveryOption === option.value ? '#D8B4E2' : 'white',
            }}>
              <input
                type="radio"
                name="delivery"
                value={option.value}
                checked={deliveryOption === option.value}
                onChange={() => setDeliveryOption(option.value)}
              />
              <span>{option.label} <strong>{option.price}</strong></span>
            </label>
          ))}
        </div>
      </div>

      {/* Payment Options */}
      <div style={{
        marginBottom: '2rem',
        padding: '1rem',
        backgroundColor: 'white',
        borderRadius: '10px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      }}>
        <h2 style={{ color: '#4A6B3A' }}>💳 Payment Method</h2>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {[
            { value: 'card', label: 'Credit/Debit Card' },
            { value: 'paypal', label: 'PayPal' },
            { value: 'applepay', label: 'Apple Pay' },
          ].map(option => (
            <label key={option.value} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1rem',
              border: paymentMethod === option.value ? '2px solid #4A6B3A' : '1px solid #ccc',
              borderRadius: '8px',
              cursor: 'pointer',
              backgroundColor: paymentMethod === option.value ? '#D8B4E2' : 'white',
            }}>
              <input
                type="radio"
                name="payment"
                value={option.value}
                checked={paymentMethod === option.value}
                onChange={() => setPaymentMethod(option.value)}
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      <button
        onClick={handlePlaceOrder}
        disabled={!deliveryOption || !paymentMethod}
        style={{
          width: '100%',
          padding: '0.75rem 1.5rem',
          backgroundColor: '#4A6B3A',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '1.1rem',
          opacity: deliveryOption && paymentMethod ? 1 : 0.5,
        }}
      >
        Place Order
      </button>
    </div>
  );
}
