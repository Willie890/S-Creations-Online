import styled from 'styled-components'
import { theme } from '../styles/theme'

export default function Button({ children, primary, ...props }) {
  return (
    <StyledButton primary={primary} {...props}>
      {children}
    </StyledButton>
  )
}

const StyledButton = styled.button`
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 5px;
  font-family: ${theme.fonts.main};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: ${props => 
    props.primary ? theme.colors.primary : 'transparent'};
  color: ${props => 
    props.primary ? 'white' : theme.colors.primary};
  border: ${props => 
    !props.primary && `2px solid ${theme.colors.primary}`};

  &:hover {
    background-color: ${props => 
      props.primary ? theme.colors.secondary : theme.colors.primary};
    color: white;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`
