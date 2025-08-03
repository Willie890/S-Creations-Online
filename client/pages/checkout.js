import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import styled from 'styled-components'
import { theme } from '../styles/theme'
import Layout from '../components/Layout'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import CheckoutForm from '../components/CheckoutForm'
import OrderSummary from '../components/OrderSummary'

export default function CheckoutPage() {
  const { user } = useAuth()
  const { cart, cartTotal, clearCart } = useCart()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [orderSuccess, setOrderSuccess] = useState(false)
  const [orderDetails, setOrderDetails] = useState(null)

  useEffect(() => {
    if (cart.length === 0 && !orderSuccess) {
      router.push('/shop')
    }
  }, [cart, orderSuccess, router])

  const handleSubmit = async (formData) => {
    setLoading(true)
    try {
      const orderData = {
        user: user?._id || null,
        items: cart.map(item => ({
          product: item._id,
          quantity: item.quantity,
          price: item.price
        })),
        shippingAddress: formData,
        total: cartTotal
      }

      const res = await axios.post('/api/orders', orderData)
      setOrderDetails(res.data)
      clearCart()
      setOrderSuccess(true)
    } catch (err) {
      console.error('Checkout error:', err)
      alert('There was an error processing your order. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (orderSuccess) {
    return (
      <Layout>
        <SuccessContainer>
          <h1>Thank You for Your Order!</h1>
          <p>Your order number is: #{orderDetails.orderNumber}</p>
          <p>We've sent a confirmation email to {orderDetails.shippingAddress.email}</p>
          
          <OrderDetails>
            <h2>Order Summary</h2>
            {orderDetails.items.map(item => (
              <OrderItem key={item._id}>
                <div>
                  <h3>{item.product.name}</h3>
                  <p>Qty: {item.quantity}</p>
                </div>
                <p>${(item.product.price * item.quantity).toFixed(2)}</p>
              </OrderItem>
            ))}
            <Total>
              <span>Total:</span>
              <span>${orderDetails.total.toFixed(2)}</span>
            </Total>
          </OrderDetails>

          <Button onClick={() => router.push('/shop')}>
            Continue Shopping
          </Button>
        </SuccessContainer>
      </Layout>
    )
  }

  return (
    <Layout>
      <CheckoutContainer>
        <h1>Checkout</h1>
        <CheckoutGrid>
          <CheckoutForm 
            onSubmit={handleSubmit} 
            loading={loading}
            user={user}
          />
          <OrderSummary cart={cart} total={cartTotal} />
        </CheckoutGrid>
      </CheckoutContainer>
    </Layout>
  )
}

const CheckoutContainer = styled.div`
  padding: 2rem;
  background-color: ${theme.colors.light};
`

const CheckoutGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 2rem;
  margin-top: 2rem;

  @media (max-width: ${theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`

const SuccessContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
  background-color: ${theme.colors.light};
  border-radius: 8px;

  h1 {
    color: ${theme.colors.secondary};
    margin-bottom: 1rem;
  }
`

const OrderDetails = styled.div`
  margin: 2rem 0;
  padding: 1.5rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
`

const OrderItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 1rem 0;
  border-bottom: 1px solid #eee;

  h3 {
    margin-bottom: 0.5rem;
    font-size: 1rem;
  }
`

const Total = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 1rem 0;
  font-weight: bold;
  font-size: 1.2rem;
`
