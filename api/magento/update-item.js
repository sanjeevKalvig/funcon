// api/magento/update-item.js
export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      res.setHeader("Allow", "POST");
      return res.status(405).json({ error: "Method Not Allowed" });
    }

    const MAGENTO_HOST = process.env.MAGENTO_HOST;
    if (!MAGENTO_HOST) return res.status(500).json({ error: "MAGENTO_HOST not configured" });

    // Read raw body
    const bodyStr = await new Promise((resolve) => {
      const chunks = [];
      req.on("data", (c) => chunks.push(c));
      req.on("end", () => resolve(Buffer.concat(chunks).toString()));
      req.on("error", () => resolve(""));
    });

    let payload;
    try { payload = JSON.parse(bodyStr || "{}"); } catch (e) {
      return res.status(400).json({ error: "Invalid JSON body" });
    }

    const { cartId, itemId, qty } = payload;
    if (!cartId || !itemId || qty === undefined || qty === null) {
      return res.status(400).json({ error: "Missing required fields: cartId, itemId, qty" });
    }

    const cleanCartId = String(cartId).replace(/^"+|"+$/g, "");
    const cleanItemId = Number(itemId);
    const cleanQty = Number(qty);

    const target = `${MAGENTO_HOST.replace(/\/$/, "")}/rest/V1/guest-carts/${encodeURIComponent(cleanCartId)}/items/${encodeURIComponent(cleanItemId)}`;

    const magentoPayload = {
      cartItem: {
        item_id: cleanItemId,
        qty: cleanQty,
        quote_id: cleanCartId
      }
    };

    const upstream = await fetch(target, {
      method: "PUT",
      headers: {
        "content-type": "application/json",
        host: new URL(MAGENTO_HOST).host
      },
      body: JSON.stringify(magentoPayload),
    });

    const text = await upstream.text();
    res.status(upstream.status).setHeader("Content-Type", upstream.headers.get("content-type") || "application/json");
    return res.send(text);
  } catch (err) {
    console.error("update-item proxy error:", err);
    return res.status(502).json({ error: "Proxy failed", detail: String(err) });
  }
}
