// api/magento/[...path].js
// Vercel Serverless Proxy → Magento HTTP Host

export default async function handler(req, res) {
  try {
    const MAGENTO_HOST = process.env.MAGENTO_HOST;
    if (!MAGENTO_HOST) {
      res.status(500).json({ error: "MAGENTO_HOST not configured" });
      return;
    }

    const prefix = "/api/magento";
    const fwdPath = req.url.startsWith(prefix) ? req.url.slice(prefix.length) : req.url;
    const target = MAGENTO_HOST.replace(/\/$/, "") + fwdPath;

    // --- READ BODY (for POST/PUT/PATCH/DELETE) ---
    let body = null;
    if (req.method !== "GET" && req.method !== "HEAD") {
      body = await new Promise((resolve) => {
        const chunks = [];
        req.on("data", (c) => chunks.push(c));
        req.on("end", () => resolve(Buffer.concat(chunks)));
        // defensive: resolve empty buffer if no data
        req.on("error", () => resolve(Buffer.alloc(0)));
      });
    }

    // --- BUILD FORWARD HEADERS ---
    const forwardHeaders = { ...req.headers };

    // Remove hop-by-hop & Vercel internal headers that shouldn't be forwarded
    [
      "content-length",
      "x-vercel-proxy-signature",
      "x-forwarded-for",
      "x-forwarded-host",
      "x-forwarded-port",
      "x-forwarded-proto",
      "connection",
      "upgrade",
    ].forEach((h) => delete forwardHeaders[h]);

    // Ensure Host header matches the MAGENTO_HOST's host (important for virtualhosts/base-url)
    try {
      const magentoHostOnly = new URL(MAGENTO_HOST).host; // host:port if any
      forwardHeaders["host"] = magentoHostOnly;
    } catch (e) {
      // if URL parsing fails, do nothing (leave existing host)
    }

    // --- FORWARD REQUEST TO MAGENTO ---
    const upstream = await fetch(target, {
      method: req.method,
      headers: forwardHeaders,
      body: body && body.length ? body : undefined,
    });

    // Mirror selected upstream headers back to client (avoid hop-by-hop)
    upstream.headers.forEach((value, key) => {
      if (!["connection", "transfer-encoding", "content-encoding"].includes(key.toLowerCase())) {
        res.setHeader(key, value);
      }
    });

    const arrayBuffer = await upstream.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    res.status(upstream.status).send(buffer);
  } catch (error) {
    console.error("Proxy Error:", error);
    res.status(502).json({ error: "Proxy failed", detail: String(error) });
  }
}
