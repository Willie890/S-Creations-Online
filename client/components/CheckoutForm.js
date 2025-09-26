// client/components/CheckoutForm.js
'use client';

import { useState } from 'react';
import theme from '../styles/theme';

export default function CheckoutForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.cardNumber.trim()) newErrors.cardNumber = 'Card number is required';
    if (formData.cardNumber.replace(/\s/g, '').length !== 16)
      newErrors.cardNumber = 'Card number must be 16 digits';
    if (!formData.expiry.trim()) newErrors.expiry = 'Expiry is required';
    if (!/^\d{2}\/\d{2}$/.test(formData.expiry)) newErrors.expiry = 'Format: MM/YY';
    if (!formData.cvv.trim()) newErrors.cvv = 'CVV is required';
    if (formData.cvv.length !== 3) newErrors.cvv = 'CVV must be 3 digits';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: theme.spacing.md, backgroundColor: 'white', borderRadius: theme.borderRadius.md, boxShadow: theme.shadows.sm }}>
      <h2 style={{ marginBottom: theme.spacing.md }}>Payment Details</h2>
      
      <div style={{ marginBottom: theme.spacing.md }}>
        <label style={{ display: 'block', marginBottom: theme.spacing.xs }}>Full Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          style={{ width: '100%', padding: theme.spacing.sm, border: `1px solid ${theme.colors.secondary}`, borderRadius: theme.borderRadius.sm }}
        />
        {errors.name && <p style={{ color: theme.colors.danger, fontSize: '0.875rem' }}>{errors.name}</p>}
      </div>

      <div style={{ marginBottom: theme.spacing.md }}>
        <label style={{ display: 'block', marginBottom: theme.spacing.xs }}>Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          style={{ width: '100%', padding: theme.spacing.sm, border: `1px solid ${theme.colors.secondary}`, borderRadius: theme.borderRadius.sm }}
        />
        {errors.email && <p style={{ color: theme.colors.danger, fontSize: '0.875rem' }}>{errors.email}</p>}
      </div>

      <div style={{ marginBottom: theme.spacing.md }}>
        <label style={{ display: 'block', marginBottom: theme.spacing.xs }}>Card Number</label>
        <input
          type="text"
          name="cardNumber"
          value={formData.cardNumber}
          onChange={handleChange}
          placeholder="1234 5678 9012 3456"
          maxLength={19}
          style={{ width: '100%', padding: theme.spacing.sm, border: `1px solid ${theme.colors.secondary}`, borderRadius: theme.borderRadius.sm }}
        />
        {errors.cardNumber && <p style={{ color: theme.colors.danger, fontSize: '0.875rem' }}>{errors.cardNumber}</p>}
      </div>

      <div style={{ display: 'flex', gap: theme.spacing.sm, marginBottom: theme.spacing.md }}>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', marginBottom: theme.spacing.xs }}>Expiry (MM/YY)</label>
          <input
            type="text"
            name="expiry"
            value={formData.expiry}
            onChange={handleChange}
            placeholder="MM/YY"
            maxLength={5}
            style={{ width: '100%', padding: theme.spacing.sm, border: `1px solid ${theme.colors.secondary}`, borderRadius: theme.borderRadius.sm }}
          />
          {errors.expiry && <p style={{ color: theme.colors.danger, fontSize: '0.875rem' }}>{errors.expiry}</p>}
        </div>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', marginBottom: theme.spacing.xs }}>CVV</label>
          <input
            type="text"
            name="cvv"
            value={formData.cvv}
            onChange={handleChange}
            placeholder="123"
            maxLength={3}
            style={{ width: '100%', padding: theme.spacing.sm, border: `1px solid ${theme.colors.secondary}`, borderRadius: theme.borderRadius.sm }}
          />
          {errors.cvv && <p style={{ color: theme.colors.danger, fontSize: '0.875rem' }}>{errors.cvv}</p>}
        </div>
      </div>

      <button
        type="submit"
        style={{
          backgroundColor: theme.colors.primary,
          color: 'white',
          border: 'none',
          padding: theme.spacing.md,
          borderRadius: theme.borderRadius.sm,
          cursor: 'pointer',
          width: '100%',
          fontSize: '1rem',
          fontWeight: 'bold',
        }}
      >
        Complete Purchase
      </button>
    </form>
  );
}
