import { useRouter } from 'next/router';
import styled from 'styled-components';
import { theme } from '../../styles/theme';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';

export default function AdminSidebar() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const isActive = (path) => router.pathname === path;

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <SidebarContainer>
      <SidebarHeader>
        <Logo>S-Creations Admin</Logo>
        <AdminInfo>
          <AdminName>{user?.name}</AdminName>
          <AdminEmail>{user?.email}</AdminEmail>
        </AdminInfo>
      </SidebarHeader>

      <NavList>
        <NavItem active={isActive('/admin')}>
          <Link href="/admin">
            <NavLink>
              📊 Dashboard
            </NavLink>
          </Link>
        </NavItem>
        
        <NavItem active={isActive('/admin/products')}>
          <Link href="/admin/products">
            <NavLink>
              🛍️ Products
            </NavLink>
          </Link>
        </NavItem>
        
        <NavItem active={isActive('/admin/orders')}>
          <Link href="/admin/orders">
            <NavLink>
              📦 Orders
            </NavLink>
          </Link>
        </NavItem>
        
        <NavItem active={isActive('/admin/customers')}>
          <Link href="/admin/customers">
            <NavLink>
              👥 Customers
            </NavLink>
          </Link>
        </NavItem>

        <NavDivider />

        <NavItem>
          <NavLink onClick={handleLogout}>
            🔒 Logout
          </NavLink>
        </NavItem>
      </NavList>
    </SidebarContainer>
  );
}

const SidebarContainer = styled.div`
  width: 250px;
  background-color: ${theme.colors.dark};
  color: white;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  overflow-y: auto;

  @media (max-width: ${theme.breakpoints.tablet}) {
    width: 100%;
    height: auto;
    position: relative;
    display: none;
  }
`;

const SidebarHeader = styled.div`
  padding: 2rem 1.5rem;
  border-bottom: 1px solid ${theme.colors.gray[700]};
`;

const Logo = styled.h2`
  color: ${theme.colors.primary};
  margin-bottom: 1rem;
  font-size: 1.3rem;
`;

const AdminInfo = styled.div`
  padding: 1rem 0;
`;

const AdminName = styled.p`
  font-weight: 600;
  margin-bottom: 0.25rem;
`;

const AdminEmail = styled.p`
  font-size: 0.9rem;
  color: ${theme.colors.gray[400]};
`;

const NavList = styled.ul`
  list-style: none;
  padding: 1rem 0;
`;

const NavItem = styled.li`
  margin: 0.5rem 0;
  padding: 0 1rem;
  
  background-color: ${props => props.active ? theme.colors.primary : 'transparent'};
  border-radius: 6px;
  margin: 0.5rem 1rem;
  
  &:hover {
    background-color: ${props => props.active ? theme.colors.primary : theme.colors.gray[700]};
  }
`;

const NavLink = styled.a`
  display: block;
  color: white;
  text-decoration: none;
  padding: 0.75rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: ${props => props.active ? '600' : 'normal'};
  
  &:hover {
    color: ${theme.colors.primary};
  }
`;

const NavDivider = styled.div`
  height: 1px;
  background-color: ${theme.colors.gray[700]};
  margin: 1rem 0;
`;
