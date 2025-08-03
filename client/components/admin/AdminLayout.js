import styled from 'styled-components'
import { theme } from '../../styles/theme'
import AdminSidebar from './AdminSidebar'

export default function AdminLayout({ children }) {
  return (
    <AdminContainer>
      <AdminSidebar />
      <MainContent>{children}</MainContent>
    </AdminContainer>
  )
}

const AdminContainer = styled.div`
  display: flex;
  min-height: 100vh;
`

const MainContent = styled.main`
  flex: 1;
  padding: 2rem;
  background-color: ${theme.colors.light};
`
