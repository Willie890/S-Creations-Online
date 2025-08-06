import styled from 'styled-components'
import { theme } from '../../styles/theme'
import Link from 'next/link'

export default function AdminSidebar() {
  return (
    <SidebarContainer>
      <SidebarHeader>S-Creations Admin</SidebarHeader>
      <NavList>
        <NavItem>
          <Link href="/admin">Dashboard</Link>
        </NavItem>
        <NavItem>
          <Link href="/admin/products">Products</Link>
        </NavItem>
        <NavItem>
          <Link href="/admin/orders">Orders</Link>
        </NavItem>
      </NavList>
    </SidebarContainer>
  )
}

const SidebarContainer = styled.div`
  width: 250px;
  background-color: ${theme.colors.dark};
  color: white;
  height: 100vh;
  padding: 1rem;
  position: fixed;
`

const SidebarHeader = styled.h2`
  color: ${theme.colors.primary};
  padding-bottom: 1rem;
  border-bottom: 1px solid ${theme.colors.secondary};
`

const NavList = styled.ul`
  list-style: none;
  padding: 0;
`

const NavItem = styled.li`
  margin: 1rem 0;
  
  a {
    color: white;
    text-decoration: none;
    transition: color 0.3s;
    
    &:hover {
      color: ${theme.colors.primary};
    }
  }
`
