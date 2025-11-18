// api/magento/cart-items.js
export default async function handler(req, res) {
  const MAGENTO_HOST = process.env.MAGENTO_HOST;
  if (!MAGENTO_HOST) return res.status(500).json({ error: "MAGENTO_HOST not configured" });

  const cartId = req.query.cartId;
  if (!cartId) return res.status(400).json({ error: "Missing cartId" });

  const target = `${MAGENTO_HOST.replace(/\/$/, "")}/rest/V1/guest-carts/${encodeURIComponent(cartId)}/items`;
  const upstream = await fetch(target, { method: "GET", headers: { host: new URL(MAGENTO_HOST).host } });
  const text = await upstream.text();
  const ct = upstream.headers.get("content-type") || "text/plain";
  res.status(upstream.status).setHeader("Content-Type", ct);
  // try to return JSON if possible
  try { return res.json(JSON.parse(text)); } catch { return res.send(text); }
}
