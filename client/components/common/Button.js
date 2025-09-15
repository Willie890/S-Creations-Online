import styled from 'styled-components';
import { theme } from '../../styles/theme';

export default function Button({ 
  children, 
  primary, 
  secondary, 
  danger, 
  fullWidth, 
  disabled,
  ...props 
}) {
  return (
    <StyledButton 
      primary={primary}
      secondary={secondary}
      danger={danger}
      fullWidth={fullWidth}
      disabled={disabled}
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
  opacity: ${props => props.disabled ? 0.6 : 1};
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  
  ${props => props.primary && `
    background-color: ${theme.colors.primary};
    color: white;
    
    &:hover:not(:disabled) {
      background-color: ${theme.colors.secondary};
      transform: translateY(-1px);
    }
  `}
  
  ${props => props.secondary && `
    background-color: transparent;
    color: ${theme.colors.primary};
    border: 2px solid ${theme.colors.primary};
    
    &:hover:not(:disabled) {
      background-color: ${theme.colors.primary};
      color: white;
      transform: translateY(-1px);
    }
  `}
  
  ${props => props.danger && `
    background-color: ${theme.colors.error};
    color: white;
    
    &:hover:not(:disabled) {
      background-color: #dc2626;
      transform: translateY(-1px);
    }
  `}
  
  &:disabled {
    cursor: not-allowed;
  }
`;
