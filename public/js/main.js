// ==============
// CONFIGURATION
// ==============
const API_BASE = window.location.hostname === 'localhost' 
    ? 'http://localhost:5000/api' 
    : 'https://s-creations-online.onrender.com/api';

// ==============
// STATE MANAGEMENT
// ==============
let currentUser = null;
let cart = { items: [] };
let products = [];

// ==============
// UTILITY FUNCTIONS
// ==============
function showLoading(element) {
    element.classList.add('loading');
}

function hideLoading(element) {
    element.classList.remove('loading');
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">×</button>
    `;
    
    // Add styles if not exists
    if (!document.querySelector('#notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 1rem 1.5rem;
                border-radius: 8px;
                color: white;
                z-index: 10000;
                display: flex;
                align-items: center;
                gap: 1rem;
                max-width: 400px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                animation: slideIn 0.3s ease;
            }
            .notification-info { background: #3b82f6; }
            .notification-success { background: #10b981; }
            .notification-warning { background: #f59e0b; }
            .notification-error { background: #ef4444; }
            .notification button {
                background: none;
                border: none;
                color: white;
                font-size: 1.2rem;
                cursor: pointer;
                padding: 0;
                width: 20px;
                height: 20px;
            }
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(styles);
    }
    
    document.body.appendChild(notification);
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

function formatPrice(price) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(price);
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ==============
// API FUNCTIONS
// ==============
async function apiFetch(url, options = {}) {
    try {
        const response = await fetch(`${API_BASE}${url}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            credentials: 'include'
        });

        if (response.status === 401) {
            // Unauthorized - clear user session
            clearAuth();
            window.location.href = '/login.html';
            return null;
        }

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Request failed');
        }

        return await response.json();
    } catch (error) {
        console.error('API Fetch Error:', error);
        throw error;
    }
}

// ==============
// AUTH MANAGEMENT
// ==============
async function checkAuth() {
    try {
        const data = await apiFetch('/auth/me');
        if (data) {
            currentUser = data;
            updateAuthUI();
            return true;
        }
    } catch (error) {
        console.log('Not authenticated');
        currentUser = null;
        updateAuthUI();
        return false;
    }
}

function updateAuthUI() {
    const authElements = document.querySelectorAll('[data-auth]');
    authElements.forEach(element => {
        const authState = element.getAttribute('data-auth');
        if (authState === 'authenticated') {
            element.style.display = currentUser ? 'block' : 'none';
        } else if (authState === 'unauthenticated') {
            element.style.display = currentUser ? 'none' : 'block';
        } else if (authState === 'admin' && currentUser) {
            element.style.display = currentUser.role === 'admin' ? 'block' : 'none';
        }
    });

    // Update user info in navigation
    const userNav = document.querySelector('.user-nav');
    if (userNav && currentUser) {
        userNav.innerHTML = `
            <span>Hello, ${currentUser.name}</span>
            ${currentUser.role === 'admin' ? 
                '<a href="/admin.html" class="btn btn-sm btn-outline">Admin</a>' : ''}
            <button onclick="logout()" class="btn btn-sm btn-secondary">Logout</button>
        `;
    }
}

async function login(email, password) {
    try {
        showNotification('Logging in...', 'info');
        const data = await apiFetch('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });

        if (data) {
            showNotification('Login successful!', 'success');
            currentUser = data.user;
            updateAuthUI();
            
            // Redirect based on role
            setTimeout(() => {
                if (currentUser.role === 'admin') {
                    window.location.href = '/admin.html';
                } else {
                    window.location.href = '/';
                }
            }, 1000);
        }
    } catch (error) {
        showNotification(error.message, 'error');
    }
}

async function register(name, email, password) {
    try {
        showNotification('Creating account...', 'info');
        const data = await apiFetch('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ name, email, password })
        });

        if (data) {
            showNotification('Account created successfully!', 'success');
            currentUser = data.user;
            updateAuthUI();
            
            setTimeout(() => {
                window.location.href = '/';
            }, 1000);
        }
    } catch (error) {
        showNotification(error.message, 'error');
    }
}

