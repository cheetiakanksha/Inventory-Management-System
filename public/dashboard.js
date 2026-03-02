import { clearToken, getToken, request, setError } from "/common.js";

const token = getToken();
if (!token) {
  window.location.href = "/login";
}

const els = {
  productForm: document.getElementById("productForm"),
  productTableBody: document.getElementById("productTableBody"),
  loading: document.getElementById("loading"),
  error: document.getElementById("error"),
  toast: document.getElementById("toast"),
  cancelEditBtn: document.getElementById("cancelEditBtn"),
  logoutBtn: document.getElementById("logoutBtn"),
};

const showToast = (message) => {
  els.toast.textContent = message;
  els.toast.classList.remove("hidden");
  setTimeout(() => els.toast.classList.add("hidden"), 2500);
};

const setLoading = (state) => {
  els.loading.classList.toggle("hidden", !state);
};

const resetProductForm = () => {
  els.productForm.reset();
  document.getElementById("productId").value = "";
  document.getElementById("saveBtn").textContent = "Save Product";
  els.cancelEditBtn.classList.add("hidden");
};

const renderProducts = (products) => {
  els.productTableBody.innerHTML = "";

  if (!products.length) {
    els.productTableBody.innerHTML = `<tr><td colspan="6">No products found.</td></tr>`;
    return;
  }

  for (const product of products) {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${product.name}</td>
      <td>${product.sku}</td>
      <td>$${Number(product.price).toFixed(2)}</td>
      <td>${product.quantity}</td>
      <td>${product.description || "-"}</td>
      <td>
        <div class="actions">
          <button data-action="edit" data-id="${product.id}" class="secondary">Edit</button>
          <button data-action="delete" data-id="${product.id}" class="danger">Delete</button>
        </div>
      </td>
    `;

    row.querySelector('[data-action="edit"]').addEventListener("click", () => {
      document.getElementById("productId").value = product.id;
      document.getElementById("name").value = product.name;
      document.getElementById("sku").value = product.sku;
      document.getElementById("price").value = product.price;
      document.getElementById("quantity").value = product.quantity;
      document.getElementById("description").value = product.description || "";
      document.getElementById("saveBtn").textContent = "Update Product";
      els.cancelEditBtn.classList.remove("hidden");
    });

    row.querySelector('[data-action="delete"]').addEventListener("click", async () => {
      const confirmed = window.confirm("Delete this product?");
      if (!confirmed) return;

      try {
        await request(`/products/${product.id}`, { method: "DELETE" }, token);
        showToast("Product deleted");
        await loadProducts();
      } catch (error) {
        setError(els.error, error.message);
      }
    });

    els.productTableBody.appendChild(row);
  }
};

const loadProducts = async () => {
  try {
    setError(els.error);
    setLoading(true);
    const products = await request("/products", {}, token);
    renderProducts(products);
  } catch (error) {
    setError(els.error, error.message);
  } finally {
    setLoading(false);
  }
};

els.productForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const id = document.getElementById("productId").value;
  const name = document.getElementById("name").value.trim();
  const sku = document.getElementById("sku").value.trim();
  const price = Number(document.getElementById("price").value);
  const quantity = Number(document.getElementById("quantity").value);
  const description = document.getElementById("description").value.trim();

  if (!name || !sku || Number.isNaN(price) || Number.isNaN(quantity)) {
    setError(els.error, "Name, SKU, price, and quantity are required.");
    return;
  }

  if (price < 0 || quantity < 0) {
    setError(els.error, "Price and quantity must be greater than or equal to 0.");
    return;
  }

  try {
    setError(els.error);

    const payload = {
      name,
      sku,
      price,
      quantity,
      description: description || undefined,
    };

    if (id) {
      await request(`/products/${id}`, { method: "PATCH", body: JSON.stringify(payload) }, token);
      showToast("Product updated");
    } else {
      await request("/products", { method: "POST", body: JSON.stringify(payload) }, token);
      showToast("Product created");
    }

    resetProductForm();
    await loadProducts();
  } catch (error) {
    setError(els.error, error.message);
  }
});

els.cancelEditBtn.addEventListener("click", resetProductForm);

els.logoutBtn.addEventListener("click", () => {
  clearToken();
  window.location.href = "/login";
});

loadProducts();
