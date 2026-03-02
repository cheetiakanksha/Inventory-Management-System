import { getToken, request, setError, setToken } from "/common.js";

const errorEl = document.getElementById("error");
const loginForm = document.getElementById("loginForm");

if (getToken()) {
  window.location.href = "/dashboard";
}

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  try {
    setError(errorEl);
    const data = await request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    setToken(data.token);
    window.location.href = "/dashboard";
  } catch (error) {
    setError(errorEl, error.message);
  }
});
