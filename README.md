# ⛏️ CraftedRealms Minecraft Store

A complete, ready-to-host Minecraft store website with ranks, kits, UPI payment, and an admin panel.

---

## 📁 File Structure

```
minecraft-store/
├── index.html          ← Main store page
├── payment.html        ← Checkout / UPI payment page
├── css/
│   └── style.css       ← All styles
├── js/
│   ├── store-data.js   ← Ranks, kits, and store config (EDIT THIS)
│   ├── admin-auth.js   ← Auth helpers
│   └── store.js        ← Cart, UI logic
└── admin/
    ├── index.html      ← Admin panel
    ├── admin.css       ← Admin styles
    └── admin.js        ← Admin logic
```

---

## ⚡ Quick Setup (5 Steps)

### Step 1 — Edit Store Config
Open `js/store-data.js` and update:
```js
const STORE_CONFIG = {
  serverName: "YourServerName",
  serverIP: "play.yourserver.net",
  upiId: "yourname@paytm",      // ← YOUR UPI ID
  upiName: "Your Full Name",     // ← YOUR NAME
  ...
};
```

### Step 2 — Change Admin Password
In `js/admin-auth.js`, line 6 has the default password hash.

To generate a new hash, open your browser console and run:
```js
crypto.subtle.digest('SHA-256', new TextEncoder().encode('yournewpassword'))
  .then(b => console.log([...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('')))
```
Copy the output and replace the hash in `admin-auth.js`.

### Step 3 — Customize Ranks & Kits
Edit the `RANKS` and `KITS` arrays in `js/store-data.js` — or use the Admin Panel after setup.

### Step 4 — Upload to Hosting
Upload ALL files keeping the folder structure. Works on:
- **GitHub Pages** (free)
- **Netlify** (free, drag & drop)
- **Vercel** (free)
- **cPanel shared hosting**
- Any static web server / VPS

### Step 5 — Test
1. Visit your site
2. Add a rank/kit to cart
3. Click Checkout
4. Enter any username, email, and transaction ID
5. Check admin panel at `/admin/` (default password: `password`)

---

## 🔐 Admin Panel

Visit: `yoursite.com/admin/`

**Default password:** `password` — **CHANGE THIS BEFORE GOING LIVE!**

### Admin Features:
- **Dashboard** — Order stats, recent orders
- **Orders** — View, mark delivered, cancel, export CSV
- **Ranks** — Add/edit/delete ranks with color picker
- **Kits** — Add/edit/delete kits
- **Settings** — Update UPI ID, server name, IP, banner text

---

## 💳 How UPI Payments Work

1. Customer adds items to cart and goes to checkout
2. They enter Minecraft username, email
3. The page shows your UPI ID and exact amount to send
4. Customer pays using PhonePe, GPay, Paytm, etc.
5. They enter their UPI transaction ID and submit
6. You get notified — check Admin Panel → Orders
7. Verify payment in your UPI app, then mark order as Delivered
8. Give the rank/kit in-game using your Minecraft server commands

---

## 🎨 Customization

### Change Server Name
Update `STORE_CONFIG.serverName` in `store-data.js`

### Add More Ranks
Add a new object to the `RANKS` array in `store-data.js` or use Admin Panel

### Change Colors
Each rank/kit has `color` and `glowColor` hex values

### Update Banner
Change `STORE_CONFIG.bannerText` or use Admin → Settings

---

## 🌐 Hosting on GitHub Pages (Free)

1. Create a GitHub repository
2. Upload all files
3. Go to Settings → Pages → Source: main branch
4. Your site will be at `https://yourusername.github.io/reponame`

## 🌐 Hosting on Netlify (Free + Easy)

1. Go to netlify.com
2. Drag and drop the `minecraft-store` folder
3. Done! Get a free URL instantly

---

## ⚠️ Important Notes

- This is a **static website** — no server/database needed
- Orders are stored in the **buyer's browser** for the success page
- Admin panel uses **browser localStorage** — data stays on that device
- For production, consider connecting to a real backend/database
- **UPI payments are manual** — you verify them in your UPI app

---

## 📞 Support

- Change the Discord link in `STORE_CONFIG.discordLink`
- Add your actual Discord server invite link

---

*Built with vanilla HTML, CSS, and JavaScript — no frameworks, no dependencies, hosting-ready.*
