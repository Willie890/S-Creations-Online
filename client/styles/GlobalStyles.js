/* styles/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  background-color: #E6D5F0; /* Lavender */
  color: #4A6B3A; /* Olive Green */
  font-family: 'Arial', sans-serif;
}

h1, h2, h3, h4, h5, h6 {
  color: #4A6B3A;
}

a {
  color: #4A6B3A;
  text-decoration: underline;
}

button {
  cursor: pointer;
  transition: background-color 0.3s;
}

/* Custom button styles */
.btn-primary {
  background-color: #4A6B3A;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
}

.btn-secondary {
  background-color: #D8B4E2;
  color: #4A6B3A;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
}