async function logout() {
    try {
        await apiFetch('/auth/logout', { method: 'POST' });
    } catch (error) {
        console.error('Logout error:', error);
    } finally {
        clearAuth();
        window.location.href = '/';
    }
}

function clearAuth() {
    currentUser = null;
    updateAuthUI();
}

// ==============
// CART MANAGEMENT
// ==============
async function loadCart() {
    try {
        if (!currentUser) {
            // Load cart from localStorage for guests
            const savedCart = localStorage.getItem('guestCart');
            if (savedCart) {
                cart = JSON.parse(savedCart);
            }
            updateCartUI();
            return;
        }

        const data = await apiFetch('/cart');
        if (data) {
            cart = data;
            updateCartUI();
        }
    } catch (error) {
        console.error('Failed to load cart:', error);
    }
}

async function addToCart(productId, quantity = 1, variant = null) {
    try {
        if (!currentUser) {
            // Handle guest cart
            const product = products.find(p => p._id === productId);
            if (product) {
                const existingItem = cart.items.find(item => 
                    item.product._id === productId && 
                    JSON.stringify(item.variant) === JSON.stringify(variant)
                );

                if (existingItem) {
                    existingItem.quantity += quantity;
                } else {
                    cart.items.push({
                        product: { 
                            _id: product._id, 
                            name: product.name, 
                            price: product.price,
                            images: product.images 
                        },
                        quantity,
                        variant
                    });
                }
                
                localStorage.setItem('guestCart', JSON.stringify(cart));
                updateCartUI();
                showNotification('Added to cart!', 'success');
            }
            return;
        }

        const data = await apiFetch('/cart', {
            method: 'POST',
            body: JSON.stringify({ productId, quantity, variant })
        });

        if (data) {
            cart = data.cart;
            updateCartUI();
            showNotification('Added to cart!', 'success');
        }
    } catch (error) {
        showNotification(error.message, 'error');
    }
}

async function updateCartItem(productId, quantity, variant = null) {
    try {
        if (!currentUser) {
            // Handle guest cart update
            const itemIndex = cart.items.findIndex(item => 
                item.product._id === productId && 
                JSON.stringify(item.variant) === JSON.stringify(variant)
            );

            if (itemIndex > -1) {
                if (quantity === 0) {
                    cart.items.splice(itemIndex, 1);
                } else {
                    cart.items[itemIndex].quantity = quantity;
                }
                
                localStorage.setItem('guestCart', JSON.stringify(cart));
                updateCartUI();
            }
            return;
        }

        const data = await apiFetch(`/cart/${productId}`, {
            method: 'PATCH',
            body: JSON.stringify({ quantity, variant })
        });

        if (data) {
            cart = data.cart;
            updateCartUI();
        }
    } catch (error) {
        showNotification(error.message, 'error');
    }
}

async function removeFromCart(productId, variant = null) {
    await updateCartItem(productId, 0, variant);
}

function updateCartUI() {
    // Update cart badge
    const cartBadges = document.querySelectorAll('.cart-badge');
    const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    
    cartBadges.forEach(badge => {
        badge.textContent = totalItems;
        badge.style.display = totalItems > 0 ? 'flex' : 'none';
    });

    // Update cart page if open
    const cartPage = document.getElementById('cart-page');
    if (cartPage) {
        renderCartPage();
    }
}

