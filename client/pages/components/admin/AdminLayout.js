import styled from 'styled-components';
import { theme } from '../../styles/theme';
import AdminSidebar from './AdminSidebar';

export default function AdminLayout({ children }) {
  return (
    <AdminContainer>
      <AdminSidebar />
      <MainContent>
        <ContentWrapper>
          {children}
        </ContentWrapper>
      </MainContent>
    </AdminContainer>
  );
}

const AdminContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: ${theme.colors.gray[100]};
`;

const MainContent = styled.main`
  flex: 1;
  padding: 2rem;
  margin-left: 250px;

  @media (max-width: ${theme.breakpoints.tablet}) {
    margin-left: 0;
    padding: 1rem;
  }
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  background: ${theme.colors.white};
  border-radius: 12px;
  padding: 2rem;
  box-shadow: ${theme.shadows.md};
`;
