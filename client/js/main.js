// ==============
// CONFIGURATION
// ==============
const API_BASE = 'https://s-creations-online.onrender.com/api';

// ==============
// UTILITIES
// ==============
/* REMOVED: getCookie and setAuthToken - Now using HttpOnly cookie */

function clearAuth() {
  // HttpOnly cookie can only be cleared by the server. 
  // We only clear client-side data here.
  localStorage.removeItem('cart');
}

function apiFetch(url, options = {}) {
  // Rely on the browser to automatically send the HttpOnly cookie
  return fetch(`${API_BASE}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    credentials: 'include' // NEW: Ensures the browser sends HttpOnly cookies
  });
}

// ==============
// AUTH (Only minor logic changes)
// ==============
async function handleLogin(email, password) {
  try {
    const res = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login failed');
    
    // Server now sets the HttpOnly cookie. We only handle redirection.
    if (data.role === 'admin') {
      window.location.href = '/admin.html';
    } else {
      window.location.href = '/';
    }
  } catch (err) {
    alert(err.message);
  }
}

async function handleSignup(name, email, password) {
  try {
    const res = await apiFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Signup failed');
    
    // Server now sets the HttpOnly cookie. We only handle redirection.
    window.location.href = '/';
  } catch (err) {
    alert(err.message);
  }
}

// ==============
// CART
// ==============
async function loadCart() {
  try {
    const res = await apiFetch('/cart');
    if (res.ok) {
      const cart = await res.json();
      renderCart(cart);
    }
  } catch (err) {
    console.error('Cart load failed:', err);
  }
}

async function addToCart(productId) {
  try {
    const res = await apiFetch('/cart', {
      method: 'POST',
      body: JSON.stringify({ productId })
    });
    if (res.ok) {
      alert('Added to cart!');
      if (window.location.pathname === '/cart.html') loadCart();
    }
  } catch (err) {
    alert('Failed to add to cart');
  }
}

function renderCart(cart) {
  const container = document.getElementById('cart-items');
  if (!container) return;
  
  if (!cart?.items?.length) {
    container.innerHTML = '<p>Your cart is empty.</p>';
    return;
  }
  
  container.innerHTML = cart.items.map(item => `
    <div class="cart-item">
      <h4>${item.product.name}</h4>
      <p>$${item.product.price} × ${item.quantity}</p>
    </div>
  `).join('');
}

// ==============
// PRODUCTS
// ==============
async function loadProducts() {
  try {
    const res = await apiFetch('/products');
    const products = await res.json();
    renderProducts(products);
  } catch (err) {
    console.error('Products load failed:', err);
  }
}

function renderProducts(products) {
  const grid = document.querySelector('.products-grid');
  if (!grid) return;
  
  grid.innerHTML = products.map(p => `
    <article class="product-card">
      <div class="product-card__image">
        <img src="${p.image}" alt="${p.name}" />
      </div>
      <div class="product-card__content">
        <h4 class="product-card__title">${p.name}</h4>
        <p class="product-card__price">$${p.price}</p>
        <button class="btn btn-sm btn-outline add-to-cart" data-id="${p._id}">Quick Add</button>
      </div>
    </article>
  `).join('');
  
  // Add event listeners
  document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', () => addToCart(btn.dataset.id));
  });
}

// ==============
// DOM READY
// ==============
document.addEventListener('DOMContentLoaded', () => {
  // Forms
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', e => {
      e.preventDefault();
      const email = document.getElementById('login-email').value;
      const password = document.getElementById('login-password').value;
      handleLogin(email, password);
    });
  }

  const signupForm = document.getElementById('signup-form');
  if (signupForm) {
    signupForm.addEventListener('submit', e => {
      e.preventDefault();
      const name = document.getElementById('signup-name').value;
      const email = document.getElementById('signup-email').value;
      const password = document.getElementById('signup-password').value;
      handleSignup(name, email, password);
    });
  }

  // Pages
  if (document.querySelector('.products-grid')) loadProducts();
  if (document.getElementById('cart-items')) loadCart();
  
  // Logout
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      clearAuth();
      window.location.href = '/';
    });
  }
});
