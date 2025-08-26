import styled from 'styled-components';
import { theme } from '../styles/theme';
import { useCart } from '../context/CartContext';
import Button from './common/Button';

export default function Cart({ isOpen, onClose }) {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();

  if (!isOpen) return null;

  return (
    <CartOverlay onClick={onClose}>
      <CartContent onClick={(e) => e.stopPropagation()}>
        <CartHeader>
          <h2>Shopping Cart</h2>
          <CloseButton onClick={onClose}>×</CloseButton>
        </CartHeader>
        
        <CartItems>
          {cart.length === 0 ? (
            <EmptyCart>Your cart is empty</EmptyCart>
          ) : (
            cart.map(item => (
              <CartItem key={item._id}>
                <ItemImage src={item.images[0]} alt={item.name} />
                <ItemDetails>
                  <ItemName>{item.name}</ItemName>
                  <ItemPrice>${item.price.toFixed(2)}</ItemPrice>
                  <QuantityControls>
                    <Button onClick={() => updateQuantity(item._id, item.quantity - 1)}>
                      -
                    </Button>
                    <Quantity>{item.quantity}</Quantity>
                    <Button onClick={() => updateQuantity(item._id, item.quantity + 1)}>
                      +
                    </Button>
                  </QuantityControls>
                </ItemDetails>
                <RemoveButton onClick={() => removeFromCart(item._id)}>
                  Remove
                </RemoveButton>
              </CartItem>
            ))
          )}
        </CartItems>
        
        {cart.length > 0 && (
          <CartFooter>
            <Total>Total: ${cartTotal.toFixed(2)}</Total>
            <Button primary>Checkout</Button>
          </CartFooter>
        )}
      </CartContent>
    </CartOverlay>
  );
}

const CartOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: flex-end;
  z-index: 1000;
`;

const CartContent = styled.div`
  background: white;
  width: 400px;
  height: 100vh;
  display: flex;
  flex-direction: column;
`;

const CartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #eee;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
`;

const CartItems = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
`;

const EmptyCart = styled.p`
  text-align: center;
  color: #666;
  margin-top: 2rem;
`;

const CartItem = styled.div`
  display: flex;
  gap: 1rem;
  padding: 1rem 0;
  border-bottom: 1px solid #eee;
`;

const ItemImage = styled.img`
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
`;

const ItemDetails = styled.div`
  flex: 1;
`;

const ItemName = styled.h3`
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
`;

const ItemPrice = styled.p`
  margin: 0 0 0.5rem 0;
  color: ${theme.colors.primary};
  font-weight: bold;
`;

const QuantityControls = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Quantity = styled.span`
  padding: 0 0.5rem;
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: #dc3545;
  cursor: pointer;
  font-size: 0.9rem;
`;

const CartFooter = styled.div`
  padding: 1rem;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Total = styled.p`
  font-size: 1.2rem;
  font-weight: bold;
  margin: 0;
`;
