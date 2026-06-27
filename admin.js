// =============================================
// ADMIN PANEL LOGIC
// =============================================

// === LOGIN ===
async function attemptLogin() {
  const pass = document.getElementById('adminPass').value;
  const alertEl = document.getElementById('loginAlert');
  const btn = document.getElementById('loginBtn');

  if (!pass) {
    alertEl.innerHTML = '<div class="alert alert-error">Enter a password</div>';
    return;
  }

  btn.innerHTML = '<span class="spinner"></span> Verifying...';
  btn.disabled = true;

  const hash = await hashPassword(pass);

  if (hash === ADMIN_PASSWORD_HASH) {
    loginAdmin();
    showAdminPanel();
  } else {
    alertEl.innerHTML = '<div class="alert alert-error">❌ Incorrect password</div>';
    btn.innerHTML = '🔓 Login to Admin Panel';
    btn.disabled = false;
    document.getElementById('adminPass').value = '';
    document.getElementById('adminPass').focus();
  }
}

function doLogout() {
  if (confirm('Are you sure you want to logout?')) {
    logoutAdmin();
    location.reload();
  }
}

function showAdminPanel() {
  document.getElementById('loginScreen').classList.add('hidden');
  document.getElementById('adminPanel').classList.remove('hidden');
  loadDashboard();
  loadSettings();
}

// === SECTION SWITCHING ===
function switchSection(name) {
  document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.admin-nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById(`section-${name}`).classList.add('active');
  document.querySelector(`[data-section="${name}"]`).classList.add('active');

  // Load data for section
  if (name === 'dashboard') loadDashboard();
  if (name === 'orders') renderOrdersTable();
  if (name === 'ranks') renderRanksTable();
  if (name === 'kits') renderKitsTable();
}

// === DASHBOARD ===
function loadDashboard() {
  const orders = getOrders();
  const pending = orders.filter(o => o.status === 'pending').length;
  const completed = orders.filter(o => o.status === 'completed').length;
  const revenue = orders.filter(o => o.status === 'completed').reduce((s, o) => s + o.total, 0);

  document.getElementById('dashTotalOrders').textContent = orders.length;
  document.getElementById('dashPendingOrders').textContent = pending;
  document.getElementById('dashCompletedOrders').textContent = completed;
  document.getElementById('dashRevenue').textContent = `₹${revenue}`;
  document.getElementById('dashTimestamp').textContent = new Date().toLocaleString('en-IN');

  // Recent 5 orders
  const recent = orders.slice(0, 5);
  const wrap = document.getElementById('recentOrdersTable');
  if (recent.length === 0) {
    wrap.innerHTML = '<div class="table-wrap"><div class="table-empty"><div class="table-empty-icon">📦</div>No orders yet</div></div>';
    return;
  }

  wrap.innerHTML = `
    <div class="table-wrap">
      <table class="admin-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Username</th>
            <th>Items</th>
            <th>Total</th>
            <th>Status</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${recent.map(o => orderRow(o)).join('')}
        </tbody>
      </table>
    </div>
  `;
}

