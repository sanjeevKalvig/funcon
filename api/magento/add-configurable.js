// api/magento/add-configurable.js
// Server-side bridge: add a configurable product to a guest cart
export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      res.setHeader("Allow", "POST");
      return res.status(405).json({ error: "Method Not Allowed" });
    }

    const MAGENTO_HOST = process.env.MAGENTO_HOST;
    if (!MAGENTO_HOST) {
      return res.status(500).json({ error: "MAGENTO_HOST not configured" });
    }

    const body = await new Promise((resolve) => {
      const chunks = [];
      req.on("data", (c) => chunks.push(c));
      req.on("end", () => resolve(Buffer.concat(chunks).toString()));
      req.on("error", () => resolve(""));
    });

    let payload;
    try {
      payload = JSON.parse(body || "{}");
    } catch (e) {
      return res.status(400).json({ error: "Invalid JSON body" });
    }

    const { cartId, parentSku, attributeId, optionValue, qty = 1 } = payload;
    if (!cartId || !parentSku || !attributeId || (optionValue === undefined || optionValue === null)) {
      return res.status(400).json({ error: "Missing required fields: cartId, parentSku, attributeId, optionValue" });
    }

    // Build Magento URL
    const target = `${MAGENTO_HOST.replace(/\/$/, "")}/rest/V1/guest-carts/${encodeURIComponent(cartId)}/items`;

    // Build Magento payload (same shape your client used)
    const magentoPayload = {
      cartItem: {
        quote_id: cartId,
        sku: parentSku,
        qty: Number(qty),
        product_option: {
          extension_attributes: {
            configurable_item_options: [
              { option_id: Number(attributeId), option_value: Number(optionValue) }
            ]
          }
        }
      }
    };

    // Forward minimal headers and correct Host
    const forwardHeaders = {
      "content-type": "application/json",
      host: new URL(MAGENTO_HOST).host,
    };

    const upstream = await fetch(target, {
      method: "POST",
      headers: forwardHeaders,
      body: JSON.stringify(magentoPayload),
    });

    const text = await upstream.text();

    // Mirror upstream status and body
    const contentType = upstream.headers.get("content-type") || "text/plain";
    res.status(upstream.status).setHeader("Content-Type", contentType);
    return res.send(text);
  } catch (err) {
    console.error("add-configurable proxy error:", err);
    return res.status(502).json({ error: "Proxy failed", detail: String(err) });
  }
}
