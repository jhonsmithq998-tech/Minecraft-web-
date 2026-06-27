// =============================================
// CRAFTEDREALMS - MAIN STORE LOGIC
// =============================================

// === CART ===
let cart = JSON.parse(localStorage.getItem('cart') || '[]');

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartUI();
}

function addToCart(id, name, price, icon) {
  const existing = cart.find(item => item.id === id);
  if (existing) {
    showToast('Already in cart!', 'info');
    return;
  }
  cart.push({ id, name, price, icon });
  saveCart();
  showToast(`${name} added to cart!`, 'success');
}

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  saveCart();
}

function clearCart() {
  cart = [];
  saveCart();
}

function getCartTotal() {
  return cart.reduce((sum, item) => sum + item.price, 0);
}

function updateCartUI() {
  const count = cart.length;
  const total = getCartTotal();

  document.querySelectorAll('.cart-count').forEach(el => el.textContent = count);

  const cartItems = document.getElementById('cartItems');
  const cartEmpty = document.getElementById('cartEmpty');
  const cartTotal = document.getElementById('cartTotal');
  const checkoutBtn = document.getElementById('checkoutBtn');

  if (!cartItems) return;

  if (count === 0) {
    cartItems.innerHTML = '';
    cartEmpty.style.display = 'block';
    checkoutBtn.disabled = true;
    checkoutBtn.style.opacity = '0.5';
  } else {
    cartEmpty.style.display = 'none';
    checkoutBtn.disabled = false;
    checkoutBtn.style.opacity = '1';
    cartItems.innerHTML = cart.map(item => `
      <div class="cart-item">
        <div class="cart-item-icon">${item.icon}</div>
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">₹${item.price}</div>
        </div>
        <button class="cart-item-remove" onclick="removeFromCart('${item.id}')">✕</button>
      </div>
    `).join('');
  }

  if (cartTotal) cartTotal.textContent = `₹${total}`;
}

// === CART SIDEBAR ===
function openCart() {
  document.getElementById('cartOverlay').classList.add('open');
  document.getElementById('cartSidebar').classList.add('open');
}

function closeCart() {
  document.getElementById('cartOverlay').classList.remove('open');
  document.getElementById('cartSidebar').classList.remove('open');
}

// === CHECKOUT ===
function goToCheckout() {
  if (cart.length === 0) return;
  localStorage.setItem('checkout_cart', JSON.stringify(cart));
  window.location.href = 'payment.html';
}

// === TOAST ===
let toastTimer;
function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  if (!toast) return;
  const icons = { success: '✅', error: '❌', info: 'ℹ️' };
  toast.className = `toast ${type} show`;
  toast.innerHTML = `<span>${icons[type] || '✅'}</span><span>${message}</span>`;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3000);
}

// === TABS ===
function switchTab(tabName) {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tabName);
  });
  document.querySelectorAll('.tab-content').forEach(content => {
    content.classList.toggle('active', content.id === `tab-${tabName}`);
  });
}

// === RENDER PRODUCTS ===
function renderRanks(container) {
  const ranks = getAllRanks();
  container.innerHTML = ranks.map(rank => `
    <div class="product-card ${rank.popular ? 'popular' : ''}" 
         style="--card-color: ${rank.color}; --card-glow: ${rank.glowColor}33">
      ${rank.popular ? '<div class="badge-popular">⭐ Most Popular</div>' : ''}
      <span class="card-badge-icon">${rank.badge}</span>
      <div class="card-name">${rank.name}</div>
      <div class="card-cooldown">RANK PACKAGE</div>
      <ul class="card-perks">
        ${rank.perks.map(p => `<li>${p}</li>`).join('')}
      </ul>
      <div class="card-price-row">
        <div class="card-price"><span>₹</span>${rank.price}</div>
        <button class="card-buy-btn" onclick="addToCart('${rank.id}', '${rank.name} Rank', ${rank.price}, '${rank.badge}')">
          Buy Now
        </button>
      </div>
    </div>
  `).join('');
}

function renderKits(container) {
  const kits = getAllKits();
  container.innerHTML = kits.map(kit => `
    <div class="product-card"
         style="--card-color: ${kit.color}; --card-glow: ${kit.glowColor}33">
      <span class="card-badge-icon">${kit.badge}</span>
      <div class="card-name">${kit.name}</div>
      <div class="card-cooldown">Cooldown: ${kit.cooldown}</div>
      <ul class="card-perks">
        ${kit.items.map(item => `<li>${item}</li>`).join('')}
      </ul>
      <div class="card-price-row">
        <div class="card-price"><span>₹</span>${kit.price}</div>
        <button class="card-buy-btn" onclick="addToCart('${kit.id}', '${kit.name}', ${kit.price}, '${kit.badge}')">
          Buy Now
        </button>
      </div>
    </div>
  `).join('');
}

// === SERVER IP COPY ===
function copyServerIP() {
  const ip = STORE_CONFIG.serverIP;
  navigator.clipboard.writeText(ip).then(() => {
    showToast('Server IP copied!', 'success');
  }).catch(() => {
    showToast('IP: ' + ip, 'info');
  });
}

// === INIT ===
document.addEventListener('DOMContentLoaded', () => {
  updateCartUI();

  const ranksContainer = document.getElementById('ranksGrid');
  const kitsContainer = document.getElementById('kitsGrid');

  if (ranksContainer) renderRanks(ranksContainer);
  if (kitsContainer) renderKits(kitsContainer);

  // Server name & config
  document.querySelectorAll('.server-name').forEach(el => el.textContent = STORE_CONFIG.serverName);
  document.querySelectorAll('.server-ip').forEach(el => el.textContent = STORE_CONFIG.serverIP);

  const banner = document.getElementById('bannerText');
  if (banner) banner.textContent = STORE_CONFIG.bannerText;

  // Tab buttons
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab));
  });
});
