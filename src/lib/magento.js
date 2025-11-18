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

// ensureGuestCartId
export async function ensureGuestCartId() {
  const key = "mg_guest_cart_id";
  let id = localStorage.getItem(key);
  if (id) return id;

  // production -> call serverless create-guest bridge
  if (!isLocalDevNoBase) {
    const res = await fetch("/api/magento/create-guest", { method: "POST" });
    if (!res.ok) throw new Error("Failed to create guest cart: " + (await res.text()));
    id = (await res.json())?.replace(/^"+|"+$/g, ""); // strip any quotes
    localStorage.setItem(key, id);
    return id;
  }

  // local dev -> call Magento REST (via vite proxy)
  const res = await fetch(joinBase("/rest/V1/guest-carts"), { method: "POST" });
  if (!res.ok) throw new Error("Failed to create guest cart: " + (await res.text()));
  id = await res.json();
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
// getGuestCartItems
export async function getGuestCartItems(cartId) {
  if (!cartId) throw new Error("Missing cartId");
  const clean = String(cartId).replace(/^"+|"+$/g, "");

  if (!isLocalDevNoBase) {
    // call serverless get-items endpoint
    const res = await fetch(`/api/magento/get-items?cartId=${encodeURIComponent(clean)}`);
    if (!res.ok) throw new Error("Failed to fetch cart items: " + (await res.text()));
    return res.json();
  }

  // local dev -> direct Magento REST
  const url = joinBase(`/rest/V1/guest-carts/${encodeURIComponent(clean)}/items`);
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch cart items: " + (await res.text()));
  return res.json();
}
// 4. UPDATE ITEM
export async function updateGuestCartItem(cartId, itemId, qty) {
  if (!cartId) throw new Error("Missing cartId");
  if (!itemId) throw new Error("Missing itemId");
  if (qty === undefined || qty === null) throw new Error("Missing qty");

  const cleanCartId = String(cartId).replace(/^"+|"+$/g, "");
  const cleanItemId = Number(itemId);
  const cleanQty = Number(qty);

  // local dev -> direct Magento REST
  if (isLocalDevNoBase) {
    const url = joinBase(`/rest/V1/guest-carts/${encodeURIComponent(cleanCartId)}/items/${encodeURIComponent(cleanItemId)}`);
    const payload = { cartItem: { item_id: cleanItemId, qty: cleanQty, quote_id: cleanCartId } };
    const res = await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Failed to update cart item: " + (await res.text().catch(() => "")));
    return res.json();
  }

  // production -> call serverless update endpoint
  const bridgeRes = await fetch("/api/magento/update-item", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cartId: cleanCartId, itemId: cleanItemId, qty: cleanQty }),
  });

  if (!bridgeRes.ok) throw new Error("Failed to update cart item (bridge): " + (await bridgeRes.text().catch(() => "")));
  return bridgeRes.json();
}

// 5. REMOVE ITEM
export async function removeGuestCartItem(cartId, itemId) {
  if (!cartId) throw new Error("Missing cartId");
  if (!itemId) throw new Error("Missing itemId");

  const cleanCartId = String(cartId).replace(/^"+|"+$/g, "");
  const cleanItemId = Number(itemId);

  if (isLocalDevNoBase) {
    const url = joinBase(`/rest/V1/guest-carts/${encodeURIComponent(cleanCartId)}/items/${encodeURIComponent(cleanItemId)}`);
    const res = await fetch(url, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to remove cart item: " + (await res.text().catch(() => "")));
    return res.json(); // Magento returns true on success
  }

  const bridgeRes = await fetch("/api/magento/remove-item", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cartId: cleanCartId, itemId: cleanItemId }),
  });

  if (!bridgeRes.ok) throw new Error("Failed to remove cart item (bridge): " + (await bridgeRes.text().catch(() => "")));
  return bridgeRes.json();
}
