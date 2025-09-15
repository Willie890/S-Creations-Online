import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { theme } from '../styles/theme';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import Button from './common/Button';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { cartCount, setCartOpen } = useCart();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
  };

  return (
    <HeaderContainer>
      <Nav>
        <Logo>
          <Link href="/">S-Creations</Link>
        </Logo>

        <NavLinks mobileMenuOpen={mobileMenuOpen}>
          <NavLink>
            <Link href="/shop" onClick={() => setMobileMenuOpen(false)}>
              Shop
            </Link>
          </NavLink>
          
          {user ? (
            <>
              {user.role === 'admin' && (
                <NavLink>
                  <Link href="/admin" onClick={() => setMobileMenuOpen(false)}>
                    Admin
                  </Link>
                </NavLink>
              )}
              <NavLink>
                <Link href="/orders" onClick={() => setMobileMenuOpen(false)}>
                  My Orders
                </Link>
              </NavLink>
              <NavLink>
                <Button secondary onClick={handleLogout}>
                  Logout
                </Button>
              </NavLink>
            </>
          ) : (
            <>
              <NavLink>
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  Login
                </Link>
              </NavLink>
              <NavLink>
                <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                  Register
                </Link>
              </NavLink>
            </>
          )}

          <CartButton onClick={() => setCartOpen(true)}>
            🛒 {cartCount > 0 && <CartCount>{cartCount}</CartCount>}
          </CartButton>
        </NavLinks>

        <MobileMenuButton onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          <span></span>
          <span></span>
          <span></span>
        </MobileMenuButton>
      </Nav>
    </HeaderContainer>
  );
}

const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: ${theme.colors.white};
  box-shadow: ${theme.shadows.md};
  z-index: 1000;
  padding: 0 ${theme.spacing.lg};
`;

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 80px;
  max-width: 1200px;
  margin: 0 auto;
`;

const Logo = styled.div`
  a {
    font-family: ${theme.fonts.heading};
    font-size: 1.8rem;
    font-weight: bold;
    color: ${theme.colors.primary};
    text-decoration: none;
  }
`;

const NavLinks = styled.ul`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.lg};
  list-style: none;
  margin: 0;
  padding: 0;

  @media (max-width: ${theme.breakpoints.tablet}) {
    position: fixed;
    top: 80px;
    left: 0;
    right: 0;
    background: ${theme.colors.white};
    flex-direction: column;
    padding: ${theme.spacing.xl};
    box-shadow: ${theme.shadows.lg};
    transform: ${props => props.mobileMenuOpen ? 'translateX(0)' : 'translateX(-100%)'};
    transition: transform 0.3s ease;
  }
`;

const NavLink = styled.li`
  a {
    color: ${theme.colors.dark};
    text-decoration: none;
    font-weight: 500;
    transition: color 0.3s ease;

    &:hover {
      color: ${theme.colors.primary};
    }
  }
`;

const CartButton = styled.button`
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  position: relative;
  padding: ${theme.spacing.sm};
`;

const CartCount = styled.span`
  position: absolute;
  top: -5px;
  right: -5px;
  background: ${theme.colors.primary};
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: bold;
`;

const MobileMenuButton = styled.button`
  display: none;
  flex-direction: column;
  background: none;
  border: none;
  cursor: pointer;
  
  span {
    width: 25px;
    height: 3px;
    background: ${theme.colors.dark};
    margin: 3px 0;
    transition: 0.3s;
  }

  @media (max-width: ${theme.breakpoints.tablet}) {
    display: flex;
  }
`;
