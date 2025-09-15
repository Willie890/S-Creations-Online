import styled from 'styled-components';
import { theme } from '../styles/theme';

export default function Footer() {
  return (
    <FooterContainer>
      <FooterContent>
        <FooterSection>
          <h3>S-Creations</h3>
          <p>Quality handmade products for everyday life</p>
        </FooterSection>
        
        <FooterSection>
          <h4>Contact Info</h4>
          <p>📞 +1234567890</p>
          <p>✉️ info@s-creations.com</p>
          <p>🕒 Mon-Fri: 9AM-5PM</p>
        </FooterSection>
        
        <FooterSection>
          <h4>Quick Links</h4>
          <a href="/shop">Shop</a>
          <a href="/about">About Us</a>
          <a href="/contact">Contact</a>
        </FooterSection>
      </FooterContent>
      
      <Copyright>
        © {new Date().getFullYear()} S-Creations. All rights reserved.
      </Copyright>
    </FooterContainer>
  );
}

const FooterContainer = styled.footer`
  background: ${theme.colors.dark};
  color: ${theme.colors.white};
  padding: ${theme.spacing.xl} 0;
`;

const FooterContent = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${theme.spacing.xl};
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${theme.spacing.lg};
`;

const FooterSection = styled.div`
  h3, h4 {
    margin-bottom: ${theme.spacing.md};
    color: ${theme.colors.primary};
  }
  
  p, a {
    margin: ${theme.spacing.sm} 0;
    color: ${theme.colors.gray[300]};
    text-decoration: none;
    
    &:hover {
      color: ${theme.colors.primary};
    }
  }
`;

const Copyright = styled.div`
  text-align: center;
  padding: ${theme.spacing.md};
  border-top: 1px solid ${theme.colors.gray[700]};
  margin-top: ${theme.spacing.xl};
  color: ${theme.colors.gray[400]};
`;
