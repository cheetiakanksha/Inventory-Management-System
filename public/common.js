const API_BASE = "/api";

export const getToken = () => localStorage.getItem("inventory_token") || "";

export const setToken = (token) => {
  localStorage.setItem("inventory_token", token);
};

export const clearToken = () => {
  localStorage.removeItem("inventory_token");
};

export const setError = (el, message = "") => {
  el.textContent = message;
  el.classList.toggle("hidden", !message);
};

export const request = async (path, options = {}, token = "") => {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload.message || "Request failed");
  }

  return payload.data;
};
