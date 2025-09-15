import { useState } from 'react';
import styled from 'styled-components';
import { theme } from '../styles/theme';
import Button from './common/Button';

export default function CheckoutForm({ onSubmit, loading, user }) {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    paymentMethod: 'card'
  });

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <FormSection>
        <h3>Shipping Information</h3>
        <FormGrid>
          <FormGroup>
            <label>Full Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </FormGroup>
          <FormGroup>
            <label>Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </FormGroup>
          <FormGroup>
            <label>Phone Number *</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </FormGroup>
          <FormGroup fullWidth>
            <label>Address *</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </FormGroup>
          <FormGroup>
            <label>City *</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
            />
          </FormGroup>
          <FormGroup>
            <label>State *</label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              required
            />
          </FormGroup>
          <FormGroup>
            <label>ZIP Code *</label>
            <input
              type="text"
              name="zipCode"
              value={formData.zipCode}
              onChange={handleChange}
              required
            />
          </FormGroup>
          <FormGroup>
            <label>Country *</label>
            <select
              name="country"
              value={formData.country}
              onChange={handleChange}
              required
            >
              <option value="United States">United States</option>
              <option value="Canada">Canada</option>
              <option value="United Kingdom">United Kingdom</option>
            </select>
          </FormGroup>
        </FormGrid>
      </FormSection>

      <FormSection>
        <h3>Payment Method</h3>
        <PaymentMethods>
          <PaymentMethod>
            <input
              type="radio"
              name="paymentMethod"
              value="card"
              checked={formData.paymentMethod === 'card'}
              onChange={handleChange}
            />
            <span>Credit/Debit Card</span>
          </PaymentMethod>
          <PaymentMethod>
            <input
              type="radio"
              name="paymentMethod"
              value="paypal"
              checked={formData.paymentMethod === 'paypal'}
              onChange={handleChange}
            />
            <span>PayPal</span>
          </PaymentMethod>
          <PaymentMethod>
            <input
              type="radio"
              name="paymentMethod"
              value="bank_transfer"
              checked={formData.paymentMethod === 'bank_transfer'}
              onChange={handleChange}
            />
            <span>Bank Transfer</span>
          </PaymentMethod>
        </PaymentMethods>
      </FormSection>

      <SubmitButton>
        <Button type="submit" primary fullWidth disabled={loading}>
          {loading ? 'Processing...' : 'Place Order'}
        </Button>
      </SubmitButton>
    </Form>
  );
}

const Form = styled.form`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: ${theme.shadows.md};
`;

const FormSection = styled.div`
  margin-bottom: 2rem;

  h3 {
    color: ${theme.colors.dark};
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid ${theme.colors.gray[200]};
  }
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
`;

const FormGroup = styled.div`
  grid-column: ${props => props.fullWidth ? '1 / -1' : 'auto'};

  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
    color: ${theme.colors.dark};
  }

  input, select {
    width: 100%;
    padding: 0.75rem;
    border: 2px solid ${theme.colors.gray[300]};
    border-radius: 6px;
    font-size: 1rem;

    &:focus {
      outline: none;
      border-color: ${theme.colors.primary};
    }
  }
`;

const PaymentMethods = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const PaymentMethod = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  border: 2px solid ${theme.colors.gray[300]};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${theme.colors.primary};
  }

  input[type="radio"]:checked + & {
    border-color: ${theme.colors.primary};
    background-color: ${theme.colors.primary}10;
  }
