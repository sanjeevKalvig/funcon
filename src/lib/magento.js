// lib/magento.js

export async function ensureGuestCartId() {
  const key = "mg_guest_cart_id";
  let id = localStorage.getItem(key);
  if (id) return id;

  const res = await fetch("/rest/V1/guest-carts", { method: "POST" });
  if (!res.ok) throw new Error("Failed to create guest cart");
  id = await res.json();
  localStorage.setItem(key, id);
  return id;
}

export async function addConfigurableToGuestCart({ cartId, parentSku, attributeId, optionValue, qty = 1 }) {
  const url = `/rest/V1/guest-carts/${encodeURIComponent(cartId)}/items`;
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
    const text = await res.text();
    throw new Error("Add to cart failed: " + text);
  }

  return res.json();
}

export async function getGuestCartItems(cartId) {
  const res = await fetch(`/rest/V1/guest-carts/${encodeURIComponent(cartId)}/items`);
  if (!res.ok) throw new Error("Failed to get cart items");
  return res.json();
}
