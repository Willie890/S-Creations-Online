import styled from 'styled-components';
import { theme } from '../../styles/theme';

export default function Button({ 
  children, 
  primary, 
  secondary, 
  danger, 
  fullWidth, 
  ...props 
}) {
  return (
    <StyledButton 
      primary={primary}
      secondary={secondary}
      danger={danger}
      fullWidth={fullWidth}
      {...props}
    >
      {children}
    </StyledButton>
  );
}

const StyledButton = styled.button`
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 5px;
  font-family: ${theme.fonts.main};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: ${props => props.fullWidth ? '100%' : 'auto'};
  
  ${props => props.primary && `
    background-color: ${theme.colors.primary};
    color: white;
    
    &:hover {
      background-color: ${theme.colors.secondary};
    }
  `}
  
  ${props => props.secondary && `
    background-color: transparent;
    color: ${theme.colors.primary};
    border: 2px solid ${theme.colors.primary};
    
    &:hover {
      background-color: ${theme.colors.primary};
      color: white;
    }
  `}
  
  ${props => props.danger && `
    background-color: #dc3545;
    color: white;
    
    &:hover {
      background-color: #bb2d3b;
    }
  `}
  
  &:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }
`;
