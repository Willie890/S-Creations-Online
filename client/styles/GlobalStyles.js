// client/styles/GlobalStyles.js
'use client';

import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  /* Reset & Base Styles */
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    font-size: 16px;
    scroll-behavior: smooth;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    line-height: 1.6;
    color: #111827; /* gray-900 */
    background-color: #ffffff;
    min-height: 100vh;
  }

  h1, h2, h3, h4, h5, h6 {
    margin: 0 0 0.5rem 0;
    line-height: 1.2;
    font-weight: 700;
  }

  p {
    margin: 0 0 1rem 0;
  }

  a {
    color: #3b82f6; /* blue-500 */
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }

  img, picture, video, canvas, svg {
    display: block;
    max-width: 100%;
  }

  input, button, textarea, select {
    font: inherit;
  }

  button {
    cursor: pointer;
  }

  /* Scrollbar (optional) */
  ::-webkit-scrollbar {
    width: 8px;
  }
  ::-webkit-scrollbar-track {
    background: #f1f1f1;
  }
  ::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 4px;
  }
`;

export default GlobalStyles;