// === ORDERS ===
function renderOrdersTable() {
  const filter = document.getElementById('orderFilter')?.value || 'all';
  let orders = getOrders();
  if (filter !== 'all') orders = orders.filter(o => o.status === filter);

  const wrap = document.getElementById('ordersTableWrap');
  if (orders.length === 0) {
    wrap.innerHTML = '<div class="table-wrap"><div class="table-empty"><div class="table-empty-icon">📦</div>No orders found</div></div>';
    return;
  }

  wrap.innerHTML = `
    <div class="table-wrap">
      <table class="admin-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Items</th>
            <th>Total</th>
            <th>TXN ID</th>
            <th>Status</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${orders.map(o => orderRow(o, true)).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function orderRow(o, showEmail = false) {
  const date = new Date(o.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' });
  const statusBadge = `<span class="status-badge status-${o.status}">${
    o.status === 'pending' ? '⏳ Pending' : o.status === 'completed' ? '✅ Done' : '❌ Cancelled'
  }</span>`;
  const itemStr = o.items.map(i => i.icon + ' ' + i.name).join(', ');

  return `
    <tr>
      <td><code style="font-family: var(--font-mono); font-size: 12px; color: var(--accent-green);">${o.orderId}</code></td>
      <td><strong>${o.username}</strong></td>
      ${showEmail ? `<td style="font-size: 12px;">${o.email}</td>` : ''}
      <td style="font-size: 12px; max-width: 180px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${itemStr}</td>
      <td style="color: var(--accent-green); font-family: var(--font-mono);">₹${o.total}</td>
      ${showEmail ? `<td><code style="font-size: 11px; font-family: var(--font-mono);">${o.txnId}</code></td>` : ''}
      <td>${statusBadge}</td>
      <td style="font-size: 12px; white-space: nowrap;">${date}</td>
      <td>
        <div style="display: flex; gap: 4px;">
          <button class="action-btn" onclick="viewOrder('${o.orderId}')">👁 View</button>
          ${o.status === 'pending' ? `<button class="action-btn complete" onclick="markOrderComplete('${o.orderId}')">✅</button>` : ''}
          ${o.status === 'pending' ? `<button class="action-btn delete" onclick="cancelOrder('${o.orderId}')">✕</button>` : ''}
        </div>
      </td>
    </tr>
  `;
}

function viewOrder(orderId) {
  const orders = getOrders();
  const o = orders.find(o => o.orderId === orderId);
  if (!o) return;

  const date = new Date(o.timestamp).toLocaleString('en-IN');

  document.getElementById('orderModalBody').innerHTML = `
    <div class="order-summary">
      <div class="order-item-row">
        <span style="color: var(--text-muted);">Order ID</span>
        <code style="font-family: var(--font-mono); color: var(--accent-green);">${o.orderId}</code>
      </div>
      <div class="order-item-row">
        <span style="color: var(--text-muted);">Username</span>
        <strong>${o.username}</strong>
      </div>
      <div class="order-item-row">
        <span style="color: var(--text-muted);">Email</span>
        <span>${o.email}</span>
      </div>
      <div class="order-item-row">
        <span style="color: var(--text-muted);">UPI Transaction ID</span>
        <code style="font-family: var(--font-mono); font-size: 12px;">${o.txnId}</code>
      </div>
      <div class="order-item-row">
        <span style="color: var(--text-muted);">Date</span>
        <span>${date}</span>
      </div>
      <div class="order-item-row">
        <span style="color: var(--text-muted);">Status</span>
        <span class="status-badge status-${o.status}">${o.status}</span>
      </div>
    </div>
    <div style="font-family: var(--font-mono); font-size: 11px; color: var(--text-muted); letter-spacing: 2px; text-transform: uppercase; margin-bottom: 8px;">Items Ordered</div>
    ${o.items.map(item => `
      <div class="order-item-row">
        <span>${item.icon} ${item.name}</span>
        <span style="color: var(--accent-green); font-family: var(--font-mono);">₹${item.price}</span>
      </div>
    `).join('')}
    <div class="order-total-row">
      <span>Total</span>
      <span class="order-total-amount">₹${o.total}</span>
    </div>
  `;

  document.getElementById('orderModalFooter').innerHTML = `
    <button class="btn btn-ghost" onclick="closeModal('orderModal')">Close</button>
    ${o.status === 'pending' ? `
      <button class="btn btn-danger btn-sm" onclick="cancelOrder('${o.orderId}'); closeModal('orderModal');">Cancel Order</button>
      <button class="btn btn-primary" onclick="markOrderComplete('${o.orderId}'); closeModal('orderModal');">✅ Mark Delivered</button>
    ` : ''}
  `;

  openModal('orderModal');
}

function markOrderComplete(orderId) {
  updateOrderStatus(orderId, 'completed');
  showToast('Order marked as delivered!', 'success');
  renderOrdersTable();
  loadDashboard();
}

function cancelOrder(orderId) {
  if (!confirm('Cancel this order?')) return;
  updateOrderStatus(orderId, 'cancelled');
  showToast('Order cancelled', 'info');
  renderOrdersTable();
  loadDashboard();
}

function updateOrderStatus(orderId, status) {
  const orders = getOrders();
  const idx = orders.findIndex(o => o.orderId === orderId);
  if (idx !== -1) {
    orders[idx].status = status;
    setStorageData('orders', orders);
  }
}

function exportOrders() {
  const orders = getOrders();
  if (orders.length === 0) { showToast('No orders to export', 'info'); return; }

  const rows = [
    ['Order ID', 'Username', 'Email', 'Transaction ID', 'Items', 'Total', 'Status', 'Date'],
    ...orders.map(o => [
      o.orderId,
      o.username,
      o.email,
      o.txnId,
      o.items.map(i => i.name).join(' + '),
      o.total,
      o.status,
      new Date(o.timestamp).toLocaleDateString('en-IN')
    ])
  ];

  const csv = rows.map(r => r.map(c => `"${c}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `craftedrealms-orders-${Date.now()}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('Orders exported!', 'success');
}

