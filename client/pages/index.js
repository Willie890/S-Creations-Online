import Head from 'next/head'
import { useRouter } from 'next/router'
import styled from 'styled-components'
import { theme } from '../styles/theme'

export default function Welcome() {
  const router = useRouter()

  return (
    <WelcomeContainer>
      <Head>
        <title>Welcome to S-Creations Online</title>
      </Head>
      
      <Logo src="/logo.png" alt="S-Creations Logo" />
      
      <WelcomeMessage>Welcome to S-Creations Online</WelcomeMessage>
      
      <ContactInfo>
        <p>WhatsApp: +1234567890</p>
        <p>Business Hours: Mon-Fri 9AM-5PM</p>
      </ContactInfo>
      
      <ButtonGroup>
        <PrimaryButton onClick={() => router.push('/register')}>
          Register Account
        </PrimaryButton>
        <SecondaryButton onClick={() => router.push('/shop')}>
          Continue to Shop
        </SecondaryButton>
      </ButtonGroup>
    </WelcomeContainer>
  )
}

// Styled components
const WelcomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: ${theme.colors.light};
  padding: 2rem;
  text-align: center;
`

const Logo = styled.img`
  width: 150px;
  margin-bottom: 2rem;
`

const WelcomeMessage = styled.h1`
  font-family: ${theme.fonts.heading};
  color: ${theme.colors.primary};
  margin-bottom: 1.5rem;
`

const ContactInfo = styled.div`
  margin-bottom: 2rem;
  color: ${theme.colors.dark};
  font-family: ${theme.fonts.main};
`

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`

const Button = styled.button`
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 5px;
  font-family: ${theme.fonts.main};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
`

const PrimaryButton = styled(Button)`
  background-color: ${theme.colors.primary};
  color: white;

  &:hover {
    background-color: ${theme.colors.secondary};
  }
`

const SecondaryButton = styled(Button)`
  background-color: transparent;
  border: 2px solid ${theme.colors.primary};
  color: ${theme.colors.primary};

  &:hover {
    background-color: ${theme.colors.primary};
    color: white;
  }
`
