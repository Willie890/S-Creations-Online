// client/pages/checkout.js
'use client';

import { useState } from 'react';
import Layout from '../components/Layout';
import OrderSummary from '../components/OrderSummary';
import CheckoutForm from '../components/CheckoutForm';
import LoadingSpinner from '../components/common/LoadingSpinner';
import theme from '../styles/theme';

export default function Checkout() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleCheckout = async (formData) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsLoading(false);
    setIsSuccess(true);
    alert('Order placed successfully!');
  };

  if (isSuccess) {
    return (
      <Layout>
        <div style={{ textAlign: 'center', padding: theme.spacing.xl }}>
          <h1 style={{ fontSize: '2.5rem', color: theme.colors.success }}>🎉 Order Placed!</h1>
          <p style={{ fontSize: '1.2rem', marginTop: theme.spacing.md }}>
            Thank you for your purchase. You will receive a confirmation email shortly.
          </p>
          <button
            onClick={() => (window.location.href = '/')}
            style={{
              backgroundColor: theme.colors.primary,
              color: 'white',
              border: 'none',
              padding: theme.spacing.md,
              borderRadius: theme.borderRadius.sm,
              cursor: 'pointer',
              marginTop: theme.spacing.lg,
              fontSize: '1rem',
            }}
          >
            Continue Shopping
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: theme.spacing.xl, padding: theme.spacing.md }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: theme.spacing.lg }}>Checkout</h1>
          {isLoading ? (
            <div style={{ textAlign: 'center', padding: theme.spacing.xl }}>
              <LoadingSpinner size="lg" />
              <p style={{ marginTop: theme.spacing.md }}>Processing your payment...</p>
            </div>
          ) : (
            <CheckoutForm onSubmit={handleCheckout} />
          )}
        </div>
        <div>
          <OrderSummary />
        </div>
      </div>
    </Layout>
  );
}
