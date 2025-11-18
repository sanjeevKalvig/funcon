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

    // --- read raw body ---
    const bodyText = await new Promise((resolve) => {
      const chunks = [];
      req.on("data", (c) => chunks.push(c));
      req.on("end", () => resolve(Buffer.concat(chunks).toString()));
      req.on("error", () => resolve(""));
    });

    let payload;
    try {
      payload = bodyText ? JSON.parse(bodyText) : {};
    } catch (e) {
      return res.status(400).json({ error: "Invalid JSON body" });
    }

    // --- sanitize incoming values ---
    let { cartId, parentSku, attributeId, optionValue, qty = 1 } = payload;

    if (!cartId || !parentSku || !attributeId || (optionValue === undefined || optionValue === null)) {
      return res.status(400).json({ error: "Missing required fields: cartId, parentSku, attributeId, optionValue" });
    }

    // Remove stray wrapping quotes if present and coerce to appropriate types
    cartId = String(cartId).replace(/^"+|"+$/g, "");
    attributeId = Number(attributeId);
    optionValue = Number(optionValue);
    qty = Number(qty);

    // Small validation
    if (!cartId) return res.status(400).json({ error: "Invalid cartId" });
    if (!Number.isFinite(attributeId) || !Number.isFinite(optionValue) || !Number.isFinite(qty)) {
      return res.status(400).json({ error: "attributeId, optionValue and qty must be numeric" });
    }

    // Optional debug logging (remove after verification)
    console.log("[add-configurable] received payload:", { cartId, parentSku, attributeId, optionValue, qty });

    // Build Magento URL
    const target = `${MAGENTO_HOST.replace(/\/$/, "")}/rest/V1/guest-carts/${encodeURIComponent(cartId)}/items`;

    const cleanCartId = String(cartId || "").replace(/^"+|"+$/g, "");
    const cleanAttrId = Number(attributeId);
    const cleanOptionValue = Number(optionValue);
    const cleanQty = Number(qty);


    // Build Magento payload (expected by Magento)
    const magentoPayload = {
      cartItem: {
        quote_id: cartId,
        sku: parentSku,
        qty: qty,
        product_option: {
          extension_attributes: {
            configurable_item_options: [
              { option_id: attributeId, option_value: optionValue }
            ]
          }
        }
      }
    };

    const forwardHeaders = {
      "content-type": "application/json",
      host: new URL(MAGENTO_HOST).host,
    };

    const upstream = await fetch(target, {
      method: "POST",
      headers: forwardHeaders,
      body: JSON.stringify(magentoPayload),
    });

    const upstreamText = await upstream.text();

    // Log upstream response for debugging (remove later)
    console.log("[add-configurable] upstream status:", upstream.status, "body:", upstreamText);

    // Mirror upstream status & content-type and return body
    const contentType = upstream.headers.get("content-type") || "text/plain";
    res.status(upstream.status).setHeader("Content-Type", contentType);
    return res.send(upstreamText);
  } catch (err) {
    console.error("add-configurable proxy error:", err);
    return res.status(502).json({ error: "Proxy failed", detail: String(err) });
  }
}
