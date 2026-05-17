import { loginUser, registerUser, placeOrder as placeOrderAPI } from './api';
import { useState, useEffect } from "react";

// ─── DATA ───────────────────────────────────────────────────
const PRODUCTS = [
  { id: 1, name: "iPhone 16 Pro Max", category: "smartphones", price: 1199, originalPrice: 1299, rating: 4.9, reviews: 2341, badge: "New", image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&q=80", description: "The most powerful iPhone ever with A18 Pro chip, titanium design, and revolutionary camera system.", specs: { Display: '6.9" Super Retina XDR', Chip: "A18 Pro", Camera: "48MP Triple", Battery: "4685mAh", Storage: "256GB" }, stock: 15, color: "#1a78f2" },
  { id: 2, name: "MacBook Pro M4", category: "laptops", price: 2499, originalPrice: 2699, rating: 4.8, reviews: 1876, badge: "Hot", image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80", description: "Supercharged by M4 Pro chip for ultimate performance in an ultra-thin design.", specs: { Display: '16" Liquid Retina XDR', Chip: "Apple M4 Pro", RAM: "24GB", Storage: "512GB SSD", Battery: "Up to 22 hrs" }, stock: 8, color: "#7c3aed" },
  { id: 3, name: "Sony WH-1000XM6", category: "headphones", price: 399, originalPrice: 449, rating: 4.7, reviews: 3102, badge: "Sale", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80", description: "Industry-leading noise cancellation with 40-hour battery life and premium sound quality.", specs: { Type: "Over-ear", ANC: "Adaptive", Driver: "30mm", Battery: "40 hours", Connectivity: "Bluetooth 5.3" }, stock: 22, color: "#e11d48" },
  { id: 4, name: "Apple Watch Ultra 3", category: "smartwatches", price: 799, originalPrice: 849, rating: 4.8, reviews: 987, badge: "New", image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&q=80", description: "The most rugged and capable Apple Watch for extreme adventures.", specs: { Display: '2.1" OLED', Case: "Titanium 49mm", GPS: "Dual-frequency", Battery: "60 hours", "Water Resistance": "100m" }, stock: 12, color: "#d97706" },
  { id: 5, name: "Samsung Galaxy S25 Ultra", category: "smartphones", price: 1099, originalPrice: 1199, rating: 4.7, reviews: 1654, badge: "Hot", image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80", description: "Galaxy AI-powered flagship with 200MP camera and built-in S Pen.", specs: { Display: '6.9" Dynamic AMOLED', Chip: "Snapdragon 8 Elite", Camera: "200MP Quad", Battery: "5000mAh", Storage: "256GB" }, stock: 19, color: "#0891b2" },
  { id: 6, name: "ASUS ROG Zephyrus G16", category: "laptops", price: 2199, originalPrice: 2399, rating: 4.7, reviews: 512, badge: "Hot", image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500&q=80", description: "Ultimate gaming laptop with ROG Nebula Display and top-tier GPU performance.", specs: { Display: "16\" 240Hz QHD+", CPU: "AMD Ryzen 9", RAM: "32GB", GPU: "RTX 4090", Storage: "1TB SSD" }, stock: 4, color: "#16a34a" },
  { id: 7, name: "AirPods Pro 3", category: "headphones", price: 249, originalPrice: 279, rating: 4.6, reviews: 4210, badge: "New", image: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=500&q=80", description: "Personalized Spatial Audio with dynamic head tracking and Adaptive Audio.", specs: { Type: "In-ear", ANC: "H2 chip", Driver: "Custom Apple", Battery: "30 hours total", Connectivity: "Bluetooth 5.3" }, stock: 34, color: "#1a78f2" },
  { id: 8, name: "Samsung Galaxy Watch 7", category: "smartwatches", price: 299, originalPrice: 349, rating: 4.5, reviews: 1123, badge: "Sale", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80", description: "Advanced health monitoring with BioActive Sensor and Google WearOS.", specs: { Display: '1.5" Super AMOLED', Case: "Titanium", GPS: "Yes", Battery: "40 hours", "Water Resistance": "5ATM" }, stock: 17, color: "#d97706" },
  { id: 9, name: "Google Pixel 9 Pro", category: "smartphones", price: 999, originalPrice: 1099, rating: 4.6, reviews: 876, badge: null, image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&q=80", description: "Google AI at its best with Gemini built-in and the sharpest Pixel camera yet.", specs: { Display: '6.3" LTPO OLED', Chip: "Tensor G4", Camera: "50MP Triple", Battery: "4700mAh", Storage: "128GB" }, stock: 21, color: "#1a78f2" },
  { id: 10, name: "Dell XPS 15 Plus", category: "laptops", price: 1799, originalPrice: 1999, rating: 4.6, reviews: 743, badge: "Sale", image: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=500&q=80", description: "Stunning OLED display meets Intel Core Ultra performance in a sleek chassis.", specs: { Display: '15.6" 3.5K OLED', CPU: "Intel Core Ultra 9", RAM: "32GB", GPU: "RTX 4060", Storage: "1TB SSD" }, stock: 6, color: "#7c3aed" },
  { id: 11, name: "Bose QuietComfort 45", category: "headphones", price: 329, originalPrice: 379, rating: 4.5, reviews: 2187, badge: null, image: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500&q=80", description: "Premium noise cancelling headphones with legendary Bose sound quality.", specs: { Type: "Over-ear", ANC: "Bose Quiet Mode", Driver: "TriPort", Battery: "24 hours", Connectivity: "Bluetooth 5.1" }, stock: 28, color: "#e11d48" },
  { id: 12, name: "Garmin Fenix 8 Pro", category: "smartwatches", price: 899, originalPrice: 999, rating: 4.8, reviews: 634, badge: "New", image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500&q=80", description: "Multi-sport GPS smartwatch with solar charging and military-grade durability.", specs: { Display: "1.4\" Touchscreen", Case: "Titanium 51mm", GPS: "Multi-band", Battery: "29 days", "Water Resistance": "100m" }, stock: 9, color: "#d97706" },
];

const CATEGORIES = [
  { id: "smartphones", name: "Smartphones", icon: "📱", gradient: "linear-gradient(135deg,#1a78f2,#06b6d4)", shadow: "0 8px 32px #1a78f240" },
  { id: "laptops", name: "Laptops", icon: "💻", gradient: "linear-gradient(135deg,#7c3aed,#a855f7)", shadow: "0 8px 32px #7c3aed40" },
  { id: "headphones", name: "Headphones", icon: "🎧", gradient: "linear-gradient(135deg,#e11d48,#f43f5e)", shadow: "0 8px 32px #e11d4840" },
  { id: "smartwatches", name: "Smartwatches", icon: "⌚", gradient: "linear-gradient(135deg,#d97706,#f59e0b)", shadow: "0 8px 32px #d9770640" },
];

const fp = (p) => `$${Number(p).toLocaleString()}`;

// ─── TOAST ──────────────────────────────────────────────────
function Toast({ toasts, remove }) {
  return (
    <div style={{ position: "fixed", top: 80, right: 20, zIndex: 9999, display: "flex", flexDirection: "column", gap: 8 }}>
      {toasts.map(t => (
        <div key={t.id} style={{
          background: t.type === "success" ? "#10b981" : t.type === "error" ? "#ef4444" : "#3b82f6",
          color: "#fff", padding: "12px 20px", borderRadius: 14,
          fontWeight: 700, fontSize: 14, boxShadow: "0 8px 32px #0003",
          display: "flex", alignItems: "center", gap: 8, minWidth: 220,
          animation: "slideIn 0.3s ease",
        }}>
          <span>{t.type === "success" ? "✓" : "ℹ"}</span>
          <span style={{ flex: 1 }}>{t.msg}</span>
          <button onClick={() => remove(t.id)} style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", fontSize: 16, opacity: 0.7 }}>×</button>
        </div>
      ))}
    </div>
  );
}

// ─── STARS ──────────────────────────────────────────────────
function Stars({ rating }) {
  return (
    <span>{[1,2,3,4,5].map(i => <span key={i} style={{ color: i <= Math.round(rating) ? "#f59e0b" : "#e2e8f0", fontSize: 13 }}>★</span>)}</span>
  );
}

// ─── BADGE ──────────────────────────────────────────────────
function Badge({ label }) {
  if (!label) return null;
  const c = { New: "#10b981", Hot: "#ef4444", Sale: "#f59e0b" };
  return <span style={{ background: c[label] || "#3b82f6", color: "#fff", fontSize: 10, fontWeight: 800, padding: "2px 8px", borderRadius: 999, textTransform: "uppercase" }}>{label}</span>;
}

// ─── NAVBAR ─────────────────────────────────────────────────
function Navbar({ page, setPage, cart, wishlist, user, logout }) {
  const [scrolled, setScrolled] = useState(false);
  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const isHome = page === "home";

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) { setPage("products"); setSearchOpen(false); }
  };

  const navBg = isHome && !scrolled ? "transparent" : "rgba(255,255,255,0.92)";
  const textColor = isHome && !scrolled ? "#cbd5e1" : "#64748b";
  const logoColor = isHome && !scrolled ? "#fff" : "#0f172a";

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 200,
      background: navBg, backdropFilter: scrolled || !isHome ? "blur(20px)" : "none",
      borderBottom: scrolled || !isHome ? "1px solid #e2e8f020" : "none",
      transition: "all 0.3s ease", padding: "0 24px",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
        {/* Logo */}
        <div onClick={() => setPage("home")} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", flexShrink: 0 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg,#1a78f2,#7c3aed)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 900, fontSize: 16, fontFamily: "Syne,sans-serif" }}>E</div>
          <span style={{ fontFamily: "Syne,sans-serif", fontWeight: 900, fontSize: 20 }}>
            <span style={{ color: "#1a78f2" }}>Electro</span><span style={{ color: logoColor }}>Nex</span>
          </span>
        </div>

        {/* Links */}
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {[["Home","home"],["Products","products"],["Categories","categories"]].map(([l,p]) => (
            <button key={p} onClick={() => setPage(p)} style={{
              padding: "6px 14px", borderRadius: 10, border: "none", cursor: "pointer",
              background: page === p ? "#eff6ff" : "transparent",
              color: page === p ? "#1a78f2" : textColor,
              fontWeight: 600, fontSize: 14, transition: "all 0.18s",
            }}>{l}</button>
          ))}
        </div>

        {/* Right */}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {/* Search */}
          {searchOpen ? (
            <form onSubmit={handleSearch} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <input autoFocus value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search..." style={{ padding: "6px 12px", borderRadius: 10, border: "1px solid #e2e8f0", fontSize: 13, outline: "none", width: 160 }} />
              <button type="button" onClick={() => setSearchOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, color: "#64748b" }}>×</button>
            </form>
          ) : (
            <button onClick={() => setSearchOpen(true)} style={{ background: "none", border: "none", cursor: "pointer", padding: 8, color: textColor }}>
              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            </button>
          )}

          {/* Wishlist */}
          <button onClick={() => setPage("wishlist")} style={{ background: "none", border: "none", cursor: "pointer", padding: 8, color: wishlist.length ? "#e11d48" : textColor, position: "relative" }}>
            <svg width="18" height="18" fill={wishlist.length ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
            {wishlist.length > 0 && <span style={{ position: "absolute", top: 2, right: 2, width: 14, height: 14, background: "#e11d48", color: "#fff", borderRadius: "50%", fontSize: 9, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>{wishlist.length}</span>}
          </button>

          {/* Cart */}
          <button onClick={() => setPage("cart")} style={{ background: "none", border: "none", cursor: "pointer", padding: 8, color: textColor, position: "relative" }}>
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
            {cartCount > 0 && <span style={{ position: "absolute", top: 2, right: 2, width: 14, height: 14, background: "#1a78f2", color: "#fff", borderRadius: "50%", fontSize: 9, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>{cartCount}</span>}
          </button>

          {/* User */}
          {user ? (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div onClick={() => setPage("profile")} style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg,#1a78f2,#7c3aed)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 13, cursor: "pointer" }}>{user.name[0]}</div>
              <button onClick={logout} style={{ padding: "6px 14px", background: "#fee2e2", color: "#ef4444", border: "none", borderRadius: 10, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>Logout</button>
            </div>
          ) : (
            <button onClick={() => setPage("login")} style={{ padding: "8px 18px", background: "linear-gradient(135deg,#1a78f2,#7c3aed)", color: "#fff", border: "none", borderRadius: 10, fontWeight: 700, fontSize: 13, cursor: "pointer", boxShadow: "0 4px 16px #1a78f230" }}>Sign In</button>
          )}
        </div>
      </div>
    </nav>
  );
}

// ─── FOOTER ─────────────────────────────────────────────────
function Footer({ setPage }) {
  return (
    <footer style={{ background: "#0f172a", color: "#94a3b8", padding: "60px 24px 32px", marginTop: 80 }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 40, marginBottom: 40 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <div style={{ width: 34, height: 34, borderRadius: 10, background: "linear-gradient(135deg,#1a78f2,#7c3aed)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 900, fontSize: 15 }}>E</div>
              <span style={{ fontFamily: "Syne,sans-serif", fontWeight: 900, fontSize: 18, color: "#fff" }}>ElectroNex</span>
            </div>
            <p style={{ fontSize: 13, lineHeight: 1.8, color: "#475569", maxWidth: 220 }}>Your premium destination for the latest electronics. Quality and innovation since 2020.</p>
          </div>
          {[
            { title: "Shop", links: [["Smartphones","products"],["Laptops","products"],["Headphones","products"],["Smartwatches","products"]] },
            { title: "Company", links: [["About Us","home"],["Careers","home"],["Blog","home"],["Contact","home"]] },
            { title: "Support", links: [["Help Center","home"],["Track Order","orders"],["Returns","home"],["FAQ","home"]] },
          ].map(col => (
            <div key={col.title}>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: 14, marginBottom: 14, fontFamily: "Syne,sans-serif" }}>{col.title}</div>
              {col.links.map(([l, p]) => (
                <div key={l} style={{ marginBottom: 8 }}>
                  <span onClick={() => setPage(p)} style={{ color: "#475569", fontSize: 13, cursor: "pointer", transition: "color 0.18s" }}
                    onMouseEnter={e => e.target.style.color = "#1a78f2"}
                    onMouseLeave={e => e.target.style.color = "#475569"}>{l}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div style={{ borderTop: "1px solid #1e293b", paddingTop: 24, textAlign: "center", fontSize: 13, color: "#334155" }}>
          © 2025 ElectroNex. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

// ─── PRODUCT CARD ────────────────────────────────────────────
function ProductCard({ p, setPage, addToCart, addToWishlist, wishlist }) {
  const [hovered, setHovered] = useState(false);
  const inWish = wishlist.includes(p.id);
  const disc = Math.round((1 - p.price / p.originalPrice) * 100);
  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ background: "#fff", borderRadius: 20, border: hovered ? `1.5px solid ${p.color}44` : "1.5px solid #f1f5f9", boxShadow: hovered ? `0 20px 48px ${p.color}18` : "0 2px 12px #0001", transition: "all 0.28s", transform: hovered ? "translateY(-4px)" : "none", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <div style={{ position: "relative", background: "#f8fafc", height: 200, overflow: "hidden", cursor: "pointer" }} onClick={() => setPage({ name: "product", id: p.id })}>
        <img src={p.image} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover", transform: hovered ? "scale(1.08)" : "scale(1)", transition: "transform 0.5s" }} />
        <div style={{ position: "absolute", top: 12, left: 12, display: "flex", flexDirection: "column", gap: 4 }}>
          <Badge label={p.badge} />
          {disc > 0 && <span style={{ background: "#1a78f2", color: "#fff", fontSize: 10, fontWeight: 800, padding: "2px 8px", borderRadius: 999 }}>-{disc}%</span>}
        </div>
        <button onClick={e => { e.stopPropagation(); addToWishlist(p.id); }} style={{ position: "absolute", top: 12, right: 12, width: 34, height: 34, borderRadius: "50%", background: "#fff", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, boxShadow: "0 2px 8px #0002", color: inWish ? "#e11d48" : "#9ca3af", transition: "all 0.2s" }}>
          {inWish ? "♥" : "♡"}
        </button>
      </div>
      <div style={{ padding: "16px", flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: p.color, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 4 }}>{p.category}</div>
        <div onClick={() => setPage({ name: "product", id: p.id })} style={{ fontWeight: 800, fontSize: 14, color: "#0f172a", marginBottom: 6, lineHeight: 1.3, cursor: "pointer" }}>{p.name}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
          <Stars rating={p.rating} />
          <span style={{ fontSize: 11, color: "#94a3b8" }}>({p.reviews.toLocaleString()})</span>
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 12 }}>
          <span style={{ fontWeight: 900, fontSize: 18, color: "#0f172a" }}>{fp(p.price)}</span>
          <span style={{ fontSize: 12, color: "#cbd5e1", textDecoration: "line-through" }}>{fp(p.originalPrice)}</span>
        </div>
        <button onClick={() => addToCart(p)} style={{ marginTop: "auto", padding: "10px 0", background: hovered ? p.color : "#f1f5f9", color: hovered ? "#fff" : "#475569", border: "none", borderRadius: 12, fontWeight: 700, fontSize: 13, cursor: "pointer", transition: "all 0.22s", boxShadow: hovered ? `0 4px 20px ${p.color}44` : "none" }}>
          Add to Cart
        </button>
      </div>
    </div>
  );
}

// ─── HOME PAGE ───────────────────────────────────────────────
function HomePage({ setPage, addToCart, addToWishlist, wishlist }) {
  const [heroIdx, setHeroIdx] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  const heroes = [
    { name: "iPhone 16 Pro Max", tag: "Just Launched", price: "$1,199", desc: "Titanium. A18 Pro. Camera revolution.", img: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=700&q=90", from: "#0f172a", to: "#1e3a5f", accent: "#38bdf8" },
    { name: "MacBook Pro M4", tag: "Bestseller", price: "$2,499", desc: "Up to 22 hours. Unbeatable performance.", img: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=700&q=90", from: "#1a0a2e", to: "#2d1b69", accent: "#a78bfa" },
    { name: "Sony WH-1000XM6", tag: "Best ANC", price: "$399", desc: "40-hour battery. Industry-leading quiet.", img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=700&q=90", from: "#1f0a0a", to: "#4a0f1e", accent: "#fb7185" },
  ];
  const hp = heroes[heroIdx];

  useEffect(() => {
    const t = setInterval(() => setHeroIdx(i => (i + 1) % 3), 4000);
    return () => clearInterval(t);
  }, []);

  return (
    <div>
      {/* HERO */}
      <section style={{ minHeight: "100vh", background: `linear-gradient(135deg,${hp.from},${hp.to})`, transition: "background 1.2s ease", display: "flex", alignItems: "center", padding: "80px 24px 60px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle,#ffffff08 1px,transparent 1px)", backgroundSize: "40px 40px", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "10%", left: "5%", width: 400, height: 400, borderRadius: "50%", background: `${hp.accent}12`, filter: "blur(80px)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 1200, margin: "0 auto", width: "100%", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: `${hp.accent}22`, border: `1px solid ${hp.accent}44`, borderRadius: 999, padding: "6px 16px", marginBottom: 28 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: hp.accent }} />
              <span style={{ color: hp.accent, fontSize: 13, fontWeight: 700 }}>{hp.tag}</span>
            </div>
            <h1 style={{ fontFamily: "Syne,sans-serif", fontWeight: 900, fontSize: "3.4rem", lineHeight: 1.08, color: "#fff", letterSpacing: "-0.03em", marginBottom: 16 }}>{hp.name}</h1>
            <p style={{ color: "#94a3b8", fontSize: 17, lineHeight: 1.6, marginBottom: 32, maxWidth: 400 }}>{hp.desc}</p>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 48, flexWrap: "wrap" }}>
              <span style={{ fontFamily: "Syne,sans-serif", fontWeight: 900, fontSize: "2.2rem", color: "#fff" }}>{hp.price}</span>
              <button onClick={() => setPage("products")} style={{ padding: "14px 32px", background: `linear-gradient(135deg,${hp.accent},${hp.accent}bb)`, color: "#fff", border: "none", borderRadius: 14, fontWeight: 800, fontSize: 15, cursor: "pointer", boxShadow: `0 8px 32px ${hp.accent}44` }}>Shop Now →</button>
              <button onClick={() => setPage({ name: "product", id: heroIdx + 1 })} style={{ padding: "14px 24px", background: "rgba(255,255,255,0.08)", color: "#fff", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 14, fontWeight: 700, fontSize: 15, cursor: "pointer" }}>View Details</button>
            </div>
            <div style={{ display: "flex", gap: 32 }}>
              {[["50K+","Products"],["4.9★","Rating"],["Free","Delivery"]].map(([v,l]) => (
                <div key={l}><div style={{ fontFamily: "Syne,sans-serif", fontWeight: 900, fontSize: 22, color: "#fff" }}>{v}</div><div style={{ color: "#64748b", fontSize: 13, fontWeight: 600 }}>{l}</div></div>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "center", position: "relative" }}>
            <div style={{ position: "absolute", width: 350, height: 350, borderRadius: "50%", background: `${hp.accent}15`, filter: "blur(40px)" }} />
            <img key={heroIdx} src={hp.img} alt={hp.name} style={{ position: "relative", width: 320, height: 320, objectFit: "cover", borderRadius: 32, boxShadow: `0 40px 80px ${hp.accent}30` }} />
          </div>
        </div>
        <div style={{ position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 8 }}>
          {heroes.map((_, i) => (
            <button key={i} onClick={() => setHeroIdx(i)} style={{ width: i === heroIdx ? 24 : 8, height: 8, borderRadius: 999, border: "none", cursor: "pointer", background: i === heroIdx ? "#fff" : "rgba(255,255,255,0.3)", transition: "all 0.3s" }} />
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      <section style={{ padding: "80px 24px", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h2 style={{ fontFamily: "Syne,sans-serif", fontWeight: 900, fontSize: "2.2rem", color: "#0f172a" }}>Shop by Category</h2>
          <p style={{ color: "#94a3b8", marginTop: 8 }}>Find exactly what you're looking for</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20 }}>
          {CATEGORIES.map(c => (
            <div key={c.id} onClick={() => setPage({ name: "products", category: c.id })}
              style={{ background: c.gradient, borderRadius: 24, padding: "32px 24px", color: "#fff", cursor: "pointer", transition: "all 0.3s", boxShadow: c.shadow, position: "relative", overflow: "hidden" }}
              onMouseEnter={e => e.currentTarget.style.transform = "translateY(-6px) scale(1.03)"}
              onMouseLeave={e => e.currentTarget.style.transform = "none"}>
              <div style={{ position: "absolute", bottom: -20, right: -20, width: 100, height: 100, borderRadius: "50%", background: "rgba(255,255,255,0.1)" }} />
              <div style={{ fontSize: 40, marginBottom: 14 }}>{c.icon}</div>
              <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 900, fontSize: 18, marginBottom: 4 }}>{c.name}</div>
              <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 13 }}>{PRODUCTS.filter(p => p.category === c.id).length * 3}+ items</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED */}
      <section style={{ padding: "0 24px 80px", background: "#f8fafc" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", paddingTop: 60 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 36 }}>
            <div>
              <div style={{ display: "inline-block", background: "#fef3c7", color: "#d97706", fontWeight: 700, fontSize: 11, padding: "4px 14px", borderRadius: 999, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>🔥 Featured</div>
              <h2 style={{ fontFamily: "Syne,sans-serif", fontWeight: 900, fontSize: "2rem", color: "#0f172a" }}>Top Picks for You</h2>
            </div>
            <button onClick={() => setPage("products")} style={{ padding: "10px 22px", background: "#f1f5f9", color: "#475569", border: "none", borderRadius: 12, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>View All →</button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20 }}>
            {PRODUCTS.slice(0, 4).map(p => <ProductCard key={p.id} p={p} setPage={setPage} addToCart={addToCart} addToWishlist={addToWishlist} wishlist={wishlist} />)}
          </div>
        </div>
      </section>

      {/* PROMO */}
      <section style={{ padding: "60px 24px", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ borderRadius: 28, background: "linear-gradient(135deg,#0f172a,#1e1b4b)", padding: "56px 48px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 32, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, right: 0, width: 400, height: 400, background: "radial-gradient(circle,#7c3aed22 0%,transparent 70%)", pointerEvents: "none" }} />
          <div>
            <div style={{ color: "#a78bfa", fontWeight: 700, fontSize: 13, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>🎉 Limited Time Deal</div>
            <h2 style={{ fontFamily: "Syne,sans-serif", fontWeight: 900, fontSize: "2.6rem", color: "#fff", lineHeight: 1.1, marginBottom: 12 }}>Up to 30% Off<br />On All Laptops</h2>
            <p style={{ color: "#64748b", fontSize: 15 }}>Our biggest sale of the year. Don't miss out!</p>
          </div>
          <button onClick={() => setPage({ name: "products", category: "laptops" })} style={{ padding: "18px 40px", background: "linear-gradient(135deg,#1a78f2,#7c3aed)", color: "#fff", border: "none", borderRadius: 16, fontWeight: 800, fontSize: 16, cursor: "pointer", boxShadow: "0 8px 32px #7c3aed44", flexShrink: 0 }}>Shop Laptops →</button>
        </div>
      </section>

      {/* TRENDING */}
      <section style={{ padding: "0 24px 80px", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 36 }}>
          <h2 style={{ fontFamily: "Syne,sans-serif", fontWeight: 900, fontSize: "2rem", color: "#0f172a" }}>🔥 Trending Now</h2>
          <button onClick={() => setPage("products")} style={{ padding: "10px 22px", background: "#f1f5f9", color: "#475569", border: "none", borderRadius: 12, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>See All →</button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20 }}>
          {PRODUCTS.slice(4, 8).map(p => <ProductCard key={p.id} p={p} setPage={setPage} addToCart={addToCart} addToWishlist={addToWishlist} wishlist={wishlist} />)}
        </div>
      </section>

      {/* TRUST */}
      <section style={{ padding: "0 24px 80px", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20 }}>
          {[{ icon: "🚚", title: "Free Shipping", desc: "On orders over $99", accent: "#1a78f2" }, { icon: "🔒", title: "Secure Payments", desc: "256-bit SSL encryption", accent: "#16a34a" }, { icon: "↩️", title: "Easy Returns", desc: "30-day hassle-free", accent: "#ea580c" }, { icon: "💬", title: "24/7 Support", desc: "Real humans, always", accent: "#9333ea" }].map(f => (
            <div key={f.title} style={{ background: "#fff", border: "1.5px solid #f1f5f9", borderRadius: 20, padding: "28px 20px", textAlign: "center", transition: "all 0.2s", cursor: "default" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = f.accent + "44"; e.currentTarget.style.boxShadow = `0 8px 32px ${f.accent}15`; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#f1f5f9"; e.currentTarget.style.boxShadow = "none"; }}>
              <div style={{ fontSize: 34, marginBottom: 12 }}>{f.icon}</div>
              <div style={{ fontWeight: 800, color: "#0f172a", fontSize: 15, marginBottom: 4 }}>{f.title}</div>
              <div style={{ color: "#94a3b8", fontSize: 13 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      <Footer setPage={setPage} />
    </div>
  );
}

// ─── PRODUCTS PAGE ───────────────────────────────────────────
function ProductsPage({ setPage, addToCart, addToWishlist, wishlist, initialCategory }) {
  const [category, setCategory] = useState(initialCategory || "all");
  const [sort, setSort] = useState("default");
  const [search, setSearch] = useState("");
  const [maxPrice, setMaxPrice] = useState(3000);

  const filtered = PRODUCTS.filter(p => {
    if (category !== "all" && p.category !== category) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (p.price > maxPrice) return false;
    return true;
  }).sort((a, b) => {
    if (sort === "price-asc") return a.price - b.price;
    if (sort === "price-desc") return b.price - a.price;
    if (sort === "rating") return b.rating - a.rating;
    return 0;
  });

  return (
    <div style={{ paddingTop: 64, minHeight: "100vh", background: "#f8fafc" }}>
      <div style={{ background: "linear-gradient(135deg,#0f172a,#1e3a5f)", padding: "40px 24px 60px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <h1 style={{ fontFamily: "Syne,sans-serif", fontWeight: 900, fontSize: "2.4rem", color: "#fff", marginBottom: 8 }}>All Products</h1>
          <p style={{ color: "#64748b" }}>{filtered.length} products found</p>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px" }}>
        {/* Filters */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 24, alignItems: "center" }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Search products..." style={{ flex: 1, minWidth: 200, padding: "10px 16px", borderRadius: 12, border: "1.5px solid #e2e8f0", fontSize: 14, outline: "none", background: "#fff" }} />
          <select value={category} onChange={e => setCategory(e.target.value)} style={{ padding: "10px 16px", borderRadius: 12, border: "1.5px solid #e2e8f0", fontSize: 14, outline: "none", background: "#fff", cursor: "pointer" }}>
            <option value="all">All Categories</option>
            {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <select value={sort} onChange={e => setSort(e.target.value)} style={{ padding: "10px 16px", borderRadius: 12, border: "1.5px solid #e2e8f0", fontSize: 14, outline: "none", background: "#fff", cursor: "pointer" }}>
            <option value="default">Sort By</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#fff", padding: "10px 16px", borderRadius: 12, border: "1.5px solid #e2e8f0" }}>
            <span style={{ fontSize: 13, color: "#64748b" }}>Max: </span>
            <input type="range" min={100} max={3000} step={100} value={maxPrice} onChange={e => setMaxPrice(+e.target.value)} style={{ width: 80, accentColor: "#1a78f2" }} />
            <span style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>{fp(maxPrice)}</span>
          </div>
        </div>

        {/* Category Pills */}
        <div style={{ display: "flex", gap: 8, marginBottom: 28, flexWrap: "wrap" }}>
          {["all", ...CATEGORIES.map(c => c.id)].map(c => (
            <button key={c} onClick={() => setCategory(c)} style={{ padding: "8px 18px", borderRadius: 999, border: "none", cursor: "pointer", fontWeight: 700, fontSize: 13, transition: "all 0.18s", background: category === c ? "#1a78f2" : "#fff", color: category === c ? "#fff" : "#64748b", boxShadow: category === c ? "0 4px 16px #1a78f230" : "0 1px 4px #0001" }}>
              {c === "all" ? "All" : CATEGORIES.find(x => x.id === c)?.name}
            </button>
          ))}
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>🔍</div>
            <h3 style={{ fontFamily: "Syne,sans-serif", fontSize: "1.4rem", color: "#0f172a", marginBottom: 8 }}>No products found</h3>
            <p style={{ color: "#94a3b8" }}>Try adjusting your filters</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(250px,1fr))", gap: 20 }}>
            {filtered.map(p => <ProductCard key={p.id} p={p} setPage={setPage} addToCart={addToCart} addToWishlist={addToWishlist} wishlist={wishlist} />)}
          </div>
        )}
      </div>
      <Footer setPage={setPage} />
    </div>
  );
}

// ─── PRODUCT DETAIL PAGE ─────────────────────────────────────
function ProductDetailPage({ productId, setPage, addToCart, addToWishlist, wishlist }) {
  const p = PRODUCTS.find(x => x.id === productId);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState("desc");
  const inWish = wishlist.includes(p?.id);
  const related = PRODUCTS.filter(x => x.category === p?.category && x.id !== p?.id).slice(0, 4);

  if (!p) return <div style={{ textAlign: "center", padding: 80 }}>Product not found</div>;
  const disc = Math.round((1 - p.price / p.originalPrice) * 100);

  return (
    <div style={{ paddingTop: 64, minHeight: "100vh", background: "#f8fafc" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px" }}>
        {/* Breadcrumb */}
        <div style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 13, color: "#94a3b8", marginBottom: 32 }}>
          <span onClick={() => setPage("home")} style={{ cursor: "pointer", color: "#1a78f2" }}>Home</span>
          <span>/</span>
          <span onClick={() => setPage("products")} style={{ cursor: "pointer", color: "#1a78f2" }}>Products</span>
          <span>/</span>
          <span style={{ color: "#0f172a", fontWeight: 600 }}>{p.name}</span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, marginBottom: 60 }}>
          {/* Image */}
          <div style={{ position: "relative", background: "#fff", borderRadius: 28, overflow: "hidden", aspectRatio: "1", border: "1.5px solid #f1f5f9" }}>
            <img src={p.image} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            {disc > 0 && <div style={{ position: "absolute", top: 16, right: 16, background: "#1a78f2", color: "#fff", fontWeight: 800, fontSize: 14, padding: "4px 12px", borderRadius: 999 }}>-{disc}%</div>}
          </div>

          {/* Info */}
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: p.color, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>{p.category}</div>
            <h1 style={{ fontFamily: "Syne,sans-serif", fontWeight: 900, fontSize: "2rem", color: "#0f172a", marginBottom: 16, lineHeight: 1.2 }}>{p.name}</h1>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <Stars rating={p.rating} />
              <span style={{ fontWeight: 700, color: "#0f172a" }}>{p.rating}</span>
              <span style={{ color: "#94a3b8", fontSize: 13 }}>({p.reviews.toLocaleString()} reviews)</span>
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 20 }}>
              <span style={{ fontFamily: "Syne,sans-serif", fontWeight: 900, fontSize: "2.4rem", color: "#0f172a" }}>{fp(p.price)}</span>
              <span style={{ fontSize: 18, color: "#cbd5e1", textDecoration: "line-through" }}>{fp(p.originalPrice)}</span>
              <span style={{ color: "#10b981", fontWeight: 700, fontSize: 14 }}>Save {fp(p.originalPrice - p.price)}</span>
            </div>

            {/* Stock */}
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px", borderRadius: 999, background: p.stock > 10 ? "#f0fdf4" : "#fef3c7", color: p.stock > 10 ? "#16a34a" : "#d97706", fontWeight: 700, fontSize: 13, marginBottom: 24 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: p.stock > 10 ? "#16a34a" : "#d97706" }} />
              {p.stock > 10 ? "In Stock" : `Only ${p.stock} left`}
            </div>

            {/* Qty */}
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
              <span style={{ fontWeight: 600, color: "#475569", fontSize: 14 }}>Quantity:</span>
              <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#f1f5f9", borderRadius: 12, padding: 4 }}>
                <button onClick={() => setQty(Math.max(1, qty - 1))} style={{ width: 32, height: 32, borderRadius: 8, background: "#fff", border: "none", cursor: "pointer", fontWeight: 800, fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>−</button>
                <span style={{ width: 32, textAlign: "center", fontWeight: 800, fontSize: 16 }}>{qty}</span>
                <button onClick={() => setQty(Math.min(p.stock, qty + 1))} style={{ width: 32, height: 32, borderRadius: 8, background: "#fff", border: "none", cursor: "pointer", fontWeight: 800, fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
              </div>
            </div>

            {/* Buttons */}
            <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
              <button onClick={() => addToCart(p, qty)} style={{ flex: 1, padding: "14px 0", background: "#f1f5f9", color: "#0f172a", border: "none", borderRadius: 14, fontWeight: 800, fontSize: 15, cursor: "pointer", transition: "all 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.background = "#e2e8f0"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "#f1f5f9"; }}>
                Add to Cart
              </button>
              <button onClick={() => { addToCart(p, qty); setPage("cart"); }} style={{ flex: 1, padding: "14px 0", background: "linear-gradient(135deg,#1a78f2,#7c3aed)", color: "#fff", border: "none", borderRadius: 14, fontWeight: 800, fontSize: 15, cursor: "pointer", boxShadow: "0 4px 20px #1a78f230" }}>
                Buy Now
              </button>
              <button onClick={() => addToWishlist(p.id)} style={{ width: 52, height: 52, borderRadius: 14, border: `2px solid ${inWish ? "#e11d48" : "#e2e8f0"}`, background: inWish ? "#fee2e2" : "#fff", color: inWish ? "#e11d48" : "#94a3b8", fontSize: 20, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}>
                {inWish ? "♥" : "♡"}
              </button>
            </div>

            {/* Specs */}
            <div style={{ background: "#f8fafc", borderRadius: 16, padding: 20 }}>
              <div style={{ fontWeight: 800, color: "#0f172a", marginBottom: 12 }}>Key Specifications</div>
              {Object.entries(p.specs).map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #f1f5f9", fontSize: 13 }}>
                  <span style={{ color: "#94a3b8" }}>{k}</span>
                  <span style={{ fontWeight: 700, color: "#0f172a" }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ display: "flex", gap: 24, borderBottom: "2px solid #f1f5f9", marginBottom: 24 }}>
            {[["desc","Description"],["specs","Full Specs"]].map(([t,l]) => (
              <button key={t} onClick={() => setTab(t)} style={{ padding: "10px 0", fontWeight: 700, fontSize: 14, border: "none", background: "none", cursor: "pointer", color: tab === t ? "#1a78f2" : "#94a3b8", borderBottom: tab === t ? "2px solid #1a78f2" : "2px solid transparent", marginBottom: -2, transition: "all 0.2s" }}>{l}</button>
            ))}
          </div>
          {tab === "desc" ? (
            <p style={{ color: "#475569", lineHeight: 1.8, fontSize: 15 }}>{p.description}</p>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {Object.entries(p.specs).map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "12px 16px", background: "#fff", borderRadius: 12, border: "1.5px solid #f1f5f9", fontSize: 14 }}>
                  <span style={{ color: "#94a3b8", fontWeight: 600 }}>{k}</span>
                  <span style={{ fontWeight: 800, color: "#0f172a" }}>{v}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div>
            <h2 style={{ fontFamily: "Syne,sans-serif", fontWeight: 900, fontSize: "1.6rem", color: "#0f172a", marginBottom: 24 }}>Related Products</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20 }}>
              {related.map(rp => <ProductCard key={rp.id} p={rp} setPage={setPage} addToCart={addToCart} addToWishlist={addToWishlist} wishlist={wishlist} />)}
            </div>
          </div>
        )}
      </div>
      <Footer setPage={setPage} />
    </div>
  );
}

// ─── CATEGORIES PAGE ─────────────────────────────────────────
function CategoriesPage({ setPage }) {
  return (
    <div style={{ paddingTop: 64, minHeight: "100vh", background: "#f8fafc" }}>
      <div style={{ background: "linear-gradient(135deg,#0f172a,#1e3a5f)", padding: "60px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", textAlign: "center" }}>
          <h1 style={{ fontFamily: "Syne,sans-serif", fontWeight: 900, fontSize: "2.6rem", color: "#fff", marginBottom: 12 }}>All Categories</h1>
          <p style={{ color: "#64748b" }}>Explore our wide range of electronics</p>
        </div>
      </div>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "60px 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 24 }}>
          {CATEGORIES.map(c => {
            const catProducts = PRODUCTS.filter(p => p.category === c.id);
            return (
              <div key={c.id} onClick={() => setPage({ name: "products", category: c.id })}
                style={{ background: c.gradient, borderRadius: 28, padding: "40px", color: "#fff", cursor: "pointer", transition: "all 0.3s", boxShadow: c.shadow, display: "flex", alignItems: "center", gap: 32, position: "relative", overflow: "hidden" }}
                onMouseEnter={e => e.currentTarget.style.transform = "translateY(-4px)"}
                onMouseLeave={e => e.currentTarget.style.transform = "none"}>
                <div style={{ position: "absolute", bottom: -30, right: -30, width: 160, height: 160, borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />
                <div style={{ fontSize: 64 }}>{c.icon}</div>
                <div>
                  <h2 style={{ fontFamily: "Syne,sans-serif", fontWeight: 900, fontSize: "1.8rem", marginBottom: 8 }}>{c.name}</h2>
                  <p style={{ color: "rgba(255,255,255,0.75)", marginBottom: 16, fontSize: 14 }}>{catProducts.length * 3}+ products available</p>
                  <div style={{ display: "flex", gap: 8 }}>
                    {catProducts.slice(0, 3).map(p => (
                      <img key={p.id} src={p.image} alt={p.name} style={{ width: 48, height: 48, borderRadius: 10, objectFit: "cover", border: "2px solid rgba(255,255,255,0.3)" }} />
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <Footer setPage={setPage} />
    </div>
  );
}

// ─── CART PAGE ───────────────────────────────────────────────
function CartPage({ setPage, cart, updateQty, removeItem }) {
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = subtotal > 99 ? 0 : 9.99;
  const total = subtotal + shipping;

  if (cart.length === 0) return (
    <div style={{ paddingTop: 64, minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#f8fafc" }}>
      <div style={{ fontSize: 72, marginBottom: 20 }}>🛒</div>
      <h2 style={{ fontFamily: "Syne,sans-serif", fontWeight: 900, fontSize: "1.8rem", color: "#0f172a", marginBottom: 8 }}>Your cart is empty</h2>
      <p style={{ color: "#94a3b8", marginBottom: 28 }}>Add some products to get started!</p>
      <button onClick={() => setPage("products")} style={{ padding: "14px 32px", background: "linear-gradient(135deg,#1a78f2,#7c3aed)", color: "#fff", border: "none", borderRadius: 14, fontWeight: 800, fontSize: 15, cursor: "pointer" }}>Browse Products</button>
    </div>
  );

  return (
    <div style={{ paddingTop: 64, minHeight: "100vh", background: "#f8fafc" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 24px" }}>
        <h1 style={{ fontFamily: "Syne,sans-serif", fontWeight: 900, fontSize: "2rem", color: "#0f172a", marginBottom: 32 }}>Shopping Cart <span style={{ color: "#94a3b8", fontWeight: 500, fontSize: "1.2rem" }}>({cart.reduce((s,i)=>s+i.qty,0)} items)</span></h1>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 32 }}>
          {/* Items */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {cart.map(item => (
              <div key={item.id} style={{ background: "#fff", borderRadius: 20, border: "1.5px solid #f1f5f9", padding: 20, display: "flex", gap: 16, alignItems: "center" }}>
                <img src={item.image} alt={item.name} onClick={() => setPage({ name: "product", id: item.id })} style={{ width: 90, height: 90, objectFit: "cover", borderRadius: 14, background: "#f8fafc", cursor: "pointer" }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: item.color || "#1a78f2", textTransform: "uppercase", marginBottom: 4 }}>{item.category}</div>
                  <div style={{ fontWeight: 800, color: "#0f172a", fontSize: 15, marginBottom: 12 }}>{item.name}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#f1f5f9", borderRadius: 10, padding: 4 }}>
                      <button onClick={() => updateQty(item.id, item.qty - 1)} style={{ width: 28, height: 28, borderRadius: 8, background: "#fff", border: "none", cursor: "pointer", fontWeight: 800 }}>−</button>
                      <span style={{ width: 24, textAlign: "center", fontWeight: 800 }}>{item.qty}</span>
                      <button onClick={() => updateQty(item.id, item.qty + 1)} style={{ width: 28, height: 28, borderRadius: 8, background: "#fff", border: "none", cursor: "pointer", fontWeight: 800 }}>+</button>
                    </div>
                    <span style={{ fontWeight: 900, fontSize: 17, color: "#0f172a" }}>{fp(item.price * item.qty)}</span>
                  </div>
                </div>
                <button onClick={() => removeItem(item.id)} style={{ padding: 8, background: "#fee2e2", border: "none", borderRadius: 10, cursor: "pointer", color: "#ef4444", fontSize: 16 }}>🗑</button>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div style={{ position: "sticky", top: 84 }}>
            <div style={{ background: "#fff", borderRadius: 24, border: "1.5px solid #f1f5f9", padding: 28 }}>
              <h2 style={{ fontFamily: "Syne,sans-serif", fontWeight: 900, fontSize: "1.2rem", color: "#0f172a", marginBottom: 20 }}>Order Summary</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: "#64748b" }}>
                  <span>Subtotal</span><span style={{ fontWeight: 700, color: "#0f172a" }}>{fp(subtotal)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: "#64748b" }}>
                  <span>Shipping</span><span style={{ fontWeight: 700, color: shipping === 0 ? "#10b981" : "#0f172a" }}>{shipping === 0 ? "FREE" : fp(shipping)}</span>
                </div>
                {shipping > 0 && <div style={{ background: "#eff6ff", borderRadius: 10, padding: "8px 12px", fontSize: 12, color: "#1a78f2", textAlign: "center" }}>Add {fp(99 - subtotal)} more for free shipping!</div>}
                <div style={{ borderTop: "1.5px solid #f1f5f9", paddingTop: 12, display: "flex", justifyContent: "space-between", fontWeight: 900, color: "#0f172a" }}>
                  <span>Total</span><span style={{ fontSize: 20 }}>{fp(total)}</span>
                </div>
              </div>
              <button onClick={() => setPage("checkout")} style={{ width: "100%", padding: "14px 0", background: "linear-gradient(135deg,#1a78f2,#7c3aed)", color: "#fff", border: "none", borderRadius: 14, fontWeight: 800, fontSize: 15, cursor: "pointer", marginBottom: 10 }}>Proceed to Checkout →</button>
              <button onClick={() => setPage("products")} style={{ width: "100%", padding: "12px 0", background: "transparent", color: "#1a78f2", border: "none", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>Continue Shopping</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── WISHLIST PAGE ───────────────────────────────────────────
function WishlistPage({ setPage, wishlist, addToCart, addToWishlist }) {
  const items = PRODUCTS.filter(p => wishlist.includes(p.id));
  return (
    <div style={{ paddingTop: 64, minHeight: "100vh", background: "#f8fafc" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 24px" }}>
        <h1 style={{ fontFamily: "Syne,sans-serif", fontWeight: 900, fontSize: "2rem", color: "#0f172a", marginBottom: 32 }}>❤️ My Wishlist <span style={{ color: "#94a3b8", fontWeight: 500, fontSize: "1.2rem" }}>({items.length} items)</span></h1>
        {items.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <div style={{ fontSize: 72, marginBottom: 20 }}>♡</div>
            <h2 style={{ fontFamily: "Syne,sans-serif", fontWeight: 900, fontSize: "1.6rem", color: "#0f172a", marginBottom: 8 }}>Your wishlist is empty</h2>
            <p style={{ color: "#94a3b8", marginBottom: 28 }}>Save your favourite products here</p>
            <button onClick={() => setPage("products")} style={{ padding: "14px 32px", background: "linear-gradient(135deg,#1a78f2,#7c3aed)", color: "#fff", border: "none", borderRadius: 14, fontWeight: 800, cursor: "pointer" }}>Browse Products</button>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(250px,1fr))", gap: 20 }}>
            {items.map(p => <ProductCard key={p.id} p={p} setPage={setPage} addToCart={addToCart} addToWishlist={addToWishlist} wishlist={wishlist} />)}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── LOGIN PAGE ──────────────────────────────────────────────
function LoginPage({ setPage, setUser, showToast }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handle = async (e) => {
  e.preventDefault();
  setLoading(true);
  try {
    const data = mode === "login"
      ? await loginUser(form.email, form.password)
      : await registerUser(form.name, form.email, form.password);

    if (data.error) {
      showToast(data.error, "error");
      setLoading(false);
      return;
    }

    localStorage.setItem("token", data.token);
    setUser(data.user);
    showToast(mode === "login" ? "Welcome back! 👋" : "Account created! 🎉");
    setPage("home");
  } catch {
    showToast("Something went wrong!", "error");
  }
  setLoading(false);
};

  return (
    <div style={{ paddingTop: 64, minHeight: "100vh", background: "linear-gradient(135deg,#0f172a,#1e3a5f)", display: "flex", alignItems: "center", justifyContent: "center", padding: "80px 24px" }}>
      <div style={{ background: "#fff", borderRadius: 28, padding: "48px 40px", width: "100%", maxWidth: 440, boxShadow: "0 40px 80px #0003" }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: "linear-gradient(135deg,#1a78f2,#7c3aed)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: 22 }}>⚡</div>
          <h1 style={{ fontFamily: "Syne,sans-serif", fontWeight: 900, fontSize: "1.8rem", color: "#0f172a", marginBottom: 6 }}>{mode === "login" ? "Welcome Back" : "Create Account"}</h1>
          <p style={{ color: "#94a3b8", fontSize: 14 }}>{mode === "login" ? "Sign in to your account" : "Join ElectroNex today"}</p>
        </div>

        <form onSubmit={handle} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {mode === "signup" && (
            <div>
              <label style={{ display: "block", fontWeight: 700, fontSize: 13, color: "#475569", marginBottom: 6 }}>Full Name</label>
              <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="John Doe" style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: "1.5px solid #e2e8f0", fontSize: 14, outline: "none", boxSizing: "border-box" }}
                onFocus={e => e.target.style.borderColor = "#1a78f2"}
                onBlur={e => e.target.style.borderColor = "#e2e8f0"} />
            </div>
          )}
          <div>
            <label style={{ display: "block", fontWeight: 700, fontSize: 13, color: "#475569", marginBottom: 6 }}>Email Address</label>
            <input required type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="you@example.com" style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: "1.5px solid #e2e8f0", fontSize: 14, outline: "none", boxSizing: "border-box" }}
              onFocus={e => e.target.style.borderColor = "#1a78f2"}
              onBlur={e => e.target.style.borderColor = "#e2e8f0"} />
          </div>
          <div>
            <label style={{ display: "block", fontWeight: 700, fontSize: 13, color: "#475569", marginBottom: 6 }}>Password</label>
            <input required type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} placeholder="••••••••" style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: "1.5px solid #e2e8f0", fontSize: 14, outline: "none", boxSizing: "border-box" }}
              onFocus={e => e.target.style.borderColor = "#1a78f2"}
              onBlur={e => e.target.style.borderColor = "#e2e8f0"} />
          </div>
          <button type="submit" disabled={loading} style={{ padding: "14px 0", background: "linear-gradient(135deg,#1a78f2,#7c3aed)", color: "#fff", border: "none", borderRadius: 14, fontWeight: 800, fontSize: 15, cursor: "pointer", marginTop: 8, opacity: loading ? 0.7 : 1 }}>
            {loading ? "Please wait..." : mode === "login" ? "Sign In" : "Create Account"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: 20, fontSize: 14, color: "#64748b" }}>
          {mode === "login" ? "Don't have an account? " : "Already have an account? "}
          <span onClick={() => setMode(mode === "login" ? "signup" : "login")} style={{ color: "#1a78f2", fontWeight: 700, cursor: "pointer" }}>
            {mode === "login" ? "Sign Up" : "Sign In"}
          </span>
        </div>

        <div style={{ marginTop: 20, padding: "12px 16px", background: "#f0fdf4", borderRadius: 12, fontSize: 12, color: "#16a34a", textAlign: "center" }}>
          💡 Try admin@electronex.com to access admin dashboard
        </div>
      </div>
    </div>
  );
}

// ─── CHECKOUT PAGE ───────────────────────────────────────────
function CheckoutPage({ setPage, cart, user, clearCart, showToast }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: user?.name || "", email: user?.email || "", phone: "", address: "", city: "", state: "", zip: "", country: "US" });
  const [payment, setPayment] = useState({ card: "", expiry: "", cvv: "", name: "" });
  const [placing, setPlacing] = useState(false);
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = subtotal > 99 ? 0 : 9.99;
  const total = subtotal + shipping;

  const placeOrder = async () => {
    if (!user) { showToast("Please login first!", "error"); setPage("login"); return; }
    
    // Validate shipping address
    if (!form.name || !form.email || !form.phone || !form.address || !form.city || !form.zip) {
      showToast("Please fill all shipping details!", "error");
      setStep(1);
      return;
    }
    // Validate payment details
    if (!payment.card || payment.card.length < 16) {
      showToast("Please enter valid card number!", "error");
      setStep(2);
      return;
    }
    if (!payment.expiry) {
      showToast("Please enter card expiry date!", "error");
      setStep(2);
      return;
    }
    if (!payment.cvv || payment.cvv.length < 3) {
      showToast("Please enter valid CVV!", "error");
      setStep(2);
      return;
    }
    if (!payment.name) {
      showToast("Please enter cardholder name!", "error");
      setStep(2);
      return;
    }
    setPlacing(true);
    try {
      const data = await placeOrderAPI(cart, form, total);
      if (data.error) { showToast(data.error, "error"); setPlacing(false); return; }
      showToast(`Order placed! 🎉 Order #${data.orderNumber}`);
      clearCart();
      setPage("order-success");
    } catch {
      showToast("Order failed! Try again.", "error");
      setPlacing(false);
    }
  };

  if (cart.length === 0 && step < 3) return (
    <div style={{ paddingTop: 64, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <p style={{ color: "#94a3b8", marginBottom: 20 }}>Your cart is empty</p>
        <button onClick={() => setPage("products")} style={{ padding: "12px 28px", background: "#1a78f2", color: "#fff", border: "none", borderRadius: 12, fontWeight: 700, cursor: "pointer" }}>Shop Now</button>
      </div>
    </div>
  );

  const inp = (style) => ({ width: "100%", padding: "12px 16px", borderRadius: 12, border: "1.5px solid #e2e8f0", fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "inherit", ...style });

  return (
    <div style={{ paddingTop: 64, minHeight: "100vh", background: "#f8fafc" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "40px 24px" }}>
        <h1 style={{ fontFamily: "Syne,sans-serif", fontWeight: 900, fontSize: "2rem", color: "#0f172a", marginBottom: 32 }}>Checkout</h1>

        {/* Steps */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 40 }}>
          {[["1","Shipping"],["2","Payment"],["3","Review"]].map(([n,l]) => (
            <div key={n} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: step >= +n ? "#1a78f2" : "#e2e8f0", color: step >= +n ? "#fff" : "#94a3b8", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 14, transition: "all 0.3s" }}>{n}</div>
              <span style={{ fontWeight: 700, fontSize: 14, color: step >= +n ? "#0f172a" : "#94a3b8" }}>{l}</span>
              {n !== "3" && <div style={{ width: 40, height: 2, background: step > +n ? "#1a78f2" : "#e2e8f0", transition: "all 0.3s" }} />}
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 32 }}>
          <div style={{ background: "#fff", borderRadius: 24, border: "1.5px solid #f1f5f9", padding: 32 }}>
            {step === 1 && (
              <div>
                <h2 style={{ fontFamily: "Syne,sans-serif", fontWeight: 900, fontSize: "1.3rem", color: "#0f172a", marginBottom: 24 }}>Shipping Address</h2>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  {[["Full Name","name","text"],["Email","email","email"],["Phone","phone","tel"],["Address","address","text"],["City","city","text"],["State","state","text"],["ZIP Code","zip","text"],["Country","country","text"]].map(([label,key,type]) => (
                    <div key={key} style={{ gridColumn: key === "address" ? "1 / -1" : "auto" }}>
                      <label style={{ display: "block", fontWeight: 700, fontSize: 13, color: "#475569", marginBottom: 6 }}>{label}</label>
                      <input type={type} value={form[key]} onChange={e => setForm({...form,[key]:e.target.value})} placeholder={label} style={inp({})}
                        onFocus={e => e.target.style.borderColor = "#1a78f2"}
                        onBlur={e => e.target.style.borderColor = "#e2e8f0"} />
                    </div>
                  ))}
                </div>
                <button onClick={() => setStep(2)} style={{ marginTop: 28, padding: "14px 32px", background: "linear-gradient(135deg,#1a78f2,#7c3aed)", color: "#fff", border: "none", borderRadius: 14, fontWeight: 800, fontSize: 15, cursor: "pointer" }}>Continue to Payment →</button>
              </div>
            )}

            {step === 2 && (
              <div>
                <h2 style={{ fontFamily: "Syne,sans-serif", fontWeight: 900, fontSize: "1.3rem", color: "#0f172a", marginBottom: 24 }}>Payment Details</h2>
                <div style={{ background: "linear-gradient(135deg,#0f172a,#1e3a5f)", borderRadius: 20, padding: "28px 24px", color: "#fff", marginBottom: 28 }}>
                  <div style={{ fontSize: 12, opacity: 0.5, marginBottom: 20, letterSpacing: "0.1em" }}>ELECTRONEX SECURE CARD</div>
                  <div style={{ fontSize: 20, letterSpacing: "0.18em", fontFamily: "monospace", marginBottom: 20 }}>{payment.card || "•••• •••• •••• ••••"}</div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                    <div><div style={{ opacity: 0.5, marginBottom: 4 }}>CARD HOLDER</div><div style={{ fontWeight: 700 }}>{payment.name || "Your Name"}</div></div>
                    <div><div style={{ opacity: 0.5, marginBottom: 4 }}>EXPIRES</div><div style={{ fontWeight: 700 }}>{payment.expiry || "MM/YY"}</div></div>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {[["Card Number","card","1234 5678 9012 3456"],["Cardholder Name","name","John Doe"],].map(([label,key,ph]) => (
                    <div key={key}>
                      <label style={{ display: "block", fontWeight: 700, fontSize: 13, color: "#475569", marginBottom: 6 }}>{label}</label>
                      <input value={payment[key]} onChange={e => setPayment({...payment,[key]:e.target.value})} placeholder={ph} style={inp({})}
                        onFocus={e => e.target.style.borderColor = "#1a78f2"}
                        onBlur={e => e.target.style.borderColor = "#e2e8f0"} />
                    </div>
                  ))}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    {[["Expiry Date","expiry","MM/YY"],["CVV","cvv","•••"]].map(([label,key,ph]) => (
                      <div key={key}>
                        <label style={{ display: "block", fontWeight: 700, fontSize: 13, color: "#475569", marginBottom: 6 }}>{label}</label>
                        <input value={payment[key]} onChange={e => setPayment({...payment,[key]:e.target.value})} placeholder={ph} style={inp({})}
                          onFocus={e => e.target.style.borderColor = "#1a78f2"}
                          onBlur={e => e.target.style.borderColor = "#e2e8f0"} />
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 12, marginTop: 28 }}>
                  <button onClick={() => setStep(1)} style={{ padding: "14px 24px", background: "#f1f5f9", color: "#475569", border: "none", borderRadius: 14, fontWeight: 700, cursor: "pointer" }}>← Back</button>
                  <button onClick={() => setStep(3)} style={{ flex: 1, padding: "14px 0", background: "linear-gradient(135deg,#1a78f2,#7c3aed)", color: "#fff", border: "none", borderRadius: 14, fontWeight: 800, fontSize: 15, cursor: "pointer" }}>Review Order →</button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <h2 style={{ fontFamily: "Syne,sans-serif", fontWeight: 900, fontSize: "1.3rem", color: "#0f172a", marginBottom: 24 }}>Review Your Order</h2>
                {cart.map(item => (
                  <div key={item.id} style={{ display: "flex", gap: 14, alignItems: "center", padding: "14px 0", borderBottom: "1px solid #f1f5f9" }}>
                    <img src={item.image} alt={item.name} style={{ width: 56, height: 56, borderRadius: 12, objectFit: "cover", background: "#f8fafc" }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, color: "#0f172a", fontSize: 14 }}>{item.name}</div>
                      <div style={{ color: "#94a3b8", fontSize: 12 }}>Qty: {item.qty}</div>
                    </div>
                    <div style={{ fontWeight: 800, color: "#0f172a" }}>{fp(item.price * item.qty)}</div>
                  </div>
                ))}
                <div style={{ display: "flex", gap: 12, marginTop: 28 }}>
                  <button onClick={() => setStep(2)} style={{ padding: "14px 24px", background: "#f1f5f9", color: "#475569", border: "none", borderRadius: 14, fontWeight: 700, cursor: "pointer" }}>← Back</button>
                  <button onClick={placeOrder} disabled={placing} style={{ flex: 1, padding: "14px 0", background: "linear-gradient(135deg,#10b981,#059669)", color: "#fff", border: "none", borderRadius: 14, fontWeight: 800, fontSize: 15, cursor: "pointer", opacity: placing ? 0.7 : 1 }}>
                    {placing ? "Placing Order..." : "✓ Place Order"}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Summary */}
          <div style={{ background: "#fff", borderRadius: 24, border: "1.5px solid #f1f5f9", padding: 24, height: "fit-content", position: "sticky", top: 84 }}>
            <h3 style={{ fontFamily: "Syne,sans-serif", fontWeight: 900, color: "#0f172a", marginBottom: 16 }}>Order Summary</h3>
            {cart.map(i => (
              <div key={i.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#64748b", marginBottom: 8 }}>
                <span>{i.name.substring(0,20)}... ×{i.qty}</span>
                <span style={{ fontWeight: 700, color: "#0f172a" }}>{fp(i.price * i.qty)}</span>
              </div>
            ))}
            <div style={{ borderTop: "1.5px solid #f1f5f9", marginTop: 12, paddingTop: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#64748b", marginBottom: 8 }}>
                <span>Subtotal</span><span style={{ fontWeight: 700, color: "#0f172a" }}>{fp(subtotal)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#64748b", marginBottom: 12 }}>
                <span>Shipping</span><span style={{ fontWeight: 700, color: shipping === 0 ? "#10b981" : "#0f172a" }}>{shipping === 0 ? "FREE" : fp(shipping)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 900, color: "#0f172a", fontSize: 18 }}>
                <span>Total</span><span>{fp(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── ORDER SUCCESS PAGE ──────────────────────────────────────
function OrderSuccessPage({ setPage }) {
  return (
    <div style={{ paddingTop: 64, minHeight: "100vh", background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center", maxWidth: 480, padding: "0 24px" }}>
        <div style={{ width: 100, height: 100, borderRadius: "50%", background: "linear-gradient(135deg,#10b981,#059669)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", fontSize: 48 }}>✓</div>
        <h1 style={{ fontFamily: "Syne,sans-serif", fontWeight: 900, fontSize: "2.4rem", color: "#0f172a", marginBottom: 12 }}>Order Placed!</h1>
        <p style={{ color: "#64748b", fontSize: 16, lineHeight: 1.7, marginBottom: 32 }}>Thank you for your purchase! Your order has been confirmed and will be delivered in 3–5 business days.</p>
        <div style={{ background: "#fff", borderRadius: 20, border: "1.5px solid #f1f5f9", padding: 24, marginBottom: 32, textAlign: "left" }}>
          {[["Order ID","#ENX-" + Math.floor(Math.random() * 90000 + 10000)],["Estimated Delivery","3–5 Business Days"],["Payment Status","✓ Confirmed"]].map(([k,v]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #f8fafc", fontSize: 14 }}>
              <span style={{ color: "#94a3b8" }}>{k}</span>
              <span style={{ fontWeight: 700, color: "#0f172a" }}>{v}</span>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <button onClick={() => setPage("home")} style={{ padding: "14px 28px", background: "linear-gradient(135deg,#1a78f2,#7c3aed)", color: "#fff", border: "none", borderRadius: 14, fontWeight: 800, cursor: "pointer" }}>Back to Home</button>
          <button onClick={() => setPage("products")} style={{ padding: "14px 28px", background: "#f1f5f9", color: "#475569", border: "none", borderRadius: 14, fontWeight: 700, cursor: "pointer" }}>Shop More</button>
        </div>
      </div>
    </div>
  );
}

// ─── PROFILE PAGE ────────────────────────────────────────────
function ProfilePage({ user, setPage, orders }) {
  if (!user) return (
    <div style={{ paddingTop: 64, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <p style={{ color: "#94a3b8", marginBottom: 20 }}>Please sign in to view your profile</p>
        <button onClick={() => setPage("login")} style={{ padding: "12px 28px", background: "#1a78f2", color: "#fff", border: "none", borderRadius: 12, fontWeight: 700, cursor: "pointer" }}>Sign In</button>
      </div>
    </div>
  );
  return (
    <div style={{ paddingTop: 64, minHeight: "100vh", background: "#f8fafc" }}>
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "40px 24px" }}>
        <div style={{ background: "linear-gradient(135deg,#0f172a,#1e3a5f)", borderRadius: 28, padding: "40px", color: "#fff", marginBottom: 32, display: "flex", alignItems: "center", gap: 24 }}>
          <div style={{ width: 80, height: 80, borderRadius: "50%", background: "linear-gradient(135deg,#1a78f2,#7c3aed)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, fontWeight: 900, flexShrink: 0 }}>{user.name[0]}</div>
          <div>
            <h1 style={{ fontFamily: "Syne,sans-serif", fontWeight: 900, fontSize: "1.8rem", marginBottom: 6 }}>{user.name}</h1>
            <p style={{ color: "#94a3b8" }}>{user.email}</p>
            {user.isAdmin && <span style={{ background: "#7c3aed", color: "#fff", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 999, marginTop: 8, display: "inline-block" }}>Admin</span>}
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 32 }}>
          {[["📦","My Orders",() => setPage("orders")],["❤️","Wishlist",() => setPage("wishlist")],["🛒","Cart",() => setPage("cart")],["⚙️","Settings",() => {}]].map(([icon,label,fn]) => (
            <button key={label} onClick={fn} style={{ background: "#fff", border: "1.5px solid #f1f5f9", borderRadius: 20, padding: "24px 20px", display: "flex", alignItems: "center", gap: 16, cursor: "pointer", transition: "all 0.2s", textAlign: "left" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#1a78f244"; e.currentTarget.style.boxShadow = "0 8px 32px #1a78f215"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#f1f5f9"; e.currentTarget.style.boxShadow = "none"; }}>
              <span style={{ fontSize: 28 }}>{icon}</span>
              <span style={{ fontWeight: 800, color: "#0f172a", fontSize: 15 }}>{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── MAIN APP ────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("home");
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [user, setUser] = useState(null);
  const [toasts, setToasts] = useState([]);

  useEffect(() => { window.scrollTo(0, 0); }, [page]);

  const showToast = (msg, type = "success") => {
    const id = Date.now();
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3000);
  };
  const removeToast = (id) => setToasts(t => t.filter(x => x.id !== id));

  const addToCart = (p, qty = 1) => {
    setCart(c => {
      const ex = c.find(x => x.id === p.id);
      if (ex) return c.map(x => x.id === p.id ? { ...x, qty: x.qty + qty } : x);
      return [...c, { ...p, qty }];
    });
    showToast(`${p.name} added to cart! 🛒`);
  };

  const updateQty = (id, qty) => {
    if (qty < 1) { removeFromCart(id); return; }
    setCart(c => c.map(x => x.id === id ? { ...x, qty } : x));
  };

  const removeFromCart = (id) => {
    setCart(c => c.filter(x => x.id !== id));
    showToast("Item removed from cart", "info");
  };

  const addToWishlist = (id) => {
    const inList = wishlist.includes(id);
    setWishlist(w => inList ? w.filter(x => x !== id) : [...w, id]);
    const p = PRODUCTS.find(x => x.id === id);
    showToast(inList ? "Removed from wishlist" : `${p?.name} wishlisted! ❤️`, inList ? "info" : "success");
  };

  const logout = () => { setUser(null); showToast("Logged out. See you soon! 👋", "info"); setPage("home"); };
  const clearCart = () => setCart([]);

  // Parse page
  const pageName = typeof page === "string" ? page : page?.name;
  const pageCategory = typeof page === "object" ? page?.category : null;
  const pageProductId = typeof page === "object" ? page?.id : null;

  const navPage = pageName;

  return (
    <div style={{ fontFamily: "'DM Sans','Segoe UI',sans-serif", background: "#f8fafc", minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&family=Syne:wght@700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { overflow-x: hidden; }
        @keyframes slideIn { from{opacity:0;transform:translateX(20px);} to{opacity:1;transform:translateX(0);} }
        button { font-family: inherit; }
        input, select { font-family: inherit; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 99px; }
      `}</style>

      <Toast toasts={toasts} remove={removeToast} />
      <Navbar page={navPage} setPage={setPage} cart={cart} wishlist={wishlist} user={user} logout={logout} />

      {pageName === "home" && <HomePage setPage={setPage} addToCart={addToCart} addToWishlist={addToWishlist} wishlist={wishlist} />}
      {pageName === "products" && <ProductsPage setPage={setPage} addToCart={addToCart} addToWishlist={addToWishlist} wishlist={wishlist} initialCategory={pageCategory} />}
      {pageName === "product" && <ProductDetailPage productId={pageProductId} setPage={setPage} addToCart={addToCart} addToWishlist={addToWishlist} wishlist={wishlist} />}
      {pageName === "categories" && <CategoriesPage setPage={setPage} />}
      {pageName === "cart" && <CartPage setPage={setPage} cart={cart} updateQty={updateQty} removeItem={removeFromCart} />}
      {pageName === "wishlist" && <WishlistPage setPage={setPage} wishlist={wishlist} addToCart={addToCart} addToWishlist={addToWishlist} />}
      {pageName === "login" && <LoginPage setPage={setPage} setUser={setUser} showToast={showToast} />}
      {pageName === "checkout" && <CheckoutPage setPage={setPage} cart={cart} user={user} clearCart={clearCart} showToast={showToast} />}
      {pageName === "order-success" && <OrderSuccessPage setPage={setPage} />}
      {pageName === "profile" && <ProfilePage user={user} setPage={setPage} />}
    </div>
  );
}