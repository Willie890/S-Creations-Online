import styled from 'styled-components';
import { theme } from '../styles/theme';

export default function Footer() {
  return (
    <FooterContainer>
      <Content>
        <p>&copy; 2024 S-Creations. All rights reserved.</p>
        <ContactInfo>
          <p>WhatsApp: +1234567890</p>
          <p>Business Hours: Mon-Fri 9AM-5PM</p>
        </ContactInfo>
      </Content>
    </FooterContainer>
  );
}

const FooterContainer = styled.footer`
  background: ${theme.colors.dark};
  color: white;
  padding: 2rem;
  margin-top: auto;
`;

const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
`;

const ContactInfo = styled.div`
  margin-top: 1rem;
  
  p {
    margin: 0.5rem 0;
  }
`;
