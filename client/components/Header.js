import Link from 'next/link';
import styled from 'styled-components';
import { theme } from '../styles/theme';
import { useCart } from '../context/CartContext';

export default function Header({ onCartClick }) {
  const { cartCount } = useCart();

  return (
    <HeaderContainer>
      <Nav>
        <Logo href="/">S-Creations</Logo>
        <NavLinks>
          <Link href="/shop">Shop</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
        </NavLinks>
        <CartButton onClick={onCartClick}>
          🛒 ({cartCount})
        </CartButton>
      </Nav>
    </HeaderContainer>
  );
}

const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  width: 100%;
  background: white;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  z-index: 1000;
`;

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: bold;
  color: ${theme.colors.primary};
  text-decoration: none;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 2rem;
  
  a {
    color: ${theme.colors.dark};
    text-decoration: none;
    transition: color 0.3s;
    
    &:hover {
      color: ${theme.colors.primary};
    }
  }
`;

const CartButton = styled.button`
  background: ${theme.colors.primary};
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  
  &:hover {
    background: ${theme.colors.secondary};
  }
`;
