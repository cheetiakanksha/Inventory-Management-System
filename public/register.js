import { request, setError } from "/common.js";

const errorEl = document.getElementById("error");
const registerForm = document.getElementById("registerForm");

registerForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  if (password.length < 8) {
    setError(errorEl, "Password must be at least 8 characters.");
    return;
  }

  try {
    setError(errorEl);
    await request("/auth/register", {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
        name: name || undefined,
      }),
    });

    window.location.href = "/login";
  } catch (error) {
    setError(errorEl, error.message);
  }
});
