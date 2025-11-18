// src/lib/magento.js

// VITE_MAGENTO_BASE comes from .env.local (dev) or Vercel env (prod)
const ENV_BASE = import.meta.env.VITE_MAGENTO_BASE ?? "";
const isLocalDevNoBase = import.meta.env.DEV && !ENV_BASE;

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

  if (isLocalDevNoBase) {
    // local dev -> call Magento REST directly (via vite proxy)
    const res = await fetch(`/rest/V1/guest-carts`, { method: "POST" });
    if (!res.ok) throw new Error(await res.text());
    id = await res.json();
  } else {
    // production -> call your serverless bridge
    const res = await fetch(`/api/magento/create-guest`, { method: "POST" });
    if (!res.ok) throw new Error(await res.text());
    id = await res.json(); // should return the masked cart id string
  }

  localStorage.setItem(key, id);
  return id;
}



// 2. ADD CONFIGURABLE PRODUCT
// Environment-aware add-to-cart: uses Vite proxy in dev, serverless bridge in production
export async function addConfigurableToGuestCart({
  cartId,
  parentSku,
  attributeId,
  optionValue,
  qty = 1
}) {
  if (!cartId) throw new Error("Missing cartId");
  if (!parentSku) throw new Error("Missing parentSku");
  if (!attributeId) throw new Error("Missing attributeId");
  if (optionValue === undefined || optionValue === null)
    throw new Error("Missing optionValue");

  // --- CLEAN VALUES FOR BOTH LOCAL & PROD ---
  const cleanCartId = String(cartId).replace(/^"+|"+$/g, "");
  const cleanAttrId = Number(attributeId);
  const cleanOptionValue = Number(optionValue);
  const cleanQty = Number(qty);

  const ENV_BASE = import.meta.env.VITE_MAGENTO_BASE ?? "";
  const isLocalDevNoBase = import.meta.env.DEV && !ENV_BASE;

  // --- 1) LOCAL DEV: Use Vite Proxy directly to Magento ---
  if (isLocalDevNoBase) {
    const url = joinBase(
      `/rest/V1/guest-carts/${encodeURIComponent(cleanCartId)}/items`
    );

    const payload = {
      cartItem: {
        quote_id: cleanCartId,
        sku: parentSku,
        qty: cleanQty,
        product_option: {
          extension_attributes: {
            configurable_item_options: [
              {
                option_id: cleanAttrId,
                option_value: cleanOptionValue
              }
            ]
          }
        }
      }
    };

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      throw new Error("Add to cart failed (local): " + txt);
    }

    return res.json();
  }

  // --- 2) PRODUCTION (Vercel): Use serverless bridge ---
  const bridgeRes = await fetch("/api/magento/add-configurable", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      cartId: cleanCartId,
      parentSku,
      attributeId: cleanAttrId,
      optionValue: cleanOptionValue,
      qty: cleanQty
    })
  });

  if (!bridgeRes.ok) {
    const txt = await bridgeRes.text().catch(() => "");
    throw new Error("Add to cart (bridge) failed: " + txt);
  }

  return bridgeRes.json();
}



// 3. GET ITEMS
export async function getGuestCartItems(cartId) {
  if (!cartId) throw new Error("Missing cartId");
  if (isLocalDevNoBase) {
    const res = await fetch(`/rest/V1/guest-carts/${encodeURIComponent(cartId)}/items`);
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  } else {
    // production -> call your bridge endpoint
    const res = await fetch(`/api/magento/cart-items?cartId=${encodeURIComponent(cartId)}`);
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }
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
