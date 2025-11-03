// ==============\
// CONFIGURATION\
// ==============\
const API_BASE = 'http://localhost:5000/api'; // Use localhost:5000 if running locally
let CURRENT_USER = null; // Store user data after login/token check

// ==============\
// UTILITIES\
// ==============\
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

function setAuthToken(token) {
  // Set cookie for 1 day
  document.cookie = `token=${token}; path=/; max-age=86400; Secure; SameSite=Lax`; 
}

function clearAuth() {
  document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  localStorage.removeItem('user');
  CURRENT_USER = null;
  // Redirect to home/refresh
  window.location.href = '/'; 
}

function apiFetch(url, options = {}) {
  const token = getCookie('token');
  return fetch(`${API_BASE}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers
    }
  });
}

function renderMessage(containerId, message, isError = false) {
  const container = document.getElementById(containerId);
  if (container) {
    container.innerHTML = `<div class="message ${isError ? 'message--error' : 'message--success'}">${message}</div>`;
    setTimeout(() => { container.innerHTML = ''; }, 5000);
  } else {
    console.error('Container not found:', containerId);
  }
}

// ==============\
// AUTH & NAVIGATION\
// ==============\
function checkAuthAndLoadUser() {
  const token = getCookie('token');
  const user = JSON.parse(localStorage.getItem('user'));

  if (token && user) {
    CURRENT_USER = user;
    updateNavigation(true, user.name, user.role);
  } else {
    updateNavigation(false);
  }
}

function updateNavigation(isAuthenticated, name = '', role = 'user') {
  const navAuth = document.getElementById('nav-auth-links');
  const navUser = document.getElementById('nav-user-info');
  const adminLink = document.getElementById('admin-link');
  
  if (navAuth) navAuth.style.display = isAuthenticated ? 'none' : 'flex';
  if (navUser) navUser.style.display = isAuthenticated ? 'flex' : 'none';

  if (isAuthenticated) {
    if (navUser) {
      navUser.querySelector('.user-name').textContent = name;
    }
    
    // Show admin link only if role is admin
    if (adminLink) {
        adminLink.style.display = (role === 'admin') ? 'block' : 'none';
    }
  }
}

async function handleLogin(email, password) {
  const messageContainer = 'login-message-container';
  renderMessage(messageContainer, 'Logging in...', false);
  try {
    const res = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login failed');
    
    setAuthToken(data.token);
    // Store user data (excluding token)
    localStorage.setItem('user', JSON.stringify({ id: data.id, name: data.name, email: data.email, role: data.role }));
    
    renderMessage(messageContainer, 'Login successful! Redirecting...', false);
    
    // Redirect based on role
    if (data.role === 'admin') {
      window.location.href = '/admin.html';
    } else {
      window.location.href = '/'; 
    }
    
  } catch (err) {
    renderMessage(messageContainer, `Login Failed: ${err.message}`, true);
  }
}

async function handleSignup(name, email, password) {
  const messageContainer = 'signup-message-container';
  renderMessage(messageContainer, 'Creating account...', false);
  try {
    const res = await apiFetch('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ name, email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Signup failed');
    
    setAuthToken(data.token);
    localStorage.setItem('user', JSON.stringify({ id: data.id, name: data.name, email: data.email, role: data.role }));

    renderMessage(messageContainer, 'Account created! Redirecting...', false);
    window.location.href = '/';

  } catch (err) {
    renderMessage(messageContainer, `Signup Failed: ${err.message}`, true);
  }
}


// ==============\
// PRODUCTS\
// ==============\
async function loadProducts() {
  try {
    const res = await apiFetch('/products');
    if (!res.ok) throw new Error('Failed to fetch products');
    const products = await res.json();
    renderProducts(products);
  } catch (err) {
    console.error('Error loading products:', err);
    // document.querySelector('.products-grid').innerHTML = '<p class="message message--error">Failed to load products. Please check the backend API is running.</p>';
  }
}

function renderProducts(products) {
  const grid = document.querySelector('.products-grid');
  if (!grid) return;

  grid.innerHTML = products.map(p => `
    <article class="product-card">
      <div class="product-card__image-container">
        <img src="${p.image || 'https://placehold.co/400x400/6a5acd/ffffff?text=S-Creats'}" alt="${p.name}" class="product-card__image" onerror="this.onerror=null;this.src='https://placehold.co/400x400/6a5acd/ffffff?text=S-Creats';" />
        ${p.badge ? `<span class="product-card__badge badge">${p.badge}</span>` : ''}
      </div>
      <div class="product-card__content">
        <h4 class="product-card__title">${p.name}</h4>
        <p class="product-card__category">${p.category}</p>
        <div class="product-card__price">R${p.price.toFixed(2)}</div>
        <button type="button" class="btn btn-sm btn-outline add-to-cart" data-id="${p._id}">Quick Add</button>
      </div>
    </article>
  `).join('');
  
  // Add event listeners
  document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', () => addToCart(btn.dataset.id));
  });
}

// ==============\
// CART\
// ==============\
async function addToCart(productId) {
  if (!CURRENT_USER) {
    // Custom message box instead of alert/confirm
    if (window.confirm("You must be logged in to add items to the cart. Do you want to go to the login page?")) {
        window.location.href = '/login.html';
    }
    return;
  }
  
  try {
    const res = await apiFetch('/cart', {
      method: 'POST',
      body: JSON.stringify({ productId })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to add item to cart');

    // Subtle UI feedback
    const cartIcon = document.getElementById('cart-link');
    if (cartIcon) {
      cartIcon.classList.add('animate-ping-once');
      setTimeout(() => cartIcon.classList.remove('animate-ping-once'), 1000);
    }
    
    // If on the cart page, reload the cart content
    if (document.getElementById('cart-items')) {
        loadCart();
    }
    console.log('Item added to cart successfully');
    
  } catch (err) {
    console.error('Cart error:', err);
    window.alert('Could not add item to cart. Are you logged in and is the backend running?');
  }
}

async function loadCart() {
    const cartContainer = document.getElementById('cart-items');
    if (!cartContainer || !CURRENT_USER) {
      if (cartContainer) cartContainer.innerHTML = '<p class="message message--error">Please log in to view your cart.</p>';
      return;
    }

    cartContainer.innerHTML = '<div class="loader">Loading cart...</div>';

    try {
        const res = await apiFetch('/cart');
        if (!res.ok) throw new Error('Failed to fetch cart');
        const cart = await res.json();
        
        if (cart.items.length === 0) {
            cartContainer.innerHTML = '<p class="message message--info">Your cart is empty. <a href="/" class="link-primary">Start shopping!</a></p>';
            return;
        }

        let total = 0;
        const cartHtml = cart.items.map(item => {
            // Check if product data is available (it should be due to populate)
            if (!item.product) {
                console.error("Missing product details for item:", item);
                return ''; // Skip rendering this item
            }
            
            const itemTotal = item.product.price * item.quantity;
            total += itemTotal;
            return `
                <div class="cart-item" data-product-id="${item.product._id}">
                    <div class="cart-item__image-wrap">
                        <img src="${item.product.image || 'https://placehold.co/80x80/6a5acd/ffffff?text=Item'}" alt="${item.product.name}" class="cart-item__image" />
                    </div>
                    <div class="cart-item__details">
                        <h4 class="cart-item__title">${item.product.name}</h4>
                        <p class="cart-item__price">R${item.product.price.toFixed(2)}</p>
                    </div>
                    <div class="cart-item__quantity">
                        <input type="number" 
                               value="${item.quantity}" 
                               min="1" 
                               data-product-id="${item.product._id}"
                               onchange="updateCartItem(this.dataset.productId, this.value)"
                               class="form-input form-input--small" />
                    </div>
                    <div class="cart-item__subtotal">R${itemTotal.toFixed(2)}</div>
                    <button class="btn btn-icon btn-remove" onclick="removeCartItem('${item.product._id}')" aria-label="Remove item">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6h18m-2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                    </button>
                </div>
            `;
        }).join('');

        cartContainer.innerHTML = `
            ${cartHtml}
            <div class="cart-summary">
                <strong>Cart Total:</strong>
                <span class="total-price">R${total.toFixed(2)}</span>
            </div>
            <div class="cart-actions">
                <a href="/" class="btn btn-primary">Continue Shopping</a>
                <button class="btn btn-accent" onclick="checkout()">Checkout</button>
            </div>
        `;

    } catch (err) {
        console.error('Error loading cart:', err);
        cartContainer.innerHTML = '<p class="message message--error">Failed to load cart data. Please ensure the backend is running and you are logged in.</p>';
    }
}

async function updateCartItem(productId, quantity) {
    const newQuantity = parseInt(quantity);
    
    // Prevent making a request if quantity is 0 or less, forcing user to confirm removal
    if (newQuantity < 1) {
        // Find the input element to reset its value if user cancels removal
        const inputElement = document.querySelector(`.cart-item[data-product-id="${productId}"] input`);
        
        if (window.confirm("Are you sure you want to remove this item?")) {
            await removeCartItem(productId);
        } else if (inputElement) {
             // If user cancels, reset the input field back to 1
             inputElement.value = 1; 
        }
        return;
    }
    
    try {
        const res = await apiFetch(`/cart/${productId}`, {
            method: 'PUT',
            body: JSON.stringify({ quantity: newQuantity })
        });
        if (!res.ok) throw new Error('Failed to update cart item');
        loadCart(); // Reload cart to reflect changes and total
    } catch (err) {
        console.error('Update cart error:', err);
        window.alert('Could not update cart item.');
    }
}

async function removeCartItem(productId) {
    try {
        const res = await apiFetch(`/cart/${productId}`, {
            method: 'DELETE'
        });
        if (!res.ok) throw new Error('Failed to remove cart item');
        loadCart(); // Reload cart to reflect changes and total
    } catch (err) {
        console.error('Remove cart error:', err);
        window.alert('Could not remove item from cart.');
    }
}

async function checkout() {
    const checkoutBtn = document.querySelector('.cart-actions .btn-accent');
    checkoutBtn.disabled = true;
    checkoutBtn.textContent = 'Processing...';

    // 1. Get payment options from the backend
    try {
        const res = await apiFetch('/checkout/payment-options');
        if (!res.ok) throw new Error('Failed to fetch payment options');
        const paymentOptions = await res.json();
        
        // This is a placeholder for the actual checkout process.
        const message = `
            Thank you for your order! 
            \n\n--- PAYMENT INSTRUCTIONS (Placeholder) ---\n
            **EFT Option:**
            ${paymentOptions.eft.instructions}
            \n\n**Yoco Key:** ${paymentOptions.yoco.publicKey ? 'Ready for integration' : 'Not configured'}
            \n\n**Contact:** ${paymentOptions.contactEmail} for any issues.
            \n(Note: In a real app, an order would be finalized and an ID generated before displaying payment info.)
        `;
        
        window.alert(message);
        
    } catch (err) {
        console.error('Checkout error:', err);
        window.alert('Failed to process checkout. Please try again.');
    } finally {
        checkoutBtn.disabled = false;
        checkoutBtn.textContent = 'Checkout';
    }
}


// ==============\
// ADMIN PANEL (only relevant on admin.html)\
// ==============\
async function loadUsers() {
    const usersContainer = document.getElementById('users-list');
    if (!usersContainer) return;

    try {
        const res = await apiFetch('/auth/users');
        if (!res.ok) throw new Error('Failed to fetch users');
        const users = await res.json();
        const currentUser = JSON.parse(localStorage.getItem('user'));
        
        usersContainer.innerHTML = users.map(u => `
            <div class="user-row">
                <div class="user-cell user-cell--name">${u.name}</div>
                <div class="user-cell user-cell--email">${u.email}</div>
                <div class="user-cell user-cell--role">
                    <span class="user-role user-role--${u.role}">${u.role}</span>
                </div>
                <div class="user-cell user-cell--actions">
                    ${u._id === currentUser.id ? '<span>Self</span>' : `<button class="btn-edit" onclick="promoteUser('${u._id}', '${u.role}')">Promote</button>`}
                </div>
            </div>
        `).join('');
    } catch (err) {
        console.error('Error loading users:', err);
        usersContainer.innerHTML = '<p class="message message--error">Failed to load user list.</p>';
    }
}

async function loadCategories() {
    const categorySelect = document.getElementById('product-category');
    const categoryList = document.getElementById('categories-list');
    if (!categorySelect && !categoryList) return;

    try {
        const res = await apiFetch('/products/categories');
        if (!res.ok) throw new Error('Failed to fetch categories');
        const categories = await res.json();
        
        // Update Product Add/Edit Select
        if (categorySelect) {
            categorySelect.innerHTML = '<option value="">Select Category</option>';
            categories.forEach(c => {
                const option = document.createElement('option');
                option.value = c.name;
                option.textContent = c.name;
                categorySelect.appendChild(option);
            });
        }
        
        // Update Admin Category List
        if (categoryList) {
             categoryList.innerHTML = categories.map(c => `
                <div class="category-item">
                    <span>${c.name}</span>
                    <button class="btn-remove-category" onclick="removeCategory('${c._id}')">Remove</button>
                </div>
             `).join('');
        }
        
    } catch (err) {
        console.error('Error loading categories:', err);
    }
}

// Placeholder for removeCategory 
function removeCategory(id) {
    if (window.confirm("Are you sure you want to remove this category? This will not remove products in this category.")) {
        // You would implement DELETE /api/products/categories/:id here
        window.alert(`Category removal for ID ${id} is a placeholder. You need to implement the backend DELETE route.`);
        loadCategories();
    }
}

// Placeholder for promoteUser 
function promoteUser(id, currentRole) {
    window.alert('Promote functionality coming soon. In a production app, this would involve a PUT request to update the user role.');
}

// ==============\
// DOM READY LISTENERS\
// ==============\
document.addEventListener('DOMContentLoaded', () => {
  // Check auth status for navigation links
  checkAuthAndLoadUser(); 

  // --- Form Handlers ---
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

  const addProductForm = document.getElementById('add-product-form');
  if (addProductForm) {
      addProductForm.addEventListener('submit', async (e) => {
          e.preventDefault();
          
          const formData = new FormData(addProductForm);
          const productData = Object.fromEntries(formData.entries());
          productData.price = parseFloat(productData.price); 
          
          try {
              const res = await apiFetch('/products', {
                  method: 'POST',
                  body: JSON.stringify(productData)
              });
              const data = await res.json();
              if (!res.ok) throw new Error(data.error || 'Failed to add product');
              
              window.alert('✅ Product added successfully!');
              addProductForm.reset();
              loadProducts(); 
          } catch (err) {
              window.alert('❌ Failed to add product: ' + err.message);
          }
      });
  }
  
  const addCategoryForm = document.getElementById('add-category-form');
  if (addCategoryForm) {
      addCategoryForm.addEventListener('submit', async (e) => {
          e.preventDefault();
          const name = document.getElementById('category-name').value;
    
          try {
            const res = await apiFetch('/products/categories', {
              method: 'POST',
              body: JSON.stringify({ name })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.msg || 'Failed to add category');
            
            window.alert('✅ Category added!');
            loadCategories(); 
            addCategoryForm.reset();
          } catch (err) {
            window.alert('❌ Failed to add category: ' + err.message);
          }
      });
  }
  
  // --- Page Specific Loaders ---
  if (document.querySelector('.products-grid')) loadProducts();
  if (document.getElementById('cart-items')) loadCart();
  if (document.querySelector('.admin-dashboard')) {
      // Admin page initialization
      loadProducts();
      loadCategories();
      loadUsers();
  }
  
  // --- Logout Button ---
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      clearAuth();
    });
  }
});