function renderCartPage() {
    const container = document.getElementById('cart-items');
    if (!container) return;

    if (!cart.items.length) {
        container.innerHTML = `
            <div class="empty-cart">
                <h3>Your cart is empty</h3>
                <p>Discover our unique collection and add some creative pieces to your cart!</p>
                <a href="/" class="btn btn-primary">Start Shopping</a>
            </div>
        `;
        return;
    }

    const total = cart.items.reduce((sum, item) => {
        return sum + (item.product.price * item.quantity);
    }, 0);

    container.innerHTML = `
        <div class="cart-items">
            ${cart.items.map(item => `
                <div class="cart-item" data-product-id="${item.product._id}">
                    <div class="cart-item-image">
                        <img src="${API_BASE}${item.product.images?.[0]?.url || '/images/placeholder.jpg'}" 
                             alt="${item.product.name}">
                    </div>
                    <div class="cart-item-details">
                        <h4>${item.product.name}</h4>
                        ${item.variant ? `<p class="variant">${item.variant.name}: ${item.variant.option}</p>` : ''}
                        <p class="price">${formatPrice(item.product.price)}</p>
                    </div>
                    <div class="cart-item-controls">
                        <div class="quantity-controls">
                            <button onclick="updateCartItem('${item.product._id}', ${item.quantity - 1}, ${JSON.stringify(item.variant || {})})" 
                                    ${item.quantity <= 1 ? 'disabled' : ''}>−</button>
                            <span>${item.quantity}</span>
                            <button onclick="updateCartItem('${item.product._id}', ${item.quantity + 1}, ${JSON.stringify(item.variant || {})})">+</button>
                        </div>
                        <button class="btn-remove" onclick="removeFromCart('${item.product._id}', ${JSON.stringify(item.variant || {})})">
                            Remove
                        </button>
                    </div>
                    <div class="cart-item-total">
                        ${formatPrice(item.product.price * item.quantity)}
                    </div>
                </div>
            `).join('')}
        </div>
        <div class="cart-summary">
            <div class="cart-total">
                <strong>Total: ${formatPrice(total)}</strong>
            </div>
            <div class="cart-actions">
                <a href="/" class="btn btn-outline">Continue Shopping</a>
                <button onclick="checkout()" class="btn btn-primary" ${!currentUser ? 'disabled' : ''}>
                    ${currentUser ? 'Proceed to Checkout' : 'Login to Checkout'}
                </button>
            </div>
        </div>
    `;
}

// ==============
// PRODUCT MANAGEMENT
// ==============
async function loadProducts(filters = {}) {
    try {
        const queryString = new URLSearchParams(filters).toString();
        const data = await apiFetch(`/products?${queryString}`);
        
        if (data) {
            products = data.products;
            renderProducts();
        }
    } catch (error) {
        console.error('Failed to load products:', error);
    }
}

