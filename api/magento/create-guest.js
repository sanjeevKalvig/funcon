// api/magento/create-guest.js
// Small serverless bridge: create Magento guest cart and return the masked cart id

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

    const target = MAGENTO_HOST.replace(/\/$/, "") + "/rest/V1/guest-carts";

    // forward minimal headers; ensure Host is Magento host
    const forwardHeaders = {
      "content-type": "application/json",
      host: new URL(MAGENTO_HOST).host,
    };

    const upstream = await fetch(target, {
      method: "POST",
      headers: forwardHeaders,
    });

    const text = await upstream.text();

    // mirror status + body
    res.status(upstream.status).setHeader("Content-Type", upstream.headers.get("content-type") || "text/plain");
    return res.send(text);
  } catch (err) {
    console.error("create-guest proxy error:", err);
    return res.status(502).json({ error: "Proxy failed", detail: String(err) });
  }
}
