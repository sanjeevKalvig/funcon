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
    const fwdPath = req.url.startsWith(prefix)
      ? req.url.slice(prefix.length)
      : req.url;

    const target = MAGENTO_HOST.replace(/\/$/, "") + fwdPath;

    // --- READ BODY (for POST/PUT/PATCH/DELETE) ---
    let body = null;
    if (req.method !== "GET" && req.method !== "HEAD") {
      // Vercel provides body as raw buffer in req
      body = await new Promise((resolve) => {
        let data = [];
        req.on("data", (chunk) => data.push(chunk));
        req.on("end", () => resolve(Buffer.concat(data)));
      });
    }

    // --- CLEAN HEADERS BEFORE FORWARD ---
    const forwardHeaders = { ...req.headers };
    delete forwardHeaders.host;
    delete forwardHeaders["content-length"];
    delete forwardHeaders["x-vercel-proxy-signature"];
    delete forwardHeaders["x-forwarded-for"];
    delete forwardHeaders["x-forwarded-host"];
    delete forwardHeaders["x-forwarded-port"];
    delete forwardHeaders["x-forwarded-proto"];

    const upstream = await fetch(target, {
      method: req.method,
      headers: forwardHeaders,
      body,
    });

    // Copy upstream headers (safely)
    upstream.headers.forEach((value, key) => {
      if (!["connection", "transfer-encoding"].includes(key.toLowerCase())) {
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
