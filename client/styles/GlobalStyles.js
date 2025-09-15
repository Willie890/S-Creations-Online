import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    scroll-behavior: smooth;
  }

  body {
    font-family: ${props => props.theme.fonts.main};
    line-height: 1.6;
    color: ${props => props.theme.colors.text};
    background-color: ${props => props.theme.colors.light};
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: ${props => props.theme.fonts.heading};
    font-weight: 600;
    line-height: 1.2;
    margin-bottom: ${props => props.theme.spacing.md};
  }

  a {
    color: inherit;
    text-decoration: none;
    transition: color 0.3s ease;
  }

  button {
    font-family: inherit;
  }

  input, textarea, select {
    font-family: inherit;
    
    &:focus {
      outline: none;
      border-color: ${props => props.theme.colors.primary};
      box-shadow: 0 0 0 2px ${props => props.theme.colors.primary}20;
    }
  }

  img {
    max-width: 100%;
    height: auto;
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 ${props => props.theme.spacing.lg};
  }

  .text-center {
    text-align: center;
  }

  .mt-1 { margin-top: ${props => props.theme.spacing.sm}; }
  .mt-2 { margin-top: ${props => props.theme.spacing.md}; }
  .mt-3 { margin-top: ${props => props.theme.spacing.lg}; }
  .mt-4 { margin-top: ${props => props.theme.spacing.xl}; }

  .mb-1 { margin-bottom: ${props => props.theme.spacing.sm}; }
  .mb-2 { margin-bottom: ${props => props.theme.spacing.md}; }
  .mb-3 { margin-bottom: ${props => props.theme.spacing.lg}; }
  .mb-4 { margin-bottom: ${props => props.theme.spacing.xl}; }
`;

export default GlobalStyles;
