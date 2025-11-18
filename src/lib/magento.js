// src/lib/magento.js

// VITE_MAGENTO_BASE comes from .env.local (dev) or Vercel env (prod)
const ENV_BASE = import.meta.env.VITE_MAGENTO_BASE ?? "";

// Behavior:
// - During local dev (import.meta.env.DEV === true):
//    if ENV_BASE is empty -> use relative paths so Vite proxy works (BASE = "")
//    if ENV_BASE set -> use that (useful if you want local to hit real host)
// - During production (DEV === false):
//    if ENV_BASE set -> use it
//    otherwise -> route through Vercel serverless proxy at /api/magento
const BASE = import.meta.env.DEV
  ? (ENV_BASE ? ENV_BASE.replace(/\/+$/, "") : "")          // dev: prefer relative paths (Vite proxy) when ENV_BASE not set
  : (ENV_BASE ? ENV_BASE.replace(/\/+$/, "") : "/api/magento"); // prod: fallback to /api/magento

// Helper to join base URL + path
function joinBase(path) {
  if (!BASE) return path;  // dev (Vite proxy) or explicit empty
  return BASE.replace(/\/+$/, "") + (path.startsWith("/") ? path : "/" + path);
}

// 1. CREATE GUEST CART
export async function ensureGuestCartId() {
  const key = "mg_guest_cart_id";
  let id = localStorage.getItem(key);
  if (id) return id;

  const res = await fetch(joinBase("/rest/V1/guest-carts"), { method: "POST" });
  if (!res.ok) {
    throw new Error("Failed to create guest cart: " + (await res.text()));
  }
  id = await res.json();
  localStorage.setItem(key, id);
  return id;
}

// 2. ADD CONFIGURABLE PRODUCT
export async function addConfigurableToGuestCart({ cartId, parentSku, attributeId, optionValue, qty = 1 }) {
  const url = joinBase(`/rest/V1/guest-carts/${encodeURIComponent(cartId)}/items`);

  const payload = {
    cartItem: {
      quote_id: cartId,
      sku: parentSku,
      qty: Number(qty),
      product_option: {
        extension_attributes: {
          configurable_item_options: [
            {
              option_id: Number(attributeId),
              option_value: Number(optionValue)
            }
          ]
        }
      }
    }
  };

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error("Add to cart failed: " + (await res.text()));
  }

  return res.json();
}

// 3. GET ITEMS
export async function getGuestCartItems(cartId) {
  const url = joinBase(`/rest/V1/guest-carts/${encodeURIComponent(cartId)}/items`);
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Failed to fetch cart items: " + (await res.text()));
  }
  return res.json();
}

// 4. UPDATE ITEM
export async function updateGuestCartItem(cartId, itemId, qty) {
  const url = joinBase(`/rest/V1/guest-carts/${encodeURIComponent(cartId)}/items/${encodeURIComponent(itemId)}`);

  const payload = {
    cartItem: {
      item_id: Number(itemId),
      qty: Number(qty),
      quote_id: cartId
    }
  };

  const res = await fetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error("Failed to update cart item: " + (await res.text()));
  }

  return res.json();
}

// 5. REMOVE ITEM
export async function removeGuestCartItem(cartId, itemId) {
  const url = joinBase(`/rest/V1/guest-carts/${encodeURIComponent(cartId)}/items/${encodeURIComponent(itemId)}`);
  const res = await fetch(url, { method: "DELETE" });

  if (!res.ok) {
    throw new Error("Failed to remove cart item: " + (await res.text()));
  }

  return res.json();
}
