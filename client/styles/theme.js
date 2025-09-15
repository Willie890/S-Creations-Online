// client/styles/theme.js
// Simple theme object for consistent styling
// Can be expanded with breakpoints, shadows, etc.

const theme = {
  colors: {
    primary: '#3b82f6',     // blue-500
    secondary: '#6b7280',   // gray-500
    success: '#10b981',     // emerald-500
    danger: '#ef4444',      // red-500
    warning: '#f59e0b',     // amber-500
    info: '#3b82f6',        // blue-500
    light: '#f9fafb',       // gray-50
    dark: '#111827',        // gray-900
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
  },
  borderRadius: {
    sm: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  },
};

export default theme;
