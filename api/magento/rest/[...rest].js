// api/magento/rest/[...rest].js
// Proxy for /api/magento/rest/* -> forwards to MAGENTO_HOST/rest/*

export default async function handler(req, res) {
     console.log('[proxy rest] invoked', { method: req.method, url: req.url });
  try {
    const MAGENTO_HOST = process.env.MAGENTO_HOST;
    if (!MAGENTO_HOST) {
      res.status(500).json({ error: "MAGENTO_HOST not configured" });
      return;
    }

    // Remove "/api/magento" prefix and ensure we forward the /rest/... portion
    const prefix = "/api/magento";
    const fwdPath = req.url.startsWith(prefix) ? req.url.slice(prefix.length) : req.url;
    const target = MAGENTO_HOST.replace(/\/$/, "") + fwdPath;

    // Read body for non-GET
    let body = null;
    if (req.method !== "GET" && req.method !== "HEAD") {
      body = await new Promise((resolve) => {
        const chunks = [];
        req.on("data", (c) => chunks.push(c));
        req.on("end", () => resolve(Buffer.concat(chunks)));
        req.on("error", () => resolve(Buffer.alloc(0)));
      });
    }

    // Forward headers, set Host to Magento host
    const forwardHeaders = { ...req.headers };
    [
      "content-length",
      "x-vercel-proxy-signature",
      "x-forwarded-for",
      "x-forwarded-host",
      "x-forwarded-port",
      "x-forwarded-proto",
      "connection",
      "upgrade",
    ].forEach(h => delete forwardHeaders[h]);

    try {
      forwardHeaders["host"] = new URL(MAGENTO_HOST).host;
    } catch (e) { /* ignore */ }

    const upstream = await fetch(target, {
      method: req.method,
      headers: forwardHeaders,
      body: body && body.length ? body : undefined,
    });

    upstream.headers.forEach((value, key) => {
      if (!["connection", "transfer-encoding", "content-encoding"].includes(key.toLowerCase())) {
        res.setHeader(key, value);
      }
    });

    const arrayBuffer = await upstream.arrayBuffer();
    res.status(upstream.status).send(Buffer.from(arrayBuffer));
  } catch (err) {
    console.error("Proxy Error:", err);
    res.status(502).json({ error: "Proxy failed", detail: String(err) });
  }
}
