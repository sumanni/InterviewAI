// src/utils/api.js
const API_URL = "http://localhost:5000/api";

// ── Save token ──
export const setToken = (token) => localStorage.setItem("token", token);
export const getToken = () => localStorage.getItem("token");
export const removeToken = () => localStorage.removeItem("token");

// ── Register ──
export const registerUser = async (name, email, password, role) => {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password, role }),
  });
  return res.json();
};

// ── Login ──
export const loginUser = async (email, password) => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
};

// ── Get current user ──
export const getMe = async () => {
  const res = await fetch(`${API_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return res.json();
};

// ── Update profile ──
export const updateProfile = async (data) => {
  const res = await fetch(`${API_URL}/auth/update`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
};
