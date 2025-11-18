export default async function handler(req, res) {
  try {
    const MAGENTO_HOST = process.env.MAGENTO_HOST;
    if (!MAGENTO_HOST) return res.status(500).json({ error: "MAGENTO_HOST not configured" });

    const cartId = (req.query.cartId || "").toString().replace(/^"+|"+$/g, "");
    if (!cartId) return res.status(400).json({ error: "Missing cartId" });

    const target = `${MAGENTO_HOST.replace(/\/$/, "")}/rest/V1/guest-carts/${encodeURIComponent(cartId)}/items`;

    const upstream = await fetch(target, {
      method: "GET",
      headers: { accept: "application/json" }
    });

    const text = await upstream.text();
    res.status(upstream.status).setHeader("Content-Type", upstream.headers.get("content-type") || "application/json");
    return res.send(text);
  } catch (err) {
    console.error("get-items proxy error:", err);
    return res.status(502).json({ error: "Proxy failed", detail: String(err) });
  }
}
