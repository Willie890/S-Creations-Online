import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import styled from 'styled-components';
import { theme } from '../styles/theme';
import Layout from '../components/Layout';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import CheckoutForm from '../components/CheckoutForm';
import OrderSummary from '../components/OrderSummary';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function CheckoutPage() {
  const { user } = useAuth();
  const { cart, cartTotal, clearCart } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    if (cart.length === 0 && !orderSuccess) {
      router.push('/shop');
    }
  }, [cart, orderSuccess, router]);

  const handleSubmit = async (formData) => {
    setLoading(true);
    try {
      const orderData = {
        items: cart.map(item => ({
          product: item._id,
          quantity: item.quantity,
          price: item.price
        })),
        shippingAddress: formData,
        total: cartTotal,
        paymentMethod: formData.paymentMethod
      };

      const res = await axios.post('/orders', orderData);
      setOrderDetails(res.data.order);
      clearCart();
      setOrderSuccess(true);
    } catch (err) {
      console.error('Checkout error:', err);
      alert('There was an error processing your order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (orderSuccess) {
    return (
      <Layout>
        <SuccessContainer>
          <SuccessIcon>🎉</SuccessIcon>
          <SuccessTitle>Thank You for Your Order!</SuccessTitle>
          <SuccessMessage>
            Your order has been placed successfully. Order number: 
            <OrderNumber>#{orderDetails.orderNumber}</OrderNumber>
          </SuccessMessage>
          
          <OrderDetails>
            <h3>Order Summary</h3>
            {orderDetails.items.map((item, index) => (
              <OrderItem key={index}>
                <ProductInfo>
                  <ProductName>{item.product.name}</ProductName>
                  <ProductMeta>Qty: {item.quantity} × ${item.price}</ProductMeta>
                </ProductInfo>
                <ProductTotal>${(item.quantity * item.price).toFixed(2)}</ProductTotal>
              </OrderItem>
            ))}
            <OrderTotal>
              <span>Total:</span>
              <span>${orderDetails.total.toFixed(2)}</span>
            </OrderTotal>
          </OrderDetails>

          <ShippingInfo>
            <h4>Shipping Address</h4>
            <p>{orderDetails.shippingAddress.name}</p>
            <p>{orderDetails.shippingAddress.email}</p>
            <p>{orderDetails.shippingAddress.phone}</p>
            <p>{orderDetails.shippingAddress.address}</p>
            <p>{orderDetails.shippingAddress.city}, {orderDetails.shippingAddress.state} {orderDetails.shippingAddress.zipCode}</p>
          </ShippingInfo>

          <ActionButtons>
            <Button onClick={() => router.push('/shop')}>
              Continue Shopping
            </Button>
            <Button secondary onClick={() => router.push('/orders')}>
              View My Orders
            </Button>
          </ActionButtons>
        </SuccessContainer>
      </Layout>
    );
  }

  return (
    <Layout>
      <CheckoutContainer>
        <PageHeader>
          <h1>Checkout</h1>
          <Breadcrumb>Home → Cart → Checkout</Breadcrumb>
        </PageHeader>

        {loading ? (
          <LoadingContainer>
            <LoadingSpinner />
            <p>Processing your order...</p>
          </LoadingContainer>
        ) : (
          <CheckoutGrid>
            <CheckoutForm 
              onSubmit={handleSubmit} 
              loading={loading}
              user={user}
            />
            <OrderSummary cart={cart} total={cartTotal} />
          </CheckoutGrid>
        )}
      </CheckoutContainer>
    </Layout>
  );
}

const CheckoutContainer = styled.div`
  padding: ${theme.spacing.xl};
  max-width: 1200px;
  margin: 0 auto;
`;

const PageHeader = styled.div`
  text-align: center;
  margin-bottom: ${theme.spacing.xl};

  h1 {
    color: ${theme.colors.dark};
    margin-bottom: ${theme.spacing.sm};
  }
`;

const Breadcrumb = styled.p`
  color: ${theme.colors.gray[600]};
  font-size: 0.9rem;
`;

const CheckoutGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: ${theme.spacing.xl};
  margin-top: ${theme.spacing.xl};

  @media (max-width: ${theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

const LoadingContainer = styled.div`
  text-align: center;
  padding: ${theme.spacing.xxl};

  p {
    margin-top: ${theme.spacing.md};
    color: ${theme.colors.gray[600]};
  }
`;

const SuccessContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: ${theme.spacing.xl};
  text-align: center;
`;

const SuccessIcon = styled.div`
  font-size: 4rem;
  margin-bottom: ${theme.spacing.lg};
`;

const SuccessTitle = styled.h1`
  color: ${theme.colors.success};
  margin-bottom: ${theme.spacing.md};
`;

const SuccessMessage = styled.p`
  font-size: 1.1rem;
  color: ${theme.colors.gray[700]};
  margin-bottom: ${theme.spacing.xl};
`;

const OrderNumber = styled.span`
  display: block;
  font-weight: bold;
  color: ${theme.colors.primary};
  font-size: 1.2rem;
  margin-top: ${theme.spacing.sm};
`;

const OrderDetails = styled.div`
  background: ${theme.colors.white};
  border-radius: 12px;
  padding: ${theme.spacing.xl};
  margin: ${theme.spacing.xl} 0;
  box-shadow: ${theme.shadows.md};
`;

const OrderItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${theme.spacing.md} 0;
  border-bottom: 1px solid ${theme.colors.gray[200]};

  &:last-child {
    border-bottom: none;
  }
`;

const ProductInfo = styled.div`
  flex: 1;
`;

const ProductName = styled.h4`
  margin: 0;
  color: ${theme.colors.dark};
`;

const ProductMeta = styled.p`
  margin: 0;
  color: ${theme.colors.gray[600]};
  font-size: 0.9rem;
`;

const ProductTotal = styled.div`
  font-weight: 600;
  color: ${theme.colors.primary};
`;

const OrderTotal = styled.div`
  display: flex;
  justify-content: space-between;
  padding: ${theme.spacing.md} 0;
  font-weight: bold;
  font-size: 1.2rem;
  border-top: 2px solid ${theme.colors.gray[300]};
  margin-top: ${theme.spacing.md};
`;

const ShippingInfo = styled.div`
  background: ${theme.colors.gray[100]};
  border-radius: 8px;
  padding: ${theme.spacing.lg};
  margin: ${theme.spacing.xl} 0;

  h4 {
    color: ${theme.colors.dark};
    margin-bottom: ${theme.spacing.md};
  }

  p {
    margin: ${theme.spacing.xs} 0;
    color: ${theme.colors.gray[700]};
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  justify-content: center;
  margin-top: ${theme.spacing.xl};

  @media (max-width: ${theme.breakpoints.mobile}) {
    flex-direction: column;
  }
`;

const Button = styled.button`
  padding: 1rem 2rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  ${props => props.secondary ? `
    background: transparent;
    color: ${theme.colors.primary};
    border: 2px solid ${theme.colors.primary};

    &:hover {
      background: ${theme.colors.primary};
      color: white;
    }
  ` : `
    background: ${theme.colors.primary};
    color: white;

    &:hover {
      background: ${theme.colors.secondary};
    }
  `}
`;
