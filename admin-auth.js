// =============================================
// ADMIN PANEL LOGIC
// Change the password below!
// =============================================

const ADMIN_PASSWORD_HASH = "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8"; // = "password"
// To generate a new hash: in browser console run:
// crypto.subtle.digest('SHA-256', new TextEncoder().encode('yourpassword')).then(b => console.log([...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('')))

async function hashPassword(password) {
  const msgBuffer = new TextEncoder().encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Storage helpers
function getStorageData(key) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch { return null; }
}

function setStorageData(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// Get all ranks (from localStorage override or default)
function getAllRanks() {
  const stored = getStorageData('custom_ranks');
  return stored && stored.length > 0 ? stored : RANKS;
}

// Get all kits
function getAllKits() {
  const stored = getStorageData('custom_kits');
  return stored && stored.length > 0 ? stored : KITS;
}

// Save ranks
function saveRanks(ranks) {
  setStorageData('custom_ranks', ranks);
}

// Save kits
function saveKits(kits) {
  setStorageData('custom_kits', kits);
}

// Get orders
function getOrders() {
  return getStorageData('orders') || [];
}

// Save order
function saveOrder(order) {
  const orders = getOrders();
  orders.unshift(order);
  setStorageData('orders', orders);
  return order;
}

// Admin session
function isAdminLoggedIn() {
  const session = sessionStorage.getItem('admin_session');
  if (!session) return false;
  const { expires } = JSON.parse(session);
  if (Date.now() > expires) {
    sessionStorage.removeItem('admin_session');
    return false;
  }
  return true;
}

function loginAdmin() {
  sessionStorage.setItem('admin_session', JSON.stringify({
    expires: Date.now() + 2 * 60 * 60 * 1000 // 2 hours
  }));
}

function logoutAdmin() {
  sessionStorage.removeItem('admin_session');
}

// Generate unique ID
function generateId(prefix) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
}
