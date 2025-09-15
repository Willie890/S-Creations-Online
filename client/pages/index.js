import Head from 'next/head';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { theme } from '../styles/theme';
import Button from '../components/common/Button';

export default function Welcome() {
  const router = useRouter();

  return (
    <WelcomeContainer>
      <Head>
        <title>Welcome to S-Creations Online</title>
        <meta name="description" content="Discover handmade quality products at S-Creations" />
      </Head>
      
      <HeroSection>
        <HeroContent>
          <Logo src="/logo.png" alt="S-Creations Logo" />
          <WelcomeMessage>Welcome to S-Creations Online</WelcomeMessage>
          <Tagline>Handmade Quality Products for Everyday Life</Tagline>
          
          <ContactInfo>
            <ContactItem>📞 WhatsApp: +1234567890</ContactItem>
            <ContactItem>🕒 Business Hours: Mon-Fri 9AM-5PM</ContactItem>
            <ContactItem>📍 Located: 123 Creative Street, Artville</ContactItem>
          </ContactInfo>
          
          <ButtonGroup>
            <PrimaryButton onClick={() => router.push('/register')}>
              Register Account
            </PrimaryButton>
            <SecondaryButton onClick={() => router.push('/shop')}>
              Continue to Shop
            </SecondaryButton>
          </ButtonGroup>
        </HeroContent>
      </HeroSection>

      <FeaturesSection>
        <FeatureGrid>
          <Feature>
            <FeatureIcon>🚚</FeatureIcon>
            <FeatureTitle>Free Shipping</FeatureTitle>
            <FeatureDescription>Free shipping on orders over $50</FeatureDescription>
          </Feature>
          
          <Feature>
            <FeatureIcon>⭐</FeatureIcon>
            <FeatureTitle>Quality Guarantee</FeatureTitle>
            <FeatureDescription>100% satisfaction guaranteed</FeatureDescription>
          </Feature>
          
          <Feature>
            <FeatureIcon>🔒</FeatureIcon>
            <FeatureTitle>Secure Payment</FeatureTitle>
            <FeatureDescription>Safe and secure checkout</FeatureDescription>
          </Feature>
          
          <Feature>
            <FeatureIcon>🔄</FeatureIcon>
            <FeatureTitle>Easy Returns</FeatureTitle>
            <FeatureDescription>30-day return policy</FeatureDescription>
          </Feature>
        </FeatureGrid>
      </FeaturesSection>
    </WelcomeContainer>
  );
}

const WelcomeContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, ${theme.colors.primary}20 0%, ${theme.colors.secondary}20 100%);
`;

const HeroSection = styled.section`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
  padding: ${theme.spacing.xl};
  text-align: center;
`;

const HeroContent = styled.div`
  max-width: 600px;
`;

const Logo = styled.img`
  width: 120px;
  height: 120px;
  margin-bottom: ${theme.spacing.xl};
  border-radius: 50%;
  object-fit: cover;
  box-shadow: ${theme.shadows.lg};
`;

const WelcomeMessage = styled.h1`
  font-size: 3rem;
  color: ${theme.colors.primary};
  margin-bottom: ${theme.spacing.md};
  
  @media (max-width: ${theme.breakpoints.tablet}) {
    font-size: 2.5rem;
  }
`;

const Tagline = styled.p`
  font-size: 1.2rem;
  color: ${theme.colors.dark};
  margin-bottom: ${theme.spacing.xl};
  opacity: 0.8;
`;

const ContactInfo = styled.div`
  margin: ${theme.spacing.xl} 0;
  padding: ${theme.spacing.lg};
  background: ${theme.colors.white};
  border-radius: 12px;
  box-shadow: ${theme.shadows.md};
`;

const ContactItem = styled.p`
  margin: ${theme.spacing.sm} 0;
  color: ${theme.colors.dark};
  font-weight: 500;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  justify-content: center;
  margin-top: ${theme.spacing.xl};
  
  @media (max-width: ${theme.breakpoints.mobile}) {
    flex-direction: column;
    align-items: center;
  }
`;

const PrimaryButton = styled(Button)`
  padding: 1rem 2rem;
  font-size: 1.1rem;
`;

const SecondaryButton = styled(Button).attrs({ secondary: true })`
  padding: 1rem 2rem;
  font-size: 1.1rem;
`;

const FeaturesSection = styled.section`
  padding: ${theme.spacing.xxl} ${theme.spacing.xl};
  background: ${theme.colors.white};
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${theme.spacing.xl};
  max-width: 1200px;
  margin: 0 auto;
`;

const Feature = styled.div`
  text-align: center;
  padding: ${theme.spacing.xl};
  border-radius: 12px;
  background: ${theme.colors.light};
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const FeatureIcon = styled.div`
  font-size: 3rem;
  margin-bottom: ${theme.spacing.md};
`;

const FeatureTitle = styled.h3`
  color: ${theme.colors.primary};
  margin-bottom: ${theme.spacing.sm};
`;

const FeatureDescription = styled.p`
  color: ${theme.colors.dark};
  opacity: 0.8;
`;
