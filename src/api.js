// api.js - Frontend API calls
const BASE_URL = "https://electronex-backend-production.up.railway.app/api";

const getToken = () => localStorage.getItem("token");

const headers = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

// ── AUTH ──────────────────────────────────────────────────
export const registerUser = async (name, email, password) => {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  return res.json();
};

const BASE_URL = "https://electronex-backend-production.up.railway.app/api";

export const loginUser = async (email, password) => {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
};

// ── PRODUCTS ──────────────────────────────────────────────
export const getProducts = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${BASE_URL}/products?${query}`);
  return res.json();
};

export const getProduct = async (id) => {
  const res = await fetch(`${BASE_URL}/products/${id}`);
  return res.json();
};

// ── ORDERS ────────────────────────────────────────────────
export const placeOrder = async (items, address, total) => {
  const res = await fetch(`${BASE_URL}/orders`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({ items, address, total }),
  });
  return res.json();
};

export const getMyOrders = async () => {
  const res = await fetch(`${BASE_URL}/orders/my`, {
    headers: headers(),
  });
  return res.json();
};