// === RANKS TABLE ===
function renderRanksTable() {
  const ranks = getAllRanks();
  const wrap = document.getElementById('ranksTableWrap');

  wrap.innerHTML = `
    <div class="table-wrap">
      <table class="admin-table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Price</th>
            <th>Perks</th>
            <th>Popular</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${ranks.map(r => `
            <tr>
              <td>
                <span class="color-preview" style="background: ${r.color};"></span>
                <strong>${r.badge} ${r.name}</strong>
              </td>
              <td style="color: var(--accent-green); font-family: var(--font-mono);">₹${r.price}</td>
              <td style="font-size: 12px; color: var(--text-muted);">${r.perks.length} perks</td>
              <td>${r.popular ? '⭐ Yes' : '—'}</td>
              <td>
                <div style="display: flex; gap: 4px;">
                  <button class="action-btn edit" onclick="editRank('${r.id}')">✏️ Edit</button>
                  <button class="action-btn delete" onclick="deleteRank('${r.id}')">🗑 Delete</button>
                </div>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

// === RANK MODAL ===
function openAddRankModal() {
  document.getElementById('rankModalTitle').textContent = 'Add New Rank';
  document.getElementById('rankEditId').value = '';
  document.getElementById('rankName').value = '';
  document.getElementById('rankPrice').value = '';
  document.getElementById('rankBadge').value = '⚔️';
  document.getElementById('rankColor').value = '#00ffff';
  document.getElementById('rankGlow').value = '#7ffeff';
  document.getElementById('rankPopular').checked = false;
  document.getElementById('rankPerks').value = '';
  openModal('rankModal');
}

function editRank(id) {
  const rank = getAllRanks().find(r => r.id === id);
  if (!rank) return;
  document.getElementById('rankModalTitle').textContent = 'Edit Rank';
  document.getElementById('rankEditId').value = rank.id;
  document.getElementById('rankName').value = rank.name;
  document.getElementById('rankPrice').value = rank.price;
  document.getElementById('rankBadge').value = rank.badge;
  document.getElementById('rankColor').value = rank.color;
  document.getElementById('rankGlow').value = rank.glowColor;
  document.getElementById('rankPopular').checked = rank.popular;
  document.getElementById('rankPerks').value = rank.perks.join('\n');
  openModal('rankModal');
}

function saveRank() {
  const name = document.getElementById('rankName').value.trim();
  const price = parseInt(document.getElementById('rankPrice').value);
  const badge = document.getElementById('rankBadge').value.trim() || '⚔️';
  const color = document.getElementById('rankColor').value;
  const glowColor = document.getElementById('rankGlow').value;
  const popular = document.getElementById('rankPopular').checked;
  const perks = document.getElementById('rankPerks').value.trim().split('\n').filter(p => p.trim());
  const editId = document.getElementById('rankEditId').value;

  if (!name) { showToast('Enter rank name', 'error'); return; }
  if (!price || price < 1) { showToast('Enter a valid price', 'error'); return; }
  if (perks.length === 0) { showToast('Add at least one perk', 'error'); return; }

  const ranks = getAllRanks();

  if (editId) {
    const idx = ranks.findIndex(r => r.id === editId);
    if (idx !== -1) {
      ranks[idx] = { ...ranks[idx], name, price, badge, color, glowColor, popular, perks };
    }
  } else {
    const maxTier = ranks.reduce((m, r) => Math.max(m, r.tier || 0), 0);
    ranks.push({
      id: generateId('rank'),
      name, price, badge, color, glowColor, popular, perks,
      tier: maxTier + 1
    });
  }

  saveRanks(ranks);
  closeModal('rankModal');
  renderRanksTable();
  showToast(`Rank "${name}" saved!`, 'success');
}

function deleteRank(id) {
  const rank = getAllRanks().find(r => r.id === id);
  if (!rank) return;
  if (!confirm(`Delete rank "${rank.name}"? This cannot be undone.`)) return;
  const ranks = getAllRanks().filter(r => r.id !== id);
  saveRanks(ranks);
  renderRanksTable();
  showToast(`Rank "${rank.name}" deleted`, 'info');
}

// === KITS TABLE ===
function renderKitsTable() {
  const kits = getAllKits();
  const wrap = document.getElementById('kitsTableWrap');

  wrap.innerHTML = `
    <div class="table-wrap">
      <table class="admin-table">
        <thead>
          <tr>
            <th>Kit</th>
            <th>Price</th>
            <th>Cooldown</th>
            <th>Items</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${kits.map(k => `
            <tr>
              <td>
                <span class="color-preview" style="background: ${k.color};"></span>
                <strong>${k.badge} ${k.name}</strong>
              </td>
              <td style="color: var(--accent-green); font-family: var(--font-mono);">₹${k.price}</td>
              <td>${k.cooldown}</td>
              <td style="font-size: 12px; color: var(--text-muted);">${k.items.length} items</td>
              <td>
                <div style="display: flex; gap: 4px;">
                  <button class="action-btn edit" onclick="editKit('${k.id}')">✏️ Edit</button>
                  <button class="action-btn delete" onclick="deleteKit('${k.id}')">🗑 Delete</button>
                </div>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

// === KIT MODAL ===
function openAddKitModal() {
  document.getElementById('kitModalTitle').textContent = 'Add New Kit';
  document.getElementById('kitEditId').value = '';
  document.getElementById('kitName').value = '';
  document.getElementById('kitPrice').value = '';
  document.getElementById('kitBadge').value = '🎒';
  document.getElementById('kitColor').value = '#ff6b35';
  document.getElementById('kitGlow').value = '#ff9d72';
  document.getElementById('kitCooldown').value = 'Weekly';
  document.getElementById('kitItems').value = '';
  openModal('kitModal');
}

function editKit(id) {
  const kit = getAllKits().find(k => k.id === id);
  if (!kit) return;
  document.getElementById('kitModalTitle').textContent = 'Edit Kit';
  document.getElementById('kitEditId').value = kit.id;
  document.getElementById('kitName').value = kit.name;
  document.getElementById('kitPrice').value = kit.price;
  document.getElementById('kitBadge').value = kit.badge;
  document.getElementById('kitColor').value = kit.color;
  document.getElementById('kitGlow').value = kit.glowColor;
  document.getElementById('kitCooldown').value = kit.cooldown;
  document.getElementById('kitItems').value = kit.items.join('\n');
  openModal('kitModal');
}

function saveKit() {
  const name = document.getElementById('kitName').value.trim();
  const price = parseInt(document.getElementById('kitPrice').value);
  const badge = document.getElementById('kitBadge').value.trim() || '🎒';
  const color = document.getElementById('kitColor').value;
  const glowColor = document.getElementById('kitGlow').value;
  const cooldown = document.getElementById('kitCooldown').value;
  const items = document.getElementById('kitItems').value.trim().split('\n').filter(i => i.trim());
  const editId = document.getElementById('kitEditId').value;

  if (!name) { showToast('Enter kit name', 'error'); return; }
  if (!price || price < 1) { showToast('Enter a valid price', 'error'); return; }
  if (items.length === 0) { showToast('Add at least one item', 'error'); return; }

  const kits = getAllKits();

  if (editId) {
    const idx = kits.findIndex(k => k.id === editId);
    if (idx !== -1) {
      kits[idx] = { ...kits[idx], name, price, badge, color, glowColor, cooldown, items };
    }
  } else {
    kits.push({
      id: generateId('kit'),
      name, price, badge, color, glowColor, cooldown, items
    });
  }

  saveKits(kits);
  closeModal('kitModal');
  renderKitsTable();
  showToast(`Kit "${name}" saved!`, 'success');
}

function deleteKit(id) {
  const kit = getAllKits().find(k => k.id === id);
  if (!kit) return;
  if (!confirm(`Delete kit "${kit.name}"? This cannot be undone.`)) return;
  const kits = getAllKits().filter(k => k.id !== id);
  saveKits(kits);
  renderKitsTable();
  showToast(`Kit "${kit.name}" deleted`, 'info');
}

// === SETTINGS ===
function loadSettings() {
  const saved = getStorageData('store_settings');
  const config = saved || STORE_CONFIG;
  document.getElementById('setServerName').value = config.serverName || '';
  document.getElementById('setServerIp').value = config.serverIP || '';
  document.getElementById('setUpiId').value = config.upiId || '';
  document.getElementById('setUpiName').value = config.upiName || '';
  document.getElementById('setBannerText').value = config.bannerText || '';
  document.getElementById('setDiscordLink').value = config.discordLink || '';
}

function saveSettings() {
  const settings = {
    serverName: document.getElementById('setServerName').value.trim(),
    serverIP: document.getElementById('setServerIp').value.trim(),
    upiId: document.getElementById('setUpiId').value.trim(),
    upiName: document.getElementById('setUpiName').value.trim(),
    bannerText: document.getElementById('setBannerText').value.trim(),
    discordLink: document.getElementById('setDiscordLink').value.trim(),
  };
  setStorageData('store_settings', settings);
  // Update global config
  Object.assign(STORE_CONFIG, settings);
  showToast('Settings saved!', 'success');
}

function clearAllOrders() {
  if (!confirm('Delete ALL orders? This cannot be undone!')) return;
  localStorage.removeItem('orders');
  loadDashboard();
  renderOrdersTable();
  showToast('All orders cleared', 'info');
}

function resetToDefaults() {
  if (!confirm('Reset all ranks and kits to default? Your customizations will be lost!')) return;
  localStorage.removeItem('custom_ranks');
  localStorage.removeItem('custom_kits');
  renderRanksTable();
  renderKitsTable();
  showToast('Reset to defaults', 'info');
}

// === MODAL HELPERS ===
function openModal(id) {
  document.getElementById(id).classList.add('open');
}

function closeModal(id) {
  document.getElementById(id).classList.remove('open');
}

// Close modal on overlay click
document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.classList.remove('open');
  });
});

// === INIT ===
document.addEventListener('DOMContentLoaded', () => {
  // Apply saved settings to STORE_CONFIG
  const saved = getStorageData('store_settings');
  if (saved) Object.assign(STORE_CONFIG, saved);

  if (isAdminLoggedIn()) {
    showAdminPanel();
  }
});