function renderProducts() {
    const container = document.querySelector('.products-grid');
    if (!container) return;

    if (!products.length) {
        container.innerHTML = '<p class="no-products">No products found matching your criteria.</p>';
        return;
    }

    container.innerHTML = products.map(product => `
        <div class="product-card" data-product-id="${product._id}">
            <div class="product-card__image">
                <img src="${API_BASE}${product.images?.[0]?.url || '/images/placeholder.jpg'}" 
                     alt="${product.name}" 
                     loading="lazy">
                ${product.badge ? `<div class="product-card__badge">${product.badge}</div>` : ''}
                <button class="product-card__wishlist" onclick="toggleWishlist('${product._id}')">
                    ♡
                </button>
            </div>
            <div class="product-card__content">
                <h3 class="product-card__title">${product.name}</h3>
                <p class="product-card__description">${product.description.substring(0, 100)}...</p>
                <div class="product-card__footer">
                    <span class="product-card__price">${formatPrice(product.price)}</span>
                    <div class="product-card__actions">
                        <button class="btn btn-sm btn-outline" onclick="viewProduct('${product._id}')">
                            View Details
                        </button>
                        <button class="btn btn-sm btn-primary" onclick="addToCart('${product._id}')">
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

async function viewProduct(productId) {
    // In a full implementation, this would navigate to a product details page
    showNotification('Product details page coming soon!', 'info');
}

async function toggleWishlist(productId) {
    if (!currentUser) {
        showNotification('Please login to add items to your wishlist', 'warning');
        return;
    }
    
    showNotification('Wishlist feature coming soon!', 'info');
}

// ==============
// CHECKOUT & ORDERS
// ==============
async function checkout() {
    if (!currentUser) {
        showNotification('Please login to proceed with checkout', 'warning');
        window.location.href = '/login.html';
        return;
    }

    if (!cart.items.length) {
        showNotification('Your cart is empty', 'warning');
        return;
    }

    try {
        // In a real implementation, this would show a checkout form
        // For now, we'll simulate a simple checkout process
        const shippingAddress = {
            firstName: 'John',
            lastName: 'Doe',
            email: currentUser.email,
            street: '123 Main St',
            city: 'New York',
            state: 'NY',
            postalCode: '10001',
            country: 'USA'
        };

        const data = await apiFetch('/checkout', {
            method: 'POST',
            body: JSON.stringify({
                shippingAddress,
                paymentMethod: 'EFT'
            })
        });

        if (data) {
            showNotification('Order placed successfully!', 'success');
            cart = { items: [] };
            updateCartUI();
            
            // Redirect to order confirmation
            setTimeout(() => {
                window.location.href = `/order-confirmation.html?order=${data.orderId}`;
            }, 2000);
        }
    } catch (error) {
        showNotification(error.message, 'error');
    }
}

async function loadUserOrders() {
    try {
        if (!currentUser) return;
        
        const data = await apiFetch('/orders/user/my-orders');
        if (data) {
            renderUserOrders(data.orders);
        }
    } catch (error) {
        console.error('Failed to load orders:', error);
    }
}

function renderUserOrders(orders) {
    const container = document.getElementById('user-orders');
    if (!container) return;

    if (!orders.length) {
        container.innerHTML = '<p>You have no orders yet.</p>';
        return;
    }

    container.innerHTML = orders.map(order => `
        <div class="order-card">
            <div class="order-header">
                <h4>Order #${order.orderNumber}</h4>
                <span class="order-status ${order.status.toLowerCase()}">${order.status}</span>
            </div>
            <div class="order-details">
                <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
                <p><strong>Total:</strong> ${formatPrice(order.totalAmount)}</p>
                <p><strong>Items:</strong> ${order.items.length}</p>
            </div>
            <div class="order-actions">
                <button onclick="viewOrderDetails('${order._id}')" class="btn btn-sm btn-outline">
                    View Details
                </button>
            </div>
        </div>
    `).join('');
}

// ==============
// SEARCH & FILTERS
// ==============
function initSearch() {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        const debouncedSearch = debounce((query) => {
            loadProducts({ search: query });
        }, 300);

        searchInput.addEventListener('input', (e) => {
            debouncedSearch(e.target.value);
        });
    }
}

function initFilters() {
    const filterForms = document.querySelectorAll('.filter-form');
    filterForms.forEach(form => {
        form.addEventListener('change', (e) => {
            const formData = new FormData(form);
            const filters = Object.fromEntries(formData);
            loadProducts(filters);
        });
    });
}

// ==============
// INITIALIZATION
// ==============
async function init() {
    // Check authentication status
    await checkAuth();
    
    // Load initial data
    await loadProducts();
    await loadCart();
    
    // Initialize search and filters
    initSearch();
    initFilters();
    
    // Load user orders if on orders page
    if (window.location.pathname.includes('orders')) {
        await loadUserOrders();
    }

    console.log('S-Creations initialized successfully!');
}

// ==============
// EVENT LISTENERS
// ==============
document.addEventListener('DOMContentLoaded', init);

// Login form handler
const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        await login(email, password);
    });
}

// Registration form handler
const registerForm = document.getElementById('signup-form');
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('signup-name').value;
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        const confirmPassword = document.getElementById('signup-confirm-password').value;

        if (password !== confirmPassword) {
            showNotification('Passwords do not match', 'error');
            return;
        }

        await register(name, email, password);
    });
}

// Navigation scroll effect
window.addEventListener('scroll', () => {
    const navigation = document.querySelector('.navigation');
    if (navigation) {
        if (window.scrollY > 100) {
            navigation.classList.add('scrolled');
        } else {
            navigation.classList.remove('scrolled');
        }
    }
});

// Service Worker Registration (for PWA)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}
