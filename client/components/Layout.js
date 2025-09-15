import styled from 'styled-components';
import { theme } from '../styles/theme';
import Header from './Header';
import Footer from './Footer';

export default function Layout({ children }) {
  return (
    <LayoutContainer>
      <Header />
      <Main>{children}</Main>
      <Footer />
    </LayoutContainer>
  );
}

const LayoutContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Main = styled.main`
  flex: 1;
  padding-top: 80px;
  background-color: ${theme.colors.light};
`;
