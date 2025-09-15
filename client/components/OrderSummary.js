import styled from 'styled-components';
import { theme } from '../styles/theme';
import { useCart } from '../context/CartContext';

export default function OrderSummary({ cart, total }) {
  const shipping = total > 50 ? 0 : 10;
  const tax = total * 0.08; // 8% tax
  const finalTotal = total + shipping + tax;

  return (
    <SummaryContainer>
      <SummaryHeader>
        <h3>Order Summary</h3>
      </SummaryHeader>

      <OrderItems>
        {cart.map(item => (
          <OrderItem key={item._id}>
            <ItemImage 
              src={item.images[0]} 
              alt={item.name}
              onError={(e) => {
                e.target.src = '/placeholder-image.jpg';
              }}
            />
            <ItemDetails>
              <ItemName>{item.name}</ItemName>
              <ItemPrice>${item.price.toFixed(2)} × {item.quantity}</ItemPrice>
            </ItemDetails>
            <ItemTotal>${(item.price * item.quantity).toFixed(2)}</ItemTotal>
          </OrderItem>
        ))}
      </OrderItems>

      <SummaryTotals>
        <TotalRow>
          <span>Subtotal</span>
          <span>${total.toFixed(2)}</span>
        </TotalRow>
        <TotalRow>
          <span>Shipping</span>
          <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
        </TotalRow>
        <TotalRow>
          <span>Tax</span>
          <span>${tax.toFixed(2)}</span>
        </TotalRow>
        <TotalRow grandTotal>
          <span>Total</span>
          <span>${finalTotal.toFixed(2)}</span>
        </TotalRow>
      </SummaryTotals>

      {shipping === 0 ? (
        <FreeShipping>
          🎉 You qualify for free shipping!
        </FreeShipping>
      ) : (
        <ShippingNote>
          Add ${(50 - total).toFixed(2)} more for free shipping
        </ShippingNote>
      )}
    </SummaryContainer>
  );
}

const SummaryContainer = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: ${theme.shadows.md};
  height: fit-content;
  position: sticky;
  top: 100px;
`;

const SummaryHeader = styled.div`
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid ${theme.colors.gray[200]};

  h3 {
    color: ${theme.colors.dark};
    margin: 0;
  }
`;

const OrderItems = styled.div`
  margin-bottom: 1.5rem;
  max-height: 300px;
  overflow-y: auto;
`;

const OrderItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 0;
  border-bottom: 1px solid ${theme.colors.gray[200]};

  &:last-child {
    border-bottom: none;
  }
`;

const ItemImage = styled.img`
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 6px;
`;

const ItemDetails = styled.div`
  flex: 1;
`;

const ItemName = styled.div`
  font-weight: 600;
  color: ${theme.colors.dark};
  margin-bottom: 0.25rem;
`;

const ItemPrice = styled.div`
  color: ${theme.colors.gray[600]};
  font-size: 0.9rem;
`;

const ItemTotal = styled.div`
  font-weight: 600;
  color: ${theme.colors.primary};
`;

const SummaryTotals = styled.div`
  margin-bottom: 1rem;
`;

const TotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  font-weight: ${props => props.grandTotal ? 'bold' : 'normal'};
  font-size: ${props => props.grandTotal ? '1.1rem' : '1rem'};
  color: ${props => props.grandTotal ? theme.colors.primary : 'inherit'};
  border-top: ${props => props.grandTotal ? '2px solid #333' : 'none'};
  margin-top: ${props => props.grandTotal ? '0.5rem' : '0'};
`;

const FreeShipping = styled.div`
  background: ${theme.colors.success}20;
  color: ${theme.colors.success};
  padding: 0.75rem;
  border-radius: 6px;
  text-align: center;
  font-weight: 600;
  margin-top: 1rem;
`;

const ShippingNote = styled.div`
  background: ${theme.colors.warning}20;
  color: ${theme.colors.warning};
  padding: 0.75rem;
  border-radius: 6px;
  text-align: center;
  font-size: 0.9rem;
  margin-top: 1rem;
`;
