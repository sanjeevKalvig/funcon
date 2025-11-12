// src/lib/magento.js
const BASE = ""; // relative paths (works when you proxy /rest in dev or deploy under same origin)

// create guest cart (returns masked cart id string)
export async function ensureGuestCartId() {
  const key = "mg_guest_cart_id";
  let id = localStorage.getItem(key);
  if (id) return id;

  const res = await fetch(`${BASE}/rest/V1/guest-carts`, { method: "POST" });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error("Failed to create guest cart: " + txt);
  }
  id = await res.json();
  localStorage.setItem(key, id);
  return id;
}

// add configurable product (already used)
export async function addConfigurableToGuestCart({ cartId, parentSku, attributeId, optionValue, qty = 1 }) {
  const url = `${BASE}/rest/V1/guest-carts/${encodeURIComponent(cartId)}/items`;
  const payload = {
    cartItem: {
      quote_id: cartId,
      sku: parentSku,
      qty,
      product_option: {
        extension_attributes: {
          configurable_item_options: [
            { option_id: String(attributeId), option_value: String(optionValue) }
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
    const txt = await res.text();
    throw new Error("Add to cart failed: " + txt);
  }
  return res.json();
}

// get items in guest cart
export async function getGuestCartItems(cartId) {
  const url = `${BASE}/rest/V1/guest-carts/${encodeURIComponent(cartId)}/items`;
  const res = await fetch(url);
  if (!res.ok) {
    const txt = await res.text();
    throw new Error("Failed to fetch cart items: " + txt);
  }
  return res.json(); // array of cart item objects
}

// update cart item quantity
export async function updateGuestCartItem(cartId, itemId, qty) {
  // Magento uses PUT /rest/V1/guest-carts/:cartId/items/:itemId
  const url = `${BASE}/rest/V1/guest-carts/${encodeURIComponent(cartId)}/items/${encodeURIComponent(itemId)}`;
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
    const txt = await res.text();
    throw new Error("Failed to update cart item: " + txt);
  }
  return res.json();
}

// remove cart item
export async function removeGuestCartItem(cartId, itemId) {
  const url = `${BASE}/rest/V1/guest-carts/${encodeURIComponent(cartId)}/items/${encodeURIComponent(itemId)}`;
  const res = await fetch(url, { method: "DELETE" });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error("Failed to remove cart item: " + txt);
  }
  // API returns true on success
  return res.json();
}
