import styled, { keyframes } from 'styled-components';
import { theme } from '../../styles/theme';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

export default function LoadingSpinner({ size = 40, color = theme.colors.primary }) {
  return (
    <Spinner size={size} color={color}>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </Spinner>
  );
}

const Spinner = styled.div`
  display: inline-block;
  position: relative;
  width: ${props => props.size}px;
  height: ${props => props.size}px;

  div {
    box-sizing: border-box;
    display: block;
    position: absolute;
    width: ${props => props.size * 0.8}px;
    height: ${props => props.size * 0.8}px;
    margin: ${props => props.size * 0.1}px;
    border: ${props => props.size * 0.1}px solid ${props => props.color};
    border-radius: 50%;
    animation: ${spin} 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
    border-color: ${props => props.color} transparent transparent transparent;
  }

  div:nth-child(1) {
    animation-delay: -0.45s;
  }

  div:nth-child(2) {
    animation-delay: -0.3s;
  }

  div:nth-child(3) {
    animation-delay: -0.15s;
  }
`;
